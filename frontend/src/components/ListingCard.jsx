// all the stuff about the book will go on a card

import { useState } from "react";

function ListingCard({ listing, makeOffer }) {
  const [buyerRoll, setBuyerRoll] = useState("");
  const [offerPrice, setOfferPrice] = useState("");

  return (
    <div className="listing-card">
      <div className="listing-header">
        <h3>{listing.title}</h3>
        <span className="price-tag">₹{listing.price}</span>
      </div>
      <p className="listing-meta">
        <span className="badge badge-subject">{listing.subject}</span>
        <span className="badge badge-condition">{listing.condition}</span>
        <span className="seller-info">Seller: {listing.seller_roll}</span>
      </p>

      <div className="offer-form">
        <input placeholder="Your roll number" value={buyerRoll} onChange={(e) => setBuyerRoll(e.target.value)} />
        <input placeholder="Offer price" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} />
        <button onClick={() => makeOffer(listing.id, buyerRoll, offerPrice)}>Make offer</button>
      </div>
    </div>
  );
}

export default ListingCard;
