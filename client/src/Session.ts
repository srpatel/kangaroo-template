import Player from './Player';

export default class Session {
	sessionId: number;
	game: string;
	
	environment: any;
	players: Array<Player>;
	
	active: boolean;
	ranked: boolean;
	toEventId: number
};