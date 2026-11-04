import { useState } from "react";

function ListingCard({ listing, makeOffer }) {
  const [buyerRoll, setBuyerRoll] = useState("");
  const [offerPrice, setOfferPrice] = useState("");

  return (
    <li className="product">
      <h2>{listing.title}</h2>
      <p>₹{listing.price}</p>
      <p>Subject: {listing.subject}</p>
      <p>Condition: {listing.condition}</p>
      <p>Seller: {listing.seller_roll}</p>

      <h3>Make offer</h3>
      <input placeholder="Your roll number" value={buyerRoll} onChange={(e) => setBuyerRoll(e.target.value)} />
      <input placeholder="Offer price" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} />
      <button onClick={() => makeOffer(listing.id, buyerRoll, offerPrice)}>Make offer</button>
    </li>
  );
}

export default ListingCard;
