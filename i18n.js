'use strict';

const de = {
	title: 'Q-POP',
	next: 'Weiter',
	yes: 'Ja',
	no: 'Nein',
	turn: 'Runde',
	load_game: 'Lade Spielstand',
	save_game: 'Speichere Spielstand',
	player: 'Spieler {num}',
	species: ['Purplus', 'Kiwiopteryx', 'Pesciodyphus', 'Isnobug', 'Amorph', 'Chuckberry'],
	iq: 'IQ',
	iqs: ['Charles Darwin', 'Darwins Gehilfe', 'Darwins Tante', 'Darwins Hund'],
	popup_title: 'Q-POP Sicherheitsdienst',
	catastrophe: 'Katastrophe',
	turns: ['KURZ (5 Runden)', 'MITTEL (10 Runden)', 'LANG (20 Runden)', 'BIS ZUM BITTEREN ENDE'],
	turn_finished: 'Ist Ihr Zug wirklich beendet?',
	dead: '"...und nun müssen wir uns LEIDER von Ihnen verabschieden, Sie waren ein toller Kandidat. Applaus, Applaus..."',
	last_turn: 'Gong! Die letzte Runde beginnt...',
	who_plays: 'Wer soll denn spielen?\nSie haben keinen Spieler angegeben!',
	continue_alone: 'Möchten Sie allein weiterspielen?',
	where_to_live: 'Wo wollen Sie denn leben? Ihre Spezies ist gar nicht auf der Karte!',
	suicide: 'Möchten Sie dieses Individuum wirklich umbringen?',
	game_over: 'BUUH, NUN IST ES VORBEI!!\nAlle menschlichen Spieler sind tot, das Spiel ist aus!',
	evo_score: 'Evolutionspunkte',
	traits: ['Anpassung Rangonen', 'Anpassung Blaublatt', 'Anpassung Wulgpilze', 'Anpassung Stinkbälle', 'Anpassung Schlingwurz', 'Anpassung Feuergras', 'Vermehrung', 'Angriffsstärke', 'Verteidigungsstärke', 'Tarnung', 'Geschwindigkeit', 'Sinnesorgane', 'Intelligenz'],
	transition_mutations: '', // Monstren und Mutationen
	transition_survival: '',  // Fressen und gefressen werden
	transition_world: '',     // Der Krieg der Arten
	debug_no_loading: 'Laden ist leider noch nicht möglich.',
	debug_no_saving: 'Speichern ist leider noch nicht möglich.',
	debug_too_bad: 'Schade'
};

const en = {
	title: 'Q-POP',
	next: 'Continue',  // "continue" is a protected word, so "next" is used as variable name
	yes: 'Yes',
	no: 'No',
	turn: 'Turn',
	load_game: 'Load savegame',
	save_game: 'Save game',
	player: 'Player {num}',
	species: ['Purplus', 'Kiwiopteryx', 'Pesciodyphus', 'Isnobug', 'Amorph', 'Chuckberry'],
	iq: 'IQ',
	iqs: ['Charles Darwin', 'Darwin’s Assistant', 'Darwin’s Aunt', 'Darwin’s Dog'],
	popup_title: 'Q-POP Security Service',
	catastrophe: 'Catastrophe',
	turns: ['5 turns', '10 turns', '20 turns', 'To the bitter end'],  // In original, the texts have some more info
	turn_finished: 'Is your turn really finished?',
	dead: 'Sorry, but you’re history now!\nYour species is gone...',
	last_turn: 'Gong! The last turn begins!',
	who_plays: 'Who shall play?\nYou haven’t selected a player!',
	continue_alone: 'Do you want to continue alone?',
	where_to_live: 'Where do you want to live? You haven’t placed your species on the map!',
	suicide: 'Do you really want to kill this individual?',
	game_over: 'IT’S ALL OVER NOW!!\nAll human players are dead, the game is over!',
	evo_score: 'Evolution Score',
	traits: ['Adaption to Rangones', 'Adaption to Blueleaf', 'Adaption to Hushrooms', 'Adaption to Stinkballs', 'Adaption to Snakeroots', 'Adaption to Firegrass', 'Reproduction Rate', 'Attack Strength', 'Defense Strength', 'Camouflage', 'Speed', 'Perception', 'Intelligence'],
	transition_mutations: 'Monsters and Mutants',
	transition_survival: 'Eat and Be Eaten',
	transition_world: 'The War of the Species',
	debug_no_loading: 'Unfortunately, it is currently not possible to load a game.',
	debug_no_saving: 'Unfortunately, it is currently not possible to save a game.',
	debug_too_bad: 'Too bad!'
};
