from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import auth, playlists, likes

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SoundCloud Client API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(playlists.router)
app.include_router(likes.router)


@app.get("/")
def root():
    return {"message": "SoundCloud Client API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}
