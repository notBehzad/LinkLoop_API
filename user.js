//let connection=null;
//function login_page() {
//    window.location.href = 'login_page.html';
//    connection = new WebSocket('ws://127.0.0.1:8000/ws');
//}
//function signup_page() {
//    window.location.href = 'signup_page.html';
//    connection = new WebSocket('ws://127.0.0.1:8000/ws');
//}

//async function login() {

//    showLoader();

//    document.getElementById('show_error').innerText = '';

//    let username_ = document.getElementById('username').value;
//    let password_ = document.getElementById('password').value;

//    if (username_ == '') {
//        document.getElementById('show_error').innerText = 'Username cannot be empty';
//        hideLoader();
//        return;
//    }
//    if (password_ == '') {
//        document.getElementById('show_error').innerText = 'Password cannot be empty';
//        hideLoader();
//        return;
//    }


//    if (connection.readyState === WebSocket.OPEN) {
//        connection.send(JSON.stringify({
//            request_type: "login",
//            username: username_,
//            password: password_
//        }));
//    }
//    let response = await waitForMessage(connection);
//    response = await response.json();

//    if (response == true) {
//        document.getElementById('show_error').innerText = '';
//        hideLoader();
//        window.location.href = 'main_page.html';

//        document.body.style.display = "normal";
//        document.body.style.placeItems = 'normal';
//        initialize();

//    }
//    else {
//        hideLoader();
//        document.getElementById('show_error').innerText = response;
//    }
//}

//async function signup() {

//    showLoader();

//    document.getElementById('signup_show_error').innerText = "";


//    let username_ = document.getElementById('new_username').value;
//    let nickname_ = document.getElementById('new_nickname').value;
//    let password_ = document.getElementById('new_password').value;
//    let confirmPassword = document.getElementById('confirm_password').value;

//    username_ = username_.trim();
//    nickname_ = nickname_.trim();
//    password_ = password_.trim();
//    confirmPassword = confirmPassword.trim();

//    if (username_.length < 3 || username_.length > 12) {
//        document.getElementById('signup_show_error').innerText = "Username: length must be 3–12 chars";
//        hideLoader();
//        return;
//    } else if (!/^[A-Za-z._]+$/.test(username_)) {
//        document.getElementById('signup_show_error').innerText = "Username: only letters, '.' or '_'";
//        hideLoader();
//        return;
//    } else if (/^(\.+|_+|[ ._]+)$/.test(username_)) {
//        document.getElementById('signup_show_error').innerText = "Username: cannot be only dots/underscores/spaces";
//        hideLoader();
//        return;
//    }

//    if (nickname_.length < 3 || nickname_.length > 12) {
//        document.getElementById('signup_show_error').innerText = "Nickname: length must be 3–12 chars";
//        hideLoader();
//        return;
//    } else if (!/^[A-Za-z ]+$/.test(nickname_)) {
//        document.getElementById('signup_show_error').innerText = "Nickname: only letters & spaces";
//        hideLoader();
//        return;
//    } else if (/^ +$/.test(nickname_)) {
//        document.getElementById('signup_show_error').innerText = "Nickname: cannot be only spaces";
//        hideLoader();
//        return;
//    }

//    if (password_.length < 8 || password_.length > 15) {
//        document.getElementById('signup_show_error').innerText = "Password: length must be 8–15 chars";
//        hideLoader();
//        return;
//    } else if (!/[A-Z]/.test(password_)) {
//        document.getElementById('signup_show_error').innerText = "Password: missing uppercase letter";
//        hideLoader();
//        return;
//    } else if (!/[a-z]/.test(password_)) {
//        document.getElementById('signup_show_error').innerText = "Password: missing lowercase letter";
//        hideLoader();
//        return;
//    } else if (!/\d/.test(password_)) {
//        document.getElementById('signup_show_error').innerText = "Password: missing digit";
//        hideLoader();
//        return;
//    }

//    if (password_ !== confirmPassword) {
//        document.getElementById('signup_show_error').innerText = "Passwords do not match";
//        hideLoader();
//        return;
//    }

