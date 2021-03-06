var menuDiv = document.getElementById("backtomenu");
var startDiv = document.getElementById("start");
var introductionDiv = document.getElementById("introduction");
var canvas = document.getElementById("mycanvas");
var audio = document.getElementById("bgMusic");
var notification = document.getElementById("notification");
var difficultyDiv = document.getElementById("difficultyDiv");
var scaleDiv = document.getElementById("scaleDiv");
var bossDiv = document.getElementById("bossStage");
bossDiv.onclick = function()
{
	init();
	bossWarning();
}
menuDiv.style.cursor = "pointer";
var enemyNum = 20;
var growSpeed;
var canvasWidth = window.innerWidth*0.9;
var canvasHeight = window.innerHeight*0.9;
var scale = 1;
var speedScale = 1.5;
var context = canvas.getContext('2d');
var hero;
var timeoutID = new Array();
var timeIntervalID;
var enemy = new Array(enemyNum);
var goodItem;
var boss;
var isThereGoodItem = false;
var isThereBadItem = false;
var isBossStage = false;
var badItem;
var bombNum = 5;
var bomb = new Array(bombNum);
var moveLeft = false;
var moveUp = false;
var moveRight = false;
var moveDown = false;
var difficulty = 1;
mainMenu();
function newEnemy(i)
{
	var seed = Math.random();
	var sz = hero.r;
	var p = 0.45 - 0.025 * difficulty;
	if(seed < p) sz *= 0.4 + 0.6 * seed / p;
	else sz *= 0.3*(seed-p)/(1-p) + 1;
	var speed = 2 + 240/(sz+50);
	var degree = Math.random()*2*Math.PI;
	var speedX = speed * Math.sin(degree);
	var speedY = speed * Math.cos(degree);
	switch(i%4)
	{
		case 0:
		enemy[i] = new myCircle(-sz, Math.random()*canvas.height, sz, Math.abs(speedX), speedY, "red");
		break;
		case 1:
		enemy[i] = new myCircle(Math.random()*canvas.width, -sz, sz, speedX, Math.abs(speedY), "red");
		break;
		case 2:
		enemy[i] = new myCircle(canvas.width+sz, Math.random()*canvas.height, sz, -Math.abs(speedX), speedY, "red");
		break;
		case 3:
		enemy[i] = new myCircle(Math.random()*canvas.width, canvas.height+sz, sz, speedX, -Math.abs(speedY), "red");
		break;
	}
}
function createBomb(x,y)
{
	var degree = Math.random()*2*Math.PI/bombNum;
	for (var i = 0; i < bombNum; i++) {
		var speedX = 6 * Math.sin(degree);
		var speedY = 6 * Math.cos(degree);
		bomb[i] = new myItem(x,y,10,speedX,speedY,"black");
		degree += 2*Math.PI/bombNum;
	}
}
function initBossStage()
{
	isBossStage = true;
	var speed = parseInt(difficulty/2)+1;
	var degree = Math.random()*2*Math.PI;
	var speedX = speed * Math.sin(degree);
	var speedY = speed * Math.cos(degree);
	boss = new myItem(canvas.width / 2, 120, 32+difficulty*8, speedX, speedY, "#800000");
	hero.x = canvas.width / 2;
	hero.y = canvas.height * 0.7;
	hero.r = 10;
	hero.speedX = 6;
	hero.speedY = 6;
	delete enemy;
	enemyNum = parseInt(difficulty / 2) + 9;
	enemy = new Array(enemyNum);
	for(var i = 0; i < enemyNum; ++i)
	{
		newEnemy(i);
	}
	bombNum = parseInt(difficulty / 2) + 4;
	for(var i = 0; i < bombNum; ++i)
	{
		createBomb(boss.x, boss.y);
	}
	for(var i = 0; i < timeoutID.length; ++i)
	{
		clearTimeout(timeoutID[i]);
	}
	moveLeft = false;
	moveUp = false;
	moveRight = false;
	moveDown = false;
	scale = 1;
}
function myItem(x,y,r,speedX,speedY,color)
{
	this.x = x;
	this.y = y;
	this.r = r;
	this.speedX = speedX;
	this.speedY = speedY;
	this.color = color;
}
function gameNotification(str, func)
{
	notification.innerHTML = str;
	notification.style.display = "block";
	context.clearRect(0,0,canvas.width,canvas.height);// 清空画布
	if(typeof(timeIntervalID) != "undefined") clearInterval(timeIntervalID);
	notification.onclick = func;
}
function mainMenu()
{
	audio.pause();
	if(typeof(timeIntervalID) != "undefined") clearInterval(timeIntervalID);
	difficultyDiv.style.display = "block";
	startDiv.style.display = "block";
	introductionDiv.style.display = "block";
	canvas.style.display = "none";
	menuDiv.style.display = "none";
	scaleDiv.style.display = "none";
	notification.style.display = "none";
	document.getElementById("difficulty").innerHTML = difficulty;
	document.getElementById("diffUp").onclick = function()
	{
		difficulty = (difficulty >= 10)?10:(difficulty+1);
		document.getElementById("difficulty").innerHTML = difficulty;
	}
	document.getElementById("diffDown").onclick = function()
	{
		difficulty = (difficulty <= 1)?1:(difficulty-1);
		document.getElementById("difficulty").innerHTML = difficulty;
	}
}
function startGame()
{
	menuDiv.style.display = "block";
	introductionDiv.style.display = "none";
	startDiv.style.display = "none";
	difficultyDiv.style.display = "none";
	canvas.style.display = "block";
	notification.style.display = "none";
	scaleDiv.style.display = "block";
}
function init()
{
	startGame();
	growSpeed = 1.1 - difficulty / 10;
	audio.pause();
	audio.loop = true;
	audio.src = "https://xuxu9110.github.io/ext/music/bgm.mp3";
	audio.play();
	isBossStage = false;
	enemyNum = difficulty + 14;
	for(var i = 0; i < timeoutID.length; ++i)
	{
		clearTimeout(timeoutID[i]);
	}
	moveLeft = false;
	moveUp = false;
	moveRight = false;
	moveDown = false;
	scale = 1;
	hero = new myCircle(canvasWidth/2,canvasHeight/2,10,6,6,"blue");
	canvas.height = canvasHeight;
	canvas.width = canvasWidth;
	context.clearRect(0,0,canvas.width,canvas.height);// 清空画布
	context.strokeRect(0,0,canvas.width,canvas.height);
	for(var i = 0; i < enemyNum; ++i)
	{
		newEnemy(i);
	}
	if(isThereGoodItem)
	{
		delete(goodItem);
		isThereGoodItem = false;
	}
	if(isThereBadItem)
	{
		delete(BadItem);
		isThereBadItem = false;
	}
	if(typeof(timeIntervalID) != "undefined") clearInterval(timeIntervalID);
	timeIntervalID = setInterval(drawCanvas,20);
}
function drawCircle(c)
{
	if (canvas == null) {
	return false;
	}
	context.beginPath();
	context.arc(c.x, c.y, c.r, 0, Math.PI * 2, true);
	context.closePath();
	context.fillStyle = c.color;
	context.fill();
}
function drawGoodItem(item)
{
	drawCircle(item);
	context.fillStyle = "white";
	context.fillRect(item.x-0.8*item.r,item.y-0.2*item.r,1.6*item.r,0.4*item.r);
	context.fillRect(item.x-0.2*item.r,item.y-0.8*item.r,0.4*item.r,1.6*item.r);
}
function drawBadItem(item)
{
	drawCircle(item);
	context.fillStyle = "white";
	context.fillRect(item.x-0.8*item.r,item.y-0.2*item.r,1.6*item.r,0.4*item.r);
}
function drawBoss()
{
	drawCircle(boss);
	context.fillStyle ="white";
	context.beginPath();
	context.moveTo(boss.x-0.6*boss.r,boss.y-0.6*boss.r);
	context.lineTo(boss.x-0.1*boss.r,boss.y-0.3*boss.r);
	context.lineTo(boss.x-0.3*boss.r,boss.y-0.1*boss.r);
	context.fill();
	context.beginPath();
	context.moveTo(boss.x+0.6*boss.r,boss.y-0.6*boss.r);
	context.lineTo(boss.x+0.1*boss.r,boss.y-0.3*boss.r);
	context.lineTo(boss.x+0.3*boss.r,boss.y-0.1*boss.r);
	context.fill();
}
function inside(c)
{
	return (c.x >= -c.r) && (c.x <= canvas.width + c.r) && (c.y >= -c.r) && (c.y <= canvas.height + c.r);
}
function isCollided(c1,c2)
{
	var distance = Math.sqrt((c1.x-c2.x)*(c1.x-c2.x)+(c1.y-c2.y)*(c1.y-c2.y));
	if (distance <= c1.r+c2.r) return true;
	else return false;
}
function myCircle(x,y,r,speedX,speedY,color)
{
	this.x = x;
	this.y = y;
	this.r = r;
	this.speedX = speedX;
	this.speedY = speedY;
	this.color = color;
	this.grow = function(c){
		scale = this.speedX / (3 + 105/(this.r+25));
		//this.r = Math.sqrt(this.r * this.r + c.r * c.r);
		this.r = Math.sqrt(this.r * this.r + growSpeed * c.r * c.r);
		this.speedX = scale*(3 + 105/(this.r+25));
		this.speedY = scale*(3 + 105/(this.r+25));
	}
}
function moveHero()
{
	if(moveLeft) hero.x -= hero.speedX;
	if(moveUp) hero.y -= hero.speedY;
	if(moveRight) hero.x += hero.speedX;
	if(moveDown) hero.y += hero.speedY;
	if(hero.x < hero.r) hero.x = hero.r;
	if(hero.x > canvas.width - hero.r) hero.x = canvas.width - hero.r;
	if(hero.y < hero.r) hero.y = hero.r;
	if(hero.y > canvas.height - hero.r) hero.y = canvas.height - hero.r;
}
function moveEnemy()
{
	for(var i = 0; i < enemyNum; ++i)
	{
		enemy[i].x += enemy[i].speedX;
		enemy[i].y += enemy[i].speedY;
		if(!inside(enemy[i])){
			delete(enemy[i]);
			newEnemy(i);
		}
	}
}
function moveBoss()
{
	boss.x += boss.speedX;
	boss.y += boss.speedY;
	if(boss.x < boss.r) boss.speedX *= -1;
	else if(boss.x > canvas.width - boss.r) boss.speedX *= -1;
	if(boss.y < boss.r) boss.speedY *= -1;
	else if(boss.y > canvas.height - boss.r) boss.speedY *= -1;
}
function moveBomb()
{
	for(var i = 0; i < bombNum; ++i)
	{
		bomb[i].x += bomb[i].speedX;
		bomb[i].y += bomb[i].speedY;
		if(bomb[i].x < bomb[i].r) bomb[i].speedX *= -1;
		else if(bomb[i].x > canvas.width - bomb[i].r) bomb[i].speedX *= -1;
		if(bomb[i].y < bomb[i].r) bomb[i].speedY *= -1;
		else if(bomb[i].y > canvas.height - bomb[i].r) bomb[i].speedY *= -1;
	}
}
function moveAndCreateItem()
{
	if(isThereGoodItem)
	{
		goodItem.x += goodItem.speedX;
		goodItem.y += goodItem.speedY;
		drawGoodItem(goodItem);
		if(!inside(goodItem))
		{
			delete(goodItem);
			isThereGoodItem = false;
		}
	}
	else if (Math.random()<0.01)
	{
		switch(parseInt(Math.random()*4))
		{
		case 0:
			goodItem = new myItem(-15,Math.random()*canvas.height,15,Math.random()*6,Math.random()*12-6,"#8080FF");
			break;
		case 1:
			goodItem = new myItem(Math.random()*canvas.width,-15,15,Math.random()*12-6,Math.random()*6,"#8080FF");
			break;
		case 2:
			goodItem = new myItem(canvas.width+15,Math.random()*canvas.height,15,-Math.random()*6,Math.random()*12-6,"#8080FF");
			break;
		case 3:
			goodItem = new myItem(Math.random()*canvas.width,canvas.height+15,15,Math.random()*12-6,-Math.random()*6,"#8080FF");
			break;
		}
		isThereGoodItem = true;
	}
	if(isThereBadItem)
	{
		badItem.x += badItem.speedX;
		badItem.y += badItem.speedY;
		drawBadItem(badItem);
		if(!inside(badItem))
		{
			delete(badItem);
			isThereBadItem = false;
		}
	}
	else if (Math.random()<0.01)
	{
		switch(parseInt(Math.random()*4))
		{
		case 0:
			badItem = new myItem(-15,Math.random()*canvas.height,15,Math.random()*6,Math.random()*12-6,"#000080");
			break;
		case 1:
			badItem = new myItem(Math.random()*canvas.width,-15,15,Math.random()*12-6,Math.random()*6,"#000080");
			break;
		case 2:
			badItem = new myItem(canvas.width+15,Math.random()*canvas.height,15,-Math.random()*6,Math.random()*12-6,"#000080");
			break;
		case 3:
			badItem = new myItem(Math.random()*canvas.width,canvas.height+15,15,Math.random()*12-6,-Math.random()*6,"#000080");
			break;
		}
		isThereBadItem = true;
	}
}
function enemyCollision()
{
	for(var i = 0; i < enemyNum; ++i)
	{
		if(isCollided(hero, enemy[i]))
		{
			if(hero.r > enemy[i].r)
			{
				hero.grow(enemy[i]);
				delete(enemy[i]);
				newEnemy(i);
			}
			else
			{
				gameOver();
				break;
			}
		}
	}
}
function accelerate()
{
	hero.speedX *= speedScale;
	hero.speedY *= speedScale;
	scale *= speedScale;
}
function decelerate()
{
	hero.speedX /= speedScale;
	hero.speedY /= speedScale;
	scale /= speedScale;
}
function itemCollision()
{
	if(isThereGoodItem && isCollided(hero,goodItem))
	{
		delete(goodItem);
		isThereGoodItem = false;
		accelerate();
		timeoutID.push(setTimeout(function(){decelerate();timeoutID.shift();},10000));
		
	}
	if(isThereBadItem && isCollided(hero,badItem))
	{
		delete(badItem);
		isThereBadItem = false;
		decelerate();
		timeoutID.push(setTimeout(function(){accelerate();timeoutID.shift();},10000));
	}
}
function bossWarning()
{
	audio.pause();
	audio.src = 'https://xuxu9110.github.io/ext/music/warning.mp3';
	audio.currentTime = 0;
	audio.play();
	gameNotification("BOSS STAGE!<br />click to continue",function(){
		initBossStage();
		timeIntervalID = setInterval(drawCanvas,20);
		notification.style.display = "none";
	});
}
function win()
{
	audio.pause();
	audio.src = 'https://xuxu9110.github.io/ext/music/win.mp3';
	audio.currentTime = 0;
	audio.loop = false;
	audio.play();
	gameNotification("CONGRATULATION!<br />You just won!<br />click to retry<br />difficulty: "+difficulty, init);
}
function gameOver()
{
	delete(hero);
	audio.pause();
	audio.src = 'https://xuxu9110.github.io/ext/music/gameover.mp3';
	audio.currentTime = 0;
	audio.play();
	gameNotification("GAME OVER!<br />click to retry",init);
}
function bossCollision()
{
	if (isCollided(hero,boss))
	{
		if(hero.r > boss.r)
		{
			hero.grow(boss);
			delete(boss);
			win();
		}
		else
		{
			gameOver();
		}
	}
}
function bombCollision()
{
	for(var i = 0; i < bombNum; ++i)
	{
		if(isCollided(hero, bomb[i]))
		{
			gameOver();
			break;
		}
	}
}
function drawCanvas()
{
	document.getElementById("scale").innerHTML = scale;
	document.getElementById("size").innerHTML = hero.r;
	context.clearRect(0,0,canvas.width,canvas.height);// 清空画布
	context.strokeRect(0,0,canvas.width,canvas.height);
	moveHero();
	moveEnemy();
	moveAndCreateItem();
	drawCircle(hero);
	for(var i = 0; i < enemyNum; ++i)
	{
		drawCircle(enemy[i]);
	}
	if(isBossStage)
	{
		moveBoss();
		moveBomb();
		for(var i = 0; i < bombNum; ++i)
		{
			drawCircle(bomb[i]);
		}
		drawBoss();
		bossCollision();
		bombCollision();
	}
	if(!isBossStage && hero.r > 0.4*canvas.height)
	{
		bossWarning();
	}
	enemyCollision();
	itemCollision();
}
startDiv.onclick = function()
{
	init();
}
menuDiv.onclick = function()
{
	mainMenu();
}
window.onload = function(){
	document.onkeydown = function(event){
		switch (event.keyCode)
		{
			case 37:
			moveLeft = true;
			break;
			case 38:
			moveUp = true;
			break;
			case 39:
			moveRight = true;
			break;
			case 40:
			moveDown = true;
			break;
		}
	}
	document.onkeyup = function(event){
		switch (event.keyCode)
		{
			case 37:
			moveLeft = false;
			break;
			case 38:
			moveUp = false;
			break;
			case 39:
			moveRight = false;
			break;
			case 40:
			moveDown = false;
			break;
		}
	}
}
