CREATE DATABASE myMovie;

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE movie(
    movie_id SERIAL PRIMARY KEY,
    movieName VARCHAR(255) NOT NULL
);

CREATE TABLE joint(
    joint_FK SERIAL PRIMARY KEY,
    userID_FK REFERENCES users(user_id),
    movieID_FK REFERENCES movie(movie_id)
);