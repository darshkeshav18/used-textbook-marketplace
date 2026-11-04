// all the stuff about the book will go on a card

import { useState } from "react";

function ListingCard({ listing, makeOffer }) {
  const [buyerRoll, setBuyerRoll] = useState("");
  const [offerPrice, setOfferPrice] = useState("");

  return (
    <div>
      <hr />
      <h3>{listing.title}</h3>
      <p>Subject: {listing.subject} | Condition: {listing.condition}</p>
      <p>Price: {listing.price}</p>
      <p>Seller: {listing.seller_roll}</p>

      <input placeholder="Your roll number" value={buyerRoll} onChange={(e) => setBuyerRoll(e.target.value)} />
      <input placeholder="Offer price" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} />
      <button onClick={() => makeOffer(listing.id, buyerRoll, offerPrice)}>Make offer</button>
    </div>
  );
}

export default ListingCard;