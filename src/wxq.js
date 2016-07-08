var w = $(window).innerWidth();
var h = $(window).innerHeight();
var socket = io('https://wall.cgcgbcbc.com');
var ann = $('.announce');
var msgbx = $('.messagebox');
var msg = $('.message');
var head = $('.head');
var i;
var haveAdmin = false;

function setMarquee(scrollamount, behavior, height, txt)
{
	if(height == -1) return '<marquee direction="left" scrolldelay=20 scrollamount='
			+ scrollamount + ' align="middle" behavior="' + behavior
			+ '">' + txt + "</marquee>";
	else return '<marquee direction="left" scrolldelay=20 scrollamount='
			+ scrollamount + ' align="middle" behavior="' + behavior
			+ '" height=' + height + '>' + txt + "</marquee>";
}

function getLength(str)   
{
    return str.replace(/[^\x00-\xff]/g,"aa").length;
};

function setMessage(nm, txt, isAdmin)
{
	var str = '';
	str += '<span style="font-weight:bold; font-size:'
		+ Math.floor(h*0.06) + 'px">' + nm + '</span>';
	if(getLength(txt) >= 20*(w-h*0.25)/h)
	{
		var spd = Math.floor(3 * (getLength(txt) - 20*(w-h*0.25)/h));
		str += '<span style="font-size:' + Math.floor(h*0.09) + 'px">';
		if(isAdmin) str += '<b>';
		str += setMarquee(((spd>30)?30:spd), 'alternate', Math.floor(h*0.11), txt);
		if(isAdmin) str += '</b>';
		str += "</span>";
	}
	else
	{
		str += '<br/><span style="font-size:' + Math.floor(h*0.1) + 'px">';
		if(isAdmin) str += '<b>' + txt + '</b></span>';
		else str += txt + '</span>';
	}
	return str;
}

function setStyle()
{
	ann[0].style = 'font-size:' + Math.floor(h*0.1) + 'px';
	ann[0].setAttribute('style', 'font-size:' + Math.floor(h*0.1) + 'px');
	msgbx[0].cellpadding = Math.floor(h*0.01);
	msgbx[0].setAttribute('cellpadding', Math.floor(h*0.01));
	msgbx[0].cellspacing = Math.floor(h*0.02);
	msgbx[0].setAttribute('cellspacing', Math.floor(h*0.02));
	setStyleQuick();
}

function setStyleQuick()
{
	for(i = 0; i < msg.length; ++i)
	{
		msg[i].bgcolor = '#F0F0F0';
		msg[i].setAttribute('bgcolor', '#F0F0F0');
		msg[i].width = w + 'px';
		msg[i].setAttribute('width', w + 'px');
	}
	for(i = 0; i < head.length; ++i)
	{
		head[i].width = Math.floor(h*0.2);
		head[i].setAttribute('width', Math.floor(h*0.2));
		head[i].height = Math.floor(h*0.2);
		head[i].setAttribute('height', Math.floor(h*0.2));
	}
}

function init()
{
	setStyle();
	msgbx[0].style = 'display: none';
	msgbx[0].setAttribute('style', 'display: none');
	$.get('https://wall.cgcgbcbc.com/api/messages?num=3', function(data)
	{
		for(i = 0; i < 3; i++)
		{
			head[i].src = data[2-i].headimgurl;		
			head[i].setAttribute('src', data[2-i].headimgurl);
			msg[i].innerHTML = setMessage(data[2-i].nickname, data[2-i].content, false);
		}
	})
	msgbx[0].style = 'display: inline';
	msgbx[0].setAttribute('style', 'display: inline');
}

var announcement = '这是公告这是公告这是公告这是公告这是公告';
ann[0].innerHTML = setMarquee(30, 'scroll', -1, announcement);

init();

socket.on('new message', function(data)
{
	var idd;
	var newIndex = $('.message').length;
	$('.messagebox').append('<tr id="msg' + newIndex + '"><td>'
		+ '<img class="head" alt="头像"></td><td class="message"></td></tr>');
	msg = $('.message');
	head = $('.head');
	setStyleQuick();
	head[newIndex].src = data.headimgurl;		
	head[newIndex].setAttribute('src', data.headimgurl);
	msg[newIndex].innerHTML = setMessage(data.nickname, data.content, false);
	if(haveAdmin)
	{
		$('#msg1').remove();
		for(i = 2; i <= newIndex; ++i)
		{
			idd = document.getElementById('msg' + i);
			idd.id = 'msg' + (i-1);
			idd.setAttribute('id', 'msg' + (i-1));
		}
	}
	else 
	{
		$('#msg0').remove();
		for(i = 1; i <= newIndex; ++i)
		{
			idd = document.getElementById('msg' + i);
			idd.id = 'msg' + (i-1);
			idd.setAttribute('id', 'msg' + (i-1));
		}
	}
});

function rmAdmin()
{
	haveAdmin = false;
}

socket.on('admin', function(data)
{
	console.log(data);
	haveAdmin = true;
	$('.head')[0].src="xuxu9110.github.io/ext/image/admin.png";
	$('.message')[0].innerHTML = setMessage(data.nickname, data.content, true);
	setTimeout(rmAdmin, 10000);
});

var foot = '--- 微信墙 made by 许骏洲 ---';
$('.foot')[0].style = 'font-size:' + Math.floor(h*0.04) + 'px';
$('.foot')[0].setAttribute('style', 'font-size:' + Math.floor(h*0.04) + 'px');
$('.foot')[0].innerHTML = foot;