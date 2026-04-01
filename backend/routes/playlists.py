from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models import User, Playlist, PlaylistTrack
from schemas import PlaylistCreate, PlaylistResponse, PlaylistDetailResponse, PlaylistTrackAdd
from routes.auth import get_current_user

router = APIRouter()


@router.get("/playlists", response_model=list[PlaylistDetailResponse])
def get_playlists(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    playlists = db.query(Playlist).filter(Playlist.user_id == current_user.id).all()
    result = []
    for p in playlists:
        tracks_count = db.query(func.count(PlaylistTrack.id)).filter(
            PlaylistTrack.playlist_id == p.id
        ).scalar()
        result.append(PlaylistDetailResponse(
            id=p.id,
            name=p.name,
            created_at=p.created_at,
            tracks_count=tracks_count or 0,
        ))
    return result


@router.post("/playlists", response_model=PlaylistResponse)
def create_playlist(
    data: PlaylistCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    playlist = Playlist(name=data.name, user_id=current_user.id)
    db.add(playlist)
    db.commit()
    db.refresh(playlist)
    return playlist


@router.delete("/playlists/{playlist_id}")
def delete_playlist(
    playlist_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    playlist = db.query(Playlist).filter(
        Playlist.id == playlist_id,
        Playlist.user_id == current_user.id,
    ).first()
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")
    db.delete(playlist)
    db.commit()
    return {"message": "Deleted"}


@router.post("/playlists/{playlist_id}/tracks")
def add_track_to_playlist(
    playlist_id: int,
    track_data: PlaylistTrackAdd,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    playlist = db.query(Playlist).filter(
        Playlist.id == playlist_id,
        Playlist.user_id == current_user.id,
    ).first()
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")

    existing = db.query(PlaylistTrack).filter(
        PlaylistTrack.playlist_id == playlist_id,
        PlaylistTrack.sc_track_id == track_data.sc_track_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Track already in playlist")

    pt = PlaylistTrack(
        playlist_id=playlist_id,
        sc_track_id=track_data.sc_track_id,
        title=track_data.title,
        artwork_url=track_data.artwork_url,
        duration=track_data.duration,
    )
    db.add(pt)
    db.commit()
    return {"message": "Track added"}


@router.delete("/playlists/{playlist_id}/tracks/{sc_track_id}")
def remove_track_from_playlist(
    playlist_id: int,
    sc_track_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    playlist = db.query(Playlist).filter(
        Playlist.id == playlist_id,
        Playlist.user_id == current_user.id,
    ).first()
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")

    pt = db.query(PlaylistTrack).filter(
        PlaylistTrack.playlist_id == playlist_id,
        PlaylistTrack.sc_track_id == sc_track_id,
    ).first()
    if not pt:
        raise HTTPException(status_code=404, detail="Track not found in playlist")

    db.delete(pt)
    db.commit()
    return {"message": "Track removed"}
