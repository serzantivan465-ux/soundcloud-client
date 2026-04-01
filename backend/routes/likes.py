from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import User, Like
from schemas import LikeAdd, LikeResponse
from routes.auth import get_current_user

router = APIRouter()


@router.get("/likes", response_model=list[LikeResponse])
def get_likes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    likes = db.query(Like).filter(Like.user_id == current_user.id).order_by(Like.created_at.desc()).all()
    return likes


@router.post("/likes", response_model=LikeResponse)
def add_like(
    like_data: LikeAdd,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = db.query(Like).filter(
        Like.user_id == current_user.id,
        Like.sc_track_id == like_data.sc_track_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already liked")

    like = Like(
        user_id=current_user.id,
        sc_track_id=like_data.sc_track_id,
        title=like_data.title,
        artwork_url=like_data.artwork_url,
        duration=like_data.duration,
    )
    db.add(like)
    db.commit()
    db.refresh(like)
    return like


@router.delete("/likes/{sc_track_id}")
def remove_like(
    sc_track_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    like = db.query(Like).filter(
        Like.user_id == current_user.id,
        Like.sc_track_id == sc_track_id,
    ).first()
    if not like:
        raise HTTPException(status_code=404, detail="Like not found")

    db.delete(like)
    db.commit()
    return {"message": "Like removed"}
