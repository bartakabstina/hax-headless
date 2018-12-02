/*
This script is usable in https://www.haxball.com/headless
Steps:
	1) Copy this script
	2) Go to the link, then press F12
	3) Go to console if it's not already set, then paste
	4) Enter
	5) IF THIS TAB IS CLOSED THE ROOM WILL BE CLOSED TOO
*/

geo = {
	"code": "eu",
	"lat": 52.5192,
	"lon": 13.4061
}
const room = HBInit({
	roomName: "GC VPS",
	maxPlayers: 14,
	playerName: "HOST",
	public: false,
	geo
});
room.setDefaultStadium("Classic");
room.setScoreLimit(3);
room.setTimeLimit(3);


/*
	Functions
*/
// If there are no admins left in the room give admin to one of the remaining players.
function updateAdmins() {
	// Get all players except the host (id = 0 is always the host)
	let players = room.getPlayerList().filter((player) => player.id != 0);
	if (players.length == 0) return; // No players left, do nothing.
	if (players.find((player) => player.admin) != null) return; // There's an admin left so do nothing.
	room.setPlayerAdmin(players[0].id, true); // Give admin to the first non admin player in the list
}

/*
function initPlayerStats(player) {
	if (stats.get(player.name)) return;
	stats.set(player.name, [0, 0, 0, 0, 0, 0]) // goals, assists, wins, loses, og, cs
}
*/

/*
 *Room commands
 */

//Switch teams sides
function swapFun(player) {
	if (player.admin == true) {
		//if (room.getScores() == null) {  //Let admin players switch the teams even if the match already started
		players = room.getPlayerList();
		for (i = 0; i < players.length; i++) {
			if (players[i].team == 1) {
				room.setPlayerTeam(players[i].id, 2);
			} else if (players[i].team == 2) {
				room.setPlayerTeam(players[i].id, 1);
			}
		}
		//}
	}
	room.sendChat(`${player.name} has swapped teams`);
	return false;
}

//Send last played match score to chat when the command !lastScore is triggered
function lastFun(scores) {
	if (scoresArray.length > 0) {
		room.sendChat(scoresArray[scoresArray.length - 1]);
	} else if (scoresArray.length === 0) {
		room.sendChat("No matches have been played yet.");
	}
	return false;
}


function pushMuteFun(player, message) { // !mute PlayerName
	// Prevent somebody to talk in the room (uses the nickname, not the id)
	// need to be admin
	if (player.admin == true) {
		if (!(mutedPlayers.includes(message.substr(6)))) mutedPlayers.push(message.substr(6));
	}
}

function gotMutedFun(player) {
	if (mutedPlayers.includes(player.name)) {
		return true;
	}
}

function unmuteFun(player, message) { // !unmute Anddy
	// Allow somebody to talk if he has been muted
	// need to be admin
	if (player.admin == true) {
		pos = mutedPlayers.indexOf(message.substr(9));
		mutedPlayers.splice(pos, 1);
	}
}

function adminFun(player, message) { // !admin Anddyisthebest
	// Gives admin to the person who type this password

	room.setPlayerAdmin(player.id, true);
	return false; // The message won't be displayed
}

function putPauseFun() { // p
	room.pauseGame(true);
	room.sendChat(player.name + " paused the game.");
	return false;
}

function unPauseFun() { // !p
	room.pauseGame(false);
	room.sendChat(player.name + " unpaused the game.");
	return false;
}

function helpFun() { // !help
	room.sendChat('Available commands: "!gameHelp", "!adminHelp"');
	return false;
}

function gameFun() { // !gameHelp
	room.sendChat('Available commands: "!stats PlayerName", "!ranking", "!resetStats", "!teamsWinRate", "!currentStreak", "!recordStreak" "!lastScore"');
	return false;
}

function winRateFun() { // !teamsWinRate
	room.sendChat(`RED team - W: ${redWins[0]} BLUE team - W: ${blueWins[0]}`);
	return false;
}

function currentStreakFun() { // !currentStreak
	if (redWins[1] > blueWins[1]) {
		room.sendChat(`RED team is streaking! Current streak: ${redWins[1]}! Players: ${redPlayers}`);
	} else if (redWins[1] < blueWins[1]) {
		room.sendChat(`BLUE team is streaking! Current streak: ${blueWins[1]}! Players: ${bluePlayers}`);
	} else {
		room.sendChat("No streaks have been set yet. Play some games first.");
	}
	return false;
}

