import logging

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from patients import get_patients

load_dotenv(dotenv_path="../../.env")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Alma voice server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/patients")
async def patients():
    """Returns the patient list for the session selection screen."""
    return await get_patients()


@app.post("/webhook")
async def vapi_webhook(body: dict):
    """
    Vapi event sink — handles end-of-call reports and status updates.
    The KB query tool is handled entirely inside Vapi; no function-call
    routing is needed here.
    """
    message = body.get("message", {})
    logger.info("Vapi event: %s", message.get("type"))
    return JSONResponse({"status": "received"})
