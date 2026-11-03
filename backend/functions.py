from sqlalchemy import Integer, String, Column, DateTime, create_engine
from sqlalchemy.orm import Session, declarative_base
from datetime import datetime

DB_PATH = "textbook.db"
engine = create_engine(f"sqlite:///{DB_PATH}")
Base = declarative_base()

subjects = ["comp sci", "econ", "eng", "math", "bio"]
conditions = ["new", "used", "old"]

class Listing(Base):
    __tablename__ = "listings"  
    id = Column(Integer, primary_key=True)
    seller_roll = Column(String)
    title = Column(String)
    subject = Column(String)
    condition = Column(String)
    price = Column(Integer)
    listed_on = Column(DateTime, default=datetime.now)
    status = Column(String)


class Offer(Base):
    __tablename__ = "offers"
    id = Column(Integer, primary_key=True)
    listing_id = Column(Integer)
    buyer_roll = Column(String)
    offer_price = Column(Integer)
    status = Column(String)
    offered_on = Column(DateTime, default=datetime.now)


Base.metadata.create_all(engine)

def convert_dict(listing):
    return {
        "id": listing.id,
        "seller_roll": listing.seller_roll,
        "title": listing.title,
        "subject": listing.subject,
        "condition": listing.condition,
        "price": listing.price,
        "listed_on": listing.listed_on,
        "status": listing.status,
    }


# E1 gets available listings
def get_listings(subject=None, condition=None, max_price=None):
    session = Session(engine)
    query = session.query(Listing).filter(Listing.status == "available")
    if subject is not None:
        query = query.filter(Listing.subject == subject)
    if condition is not None:
        query = query.filter(Listing.condition == condition)
    if max_price is not None:
        query = query.filter(Listing.price <= max_price)

    result = []
    for listing in query.all():
        result.append(convert_dict(listing))
    session.close()
    return result


# E2 gets one listing based on id
def get_listing(listing_id):
    session = Session(engine)
    listing = session.get(Listing, listing_id)
    if listing is None:
        session.close()
        return None

    data = convert_dict(listing)
    data["offers"] = []
    for offer in session.query(Offer).filter(Offer.listing_id == listing_id).all():
        data["offers"].append({
            "id": offer.id,
            "buyer_roll": offer.buyer_roll,
            "offer_price": offer.offer_price,
            "status": offer.status,
            "offered_on": offer.offered_on,
        })
    session.close()
    return data


# E3 list a book 
def add_listing(seller_roll, title, subject, condition, price):
    session = Session(engine)
    listing = Listing(
        seller_roll=seller_roll,
        title=title,
        subject=subject,
        condition=condition,
        price=price,
        status="available"
    )
    session.add(listing)
    session.commit()
    data = convert_dict(listing)
    session.close()
    return data


# E4 change a listings price
def update_price(listing_id, new_price):
    session = Session(engine)
    listing = session.get(Listing, listing_id)
    if listing is None:
        session.close()
        return None
    listing.price = new_price
    session.commit()
    data = convert_dict(listing)
    session.close()
    return data