// the form to list a new book

import {useState} from "react";

function SellBook({addListing}) {
  const [sellerRoll, setSellerRoll] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState("");
  const [note, setNote] = useState(""); // the error or success message for this form

  return (
    <>
      <h2>Sell a book</h2>
      <input placeholder="Roll number (Ex: 001)" value={sellerRoll} onChange={(e) => setSellerRoll(e.target.value)} />
      <input placeholder="Book title" value={title} onChange={(e) => setTitle(e.target.value)} />

      <select value={subject} onChange={(e) => setSubject(e.target.value)}>
        <option value="">Select subject </option>
        <option value="comp sci">comp sci </option>
        <option value="econ">econ </option>
        <option value="eng">eng </option>
        <option value="math">math </option>
        <option value="bio">bio </option>
      </select>

      <select value={condition} onChange={(e) => setCondition(e.target.value)}>
        <option value="">Select condition </option>
        <option value="new">new </option>
        <option value="used">used </option>
        <option value="old">old </option>
      </select>

      <input type="number" placeholder="Price (Max 2000)" value={price} onChange={(e) => setPrice(e.target.value)} />

      <p>{note}</p>

      <button onClick={() => 
        addListing(sellerRoll, title, subject, condition, price?price : 0, setNote)}>List book </button>
    </>
  );
}

export default SellBook;