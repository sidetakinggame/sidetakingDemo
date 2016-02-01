
//temporary variable values
var player = 0;
var game = 15;

//we depend on global variables player and game being defined in .php file.
//var images = ["blue.png", "brown.png", "green.png", "orange.png", "pink.png", "red.png", "purple.png", "yellow.png"];

var imageURL = "https://dl.dropboxusercontent.com/u/4745232/alliance.1player.6.3.14/";
var images = [imageURL + "blue.png", imageURL + "brown.png", imageURL + "green.png", imageURL + "orange.png", imageURL + "pink.png", imageURL + "red.png", imageURL + "purple.png", imageURL + "yellow.png"];

var minId = 0;
var data = [];
var busy = false;


var instructionsPage = 1; 
function nextPage() {
	$("#page" + instructionsPage).fadeOut();
	instructionsPage++;
	console.log("instructions page is: " + instructionsPage);
	$("#page" + instructionsPage).fadeIn();
}
function closeInstructions() {
	$(".instructions").fadeOut();
	instructionsPage = 1;
}
function showInstructions() {
	closeInstructions();
	$("#page1").fadeIn();		
}

 $(function() {$( ".instructions" ).draggable();});

 
//Declares an array "rankings" of 8 arrays to hold all players' rankings.
var rankings = [];
for (i=0;i<8;i++) {rankings[i]= [];}

//Declares "oldrankings" for holding previous rankings data to highlight changed ranks in displays. The function storeRanks sets oldrankings equal to current rankings.
var oldrankings = [];
for (i=0;i<8;i++) {oldrankings[i]= [];}

function storeRanks(){
	for(x=0;x<8;x++){
		for(y=0;y<8;y++){
			oldrankings[x][y]=rankings[x][y];
		}
	}
}
	
//This function waits until document is ready and then initializes sortable (with update), randomizes ranks, updates displays.
 $(document).ready(function() {
    $("#sortable").sortable({update: updateRanks}); 
	randomRanksButton();
	storeRanks();
	updateDisplays();
	//set player's image of self
	$("#self").attr("src", images[player]);
	//This will update from database every .7 seconds.	
	//setInterval(getData, 700);	
 });
 
//This function inputs sortable order into rankings array, sets data, updates displays.  
function updateRanks() {
    var result = $('#sortable').sortable('toArray');
	//define player's ranking of self
	rankings[player][player] = 0;
    for( var i=0;i<8;i++) {
		if (i==player)
		continue;
        rankings[player][i] = result.indexOf("p"+ i)+1;
    }
	//setData(player);
	updateDisplays();
	storeRanks();
}

//This function randomizes all players' ranks, updates displays. 
function randomRanksButton() {
	//Define shuffling function
	shuffle = function(v){
    for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
    return v;
	}
	for(i=0;i<8;i++) {
		//makes rankings a randomization of 1-7, ranks self zero
		rankings[i] = shuffle([1,2,3,4,5,6,7]);
		rankings[i].splice(i,0,0);						
	}
	//for (i=0;i<8;i++) {setData(i);}
	updateDisplays();
	updateSortable();
}

//This function updates display tables.
function updateDisplays() {
	displayImages();
	displayRankTable();
	winLoss();
}

//This function updates the sortable to the current rankings data.
function updateSortable() {
	var html = "";
	for (i=1;i<8;i++){
		var playerId = rankings[player].indexOf(i);
		html += "<img id=\"p"+playerId+"\" src=\""+images[playerId]+"\"/>";
	}
	$("#sortable").html(html);
}

//This function displays the image Rankings table.
function displayImages(){
	var imageid = "";
	for(x=0;x<8;x++){
		for(y=0;y<8;y++){
			imageid="image" + x + y;
			var color = rankings[x].indexOf(y);
			document.getElementById(imageid).src=images[color];
			//This highlights new cells.
			if (rankings[x][color] - oldrankings[x][color] < 0 )  {
				$("#image" + x + y).css({"background-color":"#fdfd96"});  
			} else if (rankings[x][color] - oldrankings[x][color] > 0){
				$("#image" + x + y).css("background-color","#ff6961"); 
			} else {
				$("#image" + x + y).css("background-color","");
			} 
		}
	}
}

//This function displays the numerical Rankings table.
function displayRankTable(){
	var idname = "";
	for(x=0;x<8;x++){
		for(y=0;y<8;y++){
		idname="rank" + x + y;
		document.getElementById(idname).innerHTML=rankings[x][y];
		//Highlights new values	
		if (oldrankings[x][y] - rankings[x][y] > 0)  {
		  $("#" + idname).css("background-color","yellow");  
		  }
		  else if (oldrankings[x][y] - rankings[x][y] < 0 ){
		  $("#" + idname).css("background-color","red"); 
		  }
		  else {
		  $("#" + idname).css("background-color","");
		  }  
		}
	}
}

