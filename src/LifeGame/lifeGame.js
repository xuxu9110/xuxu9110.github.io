"use strict";

var world = document.getElementById('world');  //画布
var context = world.getContext('2d');
var width = 100;            //格点列数
var height = 50;            //格点行数
var size = 9;               //格点大小
var gap = 1;                //格点间隙
var interval = 100;         //生长一次用时
var cells = [];             //细胞状态
var cellNext = [];          //下一步细胞状态
var isGrowing = false;      //是否持续生长中
var i = 0;
var j = 0;                  //循环用序号

world.width = (size + gap) * width - gap;    //画布宽
world.height = (size + gap) * height - gap;  //画布高
context.fillStyle = 'black';                 //细胞颜色

//细胞初始化
function initCells()
{
	isGrowing = false;
	for(i = 0; i < height + 2; ++i)
	{
		cells[i] = [];
		for(j = 0; j < width + 2; ++j)
		{
			cells[i][j] = 0;
		}
	}
}

//将b的细胞状态复制到a里面
function copyCells(a, b)
{
	for(i = 0; i < height+2; ++i)
	{
		a[i] = [];
		for(j = 0; j < width+2; ++j)
		{
			a[i][j] = b[i][j];
		}
	}
}

//根据坐标计算邻居个数
function sumNeighbour(x, y)
{
	var sum = 0;
	var xi = [-1, -1, -1, 0, 0, 1, 1, 1];
	var yi = [-1, 0, 1, -1, 1, -1, 0, 1];
	for(var j = 0; j < 8; ++j)
	{
		sum = sum + cells[x+xi[j]][y+yi[j]];
	}
	return sum;
}

//细胞生长
function growCells()
{
	cellNext = [];
	var neighbour;

	for(i = 0; i < height + 2; ++i)
	{
		cellNext[i] = [];
		for(j = 0; j < width + 2; ++j)
		{
			if(i === 0 || j === 0 || i === height + 1 || j === width + 1)
			{
				//画布边界外的细胞
				cellNext[i][j] = 0;
			}
			else
			{
				//画布内的细胞
				neighbour = sumNeighbour(i,j);
				if(neighbour === 3)
				{
					//有3个邻居则生
					cellNext[i][j] = 1;
				}
				else if(neighbour === 2)
				{
					//有2个邻居则不变
					cellNext[i][j] = cells[i][j];
				}
				else
				{
					//其他情况则死
					cellNext[i][j] = 0;
				}
			}
		}
	}
	copyCells(cells, cellNext);
};

//绘制细胞
function drawCells()
{
	context.clearRect(0, 0, world.width, world.height);
	for(i = 1; i < height + 1; ++i)
	{
		for(j = 1; j < width + 1; ++j)
		{
			if(cells[i][j] === 1)
			{
				//生则绘制
				context.fillRect(
					(size + gap) * (j - 1), (size + gap) * (i - 1), size, size);
			}
		}
	}
	if(isGrowing)
	{
		//持续生长
		function f()
		{
			growCells();
			drawCells();
		};
		setTimeout(f, interval);
	}
};

//游戏开始
function startGame()
{
	isGrowing = true;
	document.getElementById('start').disabled = true;
	document.getElementById('stop').disabled = false;
	document.getElementById('step').disabled = true;
	document.getElementById('clean').disabled = true;
	growCells();
	drawCells();
};

//游戏停止
function stopGame()
{
	isGrowing = false;
	document.getElementById('start').disabled = false;
	document.getElementById('stop').disabled = true;
	document.getElementById('step').disabled = false;
	document.getElementById('clean').disabled = false;
};

//下一步
function nextStep()
{
	isGrowing = false;
	growCells();
	drawCells();
};

//清空
function cleanWorld()
{
	isGrowing = false;
	initCells();
	context.clearRect(0, 0, world.width, world.height);
};

//在画布上点击
function clickOnWorld(e)
{
	if(isGrowing)
	{
		//还在生长中的状态则不处理
		return;
	}
	//改变点击处对应的细胞状态
	var offset = world.getBoundingClientRect();
	i = Math.floor((e.clientY - offset.top) / (size + gap)) + 1;
	j = Math.floor((e.clientX - offset.left) / (size + gap)) + 1;
	cells[i][j] = 1 - cells[i][j];
	drawCells();
};

world.addEventListener('click', clickOnWorld, false);
initCells();