var d1 = document.documentElement, d2 = document.body;//适配不同浏览器
var goTopBtn = document.getElementById("goTop");
window.onload=function (){
	window.onscroll = function(){
		var d = d1.scrollTop || d2.scrollTop;
		//距顶部距离大于20则显示，否则不显示
		if(d > 20){
			goTopBtn.style.display="block";
		}
		else{
			goTopBtn.style.display="none";
		}
	}
}
function GoTop(){
	this.timer = setInterval(function(){
		//移动有动画效果
		if(d1.scrollTop)
		{
			d1.scrollTop -= Math.ceil(d1.scrollTop * 0.1);
			if(d1.scrollTop <= 10) clearInterval(this.timer);
		}
		if(d2.scrollTop)
		{
			d2.scrollTop -= Math.ceil(d2.scrollTop * 0.1);
			if(d2.scrollTop <= 10) clearInterval(this.timer);
		}
	}
	,5);
}
document.onkeydown = function(e){
	//按下ctrl+↑返回顶部
	e = window.event || e;
	if(e.keyCode == 38 && e.ctrlKey) GoTop();
}
goTopBtn.init = function(p){
	//改变位置
	if(p.hasOwnProperty("x") && p.hasOwnProperty("y"))
	{
		this.style="left:" + p.x + "px; top:" + p.y + "px";
		this.setAttribute("style","left:"+p.x+"px; top:"+p.y+"px");
	}
	if(p.hasOwnProperty("position"))
	{
		//一到四分别代表左上、右上、左下、右下
		switch(p.position)
		{
			case 1:
			this.setAttribute("style","left:5%;top:5%");
			this.style="left:5%;top:5%";
			break;
			case 2:
			this.setAttribute("style","left:90%;top:5%");
			this.style="left:90%;top:5%";
			break;
			case 3:
			this.setAttribute("style","left:5%;top:90%");
			this.style="left:5%;top:90%";
			break;
			case 4:
			this.setAttribute("style","left:90%;top:90%");
			this.style="left:90%;top:90%";
			break;
			default:break;
		}
	}
}
var i = 0;
function initTest()
{
	switch(i)
	{
		case 0:goTopBtn.init({x:100, y:100});break;
		case 1:goTopBtn.init({x:200, y:300});break;
		case 2:goTopBtn.init({position:1});break;
		case 3:goTopBtn.init({position:2});break;
		case 4:goTopBtn.init({position:3});break;
		case 5:goTopBtn.init({position:4});break;
	}
	++i;
	if(i > 5) i = 0;
}