//This computes/displays the win-loss-tie table.
var wlt = [];
for (i=0;i<8;i++) {
	wlt[i]=[];}

function winLoss () {		
	//player that you're calculating WLT for
	for(k=0;k<8;k++) {
		var w = 0;
		var l = 0;
		var t = 0;
		//opponents
		for(i=0;i<8;i++){
			var mp = 0;
			var op = 0;
			//don't pit player against self
			if(k == i) {continue;}
			//third parties
			for(j=0;j<8;j++){
				if(j == i || j == k) {continue;}
					if(rankings[j][i] < rankings[j][k]) {op += 1; }
					//console.log("Player " + j + " sides with " + i + " op = " + op);
					else {mp += 1; }
					//console.log("Player " + j + " sides with " + k + " mp = " + mp);
			}
			if(op>mp) {l += 1;}
				//console.log("A Loss! L = " + l);
			if(op<mp) {w += 1;}
				//console.log("A Win! W = " + w);
			if(op==mp){t += 1;
				//console.log("A Tie! T = " + t);
			}
		}
		//console.log("For Player " + k + "-- Wins: " + w + " Losses: " + l + " Ties: " + t);
		wlt[k][0] = w;
		wlt[k][1] = l;
		wlt[k][2] = t;
    }
	for (i=0;i<8;i++) {document.getElementById('winloss'+i).innerHTML = wlt[i];}
}


//This is the robot strategy function.
function robotStrategy(i){
	rankrand = [];
	//console.log( "i (the player we're working on) = " + i);
	for(var j=0; j<8; j++) {
		//console.log("This is rankings for " + j + ": " + rankings[j]);
		//rankrand is an array of the other players' rankings of player p in order of their numbers. 
		if(j == i) {
			//here I make the player's ranking of self 9...
			rankrand.push(9);
			continue;
		}
		//console.log( "Player " +j+ " ranks player " + i + ": " + rankings[j][i]);
		//...for all other players, i add their ranking to the vector
		//plus a random number
		rankrand.push(rankings[j][i]+Math.random()*.01);
	}
	//console.log( "Rankrand for player " + i + " is " + rankrand);
	//console.log( " Minimum for this guy?: " + Math.min.apply(Math, rankrand));
	newrank = new Array(7);
	for(var j=0; j<7; j++) {
		// add lowest numerical ranking from ranks of player p to an array
		// eg, if the lowest ranking of you is 2 and the 4th player ranked you 
		// 2, then the first item in newrank is 4
		newrank[j] = rankrand.indexOf(Math.min.apply(Math, rankrand))
		// replace minimum ranker that you just added to player p's new array with 8 so that it wont
		// be counted again but maintains the order of the array
		rankrand.splice(rankrand.indexOf(Math.min.apply( Math, rankrand)),1,8);
		//console.log( "    Newrank: " + newrank);
	}
	//Add player's own number to first spot in newrank
	//note newrank's format: (person in rank 0 ( = i), person in rank 1,...,person in rank 7)
	newrank.splice(0,0,i)
    //console.log( "Newrank with self: " + newrank);
	//rankings is a translation of newrank: 
	for(var j=0; j<8; j++) {rankings[i][j] = newrank.indexOf(j);}
	//console.log( "Rankings for: "+ i + " = "  + rankings[i]);
	updateDisplays();
	storeRanks();
}

	
//This is the robots button that implements the robot strategy for all players except player 1 using robotsMove. The button turns on and off using robotsStatus.
var robotsStatus = false;

function robotsButton() {
	if (robotsStatus == false) {
		robotsStatus = true;
		robotsMove();
		$("#robots").css("background-color","#C0C0C0"); 
		} else {
		robotsStatus = false;
		clearTimeout(timeoutHandle);
		$("#robots").css("background-color",""); 
		}
	}

var robotSpeed = 400;
function robotsMove() {
	shuffle = function(v){
		for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
		return v;
		}
	var robotOrder = [0,1,2,3,4,5,6,7];
	robotOrder.splice(player, 1);
	shuffle(robotOrder);
	//console.log("playerOrder is" + robotOrder);
	//var playerOrder = shuffle([1,2,3,4,5,6,7]);
	robotStrategy(robotOrder[1]);
	timeoutHandle = setTimeout(robotsMove, robotSpeed);
}

function changeSpeed() {
	robotSpeed = $('#speed').val();	
}

function changeTime() {
	timerTotal = $('#timerTotal').val();
	console.log("timerTotal is now: " + timerTotal);
}

//This starts a timed game with scoring.
function initiateGame(){
	if (robotsStatus == true) robotsButton();
	randomRanksButton();
	robotsMove();
	timerCount = timerTotal;
	timer();
	scores = [0,0,0,0,0,0,0,0];
	for (i=0;i<8;i++) {document.getElementById("score" + i).innerHTML=scores[i];}
	$(".controls").css("visibility","hidden");
}

