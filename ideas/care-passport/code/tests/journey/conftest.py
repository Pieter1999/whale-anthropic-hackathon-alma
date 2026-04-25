"""Pytest config for the journey suite.

Every test in this directory is auto-marked `journey` so it can be opted into
or out of via `-m journey` / `-m "not journey"`. The suite assumes a live
`make up` stack on http://localhost:8000 — see tests/journey/README.md.
"""

from __future__ import annotations

import socket

import pytest


def pytest_collection_modifyitems(config, items):
    journey_root = str(config.rootpath / "tests" / "journey")
    for item in items:
        if str(item.fspath).startswith(journey_root):
            item.add_marker(pytest.mark.journey)


def _api_reachable(host: str = "localhost", port: int = 8000, timeout: float = 0.5) -> bool:
    try:
        with socket.create_connection((host, port), timeout=timeout):
            return True
    except OSError:
        return False


@pytest.fixture(scope="session", autouse=True)
def _require_live_stack():
    if not _api_reachable():
        pytest.skip(
            "journey suite requires a live stack on http://localhost:8000 — "
            "run `make up` first (see tests/journey/README.md)",
            allow_module_level=True,
        )
