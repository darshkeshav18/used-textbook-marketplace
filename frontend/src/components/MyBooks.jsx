import {useState} from "react";

function MyBooks({myListings, myOffers, listing, showMyBooks, getListing, changePrice, removeListing, decideOffer, markSold}) {
  const [rollNo, setRollNo] = useState("");
  const [newPrice, setNewPrice] = useState("");

  // each note is the error or success message that shows next to its own buttons
  const [showNote, setShowNote] = useState("");   // roll number box, Show and View offers
  const [priceNote, setPriceNote] = useState(""); // new price box and Save
  const [bookNote, setBookNote] = useState("");   // Mark sold and Remove
  const [offerNote, setOfferNote] = useState(""); // Accept and Decline

  return (
    <>
      <h2>My books</h2>
      <input placeholder="Roll number (Ex : 001)" value={rollNo} onChange={(e) => setRollNo(e.target.value)} />
      <button onClick={() => showMyBooks(rollNo, setShowNote)}>Show</button>
      <p>{showNote}</p>

      <h3>My listings</h3>
      {myListings.map((item) => (
        <div key={item.id}>
          <p>{item.title} | ₹{item.price} | {item.status} | Pending offers: {item.pending_offers}</p>
          <button onClick={() => getListing(item.id, setShowNote)}>View offers</button>
        </div>
      ))}

      {listing.map((book) => (
        <div key={book.id}>
          <hr />
          <h3>{book.title}</h3>
          <p>₹{book.price} | {book.status}</p>

          <input type="number" placeholder="New price (Max 2000)" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
          <button onClick={() => changePrice(book.id, rollNo, newPrice * 1, setPriceNote)}>Save</button>
          <p>{priceNote}</p>

          <button onClick={() => markSold(book.id, rollNo, setBookNote)}>Mark sold</button>
          <button onClick={() => removeListing(book.id, rollNo, setBookNote)}>Remove</button>
          <p>{bookNote}</p>

          <h4>Offers</h4>
          <p>{offerNote}</p>
          {book.offers.map((offer) => (
            <div key={offer.id} className={offer.status}>
              <p>{offer.buyer_roll} offered ₹{offer.offer_price} ({offer.status})</p>
              <button onClick={() => decideOffer(offer.id, rollNo, "accept", book.id, setOfferNote)}>Accept</button>
              <button onClick={() => decideOffer(offer.id, rollNo, "decline", book.id, setOfferNote)}>Decline</button>
            </div>
          ))}
          <hr />
        </div>
      ))}

      <h3>My offers</h3>
      {myOffers.map((offer) => (
        <p key={offer.id}>{offer.title} | Asking ₹{offer.asking_price} | My offer ₹{offer.offer_price} | {offer.status}</p>
      ))}
    </>
  );
}

export default MyBooks;