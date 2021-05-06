import * as PIXI from 'pixi.js';

import Game from './Game';
import { Game as Server } from '../../server/src/index';

import './style.css';

let game = new Game();

(window as any).Kangaroo = {
	playerId: 0,
};

window.onload = function() {
	const app = new PIXI.Application({ 
		width: window.innerWidth,
		height: window.innerHeight,
		antialias: true,
		transparent: false,
		resolution: 1
	  }
	);
	
	app.renderer.view.style.position = "absolute";
	app.renderer.view.style.display = "block";
	
	app.renderer.plugins.interaction.interactionFrequency = 60;
	
	game.init(app, function() {
		// Create new session and load it here
		const players = [
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
		console.log(gameState.environment);
		game.loadSession({
			sessionId: 0,
			game: "gamename",
			environment: Server.getEnvironmentForPlayer(
				{"environment": gameState.environment, players}, 
				players[0]),
			players: players,
			active: true,
			ranked: true,
			toEventId: 0
		});
	});
	window.onresize = function(event: Event) {
		game.resize(
			window.innerWidth,
			window.innerHeight
		);
	};
	
	document.body.appendChild(app.view);
};

(window as any).game = game;