from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import functions

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Used Textbook Marketplace API", "docs": "/docs"}


# E5: Remove listing
@app.delete("/listings/{listing_id}")
def remove_listing(listing_id: int, seller_roll: str):
    return functions.remove_listing(id=listing_id, seller_roll=seller_roll)


# E6: Make an offer
@app.post("/offers")
def make_offer(listing_id: int, buyer_roll: str, offer_price: int):
    return functions.make_offer(listing_id=listing_id, buyer_roll=buyer_roll, offer_price=offer_price)


# E7: Accept or decline offer
@app.patch("/offers/{offer_id}")
def decide_offer(offer_id: int, seller_roll: str, action: str = None, status: str = None):
    selected_action = action if action is not None else status
    return functions.accept_or_decline_offer(id=offer_id, seller_roll=seller_roll, action=selected_action)
