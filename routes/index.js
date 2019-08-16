// This module handles 'root' routing
module.exports = (app, server, io) => {
    // <--- Variable --->
    let log = [];

    // <--- Routing --->
    // ** GET Routes **
    // Root
    app.get('/', (req, res) => {
        res.render('index');
    })

    app.get('/userJoined', (req, res) => {
        req.io.emit('logged_id');
        req.io.emit('new_user', req.session.userData)
    })

    // <--- Sockets --->
    io.on('connection', socket => {
        socket.emit('test');
        // listeners go here
        socket.on('new_user', data => {
            log.push({email: data.email, message: `${data.name} (${data.email}) has joined the conversation...`})
            io.emit('new_user_joined', {user: data.userdata, log: log});
        })
    });
}