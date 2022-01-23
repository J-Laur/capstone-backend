const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "8934", 
    host: "localhost",
    port: 5432,
    database: "mymovie"
});

 

    let currentUser = 0; //placeholder variable for current user id


//users table functions//
//create an user
const signup = async (req, res) => {  //signup page
    try {
      const { username, email, password } = req.body;
      let errors = {};
  
      const isEmailInUse = await pool.query(
        "SELECT * FROM users WHERE email = $1",  //checks if email is in use
        [email]
      );

      if (isEmailInUse.rows.length > 0) {
        errors.email = "Email is already in use";
      }
  
      if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
      }
  
      const newUser = await pool.query( 
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",  //inserts data into users table
        [username, email, password]
      );
  
      res.json({sucess: true, data: newUser.rows[0]});
    } catch (err) {
      res.status(500).json({error: err.message})
    }
};

//login 

const login = async (req, res) => {  //validates user with users table
  try {
    const { email, password } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [  
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(404).json({
        error: {
          message: "User not found",  //checks user and displays message if not found
        },
      });
    }
    if (!(password === user.rows[0].password)) {
      return res.status(401).json({
        error: {
          message: "Incorrect password",  //checks if password is incorrect and prints message
        },
      });
    }
    currentUser = user.rows[0].user_id;  //grab current user id when logging in, used for joint table
    console.log(currentUser);
    res.status(200).json({ success: true });  //user logged in successfully
  } catch (err) {
    res.status(500).send("Server Error");  //server error
  }
};


//movie table functions//

//add a movie  //CONNECTED WITH JOINT
const addMovie = async (req, res) => {
    try {
        const {moviename} = req.body;

        const newMovie = await pool.query("INSERT INTO movie (moviename) VALUES($1) RETURNING *", [moviename]);

        //insert the current id of the person logged in and along with the movie the user is adding 
       const newJointMovie = await pool.query ("INSERT INTO joint (userID_FK, movieID_FK) VALUES ($1, $2)", [currentUser, newMovie.rows[0].movie_id]);

        console.log(currentUser);
        res.json(newMovie.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
}

//get all movies  //CONNECTED WITH JOINT
const getAllMovie = async (req, res) => {     //returns all movies in list
    try {
        //const allMovies = await pool.query("SELECT * FROM movie");

        const getJointMovie = await pool.query("SELECT movieid_FK FROM joint WHERE userid_FK = $1", [currentUser]);  //gets all movies for current user

        //res.json(allMovies.rows)
        res.json(getJointMovie.rows);
    } catch (err) {
        console.error(err.message);
    }
}

//get a movie  //CONNECTED WITH JOINT
const getMovie = async (req, res) => {  //specify movie id, returns movie
    try {
        const {id} = req.params;
        const movie = await pool.query("SELECT * FROM movie WHERE movie_id = $1", [id]);  //selects movie id from movie table

        
        res.json(movie.rows[0])
    } catch (err) {
        console.error(err.message);
    }
}

//edit a movie //CONNECTED WITH JOINT
const editMovie = async (req, res) => {  //use PUT to edit movie title
    try {
        const {id} = req.params;
        const {moviename} = req.body;
        const updateMovie = await pool.query("UPDATE movie SET moviename = $1 WHERE movie_id = $2", [moviename, id]);  //updates movie name in movie table

        res.json("Movie list is updated")
    } catch (err) {
        console.error(err.message);
    }
}
//delete a movie //CONNECTED WITH JOINT
const deleteMovie = async (req, res) => {  //delete specified movie using id
    try {
        const {id} = req.params;

        const deleteJointMovie = await pool.query("DELETE FROM joint WHERE movieid_FK = $1", [id]);  //deletes movie from joint table


        const deleteMovie = await pool.query("DELETE FROM movie WHERE movie_id = $1", [id]);  //deletes movie from movie table


        res.json("Movie was deleted") //message displayed
    } catch (err) {
        console.error(err.message);
    }
}


module.exports = {signup, login, addMovie, getAllMovie, getMovie, editMovie, deleteMovie, pool}; //export all modules