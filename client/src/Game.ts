import * as PIXI from 'pixi.js';
import { EventEmitter } from '@pixi/utils';
import { Actions, Interpolations } from 'pixi-actions';

let _spritesheet: PIXI.Spritesheet;

const debug = false;

export default class Game {
	static TARGET_WIDTH = 375;
	static TARGET_HEIGHT = 650;
	
	spritesheet: PIXI.Spritesheet;
	app: PIXI.Application;
	stage: PIXI.Container;
	
	width: number = window.innerWidth;
	height: number = window.innerHeight;
	
	constructor(app: PIXI.Application) {
		this.app = app;
		
		this.stage = new PIXI.Container();
		this.app.stage.addChild(this.stage);
		
		this.init();
		
		this.resize(this.app.renderer.width, this.app.renderer.height);
	}
	
	static tex(name: string): PIXI.Texture {
		return _spritesheet.textures[name]
	}
	
	init() {
		const data = require('../dist/packed.json');
		const baseTexture = new PIXI.BaseTexture(data.meta.image);
		this.spritesheet = new PIXI.Spritesheet(baseTexture, data);
		this.spritesheet.parse(() => {
			// finished preparing spritesheet textures
			_spritesheet = this.spritesheet;
			
			const sprite = PIXI.Sprite.from(Game.tex("spearman.png"));
			this.stage.addChild(sprite);
			
			this.app.ticker.add((delta: number) => this.tick(delta));
		});
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