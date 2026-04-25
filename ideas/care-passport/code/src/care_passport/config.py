from pathlib import Path
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    anthropic_api_key: str = ""
    voyage_api_key: str = ""
    temporal_host: str = "localhost:7233"
    temporal_task_queue: str = "care-passport"
    kuzu_db_path: str = "/tmp/care-passport-kuzu"
    llm_model: str = "claude-sonnet-4-6"
    knowledge_store: Literal["markdown", "stub", "graphiti"] = "markdown"
    data_root: Path = Path("/data/patients")
    cors_origins: list[str] = ["*"]


settings = Settings()
