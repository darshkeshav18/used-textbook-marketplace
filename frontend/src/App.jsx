import {useState, useEffect} from "react";


const API_URL = "http://127.0.0.1:8001";

function App() {
  const [listings, setListings] = useState([]);
  const [listing, setListing] = useState(null);
  const [message, setMessage] = useState(""); // GUYS MAKE SURE YOU USE THIS TO STORE THE API ERROR MESSAGES SO THE USER CAN SEE IT

// sam's code goes here

// E1 function that gets all listings along with the url filters 
  function getListings(subject, condition, maxPrice) {
    setMessage("");
    const subjectFilter = subject?"subject=" + subject + "&" :"";
    const conditinFilter = condition?"condition=" + condition + "&" :"";
    const priceFilter = maxPrice?"max_price=" + maxPrice :"";

    fetch(API_URL + "/listings?" + subjectFilter + conditinFilter + priceFilter)
      .then((response) => response.json())
      .then((data) => data.detail?setMessage(data.detail) : setListings(data));
  }

  // E1 shows all listins when page loads
  useEffect(() => {
    getListings();
  }, []);

  // E2 takes listing id and gets specific listing
  function getListing(id) {
    setMessage("");
    fetch(API_URL + "/listings/" + id)
      .then((response) => response.json())
      .then((data) => data.detail ? setMessage(data.detail) : setListing(data)); // outputs error message if data.detail is false
  }

  // E3 adds a book to listing
  function addListing(sellerRoll, title, subject, condition, price) {
    setMessage("");
    fetch(API_URL + "/listings?seller_roll=" + sellerRoll + "&title=" + title + "&subject=" + subject + "&condition=" + condition + "&price=" + price, 
      { 
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({seller_roll: sellerRoll, title: title, subject: subject, condition: condition, price: price}),
      })
      .then((response) => response.json())
      .then((data) => setMessage(data.detail ? data.detail : ""))
      .then(() => getListings()); // reload list so the new book shows up
  }

  // E4 changes the price of a book on lisiting
  function changePrice(id, sellerRoll, price) {
    setMessage("");
    fetch(API_URL + "/listings/" + id + "/price?seller_roll=" + sellerRoll + "&price=" + price, 
      {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({seller_roll: sellerRoll, price: price}),
      })
      .then((response) => response.json())
      .then((data) => data.detail ? setMessage(data.detail) : getListing(id))
      .then(() => getListings()); // reload so the new price shows on the cards
  }}

// aryan's code goes here 



// darsh's code goes here

 return (
    <>
      // hi guys make it pretty here
    </>
  );

export default App;