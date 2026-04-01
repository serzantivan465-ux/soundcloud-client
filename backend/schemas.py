from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


class PlaylistCreate(BaseModel):
    name: str


class PlaylistTrackAdd(BaseModel):
    sc_track_id: int
    title: str
    artwork_url: Optional[str] = None
    duration: Optional[int] = None


class PlaylistResponse(BaseModel):
    id: int
    name: str
    created_at: datetime

    class Config:
        from_attributes = True


class PlaylistDetailResponse(PlaylistResponse):
    tracks_count: int


class LikeAdd(BaseModel):
    sc_track_id: int
    title: str
    artwork_url: Optional[str] = None
    duration: int


class LikeResponse(BaseModel):
    id: int
    sc_track_id: int
    title: str
    artwork_url: Optional[str]
    duration: int
    created_at: datetime

    class Config:
        from_attributes = True
