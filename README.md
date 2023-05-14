
Grades React App
Check out the live app here.

Overview
This is a comprehensive GPA Calculator and academic tracking Web App built with a React frontend, Node + Express backend, and MongoDB as the database.

Motivation
The idea for this project stemmed from my desire to practically apply my knowledge of React. It served as an excellent exercise, particularly in frontend UI development.

Functionality
The data for this application is user-generated. Users can:

Input their grades, credits, and semesters
Receive insights about their academic performance, such as overall, yearly, and semesterly GPAs
See the number of users from their academic institution using the app and their average GPA
Compare their performance with peers in their institution
Edit grades or add new courses for future planning
Deployment
The project is hosted via Google Cloud web hosting service.

Pages
Sign In: Login form with email/password and Google account options
Sign Up: Registration form requesting email, password, and academic institution
Home: Navigation menu guiding users to grades or statistics page. (Auto-navigation to login if account isn't logged in)
Grades: Form to input and edit course details (name, grade, credits) by semester and year
Statistics: User's academic statistics: GPA, Yearly GPA, Semesterly GPA chart (using ChartJS library), and institutional statistics
Tech Stack and Dependencies
Frontend:

React.js
Tailwind CSS
React Icons
Backend:

Node.js
Express
dotenv
Mongoose
Axios
Authentication:

Firebase Auth
Database:

MongoDB
Hosting:

Google Cloud Host Service
API Documentation
Server Endpoint: https://grades-app-c415d.ey.r.appspot.com/
