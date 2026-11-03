from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, create_engine
from sqlalchemy.orm import declarative_base

DB_PATH = "textbook.db"
engine = create_engine(
    f"sqlite:///{DB_PATH}"
)
Base = declarative_base()


class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    seller_roll = Column(String, nullable=False)
    title = Column(String, nullable=False)
    subject = Column(String, nullable=False)       
    condition = Column(String, nullable=False)     
    price = Column(Integer, nullable=False)
    listed_on = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    status = Column(String, default="available")   


class Offer(Base):
    __tablename__ = "offers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False)
    buyer_roll = Column(String, nullable=False)
    offer_price = Column(Integer, nullable=False)
    status = Column(String, default="pending")     
    offered_on = Column(DateTime, default=lambda: datetime.now(timezone.utc))


Base.metadata.create_all(engine)