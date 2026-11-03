from sqlalchemy import Integer, String, Column, DateTime, create_engine
from sqlalchemy.orm import Session, declarative_base
from datetime import datetime
from fastapi import HTTPException

DB_PATH = "textbook.db"
engine = create_engine(f"sqlite:///{DB_PATH}")
Base = declarative_base()


class Listing(Base):
    __tablename__ = "listings"  
    id = Column(Integer, primary_key=True)
    seller_roll = Column(String)
    title = Column(String)
    subject = Column(String)
    condition = Column(String)
    price = Column(Integer)
    listed_on = Column(DateTime, default=datetime.now())
    status = Column(String)


class Offer(Base):
    __tablename__ = "offers"
    id = Column(Integer, primary_key=True)
    listing_id = Column(Integer)
    buyer_roll = Column(String)
    offer_price = Column(Integer)
    status = Column(String)
    offered_on = Column(DateTime, default=datetime.now())


Base.metadata.create_all(engine)


# E5: Remove listing
def remove_listing(id, seller_roll):
    if not seller_roll:
        raise HTTPException(status_code=422, detail="Seller roll is required.")

    session = Session(engine)
    listing = session.get(Listing, id)
    if listing is None:
        session.close()
        raise HTTPException(status_code=404, detail="Listing not found.")




    if listing.seller_roll != seller_roll:
        session.close()
        raise HTTPException(status_code=403, detail="You're not allowed to do this.")

    if listing.status != "available":
        session.close()
        raise HTTPException(status_code=400, detail="Cannot remove a listing that is not available.")

    # Remove any offers for this listing
    offers = session.query(Offer).filter(Offer.listing_id == id).all()
    for offer in offers:
        session.delete(offer)

    session.delete(listing)
    session.commit()
    session.close()
    return {"message": "Listing removed successfully"}


# E6: Make an offer
def make_offer(listing_id, buyer_roll, offer_price):
    if not buyer_roll:
        raise HTTPException(status_code=422, detail="Buyer roll is required.")

    if offer_price is None:
        raise HTTPException(status_code=422, detail="Offer price is required.")

    try:
        offer_price = int(offer_price)
    except (ValueError, TypeError):
        raise HTTPException(status_code=422, detail="Offer price must be a valid number.")

    if offer_price < 1:
        raise HTTPException(status_code=422, detail="An offer price must be between 1 and the asking price.")

    session = Session(engine)
    listing = session.get(Listing, listing_id)
    if listing is None:
        session.close()
        raise HTTPException(status_code=404, detail="Listing not found.")

    if offer_price > listing.price:
        session.close()
        raise HTTPException(status_code=422, detail="An offer price must be between 1 and the asking price.")

    if listing.seller_roll == buyer_roll:
        session.close()
        raise HTTPException(status_code=400, detail="You can't make an offer on your own book.")

    if listing.status != "available":
        session.close()
        raise HTTPException(status_code=400, detail="Listing is not available.")

    existing_offer = session.query(Offer).filter(
        Offer.listing_id == listing_id,
        Offer.buyer_roll == buyer_roll,
        Offer.status == "pending"
    ).first()
    if existing_offer:
        session.close()
        raise HTTPException(status_code=400, detail="You already have a pending offer on this listing.")

    offer = Offer(
        listing_id=listing_id,
        buyer_roll=buyer_roll,
        offer_price=offer_price,
        status="pending",
        offered_on=datetime.now()
    )
    session.add(offer)
    session.commit()

    response = {
        "id": offer.id,
        "listing_id": offer.listing_id,
        "buyer_roll": offer.buyer_roll,
        "offer_price": offer.offer_price,
        "status": offer.status,
        "offered_on": offer.offered_on
    }
    session.close()
    return response


# E7: Accept or decline offer
def accept_or_decline_offer(id, seller_roll, action):
    if not seller_roll:
        raise HTTPException(status_code=422, detail="Seller roll is required.")

    if not action:
        raise HTTPException(status_code=422, detail="Action is required.")

    action_lower = str(action).lower().strip()
    if action_lower not in ["accept", "accepted", "decline", "declined"]:
        raise HTTPException(status_code=422, detail="Action must be 'accept' or 'decline'.")

    session = Session(engine)
    offer = session.get(Offer, id)
    if offer is None:
        session.close()
        raise HTTPException(status_code=404, detail="Offer not found.")

    listing = session.get(Listing, offer.listing_id)
    if listing is None:
        session.close()
        raise HTTPException(status_code=404, detail="Listing not found.")

    if listing.seller_roll != seller_roll:
        session.close()
        raise HTTPException(status_code=403, detail="You're not allowed to do this.")

    if offer.status != "pending":
        session.close()
        raise HTTPException(status_code=400, detail="Offer is not pending.")

    if action_lower in ["accept", "accepted"]:
        if listing.status != "available":
            session.close()
            raise HTTPException(status_code=400, detail="Listing is not available.")

        offer.status = "accepted"
        listing.status = "reserved"

        other_offers = session.query(Offer).filter(
            Offer.listing_id == listing.id,
            Offer.id != offer.id,
            Offer.status == "pending"
        ).all()
        for other in other_offers:
            other.status = "declined"
    else:
        offer.status = "declined"

    session.commit()

    response = {
        "id": offer.id,
        "listing_id": offer.listing_id,
        "buyer_roll": offer.buyer_roll,
        "offer_price": offer.offer_price,
        "status": offer.status,
        "offered_on": offer.offered_on
    }
    session.close()
    return response

