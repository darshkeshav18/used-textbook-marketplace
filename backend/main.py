from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import functions

app = FastAPI(
    title = "Used Textbook Marketplace API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# E1 gets available listings
@app.get("/listings")
def browse_listings(subject=None, condition=None, max_price: int=None):
    if subject is not None and subject not in functions.subjects:
        raise HTTPException(status_code=422, detail="Invalid subject")
    if condition is not None and condition not in functions.conditions:
        raise HTTPException(status_code=422, detail="Invalid condition")
    return functions.get_listings(subject=subject, condition=condition, max_price=max_price)

# E2 gets one listing with its offers
@app.get("/listings/{listing_id}")
def view_listing(listing_id: int):
    listing = functions.get_listing(listing_id=listing_id)
    if listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing

# E3 lists a book
@app.post("/listings")
def create_listing(seller_roll=None, title=None, subject=None, condition=None, price: int=None):
    if not seller_roll or not title or not subject or not condition or price is None:
        raise HTTPException(status_code=422, detail="Missing feild")
    if subject not in functions.subjects:
        raise HTTPException(status_code=422, detail="Invalid subject")
    if condition not in functions.conditions:
        raise HTTPException(status_code=422, detail="Invalid condition")
    if price < 10 or price > 2000:
        raise HTTPException(status_code=422, detail="Price must be between 10 and 2000")
    return functions.add_listing(seller_roll=seller_roll, title=title, subject=subject, condition=condition, price=price)

# E4 changes a listing's price
@app.patch("/listings/{listing_id}/price")
def change_price(listing_id: int, seller_roll=None, price: int=None):
    listing = functions.get_listing(listing_id=listing_id)
    if listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing["seller_roll"] != seller_roll:
        raise HTTPException(status_code=403, detail="Only seller can change the price")
    if listing["status"] != "available":
        raise HTTPException(status_code=400, detail="You can only change the price of an available book")
    if price is None or price < 10 or price > 2000:
        raise HTTPException(status_code=422, detail="Price must be between 10 and 2000")
    return functions.update_price(listing_id=listing_id, new_price=price)


# E5 yeets the listing out of existence so juniors stop dm'ing the seller
@app.delete("/listings/{listing_id}")
def remove_listing(listing_id: int, seller_roll: str = None):
    if not seller_roll:
        raise HTTPException(status_code=422, detail="Seller roll is required")
    listing = functions.get_listing(listing_id=listing_id)
    if listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing["seller_roll"] != seller_roll:
        raise HTTPException(status_code=403, detail="You're not allowed to do this")
    if listing["status"] != "available":
        raise HTTPException(status_code=400, detail="Cannot remove a listing that is not available")
    return functions.delete_listing(listing_id=listing_id)


# E6 broke junior attempts to bargain for their degree
@app.post("/offers")
def make_offer(listing_id: int = None, buyer_roll: str = None, offer_price: int = None):
    if not listing_id or not buyer_roll or offer_price is None:
        raise HTTPException(status_code=422, detail="Missing required field")
    listing = functions.get_listing(listing_id=listing_id)
    if listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    if offer_price < 1 or offer_price > listing["price"]:
        raise HTTPException(status_code=422, detail="An offer price must be between 1 and the asking price")
    if listing["seller_roll"] == buyer_roll:
        raise HTTPException(status_code=400, detail="You can't make an offer on your own book")
    if listing["status"] != "available":
        raise HTTPException(status_code=400, detail="Listing is not available")
    if functions.has_pending_offer(listing_id=listing_id, buyer_roll=buyer_roll):
        raise HTTPException(status_code=400, detail="You already have a pending offer on this listing")
    return functions.add_offer(listing_id=listing_id, buyer_roll=buyer_roll, offer_price=offer_price)


# E7 seller either secures the bag or tells the junior to touch grass
@app.patch("/offers/{offer_id}")
def decide_offer(offer_id: int, seller_roll: str = None, action: str = None, status: str = None):
    act = action if action is not None else status
    if not seller_roll:
        raise HTTPException(status_code=422, detail="Seller roll is required")
    if not act:
        raise HTTPException(status_code=422, detail="Action is required")

    act_lower = str(act).lower().strip()
    if act_lower not in ["accept", "accepted", "decline", "declined"]:
        raise HTTPException(status_code=422, detail="Action must be 'accept' or 'decline'")

    offer = functions.get_offer(offer_id=offer_id)
    if offer is None:
        raise HTTPException(status_code=404, detail="Offer not found")

    listing = functions.get_listing(listing_id=offer["listing_id"])
    if listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")

    if listing["seller_roll"] != seller_roll:
        raise HTTPException(status_code=403, detail="You're not allowed to do this")

    if offer["status"] != "pending":
        raise HTTPException(status_code=400, detail="Offer is not pending")

    if act_lower in ["accept", "accepted"] and listing["status"] != "available":
        raise HTTPException(status_code=400, detail="Listing is not available")

    return functions.update_offer_status(offer_id=offer_id, action=act_lower)


# E8 marks a listing sold
@app.patch("/listings/{listing_id}/sold")
def mark_listing_sold(listing_id: int, seller_roll=None):
    listing = functions.get_listing(listing_id=listing_id)
    if listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    if not seller_roll:
        raise HTTPException(status_code=422, detail="Missing seller roll number")
    if listing["seller_roll"] != seller_roll:
        raise HTTPException(status_code=403, detail="Only seller can mark the book sold")
    if listing["status"] != "reserved":
        raise HTTPException(status_code=400, detail="Only a reserved book can be marked sold")
    return functions.mark_sold(listing_id=listing_id)


# E9 gets one student's listings with their number of pending offers
@app.get("/students/{roll_no}/listings")
def student_listings(roll_no: str):
    return functions.get_student_listings(roll_no=roll_no)


# E10 gets one student's offers with the book's title and asking price
@app.get("/students/{roll_no}/offers")
def student_offers(roll_no: str):
    return functions.get_student_offers(roll_no=roll_no)