//This runs a timer with scores added every 5 seconds.
var timerCount=119;
var timerTotal=119;
function timer(){  
	if (timerCount < 0)  {
		document.getElementById("timer").innerHTML="Game Over";
		timerCount = 119;	
		clearTimeout(timeoutHandle);
		$(".controls").css("visibility","visible");
		return;
	}
	document.getElementById("timer").innerHTML="Time: " + timerCount; 
	if(timerCount % 5 == 0) computeScores();
	timerCount = timerCount-1;
	setTimeout(timer,1000);
}

//This calculates scores and outputs to display.
var scores = [0,0,0,0,0,0,0,0];
function computeScores(){
	for (i=0;i<8;i++) {
	scores[i] += wlt[i][0] * 2 + wlt[i][2];
	document.getElementById("score" + i).innerHTML=scores[i];
	}
}


function fights(){
	var results = []; 
	shuffle = function(v){
		for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
		return v;
		}
	var fighters = shuffle([0,1,2,3,4,5,6,7]);
	for(pairing=0;pairing<4;pairing++){
	var fighter1 = fighters[pairing*2+0];
	var	fighter2 = fighters[pairing*2+1];
	var supporters1 = [];
	var supporters2 = [];
	for(i=0;i<8;i++){
		if(rankings[i][fighter1] < rankings[i][fighter2])  
			supporters1.push(i);
			else supporters2.push(i);
	}
	
	var changes = [0,0,0,0,0,0,0,0];
	if (supporters1.length > supporters2.length) 
		winner = fighter1
	else 
	if (supporters1.length < supporters2.length) 
		winner = fighter2
	else {
		winner = Math.random()>0.5?fighter1:fighter2;
		changes = [-10,-10,-10,-10,-10,-10,-10,-10];
		}
	changes[winner] += 150;
	
	results.push({"game":game,"round":round,"fighter1":fighter1,"fighter2":fighter2,"supporters1":supporters1,"supporters2":supporters2,"winner":winner,"changes":changes.toString()});
	}
	//console.log(results);
	//This sends fights data to database
	$.get('setfights.php?data='+JSON.stringify(results));
	//$.getJSON('setfights.php', results)
	//location.href='setfights.php?json='+JSON.stringify(results);
	
	return results;
	
}






/* jQuery UI Touch Punch 0.2.2, Copyright 2011, Dave Furfero, Dual licensed under the MIT or GPL Version 2 licenses.
 * Depends: jquery.ui.widget.js, jquery.ui.mouse.js  */
(function(b){b.support.touch="ontouchend" in document;if(!b.support.touch){return;}var c=b.ui.mouse.prototype,e=c._mouseInit,a;
function d(g,h){if(g.originalEvent.touches.length>1){return;}g.preventDefault();
var i=g.originalEvent.changedTouches[0],f=document.createEvent("MouseEvents");
f.initMouseEvent(h,true,true,window,1,i.screenX,i.screenY,i.clientX,i.clientY,false,false,false,false,0,null);
g.target.dispatchEvent(f);}c._touchStart=function(g){var f=this;if(a||!f._mouseCapture(g.originalEvent.changedTouches[0])){return;}a=true;
f._touchMoved=false;d(g,"mouseover");d(g,"mousemove");d(g,"mousedown");};c._touchMove=function(f){if(!a){return;}this._touchMoved=true;
d(f,"mousemove");};c._touchEnd=function(f){if(!a){return;}d(f,"mouseup");d(f,"mouseout");if(!this._touchMoved){d(f,"click");}a=false;};
c._mouseInit=function(){var f=this;f.element.bind("touchstart",b.proxy(f,"_touchStart")).bind("touchmove",b.proxy(f,"_touchMove")).bind("touchend",b.proxy(f,"_touchEnd"));
e.call(f);};})(jQuery);


//Old Code:

/*
//This function retrieves data from database
function getData() {
                if (busy)
                    return;
                busy = true;
               // var game = $("#game").val();
                var url = "getstate.php?game="+game+"&minId="+minId;
                console.log("about to call getJSON with "+url);
                
				$.getJSON(url, function(theJSON) {
                    data = theJSON['rows'];
                    minId = theJSON['minId'];
                	busy = false;
				});
				
				for (i in data) {
					rankings[i] = data[i].ranks.split(",");
					for(j in rankings[i])
						rankings[i][j] = parseInt( rankings[i][j] );
						}
				updateDisplays();
            }
*/

/*
//This function sends data from player i to the database
 function setData(i) {
        var ranks = rankings[i];
        var url = "setstate.php"
            +"?game="+game
            +"&player="+i
            +"&ranks="+ranks;
                $.get(url);
	}
 */
 

