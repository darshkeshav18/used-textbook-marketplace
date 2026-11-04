import { useState, useEffect } from "react";
import BrowseListings from "./components/BrowseListings";
import MyBooks from "./components/MyBooks";
import SellBooks from "./components/SellBooks";

const API_URL = "http://127.0.0.1:8001";

function App() {
  const [listings, setListings] = useState([]);

  function fetchListings() {
    fetch(`${API_URL}/listings`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setListings(data);
        }
      });
  }

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Used Textbook Marketplace</h1>

      {/* Part 3: Sell a Book (Samhita's E3) */}
      <SellBooks apiUrl={API_URL} onListingAdded={fetchListings} />

      <hr style={{ margin: "30px 0" }} />

      {/* Part 1: Browse Available Listings (Includes Aryan's E6 Make Offer on each card) */}
      <BrowseListings
        listings={listings}
        apiUrl={API_URL}
        onOfferSuccess={fetchListings}
      />

      <hr style={{ margin: "30px 0" }} />

      {/* Part 2: My Books (Includes Aryan's E5 Remove and E7 Accept/Decline) */}
      <MyBooks apiUrl={API_URL} onActionDone={fetchListings} />
    </div>
  );
}

export default App;
