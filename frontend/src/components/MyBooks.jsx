import {useState} from "react";

function MyBooks({myListings, myOffers, listing, showMyBooks, getListing, changePrice, removeListing, decideOffer, markSold}) {
  const [rollNo, setRollNo] = useState("");
  const [newPrice, setNewPrice] = useState("");

  return (
    <>
      <h2>My books</h2>
      <input placeholder="Your roll number" value={rollNo} onChange={(e) => setRollNo(e.target.value)} />
      <button onClick={() => showMyBooks(rollNo)}>Show</button>

      <h3>My listings</h3>
      {myListings.map((item) => (
        <div key={item.id}>
          <p>{item.title} | ₹{item.price} | {item.status} | Pending offers: {item.pending_offers}</p>
          <button onClick={() => getListing(item.id)}>View offers</button>
        </div>
      ))}

      {listing.map((book) => (
        <div key={book.id}>
          <hr />
          <h3>{book.title}</h3>
          <p>₹{book.price} | {book.status}</p>

          <input type="number" placeholder="New price" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
          <button onClick={() => changePrice(book.id, rollNo, newPrice * 1)}>Save</button>
          <button onClick={() => markSold(book.id, rollNo)}>Mark sold</button>
          <button onClick={() => removeListing(book.id, rollNo)}>Remove</button>

          <h4>Offers</h4>
          {book.offers.map((offer) => (
            <div key={offer.id} className={offer.status}>
              <p>{offer.buyer_roll} offered ₹{offer.offer_price} ({offer.status})</p>
              <button onClick={() => decideOffer(offer.id, rollNo, "accept", book.id)}>Accept</button>
              <button onClick={() => decideOffer(offer.id, rollNo, "decline", book.id)}>Decline</button>
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
