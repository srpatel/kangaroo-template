import Session from './Session';
import Player from './Player';
import GameState from './GameState';

export class Game {
	/**
	 * These will be injected by Kangaroo. Stubs left here for Typescript types.
	 */
	static queueEvent(event: any, playerIds: Array<number>): void {}
	static declareSessionOver(playerIdsToScores: Map<number, number>): void {}
	static queueEventToAllButOnePlayer(event: any, player: number): void {}
	
	/**
	 * Perform required change in state when a player submits their turn.
	 */
	static doTurn(session: Session, player: Player, turn: any): GameState | {error: string} {
		return {
			"environment": session.environment,
			"currentPlayers": [0]
		};
	}
	
	/**
	 * Generate the initial environment for a session.
	 */
	static setupGame(players: Array<Player>, options: any): GameState {
		return {
			"environment": {},
			"currentPlayers": [0]
		};
	}
	
	/**
	 * Use this to redact sensitive information.
	 */
	static getEnvironmentForPlayer(session: Session, player: Player): any {
		return session.environment;
	}
};