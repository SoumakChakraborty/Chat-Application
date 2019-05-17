setInterval(function()
{
     var http=new XMLHttpRequest();
     http.open('GET','http://192.168.0.101:3000/loggedusers',true);
     http.onreadystatechange=function()
     {
          if(http.readyState==4&&http.status==200)
          {
              var result=JSON.parse(http.response); 
              $('#logdiv #logdivtitle').remove();
              $('#logdiv li').remove();
              if(result.user.length==0)
              {
                  $('#logdiv').append('<span id="logdivtitle">No users online</span>');
              }
              else
              {
                $('#logdiv').append('<span id="logdivtitle">Users online</span>');
                  for(var i=0;i<result.user.length;i++)
                   $('#logdiv').append('<li id="loggeduser"><img src="/user1.png" class="logged_icon">'+result.user[i].fname+" "+result.user[i].lname+'</li>');
              }
          }
     };
     http.send();
},500);