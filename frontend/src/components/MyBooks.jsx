import { useState } from "react";

function MyBooks({ apiUrl, onActionDone }) {
  const [rollNo, setRollNo] = useState("");
  const [listings, setListings] = useState([]);
  const [offers, setOffers] = useState([]);
  const [selectedListingOffers, setSelectedListingOffers] = useState([]);
  const [message, setMessage] = useState("");

  // Darsh's E9 & E10: Fetch student's listings and offers
  function loadStudentData() {
    if (!rollNo) return;
    setMessage("");

    fetch(`${apiUrl}/students/${rollNo}/listings`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setListings(data);
        }
      });

    fetch(`${apiUrl}/students/${rollNo}/offers`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOffers(data);
        }
      });
  }

  // Samhita's E2: Click one listing to view its offers
  function viewOffers(listingId) {
    fetch(`${apiUrl}/listings/${listingId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.offers) {
          setSelectedListingOffers(data.offers);
        }
      });
  }

  // Aryan's E5: Remove listing
  function handleRemoveListing(listingId) {
    setMessage("");
    fetch(`${apiUrl}/listings/${listingId}?seller_roll=${rollNo}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.detail) {
          setMessage(data.detail);
        } else {
          setMessage("Listing removed successfully!");
          loadStudentData();
          if (onActionDone) onActionDone();
        }
      });
  }

  // Aryan's E7: Accept or decline offer
  function handleDecideOffer(offerId, action) {
    setMessage("");
    fetch(`${apiUrl}/offers/${offerId}?seller_roll=${rollNo}&action=${action}`, {
      method: "PATCH",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.detail) {
          setMessage(data.detail);
        } else {
          setMessage(`Offer ${action}ed successfully!`);
          loadStudentData();
          setSelectedListingOffers([]);
          if (onActionDone) onActionDone();
        }
      });
  }

  return (
    <div>
      <h2>My Books & Offers</h2>
      <div>
        <input
          type="text"
          placeholder="Enter your Roll Number"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
        />
        {" "}
        <button onClick={loadStudentData}>Show</button>
      </div>

      {message && <p style={{ color: message.includes("successfully") ? "green" : "red" }}>{message}</p>}

      {listings.length > 0 && (
        <div>
          <h3>My Listings</h3>
          <ul>
            {listings.map((item) => (
              <li key={item.id} style={{ margin: "10px 0" }}>
                <strong>{item.title}</strong> — ₹{item.price} ({item.status}) | Pending offers: {item.pending_offers}
                {" "}
                <button onClick={() => viewOffers(item.id)}>View Offers</button>
                {" "}
                {/* Aryan's E5: Remove listing */}
                <button onClick={() => handleRemoveListing(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedListingOffers.length > 0 && (
        <div style={{ background: "#f9f9f9", padding: "10px", margin: "10px 0" }}>
          <h4>Offers on Selected Book:</h4>
          <ul>
            {selectedListingOffers.map((offer) => (
              <li key={offer.id} style={{ margin: "6px 0" }}>
                Buyer: {offer.buyer_roll} | Offer: ₹{offer.offer_price} | Status: {offer.status}
                {" "}
                {/* Aryan's E7: Accept or Decline offer */}
                {offer.status === "pending" && (
                  <>
                    <button onClick={() => handleDecideOffer(offer.id, "accept")}>Accept</button>
                    {" "}
                    <button onClick={() => handleDecideOffer(offer.id, "decline")}>Decline</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {offers.length > 0 && (
        <div>
          <h3>My Offers Made</h3>
          <ul>
            {offers.map((offer) => (
              <li key={offer.id} style={{ margin: "6px 0" }}>
                Book: {offer.title} | Asking: ₹{offer.price} | My Offer: ₹{offer.offer_price} | Status: {offer.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MyBooks;
