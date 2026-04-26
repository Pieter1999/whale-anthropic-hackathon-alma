"""Top-level pytest config — sets required env vars before any module imports."""

import os

os.environ.setdefault("API_AUTH_TOKEN", "test-token-for-pytest")
os.environ.setdefault("ANTHROPIC_API_KEY", "sk-ant-test")
