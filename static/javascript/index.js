$( () => {
    // <--- Socket --->
    let socket = io(); // Constructs socket from index.ejs and server

    // <--- Variables --->
    let name = null; // emitted from server after login
    let email = null; // emitted from server after login
    let chat = null; // emitted from server after login
    let errors = null; // for errors

    // <--- AJAX --->
    $('#registration-submit').click( () => {
        // sets submission variables
        const email = $('#registration-email').val();
        const password = $('#registration-password').val();
        const passwordConfirm = $('#regirstion-password-confirm').val();
        const first_name = $('#first-name').val();
        const last_name = $('#last-name').val();
        const birthday = $('#birthday').val()

        // Sends form data to server
        socket.emit('register_user', {
            email: email,
            password: password,
            passwordConfirm: passwordConfirm,
            first_name: first_name,
            last_name: last_name,
            birthday: birthday
        });
    });

    // <--- Sockets --->
    // Registration error
    socket.on('reg_errors', data => {
        console.log(data)
    });

    // Logged in -- Show chat
    socket.on('logged_in', () => {
        $('#log-and-reg').hidden = true;
        $('#chatroom').hidden = false;
    });

    // Announce that new user has joined
    socket.on('new_user_joined', data => {
        name = data.userdata.name;
        email = data.userdata.email;
        chat = ""; // sets client-side chat to blank

        // Loops through each element in the log and appends to the chat html
        data.log.forEach(message => {
            chat += `<p id="${message.email}" class="text-light">${message.message}</p>`
        });

        $('#chat').html(chat); // update sthe innerHTML of the chat window
    })
})