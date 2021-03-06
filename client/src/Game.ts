import * as PIXI from 'pixi.js';
import { Actions, Interpolations } from 'pixi-actions';

import Session from './Session';

let _spritesheet: PIXI.Spritesheet;

const debug = false;

export default class Game {
	static TARGET_WIDTH = 375;
	static TARGET_HEIGHT = 650;
	
	spritesheet: PIXI.Spritesheet;
	app: PIXI.Application;
	stage: PIXI.Container;
	
	loaded: boolean = false;
	waitingSession: Session = null;
	
	width: number = window.innerWidth;
	height: number = window.innerHeight;
	
	static tex(name: string): PIXI.Texture {
		return _spritesheet.textures[name]
	}
	
	init(app: PIXI.Application, loadCallback?: Function) {
		this.app = app;
		
		this.stage = new PIXI.Container();
		this.app.stage.addChild(this.stage);
		
		const promises = [];
		// promises.push(new Promise((resolve, reject) => {
		// 	new PIXI.Loader()
		// 		.add('Montserrat', './montserrat.fnt')
		// 		.load(() => {
		// 			resolve(true);
		// 		});
		// }));
		
		const data = require('../dist/packed.json');
		const baseTexture = new PIXI.BaseTexture(data.meta.image);
		this.spritesheet = new PIXI.Spritesheet(baseTexture, data);
		promises.push(new Promise((resolve, reject) => {
			this.spritesheet.parse(() => {
					resolve(true);
			});
		}));
		
		Promise.all(promises).then(() => {
			this.onLoaded();
			if (loadCallback) {
				loadCallback.call(this);
			}
		});
	}
	
	get playerId() {
		const K = (window as any).Kangaroo;
		return K.playerId;
	}
	
	turn(turn: any, callback: (status: number, response: any, target: any) => void) {
		const K = (window as any).Kangaroo;
		K.turn(turn, callback);
	}
	
	onLoaded() {
		this.loaded = true;
		
		_spritesheet = this.spritesheet;
		
		const sprite = PIXI.Sprite.from(Game.tex("spearman.png"));
		this.stage.addChild(sprite);
		
		this.app.ticker.add((delta: number) => this.tick(delta));
		
		this.resize(this.app.renderer.width, this.app.renderer.height);
		
		if (this.waitingSession) {
			this.loadSession(this.waitingSession);
			this.waitingSession = null;
		}
	}
	
	handleEvent(event: any) {
		// ...
	}
	
	loadSession(session: Session) {
		if (! this.loaded) {
			this.waitingSession = session;
			return;
		}
		// ...
	}
	
	tick(delta: number) {
		// delta is in frames
		let elapsedSeconds = delta/60;
		Actions.tick(elapsedSeconds);
	}
	
	resize(width: number, height: number) {
		//this part resizes the canvas but keeps ratio the same
		this.app.renderer.view.style.width = width + "px";
		this.app.renderer.view.style.height = height + "px";
		
		this.width = width;
		this.height = height;
		
		this.app.renderer.resize(
			width,
			height
		);
		
		// Ensure stage can fit inside the view!
		// Scale it if it's not snug
		const targetScaleX = width /Game.TARGET_WIDTH;
		const targetScaleY = height / Game.TARGET_HEIGHT;
		const scale = Math.min(targetScaleX, targetScaleY);
		this.stage.scale.set(scale, scale);
		
		// Centre stage
		this.stage.position.set((width - Game.TARGET_WIDTH * scale) / 2, (height - Game.TARGET_HEIGHT * scale) / 2);
	}
}