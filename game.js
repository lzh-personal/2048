var map = [[0,0,0],[0,0,0],[0,0,0]];//储存地图信息
var imglist = new Array();
var numlist = [2,4,8,16,32,64,128];
//初始化监听事件名称
var controlSet  = {
	start : 'touchstart',
	move : 'touchmove',
	end :'touchend',
}
//若是在PC端访问，更改需要监听的事件
if(isPC()){
	controlSet.start = 'mousedown';
	controlSet.move = 'mousemove';
	controlSet.end = 'mouseup';
}
//初始化图片列表
for(var i in numlist){
	var x = new Image();
	x.src = 'img/num'+numlist[i]+'.png';
	imglist.push(x);
}
window.onload = function(){
	//游戏初始化，第一个标签加载
	var newbox = new Array();
	var x = Math.floor(3*Math.random());
	var y = Math.floor(3*Math.random());
	map[x][y] = new box(y,x);
	map[x][y].init(imglist);
		var canvas = document.getElementById('Mycanvas');
	var startX,endX,startY,endY;
	var flag;
	var newboxDev;
	//监听滑动事件初始状态
	canvas.addEventListener(controlSet.start,function(event){
		console.log(event);
		event.preventDefault();
		startX =  event.pageX||event.touches[0].pageX;
		startY =  event.pageY||event.touches[0].pageY ;
	},false);
	/*canvas.addEventListener(controlSet.move,function(event){
		event.preventDefault();
		endX = event.touches[0].pageX || event.pageX;
		endy = event.touches[0].pageY || event.pageY;
		//
	},false);*/
	//监听其结束状态
	canvas.addEventListener(controlSet.end,function(event){
		console.log(event);
		event.preventDefault();
		endX = event.pageX||event.changedTouches[0].pageX ;
		endY = event.pageY|| event.changedTouches[0].pageY ;
		//根据两次获得的坐标判断用户进行了那种操作，1,2,3,4分别对应上下左右
		if(Math.abs(endX-startX) > Math.abs(endY-startY)){
			if(endX-startX > 0){
				flag = 4;
			}else{
				flag = 3;
			}
		}else{
			if(endY-startY > 0){
				flag = 2;
			}else{
				flag = 1;
			}
		}
		var step = new Array();
		//对于每次操作，计算出每个标签在这次操作后的移动，地图的更新
		//同时对于每种操作，遍历地图的方式有所不同，本质思想是当我遍历到当前标签时，标签移动方向前方的标签都已经经过处理
		switch(flag){
			case 2:
				for(var i=2;i>=0;i--){
					for(var j=0;j<3;j++){
						if(map[i][j]){
							step.push(map[i][j].move(flag,map));
							var midstep = map[i][j].collision(flag,map);
							step[step.length-1][0] += midstep[0];
							step[step.length-1][1] += midstep[1];
							map[i][j].drowmove(step[step.length-1],imglist);
							map[i][j].updateMap(step[step.length-1],map);
							
						}
					}
				}
			break;
			case 4:
				for(var i=0;i<3;i++){
					for(var j=2; j>=0;j--){
						if(map[i][j]){
							step.push(map[i][j].move(flag,map));
							var midstep = map[i][j].collision(flag,map);
							step[step.length-1][0] += midstep[0];
							step[step.length-1][1] += midstep[1];
							map[i][j].drowmove(step[step.length-1],imglist);
							map[i][j].updateMap(step[step.length-1],map);
							
						}
					}
				}
			break;
			default:
				for(var i=0;i<3;i++){
					for(var j=0; j<3;j++){
						if(map[i][j]){
							step.push(map[i][j].move(flag,map));
							var midstep = map[i][j].collision(flag,map);
							step[step.length-1][0] += midstep[0];
							step[step.length-1][1] += midstep[1];
							map[i][j].drowmove(step[step.length-1],imglist);
							map[i][j].updateMap(step[step.length-1],map);
							
						}
					}
				}
			break;
	}
	//step数组保存所有标签的位移量，当step中所有的位移量都为（0,0）时，即所有标签在此次没有标签移动，此时不产生新标签
	//同时，当有位移量时，遍历当前地图并寻找空位，若只有一个空位，则判断游戏已经结束，若有多个，则在其中随机选取一个空位生成新标签
	for(var a in step){
		if(step[a][0] == 0 && step[a][1] == 0){
			continue;
		}else{
			newbox.length = 0;
			for(var i =0;i<map.length;i++){
				for(j=0;j<map[0].length;j++){
					if(!map[i][j]){
						newbox.push([i,j]);
					}
				}
			}
			if(newbox.length == 1){
				alert('you lose');
			}else{
			var conNum = Math.floor(Math.random()*newbox.length);
			newboxDev = newbox[conNum];
			map[newboxDev[0]][newboxDev[1]] = new box(newboxDev[1],newboxDev[0]);
			setTimeout(function(){map[newboxDev[0]][newboxDev[1]].init(imglist);},600);
			a = step.length;
			step.length = 0;
		}
		}
	}
	},false);
}
CanvasRenderingContext2D.prototype.fillRoundRect = function(x,y,w,h,r){
	if(w < 2*r) r = w/2;
	if(h < 2*r) r = h/2;
	 this.beginPath();
	 this.moveTo(x+r,y);
	 this.arcTo(x+w,y,x+w,y+h,r);
	 this.arcTo(x+w,y+h,x,y+h,r);
	 this.arcTo(x,y+h,x,y,r);
	 this.arcTo(x,y,x+w,y,r);
	 this.lineWidth = 0;
	 this.closePath();
	 this.fill();
	 return this;
}
CanvasRenderingContext2D.prototype.fillRoundRectBorder = function(x,y,w,h,dw,dh,r){
	if(w < 2*r) r = w/2;
	if(h <2*r) r = h/2;
	this.beginPath();
	this.moveTo(x,y);
	this.lineTo(x+dw+r,y);
	this.lineTo(x+dw+r,y+dh);
	this.arcTo(x+dw,y+dh,x+dw,y+dh+r,r);
	this.lineTo(x+dw,y+dh+r);
	this.lineTo(x,y+dh+r);
	this.closePath();
	this.fill();
	this.beginPath();
	this.moveTo(x+w,y);
	this.lineTo(x+w-r-dw,y);
	this.lineTo(x+w-r-dw,y+dh);
	this.arcTo(x+w-dw,y+dh,x+w-dw,y+dh+r,r);
	this.lineTo(x+w,y+dh+r);
	this.closePath();
	this.fill();
	this.beginPath();
	this.moveTo(x,y+h);
	this.lineTo(x+dw+r,y+h);
	this.lineTo(x+dw+r,y+h-dh);
	this.arcTo(x+dw,y+h-dh,x+dw,y+h-dh-r,r);
	this.lineTo(x,y+h-dh-r);
	this.closePath()
	this.fill();
	this.beginPath();
	this.moveTo(x+w,y+h);
	this.lineTo(x+w-r-dw,y+h);
	this.lineTo(x+w-r-dw,y+h-dh);
	this.arcTo(x+w-dw,y+h-dh,x+w-dw,y+h-dh-r,r);
	this.lineTo(x+w,y+h-dh-r);
	this.closePath();
	this.fill();
	this.fillRect(x,y,w,dh);
	this.fillRect(x,y,dw,h);
	this.fillRect(x,y+h-dh,w,dh);
	this.fillRect(x+w-dw,y,dw,h);
	return this;
}
function isPC(){
	var userAgentInfo = navigator.userAgent;
	var Agents = new Array('Android','iPhone','SymbianOS','Windows Phone','iPad','iPod');
	var flag = true;
	for(var x in Agents){
		if(userAgentInfo.indexOf(Agents[x]) > 0){
			flag = false;
			break;
		}
	}
	return flag;
}