//    let is_user_id_available = await fetch(`http://127.0.0.1:8000/id_available/${username_}`)
//    is_user_id_available = await is_user_id_available.json();


//    if (is_user_id_available == false) {
//        document.getElementById('signup_show_error').innerText = "Username already taken.";
//        hideLoader();
//        return;
//    }

//    document.getElementById('signup_show_error').innerText = '';


//    if (connection.readyState === WebSocket.OPEN) {
//        connection.send(JSON.stringify({
//            request_type: "signup",
//            username: username_,
//            nickname: nickname_,
//            password: password_
//        }));
//    }
//    let response = await waitForMessage(connection);
//    response = await response.json();

//    hideLoader();

//    window.location.href = 'main_page.html';

//    document.body.style.display = "normal";
//    document.body.style.placeItems = 'normal';
//    initialize();

//}

//function back() {
//    window.location.href = 'initial_page.html';
//    connection.close();
//    connection = null;
//}

//function showLoader() {
//    let loader = document.getElementById('loading');
//    loader.innerHTML = `   
//    <div id='overlay' class='fade' style="background-color: rgba(0,0,0,0.5); height: 100vh; width: 100vw; position: fixed; top: 0; left: 0;"></div>
//    <div id='loaderBox' class="loader input fade" style='position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 10px;'>
//        <span></span>
//        <span></span>
//        <span></span>
//    </div >
//    `;
//    requestAnimationFrame(() => {
//        document.getElementById('overlay').classList.add('show');
//        document.getElementById('loaderBox').classList.add('show');
//    });

//}

//function hideLoader() {
//    document.getElementById('overlay').classList.remove('show');
//    document.getElementById('loaderBox').classList.remove('show');
//    setTimeout(() => {
//        let loader = document.getElementById('loading');
//        loader.innerHTML = '';
//    }, 500);
//}


//function waitForMessage(ws) {
//    return new Promise((resolve) => {
//        ws.onmessage = (event) => {
//            resolve(event.data);
//        };
//    });
//}




//let key_list = [];


//async function initialize() {

//    let name = await waitForMessage()
//    name = await name.json()

//    let greet = document.getElementById('def_text');
//    greet.innerHTML = `<p style="color: #07A0C3"><b><i>Hi ${name}</i></b><br>Ready to talk?</p>`;

//    const response = await waitForMessage()
//    response = await response.json();

//    listener();

//    if (response != false) {
//        let list = document.getElementById('contact_list');
//        list.innerHTML = '';
//        response.forEach((id) => {
//            make_contact_button(id[0], id[1], id[2], id[3]);
//        });
//    }
//}



//function verify_add() {
//    if (document.getElementById('add_bar').value == '') return;

//    warning(`<p style="text-align: center;">Adding them will also send a greeting message<br>Do you want to continue?</p>
//        <div style = "display: flex" >
//            <button class="button" onclick="remove_verify_box()" style="margin-right:30px;">Cancel</button>
//            <button class="button" onclick="remove_verify_box(); add_new_contact();" style="margin-left:30px;">Continue</button>
//        </div > `);
//}
//function warning(html) {
//    document.getElementById('alert').innerHTML = `
//    <div style="background-color: rgba(0,0,0,0.5); height: 100vh; width: 100vw; position: fixed; top: 0; left: 0;"></div>
//    <div class="box center" style=" padding: 20px !important; border-radius: 30px; z-index: 2; position: fixed; top: 50%; left:50%; transform: translate(-50%,-50%);">
//        ${html}
//    </div>
//    `;
//    requestAnimationFrame(() => {
//        document.getElementById('alert').classList.add('show');
//    });
//}

//function remove_verify_box() {
//    document.getElementById('alert').classList.remove('show');
//    setTimeout(() => {
//        document.getElementById('alert').innerHTML = '';
//    }, 500);
//}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////// make contact button

/////////// update last message

/////////// update status

/////////// add message

/////////// notification

/////////// update seen


//async function listener() {
//    while (true) {
//        let action = await waitForMessage();
//        action = await action.json();