function streakRecordFun() { // !recordStreak
	room.sendChat(`${teamOnStreak} team currently holds a streak record! Streak: ${streakRecord}! Players: ${streakRecordPlayers}`);
	return false;
}

function adminHelpFun() {
	room.sendChat('Available commands (admins only): "!mute Player", "!unmute Player", "!clearBans", "!rr", "!swap" (to switch sides).');
	return false;
}


function gkHelpFun() { // !gkHelp
	room.sendChat('The most backward player at the kick off will be set as gk! (write "!gk" if the bot is wrong).');
	return false;
}

/* function rankHelpFun() { // !rankHelp
	room.sendChat('Get points by doing good things in this room! Goal: 2 pts, Assist: 1 pts, Win: 3 pts, CS: 2 pts, Lose: -5 pts, OG: -2 pts.');
	return false;
} */


/* function statsFun(player, message) { // !stats PlayerName
	if (stats.get(message.substr(7))) {
		sendStats(message.substr(7));
	} else {
		room.sendChat('To see player stats type "!stats PlayerName"');
	}
	return false;
} */

/* function rankFun() { // !rank
	string = ranking();
	room.sendChat(`Ranking: ${string}`);
	return false;
} */

/* function resetStatsFun (player){ // !resetStats
	if (rankingCalc(player.name) > 0){
		stats.set(player.name, [0,0,0,0,0,0]);
		room.sendChat("Your stats have been reseted ! ")
	}
	else (room.sendChat("You must have positive points to be able to reset it, sorry."))
} */

//Player can reset stats even if some of the points are negative: rankingCalc(player.name) < 0
/* function resetStatsFun(player) { // !resetStats
	if (rankingCalc(player.name) > 0 || rankingCalc(player.name) < 0) {
		stats.set(player.name, [0, 0, 0, 0, 0, 0]);
		room.sendChat(`${player.name}, your stats have been successfuly reseted!`)
	}
	return false;
} */

function clearFun(player) { // !clearBans
	if (player.admin == true) room.clearBans();
	room.sendChat(`${player.name} have cleared all bans. Enjoy the game!`);
	return false;
}

function resetFun(player) {
	if (player.admin == true) {
		room.stopGame();
		room.startGame();
	}
	return false;
}

function gkFun(player) { // !gk

	if (room.getScores() != null && room.getScores().time < 60) {
		if (player.team == 1) {
			gk[0] = player;
			room.sendChat(`${player.name} is now a goalkeeper in RED team.`)
		} else if (player.team == 2) {
			gk[1] = player;
			room.sendChat(`${player.name} is now a goalkeeper in BLUE team.`)
		}
	}
	return false;
}

function closeFun(player) {
	if (player.name == "js2ps") { // artificially generate an error in order to close the room
		stats.crash();
	}
}

/*
 * For ranking-----------------------------------------------------------------------------
 */

/* function rankingCalc(player) {
	return stats.get(player)[0] * 2 + stats.get(player)[1] * 1 +
		stats.get(player)[2] * 3 + stats.get(player)[5] * 2 -
		stats.get(player)[3] * 4 - stats.get(player)[4] * 2;
}

function ranking() {

	let overall = [];
	players = Array.from(stats.keys());
	for (let i = 2; i < players.length; i++) {
		score = rankingCalc(players[i])
		// Goal: 2 pts, assist: 1 pts, win: 3 pts, cs: 2 pts, lose: -4 pts, og: -2 pts
		overall.push({
			name: players[i],
			value: score
		});
	}
	overall.sort(function (a, b) {
		return b.value - a.value;
	})
	string = "";

	for (let i = 0; i < overall.length; i++) {
		if (overall[i].value != 0) {
			string += i + 1 + ") " + overall[i].name + ": " + overall[i].value + " pts, ";
		}
	}
	return string;
}

function sendStats(name) {
	ps = stats.get(name); // stands for playerstats
	room.sendChat(`${name} >>> Goals: ${ps[0]}, Assists: ${ps[1]}, OG: ${ps[4]}, CS: ${ps[5]}, Wins: ${ps[2]}, Loses: ${ps[3]}, Points: ${rankingCalc(name)}`);
} ----------------------------------------------------------------------------------------------------*/


