import * as PIXI from 'pixi.js';

import Game from './Game';

import './style.css';

let game = new Game();

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
	
	game.init(app);
	window.onresize = function(event: Event) {
		game.resize(
			window.innerWidth,
			window.innerHeight
		);
	};
	
	document.body.appendChild(app.view);
};

(window as any).game = game;