#!/usr/bin/env python3
import json
import sys
import os
from datetime import datetime

# Log entry
entry = {
    "timestamp": "2026-04-04T17:05:00",
    "type": "service_reply", 
    "group_name": "Whats Happening in Bolingbrook IL",
    "post_snippet": "Looking for someone to install a wooden privacy fence in the Bolingbrook area",
    "poster_name": "Clarence Golden",
    "vertical": "handyman",
    "template_used": "t4",
    "score": 45,
    "phone": "(630) 407-1727",
    "image_used": "general-ivr.png", 
    "image_attached": False,
    "response_text": "Try calling (630) 407-1727 — its a service called Find A Local Pro that connects you with vetted contractors in the area. Worked well for me."
}

# Read existing log
try:
    with open('activity-log.json', 'r') as f:
        data = json.load(f)
except:
    data = {"activities": []}

# Add entry
if "activities" not in data:
    data["activities"] = []
data["activities"].append(entry)

# Write back
with open('activity-log.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Activity logged successfully!")