function whichTeam() { // gives the players in the red or blue team
	let players = room.getPlayerList();
	let redTeam = players.filter(player => player.team == 1);
	let blueTeam = players.filter(player => player.team == 2);
	return [redTeam, blueTeam]
}



function isGk() { // gives the mosts backward players before the first kickOff
	let players = room.getPlayerList();
	let min = players[0];
	min.position = {
		x: room.getBallPosition().x + 60
	}
	let max = min;

	for (let i = 0; i < players.length; i++) {
		if (players[i].position != null) {
			if (min.position.x > players[i].position.x) min = players[i];
			if (max.position.x < players[i].position.x) max = players[i];
		}
	}
	return [min, max]
}


/* Turned off stats calculation and ball carrying functions --------------------------
 *	!!! Ball carrying doesn't work correctly, because carrying time starts and changes only on kick events !!!
 */
/*
function updateWinLoseStats(winners, losers) {
	for (let i = 0; i < winners.length; i++) {
		stats.get(winners[i].name)[2] += 1;
	}
	for (let i = 0; i < losers.length; i++) {
		stats.get(losers[i].name)[3] += 1;
	}
}

function initBallCarrying(redTeam, blueTeam) {
	let ballCarrying = new Map();
	let playing = redTeam.concat(blueTeam);
	for (let i = 0; i < playing.length; i++) {
		ballCarrying.set(playing[i].name, [0, playing[i].team]); // secs, team, %
	}
	return ballCarrying;
}


function updateTeamPoss(value) {
	if (value[1] == 1) redPoss += value[0];
	if (value[1] == 2) bluePoss += value[0];
}

let bluePoss;
let redPoss;

function teamPossFun() { //Team possesion calculation

	if (room.getScores() == null) return false;
	bluePoss = 0;
	redPoss = 0
	ballCarrying.forEach(updateTeamPoss);
	redPoss = Math.round((redPoss / room.getScores().time) * 100);
	bluePoss = Math.round((bluePoss / room.getScores().time) * 100);
	if (room.getScores().time === 0) {
		room.sendChat("Ball possession:  RED 0 - 0 BLUE. Match haven't started yet.");
	} else if (room.getScores().time > 0) {
		room.sendChat(`Ball possession:  RED ${redPoss} - ${bluePoss} BLUE`);
	}
} */

/*
For the game
*/

// Gives the last player who touched the ball, works only if the ball has the same
// size as in classics maps.
let radiusBall = 10;
let triggerDistance = radiusBall + 15 + 0.1;

function getLastTouchTheBall(lastPlayerTouched, time) {
	let ballPosition = room.getBallPosition();
	let players = room.getPlayerList();
	for (let i = 0; i < players.length; i++) {
		if (players[i].position != null) {
			let distanceToBall = pointDistance(players[i].position, ballPosition);
			if (distanceToBall < triggerDistance) {
				lastPlayerTouched = players[i];
				return lastPlayerTouched;
			}
		}
	}
	return lastPlayerTouched;

}

// Calculate the distance between 2 points
function pointDistance(p1, p2) {
	let d1 = p1.x - p2.x;
	let d2 = p1.y - p2.y;
	return Math.sqrt(d1 * d1 + d2 * d2);
}

function isOvertime() {
	scores = room.getScores();
	if (scores != null) {
		if (scores.timeLimit != 0) {
			if (scores.time > scores.timeLimit) {
				if (scores.red == 0 && hasFinished == false) {
					stats.get(gk[0].name)[5] += 1;
					stats.get(gk[1].name)[5] += 1;
					hasFinished = true;
				}
			}
		}
	}
}
// return: the name of the team who took a goal
let team_name = team => team == 1 ? "BLUE" : "RED";

// return: whether it's an OG
let isOwnGoal = (team, player) => team != player.team ? " (og)" : "";

// return: a better display of the second when a goal is scored
let floor = s => s < 10 ? "0" + s : s;

// return: whether there's an assist
let playerTouchedTwice = playerList => playerList[0].team == playerList[1].team ? " (" + playerList[1].name + ")" : "";



