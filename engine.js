(function(root){'use strict';
const duration=1.2,minJump=44,range=260;
function power(seconds){return Math.max(0,Math.min(1,seconds/duration));}
function distance(value){return minJump+range*Math.max(0,Math.min(1,value));}
function landing(from,target,value){const x=from+distance(value),offset=x-target.x,hit=Math.abs(offset)<=target.width/2-5,perfect=hit&&Math.abs(offset)<=12;return{x,hit,perfect,offset};}
function next(platform,random=Math.random){return{x:platform.x+145+random()*65,y:286+(random()-.5)*36,width:78+random()*18};}
function points(perfect,streak){return perfect?20+Math.min(streak,10)*5:10;}
const api={power,distance,landing,next,points,duration};root.HopEngine=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
