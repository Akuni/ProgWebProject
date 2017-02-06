# ProgWebProject
------------------
 - [Julien ANDRE](https://github.com/JulienAndre26)
 - [Antoine ROLLIN](https://github.com/antoinerollin)
 - [Nicolas SARROCHE](https://github.com/Akuni)
------------------

The project is hosted at : https://serversidejan.herokuapp.com/
The database is also hosted at with mLab (https://mlab.com/).

Git : https://github.com/Akuni/ProgWebProject

------------------

HOW TO RUN THE PROJECT

------------------

Requirements: 
- NodeJS (& NPM)
- MongoDB
- a web browser

Run the project by executing : ./run.sh

This script downloads the project dependencies (npm) and launch the server.
The server will be reachable through localhost:3001
By default, it will use the distant database which is hosted with mLab (https://mlab.com/).


------------------

HOW TO LAUNCH TESTS

------------------

1) Let's go in the test folder : 'cd project/test'
2) Launch tests : 'npm test'

The tests uses the distant server hosted with Heroku.
If you encounter problems while launching test, you may need to execute 'sudo npm install' first.


------------------

HOW TO USE A LOCAL DATABASE

------------------

1) In project/dbmanager.js, set the variable db_url to 'mongodb://localhost:27017/pwdb';
2) Create folder '/data/db' in the root directory
3) Launch Mongo : sudo mongod 	(if the needed port being used, kill the mongo process -- 'ps -e | grep mongo' and 'kill -9 $pid')

[Optional] You may want to have an admin account. You can do so by performing a subscription on the project website using the username 'admin'. When you will sign in with the 'admin' account, you will be redirect to the admin interface.

[Optional] You can import a database using the import_db.sh script. 