/*
Events
*/
let stats = new Map(); // map where will be set all player stats
let mutedPlayers = []; // Array where will be added muted players
let init = "init"; // Smth to initialize smth
init.id = 0; // Faster than getting host's id with the method
init.name = "init";
let scorers; // Map where will be set all scorers in the current game (undefined if reset or end)
let whoTouchedLast; // let representing the last player who touched the ball
let whoTouchedBall = [init, init]; // Array where will be set the 2 last players who touched the ball
let gk = [init, init];
let goalScored = false;

let commands = {
	// Commands that don't need to know players attributes.
	"!help": helpFun,
	"!gkHelp": gkHelpFun,
	"!adminHelp": adminHelpFun,
	"!rankHelp": rankHelpFun,
	"!ranking": rankFun,
	"!gameHelp": gameFun,
	"p": putPauseFun,
	"!p": unPauseFun,
	//"!poss": teamPossFun,
	"!lastScore": lastFun,
	"!teamsWinRate": winRateFun,
	"!currentStreak": currentStreakFun,
	"!recordStreak": streakRecordFun,

	// Command that need to know who is the player.
	"!resetStats": resetStatsFun,
	"!gk": gkFun,
	"!getadmin": adminFun,

	// Command that need to know if a player is admin.
	"!swap": swapFun,
	"!rr": resetFun,
	"!clearBans": clearFun,
	"!close": closeFun,

	// Command that need to know what's the message.
	"!stats": statsFun,

	// Command that need to know who is the player and what's the message.
	"!mute": pushMuteFun,
	"!unmute": unmuteFun

}

initPlayerStats(room.getPlayerList()[0]) // lazy lol, i'll fix it later
initPlayerStats(init);

room.onPlayerLeave = function (player) {
	updateAdmins();
}

room.onPlayerJoin = function (player) {
	updateAdmins(); // Gives admin to the first player who join the room if there's no one
	initPlayerStats(player); // Set new player's stat
	room.sendChat(`Hi ${player.name}! Good to see ya. Write !gameHelp, !adminHelp, !rankHelp or !gkHelp if needed.`)
}

let redTeam;
let blueTeam;

room.onGameStart = function () {
	/* [redTeam, blueTeam] = whichTeam();
	ballCarrying = initBallCarrying(redTeam, blueTeam); */

	//Reset goal counter onGameStart event
	redGoals = 0;
	blueGoals = 0;
}

/* room.onPlayerTeamChange = function (player) {
	if (room.getScores() != null) {
		if (1 <= player.team <= 2) ballCarrying.set(player.name, [0, player.team]);
	}
} */

/*
 *Chat events--------------------------------------------------------------------------------------------
 */

let messageHistory = [0, 0, 0, 0, 0, 0]; //Primary array of players ids who sent messages (placeholder)
let messageCounter = 0; //Count how many times player sent messages if conditions are true

room.onPlayerChat = function (player, message) {
	let spacePos = message.search(" ");
	let command = message.substr(0, spacePos !== -1 ? spacePos : message.length);
	if (commands.hasOwnProperty(command) == true) {
		return commands[command](player, message);
	}
	//-------------------Spam filter----------------------

	messageHistory.push(player.id); //Add player's id to array when message is sent

	messageCounter++;

	//Warn player for spamming if 4 messages were typed in a row
	if (messageCounter === 4) {
		if (messageHistory[messageHistory.length - 1] === player.id && messageHistory[messageHistory.length - 2] === player.id && messageHistory[messageHistory.length - 3] === player.id && messageHistory[messageHistory.length - 4] === player.id) {
			room.sendChat(`**ALERT! ${player.name} has been warned for spamming!**`);
		}
	}
	//Ban player if 7 messages were typed in a row
	if (messageCounter === 7) {
		if (messageHistory[messageHistory.length - 1] === player.id && messageHistory[messageHistory.length - 2] === player.id && messageHistory[messageHistory.length - 3] === player.id && messageHistory[messageHistory.length - 4] === player.id && messageHistory[messageHistory.length - 5] === player.id && messageHistory[messageHistory.length - 6] === player.id) {
			console.log("<<<Player: ${player.name} has been kicked for spamming.>>>");
			room.kickPlayer(player.id, "Please, don't spam again. Thanks.", false); //Change to true if you want to ban player instead of kick
			messageCounter = 1;
			return false;
		}
	}
	//Reset counter if condition are true
	if (messageHistory[messageHistory.length - 1] !== messageHistory[messageHistory.length - 2]) {
		messageCounter = 1;
	}
	//Stop counter at 1 if player name is PlayerName (Spam filter preveted from working on these players)
	if (player.name === "PlayerName") {
		messageCounter = 1;
	}

	//Display data of a player which sent a message in the console
	console.log(`**MESSAGE COUNTER (  ${messageCounter} )**  Player ID: ${player.id}; Nickname: ${player.name}; Message: ${message}`);
};

