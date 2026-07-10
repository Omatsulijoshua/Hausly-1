type ListingImage = {
  url: string;
};

type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  propertyType: string;
  rooms: number;
  status: string;
  images?: ListingImage[];
};

async function getListings(): Promise<Listing[]> {
  try {
    const response = await fetch("http://localhost:3000/listings", {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    return response.json();
  } catch {
    return [];
  }
}

export default async function Home() {
  const listings = await getListings();
  const featured = listings.slice(0, 6);

  return (
    <main>
      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">Hausly marketplace</p>
          <h1>Hausly</h1>
          <p className="lede">
            A clean web front for browsing homes, comparing prices, and moving
            quickly from discovery to contact.
          </p>
          <div className="actions">
            <a href="#listings">Browse homes</a>
            <a href="http://127.0.0.1:5173/">Admin dashboard</a>
          </div>
        </div>
        <div className="heroPanel" aria-label="Marketplace summary">
          <span>{listings.length}</span>
          <p>seeded listings live from the backend</p>
        </div>
      </section>

      <section className="contentBand" id="listings">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">Available homes</p>
            <h2>Latest listings</h2>
          </div>
          <p>{listings.length ? "Connected to API" : "Waiting for API data"}</p>
        </div>

        <div className="grid">
          {featured.map((listing) => (
            <article className="card" key={listing.id}>
              <div className="media">
                <img
                  alt=""
                  src={
                    listing.images?.[0]?.url ||
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop"
                  }
                />
              </div>
              <div className="cardBody">
                <div className="cardTop">
                  <span>{listing.propertyType}</span>
                  <span>{listing.status}</span>
                </div>
                <h3>{listing.title}</h3>
                <p>{listing.address}</p>
                <div className="details">
                  <strong>${Math.round(listing.price).toLocaleString()}</strong>
                  <span>{listing.rooms} rooms</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
