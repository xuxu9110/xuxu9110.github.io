var ii = 0, str = '', x;
function makeBanner(){
	var banner = document.getElementsByClassName('banner');
	for(x=0; x<banner.length; ++x)
	{
		str='';
		var p;
		for(p=0;p<document.body.clientWidth / 2;++p)
		{
			//str+=Math.floor(Math.random()*10);
			if(p%10==ii){
				str+=Math.floor(Math.random()*10);
			}
			else
			{
				str+='.';
			}
		}
		banner[x].innerHTML = str;	
	}
	ii = (ii+1)%10;
}
setInterval(function(){makeBanner();},40);