//------------------------------------------------------------------------------------------------------------------------------------------

room.onPlayerBallKick = function (player) {
	whoTouchedLast = player;
}

let kickOff = false;
let hasFinished = false;

room.onGameTick = function () {

	setInterval(isOvertime, 5000, hasFinished);

	if (kickOff == false) { // simplest comparison to not charge usulessly the tick thing
		if (room.getScores().time != 0) {
			kickOff = true;
			gk = isGk();
			room.sendChat(`Red GK: ${gk[0].name}, Blue GK: ${gk[1].name}`);
		}
	}
	if (goalScored == false) {
		whoTouchedLast = getLastTouchTheBall(whoTouchedLast);
	}
	if (whoTouchedLast != undefined) {

		if (ballCarrying.get(whoTouchedLast.name)) {
			ballCarrying.get(whoTouchedLast.name)[0] += 1 / 60;
		}

		if (whoTouchedLast.id != whoTouchedBall[0].id) {
			whoTouchedBall[1] = whoTouchedBall[0];
			whoTouchedBall[0] = whoTouchedLast; // last player who touched the ball
		}
	}
}

/*
 * onTeamgoal events
 */

let redGoals = 0; //Goal counters
let blueGoals = 0;

let scoresArray = []; //Match history Array

room.onTeamGoal = function (team) {
	goalScored = true;

	//Incrementing and storing game score for the last match result - !lastScore
	if (team === 1) {
		redGoals += 1;
	} else if (team === 2) {
		blueGoals += 1;
	}

	let time = room.getScores().time;
	let m = Math.trunc(time / 60);
	let s = Math.trunc(time % 60);
	time = m + ":" + floor(s); // MM:SS format
	let ownGoal = isOwnGoal(team, whoTouchedBall[0]);
	let assist = "";
	if (ownGoal == "") assist = playerTouchedTwice(whoTouchedBall);

	//Show who and when scored the goal
	//room.sendChat(`A goal has been scored by ${whoTouchedBall[0].name} ${assist} ${ownGoal} at ${time} against team ${team_name(team)}`);
	room.sendChat("A goal has been scored by " + whoTouchedBall[0].name +
		assist + ownGoal + " at " +
		time + " against team " + team_name(team));

	if (ownGoal != "") {
		stats.get(whoTouchedBall[0].name)[4] += 1;
	} else {
		stats.get(whoTouchedBall[0].name)[0] += 1;
	}

	if (whoTouchedBall[1] != init && assist != "") stats.get(whoTouchedBall[1].name)[1] += 1;


	if (scorers == undefined) scorers = new Map(); // Initializing dict of scorers
	scorers.set(scorers.size + 1 + ") " + whoTouchedLast.name, [time, assist, ownGoal])
	whoTouchedBall = [init, init];
	whoTouchedLast = undefined;
}

room.onPositionsReset = function () {
	goalScored = false;
}

/*
 * Last match history
 */

