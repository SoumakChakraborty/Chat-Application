var socket=io();
$('#senddiv a').on('click',function()
{
    var user=document.querySelector('#userinfo');
    var actual=user.textContent.split("-");
    socket.emit('chat message',actual[1]+":"+$('#chat').val());
    var http=new XMLHttpRequest();
    http.open('GET','https://glacial-beyond-53332.herokuapp.com/check/'+$('#chat').val(),true);
    http.onreadystatechange=function()
    {
         if(http.readyState==4&&http.status==200)
         {

             var ob=JSON.parse(http.response); 
             if(ob.polarity=="neutral")
               $('#chatwindow').append('<li id="sendlist">'+actual[1]+":"+$('#chat').val()+" "+":|"+"</li>");
             else if(ob.polarity=="positive")
               $('#chatwindow').append('<li id="sendlist">'+actual[1]+":"+$('#chat').val()+" "+":)"+"</li>");
             else
               $('#chatwindow').append('<li id="sendlist">'+actual[1]+":"+$('#chat').val()+" "+":("+"</li>");   
            $('#chat').val("");
         }
    };
    http.send();
 });
 socket.on('chat message',function(msg)
 { 
    $('#chatwindow').append('<li id="recvlist">'+msg+"</li>");
  });