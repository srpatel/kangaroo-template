class User {
	username: string;
}

export default class Player {
	playerId: number;
	sessionId: number;
	
	user: User;
	
	current: boolean;
	host: boolean;
};