//        if (action.type == 'make_contact_buttton') {
//            make_contact_button(action.id, action.last_message, action.new_count, action.status);
//        }
//        else if (action.type == 'update_last_message') {
//            update_last_message(action.id, action.message);
//        }
//        else if (action.type == 'update_status') {
//            update_status(action.id, action.status);
//        }
//        else if (action.type == 'add_message') {
//            add_message(action.key, action.message, action.time, action.is_me);
//        }
//        else if (action.type == 'notification') {
//            notification(action.sender, action.content, action.count);
//        }
//        else if (action.type == 'update_seen') {
//            update_seen();
//        }
//    }
//}


//async function add_new_contact() {
//    showLoader();
//    let id = document.getElementById('add_bar').value;
//    document.getElementById('add_bar').value = '';
//    let list = document.getElementById('users_list');
//    if (list != null) {
//        document.body.removeChild(list);
//    }
//    let response = await connection.send(JSON.stringify({
//        type: 'add_contact',
//        id: id
//    }));
//    //let response = await window.pywebview.api.add_contact(id);
//    hideLoader();
//    if (response == true) {
//        warning(`
//                <p style='font-size: 20px;'><b>Success!</b></p>
//                <p style="text-align: center;">Check your contact list</p>

//                <div style = "display: flex" >
//                    <button class="button" onclick="remove_verify_box()">OK</button>
//                </div > 
//        `);
//    }
//    else {
//        warning(`
//        <p style='font-size: 20px;'><b>User not found</b></p> 
//        <p style="text-align: center;">Double check the user ID or make sure<br>they are on this app or not already added</p>
//        <div style = "display: flex" >
//            <button class="button" onclick="remove_verify_box()">OK</button>
//        </div > 
//        `);
//    }
//}

//async function make_contact_button(id, last_message, new_count, status_) {
//    //removes "no contact" if exists
//    let empty_check = document.getElementById('no_contacts');
//    if (empty_check != null) document.getElementById('contact_list').removeChild(empty_check);

//    let list = document.getElementById('contact_list');
//    let contact = document.createElement('div');
//    contact.id = id;
//    contact.classList.add('contact');
//    list.appendChild(contact);
//    contact.addEventListener('click', () => chat_interface(id));

//    let name_tag = document.createElement('p');
//    name_tag.innerText = id;
//    name_tag.classList.add('name_tag');
//    contact.appendChild(name_tag);

//    let message = document.createElement('p');
//    message.innerText = last_message;
//    message.style.fontSize = '13px';
//    message.classList.add('last_message');
//    contact.appendChild(message);

//    let status = document.createElement('p');
//    status.innerText = status_;
//    status.classList.add('status');
//    if (status_ == "Active") {
//        status.classList.add('mark');
//        status.style.backgroundColor = 'forestgreen';
//    }

//    contact.appendChild(status);

//    if (new_count != 0) notif_dot(id, new_count);
//}

//function update_last_message(id, message) {
//    let bla = document.querySelector(`#${id} .last_message`);
//    bla.innerText = message;
//}


//function update_status(id, status) {
//    let status_ = document.querySelector(`#${id} .status`);
//    status_.innerText = status;
//    if (status == "Active") {
//        status_.classList.add('mark');
//        status_.style.backgroundColor = 'forestgreen';
//    }
//    else {
//        status_.classList.remove('mark');
//        status_.style.backgroundColor = '';
//    }
//    let header = document.querySelector(`.${id}_bar #id_status`);
//    if (header != null) {
//        header.innerText = status;
//    }
//}

//async function make_header(id) {
//    //let name = await window.pywebview.api.get_name(id);
//    let name = await fetch(`http://127.0.0.1:8000/get_name/${id}`)

//    let space = document.querySelector('.header_place');
//    if (space == null) {
//        space = document.querySelector('.header');
//    }
//    space.className = `header ${id}_bar`;
//    let status = document.querySelector(`#${id} .status`).innerText;
//    space.innerHTML = `
//        <p id="nick" style="margin: 15px 0 5px 30px; font-weight: 600; font-size: 20px;">${name}</p>
//        <p id='id_status' style="margin: 0 0 10px 30px; font-size: 10px;">${status}</p>
//        `;
//}

