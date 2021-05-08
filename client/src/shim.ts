import * as PIXI from 'pixi.js';

import Game from './Game';
import Session from './Session';

import { Game as Server } from '../../server/src/index';
import Player from '../../server/src/Player';
import GameState from '../../server/src/GameState';

import './style.css';

let game = new Game();

const urlParams = new URLSearchParams(window.location.search);
const currentPlayer = +urlParams.get('playerId') || 0;

if (urlParams.get('reset')) {
	localStorage.clear();
}

// Setup initial state
function getSession() {
	return (JSON.parse(localStorage.getItem('session')) as Session);
}
if (localStorage.getItem('session') === null) {
	const players: Array<Player> = [
		{
			playerId: 0,
			sessionId: 0,
			user: {
				username: "Player 0"
			},
			current: true,
			host: true
		},
		{
			playerId: 1,
			sessionId: 0,
			user: {
				username: "Player 1"
			},
			current: false,
			host: false
		}
	];
	const gameState = Server.setupGame(players, {});
	const session: Session = {
		sessionId: 0,
		game: "gamename",
		environment: gameState.environment,
		players,
		active: true,
		ranked: true,
		toEventId: 0
	};
	localStorage.setItem('session', JSON.stringify(session));
}

function getPlayerEnvironment() {
	const session = getSession();
	return {
		...session,
		environment: Server.getEnvironmentForPlayer(
			{
				"environment": JSON.parse(JSON.stringify(session.environment)), 
				"players": session.players
			}, 
			session.players[currentPlayer]),
	};
}

// Add fake server functions
function getEventQueue(playerId: number) {
	const data = localStorage.getItem('eventQueue-' + playerId);
	if (data == null) return null;
	return (JSON.parse(data) as Array<any>);
}
Server.queueEvent = function(event: any, playerIds: Array<number>): void {
	for (const pid of playerIds) {
		let eventQueue = getEventQueue(pid);
		if (eventQueue === null) {
			eventQueue = [];
		}
		
		eventQueue.push(event);
		localStorage.setItem('eventQueue-' + pid, JSON.stringify(eventQueue));
	}
};
Server.queueEventToAllButOnePlayer = function(event: any, player: number): void {
	const session = getSession();
	for (const p of session.players) {
		const pid = p.playerId;
		if (pid == player)
			continue;
		
		let eventQueue = getEventQueue(pid);
		if (eventQueue === null) {
			eventQueue = [];
		}
		
		eventQueue.push(event);
		localStorage.setItem('eventQueue-' + pid, JSON.stringify(eventQueue));
	}
};
Server.declareSessionOver = function(playerIdsToScores: Map<number, number>): void {
	alert("Game over!");
};

(window as any).Kangaroo = {
	playerId: currentPlayer,
	turn: function(turn: any, callback: (status: number, response: any) => void) {
		const session = getSession();
		if (! session.players[currentPlayer].current) {
			callback(400, {
				"description": "It is not your turn."
			});
			return;
		}
		const result = Server.doTurn(session, session.players[currentPlayer], turn);
		if ((result as any).error) {
			callback(400, {
				"description": (result as any).error
			});
		} else {
			const gameState = (result as GameState);
			
			// Update current players
			for (let i = 0; i < session.players.length; i++) {
				session.players[i].current = gameState.currentPlayers.includes(i);
			}
			
			// Update environment
			session.environment = gameState.environment;
			
			localStorage.setItem('session', JSON.stringify(session));
		}
	},
	Rest: {
		isSuccess: function(code: number) {
			return (code >= 200 && code <= 299);
		}
	}
};

function pumpEvents() {
	const eventQueue = getEventQueue(currentPlayer);
	if (eventQueue && eventQueue.length > 0) {
		for (const e of eventQueue) {
			game.handleEvent(e);
		}
		localStorage.setItem('eventQueue-' + currentPlayer, "[]");
	}
}
setInterval(pumpEvents, 100);

window.onload = function() {
	const app = new PIXI.Application({ 
		width: window.innerWidth,
		height: window.innerHeight - 40,
		antialias: true,
		transparent: false,
		resolution: 1
	  }
	);
	
	app.renderer.view.style.position = "absolute";
	app.renderer.view.style.display = "block";
	
	app.renderer.plugins.interaction.interactionFrequency = 60;
	
	game.init(app, function() {
		game.loadSession(getPlayerEnvironment());
	});
	window.onresize = function(event: Event) {
		game.resize(
			window.innerWidth,
			window.innerHeight - 40
		);
	};
	
	// Toolbar for switching players
	const toolbar = document.createElement('div');
	toolbar.style.height = "40px";
	toolbar.style.lineHeight = "40px";
	toolbar.style.padding = "0 5px";
	const session = getSession();
	for (const p of session.players) {
		if (currentPlayer == p.playerId) {
			toolbar.innerHTML += ` <b>${p.user.username} (${p.playerId})</b> `;
		} else {
			toolbar.innerHTML += ` <a href="?playerId=${p.playerId}">${p.user.username} (${p.playerId})</a> `;
		}
	}
	toolbar.innerHTML += ` <a href="?reset=1">Reset</a> `;
	document.body.appendChild(toolbar);
	
	document.body.appendChild(app.view);
};

(window as any).game = game;