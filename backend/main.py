from fastapi import FastAPI, HTTPException
import functions

app = FastAPI(
    title = "Used Textbook Marketplace API"
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