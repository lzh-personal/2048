/*box对象代表者一个标签
    最初我会希望像写贪吃蛇时一样，考虑每个标签每一帧需要做些什么，但我尝试写这个游戏时发现这样写很困难，
最终我换了个思路，我认为这类游戏的进行是基于事件的，也就是当事件发生后，游戏才会前进到下一步，而不是像贪吃蛇
随着时间流逝而进行着游戏，所以这个类的方法基本上是基于事件处理，当事件发生后，这个标签会干些什么事情，这才是
这些方法的处理重点
				*/
function box (x,y){
	this.x=x;
	this.y=y;
	this.values = 2;
	this.colorList = ['#fff','#FFC0CB','#FA8072','#FF6347','#FF4500','#872657','#B0171F'];
}
box.prototype = {
	//init方法初始化标签，每当一个新标签加入，他都需要初始化一下（在地图上绘制这个标签）
	init : function(imglist){
		this.drawTable();
		var canvas = document.getElementById('Mycanvas');
		var a = Math.log(this.values)/Math.log(2);
		this.color = this.colorList[a-1];
		if(canvas.getContext){
			var ctx = canvas.getContext('2d');
		}
		ctx.fillStyle = this.color;
		ctx.fillRoundRect(this.x*100+5,this.y*50+2,90,46,150);
		ctx.drawImage(imglist[a-1],this.x*100,this.y*50,100,50);
	},
	//移动，在不考虑碰撞后2合1的情况下，移动标签，返回标签的位移量
	move : function(flag,map){
		var moveway = [0,0];
		switch(flag){
			case 1:
				for(var i = 0;i<this.y;i++){
					if(!map[i][this.x]){
						moveway[1]--;
					}
				}
			break;
			case 2:
				for(var i = 2;i>this.y;i--){
					if(!map[i][this.x]){
						moveway[1]++;
					}
				}
			break;
			case 3:
				for(var i = 0;i<this.x;i++){
					if(!map[this.y][i]){
						moveway[0]--;
					}
				}
			break;
			case 4:
				for(var i =2;i>this.x;i--){
					if(!map[this.y][i]){
						moveway[0]++;
					}
				}
			break;
		}
		return moveway;
	},
	//碰撞检测，若发生相同值得标签的碰撞，此标签需往移动的方向上多移动一格，覆盖被碰撞标签，并且自己的值加倍
	collision : function(flag,map){
		var step = [0,0];
		switch(flag){
			case 1:
				for(var i = this.y-1;i>=0;i--){
					if(map[i][this.x]){
						if(map[i][this.x].values == this.values){
							this.values = this.values*2;
							step = [0,-1];
						}
					i=-1;
					}
				}
			break;
			case 2:
				for(var i = this.y+1;i<3;i++){
					if(map[i][this.x]){
						if(map[i][this.x].values == this.values){
							this.values = this.values*2;
							step = [0,1];
						}
					i=3;
					}
				}
			break;
			case 3:
				for(var i = this.x-1;i>=0;i--){
					if(map[this.y][i]){
						if(map[this.y][i].values == this.values){
							this.values = this.values*2;
							step = [-1,0];
						}
					i=-1;
					}
				}
			break;
			case 4:
				for(var i = this.x+1;i<3;i++){
					if(map[this.y][i]){
						if(map[this.y][i].values == this.values){
							this.values = this.values*2;
							step = [1,0];
						}
					i = 3;
					}
				}
			break;
		}
		return step;
	} ,
	//描绘移动，输入位移量,绘制位移动画
	drowmove : function(moveway){
		var thisobj = this;
		var canvas = document.getElementById('Mycanvas');
		if(canvas.getContext){
			var ctx = canvas.getContext('2d');
		}else{
			alert("not support canvas");
			return;
		}
		if(moveway[0] != 0 || moveway[1] != 0){
		var a = thisobj.x*100+5;
		var b = thisobj.y*50+2;
		var posX = moveway[0]*10;
		var posY = moveway[1]*5;
		var count = 10;
		var c = Math.log(thisobj.values)/Math.log(2);
		var color = thisobj.colorList[c-1];
		var counttime = setInterval(function(){
			if(count != 0) {
			count --;
			ctx.fillStyle = '#eee';
			ctx.fillRect(a,b,100,50);
			thisobj.drawTable();
			a += posX;
			b += posY;
			ctx.fillStyle = color;
			ctx.fillRoundRect(a,b,90,46,15);
			ctx.drawImage(this.imglist[c-1],a,b,100,50);
		}else{
			return;
		}
		},40);
	}

	},
	//跟新地图
	updateMap : function(step,map){
		map[this.y][this.x]=0;
		this.x += step[0];
		this.y += step[1];
		if(this.x<0){
			this.x=0;
		}
		if(this.x>2){
			this.x=2;
		}
		if(this.y<0){
			this.y=0;
		}
		if(this.y>2){
			this.y=2;
		}
		map[this.y][this.x]=this;
	},
	//绘制外部圆角边框
	drawTable : function(){
		var canvas = document.getElementById('Mycanvas');
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = '#999';
		ctx.fillRoundRectBorder(0,0,100,50,5,2,15);
		ctx.fillRoundRectBorder(100,0,100,50,5,2,15);
		ctx.fillRoundRectBorder(200,0,100,50,5,2,15);
		ctx.fillRoundRectBorder(0,50,100,50,5,2,15);
		ctx.fillRoundRectBorder(100,50,100,50,5,2,15);
		ctx.fillRoundRectBorder(200,50,100,50,5,2,15);
		ctx.fillRoundRectBorder(0,100,100,50,5,2,15);
		ctx.fillRoundRectBorder(100,100,100,50,5,2,15);
		ctx.fillRoundRectBorder(200,100,100,50,5,2,15);
	}

}
