const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const { json } = require("express");
const compression = require("compression"); 
const bodyParser = require("body-parser"); 
const db = require("./db"); 

//middleware
app.use(cors());
app.use(express.json()); //req.body
app.use(compression()); 
app.use(bodyParser.json()); 


app.get("/", (req, res) => {
    response.json({ info: "Node.js, Express, and Postgres API" });
});

//signup login
app.post("/users", db.signup);
app.post("/login", db.login);

//movie
app.post("/movieList", db.addMovie);
app.get("/movieList", db.gotAllMovie);
app.get("/movieList/:id", getMovie);
app.put("/movieList/:id", editMovie);
app.delete("/movieList/:id", deleteMovie);