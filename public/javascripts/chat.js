var chatbox = document.getElementById("messages");
var contacts = document.getElementById("messageContacts");
var contactList = [];

var active;

//Loads and displays messages for the chosen contact
function getMessages(contactID) {
    manageActive(contactID);
    $.ajax({
        url: "/api/users/" + localStorage.userID + "/contacts/" + contactID+"/messages",
        method: "get",
        dataType: "json",
        success: function (res, status) {
            if (res.err) return;
            var html = "";

            for (i in res) {

                date = res[i].messageDate.slice(0, 10);
                time = res[i].messageDate.slice(11, 16);
                if (res[i].messageFromID == localStorage.userID) {
                    html += '<div class="media w-50 ml-auto mb-3"><div class="media-body"><div class="bg-primary rounded py-2 px-3 mb-2"><p class="text-small mb-0 text-white">' + res[i].message + '</p></div><p class="small text-muted">' + date + ' | ' + time + '</p></div></div>'
                   
                }
                else {
                    html += '<div class="media w-50 mb-3""><div class="media-body ml-3"><div class="bg-light rounded py-2 px-3 mb-2"><p class="text-small mb-0 text-muted">' + res[i].message + '</p></div><p class="small text-muted">' + date + ' | ' + time + '</p></div></div>'
                }
                
            }
            chatbox.innerHTML = html;

        },
        error: function () {

        }
    })
}
// Loads and list of contacts for logged user
function getContacts() {
    $.ajax({
        url: '/api/users/' + localStorage.userID + '/contacts',
        method: 'get',
        dataType: 'json',
        success: function (res, status) {
            if (res.err) return;
            var html = "";
            for (i in res) {
                if(res[i].userID != localStorage.messageToID && localStorage.messageToName != res[i].username){
                    html += '<a id="' + res[i].userID + '" onclick="getMessages(' + res[i].userID + ')" class="list-group-item list-group-item-action  rounded-0"><div class="media"><img src="https://res.cloudinary.com/mhmd/image/upload/v1564960395/avatar_usae7z.svg" alt="user" width="50" class="rounded-circle"><div class="media-body ml-4"><div class="d-flex align-items-center justify-content-between mb-1"><h6 class="mb-0">' + res[i].username + '</h6></div></div></div></a>'
                }
                if(localStorage.messageToID != undefined  && localStorage.messageToName != undefined) {
                    newContactBox(localStorage.messageToID,localStorage.messageToName)
                    localStorage.removeItem('messageToID');
                    localStorage.removeItem('messageToName');  
                }
                contactList.push(res[i].userID)

            }

            contacts.innerHTML = contacts.innerHTML+ html ;
        }
    })
}

//Sends a new message to the user whos conversation is displaying
$('#sendMessage').click(function (evt) {
    evt.preventDefault();
    var contact = active.id;
    $.ajax({
        url: "/api/users/" + localStorage.userID + "/contacts/" + contact + "/messages",
        method: "post",
        contentType: "application/json",
        data: JSON.stringify({ message: $('#Message').val() }),
        success: function (res, status) {
            $('#Message').val("")
            getMessages(contact);
        }
        , error: function () { }
    });

})

window.onload = function () {
    getContacts();
}
setInterval(function () {
    if (active.id != undefined)
        getMessages(active.id)
}, 5000)
// Creates contact box for a new contact
function newContactBox(id,name){
    for(i in contactList){
        if(contactList[i] == id){
            alert('Chat already created, check your Recent tab');
            return;
        }
    }
    var html = "";
        html += '<a id="' + id + '" onclick="getMessages(' + id + ')" class="list-group-item list-group-item-action  rounded-0"><div class="media"><img src="https://res.cloudinary.com/mhmd/image/upload/v1564960395/avatar_usae7z.svg" alt="user" width="50" class="rounded-circle"><div class="media-body ml-4"><div class="d-flex align-items-center justify-content-between mb-1"><h6 class="mb-0">' + name + '</h6></div></div></div></a>'
        contacts.innerHTML = html + contacts.innerHTML;

    manageActive(id);
    getMessages(id);
}
//Receives contact from alert box and sends to database to check id contact exists in DB
function newContact(){
    var user = prompt("Enter username (WARNING: Usernames are case sensitive)", "ex:Mooz");

    if (user != null) {
    $.ajax({
        url: "/api/users/"+user,
        method: "get",
        contentType: "application/json",
        success: function (res, status) {
            if(res.length == 0)alert('Username not found - CAUSE: Mistyped or not existent')
            else{newContactBox(res[0].userID,user)
            }
        }
        , error: function () { 
            alert('There was an error between you and us, we are sorry about that. Please try again later')
        }
    });
    }
}


