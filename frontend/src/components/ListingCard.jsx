import { useState } from "react";

function ListingCard({ listing, apiUrl, onOfferSuccess }) {
  const [buyerRoll, setBuyerRoll] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [message, setMessage] = useState("");

  // Aryan's E6: Make an offer
  function handleMakeOffer(e) {
    e.preventDefault();
    setMessage("");

    fetch(`${apiUrl}/offers?listing_id=${listing.id}&buyer_roll=${buyerRoll}&offer_price=${offerPrice}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          setMessage(data.detail);
        } else {
          setMessage("Offer made successfully!");
          setBuyerRoll("");
          setOfferPrice("");
          if (onOfferSuccess) {
            onOfferSuccess();
          }
        }
      });
  }

  return (
    <li className="product" style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px", listStyle: "none" }}>
      <h2>{listing.title}</h2>
      <p><strong>Subject:</strong> {listing.subject}</p>
      <p><strong>Condition:</strong> {listing.condition}</p>
      <p><strong>Price:</strong> ₹{listing.price}</p>
      <p><strong>Seller:</strong> {listing.seller_roll}</p>

      {/* Aryan's E6: Make Offer Form */}
      <form onSubmit={handleMakeOffer} style={{ marginTop: "10px" }}>
        <h4>Make an Offer</h4>
        <input
          type="text"
          placeholder="Buyer Roll No"
          value={buyerRoll}
          onChange={(e) => setBuyerRoll(e.target.value)}
          required
        />
        {" "}
        <input
          type="number"
          placeholder="Offer Price"
          value={offerPrice}
          onChange={(e) => setOfferPrice(e.target.value)}
          required
        />
        {" "}
        <button type="submit">Make Offer</button>
      </form>

      {message && <p style={{ color: message.includes("successfully") ? "green" : "red" }}>{message}</p>}
    </li>
  );
}

export default ListingCard;