//let chat_id = null;

//async function chat_interface(id) {
//    if (chat_id == id) return;
//    chat_id = id;
//    showLoader();
//    key_list = [];

//    let prev = document.getElementsByClassName('opened');
//    if (prev.length != 0) prev[0].classList.remove('opened');
//    document.getElementById(id).classList.add('opened');

//    //remove new notif dot
//    let parent = document.getElementById(id);
//    let dot = parent.querySelector('.new_message_dot');
//    if (dot) parent.removeChild(dot);

//    make_header(id);

//    let text = document.getElementById('def_text');
//    if (text != null) document.getElementById('chat_list').removeChild(text);     //clear the big middle logo

//    // add message input interface
//    document.getElementById('input').innerHTML = `
//    <textarea id="input_box" class="input" placeholder="Message" ></textarea>
//    <button id= "send" class="button" onclick="send()" style="background-color: #07A0C3">Send</button>
//    `;

//    let data = await connection.send(JSON.stringify({
//        type: 'open_chat',
//        id: id
//    }));

//    //let data = await window.pywebview.api.open_chat(id);

//    let chat_box = document.getElementById('chat');
//    chat_box.innerHTML = '';                 //clear chat from chat list

//    for (let key of Object.keys(data.chats)) {   //making chat list

//        let box = document.createElement('div');
//        box.classList.add((data.chats[key].sender == id) ? 'other' : 'me', 'message');
//        box.id = `a${key}`;

//        let message = document.createElement('p');
//        message.innerText = data.chats[key].content;

//        box.appendChild(message);

//        let time = document.createElement('p');
//        time.innerText = data.chats[key].time;
//        time.classList.add('status');

//        box.appendChild(time);

//        if (data.chats[key].sender != id) {
//            let seen = document.createElement('p');
//            seen.style.fontWeight = 500;
//            seen.innerText = 'Seen';
//            seen.classList.add('status', 'seen', 'mark');
//            seen.style.backgroundColor = 'forestgreen';

//            box.appendChild(seen);
//        }
//        key_list.push(key);

//        chat_box.appendChild(box);
//    }


//    if (data.is_new == true) {
//        for (let i = key_list.length - 1; data.count > 0; i--, data.count--) {

//            let new_ = document.createElement('p');
//            new_.style.fontWeight = 500;
//            new_.innerText = 'New';
//            new_.classList.add('status', 'new', 'mark');
//            new_.style.backgroundColor = '#272727';
//            new_.style.color = '#fbfffe';
//            document.getElementById(`a${key_list[i]}`).appendChild(new_);
//        }
//    }
//    else {
//        for (let i = key_list.length - 1; data.count > 0; i--, data.count--) {

//            let not_seen = document.querySelector(`#a${key_list[i]} .seen`);

//            not_seen.innerText = 'Not seen';
//            not_seen.classList.add('not_seen');
//            not_seen.classList.remove('seen', 'mark');
//            not_seen.style.backgroundColor = '#272727';
//        }
//    }

//    let chat_list = document.getElementById('chat_list');

//    requestAnimationFrame(() => {
//        hideLoader();
//        chat_list.scrollTop = chat_list.scrollHeight;
//    });
//}

//let rece_audio = new Audio('received.mp3');
//function add_message(key, message, time, is_me) {   //add message to chat list
//    let chat_box = document.getElementById('chat');

//    if (!is_me) rece_audio.play();

//    let box = document.createElement('div');
//    box.classList.add((is_me === true) ? 'me' : 'other', 'recent', 'message');
//    box.id = `a${key}`;
//    box.style.opacity = 0;


//    let message_ = document.createElement('p');
//    message_.innerText = message;

//    box.appendChild(message_);

//    let time_ = document.createElement('p');
//    time_.innerText = time;
//    time_.classList.add('status');

//    box.appendChild(time_);

