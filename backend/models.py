from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    playlists = relationship("Playlist", back_populates="user", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="user", cascade="all, delete-orphan")


class Playlist(Base):
    __tablename__ = "playlists"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="playlists")
    tracks = relationship("PlaylistTrack", back_populates="playlist", cascade="all, delete-orphan")


class PlaylistTrack(Base):
    __tablename__ = "playlist_tracks"

    id = Column(Integer, primary_key=True, index=True)
    playlist_id = Column(Integer, ForeignKey("playlists.id"), nullable=False)
    sc_track_id = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    artwork_url = Column(String(500), nullable=True)
    duration = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    playlist = relationship("Playlist", back_populates="tracks")


class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    sc_track_id = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    artwork_url = Column(String(500), nullable=True)
    duration = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="likes")
