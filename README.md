# Haxball headless host script
(Based on Anddy's script)

## Changes added to original script:

*Added a very basic spam filter

*Sends on goal score notifications to chat

*Shows win streaks

*Added a few additional commands

*By default stats calculation for players and ball carrying functions are disabled

*Some other small fixes



## Commands list
	// Commands that don't need to know players attributes.
	"!help": helpFun,
	"!gkHelp": gkHelpFun,
	"!adminHelp": adminHelpFun,
	"!gameHelp": gameFun,
	"p": putPauseFun,
	"!p": unPauseFun,
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

	// Command that need to know who is the player and what's the message.
	"!mute": pushMuteFun,
	"!unmute": unmuteFun