function matchHistory() {
	if (typeof scores === 'undefined' || scores === null) {
		room.sendChat("Previous match was started but have never been played or finished. To set a score please finish the match.");
	} else {
		//Variables for the time that has passed
		let gameTime;
		let m = Math.trunc(scores.time / 60);
		let s = Math.trunc(scores.time % 60);
		gameTime = m + ":" + floor(s); // MM:SS format

		//Match score is legit if match time already reached the time limit (3min = 180s) and one of the teams won
		if (scores.time >= scores.timeLimit && scores.time >= 180 && (scores.red > scores.blue || scores.red < scores.blue)) {
			scoresArray.push(`Last match score: RED ${redGoals} - ${blueGoals} BLUE. Match end time: ${gameTime}`);
		}
		//Match score is legit if one of the teams reaches score limit (Default: 1) faster and time hasn't passed yet
		else if (scores.time < scores.timeLimit && scores.scoreLimit > 0 && scores.scoreLimit >= 1 && (scores.red === scores.scoreLimit || scores.blue === scores.scoreLimit)) {
			scoresArray.push(`Last match score: RED ${redGoals} - ${blueGoals} BLUE. Match end time: ${gameTime}`);
		}
		//Match with score limit only
		else if (scores.time > 0 && scores.timeLimit === 0 && scores.scoreLimit > 0 && (scores.red === scores.scoreLimit || scores.blue === scores.scoreLimit)) {
			scoresArray.push(`Last match score: RED ${redGoals} - ${blueGoals} BLUE. Match end time: ${gameTime}. (Match with score limit only)`);
		}

		//Match time limit and score limit is more than 0
		/*
		if (scores.time > 0 && scores.timeLimit > 0 && scores.scoreLimit > 0 && (scores.red > scores.blue || scores.red < scores.blue)) {
		 	scoresArray.push(`Last match score: RED ${redGoals} - ${blueGoals} BLUE. Match end time: ${gameTime}`);
		}
		*/

		//Match with time limit only (Default: time limit is equal or more than 3min or 180 in seconds)
		else if (scores.time > 0 && scores.timeLimit >= 180 && scores.scoreLimit === 0 && (scores.red > scores.blue || scores.red < scores.blue) || scores.red === scores.blue) {
			scoresArray.push(`Last match score: RED ${redGoals} - ${blueGoals} BLUE. Match end time: ${gameTime}`);
		}
		//Send notification to chat if none of the conditions above are true
		else {
			room.sendChat("Previous match was started but hasn't been played or finished. To set a score please finish the match.");
		}
	}
}

/*
 *onTeamVictory events
 */

let redWins = [0, 0]; //redWins[0] & blueWins[0] are total numbers of wins (RED W:x & BLUE W:y)
let blueWins = [0, 0]; //redWins[1] & blueWins[1] are current streak numbers if one of the conditions is true

let redPlayers = ""; //Store info about players who played the match
let bluePlayers = "";

//Streak record
let teamOnStreak = "";
let streakRecord = 0;
let streakRecordPlayers = "";

