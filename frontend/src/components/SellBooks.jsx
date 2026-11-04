import { useState } from "react";

function SellBooks({ apiUrl, onListingAdded }) {
  const [sellerRoll, setSellerRoll] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("cse");
  const [condition, setCondition] = useState("good");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  // Samhita's E3: List a book
  function handleListBook(e) {
    e.preventDefault();
    setMessage("");

    fetch(`${apiUrl}/listings?seller_roll=${sellerRoll}&title=${title}&subject=${subject}&condition=${condition}&price=${price}`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.detail) {
          setMessage(data.detail);
        } else {
          setMessage("Book listed successfully!");
          setTitle("");
          setPrice("");
          if (onListingAdded) {
            onListingAdded();
          }
        }
      });
  }

  return (
    <div>
      <h2>Sell a Book</h2>
      <form onSubmit={handleListBook}>
        <input
          type="text"
          placeholder="Seller Roll No"
          value={sellerRoll}
          onChange={(e) => setSellerRoll(e.target.value)}
          required
        />
        {" "}
        <input
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        {" "}
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="cse">CSE</option>
          <option value="ece">ECE</option>
          <option value="mech">MECH</option>
          <option value="civil">CIVIL</option>
          <option value="maths">MATHS</option>
        </select>
        {" "}
        <select value={condition} onChange={(e) => setCondition(e.target.value)}>
          <option value="new">New</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="worn">Worn</option>
        </select>
        {" "}
        <input
          type="number"
          placeholder="Price (10 - 2000)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        {" "}
        <button type="submit">List Book</button>
      </form>
      {message && <p style={{ color: message.includes("successfully") ? "green" : "red" }}>{message}</p>}
    </div>
  );
}

export default SellBooks;
