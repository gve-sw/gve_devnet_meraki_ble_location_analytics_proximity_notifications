from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import PlainTextResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from meraki import DashboardAPI
from dotenv import load_dotenv
import os
import logging
import json
import asyncio

# Load environment variables
load_dotenv()
MERAKI_API_KEY = os.getenv("MERAKI_API_KEY")
MERAKI_NETWORK_ID = os.getenv("MERAKI_NETWORK_ID")
MERAKI_VALIDATOR = os.getenv("MERAKI_VALIDATOR")
MERAKI_SECRET = os.getenv("MERAKI_SECRET")

# Configure logging
logging.basicConfig(level=logging.INFO)

# Create FastAPI app instance
app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data storage
data_storage = {}
beacon_data = {}

async def fetch_beacon_data():
    dashboard = DashboardAPI(api_key=MERAKI_API_KEY)
    devices = dashboard.networks.getNetworkDevices(MERAKI_NETWORK_ID)

    for device in devices:
        if "beaconIdParams" in device:
            beacon_params = device["beaconIdParams"]
            beacon_data[device["mac"]] = {
                "uuid": beacon_params["uuid"],
                "major": beacon_params["major"],
                "minor": beacon_params["minor"]
            }

@app.on_event("startup")
async def startup_event():
    await fetch_beacon_data()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/meraki/scanning")
async def get_meraki_scanning():
    logging.info('sent validator: ' + MERAKI_VALIDATOR)
    return PlainTextResponse(MERAKI_VALIDATOR)

@app.post("/meraki/scanning")
async def post_meraki_scanning(request: Request):
    data = await request.json()

    if data.get("secret") != MERAKI_SECRET:
        raise HTTPException(status_code=401, detail="Invalid secret")

    if data.get("version") != "3.0" or data.get("type") != "Bluetooth":
        raise HTTPException(status_code=400, detail="Unsupported API version or radio type")

    observations = data.get("data", {}).get("observations", [])
    logging.info("Received observations: " + json.dumps(observations, indent=4))

    process_meraki_data(data)

    return {"message": "Data processed successfully"}

def parse_raw_data(raw_data):
    # Placeholder for parsing logic
    # Implement parsing based on your rawData format
    return {
        "uuid": "extracted_uuid",  # Replace with actual parsing logic
        "major": "extracted_major",  # Replace with actual parsing logic
        "minor": "extracted_minor"   # Replace with actual parsing logic
    }

def process_meraki_data(data):
    observations = data.get("data", {}).get("observations", [])

    for observation in observations:
        client_mac = observation.get("clientMac")
        latest_record = observation.get("latestRecord", {})
        nearest_ap_mac = latest_record.get("nearestApMac")
        nearest_ap_rssi = latest_record.get("nearestApRssi")

        # Update this line to set default values to "0" or appropriate values
        beacon_info = beacon_data.get(nearest_ap_mac, {"uuid": "0", "major": "0", "minor": "0"})

        device_info = {
            "client_mac": client_mac,
            "uuid": beacon_info.get("uuid"),
            "major": beacon_info.get("major"),
            "minor": beacon_info.get("minor"),
            "rssi": nearest_ap_rssi,
            "name": observation.get("name"),
            "nearest_ap_mac": nearest_ap_mac,
            "nearest_ap_rssi": nearest_ap_rssi
        }
        data_storage[client_mac] = device_info


async def event_generator():
    while True:
        if data_storage:
            yield f"data: {json.dumps(list(data_storage.values()))}\n\n"
        await asyncio.sleep(1)

@app.get("/events")
async def get_events():
    return StreamingResponse(event_generator(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
