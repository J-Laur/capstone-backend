CREATE DATABASE mymovie;

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE movie(
    movie_id SERIAL PRIMARY KEY,
    moviename VARCHAR(255) NOT NULL
);

CREATE TABLE joint(
    joint_id SERIAL PRIMARY KEY,
    userID_FK INTEGER REFERENCES users(user_id),
    movieID_FK INTEGER REFERENCES movie(movie_id)
);