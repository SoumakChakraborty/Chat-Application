$('.formdiv').on('click','#user',function(e)
{
    if(e.target.id=="signupanc")
    {
        $('.formdiv').addClass('formdiv-signup');
        $('.formdiv').append('<a href="#"><i class="fas fa-times" id="close"></i></a>');   
        $('.formdiv').append('<form></form>');
        $('.formdiv form').attr('action','/signup');
        $('.formdiv form').attr('method','POST');
        $('.formdiv form').attr('onsubmit','return check()');
        $('.formdiv form').append('<input type="text" name="fname" id="fname" placeholder="First Name" required><br>');
        $('.formdiv form').append('<input type="text" name="lname" id="lname" placeholder="Last Name" required><br>');
        $('.formdiv form').append('<input type="email" name="userid" id="userid" placeholder="Username" required><br>');
        $('.formdiv form').append('<input type="password" name="password" id="password" placeholder="Password" required><br>');
        $('.formdiv form').append('<input type="password" id="retype-password" placeholder="Renter Password" required><br>');
        $('.formdiv form').append('<input type="submit" value="Sign Up" id="submit">');
        $('.formdiv').slideDown();
        $('body').append('<script src="/check.js"></script>');
    }
    else if(e.target.id=="forgotanc")
    {
        $('.formdiv').append('<a href="#"><i class="fas fa-times" id="close"></i></a>');   
        $('.formdiv').append('<form></form>');
        $('.formdiv form').attr('action','/resetpass');
        $('.formdiv form').attr('method','POST');
        $('.formdiv form').append('<input type="email" name="usermail" id="userid" placeholder="Enter email" required><br>');
        $('.formdiv form').append('<input type="submit" value="Reset password" id="submit">');
        $('.formdiv').slideDown();
        
    }
});
$('.formdiv').on('click','a','i',function()
{
    $('.formdiv').removeClass('formdiv-signup');
    $('.formdiv a i').remove();
    $('.formdiv form').remove();
    $('.formdiv').slideUp();
});