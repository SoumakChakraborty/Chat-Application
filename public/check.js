var x=document.querySelector('.formdiv form #password');
var y=document.querySelector('.formdiv form #retype-password');
var flag=false;
y.addEventListener('input',function()
{
    if(x.value==y.value)
      flag=true;
    else
      flag=false;  
});
function check()
{
    if(!flag)
    {
        x.classList.add('error');
        y.classList.add('error');
        return false;
    }
  return true;
}