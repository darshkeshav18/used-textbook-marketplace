import {useState} from "react";

function MyBooks({myListings, myOffers, listing, showMyBooks, getListing, changePrice, removeListing, decideOffer, markSold}) {
  const [rollNo, setRollNo] = useState("");
  const [newPrice, setNewPrice] = useState("");

  return (
    <>
      <h2>My books</h2>
      <div className="roll-search">
        <input placeholder="Your roll number" value={rollNo} onChange={(e) => setRollNo(e.target.value)} />
        <button onClick={() => showMyBooks(rollNo)}>Show</button>
      </div>

      <h3>My listings</h3>
      {myListings.length === 0 ? (
        <p className="empty-text">Enter your roll number above and click Show to view your listings.</p>
      ) : (
        myListings.map((item) => (
          <div key={item.id} className="my-listing-item">
            <p><strong>{item.title}</strong> | ₹{item.price} | <span className="badge">{item.status}</span> | Pending offers: {item.pending_offers}</p>
            <button onClick={() => getListing(item.id)}>View offers</button>
          </div>
        ))
      )}

      {listing.map((book) => (
        <div key={book.id} className="selected-book-details">
          <h3>{book.title}</h3>
          <p className="price-tag">₹{book.price} | <span className="badge">{book.status}</span></p>

          <div className="action-row">
            <input type="number" placeholder="New price" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
            <button onClick={() => changePrice(book.id, rollNo, newPrice * 1)}>Save</button>
            <button className="btn-success" onClick={() => markSold(book.id, rollNo)}>Mark sold</button>
            <button className="btn-danger" onClick={() => removeListing(book.id, rollNo)}>Remove</button>
          </div>

          <h4>Offers ({book.offers ? book.offers.length : 0})</h4>
          {book.offers && book.offers.length > 0 ? (
            book.offers.map((offer) => (
              <div key={offer.id} className={`offer-item ${offer.status}`}>
                <p>{offer.buyer_roll} offered ₹{offer.offer_price} ({offer.status})</p>
                <div>
                  <button className="btn-success" onClick={() => decideOffer(offer.id, rollNo, "accept", book.id)}>Accept</button>
                  <button className="btn-danger" onClick={() => decideOffer(offer.id, rollNo, "decline", book.id)}>Decline</button>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-text">No offers on this listing yet.</p>
          )}
        </div>
      ))}

      <h3>My offers</h3>
      {myOffers.length === 0 ? (
        <p className="empty-text">No offers made yet.</p>
      ) : (
        myOffers.map((offer) => (
          <p key={offer.id} className="my-offer-item">
            <strong>{offer.title}</strong> | Asking ₹{offer.asking_price} | My offer ₹{offer.offer_price} | <span className="badge">{offer.status}</span>
          </p>
        ))
      )}
    </>
  );
}

export default MyBooks;
