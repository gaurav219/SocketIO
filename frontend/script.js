//console.log('Frontend running')

let socket = io()

socket.on('connect', () => {
    //console.log('socket connected')
})

$(() => {
    let username = $('#username')
    let messages = $('#messages')
    let send = $('#sendmsg')
    let msgbox = $('#msgbox')
    let clear = $('#clear')


    let users = []




    /* send.click(() => {
        //console.log('inside sennd')

        socket.emit('send_msg', {
            name: username.val(),
            message: msgbox.val()
        })
        msgbox.val('')
    }) */

    msgbox.on('keydown', function (event) {
        console.log('inside keydown')
        if (event.which === 13 && event.shiftKey == false) {
            // console.log('inside enter')
            // Emit to server input
            socket.emit('send_msg', {
                name: username.val(),
                message: msgbox.val()
            });
            msgbox.val('')
            event.preventDefault();
        }
    })


    socket.on('recv_msg', (data) => {

        //console.log(users)
        //console.log('inside on recive')
        if (data == 'NO') {
            //  console.log('inside NO')
            alert('Please enter Name and Message')
        } else if (data.length) {
            //  console.log('inside else if')
            for (var x = 0; x < data.length; x++) {
                // Build out message div
                var message = document.createElement('div');
                message.setAttribute('class', 'chat-message');
                message.textContent = data[x].name + ": " + data[x].message;
                messages.append(message);
                //messages.insertBefore(message, messages.firstChild);
                //console.log(data[x])
            }
            console.log(users)
        }

        //console.log(data.name + ' ' + data.message)
    })
    clear.click(() => {
        // console.log('inside clear')
        socket.emit('clear')
    })

    socket.on('cleared', () => {
        // console.log('cleared')
        $('#messages').empty()

        //messages.textContent = '';
    })


})