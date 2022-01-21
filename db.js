const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "1234", //just replace this with your password to test
    host: "localhost",
    port: 5432,
    database: "myMovie"
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
      let errors = {};

      const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

      if (user.rows.length === 0) {
        return res.status(404).json({
          error: {
            message: "User not found",
          },
        });
      }

      const isMatch = await compare(password, user.rows[0].password);

      if (!isMatch) { error.message = "Incorrect password";}

      if(Object.keys(error).length > 0){return response.status(400).json(errors)}

      res.json({ success: true, data: user.rows[0]});
    } catch (err) {
      console.error("login not working");
    }
};



//movie table functions//
//in these functions we need to add a component where 
//it adds the movieID and userID into the table "joint" 

//add a movie
const addMovie = async (req, res) => {
    try {
        const {description} = req.body;
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *", [description]);

        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
}

//get all movies
const getAllMovie = async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo");
        res.json(allTodos.rows)
    } catch (err) {
        console.error(err.message);
    }
}

//get a movie
const getMovie = async (req, res) => {
    try {
        const {id} = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);

        res.json(todo.rows[0])
    } catch (err) {
        console.error(err.message);
    }
}

//edit a movie
const editMovie = async (req, res) => {
    try {
        const {id} = req.params;
        const {description} = req.body;
        const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id]);

        res.json("Todo is updated")
    } catch (err) {
        console.error(err.message);
    }
}
//delete a movie
const deleteMovie = async (req, res) => {
    try {
        const {id} = req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);

        res.json("Todo was deleted")
    } catch (err) {
        console.error(err.message);
    }
}



module.exports = {signup, login, addMovie, getAllMOvie, getMovie, editMovie, deleteMovie, pool};