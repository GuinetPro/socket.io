var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var messages = [{
      userId:1,
      messageId:10,
      userName:"Asha Greyjoy",
      content:{
        text:"The stone tree of the Stonetrees.",
        link:"http://awoiaf.westeros.org/index.php/House_Stonetree"
      },
      likedBy:[1],
      ts:Date.now() - 10000
    },
    {
        userId:2,
        messageId:11,
        userName:"Arya Stark",
        content:{
            text:"We'll come see this inn.",
            link:"http://gameofthrones.wikia.com/wiki/Inn_at_the_Crossroads"
        },
        likedBy:[2,3],
        ts:Date.now() - 100000
   },{

          userId:3,
          messageId:14,
          userName:"Cersei Lannister",
          content:{
            text:"Her scheming forced this on me.",
            link:"http://gameofthrones.wikia.com/wiki/Margaery_Tyrell"
          },
        likedBy:[],
        ts:Date.now() - 1000000
    }];
/*
app.get('/',function(req,res){

    res.send('Hello Wordl');
    console.log("Something connect to express");
});*/

app.use(express.static('app'));
app.use('/bower_components',express.static('bower_components'));


io.on('connection',function(socket){
    console.log("something connect to socket.io");
    socket.emit("messages",messages);
    socket.on('new-message',function(data){
        messages.push(data);
        io.sockets.emit("messages",messages);//enviar mesages entre socket

    });

  socket.on('update-message', function (data) {

    var message = messages.filter(function(a){
      return a.messageId == data.messageId;
    })[0];//devuevelme el primer elemento del array

    message.likedBy = data.likedBy;
    io.sockets.emit('messages',messages);
  });
});

server.listen(3000);



