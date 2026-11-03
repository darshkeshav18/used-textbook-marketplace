from sqlalchemy import Integer, String, Column, DateTime, create_engine
from sqlalchemy.orm import Session, declarative_base
from datetime import datetime

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