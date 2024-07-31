import { PLAYER_TYPE, SPECIES } from './helper';
import { Tuple } from './types';

export class Player {
	id: number;
	iq = 2;
	type: PLAYER_TYPE;
	individuals = 0;
	toplace = 10;
	tomove = 0;
	is_dead = false;
	loved = 0;
	eaten = 0;
	experience = 0;
	deaths = 0;
	evo_score = 100;
	total_score = 230;
	stats: Tuple<number, 13> = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];

	constructor(num: number) {
		this.id = num;
		this.type = num === SPECIES.PURPLUS ? PLAYER_TYPE.HUMAN : PLAYER_TYPE.COMPUTER;
	}
}
