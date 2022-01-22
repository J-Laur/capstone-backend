const express = require("express");
const app = express();
const cors = require("cors");
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
//need to change this part to work with joint
app.post("/movieList", db.addMovie);
app.get("/movieList", db.getAllMovie);
app.get("/movieList/:id", db.getMovie);
app.put("/movieList/:id", db.editMovie);
app.delete("/movieList/:id", db.deleteMovie);


app.listen(5000, () => {
    console.log("server from port 5000");
});