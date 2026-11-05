import { useState, useEffect } from "react";
import BrowseListings from "./components/BrowseListings";
import SellBook from "./components/SellBooks";
import MyBooks from "./components/MyBooks";

const API_URL = "http://127.0.0.1:8001";

function App() {
  const [listings, setListings] = useState([]);
  const [listing, setListing] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [myOffers, setMyOffers] = useState([]);
  const [message, setMessage] = useState(""); // GUYS MAKE SURE YOU USE THIS TO STORE THE API ERROR MESSAGES SO THE USER CAN SEE IT

  // sam's code goes here

  // E1 function that gets all listings along with the url filters 
  function getListings(subject, condition, maxPrice) {
    const subjectFilter = subject ? "subject=" + subject + "&" : "";
    const conditinFilter = condition ? "condition=" + condition + "&" : "";
    const priceFilter = maxPrice ? "max_price=" + maxPrice : "";

    fetch(API_URL + "/listings?" + subjectFilter + conditinFilter + priceFilter)
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          setMessage(typeof data.detail === "string" ? data.detail : "Error loading listings");
        } else {
          setListings(data);
        }
      });
  }

  // E1 shows all listins when page loads
  useEffect(() => {
    getListings();
  }, []);

  // E2 takes listing id and gets specific listing
  function getListing(id) {
    fetch(API_URL + "/listings/" + id)
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          setMessage(typeof data.detail === "string" ? data.detail : "Listing not found");
        } else {
          setListing([data]);
        }
      });
  }

  // E3 adds a book to listing
  function addListing(sellerRoll, title, subject, condition, price) {
    setMessage("");
    fetch(API_URL + "/listings?seller_roll=" + sellerRoll + "&title=" + title + "&subject=" + subject + "&condition=" + condition + "&price=" + price,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seller_roll: sellerRoll, title: title, subject: subject, condition: condition, price: price }),
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          setMessage(typeof data.detail === "string" ? data.detail : "Invalid input");
        } else {
          setMessage("Book listed successfully!");
          getListings();
        }
      });
  }

  // E4 changes the price of a book on lisiting
  function changePrice(id, sellerRoll, price) {
    setMessage("");
    fetch(API_URL + "/listings/" + id + "/price?seller_roll=" + sellerRoll + "&price=" + price,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seller_roll: sellerRoll, price: price }),
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          setMessage(typeof data.detail === "string" ? data.detail : "Invalid input");
        } else {
          setMessage("Price updated successfully!");
          getListing(id);
          getListings();
          getMyListings(sellerRoll);
        }
      });
  }

  // aryan's code goes here

  // E5 removes a listing
  function removeListing(id, sellerRoll) {
    setMessage("");
    fetch(API_URL + "/listings/" + id + "?seller_roll=" + sellerRoll, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          setMessage(typeof data.detail === "string" ? data.detail : "Invalid input");
        } else {
          setMessage("Listing removed!");
          getListings();
          getMyListings(sellerRoll);
          setListing([]);
        }
      });
  }

  // E6 make an offer on a listing
  function makeOffer(listingId, buyerRoll, offerPrice) {
    setMessage("");
    fetch(API_URL + "/offers?listing_id=" + listingId + "&buyer_roll=" + buyerRoll + "&offer_price=" + offerPrice, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          setMessage(typeof data.detail === "string" ? data.detail : "Invalid input");
        } else {
          setMessage("Offer placed successfully!");
          getListing(listingId);
        }
      });
  }

  // E7 accepts or declines an offer
  function decideOffer(offerId, sellerRoll, action, listingId) {
    setMessage("");
    fetch(API_URL + "/offers/" + offerId + "?seller_roll=" + sellerRoll + "&action=" + action, {
      method: "PATCH",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          setMessage(typeof data.detail === "string" ? data.detail : "Invalid input");
        } else {
          setMessage("Offer " + action + "ed!");
          getListings();
          getMyListings(sellerRoll);
          if (listingId) getListing(listingId);
        }
      });
  }

  // darsh's code goes here

  // E9 gets one student's listings, each with its number of pending offers
  function getMyListings(rollNo) {
    fetch(API_URL + "/students/" + rollNo + "/listings")
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          setMessage(typeof data.detail === "string" ? data.detail : "Student not found");
        } else {
          setMyListings(data);
        }
      });
  }

  // E10 gets one student's offers, each with the book's title and asking price
  function getMyOffers(rollNo) {
    fetch(API_URL + "/students/" + rollNo + "/offers")
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          setMessage(typeof data.detail === "string" ? data.detail : "Student not found");
        } else {
          setMyOffers(data);
        }
      });
  }

  // E9 + E10 used by the Show button in My books
  function showMyBooks(rollNo) {
    if (rollNo === "") {
      setMessage("Enter a roll number");
    } else {
      setMessage("");
      getMyListings(rollNo);
      getMyOffers(rollNo);
    }
  }

  // E8 marks a listing sold
  function markSold(listingId, sellerRoll) {
    setMessage("");
    fetch(API_URL + "/listings/" + listingId + "/sold?seller_roll=" + sellerRoll, { method: "PATCH" })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          setMessage(typeof data.detail === "string" ? data.detail : "Invalid input");
        } else {
          getMyListings(sellerRoll);
          getListings();
          getListing(listingId);
        }
      });
  }

  return (
    <>
      <h1>Used Textbook Marketplace</h1>
      {message && <p className="message">{message}</p>}
      <BrowseListings listings={listings} getListings={getListings} makeOffer={makeOffer} />
      <SellBook addListing={addListing} />
      <MyBooks
        myListings={myListings}
        myOffers={myOffers}
        listing={listing}
        showMyBooks={showMyBooks}
        getListing={getListing}
        changePrice={changePrice}
        removeListing={removeListing}
        decideOffer={decideOffer}
        markSold={markSold}
      />
    </>
  );
}

export default App;
