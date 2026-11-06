const express = require("express");
const mysql = require("mysql2");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "tejaswi", // Change this to your MySQL password
  database: "parking_lot_db"
});

db.connect(err => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
    process.exit(1);
  }
  console.log("Connected to MySQL");
});

const tables = {
  users: {
    table: "users",
    id: "user_id",
    columns: ["name", "phone_no", "email", "role"]
  },
  slots: {
    table: "parking_slots",
    id: "slot_id",
    columns: ["slot_number", "vehicle_type", "location", "status"]
  },
  vehicles: {
    table: "vehicles",
    id: "vehicle_id",
    columns: ["user_id", "vehicle_number", "vehicle_type", "vehicle_model"]
  },
  records: {
    table: "parking_records",
    id: "record_id",
    columns: ["vehicle_id", "slot_id", "entry_time", "exit_time", "parking_fee", "status"]
  }
};

function getConfig(req, res) {
  const config = tables[req.params.type];
  if (!config) {
    res.status(404).send("Invalid table");
    return null;
  }
  return config;
}

// Specific lookup route must be registered before the generic /api/:type route.
app.get("/api/lookups", (req, res) => {
  db.query("SELECT user_id, name FROM users ORDER BY name", (err, users) => {
    if (err) return res.status(500).send(err.message);
    db.query("SELECT vehicle_id, vehicle_number, vehicle_type FROM vehicles ORDER BY vehicle_number", (err, vehicles) => {
      if (err) return res.status(500).send(err.message);
      db.query("SELECT slot_id, slot_number, vehicle_type, status FROM parking_slots ORDER BY slot_number", (err, slots) => {
        if (err) return res.status(500).send(err.message);
        res.json({ users, vehicles, slots });
      });
    });
  });
});

app.get("/api/:type", (req, res) => {
  const c = getConfig(req, res);
  if (!c) return;
  db.query(`SELECT * FROM ${c.table} ORDER BY ${c.id} DESC`, (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

app.post("/api/:type", (req, res) => {
  const c = getConfig(req, res);
  if (!c) return;
  const values = c.columns.map(col => req.body[col] === "" ? null : req.body[col]);
  if (c.columns.some(col => req.body[col] === undefined)) {
    return res.status(400).send("Please fill all required fields");
  }
  const cols = c.columns.join(",");
  const marks = c.columns.map(() => "?").join(",");
  db.query(`INSERT INTO ${c.table} (${cols}) VALUES (${marks})`, values, err => {
    if (err) return res.status(500).send(err.message);
    res.send("Record inserted successfully");
  });
});

app.put("/api/:type/:id", (req, res) => {
  const c = getConfig(req, res);
  if (!c) return;
  const values = c.columns.map(col => req.body[col] === "" ? null : req.body[col]);
  const set = c.columns.map(col => `${col} = ?`).join(", ");
  db.query(`UPDATE ${c.table} SET ${set} WHERE ${c.id} = ?`,
    [...values, req.params.id], (err, result) => {
      if (err) return res.status(500).send(err.message);
      if (!result.affectedRows) return res.status(404).send("Record not found");
      res.send("Record updated successfully");
    });
});

app.delete("/api/:type/:id", (req, res) => {
  const c = getConfig(req, res);
  if (!c) return;
  db.query(`DELETE FROM ${c.table} WHERE ${c.id} = ?`, [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err.message);
    if (!result.affectedRows) return res.status(404).send("Record not found");
    res.send("Record deleted successfully");
  });
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
