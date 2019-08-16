// This module handles 'login and registration' routing
module.exports = (app, server, mongoose, UserSchema, io) => {
    // <--- Modules --->
    const bcrypt = require('bcrypt'); // imports bycrypt module

    // <--- DB Settings --->
    const User = mongoose.model('User', UserSchema); // Model to create documents and chain mongoose methods
    
    // <--- Sockets --->
    io.on('connection', socket => {
        // listeners go here
        socket.on('register_user', data => {
            
            bcrypt.hash(data.password, 10) // using bcrypt to has pw with 10 rounds of salt
                .then(hashed_password => {
                    const user = new User(); // creates new user, manually assigns values due to PW hashing
                    user.first_name = data.first_name;
                    user.last_name = data.last_name;
                    user.email = data.email;
                    user.password = hashed_password;
                    user.birthday = data.birthday

                    user.save() // save user to DB / check password match, create session 'logged in', emit name / email to client
                        .then( () => {
                            if(data.password !== data.passwordConfirm) {
                                throw new error('Passwords do not match!')
                            }
                            const userdata = {email: user.email, name: user.first_name}; // batches data for session
                            socket.handshake.session.userdata = userdata; // creates session
                            socket.handshake.session.save(); // saves session

                            socket.emit('logged_in'); // sends that the user is 'logged in' back to the client;
                            socket.emit('new_user', {user: userdata});
                        })
                        .catch(err => {
                            let regErrors = []; // creates array for registration errors
                            for (var key in err.errors) {
                                regErrors.push(err.errors[key].message); // adds errors to list
                            }
                            console.log('test');
                            socket.emit('reg_errors', {errors: regErrors});
                        })
                })
                .catch(err => console.log(err));
        })
    });

}