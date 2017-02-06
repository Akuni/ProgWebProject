# ProgWebProject
------------------
## Summary
* [Introduction](#introduction)
* [Server Side](#server-side)
* [Client Side](#client-side)
* [Team](#team)

------------------
## Introduction

This project is made for us to experience new web technologies like :
- [NodeJS](https://nodejs.org/en/)
- [Express](http://expressjs.com/fr/)
- [Mocha](https://mochajs.org/)

### Subject

A group of player can sign up as a team and access a map on which are displayed some markers. These markers indicate the location of a question. The team is geolocated throught the web browser and can see its travel on the map. When they are located near a question, it appears on the screen and the user can answer the multiple answers questions and have only one attempt. On success, the team earn some points. Otherwise, they lose some. Teams can answer the questions in the order they want, and have an unlimited amount of time to answer the questions, as long as they stay in the area of the question.

------------------

## Server Side

The server side ensures the link between the player and the database, and also manages data, encrypt passwords, and so on... It uses several different technologies : [NodeJS](https://nodejs.org/en/) is the most important one. We use the NodeJS engine to run our server. On top of that we also use several packages like :
- [Socket.io](http://socket.io/) : It allows use the ease the communication between the client and the server
- [Express](http://expressjs.com/fr/) : We use ExpressJs for its rooter feature and also to define a clean project stored in a `public` directory.

Our database is a MongoDB like database and host by [MLab](https://mlab.com/). It allows us up to 500MB of data storage which is suffisant for a thousand of users and a thousand of enigmas.

It is hosted on [Heroku](http://serversidejan.herokuapp.com/). It allows us to host free applications. It is more convenient for the users to log on a real url than on a `localhost:3001` for instance ...

We tested our application with [Mocha](https://mochajs.org/). This framework allow us to describe test scenarios, and send data to our server. We also created a test database in order no to soil our production database.

------------------

## Client Side 

The client side exposes all the game's features : account management (creation, authentication), admin's enigma management (add, delete), player's location management, player's enigma detection and solving, global chat, etc.
- [Bootstrap](http://getbootstrap.com/) : It allows responsive web design, essential for smartphones display.


------------------

## Team

Project by :
 - [Julien](https://github.com/JulienAndre26)
 - [Antoine](https://github.com/antoinerollin)
 - [Nicolas](https://github.com/Akuni)
