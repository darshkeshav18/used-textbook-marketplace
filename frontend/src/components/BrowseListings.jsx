import { useState } from "react";
import ListingCard from "./ListingCard";

function BrowseListings({ listings, getListings, makeOffer }) {
  const [subject, setSubject] = useState("");
  const [condition, setCondition] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  return (
    <>
      <h2>Browse listings</h2>

      <select value={subject} onChange={(e) => setSubject(e.target.value)}>
        <option value="">All subjects</option>
        <option value="cse">cse</option>
        <option value="ece">ece</option>
        <option value="mech">mech</option>
        <option value="civil">civil</option>
        <option value="maths">maths</option>
      </select>

      <select value={condition} onChange={(e) => setCondition(e.target.value)}>
        <option value="">All conditions</option>
        <option value="new">new</option>
        <option value="good">good</option>
        <option value="fair">fair</option>
        <option value="worn">worn</option>
      </select>

      <input placeholder="Max price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
      <button onClick={() => getListings(subject, condition, maxPrice)}>Search</button>

      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} makeOffer={makeOffer} />
      ))}
    </>
  );
}

export default BrowseListings;