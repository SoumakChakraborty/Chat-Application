var flag=false;
$('#signindiv a').on('click',function()
{
   if(!flag)
   { 
    $('.formdiv').append('<a href="#"><i class="fas fa-times" id="close"></i></a>');   
    $('.formdiv').append('<form></form>');
    $('.formdiv form').attr('action','/signin');
    $('.formdiv form').attr('method','POST');
    $('.formdiv form').append('<input type="email" name="userid" id="userid" placeholder="Username" required><br>');
    $('.formdiv form').append('<input type="password" name="password" id="password" placeholder="Password" required><br>');
    $('.formdiv form').append('<input type="submit" value="Sign In" id="submit">');
    $('.formdiv').append('<div id="user"><div id="forgot"><a href="#" id="forgotanc">Forgot password?<a></div><div id="signup"><a href="#" id="signupanc">Sign Up<a></div></div>');
    $('.formdiv').slideDown();
    flag=true;
   }
   else
   {
       $('.formdiv a i').remove();
       $('.formdiv form').remove();
       $('.formdiv #user').remove();
       $('.formdiv').slideUp();
       flag=false;
   }
});
$('.formdiv').on('click','a','i',function()
{
    $('.formdiv a i').remove();
      $('.formdiv form').remove();
       $('.formdiv #user').remove();
       $('.formdiv').slideUp();
       flag=false; 
});