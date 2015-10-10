var userId = localStorage.getItem("userId") || randomId(); // si no existe ingreamos un random
localStorage.setItem("userId",userId);
var socket = io.connect('http://localhost:3000/',{'forceNew':true});
var messagesCache;

socket.on('messages',function(data){

    messagesCache = data;
    render();

});

function render(){

    var data = messagesCache;
    var html = data.sort(function(a,b){
        return a.ts - b.ts;//devuelve en el orden que s ehan ingresado
    }).map(function(data,index){
        return ("<form class=message onsubmit='return likeMessage(messagesCache["+index+"])'><div class='name'>"+data.userName+"</div><a href='"+data.content.link+"' class='message' target='blank'>"+data.content.text+"</a><div class='time'>"+moment(data.ts).fromNow()+"</div><input type=submit class='likes-count' value='"+data.likedBy.length+"' Hearts/></form>");
    }).join(" ");

    document.getElementById('messages').innerHTML = html;
}

function randomId(){
  return Math.floor(Math.random() * 1e12);
}


function likeMessage(message){

  var index = message.likedBy.indexOf(userId);
  if (index < 0) {
    message.likedBy.push(userId);
  } else {
    message.likedBy.splice(index,1);
  }

  socket.emit("update-message",message);
  render();
  return false;
}



function addMessage(e){
  var payload = {
    content:{
      text:document.getElementById("message").value,
      link:document.getElementById("linkAddress").value,
    },
    messageId:randomId(),
    userName:document.getElementById("username").value,
    userId:userId,
    likedBy:[],
    ts:Date.now()
  };

  socket.emit("new-message",payload); // enviamos los datos
  return false;
}


