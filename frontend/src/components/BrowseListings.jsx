import { useState } from "react";
import ListingCard from "./ListingCard";

function BrowseListings({ listings, getListings, makeOffer }) {
  const [subject, setSubject] = useState("");
  const [condition, setCondition] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [note, setNote] = useState(""); // the error message for the search

  return (
    <>
      <h2>Browse listings</h2>

      <select value={subject} onChange={(e) => setSubject(e.target.value)}>
        <option value="">All subjects</option>
        <option value="comp sci">comp sci</option>
        <option value="econ">econ</option>
        <option value="eng">eng</option>
        <option value="math">math</option>
        <option value="bio">bio</option>
      </select>

      <select value={condition} onChange={(e) => setCondition(e.target.value)}>
        <option value="">All conditions</option>
        <option value="new">new</option>
        <option value="used">used</option>
        <option value="old">old</option>
      </select>

      <input type="number" placeholder="Max price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
      <p>{note}</p>
      <button onClick={() => getListings(subject, condition, maxPrice, setNote)}>Search</button>

      <ul className="products">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} makeOffer={makeOffer} />
        ))}
      </ul>
    </>
  );
}

export default BrowseListings;