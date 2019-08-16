// <--- Modules --->
const express = require('express'); // imports express module
// imports session module, and sets settings (to use with socket.io)
const session = require('express-session')({
    secret: 'SessChatRmSecKey',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60000}
});
const sharedsession = require('express-socket.io-session'); // imports session for socket.io
const mongoose = require('mongoose'); // imports mongoose module
const uniqueValidator = require('mongoose-unique-validator'); // imports unique validator


// <--- DB Settings --->
mongoose.connect('mongodb://localhost/chatroom', {useNewUrlParser: true}); // connects to DB, creates new DB on first connect

// ** Schema **
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please use a valid email address'], // REGEX email pattern
        unique: true
    },
    first_name: {
        type: String,
        required: [true, 'First name is required'],
        minlength: [2, 'The minimum length for first name is two characters'],
        maxlength: [20, 'The maximum length for first name is twenty characters']
    },
    last_name: {
        type: String,
        required: [true, 'Last name is required'],
        minlength: [2, 'The minimum length for last name is two characters'],
        maxlength: [20, 'The maximum length for last name is twenty characters']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    birthday: {
        type: Date,
        required: [true, 'Birthday is required']
    }
}, {timestamps: true});

// Unique value plugin for schema
UserSchema.plugin(uniqueValidator, {message: 'Email address is already in use, please login to continue, or use a different email address'});

// <--- Server Constructors --->
const app = express(); // constructs express server
const server = app.listen(8000); // port-listening
let io = require('socket.io')(server); // constructors socket listener from server parameter

// <--- Server Settings --->
app.set('view engine', 'ejs'); // sets templating engine to ejs
app.set('views', __dirname + '/views'); // maps view dir
app.use(express.static(__dirname + '/static')); // points to static folder
// ** Session Settings **
app.set('trust proxy', 1); // trust first proxy
app.use(session);
io.use(sharedsession(session)); // shares session with sockets

// <--- Routing --->
const index = require(__dirname + '/routes/index.js')(app, server, io); // Index
const users = require(__dirname + '/routes/users.js')(app, server, mongoose, UserSchema, io); // Users