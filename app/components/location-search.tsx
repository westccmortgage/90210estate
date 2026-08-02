export function LocationSearch() {
  return (
    <div className="search-wrap">
      <form className="shell home-search" action="/listings" method="get">
        <label htmlFor="home-search"><span>Search the 90210 market</span>Enter a city, neighborhood, or address</label>
        <input id="home-search" name="search" placeholder="Beverly Hills, Bel Air, Trousdale Estates…" />
        <button type="submit">Search homes</button>
      </form>
    </div>
  );
}