//    if (is_me === true) {
//        let seen = document.createElement('p');
//        seen.style.fontWeight = 500;
//        seen.innerText = 'Not seen';
//        seen.classList.add('status', 'not_seen');

//        box.appendChild(seen);

//        key_list.push(key);
//    }

//    chat_box.appendChild(box);

//    let chat_list = document.getElementById('chat_list');

//    requestAnimationFrame(() => {
//        chat_list.scrollTop = chat_list.scrollHeight;
//    });

//    setTimeout(() => {
//        box.style.opacity = 1;
//        box.classList.remove('recent');
//    }, 10);
//}
//let sent_audio = new Audio('sent.wav');
//function send() {
//    let message = document.getElementById('input_box').value;
//    if (message == '') return;
//    document.getElementById('input_box').value = '';
//    window.pywebview.api.send_message(message);
//    sent_audio.play();
//}
//let notif_audio = new Audio('notif.mp3');
//function notification(sender, content, count) {
//    notif_audio.play();
//    let notif = document.createElement('button');
//    notif.textContent = `Notification:
//    ${content}`;
//    notif.onclick = () => chat_interface(sender);
//    notif.classList.add('box');
//    notif.style.padding = '15px';
//    notif.style.color = '#fbfffe';
//    notif.style.margin = '0 0 10px 0';
//    document.getElementById('notif_div').appendChild(notif);

//    notif_dot(sender, count);

//    setTimeout(() => {
//        document.getElementById('notif_div').removeChild(notif);
//    }, 4000);
//}

//function notif_dot(sender, count) {
//    let box = document.getElementById(sender);

//    let old_dot = box.querySelector('.new_message_dot');

//    if (old_dot == null) {
//        let dot = document.createElement('p');
//        dot.innerText = count;
//        dot.classList.add('new_message_dot');
//        box.appendChild(dot);
//    }
//    else {
//        old_dot.innerText = count;
//    }
//}


//function update_seen() {
//    document.querySelectorAll(`.not_seen`).forEach((not_seen) => {
//        not_seen.innerText = 'Seen';
//        not_seen.classList.add('seen', 'mark');
//        not_seen.classList.remove('not_seen');
//        not_seen.style.backgroundColor = 'forestgreen';
//    });
//    key_list = []
//}
//function similarityScore(a, b) {
//    a = a.toLowerCase();
//    b = b.toLowerCase();
//    if (a === b) return 1;
//    if (a.startsWith(b) || b.startsWith(a)) return 0.9;

//    let matches = 0;
//    for (let char of b) {
//        if (a.includes(char)) matches++;
//    }
//    return matches / Math.max(a.length, b.length);
//}

//let allUsers = [];

//document.getElementById('add_bar').addEventListener('focus', async () => {
//    let html_list = document.createElement('div');
//    html_list.id = 'users_list';
//    document.body.appendChild(html_list);

//    allUsers = await fetch("http://127.0.0.1:8000/get_all_usernames");
//    allUsers = allUsers.json();

//    html_list.classList.add('box');
//    renderUserList(allUsers);
//});

//document.getElementById('add_bar').addEventListener('input', () => {
//    let query = document.getElementById('add_bar').value;
//    let sorted = [...allUsers].sort((a, b) => {
//        return similarityScore(b, query) - similarityScore(a, query);
//    });
//    renderUserList(sorted);
//});

//document.getElementById('add_bar').addEventListener('blur', () => {
//    setTimeout(() => {
//        let list = document.getElementById('users_list');
//        if (list != null) {
//            document.body.removeChild(list);
//        }
//    }, 500);
//});

//function renderUserList(list) {
//    let html_list = document.getElementById('users_list');
//    if (!html_list) return;
//    html_list.innerHTML = '';
//    list.forEach((name) => {
//        const btn = document.createElement("button");
//        btn.textContent = name;
//        btn.addEventListener("click", () => upload(name));
//        html_list.appendChild(btn);
//    });
//}

//function upload(name) {
//    document.getElementById('add_bar').value = name;
//}

