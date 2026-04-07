const express = require("express");
const cors = require("cors");

const app = express();


app.use(cors());
app.use(express.json());


const db = require("./db");


app.get("/", (req, res) => {
  res.send("Server + MySQL running 🚀");
});


app.post("/supplier", (req, res) => {
  const { name, city } = req.body;

  if (!name || !city) {
    return res.status(400).json({ message: "Name and city are required" });
  }

  const query = "INSERT INTO suppliers (name, city) VALUES (?, ?)";

  db.query(query, [name, city], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(201).json({ message: "Supplier added successfully ✅" });
  });
});


app.post("/inventory", (req, res) => {
  const { supplier_id, product_name, category, quantity, price } = req.body;

  if (!supplier_id || !product_name || !category) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (quantity < 0) {
    return res.status(400).json({ message: "Quantity must be >= 0" });
  }

  if (price <= 0) {
    return res.status(400).json({ message: "Price must be > 0" });
  }

  const checkSupplier = "SELECT * FROM suppliers WHERE id = ?";

  db.query(checkSupplier, [supplier_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error checking supplier" });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: "Supplier not found" });
    }

    const insertQuery = `
      INSERT INTO inventory (supplier_id, product_name, category, quantity, price)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      insertQuery,
      [supplier_id, product_name, category, quantity, price],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error inserting inventory" });
        }

        res.status(201).json({ message: "Inventory added successfully ✅" });
      }
    );
  });
});


app.get("/inventory", (req, res) => {
  const query = "SELECT * FROM inventory";

  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Fetching error" });
    }

    res.json(result);
  });
});

app.get("/inventory/grouped", (req, res) => {
  const query = `
    SELECT 
      s.name AS supplier_name,
      SUM(i.quantity * i.price) AS total_value
    FROM suppliers s
    JOIN inventory i ON s.id = i.supplier_id
    GROUP BY s.id
    ORDER BY total_value DESC
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching grouped data" });
    }

    res.json(result);
  });
});

app.get("/search", (req, res) => {
  let { q, category, minPrice, maxPrice } = req.query;


  if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
    return res.status(400).json({ message: "Invalid price range" });
  }

  let query = "SELECT * FROM inventory WHERE 1=1";
  let params = [];

  if (q) {
    query += " AND LOWER(product_name) LIKE LOWER(?)";
    params.push(`%${q}%`);
  }


  if (category) {
    query += " AND LOWER(category) = LOWER(?)";
    params.push(category);
  }

  
  if (minPrice) {
    query += " AND price >= ?";
    params.push(minPrice);
  }

  if (maxPrice) {
    query += " AND price <= ?";
    params.push(maxPrice);
  }

  db.query(query, params, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error searching" });
    }

    res.json(result);
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});