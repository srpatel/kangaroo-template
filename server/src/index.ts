import Session from './Session';
import Player from './Player';

export class Game {
	static queueEvent(event: any, playerIds: Array<number>): void {}
	static declareSessionOver(playerIdsToScores: Map<number, number>): void {}
	static queueEventToAllButOnePlayer(event: any, player: number): void {}
	
	/**
	 * Return the number of players which should be current when the session starts.
	 * These players will be chosen randomly.
	 */
	static getNumInitialCurrentPlayers(options: any): number {
		return 1;
	}
	
	/**
	 * Perform required change in state when a player submits their turn.
	 */
	static doTurn(session: Session, player: Player, turn: any): any {
		return {
			"environment": session.environment,
			"currentPlayers": session.players
		};
	}
	
	/**
	 * Generate the initial environment for a session.
	 */
	static getInitialEnvironment(players: Array<Player>, options: any): any {
		return {
			"test": 123
		};
	}
	
	/**
	 * Use this to redact sensitive information.
	 */
	static getEnvironmentForPlayer(session: Session, player: Player): any {
		return session.environment;
	}
};