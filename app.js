var express=require('express');
var app=express();
var http=require('http').Server(app);
var conn=require("./modules/connection");
var session=require('express-session');
var flash=require('connect-flash');
var sha1=require('sha1');
var method=require("method-override");
var body=require('body-parser');
var io=require('socket.io')(http);
var emailjs=require('emailjs');
var text_api=require('aylien_textapi');
app.use(method("_method"));
var text=new text_api({
    application_id:"d8711ae6",
    application_key:"3f89f74d051984e04ae096e35ab61c42"
});
app.use(body.urlencoded({extended:true}));
app.use(flash());
app.use(session({
    secret:"This is secret to me and myself only",
    resave:false,
    saveUninitialized:false,
    cookie:{maxAge:94608000000,signed:true}
}));
app.set('view engine','ejs');
app.use(express.static('public'));
app.get("/",function(req,res)
{
    var state=isLoggedIn(req);
    if(state==false)  
     res.render('landing',{msg:req.flash("msg")});
    else
      res.redirect("/chat"); 
});
app.get("/chat",function(req,res)
{
   var state=isLoggedIn(req);
   if(state==false)
     res.redirect("/");
   else
   {
       conn.query("select * from user where username='"+req.session.uname+"'",function(e,r,f)
       {
          res.render("chatpage",{user:r[0].fname+" "+r[0].lname});
       });        
   }
});
app.get("/loggedusers",function(req,res)
{
    conn.query("select * from user U natural join(select * from state S where not exists(select * from state S1 where S.username=S1.username and S.username='"+req.session.uname+"'))R",function(err,result,fields)
    {
         var logged={};
         logged.user=[];
         if(result.length==0)
           res.json(logged);
         else
         {
             for(var i=0;i<result.length;i++)
               logged.user.push({fname:result[i].fname,lname:result[i].lname});
            res.json(logged);   
         }  
    });
});
app.post("/signup",function(req,res)
{
     var fname=req.body.fname;
     var lname=req.body.lname;
     var userid=req.body.userid;
     var pass=req.body.password;
     var hash=sha1(pass);
    conn.query("select * from user where username='"+userid+"'",function(err,result,fields)
    {
         if(result.length!=0)
         {
             req.flash("msg","Username exists");
             res.redirect("/");
         }
         else
         {
            conn.query("insert into user values('"+fname+"','"+lname+"','"+userid+"','"+hash+"')",function(e,r,f)
            {
            });
            res.redirect("/"); 
         }
    });   
});
app.post("/signin",function(req,res)
{
    var userid=req.body.userid;
    var password=req.body.password;
    var hash=sha1(password);
    conn.query("select * from user where username='"+userid+"'",function(err,result,field)
    {
        if(result.length==0)
        {
            req.flash("msg","Username does not exist");
            res.redirect("/");
        }
        else if(result[0].password==hash)
        {
            req.session.uname=userid;
            conn.query("insert into state values('"+userid+"','"+req.connection.remoteAddress+"','"+req.sessionID+"')",function(e,r,f)
            {
            });
            res.redirect("/chat");
        }
        else
        {
             req.flash("msg","Password does not match");
             res.redirect("/");
        } 
    });
});
app.get("/signout",function(req,res)
{
    conn.query("delete from state where username='"+req.session.uname+"' and sessid='"+req.sessionID+"'",function(e,r,f)
    {
    }); 
    req.session.destroy(function(err)
    {
       if(err)
        console.log(err);
       else
       {   
         res.redirect("/");
        } 
    });
});
function isLoggedIn(req)
{
    var user=req.session.uname;
    if(user==undefined)
      return false;
 return true;
}
io.on('connection',function(socket)
{
    socket.on('chat message',function(msg)
    { 
       var actual=msg.split(":"); 
       text.sentiment({
           text:actual[1]
       },function(err,response,ratelimits)
       {  
          if(response.polarity=="neutral") 
            socket.broadcast.emit('chat message',msg+" "+":|");
          else if(response.polarity=="positive")
            socket.broadcast.emit('chat message',msg+" "+":)");
          else
            socket.broadcast.emit('chat message',msg+" "+":(");
       }); 
    });
});
app.get("/check/:msg",function(req,res)
{
   text.sentiment({
       text:req.params.msg
   },function(err,response,ratelimits)
   {
       res.json(response);  
   });
});
app.get("/changepass",function(req,res)
{
    var state=isLoggedIn(req);
    if(state==false)
      res.redirect("/");
    else
      res.render("changepass");  
});
app.put("/changepass",function(req,res)
{
    var state=isLoggedIn(req);
    if(state==false)
      res.redirect("/");
    else
    {
        var password=req.body.password;
        conn.query("update user set password='"+sha1(password)+"' where username='"+req.session.uname+"'",function(err,result,fields)
        {
            res.redirect("/chat");
        });
    }
});
app.post("/resetpass",function(req,res)
{
   var email=req.body.usermail;
   var server=emailjs.server.connect({
       user:"yelpcamp500@gmail.com",
       password:"Windows90#",
       host:"smtp.gmail.com",
       ssl:true            
   });
   server.send({
       to:email,
       from:"yelpcamp500@gmail.com",
       text:"Dear user,\nPlease click on the link: http://localhost:3000/reset/"+email+" to reset your password.\n\nYours faithfully,\nChat Team"
   },function(err,msg)
   {
       console(err||msg);
   });
});
app.get("/reset/:user",function(req,res)
{
    res.render("resetpass",{user:req.params.user});
});
app.put("/reset/:user",function(req,res)
{
    var password=req.body.password;
    conn.query("update user set password='"+sha1(password)+"' where username='"+req.params.user+"'",function(err,result,fields)
    {
        res.redirect("/chat");
    });
});
http.listen(3000,'192.168.0.101',function()
{
    console.log('Server started');
});