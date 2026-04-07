import { useState } from "react";
import "./App.css";

function App() {
  const [q, setQ] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setSearched(false);

    const params = new URLSearchParams({
      q,
      minPrice,
      maxPrice
    });

    try {
      const res = await fetch(`http://127.0.0.1:5000/search?${params}`);
      const data = await res.json();

      setResults(data);
      setSearched(true);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1 className="title">Inventory Search</h1>

      <div className="inputs">
        
        <input
          placeholder="Search product..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <button onClick={handleSearch}>Search</button>
      </div>

     
      {loading && <p>Loading...</p>}

    
      {searched && !loading && results.length === 0 && (
        <p className="no-results">No results found</p>
      )}

     
      {searched && !loading && results.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item) => (
              <tr key={item.id}>
                <td>{item.product_name}</td>
                <td>₹{item.price}</td>
                <td>{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;