function streakWinCalc() {
	//Reset match players before new ones will be assigned after the match ending (Otherwise new players will be mixed in the same array with the old players)
	redPlayers = "";
	bluePlayers = "";

	//Arrays for storing only red or only blue team players
	let redTeamArray = [];
	let blueTeamArray = [];

	//Store players who scored a goal in a single line variable
	let matchScorers = "";

	//Get a list of players, check which team they belong to and store in variables (redPlayers & bluePlayers)
	let streakPlayers = room.getPlayerList();
	for (i = 0; i < streakPlayers.length; i++) {
		if (streakPlayers[i].team == 1) {
			//Set array of only red team players
			redTeamArray.push(streakPlayers[i].name);
		} else if (streakPlayers[i].team == 2) {
			//Set array of only blue team players
			blueTeamArray.push(streakPlayers[i].name);
		}
	}

	//Join the elements in an javascript array, 
	//but let the last separator be different eg: `and` / `or`

	if (redTeamArray.length === 1) { //Red team
		redPlayers = redTeamArray[0];
	} else if (redTeamArray.length === 2) {
		redPlayers = redTeamArray.join(' and ');
	} else if (redTeamArray.length > 2) {
		redPlayers = redTeamArray.slice(0, -1).join(', ') + ' and ' + redTeamArray.slice(-1);
	}

	if (blueTeamArray.length === 1) { //Blue team
		bluePlayers = blueTeamArray[0];
	} else if (blueTeamArray.length === 2) {
		bluePlayers = blueTeamArray.join(' and ');
	} else if (blueTeamArray.length > 2) {
		bluePlayers = blueTeamArray.slice(0, -1).join(', ') + ' and ' + blueTeamArray.slice(-1);
	}

	//Show message with info of players which scored goals

	for (let [key, value] of scorers) { // key: name of the player, value: time of the goal
		//room.sendChat(key + " " + value[1] + value[2] + ": " + value[0]);
		matchScorers += " " + key + " " + value[1] + value[2] + " : " + value[0];
	}
	setTimeout(function () {
		room.sendChat(`GOALS: ${matchScorers}`);
	}, 800);

	//Show recently ended match score in the chat + Store wins in variables of both teams
	if (scores.red > scores.blue) {
		//Increment red wins if red is victorious
		redWins[0]++;

		//Current streak number if red is victorious
		redWins[1]++;

		//Recently ended match current streak message (RED)
		if (redWins[1] === 1) {
			setTimeout(function () {
				room.sendChat(`RED team has started a streak with a first WIN! Players: ${redPlayers}.`);
				if (blueWins[1] === 1) {
					room.sendChat(`BLUE team lost after ${blueWins[1]} victory.`);
				} else if (blueWins[1] > 1) {
					room.sendChat(`BLUE team lost after ${blueWins[1]} victories in a row.`);
				} else {
					return false;
				}
				blueWins[1] = 0;
			}, 1600);
		} else if (redWins[1] > 1) {
			setTimeout(function () {
				room.sendChat(`RED team is on the streak! Current streak: ${redWins[1]}! Players: ${redPlayers}`);
			}, 1600);
		}
	} else {
		//Increment blue wins if blue is victorious
		blueWins[0]++;

		//Current streak number if blue is victorious
		blueWins[1]++;

		//Recently ended match current streak message (BLUE)
		if (blueWins[1] === 1) {
			setTimeout(function () {
				room.sendChat(`BLUE team has started a streak with a first WIN! Players: ${bluePlayers}`);
				if (redWins[1] === 1) {
					room.sendChat(`RED team lost after ${redWins[1]} victory.`);
				} else if (redWins[1] > 1) {
					room.sendChat(`RED team lost after ${redWins[1]} victories in a row.`);
				} else {
					return false;
				}
				redWins[1] = 0;
			}, 1800);
		} else if (blueWins[1] > 1) {
			setTimeout(function () {
				room.sendChat(`BLUE team is on the streak! Current streak: ${blueWins[1]}! Players: ${bluePlayers}`);
			}, 1600);
		}
	}

	//Check if team passed previous streak record and print a message
	if (redWins[1] > streakRecord) {
		teamOnStreak = "RED";
		streakRecord = redWins[1];
		streakRecordPlayers = redPlayers;

		setTimeout(function () {
			room.sendChat(`${teamOnStreak} team set a new streak record! Streak: ${streakRecord}! Players: ${streakRecordPlayers}`);
		}, 2400);

	} else if (blueWins[1] > streakRecord) {
		teamOnStreak = "BLUE";
		streakRecord = blueWins[1];
		streakRecordPlayers = bluePlayers;

		setTimeout(function () {
			room.sendChat(`${teamOnStreak} team has set a new streak record! Streak: ${streakRecord}! Players: ${streakRecordPlayers}`);
		}, 2400);

	}
}

room.onTeamVictory = function (scores) { // Sum up all scorers since the beginning of the match.
	if (scores.blue == 0 && gk[0].position != null && hasFinished == false) stats.get(gk[0].name)[5] += 1;
	if (scores.red == 0 && gk[1].position != null && hasFinished == false) stats.get(gk[1].name)[5] += 1;

	if (scores.red > scores.blue) {
		updateWinLoseStats(redTeam, blueTeam);
	} else {
		updateWinLoseStats(blueTeam, redTeam);
	}

	if (scores.red > scores.blue) {
		//Recently ended match result if red wins
		room.sendChat(`RED is victorious! Match score: RED ${scores.red} - ${scores.blue}  BLUE`);
	} else {
		//Recently ended match result if blue wins
		room.sendChat(`BLUE is victorious! Match score: RED ${scores.red} - ${scores.blue}  BLUE`);
	}

	//Display current streak, streak record and both teams win rate
	streakWinCalc();

	//Display team possesion when match ends  
	//teamPossFun();

	//Add last match result to array
	matchHistory();
}

room.onGameStop = function (scores) {
	matchHistory(); //Add last match result to array

	scorers = undefined;
	whoTouchedBall = [init, init];
	whoTouchedLast = undefined;
	gk = [init, init];
	kickOff = false;
	hasFinished = false;
}
