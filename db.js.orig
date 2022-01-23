const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "8934", 
    host: "localhost",
    port: 5432,
    database: "mymovie"
});

//users table functions//

//create an user
const signup = async (req, res) => {
    try {
      const { username, email, password } = req.body;
      let errors = {};
  
      const isEmailInUse = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (isEmailInUse.rows.length > 0) {
        errors.email = "Email is already in use";
      }
  
      if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
      }
  
      const newUser = await pool.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
        [username, email, password]
      );
  
      res.json({sucess: true, data: newUser.rows[0]});
    } catch (err) {
      res.status(500).json({error: err.message})
    }
};

//login 


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(404).json({
        error: {
          message: "User not found",
        },
      });
    }
    if (!(password === user.rows[0].password)) {
      return res.status(401).json({
        error: {
          message: "Incorrect password",
        },
      });
    }
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};


//movie table functions//
//in these functions we need to add a component where 
//it adds the movieID and userID into the table "joint" 

//add a movie
const addMovie = async (req, res) => {
    try {
        const {moviename} = req.body;
        //change this to push into move list
        const newMovie = await pool.query("INSERT INTO movie (moviename) VALUES($1) RETURNING *", [moviename]);
        //insert the current id of the person logged in and along with the movie you are adding rn

        res.json(newMovie.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
}

//get all movies
const getAllMovie = async (req, res) => {
    try {
        //no longer be selecting all from to do
        //first select the user ID from the jhoint list
        //and filter all the movies for thart person
        //then take those id and map it and get those movies from movie list
        const allMovies = await pool.query("SELECT * FROM movie");
        res.json(allMovies.rows)
    } catch (err) {
        console.error(err.message);
    }
}

//get a movie
const getMovie = async (req, res) => {
    try {
        const {id} = req.params;
        const movie = await pool.query("SELECT * FROM movie WHERE movie_id = $1", [id]);

        res.json(movie.rows[0])
    } catch (err) {
        console.error(err.message);
    }
}

//edit a movie
const editMovie = async (req, res) => {
    try {
        const {id} = req.params;
        const {moviename} = req.body;
        const updateMovie = await pool.query("UPDATE movie SET moviename = $1 WHERE movie_id = $2", [moviename, id]);

        res.json("Movie list is updated")
    } catch (err) {
        console.error(err.message);
    }
}
//delete a movie
const deleteMovie = async (req, res) => {
    try {
        const {id} = req.params;
        const deleteMovie = await pool.query("DELETE FROM movie WHERE movie_id = $1", [id]);

        res.json("Movie was deleted")
    } catch (err) {
        console.error(err.message);
    }
}


module.exports = {signup, login, addMovie, getAllMovie, getMovie, editMovie, deleteMovie, pool};