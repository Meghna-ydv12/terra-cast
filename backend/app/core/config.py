import os
from pathlib import Path

env_path = Path(__file__).parent.parent.parent / ".env"

if env_path.exists():
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip() and not line.startswith("#") and "=" in line:
                key, val = line.strip().split("=", 1)
                os.environ[key] = val.strip('"').strip("'")

class Settings:
    PROJECT_NAME = "TerraCast AI Engine"
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

    BASE_DIR = Path(__file__).resolve().parents[2]

    MODELS_DIR = os.getenv(
        "MODELS_DIR",
        str(BASE_DIR / "models")
    )

settings = Settings()
