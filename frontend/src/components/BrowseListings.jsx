import ListingCard from "./ListingCard";

function BrowseListings({ listings, apiUrl, onOfferSuccess }) {
  return (
    <div>
      <h2>Browse Available Textbooks</h2>
      {listings.length === 0 ? (
        <p>No textbooks currently available.</p>
      ) : (
        <ul className="products" style={{ padding: 0 }}>
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              apiUrl={apiUrl}
              onOfferSuccess={onOfferSuccess}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default BrowseListings;
