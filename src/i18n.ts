export type i18nStrings = {
	title: string;
	subtitle: string;
	next: string;
	yes: string;
	no: string;
	turn: string;
	close: string;
	load_game: string;
	save_game: string;
	start_game: string;
	loading: string;
	load: string;
	player: string;
	species: [string, string, string, string, string, string];
	iq: string;
	iqs: [string, string, string, string];
	popup_title: string;
	catastrophe: string;
	turns: [string, string, string, string];
	turn_finished: string;
	dead: string;
	last_turn: string;
	who_plays: string;
	continue_alone: string;
	where_to_live: string;
	suicide: string;
	game_over: string;
	evo_score: string;
	traits: [string, string, string, string, string, string, string, string, string, string, string, string, string];
	transition_mutations: string;
	transition_survival: string;
	transition_world: string;
	upload_description: string;
	upload: string;
	not_a_savegame: string;
	no_local_saves: string;
	really_restart: string;
	sound_disabled: string;
	information: string;
	credits_original: [[string, [string]], [string, [string]], [string, [string, string]], [string, [string]], [string, [string, string]]];
	credits_remake:
		| [[string, [string]], [string, [string, string]], [string, [string]]]
		| [[string, [string]], [string, [string, string]], [string, [string]], [string, [string]]];
	options_music: string;
	options_sound: string;
	options_lang: string;
	options_this_lang: string;
	options_auto_continue: string;
	options_click_hold: string;
	options_plants: string;
	options_predators: string;
	options_tutorial: string;
	options_ai_speed: string;
	options_ai_speeds: [string, string, string, string, string];
	options_transition: string;
	options_restart: string;
	tutorial_title: string;
	tutorial_abort: string;
	tutorial: {
		welcome: string;
		change_language: string;
		player_select: string;
		next: string;
		turns: string;
		wm_units: string;
		wm_shadows: string;
		wm_rightclick: string;
		mutation_start: string;
		mutation_plant: string;
		survival_start: string;
		survival_goals: string;
		survival_time: string;
		survival_radar: string;
		catastrophe: string;
		catastrophe0: string;
		catastrophe1: string;
		catastrophe2: string;
		catastrophe3: string;
		catastrophe4: string;
		catastrophe5: string;
		catastrophe6: string;
		catastrophe7: string;
		catastrophe8: string;
		ranking: string;
		ranking_save: string;
		ranking_no_save: string;
		save: string;
	};
	trait_hints: [string, string, string, string, string, string, string, string, string, string, string, string, string];
};

export const i18n: Record<string, i18nStrings> = {
	DE: {
		title: 'Q-POP',
		subtitle: 'Evolution im Weltraum',
		next: 'Weiter',
		yes: 'Ja',
		no: 'Nein',
		turn: 'Runde',
		close: 'Schließen',
		load_game: 'Spielstand laden',
		save_game: 'Spielstand speichern',
		start_game: 'Spiel starten',
		loading: 'lädt',
		load: 'laden',
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
		traits: [
			'Anpassung Rangonen',
			'Anpassung Blaublatt',
			'Anpassung Wulgpilze',
			'Anpassung Stinkbälle',
			'Anpassung Schlingwurz',
			'Anpassung Feuergras',
			'Vermehrung',
			'Angriffsstärke',
			'Verteidigungsstärke',
			'Tarnung',
			'Geschwindigkeit',
			'Sinnesorgane',
			'Intelligenz',
		],
		transition_mutations: '', // Monstren und Mutationen
		transition_survival: '', // Fressen und gefressen werden
		transition_world: '', // Der Krieg der Arten
		upload_description: 'Hier können Sie einen originalen oder heruntergeladenen Speicherstand laden.',
		upload: 'qpp-Datei hochladen',
		not_a_savegame: 'Die Datei ist kein gültiger Q-Pop-Speicherstand.',
		no_local_saves: 'Keine Speicherstände im Browser gefunden',
		really_restart: 'Möchten Sie das Spiel wirklich neu starten?',
		sound_disabled: 'Der Ton wurde komplett ausgeschaltet. Dies kann daran liegen, dass Ihr Browser keinen Ton abspielen kann.',
		information:
			'Dies ist eine neue Version des Spiels Q-Pop, das 1995 in Deutschland veröffentlicht wurde. Diese Version sollte das Originalspiel so gut wie möglich kopieren und einige praktische Funktionen hinzufügen. Sie sollte auf allen modernen Browsern laufen, die Javascript aktiviert haben. Der Quelltext ist auf Github frei verfügbar.',
		credits_original: [
			['Herausgeber und Entwickler', ['von Wendt Konzept GmbH']],
			['Idee', ['Karl-L. von Wendt']],
			['Programmierung', ['Karl-L. von Wendt', 'Lars Hammer']],
			['Grafiken und Animationen', ['Stefan Beyer']],
			['Musik', ['Karl-L. von Wendt', 'Lars Hammer']],
		],
		credits_remake: [
			['Programmierung', ['Mathias Bockwoldt']],
			['Reverse Engineering', ['Mathias Bockwoldt', 'Christian Klamt']],
			['Neue Grafiken', ['Eike Strathmann']],
		],
		options_music: 'Musik',
		options_sound: 'Geräusche',
		options_lang: 'Sprache',
		options_this_lang: 'DE Deutsch',
		options_auto_continue: 'Automatisch weiter klicken nach Computerzug auf der Weltkarte',
		options_click_hold: 'Maustaste gedrückt halten um Einheiten auf der Weltkarte zu platzieren',
		options_plants: 'Verteilung eigener Pflanzen auf Mutationsübersicht zeigen',
		options_predators: 'Besiegte Fleischfresser als Symbole in der Überlebensphase zeigen',
		options_tutorial: 'Tutorial zum Spiel anzeigen (aus- und anschalten zum Zurücksetzen)',
		options_ai_speed: 'Computergeschwindigkeit auf der Weltkarte',
		options_ai_speeds: ['extrem langsam', 'sehr langsam', 'langsam', 'schnell', 'augenblicklich'],
		options_transition: 'Anzeigedauer der Übergangsbildschirme',
		options_restart: 'Spiel neu starten',
		tutorial_title: 'Tutorial',
		tutorial_abort: 'Abbrechen',
		tutorial: {
			welcome:
				'Willkommen zu Q-Pop! Dieses Tutorial soll dir helfen, in die Gänge zu kommen. Für mehr Informationen, wirf einen Blick in die Anleitung, die in der Beschreibung unter dem Spiel verlinkt ist. Du kannst das Tutorial jederzeit mit dem Abbrechen-Button beenden.',
			change_language: 'Du kannst die Sprache und andere Optionen mit den Buttons hier oben ändern.',
			player_select:
				'Wähle die Arten die du und der Computer spielen sollen. Du kannst dafür auf den Kopf bzw. einen der Computer klicken. Wähle außerdem eine Schwierigkeitsstufe (das IQ-Level) für jede Art.',
			next: 'Um weiter zu kommen, kannst du immer hier klicken.',
			turns: 'Wähle, wie lang das Spiel dauern soll. Für den Anfang sollten fünf Runden ausreichen.',
			wm_units:
				'Setze deine Einheiten auf die Weltkarte. Nach der ersten Einheit kannst du weitere Einheiten nur direkt neben schon platzierte Einheiten setzen. Du kannst keine Einheiten auf Wasser oder Berge setzen. Pass also auf, dich nicht einzubauen! Am Anfang ist es ratsam, möglichst viele Pflanzen vom gleichen Typ zu besetzen.',
			wm_shadows:
				'Du kannst so viele Einheiten wieder aufnehmen, wie du Schatten hast. So kannst du Einheiten umplatzieren. Du bekommst mehr Schatten, wenn du die Geschwindigkeit der Spezies durch Mutationen verbesserst. Du kannst jetzt auch gegen benachbarte Einheiten einer anderen Art kämpfen, wenn du noch Einheiten übrig hast.',
			wm_rightclick:
				'Um zu sehen, auf welchen Pflanzen deine Einheiten stehen, kannst du auf eine Einheit rechtsklicken um zu sehen, auf welcher Pflanze sie steht. Alternativ kannst du auf den Avatar unter dem Kalender klicken, um alle Einheiten halbtransparent zu machen.',
			mutation_start:
				'Benutze Evolutionspunkte um die Eigenschaften der Spezies zu verbessern. Zu Beginn hast du 100 Evolutionspunkte, später wird die Anzahl von deinen Erfolgen im Spiel abhängen. Die Kreise rechts zeigen an, welche Pflanzen die Spezies auf der Weltkarte besetzt. Du kannst plus oder minus für kleine Schritte klicken, oder direkt in den Balken für große Schritte.',
			mutation_plant:
				'Die Spezies sollte mindestens 50% an die Pflanze angepasst sein, die sie auf der Weltkarte hauptsächlich besetzt. Klicke mit rechts auf eine Eigenschaft um mehr zu erfahren.',
			survival_start:
				'In diesem Teil des Spiels kontrollierst du ein Individuum deiner Spezies in einer Umgebung, die auf der Verteilung der Spezies auf der Weltkarte basiert. Bewege das Individuum indem du auf die Karte in der Richtung klickst, in der es gehen soll. Du kannst auch die Pfeil- und WASD-Tasten verwenden. Du kannst fressen, indem du auf das Individuum klickst oder die Leertaste drückst. Solltest du in einer ausweglosen Situation sein, kannst du das Individuum umbringen, indem du mit rechts drauf klickst oder Escape drückst.',
			survival_goals:
				'Versuche, so viele wie möglich zu fressen. Pflanzen, an die deine Spezies gut angepasst bist, sind nahrhafter für sie. Versuche, mindestens eine Reihe mit Nahrung zu füllen. Außerdem solltest du versuchen, dich zu vermehren, indem du neben ein Weibchen läufst. Nimm dich vor Fleischfressern in Acht!',
			survival_time:
				'Du hast eine bestimmte Anzahl Schritte zur Verfügung und für jeden Schritt nur ein paar Sekunden Zeit. Wenn das Individuum sterben sollte, kannst du mit einem anderen weiter machen, solange du noch Schritte hast. Jeder Tod wirkt sich auf die Verteilung der Spezies auf der Weltkarte aus.',
			survival_radar:
				'Nutze die Sinne deiner Spezies um vielversprechende Futterstellen, Weibchen, andere Pflanzenfresser und Fleichfresser in der Ferne zu sehen. Du kannst die Reichweite durch Mutationen verbessern.',
			catastrophe:
				'Jede Runde wird die Welt von einer Katastrophe heimgesucht. Diese können die Welt auf vielfältige Art verändern. Du solltest prüfen, ob deine Einheiten immer noch auf denselben Pflanzen stehen wie vor der Katastrophe.',
			catastrophe0:
				'Durch eine Verschiebung der Planetenachse wird der Kontinent näher an den Äquator gerückt. Dadurch steigt die mittlere Temperatur an, und durch veränderte Meeresströmungen fällt weniger Regen, während gleichzeitig der Meeresspiegel sinkt.', // Warming
			catastrophe1: 'Veränderungen in der Rotation des Planeten sorgen für eine Abkühlung des Klimas und mehr Regen.', // Cooling
			catastrophe2:
				'Ein riesiger Meteorit ist auf dem Planeten aufgeschlagen. Die unmittelbare Umgebung der Einschlagstelle wird verwüstet. Durch den Aufprall werden Millionen Tonnen an Staub in die Stratosphäre geschleudert. Die Sonneneinstrahlung sinkt, und das globale Klima kühlt sich stark ab. Die polaren Eiskappen dehnen sich aus und binden mehr Wasser, so dass der Meeresspiegel sinkt.', // Comet
			catastrophe3:
				'In einem bestimmten Gebiet der Karte tritt eine neue, rätselhafte Krankheit auf, an der alle Arten in diesem Gebiet erkranken. Jedes Individuum in dem Gebiet, in dem die Seuche auftritt, hat eine gewisse Chance, die Seuche zu überleben.', // Plague
			catastrophe4: 'Gewaltige Vulkaneruptionen zerstören alles tierische Leben in den unmittelbar angrenzenden Feldern.', // Volcano
			catastrophe5:
				'Das globale Klima hat sich stark erwärmt. Als Folge schmelzen die Polkappen, der Meeresspiegel steigt stark an und überflutet niedrig liegende Küstenregionen.', // Flood
			catastrophe6:
				'Ein starkes Erdbeben hat die gesamte Oberfläche des Planeten verändert. Wo eben noch Seen waren, können jetzt Berge entstehen und umgekehrt.', // Earthquake
			catastrophe7:
				'Menschen sind auf dem Planeten gelandet! In ihrem unermüdlichen Bestreben, der bedrohten Natur zu helfen, bauen sie eine Forschungsstation auf dem Planeten und machen sich auf die Jagd nach Versuchstieren, um die Wesen „vor dem Aussterben zu bewahren“. Die Menschen verhalten sich wie Fleischfresser, sind aber schwerer abzuschütteln als die natürlichen Feinde.', // Humans
			catastrophe8:
				'Verstärktes Auftreten kosmischer Strahlung verändert die Arten durch Mutation. Als Folge ändern sich die Eigenschaftswerte jeder Spezies sprunghaft.', // Cosmic rays
			ranking:
				'Hier kannst du den Erfolg der verschiedenen Spezies sehen. Am Anfang ist die Anzahl der Individuen auf der Weltkarte. Danach die Anzahl der zur Verfügung stehenden Evolutionspunkte (abhängig von der Anzahl der Individuen) und dann die Siegpunkte. Siegpunkte sind die Gesamtanzahl an eingesetzten und verfügbaren Evolutionspunkte.',
			ranking_save:
				'Das Spiel wird automatisch im Browser gespeichert. Wenn du einen Spielstand runterladen willst, kannst du das hier tun.',
			ranking_no_save: 'Wenn du einen Spielstand runterladen willst, kannst du das hier tun. Das Spiel wird nicht automatisch gespeichert.',
			save: 'Der Spielstand, den du eben runterladen konntest, kann wieder in diesem Spiel geladen werden. Außerdem ist er kompatibel mit dem Originalspiel!',
		},
		trait_hints: [
			'Anpassung an Rangonen verbessert die Nahrungsverwertung der Pflanze. Außerdem verbessert sie die Kampffähigkeiten auf der Weltkarte auf Rangonenfeldern.', // Rangones
			'Anpassung an Blaublatt verbessert die Nahrungsverwertung der Pflanze. Außerdem verbessert sie die Kampffähigkeiten auf der Weltkarte auf Blaublattfeldern.', // Blueleaf
			'Anpassung an Wulgpilze verbessert die Nahrungsverwertung der Pilze. Außerdem verbessert sie die Kampffähigkeiten auf der Weltkarte auf Wulgpilzfeldern.', // Hushrooms
			'Anpassung an Stinkbälle verbessert die Nahrungsverwertung der Pflanze. Außerdem verbessert sie die Kampffähigkeiten auf der Weltkarte auf Stinkballfeldern.', // Stinkballs
			'Anpassung an Schlingwurz verbessert die Nahrungsverwertung der Pflanze. Außerdem verbessert sie die Kampffähigkeiten auf der Weltkarte auf Schlingwurzfeldern.', // Snakeroot
			'Anpassung an Feuergras verbessert die Nahrungsverwertung der Pflanze. Außerdem verbessert sie die Kampffähigkeiten auf der Weltkarte auf Feuergrasfeldern.', // Firegrass
			'Vermehrung erhöht den Effekt des Paarens und Nahrungssammelns in der Überlebensphase und ergibt so mehr Einheiten auf der Weltkarte.', // Reproduction
			'Angriff verbessert die Chancen des Aggressors eines Kampfes auf der Weltkarte.', // Attack
			'Verteidigung verbessert die Chancen des Verteidigers eines Kampfes auf der Weltkarte. Außerdem erhöht sie die Chancen gegen Fleischfresser.', // Defense
			'Tarnung erhöht die Wahrscheinlichkeit, dass Fleischfresser die Fährte verlieren und einen nicht mehr verfolgen.', // Camouflage
			'Geschwindigkeit gibt mehr Bewegungspunkte auf der Weltkarte. Außerdem erhöht sie ein wenig die Wahrscheinlichkeit, dass Fleischfresser die Fährte verlieren.', // Speed
			'Sinnesorgane verbessern die Reichweite der kleinen Karte in der Überlebensrunde.', // Perception
			'Intelligenz verbessert die meisten der anderen Eigenschaften ein bisschen.', // Intelligence
		],
	},
	EN: {
		title: 'Q-POP',
		subtitle: 'Evolution in space',
		next: 'Continue', // "continue" is a protected word, so "next" is used as variable name
		yes: 'Yes',
		no: 'No',
		turn: 'Turn',
		close: 'Close',
		load_game: 'Load savegame',
		save_game: 'Save game',
		start_game: 'start game',
		loading: 'loading',
		load: 'load',
		player: 'Player {num}',
		species: ['Purplus', 'Kiwiopteryx', 'Pesciodyphus', 'Isnobug', 'Amorph', 'Chuckberry'],
		iq: 'IQ',
		iqs: ['Charles Darwin', 'Darwin’s helper', 'Darwin’s aunt', 'Darwin’s dog'],
		popup_title: 'Q-POP Security Service',
		catastrophe: 'Catastrophe',
		turns: ['Short (5 turns)', 'Medium (10 turns)', 'Long (20 turns)', 'To the bitter end'],
		turn_finished: 'Is your turn really finished?',
		dead: 'Sorry, but you’re history now!\nYour species is gone...',
		last_turn: 'Gong! The last turn begins!',
		who_plays: 'Who shall play?\nYou haven’t selected a player!',
		continue_alone: 'Do you want to continue alone?',
		where_to_live: 'Where do you want to live? You haven’t placed your species on the map!',
		suicide: 'Do you really want to kill this individual?',
		game_over: 'IT’S ALL OVER NOW!!\nAll human players are dead, the game is over!',
		evo_score: 'Evolution Score',
		traits: [
			'Adaption to Rangones',
			'Adaption to Blueleaf',
			'Adaption to Hushrooms',
			'Adaption to Stinkballs',
			'Adaption to Snakeroots',
			'Adaption to Firegrass',
			'Reproduction Rate',
			'Attack Strength',
			'Defence Strength',
			'Camouflage',
			'Speed',
			'Perception',
			'Intelligence',
		],
		transition_mutations: 'Monsters and Mutants',
		transition_survival: 'Eat and Be Eaten',
		transition_world: 'The War of the Species',
		upload_description: 'Here, you can upload an original or downloaded savegame.',
		upload: 'Upload qpp file',
		not_a_savegame: 'The file is not a valid Q-Pop save game.',
		no_local_saves: 'No save games found in browser',
		really_restart: 'Do you really want to restart the game?',
		sound_disabled: 'The sound was disabled. It seems like your browser cannot play any sound.',
		information:
			'This game is a remake of the original Q-Pop game, released in Germany in 1995 by von Wendt Konzept GmbH. This remake should be as close as possible to the original game with some added convenience functions. It should run on all modern browsers that have Javascript enabled. The source code is freely available on Github.',
		credits_original: [
			['Publisher and developer', ['von Wendt Konzept GmbH']],
			['Game design', ['Karl-L. von Wendt']],
			['Programming', ['Karl-L. von Wendt', 'Lars Hammer']],
			['Graphics', ['Stefan Beyer']],
			['Music', ['Karl-L. von Wendt', 'Lars Hammer']],
		],
		credits_remake: [
			['Programming', ['Mathias Bockwoldt']],
			['Reverse engineering', ['Mathias Bockwoldt', 'Christian Klamt']],
			['New graphics', ['Eike Strathmann']],
			['English translation', ['Mathias Bockwoldt']],
		],
		options_music: 'Music',
		options_sound: 'Sound',
		options_lang: 'Language',
		options_this_lang: 'EN English',
		options_auto_continue: 'Auto continue after AI placement on world map',
		options_click_hold: 'Click and hold to place or remove units from world map',
		options_plants: 'Show distribution of plants on mutation screen',
		options_predators: 'Show vanquished predator symbols in survival',
		options_tutorial: 'Show game tutorial (switch off and on to reset)',
		options_ai_speed: 'AI speed on world map',
		options_ai_speeds: ['extremly slow', 'very slow', 'slow', 'fast', 'instantaneous'],
		options_transition: 'View duration of transition screen',
		options_restart: 'Restart game',
		tutorial_title: 'Tutorial',
		tutorial_abort: 'Abort',
		tutorial: {
			welcome:
				'Welcome to Q-Pop! This tutorial will help you getting started. For more details, please have a look at the manual linked in the description below the game. You can abort the tutorial any time by clicking abort.',
			change_language: 'You can change the language and other options with the buttons up here.',
			player_select:
				'Select the species you and the computer should play. Click on the head or the computers to select the type of the player. In addition, choose a difficulty setting (IQ level) for each species.',
			next: 'You can always continue here or by pressing enter.',
			turns: 'Select how long a game you want to play. For the beginning, five rounds may be enough.',
			wm_units:
				'Place your units on the world map. After the first unit, you can only place units adjacent to others. You cannot place units on mountains or water. So take care to not trap yourself close to the coast or in the mountains. In the beginning, it is favourable to place most units on the same type of plants.',
			wm_shadows:
				'You can pick up as many units as you have shadows. This way, you can move units on the world map. You can improve your speed trait in the mutations screen to get more shadows. From this turn on, you can fight against adjacent units of a different species if you have units left.',
			wm_rightclick:
				'To see, on which plants your units are, you can right click on a unit to see the plant below it. Alternatively, you can click on the avatar below the calendar to make all units semitransparent.',
			mutation_start:
				'Distribute evolution points to improve traits of your species. In the beginning, you have 100 evolution points but later in the game, the number will depend on your success in the game. The circles to the right show, which plants your species occupies on the world map. You can click on plus or minus for small steps or directly click the bar for large steps.',
			mutation_plant:
				'In the beginning, the adaptation to the plant you occupy most should have at least 50%. Rightclick on any trait to learn more about it.',
			survival_start:
				'In this part of the game, you play one individual of your species in an environment that is created dependent on the positions you occupy on the world map. Move by clicking on the survival map or by using the arrow keys or WASD. You can eat by clicking on the individual or pressing space. If you should be in a hopeless situation, you can rightclick on the individual or press escape to kill it and start at a new position.',
			survival_goals:
				'Try to eat as many plants as possible. Plants that your species is adapted to will yield more nutrition. You should fill at least one food bar. In addition, you should try to reproduce by walking next to a female. Finally, try to avoid predators.',
			survival_time:
				'You have a limited amount of steps and a limited amount of time for each step. If you die, you will continue with another individual, but every death affects the distribution of your species on the world map.',
			survival_radar:
				'Use the senses of your species to see promising food patches, mating partners, other herbivores and predators. You can increase the range of the senses by mutations.',
			catastrophe:
				'Catastrophes happen every turn. They can change various aspects of the world. You should check whether your units still occupy the same plants as before.',
			catastrophe0:
				'The planetary axis shifted, moving the continent closer to the equator. As a consequence, the average temperature rises, the sea level falls and there is less rain.', // Warming
			catastrophe1: 'Changes in the rotation of the planet cause a colder climate and more rain.', // Cooling
			catastrophe2:
				'A large meteorite hit the planet. The vicinity of the impact becomes devastated. Millions of tons of sand and dust are blown into the stratosphere, cooling the climate. The polar ice caps bind more water leading to a falling sea level.', // Comet
			catastrophe3:
				'A new, puzzling disease appears in a specific area of the continent, affecting all species in that area. Every individual in the area where the disease occurs has a certain chance of surviving the disease.', // Plague
			catastrophe4: 'Huge volcanic eruptions destroy all animal life in the immediately adjacent fields.', // Volcano
			catastrophe5:
				'The global climate has warmed up. As a result, the polar ice caps melt, the sea level rises sharply and floods low lying coastal regions.', // Flood
			catastrophe6: 'A strong earthquake change the whole surface of the planet. Lakes may turn into mountains and vice versa.', // Earthquake
			catastrophe7:
				'Humans have landed on the planet! In their tireless efforts to help endangered nature, they build a research station on the planet and hunt for experimental animals “save them from extinction”. Humans behave like carnivores, but are more difficult to shake off than the natural enemies.', // Humans
			catastrophe8:
				'Increased occurrence of cosmic radiation changes all species by mutation. As a result, the traits of each species change dramatically.', // Cosmic rays
			ranking:
				'Here, you can see your ranking in the world. First is the number of individuals on the world map. Second is the amount of evolution points available this round. This depends on the number of individuals. Third is the victory points, that are all used and available evolution points added up.',
			ranking_save: 'The game is automatically saved in the browser. If you want to download a savegame, you can do that here.',
			ranking_no_save: 'If you want to download a savegame, you can do that here. The game will not be saved automatically.',
			save: 'The savegame you were just offered can be loaded again in this game. But it is also compatible with the original game!',
		},
		trait_hints: [
			'Adaptation to rangones improves the food utilisation of the plant. In addition, the adaptation is an advantage in fights on the world map on rangone fields.', // Rangones
			'Adaptation to blueleaf improves the food utilisation of the plant. In addition, the adaptation is an advantage in fights on the world map on blueleaf fields.', // Blueleaf
			'Adaptation to hushrooms improves the food utilisation of the plant. In addition, the adaptation is an advantage in fights on the world map on hushroom fields.', // Hushrooms
			'Adaptation to stinkballs improves the food utilisation of the plant. In addition, the adaptation is an advantage in fights on the world map on stinkball fields.', // Stinkballs
			'Adaptation to snakeroots improves the food utilisation of the plant. In addition, the adaptation is an advantage in fights on the world map on snakeroot fields.', // Snakeroot
			'Adaptation to firegrass improves the food utilisation of the plant. In addition, the adaptation is an advantage in fights on the world map on firegrass fields.', // Firegrass
			'The reproduction rate increases the effect of mating and feeding, yielding more units for the world map.', // Reproduction
			'The attack strength increases the chances for the aggressor of a fight on the world map.', // Attack
			'The defence strength increases the chances for the defender of a fight on the world map. Furthermore, it increases the probability of winning against predators.', // Defense
			'Camouflage increases the probability that predators lose the trail and do not follow the player.', // Camouflage
			'Speed grants more movement points on the world map. In addition, speed increases the probability that predators lose the trail by a small amount.', // Speed
			'Perception improves the range of the mini map during survival.', // Perception
			'Intelligence improves most of the other traits by a small amount.', // Intelligence
		],
	},
	FR: {
		title: 'Q-POP',
		subtitle: "Évolution dans l'espace",
		next: 'Continuer',
		yes: 'Oui',
		no: 'Non',
		turn: 'Tour',
		close: 'Fermer',
		load_game: 'Charger une sauvegarde',
		save_game: 'Sauvegarder',
		start_game: 'Commencer le jeu',
		loading: 'chargement',
		load: 'charger',
		player: 'Joueur {num}',
		species: ['Purplus', 'Kiwiopteryx', 'Pesciodyphus', 'Isnobug', 'Amorph', 'Chuckberry'],
		iq: 'QI',
		iqs: ['Charles Darwin', 'Assistant de Darwin', 'Tante de Darwin', 'Chien de Darwin'],
		popup_title: 'Service de Sécurité Q-POP',
		catastrophe: 'Catastrophe',
		turns: ['Court (5 tours)', 'Moyen (10 tours)', 'Long (20 tours)', "Jusqu'au bout"],
		turn_finished: 'Ton tour est vraiment fini?',
		dead: "Désolé, mais c'est fini pour toi !\nTon espèce est éteinte...",
		last_turn: 'Gong! Dernier tour!',
		who_plays: "Qui va jouer?\nTu n'as pas choisi de joueur!",
		continue_alone: 'Veux-tu continuer seul?',
		where_to_live: "Où veux-tu vivre? Tu n'as pas placé ton espèce sur la carte!",
		suicide: 'Tu veux vraiment sacrifier cet individu?',
		game_over: "C'EST FINI !!\nTous les joueurs humains sont morts, le jeu est terminé!",
		evo_score: "Score d'Évolution",
		traits: [
			'Adaptation aux Rangones',
			'Adaptation aux Feuillebleues',
			'Adaptation aux Champis',
			'Adaptation aux Boules puantes',
			'Adaptation aux Racines de serpent',
			"Adaptation à l'Herbe de feu",
			'Taux de reproduction',
			"Force d'attaque",
			'Force de défense',
			'Camouflage',
			'Vitesse',
			'Perception',
			'Intelligence',
		],
		transition_mutations: 'Monstres et Mutants',
		transition_survival: 'Manger ou être mangé',
		transition_world: 'La Guerre des Espèces',
		upload_description: 'Ici, vous pouvez téléverser une sauvegarde originale ou téléchargée.',
		upload: 'Téléverser un fichier qpp',
		not_a_savegame: "Le fichier n'est pas une sauvegarde valide de Q-Pop.",
		no_local_saves: 'Aucune sauvegarde trouvée dans le navigateur',
		really_restart: 'Voulez-vous vraiment redémarrer le jeu?',
		sound_disabled: 'Le son a été désactivé. Il semble que votre navigateur ne puisse pas lire de son.',
		information:
			'Ce jeu est un remake du jeu original Q-Pop, sorti en Allemagne en 1995 par von Wendt Konzept GmbH. Ce remake vise à être aussi proche que possible du jeu original avec quelques fonctionnalités supplémentaires. Il devrait fonctionner sur tous les navigateurs modernes avec Javascript activé. Le code source est librement disponible sur Github.',
		credits_original: [
			['Éditeur et développeur', ['von Wendt Konzept GmbH']],
			['Conception du jeu', ['Karl-L. von Wendt']],
			['Programmation', ['Karl-L. von Wendt', 'Lars Hammer']],
			['Graphismes', ['Stefan Beyer']],
			['Musique', ['Karl-L. von Wendt', 'Lars Hammer']],
		],
		credits_remake: [
			['Programmation', ['Mathias Bockwoldt']],
			['Ingénierie inverse', ['Mathias Bockwoldt', 'Christian Klamt']],
			['Nouveaux graphismes', ['Eike Strathmann']],
			['Traduction français', ['Mathias Bockwoldt (avec ChatGPT)']],
		],
		options_music: 'Musique',
		options_sound: 'Son',
		options_lang: 'Langue',
		options_this_lang: 'FR Français',
		options_auto_continue: "Continuer automatiquement après le placement de l'IA sur la carte",
		options_click_hold: 'Cliquez et maintenez pour placer ou retirer des unités de la carte',
		options_plants: "Afficher la répartition des plantes à l'écran des mutations",
		options_predators: 'Afficher les symboles des prédateurs vaincus dans la survie',
		options_tutorial: 'Afficher le tutoriel du jeu (désactivez et réactivez pour réinitialiser)',
		options_ai_speed: "Vitesse de l'IA sur la carte",
		options_ai_speeds: ['extrêmement lent', 'très lent', 'lent', 'rapide', 'instantané'],
		options_transition: "Durée de l'écran de transition",
		options_restart: 'Redémarrer le jeu',
		tutorial_title: 'Tutoriel',
		tutorial_abort: 'Abandonner',
		tutorial: {
			welcome:
				'Bienvenue dans Q-Pop! Ce tutoriel vous aidera à commencer. Pour plus de détails, veuillez consulter le manuel lié dans la description sous le jeu. Vous pouvez interrompre le tutoriel à tout moment en cliquant sur abandonner.',
			change_language: "Vous pouvez changer la langue et d'autres options avec les boutons ici.",
			player_select:
				"Sélectionnez l'espèce que vous et l'ordinateur allez jouer. Cliquez sur la tête ou sur les ordinateurs pour sélectionner le type de joueur. De plus, choisissez un niveau de difficulté (niveau QI) pour chaque espèce.",
			next: 'Vous pouvez toujours continuer ici ou en appuyant sur Entrée.',
			turns: 'Choisissez la durée de la partie que vous souhaitez. Pour commencer, cinq tours peuvent suffire.',
			wm_units:
				"Placez vos unités sur la carte du monde. Après la première unité, vous ne pouvez placer des unités que près d'autres unités. Vous ne pouvez pas placer d'unités sur des montagnes ou dans l'eau. Faites attention à ne pas vous piéger près de la côte ou dans les montagnes. Au début, il est préférable de placer la plupart des unités sur le même type de plantes.",
			wm_shadows:
				"Vous pouvez déplacer autant d'unités que vous avez d'ombres. Ainsi, vous pouvez déplacer les unités sur la carte du monde. Vous pouvez améliorer votre caractéristique de vitesse dans l'écran des mutations pour obtenir plus d'ombres. À partir de ce tour, vous pouvez combattre des unités adjacentes d'une autre espèce si vous avez encore des unités.",
			wm_rightclick:
				"Pour voir sur quelles plantes se trouvent vos unités, vous pouvez cliquer avec le bouton droit sur une unité pour voir la plante en dessous. Alternativement, vous pouvez cliquer sur l'avatar sous le calendrier pour rendre toutes les unités semi-transparentes.",
			mutation_start:
				"Distribuez des points d'évolution pour améliorer les traits de votre espèce. Au début, vous avez 100 points d'évolution, mais plus tard dans le jeu, le nombre dépendra de votre succès dans le jeu. Les cercles à droite montrent quelles plantes votre espèce occupe sur la carte du monde. Vous pouvez cliquer sur plus ou moins pour de petits ajustements ou directement sur la barre pour de grands ajustements.",
			mutation_plant:
				"Au début, l'adaptation à la plante que vous occupez le plus devrait atteindre au moins 50%. Cliquez avec le bouton droit sur n'importe quel trait pour en savoir plus à son sujet.",
			survival_start:
				"Dans cette partie du jeu, vous jouez un individu de votre espèce dans un environnement créé en fonction des positions que vous occupez sur la carte du monde. Déplacez-vous en cliquant sur la carte de survie ou en utilisant les flèches ou WASD. Vous pouvez manger en cliquant sur l'individu ou en appuyant sur Espace. Si vous vous trouvez dans une situation désespérée, vous pouvez cliquer avec le bouton droit sur l'individu ou appuyer sur Échap pour le tuer et commencer à une nouvelle position.",
			survival_goals:
				"Essayez de manger le plus de plantes possible. Les plantes auxquelles votre espèce est adaptée fourniront plus de nutrition. Vous devez remplir au moins une barre de nourriture. En outre, vous devez essayer de vous reproduire en vous rapprochant d'une femelle. Enfin, essayez d'éviter les prédateurs.",
			survival_time:
				'Vous avez un nombre limité de pas et un temps limité pour chaque pas. Si vous mourrez, vous continuerez avec un autre individu, mais chaque mort affecte la répartition de votre espèce sur la carte du monde.',
			survival_radar:
				"Utilisez les sens de votre espèce pour repérer des zones de nourriture prometteuses, des partenaires de reproduction, d'autres herbivores et des prédateurs. Vous pouvez augmenter la portée des sens par des mutations.",
			catastrophe:
				"Des catastrophes se produisent à chaque tour. Elles peuvent modifier divers aspects du monde. Vous devez vérifier si vos unités occupent toujours les mêmes plantes qu'avant.",
			catastrophe0:
				"L'axe planétaire a changé, rapprochant le continent de l'équateur. En conséquence, la température moyenne augmente, le niveau de la mer baisse et il y a moins de pluie.", // Réchauffement
			catastrophe1: 'Des changements dans la rotation de la planète provoquent un climat plus froid et plus de pluie.', // Refroidissement
			catastrophe2:
				"Un gros météorite a frappé la planète. Les environs de l'impact sont dévastés. Des millions de tonnes de sable et de poussière sont projetées dans la stratosphère, refroidissant le climat. Les calottes polaires retiennent plus d'eau, entraînant une baisse du niveau de la mer.", // Comète
			catastrophe3:
				'Une nouvelle maladie mystérieuse apparaît dans une zone spécifique du continent, affectant toutes les espèces dans cette zone. Chaque individu de la zone où la maladie se produit a une certaine chance de survivre à la maladie.', // Peste
			catastrophe4: "D'énormes éruptions volcaniques détruisent toute vie animale dans les champs adjacents.", // Volcan
			catastrophe5:
				"Le climat global s'est réchauffé. En conséquence, les calottes polaires fondent, le niveau de la mer monte brusquement et inonde les régions côtières basses.", // Inondation
			catastrophe6:
				'Un fort tremblement de terre modifie toute la surface de la planète. Les lacs peuvent se transformer en montagnes et vice versa.', // Séisme
			catastrophe7:
				"Les humains ont atterri sur la planète ! Dans leurs efforts inlassables pour aider la nature en danger, ils construisent une station de recherche sur la planète et chassent les animaux expérimentaux pour les “sauver de l'extinction”. Les humains se comportent comme des carnivores, mais sont plus difficiles à éloigner que les ennemis naturels.", // Humains
			catastrophe8:
				"L'augmentation de l'occurrence des radiations cosmiques modifie toutes les espèces par mutation. En conséquence, les traits de chaque espèce changent radicalement.", // Rayons cosmiques
			ranking:
				"Ici, vous pouvez voir votre classement mondial. Premièrement, le nombre d'individus sur la carte du monde. Deuxièmement, le nombre de points d'évolution disponibles ce tour-ci. Cela dépend du nombre d'individus. Troisièmement, les points de victoire, qui sont tous les points d'évolution utilisés et disponibles ajoutés.",
			ranking_save:
				'Le jeu est automatiquement sauvegardé dans le navigateur. Si vous souhaitez télécharger une sauvegarde, vous pouvez le faire ici.',
			ranking_no_save:
				'Si vous souhaitez télécharger une sauvegarde, vous pouvez le faire ici. Le jeu ne sera pas sauvegardé automatiquement.',
			save: 'La sauvegarde que vous venez de recevoir peut être chargée à nouveau dans ce jeu. Mais elle est également compatible avec le jeu original!',
		},
		trait_hints: [
			"L'adaptation aux rangones améliore l'utilisation alimentaire de la plante. De plus, l'adaptation est un avantage dans les combats sur la carte du monde dans les champs de rangones.", // Rangones
			"L'adaptation aux feuillebleues améliore l'utilisation alimentaire de la plante. De plus, l'adaptation est un avantage dans les combats sur la carte du monde dans les champs de feuillebleues.", // Feuillebleues
			"L'adaptation aux champis améliore l'utilisation alimentaire de la plante. De plus, l'adaptation est un avantage dans les combats sur la carte du monde dans les champs de champis.", // Champis
			"L'adaptation aux boules puantes améliore l'utilisation alimentaire de la plante. De plus, l'adaptation est un avantage dans les combats sur la carte du monde dans les champs de boules puantes.", // Boules puantes
			"L'adaptation aux racines de serpent améliore l'utilisation alimentaire de la plante. De plus, l'adaptation est un avantage dans les combats sur la carte du monde dans les champs de racines de serpent.", // Racines de serpent
			"L'adaptation à l'herbe de feu améliore l'utilisation alimentaire de la plante. De plus, l'adaptation est un avantage dans les combats sur la carte du monde dans les champs d'herbe de feu.", // Herbe de feu
			"Le taux de reproduction augmente l'effet de l'accouplement et de l'alimentation, générant plus d'unités pour la carte du monde.", // Reproduction
			"La force d'attaque augmente les chances pour l'attaquant dans un combat sur la carte du monde.", // Attaque
			'La force de défense augmente les chances pour le défenseur dans un combat sur la carte du monde. De plus, elle augmente la probabilité de gagner contre les prédateurs.', // Défense
			'Le camouflage augmente la probabilité que les prédateurs perdent la trace et ne suivent pas le joueur.', // Camouflage
			'La vitesse accorde plus de points de mouvement sur la carte du monde. De plus, la vitesse augmente légèrement la probabilité que les prédateurs perdent la trace.', // Vitesse
			'La perception améliore la portée de la mini-carte pendant la survie.', // Perception
			"L'intelligence améliore légèrement la plupart des autres traits.", // Intelligence
		],
	},
	ES: {
		title: 'Q-POP',
		subtitle: 'Evolución en el espacio',
		next: 'Continuar',
		yes: 'Sí',
		no: 'No',
		turn: 'Turno',
		close: 'Cerrar',
		load_game: 'Cargar partida guardada',
		save_game: 'Guardar partida',
		start_game: 'Iniciar juego',
		loading: 'cargando',
		load: 'cargar',
		player: 'Jugador {num}',
		species: ['Purplus', 'Kiwiopteryx', 'Pesciodyphus', 'Isnobug', 'Amorph', 'Chuckberry'],
		iq: 'CI',
		iqs: ['Charles Darwin', 'Ayudante de Darwin', 'Tía de Darwin', 'Perro de Darwin'],
		popup_title: 'Servicio de Seguridad de Q-POP',
		catastrophe: 'Catástrofe',
		turns: ['Corto (5 turnos)', 'Medio (10 turnos)', 'Largo (20 turnos)', 'Hasta el amargo final'],
		turn_finished: '¿Realmente has terminado tu turno?',
		dead: '¡Lo siento, pero ahora eres historia!\nTu especie ha desaparecido...',
		last_turn: '¡Gong! ¡Comienza el último turno!',
		who_plays: '¿Quién va a jugar?\n¡No has seleccionado un jugador!',
		continue_alone: '¿Quieres continuar solo?',
		where_to_live: '¿Dónde quieres vivir? ¡No has colocado tu especie en el mapa!',
		suicide: '¿Realmente quieres eliminar a este individuo?',
		game_over: '¡SE ACABÓ TODO!!\nTodos los jugadores humanos están muertos, ¡el juego ha terminado!',
		evo_score: 'Puntuación de Evolución',
		traits: [
			'Adaptación a Rangones',
			'Adaptación a Blueleaf',
			'Adaptación a Hushrooms',
			'Adaptación a Stinkballs',
			'Adaptación a Snakeroots',
			'Adaptación a Firegrass',
			'Tasa de Reproducción',
			'Fuerza de Ataque',
			'Fuerza de Defensa',
			'Camuflaje',
			'Velocidad',
			'Percepción',
			'Inteligencia',
		],
		transition_mutations: 'Monstruos y Mutantes',
		transition_survival: 'Comer o Ser Comido',
		transition_world: 'La Guerra de las Especies',
		upload_description: 'Aquí puedes subir una partida guardada original o descargada.',
		upload: 'Subir archivo qpp',
		not_a_savegame: 'El archivo no es un juego guardado válido de Q-Pop.',
		no_local_saves: 'No se encontraron partidas guardadas en el navegador',
		really_restart: '¿Realmente quieres reiniciar el juego?',
		sound_disabled: 'El sonido está desactivado. Parece que tu navegador no puede reproducir ningún sonido.',
		information:
			'Este juego es un remake del juego original Q-Pop, lanzado en Alemania en 1995 por von Wendt Konzept GmbH. Este remake busca ser lo más fiel posible al juego original con algunas funciones adicionales de conveniencia. Debería funcionar en todos los navegadores modernos que tengan Javascript habilitado. El código fuente está disponible de forma gratuita en Github.',
		credits_original: [
			['Publicador y desarrollador', ['von Wendt Konzept GmbH']],
			['Diseño del juego', ['Karl-L. von Wendt']],
			['Programación', ['Karl-L. von Wendt', 'Lars Hammer']],
			['Gráficos', ['Stefan Beyer']],
			['Música', ['Karl-L. von Wendt', 'Lars Hammer']],
		],
		credits_remake: [
			['Programación', ['Mathias Bockwoldt']],
			['Ingeniería inversa', ['Mathias Bockwoldt', 'Christian Klamt']],
			['Nuevos gráficos', ['Eike Strathmann']],
			['Traducción al español', ['Mathias Bockwoldt (con ChatGPT)']],
		],
		options_music: 'Música',
		options_sound: 'Sonido',
		options_lang: 'Idioma',
		options_this_lang: 'ES Español',
		options_auto_continue: 'Continuar automáticamente después de la colocación de la IA en el mapa mundial',
		options_click_hold: 'Mantener pulsado para colocar o eliminar unidades del mapa mundial',
		options_plants: 'Mostrar distribución de plantas en la pantalla de mutación',
		options_predators: 'Mostrar símbolos de depredadores vencidos en la supervivencia',
		options_tutorial: 'Mostrar tutorial del juego (apagar y encender para reiniciar)',
		options_ai_speed: 'Velocidad de la IA en el mapa mundial',
		options_ai_speeds: ['extremadamente lenta', 'muy lenta', 'lenta', 'rápida', 'instantánea'],
		options_transition: 'Duración de la pantalla de transición',
		options_restart: 'Reiniciar juego',
		tutorial_title: 'Tutorial',
		tutorial_abort: 'Abortar',
		tutorial: {
			welcome:
				'¡Bienvenido a Q-Pop! Este tutorial te ayudará a empezar. Para más detalles, consulta el manual enlazado en la descripción debajo del juego. Puedes abortar el tutorial en cualquier momento haciendo clic en abortar.',
			change_language: 'Puedes cambiar el idioma y otras opciones con los botones de aquí arriba.',
			player_select:
				'Selecciona la especie que tú y el ordenador jugarán. Haz clic en la cabeza o en las computadoras para seleccionar el tipo de jugador. Además, elige un nivel de dificultad (nivel de CI) para cada especie.',
			next: 'Siempre puedes continuar aquí o presionando enter.',
			turns: 'Selecciona cuánto tiempo quieres que dure el juego. Para empezar, cinco rondas pueden ser suficientes.',
			wm_units:
				'Coloca tus unidades en el mapa mundial. Después de la primera unidad, solo puedes colocar unidades adyacentes a otras. No puedes colocar unidades en montañas o agua. Así que ten cuidado de no atraparte cerca de la costa o en las montañas. Al principio, es favorable colocar la mayoría de las unidades en el mismo tipo de plantas.',
			wm_shadows:
				'Puedes recoger tantas unidades como sombras tengas. De esta manera, puedes mover unidades en el mapa mundial. Puedes mejorar tu rasgo de velocidad en la pantalla de mutaciones para obtener más sombras. Desde este turno, puedes luchar contra unidades adyacentes de una especie diferente si tienes unidades restantes.',
			wm_rightclick:
				'Para ver en qué plantas están tus unidades, puedes hacer clic derecho en una unidad para ver la planta debajo de ella. Alternativamente, puedes hacer clic en el avatar debajo del calendario para hacer todas las unidades semitransparentes.',
			mutation_start:
				'Distribuye puntos de evolución para mejorar los rasgos de tu especie. Al principio, tienes 100 puntos de evolución, pero más adelante en el juego, el número dependerá de tu éxito en el juego. Los círculos a la derecha muestran qué plantas ocupa tu especie en el mapa mundial. Puedes hacer clic en más o menos para pasos pequeños o directamente en la barra para pasos grandes.',
			mutation_plant:
				'Al principio, la adaptación a la planta que ocupas más debería tener al menos el 50%. Haz clic derecho en cualquier rasgo para aprender más sobre él.',
			survival_start:
				'En esta parte del juego, juegas como un individuo de tu especie en un entorno que se crea dependiendo de las posiciones que ocupes en el mapa mundial. Muévete haciendo clic en el mapa de supervivencia o usando las teclas de flechas o WASD. Puedes comer haciendo clic en el individuo o presionando espacio. Si te encuentras en una situación desesperada, puedes hacer clic derecho en el individuo o presionar escape para eliminarlo y comenzar en una nueva posición.',
			survival_goals:
				'Intenta comer tantas plantas como puedas. Las plantas a las que tu especie está adaptada darán más nutrición. Debes llenar al menos una barra de comida. Además, debes intentar reproducirte caminando junto a una hembra. Finalmente, trata de evitar a los depredadores.',
			survival_time:
				'Tienes una cantidad limitada de pasos y un tiempo limitado para cada paso. Si mueres, continuarás con otro individuo, pero cada muerte afecta la distribución de tu especie en el mapa mundial.',
			survival_radar:
				'Utiliza los sentidos de tu especie para ver parches de comida prometedores, parejas, otros herbívoros y depredadores. Puedes aumentar el alcance de los sentidos con mutaciones.',
			catastrophe:
				'Las catástrofes ocurren cada turno. Pueden cambiar varios aspectos del mundo. Debes verificar si tus unidades todavía ocupan las mismas plantas que antes.',
			catastrophe0:
				'El eje planetario se desplazó, acercando el continente al ecuador. Como consecuencia, la temperatura media sube, el nivel del mar baja y llueve menos.', // Calentamiento
			catastrophe1: 'Los cambios en la rotación del planeta causan un clima más frío y más lluvia.', // Enfriamiento
			catastrophe2:
				'Un gran meteorito impactó el planeta. La zona del impacto queda devastada. Millones de toneladas de arena y polvo son expulsadas a la estratosfera, enfriando el clima. Las capas de hielo polar atan más agua, lo que hace que el nivel del mar baje.', // Cometa
			catastrophe3:
				'Aparece una nueva y desconcertante enfermedad en una zona específica del continente, afectando a todas las especies en esa área. Cada individuo en la zona donde ocurre la enfermedad tiene una cierta posibilidad de sobrevivir.', // Plaga
			catastrophe4: 'Enormes erupciones volcánicas destruyen toda vida animal en los campos inmediatamente adyacentes.', // Volcán
			catastrophe5:
				'El clima global se ha calentado. Como resultado, las capas de hielo polar se derriten, el nivel del mar sube drásticamente e inunda las regiones costeras bajas.', // Inundación
			catastrophe6: 'Un fuerte terremoto cambia toda la superficie del planeta. Los lagos pueden convertirse en montañas y viceversa.', // Terremoto
			catastrophe7:
				'¡Los humanos han aterrizado en el planeta! En sus incansables esfuerzos por ayudar a la naturaleza en peligro, construyen una estación de investigación en el planeta y cazan animales experimentales para “salvarlos de la extinción”. Los humanos se comportan como carnívoros, pero son más difíciles de evitar que los enemigos naturales.', // Humanos
			catastrophe8:
				'El aumento de la radiación cósmica cambia todas las especies por mutación. Como resultado, los rasgos de cada especie cambian drásticamente.', // Rayos cósmicos
			ranking:
				'Aquí puedes ver tu clasificación en el mundo. Primero, el número de individuos en el mapa mundial. Segundo, la cantidad de puntos de evolución disponibles en esta ronda. Esto depende del número de individuos. Tercero, los puntos de victoria, que son todos los puntos de evolución usados y disponibles sumados.',
			ranking_save: 'El juego se guarda automáticamente en el navegador. Si quieres descargar una partida guardada, puedes hacerlo aquí.',
			ranking_no_save: 'Si quieres descargar una partida guardada, puedes hacerlo aquí. El juego no se guardará automáticamente.',
			save: 'La partida guardada que se te acaba de ofrecer se puede cargar de nuevo en este juego. ¡Pero también es compatible con el juego original!',
		},
		trait_hints: [
			'La adaptación a los rangones mejora la utilización de la planta como alimento. Además, la adaptación es una ventaja en combates en el mapa mundial en campos de rangones.', // Rangones
			'La adaptación a la blueleaf mejora la utilización de la planta como alimento. Además, la adaptación es una ventaja en combates en el mapa mundial en campos de blueleaf.', // Blueleaf
			'La adaptación a los hushrooms mejora la utilización de la planta como alimento. Además, la adaptación es una ventaja en combates en el mapa mundial en campos de hushrooms.', // Hushrooms
			'La adaptación a los stinkballs mejora la utilización de la planta como alimento. Además, la adaptación es una ventaja en combates en el mapa mundial en campos de stinkballs.', // Stinkballs
			'La adaptación a los snakeroots mejora la utilización de la planta como alimento. Además, la adaptación es una ventaja en combates en el mapa mundial en campos de snakeroots.', // Snakeroot
			'La adaptación a la firegrass mejora la utilización de la planta como alimento. Además, la adaptación es una ventaja en combates en el mapa mundial en campos de firegrass.', // Firegrass
			'La tasa de reproducción aumenta el efecto de apareamiento y alimentación, produciendo más unidades para el mapa mundial.', // Reproducción
			'La fuerza de ataque aumenta las probabilidades de ganar un combate como agresor en el mapa mundial.', // Ataque
			'La fuerza de defensa aumenta las probabilidades de ganar un combate como defensor en el mapa mundial. Además, aumenta la probabilidad de ganar contra depredadores.', // Defensa
			'El camuflaje aumenta la probabilidad de que los depredadores pierdan el rastro y no sigan al jugador.', // Camuflaje
			'La velocidad otorga más puntos de movimiento en el mapa mundial. Además, la velocidad aumenta ligeramente la probabilidad de que los depredadores pierdan el rastro.', // Velocidad
			'La percepción mejora el alcance del mini mapa durante la supervivencia.', // Percepción
			'La inteligencia mejora la mayoría de los otros rasgos en una pequeña cantidad.', // Inteligencia
		],
	},
	PT: {
		title: 'Q-POP',
		subtitle: 'Evolução no espaço',
		next: 'Continuar',
		yes: 'Sim',
		no: 'Não',
		turn: 'Turno',
		close: 'Fechar',
		load_game: 'Carregar jogo salvo',
		save_game: 'Salvar jogo',
		start_game: 'Iniciar jogo',
		loading: 'Carregando',
		load: 'Carregar',
		player: 'Jogador {num}',
		species: ['Purplus', 'Kiwiopteryx', 'Pesciodyphus', 'Isnobug', 'Amorph', 'Chuckberry'],
		iq: 'QI',
		iqs: ['Charles Darwin', 'Assistente de Darwin', 'Tia de Darwin', 'Cachorro de Darwin'],
		popup_title: 'Serviço de Segurança Q-POP',
		catastrophe: 'Catástrofe',
		turns: ['Curto (5 turnos)', 'Médio (10 turnos)', 'Longo (20 turnos)', 'Até o amargo fim'],
		turn_finished: 'Você realmente terminou seu turno?',
		dead: 'Sinto muito, mas você é história agora!\nSua espécie desapareceu...',
		last_turn: 'Gong! O último turno começa!',
		who_plays: 'Quem deve jogar?\nVocê não selecionou um jogador!',
		continue_alone: 'Quer continuar sozinho?',
		where_to_live: 'Onde você quer viver? Você não colocou sua espécie no mapa!',
		suicide: 'Você realmente quer matar este indivíduo?',
		game_over: 'TUDO ACABOU!!\nTodos os jogadores humanos estão mortos, o jogo acabou!',
		evo_score: 'Pontuação de Evolução',
		traits: [
			'Adaptação a Rangones',
			'Adaptação a Folha-Azul',
			'Adaptação a Fungo-Silencioso',
			'Adaptação a Bolas-Fedorentas',
			'Adaptação a Raízes-Serpente',
			'Adaptação a Grama-de-Fogo',
			'Taxa de Reprodução',
			'Força de Ataque',
			'Força de Defesa',
			'Camuflagem',
			'Velocidade',
			'Percepção',
			'Inteligência',
		],
		transition_mutations: 'Monstros e Mutantes',
		transition_survival: 'Comer ou Ser Comido',
		transition_world: 'A Guerra das Espécies',
		upload_description: 'Aqui, você pode enviar um jogo salvo original ou baixado.',
		upload: 'Enviar arquivo qpp',
		not_a_savegame: 'O arquivo não é um jogo salvo válido do Q-Pop.',
		no_local_saves: 'Nenhum jogo salvo encontrado no navegador',
		really_restart: 'Você realmente quer reiniciar o jogo?',
		sound_disabled: 'O som foi desativado. Parece que seu navegador não pode reproduzir som.',
		information:
			'Este jogo é uma nova versão do jogo original Q-Pop, lançado na Alemanha em 1995 pela von Wendt Konzept GmbH. Esta versão deve ser o mais próxima possível do jogo original, com algumas funções de conveniência adicionadas. Deve funcionar em todos os navegadores modernos que possuem Javascript habilitado. O código-fonte está disponível gratuitamente no Github.',
		credits_original: [
			['Editora e desenvolvedora', ['von Wendt Konzept GmbH']],
			['Design do jogo', ['Karl-L. von Wendt']],
			['Programação', ['Karl-L. von Wendt', 'Lars Hammer']],
			['Gráficos', ['Stefan Beyer']],
			['Música', ['Karl-L. von Wendt', 'Lars Hammer']],
		],
		credits_remake: [
			['Programação', ['Mathias Bockwoldt']],
			['Engenharia reversa', ['Mathias Bockwoldt', 'Christian Klamt']],
			['Novos gráficos', ['Eike Strathmann']],
			['Tradução para português', ['Mathias Bockwoldt (com ChatGPT)']],
		],
		options_music: 'Música',
		options_sound: 'Som',
		options_lang: 'Idioma',
		options_this_lang: 'PT Português',
		options_auto_continue: 'Continuar automaticamente após a colocação da IA no mapa mundial',
		options_click_hold: 'Clique e segure para colocar ou remover unidades do mapa mundial',
		options_plants: 'Mostrar distribuição de plantas na tela de mutação',
		options_predators: 'Mostrar símbolos de predadores derrotados na sobrevivência',
		options_tutorial: 'Mostrar tutorial do jogo (desligue e ligue para redefinir)',
		options_ai_speed: 'Velocidade da IA no mapa mundial',
		options_ai_speeds: ['extremamente lento', 'muito lento', 'lento', 'rápido', 'instantâneo'],
		options_transition: 'Duração da tela de transição',
		options_restart: 'Reiniciar jogo',
		tutorial_title: 'Tutorial',
		tutorial_abort: 'Abortar',
		tutorial: {
			welcome:
				'Bem-vindo ao Q-Pop! Este tutorial ajudará você a começar. Para mais detalhes, consulte o manual vinculado na descrição abaixo do jogo. Você pode abortar o tutorial a qualquer momento clicando em abortar.',
			change_language: 'Você pode mudar o idioma e outras opções com os botões aqui em cima.',
			player_select:
				'Selecione a espécie que você e o computador devem jogar. Clique na cabeça ou nos computadores para selecionar o tipo de jogador. Além disso, escolha um nível de dificuldade (nível de QI) para cada espécie.',
			next: 'Você pode sempre continuar aqui ou pressionando enter.',
			turns: 'Selecione o tempo de duração do jogo. Para começar, cinco rodadas podem ser suficientes.',
			wm_units:
				'Coloque suas unidades no mapa mundial. Após a primeira unidade, você só pode colocar unidades adjacentes a outras. Você não pode colocar unidades em montanhas ou água. Então, tome cuidado para não se prender perto da costa ou nas montanhas. No começo, é favorável colocar a maioria das unidades no mesmo tipo de plantas.',
			wm_shadows:
				'Você pode pegar tantas unidades quanto tiver sombras. Dessa forma, você pode mover unidades no mapa mundial. Você pode melhorar seu atributo de velocidade na tela de mutações para obter mais sombras. A partir deste turno, você pode lutar contra unidades adjacentes de uma espécie diferente se tiver unidades restantes.',
			wm_rightclick:
				'Para ver em quais plantas suas unidades estão, você pode clicar com o botão direito em uma unidade para ver a planta abaixo dela. Alternativamente, você pode clicar no avatar abaixo do calendário para tornar todas as unidades semitransparentes.',
			mutation_start:
				'Distribua pontos de evolução para melhorar os atributos da sua espécie. No início, você tem 100 pontos de evolução, mas mais tarde no jogo, o número dependerá do seu sucesso no jogo. Os círculos à direita mostram quais plantas sua espécie ocupa no mapa mundial. Você pode clicar em mais ou menos para pequenos passos ou clicar diretamente na barra para grandes passos.',
			mutation_plant:
				'No início, a adaptação à planta que você ocupa mais deve ter pelo menos 50%. Clique com o botão direito em qualquer atributo para saber mais sobre ele.',
			survival_start:
				'Nesta parte do jogo, você joga com um indivíduo da sua espécie em um ambiente que é criado dependendo das posições que você ocupa no mapa mundial. Mova-se clicando no mapa de sobrevivência ou usando as teclas de seta ou WASD. Você pode comer clicando no indivíduo ou pressionando espaço. Se você estiver em uma situação sem esperança, pode clicar com o botão direito no indivíduo ou pressionar escape para matá-lo e começar em uma nova posição.',
			survival_goals:
				'Tente comer o máximo de plantas possível. Plantas para as quais sua espécie está adaptada renderão mais nutrição. Você deve preencher pelo menos uma barra de comida. Além disso, tente se reproduzir andando ao lado de uma fêmea. Finalmente, evite predadores.',
			survival_time:
				'Você tem uma quantidade limitada de passos e um tempo limitado para cada passo. Se você morrer, continuará com outro indivíduo, mas cada morte afeta a distribuição da sua espécie no mapa mundial.',
			survival_radar:
				'Use os sentidos da sua espécie para ver boas áreas de comida, parceiros de acasalamento, outros herbívoros e predadores. Você pode aumentar o alcance dos sentidos através de mutações.',
			catastrophe:
				'Catástrofes acontecem a cada turno. Elas podem mudar vários aspectos do mundo. Você deve verificar se suas unidades ainda ocupam as mesmas plantas de antes.',
			catastrophe0:
				'O eixo planetário mudou, aproximando o continente do equador. Como consequência, a temperatura média aumenta, o nível do mar baixa e há menos chuva.', // Aquecimento
			catastrophe1: 'Mudanças na rotação do planeta causam um clima mais frio e mais chuva.', // Resfriamento
			catastrophe2:
				'Um grande meteorito atingiu o planeta. A vizinhança do impacto é devastada. Milhões de toneladas de areia e poeira são lançadas na estratosfera, esfriando o clima. As calotas polares prendem mais água, levando a uma queda no nível do mar.', // Cometa
			catastrophe3:
				'Uma nova doença enigmática aparece em uma área específica do continente, afetando todas as espécies na área. Cada indivíduo na área onde a doença ocorre tem uma certa chance de sobreviver.', // Praga
			catastrophe4: 'Enormes erupções vulcânicas destroem toda a vida animal nos campos imediatamente adjacentes.', // Vulcão
			catastrophe5:
				'O clima global aqueceu. Como resultado, as calotas polares derretem, o nível do mar sobe drasticamente e inunda regiões costeiras baixas.', // Inundação
			catastrophe6: 'Um forte terremoto altera toda a superfície do planeta. Lagos podem se transformar em montanhas e vice-versa.', // Terremoto
			catastrophe7:
				'Humanos pousaram no planeta! Em seus incansáveis esforços para ajudar a natureza ameaçada, eles constroem uma estação de pesquisa no planeta e caçam animais experimentais para "salvá-los da extinção". Humanos se comportam como carnívoros, mas são mais difíceis de se livrar do que os inimigos naturais.', // Humanos
			catastrophe8:
				'Aumento da ocorrência de radiação cósmica muda todas as espécies por mutação. Como resultado, as características de cada espécie mudam drasticamente.', // Radiação Cósmica
			ranking:
				'Aqui, você pode ver seu ranking no mundo. Primeiro, o número de indivíduos no mapa mundial. Segundo, a quantidade de pontos de evolução disponíveis nesta rodada. Isso depende do número de indivíduos. Terceiro, os pontos de vitória, que são todos os pontos de evolução usados e disponíveis somados.',
			ranking_save: 'O jogo é salvo automaticamente no navegador. Se você quiser baixar um jogo salvo, pode fazer isso aqui.',
			ranking_no_save: 'Se você quiser baixar um jogo salvo, pode fazer isso aqui. O jogo não será salvo automaticamente.',
			save: 'O jogo salvo que você acabou de oferecer pode ser carregado novamente neste jogo. Mas também é compatível com o jogo original!',
		},
		trait_hints: [
			'Adaptação a rangones melhora a utilização de alimentos da planta. Além disso, a adaptação é uma vantagem em lutas no mapa mundial em campos de rangones.', // Rangones
			'Adaptação a folha-azul melhora a utilização de alimentos da planta. Além disso, a adaptação é uma vantagem em lutas no mapa mundial em campos de folha-azul.', // Blueleaf
			'Adaptação a fungo-silencioso melhora a utilização de alimentos da planta. Além disso, a adaptação é uma vantagem em lutas no mapa mundial em campos de fungo-silencioso.', // Hushrooms
			'Adaptação a bolas-fedorentas melhora a utilização de alimentos da planta. Além disso, a adaptação é uma vantagem em lutas no mapa mundial em campos de bolas-fedorentas.', // Stinkballs
			'Adaptação a raízes-serpente melhora a utilização de alimentos da planta. Além disso, a adaptação é uma vantagem em lutas no mapa mundial em campos de raízes-serpente.', // Snakeroot
			'Adaptação a grama-de-fogo melhora a utilização de alimentos da planta. Além disso, a adaptação é uma vantagem em lutas no mapa mundial em campos de grama-de-fogo.', // Firegrass
			'A taxa de reprodução aumenta o efeito do acasalamento e alimentação, gerando mais unidades para o mapa mundial.', // Reproduction
			'A força de ataque aumenta as chances do agressor em uma luta no mapa mundial.', // Attack
			'A força de defesa aumenta as chances do defensor em uma luta no mapa mundial. Além disso, aumenta a probabilidade de vencer contra predadores.', // Defense
			'A camuflagem aumenta a probabilidade de que os predadores percam o rastro e não sigam o jogador.', // Camouflage
			'A velocidade concede mais pontos de movimento no mapa mundial. Além disso, a velocidade aumenta um pouco a probabilidade de que os predadores percam o rastro.', // Speed
			'A percepção melhora o alcance do mini mapa durante a sobrevivência.', // Perception
			'A inteligência melhora a maioria dos outros atributos em uma pequena quantidade.', // Intelligence
		],
	},
	IT: {
		title: 'Q-POP',
		subtitle: 'Evoluzione nello spazio',
		next: 'Continua',
		yes: 'Sì',
		no: 'No',
		turn: 'Turno',
		close: 'Chiudi',
		load_game: 'Carica partita salvata',
		save_game: 'Salva partita',
		start_game: 'Inizia gioco',
		loading: 'Caricamento',
		load: 'Carica',
		player: 'Giocatore {num}',
		species: ['Purplus', 'Kiwiopteryx', 'Pesciodyphus', 'Isnobug', 'Amorph', 'Chuckberry'],
		iq: 'QI',
		iqs: ['Charles Darwin', 'Assistente di Darwin', 'Zia di Darwin', 'Cane di Darwin'],
		popup_title: 'Servizio di Sicurezza di Q-POP',
		catastrophe: 'Catastrofe',
		turns: ['Breve (5 turni)', 'Medio (10 turni)', 'Lungo (20 turni)', 'Fino alla fine amara'],
		turn_finished: 'Hai davvero finito il tuo turno?',
		dead: 'Mi dispiace, ora sei storia!\nLa tua specie si è estinta...',
		last_turn: "Gong! Inizia l'ultimo turno!",
		who_plays: 'Chi gioca?\nNon hai selezionato un giocatore!',
		continue_alone: 'Vuoi continuare da solo?',
		where_to_live: 'Dove vuoi vivere? Non hai posizionato la tua specie sulla mappa!',
		suicide: 'Vuoi davvero eliminare questo individuo?',
		game_over: 'È FINITO TUTTO!!\nTutti i giocatori umani sono morti, il gioco è finito!',
		evo_score: 'Punteggio Evoluzione',
		traits: [
			'Adattamento ai Rangoni',
			'Adattamento alla Blueleaf',
			'Adattamento agli Hushrooms',
			'Adattamento agli Stinkballs',
			'Adattamento ai Snakeroots',
			'Adattamento al Firegrass',
			'Tasso di Riproduzione',
			"Forza d'Attacco",
			'Forza di Difesa',
			'Mimetizzazione',
			'Velocità',
			'Percezione',
			'Intelligenza',
		],
		transition_mutations: 'Mostri e Mutanti',
		transition_survival: 'Mangia o vieni mangiato',
		transition_world: 'La Guerra delle Specie',
		upload_description: 'Puoi caricare qui un salvataggio originale o scaricato.',
		upload: 'Carica file qpp',
		not_a_savegame: 'Il file non è un salvataggio valido di Q-Pop.',
		no_local_saves: 'Nessun salvataggio trovato nel browser',
		really_restart: 'Vuoi davvero riavviare il gioco?',
		sound_disabled: 'Il suono è disabilitato. Sembra che il tuo browser non possa riprodurre alcun suono.',
		information:
			"Questo gioco è un remake dell'originale Q-Pop, rilasciato in Germania nel 1995 da von Wendt Konzept GmbH. Questo remake mira a essere il più fedele possibile al gioco originale con alcune funzionalità di convenienza aggiuntive. Dovrebbe funzionare su tutti i browser moderni con Javascript abilitato. Il codice sorgente è disponibile gratuitamente su Github.",
		credits_original: [
			['Editore e sviluppatore', ['von Wendt Konzept GmbH']],
			['Design del gioco', ['Karl-L. von Wendt']],
			['Programmazione', ['Karl-L. von Wendt', 'Lars Hammer']],
			['Grafica', ['Stefan Beyer']],
			['Musica', ['Karl-L. von Wendt', 'Lars Hammer']],
		],
		credits_remake: [
			['Programmazione', ['Mathias Bockwoldt']],
			['Reverse Engineering', ['Mathias Bockwoldt', 'Christian Klamt']],
			['Nuova grafica', ['Eike Strathmann']],
			['Traduzione italiano', ['Mathias Bockwoldt (con ChatGPT)']],
		],
		options_music: 'Musica',
		options_sound: 'Suono',
		options_lang: 'Lingua',
		options_this_lang: 'IT Italiano',
		options_auto_continue: "Continua automaticamente dopo il piazzamento dell'IA sulla mappa mondiale",
		options_click_hold: 'Clicca e tieni premuto per posizionare o rimuovere unità sulla mappa mondiale',
		options_plants: 'Mostra distribuzione delle piante nella schermata delle mutazioni',
		options_predators: 'Mostra simboli dei predatori sconfitti nella sopravvivenza',
		options_tutorial: 'Mostra tutorial del gioco (spegnere e riaccendere per riavviare)',
		options_ai_speed: 'Velocità IA sulla mappa mondiale',
		options_ai_speeds: ['molto lenta', 'lenta', 'normale', 'veloce', 'istantanea'],
		options_transition: 'Durata della schermata di transizione',
		options_restart: 'Riavvia gioco',
		tutorial_title: 'Tutorial',
		tutorial_abort: 'Abbandona',
		tutorial: {
			welcome:
				'Benvenuto in Q-Pop! Questo tutorial ti aiuterà a iniziare. Per maggiori dettagli, consulta il manuale collegato nella descrizione sotto il gioco. Puoi abbandonare il tutorial in qualsiasi momento facendo clic su abbandona.',
			change_language: 'Puoi cambiare la lingua e altre opzioni con i pulsanti qui sopra.',
			player_select:
				'Seleziona la specie che tu e il computer giocherete. Fai clic sulla testa o sui computer per selezionare il tipo di giocatore. Inoltre, scegli un livello di difficoltà (QI) per ogni specie.',
			next: 'Puoi sempre continuare qui o premendo invio.',
			turns: 'Scegli quanto tempo vuoi che duri il gioco. Per iniziare, cinque turni possono essere sufficienti.',
			wm_units:
				"Posiziona le tue unità sulla mappa mondiale. Dopo la prima unità, puoi posizionare solo unità adiacenti ad altre. Non puoi posizionare unità su montagne o acqua. Quindi, fai attenzione a non bloccarti vicino alla costa o alle montagne. All'inizio, è favorevole posizionare la maggior parte delle unità sullo stesso tipo di piante.",
			wm_shadows:
				'Puoi raccogliere tante unità quanti ombre hai. In questo modo, puoi spostare le unità sulla mappa mondiale. Puoi migliorare il tuo tratto di velocità nella schermata delle mutazioni per ottenere più ombre. Da questo turno, puoi combattere contro unità adiacenti di una specie diversa se hai unità rimaste.',
			wm_rightclick:
				"Per vedere su quali piante si trovano le tue unità, puoi fare clic con il tasto destro su un'unità per vedere la pianta sotto di essa. In alternativa, puoi fare clic sull'avatar sotto il calendario per rendere tutte le unità semitrasparenti.",
			mutation_start:
				"Distribuisci i punti evoluzione per migliorare i tratti della tua specie. All'inizio, hai 100 punti evoluzione, ma più avanti nel gioco, il numero dipenderà dal tuo successo nel gioco. I cerchi a destra mostrano quali piante occupa la tua specie sulla mappa mondiale. Puoi fare clic su più o meno per piccoli passi o direttamente sulla barra per grandi passi.",
			mutation_plant:
				"All'inizio, l'adattamento alla pianta che occupi di più dovrebbe essere almeno al 50%. Fai clic con il tasto destro su qualsiasi tratto per saperne di più.",
			survival_start:
				"In questa parte del gioco, giochi come un individuo della tua specie in un ambiente creato in base alle posizioni che occupi sulla mappa mondiale. Muoviti facendo clic sulla mappa di sopravvivenza o usando i tasti freccia o WASD. Puoi mangiare facendo clic sull'individuo o premendo spazio. Se ti trovi in una situazione disperata, puoi fare clic con il tasto destro sull'individuo o premere escape per eliminarlo e iniziare in una nuova posizione.",
			survival_goals:
				'Cerca di mangiare quante più piante puoi. Le piante a cui la tua specie è adattata daranno più nutrimento. Devi riempire almeno una barra di cibo. Inoltre, devi cercare di riprodurti camminando vicino a una femmina. Infine, cerca di evitare i predatori.',
			survival_time:
				'Hai una quantità limitata di passi e un tempo limitato per ogni passo. Se muori, continuerai con un altro individuo, ma ogni morte influisce sulla distribuzione della tua specie sulla mappa mondiale.',
			survival_radar: 'Usa i sensi della tua specie per vedere macchie di cibo promettenti, compagni, altri erbivori e predatori.',
			catastrophe:
				'Le catastrofi accadono ogni volta. Possono cambiare vari aspetti del mondo. Dovreste controllare se le vostre unità occupano ancora le stesse piante di prima',
			catastrophe0:
				"L'asse planetario si è spostato, avvicinando il continente all'equatore. Di conseguenza, la temperatura media è aumentata, il livello del mare si è abbassato e le piogge sono diminuite.",
			catastrophe1:
				"Un asteroide colpisce il pianeta, causando l'estinzione di massa di tutte le forme di vita! Solo alcune specie possono sopravvivere in alcuni punti casuali.",
			catastrophe2:
				'Un cometa oscura il cielo, bloccando la luce solare e rilasciando polveri nella stratosfera, raffreddando il clima. Le calotte polari trattengono più acqua, facendo abbassare il livello del mare.',
			catastrophe3:
				'Una nuova malattia misteriosa appare in una zona specifica del continente, colpendo tutte le specie in quella zona. Ogni individuo nella zona ha una certa possibilità di sopravvivere.',
			catastrophe4: 'Grandi eruzioni vulcaniche distruggono tutta la vita animale nei campi immediatamente adiacenti.',
			catastrophe5:
				'Il clima globale si è riscaldato. Di conseguenza, le calotte polari si sciolgono, il livello del mare sale drasticamente e inonda le regioni costiere basse.',
			catastrophe6: 'Un forte terremoto cambia tutta la superficie del pianeta. I laghi possono diventare montagne e viceversa.',
			catastrophe7:
				"Gli umani sono atterrati sul pianeta! Nei loro instancabili sforzi per aiutare la natura in pericolo, costruiscono una stazione di ricerca sul pianeta e catturano animali per “salvarli dall'estinzione”. Gli umani si comportano come carnivori, ma sono più difficili da evitare rispetto ai nemici naturali.",
			catastrophe8:
				"L'aumento della radiazione cosmica muta tutte le specie. Di conseguenza, le caratteristiche di ogni specie cambiano drasticamente.",
			ranking:
				'Qui puoi vedere la tua classifica nel mondo. Primo, il numero di individui sulla mappa mondiale. Secondo, il numero di punti evoluzione disponibili in questo turno. Questo dipende dal numero di individui. Terzo, i punti vittoria, che sono la somma di tutti i punti evoluzione usati e disponibili.',
			ranking_save: 'Il gioco viene salvato automaticamente nel browser. Se vuoi scaricare un salvataggio, puoi farlo qui.',
			ranking_no_save: 'Se vuoi scaricare un salvataggio, puoi farlo qui. Il gioco non verrà salvato automaticamente.',
			save: 'Il salvataggio che ti è stato appena offerto può essere caricato nuovamente in questo gioco. È compatibile anche con il gioco originale!',
		},
		trait_hints: [
			"L'adattamento ai rangoni migliora l'utilizzo della pianta come cibo. Inoltre, l'adattamento è un vantaggio nei combattimenti sulla mappa mondiale nei campi di rangoni.",
			"L'adattamento alla blueleaf migliora l'utilizzo della pianta come cibo. Inoltre, l'adattamento è un vantaggio nei combattimenti sulla mappa mondiale nei campi di blueleaf.",
			"L'adattamento agli hushrooms migliora l'utilizzo della pianta come cibo. Inoltre, l'adattamento è un vantaggio nei combattimenti sulla mappa mondiale nei campi di hushrooms.",
			"L'adattamento agli stinkballs migliora l'utilizzo della pianta come cibo. Inoltre, l'adattamento è un vantaggio nei combattimenti sulla mappa mondiale nei campi di stinkballs.",
			"L'adattamento ai snakeroots migliora l'utilizzo della pianta come cibo. Inoltre, l'adattamento è un vantaggio nei combattimenti sulla mappa mondiale nei campi di snakeroots.",
			"L'adattamento al firegrass migliora l'utilizzo della pianta come cibo. Inoltre, l'adattamento è un vantaggio nei combattimenti sulla mappa mondiale nei campi di firegrass.",
			"Il tasso di riproduzione aumenta l'effetto dell'accoppiamento e dell'alimentazione, producendo più unità per la mappa mondiale.",
			"La forza d'attacco aumenta le probabilità di vincere un combattimento come aggressore sulla mappa mondiale.",
			'La forza di difesa aumenta le probabilità di vincere un combattimento come difensore sulla mappa mondiale. Inoltre, aumenta la probabilità di vincere contro i predatori.',
			'Il mimetismo aumenta la probabilità che i predatori perdano la traccia e non seguano il giocatore.',
			'La velocità garantisce più punti di movimento sulla mappa mondiale. Inoltre, la velocità aumenta leggermente la probabilità che i predatori perdano la traccia.',
			'La percezione migliora la portata del mini mappa durante la sopravvivenza.',
			"L'intelligenza migliora la maggior parte degli altri tratti in piccola quantità.",
		],
	},
	NO: {
		title: 'Q-POP',
		subtitle: 'Evolusjon i verdensrommet',
		next: 'Fortsett',
		yes: 'Ja',
		no: 'Nei',
		turn: 'Tur',
		close: 'Lukk',
		load_game: 'Last inn lagret spill',
		save_game: 'Lagre spill',
		start_game: 'start spill',
		loading: 'laster',
		load: 'last',
		player: 'Spiller {num}',
		species: ['Purplus', 'Kiwiopteryx', 'Pesciodyphus', 'Isnobug', 'Amorph', 'Chuckberry'],
		iq: 'IQ',
		iqs: ['Charles Darwin', 'Darwins hjelper', 'Darwins tante', 'Darwins hund'],
		popup_title: 'Q-POP Sikkerhetstjeneste',
		catastrophe: 'Katastrofe',
		turns: ['Kort (5 runder)', 'Middels (10 runder)', 'Lang (20 runder)', 'Til den bitre enden'],
		turn_finished: 'Er du virkelig ferdig med turen din?',
		dead: 'Beklager, men du er historie nå!\nArten din er borte...',
		last_turn: 'Gong! Siste runde begynner!',
		who_plays: 'Hvem skal spille?\nDu har ikke valgt en spiller!',
		continue_alone: 'Vil du fortsette alene?',
		where_to_live: 'Hvor vil du bo? Du har ikke plassert arten din på kartet!',
		suicide: 'Vil du virkelig drepe denne individen?',
		game_over: 'SPILLET ER OVER!!\nAlle menneskelige spillere er døde, spillet er ferdig!',
		evo_score: 'Evolusjonspoeng',
		traits: [
			'Tilpasning til Rangoner',
			'Tilpasning til Blåblad',
			'Tilpasning til Hushrooms',
			'Tilpasning til Stinkballer',
			'Tilpasning til Snakerøtter',
			'Tilpasning til Ildgress',
			'Reproduksjonsrate',
			'Angrepsstyrke',
			'Forsvarsstyrke',
			'Kamuflasje',
			'Fart',
			'Oppfatning',
			'Intelligens',
		],
		transition_mutations: 'Monstre og mutanter',
		transition_survival: 'Spis eller bli spist',
		transition_world: 'Artenes krig',
		upload_description: 'Her kan du laste opp et originalt eller nedlastet lagret spill.',
		upload: 'Last opp qpp-fil',
		not_a_savegame: 'Filen er ikke et gyldig Q-Pop-lagret spill.',
		no_local_saves: 'Ingen lagrede spill funnet i nettleseren',
		really_restart: 'Vil du virkelig starte spillet på nytt?',
		sound_disabled: 'Lyden ble deaktivert. Det ser ut til at nettleseren din ikke kan spille av lyd.',
		information:
			'Dette spillet er en nyversjon av det originale Q-Pop-spillet, utgitt i Tyskland i 1995 av von Wendt Konzept GmbH. Denne nyversjonen skal være så nær originalspillet som mulig, med noen ekstra funksjoner. Den skal fungere på alle moderne nettlesere som har Javascript aktivert. Kildekoden er fritt tilgjengelig på Github.',
		credits_original: [
			['Utgiver og utvikler', ['von Wendt Konzept GmbH']],
			['Spilldesign', ['Karl-L. von Wendt']],
			['Programmering', ['Karl-L. von Wendt', 'Lars Hammer']],
			['Grafikk', ['Stefan Beyer']],
			['Musikk', ['Karl-L. von Wendt', 'Lars Hammer']],
		],
		credits_remake: [
			['Programmering', ['Mathias Bockwoldt']],
			['Reversering', ['Mathias Bockwoldt', 'Christian Klamt']],
			['Nye grafikk', ['Eike Strathmann']],
			['Norsk oversettelse', ['Mathias Bockwoldt (med ChatGPT)']],
		],
		options_music: 'Musikk',
		options_sound: 'Lyd',
		options_lang: 'Språk',
		options_this_lang: 'NO Norsk',
		options_auto_continue: 'Fortsett automatisk etter AI-plassering på verdenskartet',
		options_click_hold: 'Klikk og hold for å plassere eller fjerne enheter fra verdenskartet',
		options_plants: 'Vis fordeling av planter på mutasjonsskjermen',
		options_predators: 'Vis beseirede rovdyrsymboler i overlevelse',
		options_tutorial: 'Vis spillopplæring (skru av og på for å tilbakestille)',
		options_ai_speed: 'AI-hastighet på verdenskartet',
		options_ai_speeds: ['ekstremt sakte', 'veldig sakte', 'sakte', 'raskt', 'øyeblikkelig'],
		options_transition: 'Vis varighet av overganger',
		options_restart: 'Start spill på nytt',
		tutorial_title: 'Opplæring',
		tutorial_abort: 'Avbryt',
		tutorial: {
			welcome:
				'Velkommen til Q-Pop! Denne opplæringen hjelper deg å komme i gang. For mer detaljer, ta en titt på manualen som er lenket i beskrivelsen under spillet. Du kan avbryte opplæringen når som helst ved å klikke på avbryt.',
			change_language: 'Du kan endre språket og andre innstillinger med knappene her oppe.',
			player_select:
				'Velg arten du og datamaskinen skal spille. Klikk på hodet eller datamaskinene for å velge spillertype. Velg også en vanskelighetsgrad (IQ-nivå) for hver art.',
			next: 'Du kan alltid fortsette her eller ved å trykke på enter.',
			turns: 'Velg hvor lenge du vil spille. Til å begynne med kan fem runder være nok.',
			wm_units:
				'Plasser enhetene dine på verdenskartet. Etter den første enheten, kan du kun plassere enheter ved siden av andre. Du kan ikke plassere enheter på fjell eller vann. Så pass på at du ikke fanger deg selv nær kysten eller i fjellene. I begynnelsen er det lurt å plassere de fleste enhetene på samme type planter.',
			wm_shadows:
				'Du kan flytte så mange enheter som du har skygger. På denne måten kan du flytte enheter på verdenskartet. Du kan forbedre fartsattributtet ditt på mutasjonsskjermen for å få flere skygger. Fra denne turen kan du kjempe mot tilgrensende enheter av en annen art hvis du har enheter igjen.',
			wm_rightclick:
				'For å se hvilke planter enhetene dine er på, kan du høyreklikke på en enhet for å se planten under den. Alternativt kan du klikke på avataren under kalenderen for å gjøre alle enheter gjennomsiktige.',
			mutation_start:
				'Fordel evolusjonspoeng for å forbedre egenskapene til arten din. I begynnelsen har du 100 evolusjonspoeng, men senere i spillet avhenger antallet av suksessen din i spillet. Sirklene til høyre viser hvilke planter arten din okkuperer på verdenskartet. Du kan klikke på pluss eller minus for små justeringer eller direkte på linjen for større endringer.',
			mutation_plant:
				'I begynnelsen bør tilpasningen til planten du okkuperer mest ha minst 50%. Høyreklikk på hvilken som helst egenskap for å lære mer om den.',
			survival_start:
				'I denne delen av spillet spiller du som en enkeltindivid av arten din i et miljø som er avhengig av posisjonene du okkuperer på verdenskartet. Beveg deg ved å klikke på overlevelseskartet eller ved å bruke piltastene eller WASD. Du kan spise ved å klikke på individet eller trykke på mellomrom. Hvis du er i en håpløs situasjon, kan du høyreklikke på individet eller trykke escape for å drepe det og starte på en ny posisjon.',
			survival_goals:
				'Prøv å spise så mange planter som mulig. Planter som arten din er tilpasset vil gi mer næring. Du bør fylle minst én matbar. I tillegg bør du prøve å reprodusere ved å gå ved siden av en hunn. Til slutt, prøv å unngå rovdyr.',
			survival_time:
				'Du har et begrenset antall trinn og en begrenset tid for hvert trinn. Hvis du dør, vil du fortsette med et annet individ, men hver død påvirker fordelingen av arten din på verdenskartet.',
			survival_radar:
				'Bruk sansene til arten din for å se lovende matområder, paringspartnere, andre planteetere og rovdyr. Du kan øke rekkevidden til sansene gjennom mutasjoner.',
			catastrophe:
				'Katastrofer skjer hver runde. De kan endre ulike aspekter av verden. Du bør sjekke om enhetene dine fortsatt okkuperer de samme plantene som før.',
			catastrophe0:
				'Den planetariske aksen har skiftet, og flyttet kontinentet nærmere ekvator. Som følge av dette stiger gjennomsnittstemperaturen, havnivået synker og det blir mindre regn.', // Warming
			catastrophe1: 'Endringer i planetens rotasjon fører til et kaldere klima og mer regn.', // Cooling
			catastrophe2:
				'En stor meteoritt traff planeten. Nærområdet rundt nedslaget blir ødelagt. Millioner av tonn sand og støv blåses opp i stratosfæren og avkjøler klimaet. Polare iskapper binder mer vann, noe som fører til et fallende havnivå.', // Comet
			catastrophe3:
				'En ny, mystisk sykdom dukker opp i et spesifikt område på kontinentet og påvirker alle arter i det området. Hver individ i området hvor sykdommen oppstår har en viss sjanse til å overleve sykdommen.', // Plague
			catastrophe4: 'Store vulkanutbrudd ødelegger alt dyreliv i umiddelbare nærliggende områder.', // Volcano
			catastrophe5:
				'Det globale klimaet har blitt varmere. Som et resultat smelter polare iskapper, havnivået stiger kraftig og flommer oversvømmer lavtliggende kystregioner.', // Flood
			catastrophe6: 'Et kraftig jordskjelv endrer hele planetens overflate. Innsjøer kan bli til fjell og omvendt.', // Earthquake
			catastrophe7:
				'Mennesker har landet på planeten! I deres utrettelige forsøk på å hjelpe truet natur, bygger de en forskningsstasjon på planeten og jakter på forsøksdyr for å "redde dem fra utryddelse". Mennesker oppfører seg som kjøttetere, men er vanskeligere å bli kvitt enn de naturlige fiendene.', // Humans
			catastrophe8:
				'Økt forekomst av kosmisk stråling endrer alle arter gjennom mutasjoner. Som et resultat endres egenskapene til hver art dramatisk.', // Cosmic rays
			ranking:
				'Her kan du se rangeringen din i verden. Først er antallet individer på verdenskartet. For det andre er antallet evolusjonspoeng tilgjengelig denne runden. Dette avhenger av antallet individer. For det tredje er seierpoengene, som er alle brukte og tilgjengelige evolusjonspoeng lagt sammen.',
			ranking_save: 'Spillet lagres automatisk i nettleseren. Hvis du vil laste ned et lagret spill, kan du gjøre det her.',
			ranking_no_save: 'Hvis du vil laste ned et lagret spill, kan du gjøre det her. Spillet blir ikke lagret automatisk.',
			save: 'Det lagrede spillet du nettopp ble tilbudt kan lastes inn igjen i dette spillet. Men det er også kompatibelt med det originale spillet!',
		},
		trait_hints: [
			'Tilpasning til rangoner forbedrer matutnyttelsen fra planten. I tillegg er tilpasningen en fordel i kamper på verdenskartet på rangonefelt.', // Rangones
			'Tilpasning til blåblad forbedrer matutnyttelsen fra planten. I tillegg er tilpasningen en fordel i kamper på verdenskartet på blåbladfelt.', // Blueleaf
			'Tilpasning til hushrooms forbedrer matutnyttelsen fra planten. I tillegg er tilpasningen en fordel i kamper på verdenskartet på hushroomfelt.', // Hushrooms
			'Tilpasning til stinkballer forbedrer matutnyttelsen fra planten. I tillegg er tilpasningen en fordel i kamper på verdenskartet på stinkballfelt.', // Stinkballs
			'Tilpasning til snakerøtter forbedrer matutnyttelsen fra planten. I tillegg er tilpasningen en fordel i kamper på verdenskartet på snakerotfelt.', // Snakeroot
			'Tilpasning til ildgress forbedrer matutnyttelsen fra planten. I tillegg er tilpasningen en fordel i kamper på verdenskartet på ildgressfelt.', // Firegrass
			'Reproduksjonsrate øker effekten av paring og fôring, og gir flere enheter til verdenskartet.', // Reproduction
			'Angrepsstyrken øker sjansene for angriperen i en kamp på verdenskartet.', // Attack
			'Forsvarsstyrken øker sjansene for forsvareren i en kamp på verdenskartet. Videre øker det sannsynligheten for å vinne mot rovdyr.', // Defense
			'Kamuflasje øker sannsynligheten for at rovdyr mister sporet og ikke følger spilleren.', // Camouflage
			'Fart gir flere bevegelsespunkter på verdenskartet. I tillegg øker farten sannsynligheten for at rovdyr mister sporet en liten mengde.', // Speed
			'Oppfatning forbedrer rekkevidden til minikartet under overlevelse.', // Perception
			'Intelligens forbedrer de fleste andre egenskaper med en liten mengde.', // Intelligence
		],
	},
	PO: {
		title: 'Q-POP',
		subtitle: 'Ewolucja w kosmosie',
		next: 'Kontynuuj',
		yes: 'Tak',
		no: 'Nie',
		turn: 'Tura',
		close: 'Zamknij',
		load_game: 'Wczytaj grę',
		save_game: 'Zapisz grę',
		start_game: 'Rozpocznij grę',
		loading: 'Ładowanie',
		load: 'Wczytaj',
		player: 'Gracz {num}',
		species: ['Purplus', 'Kiwiopteryx', 'Pesciodyphus', 'Isnobug', 'Amorph', 'Chuckberry'],
		iq: 'IQ',
		iqs: ['Charles Darwin', 'Pomocnik Darwina', 'Ciotka Darwina', 'Pies Darwina'],
		popup_title: 'Służby Bezpieczeństwa Q-POP',
		catastrophe: 'Katastrofa',
		turns: ['Krótka (5 tur)', 'Średnia (10 tur)', 'Długa (20 tur)', 'Do końca'],
		turn_finished: 'Czy na pewno zakończyłeś swoją turę?',
		dead: 'Przykro mi, ale to już koniec!\nTwoja gatunek wyginął...',
		last_turn: 'Gong! Zaczyna się ostatnia tura!',
		who_plays: 'Kto ma grać?\nNie wybrałeś gracza!',
		continue_alone: 'Chcesz grać samodzielnie?',
		where_to_live: 'Gdzie chcesz żyć? Nie umieściłeś swojego gatunku na mapie!',
		suicide: 'Na pewno chcesz zabić tę jednostkę?',
		game_over: 'KONIEC GRY!!\nWszyscy gracze zginęli, gra się zakończyła!',
		evo_score: 'Wynik ewolucji',
		traits: ['Adaptacja do Rangones', 'Adaptacja do Blueleaf', 'Adaptacja do Hushrooms', 'Adaptacja do Stinkballs', 'Adaptacja do Snakeroots', 'Adaptacja do Firegrass', 'Szybkość reprodukcji', 'Siła ataku', 'Siła obrony', 'Kamuflaż', 'Szybkość', 'Percepcja', 'Inteligencja'],
		transition_mutations: 'Potwory i Mutanci',
		transition_survival: 'Zjedz albo bądź zjedzony',
		transition_world: 'Wojna gatunków',
		upload_description: 'Tutaj możesz przesłać oryginalny lub pobrany zapis gry.',
		upload: 'Prześlij plik qpp',
		not_a_savegame: 'Plik nie jest poprawnym zapisem gry Q-Pop.',
		no_local_saves: 'Nie znaleziono zapisanych gier w przeglądarce',
		really_restart: 'Czy na pewno chcesz uruchomić grę ponownie?',
		sound_disabled: 'Dźwięk został wyłączony. Wygląda na to, że przeglądarka nie może odtworzyć dźwięku.',
		information: 'Ta gra jest remakiem oryginalnej gry Q-Pop, wydanej w Niemczech w 1995 roku przez von Wendt Konzept GmbH. Remake ma jak najwierniej odwzorować oryginał, z kilkoma dodatkowymi funkcjami wygody. Gra działa w nowoczesnych przeglądarkach z włączonym Javascript. Kod źródłowy jest dostępny na Githubie.',
		credits_original: [
			['Wydawca i deweloper', ['von Wendt Konzept GmbH']],
			['Projekt gry', ['Karl-L. von Wendt']],
			['Programowanie', ['Karl-L. von Wendt', 'Lars Hammer']],
			['Grafika', ['Stefan Beyer']],
			['Muzyka', ['Karl-L. von Wendt', 'Lars Hammer']],
		],
		credits_remake: [
			['Programowanie', ['Mathias Bockwoldt']],
			['Reverse engineering', ['Mathias Bockwoldt', 'Christian Klamt']],
			['Nowa grafika', ['Eike Strathmann']],
			['Polskie tłumaczenie', ['Mathias Bockwoldt (z ChatGPT)']],
		],
		options_music: 'Muzyka',
		options_sound: 'Dźwięk',
		options_lang: 'Język',
		options_this_lang: 'PO Polski',
		options_auto_continue: 'Auto kontynuacja po rozmieszczeniu AI na mapie',
		options_click_hold: 'Kliknij i przytrzymaj, aby umieścić lub usunąć jednostki z mapy',
		options_plants: 'Pokaż rozmieszczenie roślin na ekranie mutacji',
		options_predators: 'Pokaż symbole pokonanych drapieżników w przetrwaniu',
		options_tutorial: 'Pokaż samouczek gry (wyłącz i włącz, aby zresetować)',
		options_ai_speed: 'Prędkość AI na mapie świata',
		options_ai_speeds: ['bardzo wolna', 'wolna', 'średnia', 'szybka', 'natychmiastowa'],
		options_transition: 'Czas trwania ekranu przejścia',
		options_restart: 'Restart gry',
		tutorial_title: 'Samouczek',
		tutorial_abort: 'Przerwij',
		tutorial: {
			welcome: 'Witamy w Q-Pop! Ten samouczek pomoże ci zacząć. Więcej szczegółów znajdziesz w instrukcji poniżej gry. Możesz przerwać samouczek w dowolnym momencie, klikając przerwij.',
			change_language: 'Możesz zmienić język i inne opcje za pomocą przycisków u góry.',
			player_select: 'Wybierz gatunki, którymi ty i komputer będziecie grać. Kliknij na głowę lub komputer, aby wybrać rodzaj gracza. Dodatkowo wybierz poziom trudności (poziom IQ) dla każdego gatunku.',
			next: 'Zawsze możesz kontynuować tutaj lub naciskając enter.',
			turns: 'Wybierz, jak długą grę chcesz rozegrać. Na początek może wystarczyć pięć rund.',
			wm_units: 'Umieść swoje jednostki na mapie świata. Po pierwszej jednostce możesz umieszczać kolejne tylko w pobliżu innych. Nie możesz umieszczać jednostek na górach ani w wodzie, więc uważaj, aby nie zablokować się blisko wybrzeża lub gór.',
			wm_shadows: 'Możesz podnieść tyle jednostek, ile masz cieni. Dzięki temu możesz przesuwać jednostki po mapie świata. Możesz poprawić swoją cechę szybkości na ekranie mutacji, aby uzyskać więcej cieni. Od tej tury możesz walczyć z jednostkami innych gatunków, jeśli masz wolne jednostki.',
			wm_rightclick: 'Aby zobaczyć, na jakich roślinach są twoje jednostki, możesz kliknąć prawym przyciskiem myszy na jednostkę, aby zobaczyć roślinę pod nią. Alternatywnie możesz kliknąć awatar poniżej kalendarza, aby wszystkie jednostki stały się półprzezroczyste.',
			mutation_start: 'Rozdziel punkty ewolucji, aby poprawić cechy swojego gatunku. Na początku masz 100 punktów ewolucji, ale później w grze liczba ta zależy od twojego sukcesu. Kółka po prawej pokazują, które rośliny twoje gatunki zajmują na mapie świata. Możesz kliknąć plus lub minus, aby wykonać małe kroki lub bezpośrednio kliknąć pasek, aby wykonać duże kroki.',
			mutation_plant: 'Na początku adaptacja do rośliny, którą zajmujesz najwięcej, powinna wynosić co najmniej 50%. Kliknij prawym przyciskiem myszy na dowolną cechę, aby dowiedzieć się więcej.',
			survival_start: 'W tej części gry grasz jednym osobnikiem swojego gatunku w środowisku, które jest tworzone w zależności od pozycji, które zajmujesz na mapie świata. Poruszaj się, klikając na mapę przetrwania lub używając klawiszy strzałek lub WASD. Możesz jeść, klikając na osobnika lub naciskając spację. Jeśli znajdziesz się w beznadziejnej sytuacji, możesz kliknąć prawym przyciskiem myszy na osobnika lub nacisnąć escape, aby go zabić i rozpocząć od nowej pozycji.',
			survival_goals: 'Staraj się zjeść jak najwięcej roślin. Rośliny, do których twój gatunek jest przystosowany, dają więcej pożywienia. Powinieneś zapełnić co najmniej jeden pasek żywności. Dodatkowo spróbuj się rozmnażać, chodząc obok samicy. Wreszcie, unikaj drapieżników.',
			survival_time: 'Masz ograniczoną liczbę kroków i ograniczony czas na każdy krok. Jeśli zginiesz, będziesz kontynuować z innym osobnikiem, ale każda śmierć wpływa na rozmieszczenie twojego gatunku na mapie świata.',
			survival_radar: 'Używaj zmysłów swojego gatunku, aby zobaczyć obiecujące pola z jedzeniem, partnerów do rozmnażania, inne roślinożercy i drapieżniki. Możesz zwiększyć zasięg zmysłów przez mutacje.',
			catastrophe: 'Katastrofy zdarzają się co turę. Mogą zmienić różne aspekty świata. Powinieneś sprawdzić, czy twoje jednostki nadal zajmują te same rośliny, co wcześniej.',
			catastrophe0: 'Oś planety przesunęła się, przesuwając kontynent bliżej równika. W konsekwencji średnia temperatura wzrasta, poziom morza spada, a opady są rzadsze.', // Warming
			catastrophe1: 'Zmiany w obrocie planety powodują zimniejszy klimat i więcej opadów.', // Cooling
			catastrophe2: 'Duży meteoryt uderzył w planetę. W pobliżu miejsca uderzenia następuje dewastacja. Miliony ton piasku i pyłu wzbija się do stratosfery, chłodząc klimat. Lodowe czapy polarne wiążą więcej wody, prowadząc do obniżenia poziomu morza.', // Comet
			catastrophe3: 'Nowa, tajemnicza choroba pojawia się na określonym obszarze kontynentu, wpływając na wszystkie gatunki w tej strefie. Każdy osobnik w obszarze choroby ma pewną szansę na przetrwanie choroby.', // Plague
			catastrophe4: 'Ogromne erupcje wulkaniczne niszczą całe życie zwierzęce na bezpośrednio sąsiadujących polach.', // Volcano
			catastrophe5: 'Globalne ocieplenie doprowadziło do stopienia się lodowych czap polarnych, podnosząc poziom morza i zalewając nisko położone wybrzeża.', // Flood
			catastrophe6: 'Silne trzęsienie ziemi zmienia całą powierzchnię planety. Jeziora mogą stać się górami i odwrotnie.', // Earthquake
			catastrophe7: 'Ludzie wylądowali na planecie! W ich nieustannych wysiłkach, aby chronić zagrożoną przyrodę, budują stację badawczą na planecie i polują na zwierzęta do eksperymentów, „ratując je przed wyginięciem”. Ludzie zachowują się jak mięsożercy, ale trudniej ich spławić niż naturalnych wrogów.', // Humans
			catastrophe8: 'Wzrost występowania promieniowania kosmicznego zmienia wszystkie gatunki przez mutacje. W rezultacie cechy każdego gatunku ulegają dramatycznym zmianom.', // Cosmic rays
			ranking: 'Tutaj możesz zobaczyć swoją pozycję na świecie. Pierwsza to liczba osobników na mapie świata. Druga to ilość dostępnych punktów ewolucji w tej rundzie. To zależy od liczby osobników. Trzecia to punkty zwycięstwa, czyli wszystkie użyte i dostępne punkty ewolucji zsumowane.',
			ranking_save: 'Gra jest automatycznie zapisywana w przeglądarce. Jeśli chcesz pobrać zapis gry, możesz to zrobić tutaj.',
			ranking_no_save: 'Jeśli chcesz pobrać zapis gry, możesz to zrobić tutaj. Gra nie będzie zapisywana automatycznie.',
			save: 'Zapis gry, który ci właśnie zaoferowano, można ponownie wczytać w tej grze. Jest on również kompatybilny z oryginalną grą!',
		},
		trait_hints: [
			'Adaptacja do rangones poprawia wykorzystanie pożywienia z tej rośliny. Dodatkowo adaptacja jest przewagą w walce na polach rangones na mapie świata.', // Rangones
			'Adaptacja do blueleaf poprawia wykorzystanie pożywienia z tej rośliny. Dodatkowo adaptacja jest przewagą w walce na polach blueleaf na mapie świata.', // Blueleaf
			'Adaptacja do hushrooms poprawia wykorzystanie pożywienia z tej rośliny. Dodatkowo adaptacja jest przewagą w walce na polach hushrooms na mapie świata.', // Hushrooms
			'Adaptacja do stinkballs poprawia wykorzystanie pożywienia z tej rośliny. Dodatkowo adaptacja jest przewagą w walce na polach stinkballs na mapie świata.', // Stinkballs
			'Adaptacja do snakeroots poprawia wykorzystanie pożywienia z tej rośliny. Dodatkowo adaptacja jest przewagą w walce na polach snakeroots na mapie świata.', // Snakeroot
			'Adaptacja do firegrass poprawia wykorzystanie pożywienia z tej rośliny. Dodatkowo adaptacja jest przewagą w walce na polach firegrass na mapie świata.', // Firegrass
			'Wskaźnik reprodukcji zwiększa efekt rozmnażania i karmienia, dając więcej jednostek na mapę świata.', // Reproduction
			'Siła ataku zwiększa szanse agresora w walce na mapie świata.', // Attack
			'Siła obrony zwiększa szanse obrońcy w walce na mapie świata. Dodatkowo zwiększa prawdopodobieństwo wygranej z drapieżnikami.', // Defense
			'Kamuflaż zwiększa prawdopodobieństwo, że drapieżniki zgubią trop i nie będą ścigać gracza.', // Camouflage
			'Szybkość daje więcej punktów ruchu na mapie świata. Dodatkowo szybkość zwiększa prawdopodobieństwo, że drapieżniki zgubią trop.', // Speed
			'Percepcja poprawia zasięg mini mapy podczas przetrwania.', // Perception
			'Inteligencja poprawia większość innych cech o niewielką ilość.', // Intelligence
		],
	},	
	RU: {
		title: 'Q-POP',
		subtitle: 'Evolution in space',
		next: 'Продолжить',
		yes: 'Да',
		no: 'Нет',
		turn: 'Раунд',
		close: 'Закрыть',
		load_game: 'Загрузить сохранение',
		save_game: 'Сохранить игру',
		start_game: 'Начать игру',
		loading: 'загрузка',
		load: 'загрузить',
		player: 'Игрок {num}',
		species: ['Purplus', 'Kiwiopteryx', 'Pesciodyphus', 'Isnobug', 'Amorph', 'Chuckberry'],
		iq: 'IQ',
		iqs: ['Чарльз Дарвин', 'Помощник Дарвина', 'Тетушка Дарвина', 'Собака Дарвина'],
		popup_title: 'Служба безопасности Q-POP',
		catastrophe: 'Катастрофа',
		turns: ['Короткий (5 раундов)', 'Средний (10 раундов)', 'Длинный (20 раундов)', 'До победного конца'],
		turn_finished: 'Ваша очередь действительно закончилась?',
		dead: 'Простите, но вы ушли в историю!\nВаш вид исчез...',
		last_turn: 'Гонг! Начинается последний раунд!',
		who_plays: 'Кто будет играть?\nВы не выбрали игрока!',
		continue_alone: 'ТЫ хочешь продолжить в одиночестве?',
		where_to_live: 'Где бы вы хотели жить? Вы не указали свой биологический вид на карте!',
		suicide: 'Вы действительно хотите убить это существо?',
		game_over: 'ВСЕ КОНЧЕНО!!\nВсе игроки мертвы, игра окончена.!',
		evo_score: 'Очки Эволюции',
		traits: [
			'Адаптация к Rangones',
			'Адаптация к Blueleaf',
			'Адаптация к Hushrooms',
			'Адаптация к Stinkballs',
			'Адаптация к Snakeroots',
			'Адаптация к Firegrass',
			'Скорость размножения',
			'Сила атаки',
			'Сила защиты',
			'Маскировка',
			'Скорость',
			'Чувствительность',
			' Интеллект',
		],
		transition_mutations: 'Монстры и мутанты',
		transition_survival: 'Ешь или будь съеден',
		transition_world: 'Война Видов',
		upload_description: 'Здесь вы можете загрузить оригинальное или скачанное сохранение.',
		upload: 'Загрузить qpp-файл',
		not_a_savegame: 'Файл не является сохранением для Q-Pop.',
		no_local_saves: 'В браузере не найдены сохранения',
		really_restart: 'Вы действительно хотите перезапустить игру?',
		sound_disabled: 'Звук отключен. Похоже, ваш браузер не может воспроизводить звуки.',
		information:
			'Эта игра является ремейком оригинальной игры Q-Pop, выпущенной в Германии в 1995 году компанией von Wendt Konzept GmbH. Этот ремейк должен быть максимально приближен к оригинальной игре с некоторыми дополнительными функциями. Он должен работать во всех современных браузерах, в которых включен Javascript. Исходный код находится в свободном доступе на Github.',
		credits_original: [
			['Издатель и разработчик', ['von Wendt Konzept GmbH']],
			['Игровой дизайн', ['Karl-L. von Wendt']],
			['Код', ['Karl-L. von Wendt', 'Lars Hammer']],
			['Графика', ['Stefan Beyer']],
			['Музыка', ['Karl-L. von Wendt', 'Lars Hammer']],
		],
		credits_remake: [
			['Код', ['Mathias Bockwoldt']],
			['Обратная Инженерия', ['Mathias Bockwoldt', 'Christian Klamt']],
			['Новая графика', ['Eike Strathmann']],
			['Русский перевод', ['Egor Priezzhikh']],
		],
		options_music: 'Музыка',
		options_sound: 'Звук',
		options_lang: 'Язык',
		options_this_lang: 'RU Russian',
		options_auto_continue: 'Авто-продожение после хода ИИ',
		options_click_hold: 'Нажмите и удерживайте, чтобы разместить или удалить объекты с карты мира',
		options_plants: 'Показать распределение занятых растений на экране мутаций',
		options_predators: 'Показать символ побежденного хищника в выживании',
		options_tutorial: 'Включить обучение (выключите и включите для сброса)',
		options_ai_speed: 'Скорость ИИ на карте мира',
		options_ai_speeds: ['Экстремально медленный', 'Очень медленный', 'Медленный', 'Быстрый', 'Мгновенный'],
		options_transition: 'Просмотр продолжительности переключения экрана',
		options_restart: 'Перезапустить игру',
		tutorial_title: 'Обучение',
		tutorial_abort: 'Прекратить',
		tutorial: {
			welcome:
				'Добро пожаловать в Q-Pop! Это обучение поможет тебе начать играть. Для более подробной информации, загляните в описание игры и найдите ссылку на мануал. Вы можете закончить обучение в любое время, нажав Прекратить.',
			change_language: 'Вы можете изменить язык и другие параметры с помощью кнопок, расположенных здесь.',
			player_select:
				'Выберете виды для игроков и компьютеров, за которые они будут играть. Нажмите на картинку лица/компьютера для смены типа игрока. Так же выберете уровень сложности(IQ level) для каждого вида.',
			next: 'Вы всегда можете продолжить здесь или нажав Enter.',
			turns: 'Выберете длительность игры. Для начала, 5 раундов может быть достаточно.',
			wm_units:
				'Размести существ на мировой карте. После первого существа, вы можете поставить только около других существ своего вида. Вы не можете расположить существ на озерах и горах. Поэтому будьте осторожны и не попадитесь в ловушку около побережий и гор . Для начала, лучше всего будет расположить всех существ на растениях одного типа.',
			wm_shadows:
				'Вы можете собрать столько существ с карты, сколько у вас теней. Таким образом, вы можете перемещать существ по карте. Вы можете увеличить свою скорость для получения большего количества теней. С этого момента вы можете сражаться с существами другого вида, если у вас остались существа.',
			wm_rightclick:
				'Чтобы узнать, на каком растении находится существо, нажмите на существо Правой Кнопкой Мыши. Так же вы можете нажать на вашу аватарку под календарем, чтобы сделать всех существ прозрачными.',
			mutation_start:
				'Распредели очки эволюции для улучшения характеристик вашего вида. В начале вам дается 100 очков, но позже их количество будет зависеть от ваших успехов в игре. Кружки справа показывают, насколько сейчас зависит адаптация к растениям у существ, которые расположены на них. Вы можете нажимать + и - для маленьких шагов и на саму шкалу для больших.',
			mutation_plant:
				'В начале, адаптация к растении, от которой вы больше всего зависите, не должна быть меньше 50%. Нажмите Правую Кнопку Мыши на любом признаке, чтобы узнать о нем больше.',
			survival_start:
				'В этой части игры вы играете за представителя своего вида в среде, которая зависит от положения, которое вы заняли на карте мира. Для перемещения кликайте по карте или нажимайте на клавиши WASD или стрелки. Чтобы есть растения, на которых стоит существо - нажмите на своего существа или нажмите Пробел. Если вы окажетесь в безвыходной ситуации - вы можете убить свое существо и начать с новой позиции, для этого нажмите на него Правой Кнопкой Мыши или на Escape.',
			survival_goals:
				'Старайтесь есть как можно больше растений. Растения будут давать тем больше питательных веществ, чем больше адаптация существа к ним. Вы должны заполнить хотя бы одну шкалу еды. Кроме того, вам стоит размножиться с самкой, проходя рядом с ней. Наконец, старайтесь избегать хищников.',
			survival_time:
				'У вас есть ограниченное количество шагов и ограниченное количество времени на каждый шаг. Если вы умрете - вы начнете с другого существа вашего вида, но от этого зависит распределение существ на карте мира.',
			survival_radar:
				'Используй чувства вашего существа для определения местоположения питания, самки, других травоядных и хищников. Вы можете увеличить свою чувствительно в окне мутаций.',
			catastrophe:
				'Катастрофы случаются каждый раунд. Они могут изменить различные аспекты мира. После них вам следует проверить положение ваших существ, которое могло измениться.',
			catastrophe0:
				'Ось планеты сместилась, континент переместился ближе к экватору. В результате - повышается средняя температура, понижается урвоень моря и выпадает меньше осадков.', // Warming
			catastrophe1: 'Изменения во вращении планеты. В итоге - похоладание климата и большее количество дождей.', // Cooling
			catastrophe2:
				'На планету упал крупный метеорит. Окрестность места падения пустеют. Милионны тонн песка и пыли выбрасываются в стратосферу, из-за чего холодеет климат. На полярных ледянных шапках замерзает больше воды, в итоге уровень моря падает.', // Comet
			catastrophe3:
				'В определенном районе континента появляется новая загадочная болезнь, поражающая все виды животных в этом районе. Каждое существо в районе заражения имеет определенный шанс пережить его.', // Plague
			catastrophe4: 'Мощные извержения вулканов уничтожают всю животную жизнь на прилегающих полях.', // Volcano
			catastrophe5:
				'Потепление глобального климата. В результате, полярные ледянные шапки тают, уровень моря резко растет и затопляются низменные прибрежные районы.', // Flood
			catastrophe6: 'Сильное землетрясение изменило поверхность планеты. Некоторые озера превращаются в горы, а горы в озера.', // Earthquake
			catastrophe7:
				'Люди высадились на планету! В попытке спасти природу, которая находится под угрозой исчезновения, они строят исследовательские станции и охотятся на подопытных животных, якобы спасая их от вымирания. Люди ведут себя как хищники, но от них тяжелее избавиться.', // Humans
			catastrophe8:
				'Повышенное воздействие космической радиации изменяет все виды путем мутации. В результате, характеристики каждого вида резко меняеются.', // Cosmic rays
			ranking:
				'Здесь вы можете ознакомиться со своим рейтингом. Первое - количество существ на карте. Второе - количество очков эволюции, доступных в этом раунде. Они зависят от количества существ. Третье - очки победы, это сумма использованных и доступных очков эволюции.',
			ranking_save: 'Игра автоматически сохраняется в браузере. Если вы хотите загрузить сохранение, то можете сделать это здесь.',
			ranking_no_save: 'Если вы хотите загрузить сохранение, то можешь сделать это сделать. Игра не будет автоматически сохранена.',
			save: 'Сохранение которое вы получили, можно будет загрузить снова в эту игру. Но она так же совместима с оригинальной игрой!',
		},
		trait_hints: [
			'Адаптация к rangones позволяет лучше усваивать ее питательные вещества. Кроме того, адаптация к ним является преимуществом в боях на полях с rangones.', // Rangones
			'Адаптация к blueleaf позволяет лучше усваивать ее питательные вещества. Кроме того, адаптация к ним является преимуществом в боях на полях с blueleaf.', // Blueleaf
			'Адаптация к hushrooms позволяет лучше усваивать ее питательные вещества. Кроме того, адаптация к ним является преимуществом в боях на полях с hushrooms.', // Hushrooms
			'Адаптация к stinkballs позволяет лучше усваивать ее питательные вещества. Кроме того, адаптация к ним является преимуществом в боях на полях с stinkballs.', // Stinkballs
			'Адаптация к snakeroot позволяет лучше усваивать ее питательные вещества. Кроме того, адаптация к ним является преимуществом в боях на полях с snakeroot.', // Snakeroot
			'Адаптация к firegrass позволяет лучше усваивать ее питательные вещества. Кроме того, адаптация к ним является преимуществом в боях на полях с firegrass.', // Firegrass
			'Скорость размножения увеличивает эффекты от спаривания и кормления, увеличивая количество существ на карте.', // Reproduction
			'Сила атаки увеличивает шансы агрессора на победу в бою на карте мира.', // Attack
			'Сила защиты увеличивает шансы защитника выжить в бою на карте мира. Кроме того, это увеличивает вероятность победы над хищниками.', // Defense
			'Маскировка увеличивает шанс того, что хищник потеряет след и перестанет следовать за вами.', // Camouflage
			'Скорость дает больше очков перемещения на карте мира. Кроме того, скорость немного увеличивает вероятность того, что хищники потеряют след.', // Speed
			'Чувствительность увеличивает дальность действия мини-карты в режиме выживания.', // Perception
			'Интелект незначительно улучшает большинство других качеств.', // Intelligence
		],
	},
	UA: {
		title: 'Q-POP',
		subtitle: 'Еволюція в космосі',
		next: 'Продовжити',
		yes: 'Так',
		no: 'Ні',
		turn: 'Хід',
		close: 'Закрити',
		load_game: 'Завантажити збереження',
		save_game: 'Зберегти гру',
		start_game: 'почати гру',
		loading: 'завантаження',
		load: 'завантажити',
		player: 'Гравець {num}',
		species: ['Пурплус', 'Ківіоптерикс', 'Песціодиф', 'Існобаг', 'Аморф', 'Чакберрі'],
		iq: 'IQ',
		iqs: ['Чарльз Дарвін', 'Помічник Дарвіна', 'Тітка Дарвіна', 'Собака Дарвіна'],
		popup_title: 'Q-POP Служба Безпеки',
		catastrophe: 'Катастрофа',
		turns: ['Короткий (5 ходів)', 'Середній (10 ходів)', 'Довгий (20 ходів)', 'До гіркого кінця'],
		turn_finished: 'Ви дійсно завершили хід?',
		dead: 'На жаль, ви вже в історії!\nВид зник...',
		last_turn: 'Гонг! Починається останній хід!',
		who_plays: 'Хто грає?\nВи не обрали гравця!',
		continue_alone: 'Хочете продовжити самостійно?',
		where_to_live: 'Де ви хочете жити? Ви не розмістили свій вид на карті!',
		suicide: 'Ви дійсно хочете вбити цього індивіда?',
		game_over: 'ВСЕ ЗАКІНЧЕНО!!\nВсі людські гравці мертві, гра завершена!',
		evo_score: 'Еволюційний Рахунок',
		traits: [
			'Адаптація до Рангонів',
			'Адаптація до Синьолисту',
			'Адаптація до Хашрумів',
			'Адаптація до Сморжів',
			'Адаптація до Змієкоренів',
			'Адаптація до Вогнетраву',
			'Швидкість розмноження',
			'Сила атаки',
			'Сила захисту',
			'Камуфляж',
			'Швидкість',
			'Сприйняття',
			'Інтелект',
		],
		transition_mutations: 'Монстри і Мутанти',
		transition_survival: "Їсти чи Бути з'їденим",
		transition_world: 'Війна Видів',
		upload_description: 'Тут ви можете завантажити оригінальне або завантажене збереження.',
		upload: 'Завантажити qpp файл',
		not_a_savegame: 'Файл не є дійсним збереженням Q-Pop.',
		no_local_saves: 'Збереження не знайдено в браузері',
		really_restart: 'Ви дійсно хочете перезапустити гру?',
		sound_disabled: 'Звук вимкнено. Схоже, ваш браузер не може відтворювати звук.',
		information:
			'Ця гра є римейком оригінальної гри Q-Pop, випущеної в Німеччині в 1995 році компанією von Wendt Konzept GmbH. Цей римейк максимально близький до оригінальної гри з деякими додатковими зручностями. Гра має працювати у всіх сучасних браузерах з увімкненим Javascript. Початковий код доступний на Github.',
		credits_original: [
			['Видавець та розробник', ['von Wendt Konzept GmbH']],
			['Дизайн гри', ['Карл-Л. фон Венді']],
			['Програмування', ['Карл-Л. фон Венді', 'Ларс Гаммер']],
			['Графіка', ['Стефан Бейєр']],
			['Музика', ['Карл-Л. фон Венді', 'Ларс Гаммер']],
		],
		credits_remake: [
			['Програмування', ['Матіас Боквольдт']],
			['Реверс інжиніринг', ['Матіас Боквольдт', 'Крістіан Кламт']],
			['Нова графіка', ['Айке Штратманн']],
			['Український переклад', ['Матіас Боквольдт (разом з ChatGPT)']],
		],
		options_music: 'Музика',
		options_sound: 'Звук',
		options_lang: 'Мова',
		options_this_lang: 'UA Українська',
		options_auto_continue: 'Автоматичне продовження після розміщення AI на карті світу',
		options_click_hold: 'Натисніть і утримуйте, щоб розмістити або видалити одиниці з карти світу',
		options_plants: 'Показати розподіл рослин на екрані мутацій',
		options_predators: 'Показати символи переможених хижаків у режимі виживання',
		options_tutorial: 'Показати навчальний посібник (вимкнути та ввімкнути для скидання)',
		options_ai_speed: 'Швидкість AI на карті світу',
		options_ai_speeds: ['дуже повільно', 'дуже повільно', 'повільно', 'швидко', 'миттєво'],
		options_transition: 'Тривалість перегляду перехідного екрану',
		options_restart: 'Перезапустити гру',
		tutorial_title: 'Навчання',
		tutorial_abort: 'Відміна',
		tutorial: {
			welcome:
				'Ласкаво просимо до Q-Pop! Це навчання допоможе вам почати. Для детальнішої інформації зверніться до посібника, посилання на який знаходиться в описі під грою. Ви можете перервати навчання будь-якої миті, натиснувши відміна.',
			change_language: 'Ви можете змінити мову та інші параметри за допомогою кнопок тут.',
			player_select:
				"Оберіть види, за які будете грати ви та комп'ютер. Натисніть на голову або комп'ютери, щоб вибрати тип гравця. Також оберіть рівень складності (IQ) для кожного виду.",
			next: 'Ви завжди можете продовжити тут або натиснувши enter.',
			turns: 'Виберіть, як довго ви хочете грати. Для початку п’яти раундів буде достатньо.',
			wm_units:
				'Розмістіть свої одиниці на карті світу. Після першої одиниці ви можете розміщувати одиниці лише поруч з іншими. Ви не можете розміщувати одиниці на горах або воді. Будьте обережні, щоб не опинитися в пастці біля узбережжя або в горах. На початку доцільно розміщувати більшість одиниць на одному типі рослин.',
			wm_shadows:
				'Ви можете брати стільки одиниць, скільки у вас є тіней. Таким чином ви можете переміщати одиниці на карті світу. Ви можете покращити свій атрибут швидкості на екрані мутацій, щоб отримати більше тіней. З цього ходу ви можете боротися з сусідніми одиницями іншого виду, якщо у вас залишилися одиниці.',
			wm_rightclick:
				'Щоб побачити, на яких рослинах знаходяться ваші одиниці, ви можете клацнути правою кнопкою миші на одиниці, щоб побачити рослину під нею. Або натисніть на аватар під календарем, щоб зробити всі одиниці напівпрозорими.',
			mutation_start:
				'Розподіліть еволюційні бали для покращення характеристик свого виду. На початку у вас є 100 еволюційних балів, але пізніше кількість залежатиме від вашого успіху в грі. Кола праворуч показують, які рослини займає ваш вид на карті світу. Ви можете натиснути на плюс або мінус для малих кроків або безпосередньо натиснути на смужку для великих кроків.',
			mutation_plant:
				'На початку адаптація до рослини, яку ви займаєте найбільше, має становити щонайменше 50%. Клацніть правою кнопкою миші на будь-який атрибут, щоб дізнатися більше про нього.',
			survival_start:
				'У цій частині гри ви граєте одним індивідом свого виду в середовищі, створеному залежно від позицій, які ви займаєте на карті світу. Рухайтеся, натискаючи на карту виживання або за допомогою стрілок або WASD. Ви можете їсти, натиснувши на індивіда або натиснувши пробіл. Якщо ви опинилися у безвихідній ситуації, ви можете натиснути правою кнопкою миші на індивіда або натиснути escape, щоб убити його і почати з нового місця.',
			survival_goals:
				"Намагайтеся з'їсти якомога більше рослин. Рослини, до яких адаптований ваш вид, принесуть більше поживних речовин. Ви повинні заповнити хоча б один харчовий бар. Крім того, спробуйте розмножуватися, підійшовши до самки. І, нарешті, уникайте хижаків.",
			survival_time:
				'У вас обмежена кількість кроків і обмежений час на кожен крок. Якщо ви помрете, ви продовжите з іншим індивідом, але кожна смерть впливає на розподіл вашого виду на карті світу.',
			survival_radar:
				'Використовуйте почуття свого виду, щоб побачити перспективні харчові ділянки, партнерів для спарювання, інших травоїдних і хижаків. Ви можете збільшити діапазон почуттів завдяки мутаціям.',
			catastrophe:
				'Катастрофи трапляються щоходу. Вони можуть змінювати різні аспекти світу. Вам слід перевірити, чи ваші одиниці займають ті ж рослини, що й раніше.',
			catastrophe0:
				'Планетарна вісь змістилася, перемістивши континент ближче до екватора. Як наслідок, середня температура підвищується, рівень моря падає і дощів стає менше.', // Потепління
			catastrophe1: 'Зміни в обертанні планети спричиняють холодніший клімат і більше дощів.', // Похолодання
			catastrophe2:
				'На планету впав великий метеорит. Околиці удару спустошені. Мільйони тонн піску та пилу піднімаються в стратосферу, охолоджуючи клімат. Полярні льодовики утримують більше води, що призводить до зниження рівня моря.', // Комета
			catastrophe3:
				"На континенті з'явилася нова, загадкова хвороба, що вражає всі види в цій області. Кожен індивід у зоні, де виникла хвороба, має певний шанс вижити.", // Чума
			catastrophe4: 'Величезні вулканічні виверження знищують усе тваринне життя на прилеглих полях.', // Вулкан
			catastrophe5:
				'Глобальний клімат потеплішав. Як наслідок, полярні льодовики тануть, рівень моря різко піднімається і затоплює низинні прибережні райони.', // Повінь
			catastrophe6: 'Сильний землетрус змінює всю поверхню планети. Озера можуть перетворюватися на гори і навпаки.', // Землетрус
			catastrophe7:
				'На планету висадилися люди! У своїх невтомних зусиллях допомогти зникаючій природі вони будують дослідницьку станцію на планеті та полюють на експериментальних тварин, щоб «врятувати їх від вимирання». Люди поводяться як хижаки, але їх важче позбутися, ніж природних ворогів.', // Люди
			catastrophe8:
				'Підвищена частота космічного випромінювання змінює всі види через мутацію. Як результат, атрибути кожного виду змінюються кардинально.', // Космічні промені
			ranking:
				'Тут ви можете побачити своє місце в світі. Перший – це кількість індивідів на карті світу. Другий – це кількість еволюційних балів, доступних цього раунду. Це залежить від кількості індивідів. Третій – це очки перемоги, які складаються з усіх використаних і доступних еволюційних балів.',
			ranking_save: 'Гра автоматично зберігається в браузері. Якщо ви хочете завантажити збереження, ви можете зробити це тут.',
			ranking_no_save: 'Якщо ви хочете завантажити збереження, ви можете зробити це тут. Гра не зберігатиметься автоматично.',
			save: 'Збереження, яке вам щойно запропонували, можна завантажити ще раз у цій грі. Але воно також сумісне з оригінальною грою!',
		},
		trait_hints: [
			'Адаптація до ранґонів покращує засвоєння їжі з цієї рослини. Крім того, адаптація є перевагою в боях на полях ранґонів.', // Ранґони
			'Адаптація до синьолисту покращує засвоєння їжі з цієї рослини. Крім того, адаптація є перевагою в боях на полях синьолисту.', // Синьолист
			'Адаптація до хашрумів покращує засвоєння їжі з цієї рослини. Крім того, адаптація є перевагою в боях на полях хашрумів.', // Хашруми
			'Адаптація до сморжів покращує засвоєння їжі з цієї рослини. Крім того, адаптація є перевагою в боях на полях сморжів.', // Сморжі
			'Адаптація до змієкоренів покращує засвоєння їжі з цієї рослини. Крім того, адаптація є перевагою в боях на полях змієкоренів.', // Змієкорені
			'Адаптація до вогнетраву покращує засвоєння їжі з цієї рослини. Крім того, адаптація є перевагою в боях на полях вогнетраву.', // Вогнетрав
			'Швидкість розмноження підвищує ефект спарювання та годування, забезпечуючи більше одиниць для карти світу.', // Розмноження
			'Сила атаки підвищує шанси агресора на перемогу в бою на карті світу.', // Атака
			'Сила захисту підвищує шанси захисника в бою на карті світу. Крім того, підвищує ймовірність перемоги над хижаками.', // Захист
			'Камуфляж підвищує ймовірність того, що хижаки втратять слід і не будуть переслідувати гравця.', // Камуфляж
			'Швидкість надає більше очок переміщення на карті світу. Крім того, швидкість трохи підвищує ймовірність того, що хижаки втратять слід.', // Швидкість
			'Сприйняття покращує діапазон міні-карти під час виживання.', // Сприйняття
			'Інтелект незначно покращує більшість інших характеристик.', // Інтелект
		],
	},
	JA: {
		title: 'Q-POP',
		subtitle: '宇宙で進化！',
		next: '次へ',
		yes: 'はい',
		no: 'いいえ',
		turn: 'ターン',
		close: '閉じる',
		load_game: 'セーブデータを読み込む',
		save_game: 'ゲームを保存',
		start_game: 'ゲームスタート',
		loading: '読み込み中',
		load: 'ロード',
		player: 'プレイヤー {num}',
		species: ['パープラス', 'キウイオプテリクス', 'ペスキオディフス', 'イスノバグ', 'アモルフ', 'チャックベリー'],
		iq: 'IQ',
		iqs: ['チャールズ・ダーウィン', 'ダーウィンの助手', 'ダーウィンの叔母', 'ダーウィンの犬'],
		popup_title: 'Q-POPセキュリティサービス',
		catastrophe: '大災害',
		turns: ['短い (5ターン)', '普通 (10ターン)', '長い (20ターン)', '最後まで'],
		turn_finished: '本当にターンを終わらせますか？',
		dead: '残念ながらあなたはもう過去の存在です…\nあなたの種は絶滅しました。',
		last_turn: 'ゴング！ 最後のターンが始まります！',
		who_plays: '誰がプレイしますか？\nプレイヤーが選ばれていません！',
		continue_alone: '一人で続けますか？',
		where_to_live: 'どこに住みますか？ 種をマップに置いていません！',
		suicide: '本当にこの個体を殺しますか？',
		game_over: 'ゲームオーバー！！\n全ての人間プレイヤーが死んだため、ゲームが終了します。',
		evo_score: '進化スコア',
		traits: [
			'ラングオンズへの適応',
			'ブルーリーフへの適応',
			'ハシュームへの適応',
			'スティンクボールへの適応',
			'スネークルーツへの適応',
			'ファイアグラスへの適応',
			'繁殖率',
			'攻撃力',
			'防御力',
			'カモフラージュ',
			'速度',
			'知覚',
			'知性',
		],
		transition_mutations: 'モンスターとミュータント',
		transition_survival: '食うか食われるか',
		transition_world: '種の戦争',
		upload_description: 'ここで、オリジナルまたはダウンロードしたセーブデータをアップロードできます。',
		upload: 'qppファイルをアップロード',
		not_a_savegame: 'このファイルは有効なQ-POPセーブデータではありません。',
		no_local_saves: 'ブラウザにセーブデータが見つかりません',
		really_restart: '本当にゲームを再開しますか？',
		sound_disabled: '音声が無効になっています。ブラウザが音声を再生できないようです。',
		information:
			'このゲームは、1995年にドイツのvon Wendt Konzept GmbHがリリースしたオリジナルのQ-POPゲームのリメイクです。このリメイクは、オリジナルゲームにできるだけ近いもので、便利な機能をいくつか追加しています。Javascriptが有効になっているすべての最新ブラウザで動作するはずです。ソースコードはGithubで自由に利用可能です。',
		credits_original: [
			['パブリッシャーと開発者', ['von Wendt Konzept GmbH']],
			['ゲームデザイン', ['Karl-L. von Wendt']],
			['プログラミング', ['Karl-L. von Wendt', 'Lars Hammer']],
			['グラフィックス', ['Stefan Beyer']],
			['音楽', ['Karl-L. von Wendt', 'Lars Hammer']],
		],
		credits_remake: [
			['プログラミング', ['Mathias Bockwoldt']],
			['リバースエンジニアリング', ['Mathias Bockwoldt', 'Christian Klamt']],
			['新しいグラフィックス', ['Eike Strathmann']],
			['和訳', ['Mathias Bockwoldt (ChatGPTと共に)']],
		],
		options_music: '音楽',
		options_sound: '音',
		options_lang: '言語',
		options_this_lang: 'JA 日本語',
		options_auto_continue: 'AI配置後自動で進む',
		options_click_hold: 'クリックしてユニットを配置/削除',
		options_plants: '変異画面で植物の分布を表示',
		options_predators: '生存画面で捕食者シンボルを表示',
		options_tutorial: 'チュートリアルを表示（オンオフでリセット）',
		options_ai_speed: 'ワールドマップでのAIスピード',
		options_ai_speeds: ['非常に遅い', 'とても遅い', '遅い', '速い', '瞬時'],
		options_transition: 'トランジション画面の表示時間',
		options_restart: 'ゲームを再起動',
		tutorial_title: 'チュートリアル',
		tutorial_abort: '中止',
		tutorial: {
			welcome:
				'Q-POPへようこそ！ このチュートリアルでゲームの始め方をお教えします。詳細はゲーム下部の説明にあるマニュアルをご覧ください。チュートリアルはいつでも中止できます。',
			change_language: '言語や他のオプションは上部のボタンで変更できます。',
			player_select:
				'プレイヤーとコンピューターの種を選びます。頭やコンピューターをクリックしてプレイヤータイプを選択します。また、各種の難易度（IQレベル）も選びます。',
			next: 'いつでもここで続けるか、エンターキーを押して続けることができます。',
			turns: 'プレイしたいゲームの長さを選びます。最初は5ターンで十分です。',
			wm_units:
				'ユニットをワールドマップに配置します。最初のユニットの後は、隣接するユニットの隣にしか配置できません。山や水の上には配置できませんので、海岸や山に閉じ込められないように注意してください。最初は、同じ種類の植物にユニットを配置するのが有利です。',
			wm_shadows:
				'影の数だけユニットを移動させることができます。この方法でワールドマップ上のユニットを動かせます。変異画面で速度特性を改善して、影の数を増やすことができます。今後は、ユニットが残っていれば異なる種の隣接するユニットと戦うことができます。',
			wm_rightclick:
				'ユニットの下にある植物を見るには、ユニットを右クリックします。または、カレンダーの下のアバターをクリックしてすべてのユニットを半透明にします。',
			mutation_start:
				'進化ポイントを配分して種の特性を向上させます。最初は100進化ポイントがありますが、後のラウンドではゲームの成功に応じてポイント数が変わります。右の円はワールドマップ上で種が占めている植物を示します。プラスまたはマイナスをクリックして少しずつ調整するか、バーをクリックして大きく調整します。',
			mutation_plant: '最初は、占有している植物への適応率を50％以上にする必要があります。任意の特性を右クリックして詳細を確認します。',
			survival_start:
				'このパートでは、ワールドマップ上の位置に応じて生成された環境で、自分の種の1つの個体を操作します。サバイバルマップをクリックするか、矢印キーやWASDで移動します。個体をクリックするかスペースキーを押して食べます。絶望的な状況に陥った場合、個体を右クリックするかエスケープキーを押して殺して新しい位置から始めることができます。',
			survival_goals:
				'できるだけ多くの植物を食べることを目指します。適応した植物は栄養価が高くなります。最低でも1つの食糧バーを満たすべきです。さらに、メスに近づいて繁殖を試みるべきです。最後に、捕食者を避けることを試みます。',
			survival_time:
				'各ステップには限られた時間と回数があります。死ぬと、別の個体で続けますが、死ぬたびにワールドマップ上の種の分布に影響します。',
			survival_radar:
				'種の感覚を使って、有望な食べ物のパッチ、交配相手、他の草食動物、捕食者を確認します。感覚の範囲は変異で増やすことができます。',
			catastrophe:
				'毎ターン、災害が発生します。それは世界のさまざまな側面を変える可能性があります。ユニットがまだ同じ植物にいるかどうかを確認する必要があります。',
			catastrophe0: '惑星の軸が移動し、大陸が赤道に近づきました。その結果、平均気温が上昇し、海水面が低下し、降雨量が減少しました。', // Warming
			catastrophe1: '惑星の回転の変化により、気候が寒冷化し、降雨量が増加しました。', // Cooling
			catastrophe2:
				'巨大な隕石が惑星に衝突しました。衝撃の近くが壊滅的な被害を受け、数百万トンの砂や塵が成層圏に吹き上げられ、気候が冷却されました。極地の氷冠がより多くの水を結合し、海面が低下しました。', // Comet
			catastrophe3:
				'新しい謎の病気が大陸の特定の地域に現れ、その地域のすべての種に影響を与えました。病気が発生した地域のすべての個体には病気を生き延びる可能性があります。', // Plague
			catastrophe4: '巨大な火山噴火が直近のフィールド内のすべての動物の命を奪いました。', // Volcano
			catastrophe5: '地球全体の気候が暖かくなりました。その結果、極地の氷冠が溶け、海水面が急上昇し、低地の沿岸地域が浸水しました。', // Flood
			catastrophe6: '強い地震が惑星全体の地表を変えました。湖が山に、山が湖になることもあります。', // Earthquake
			catastrophe7:
				'人間が惑星に上陸しました！ 絶滅の危機に瀕している自然を救うために、研究所を建設し、実験用動物を「絶滅から救う」ために狩りをします。人間は捕食者のように振る舞いますが、自然の敵よりも振り払うのが難しいです。', // Humans
			catastrophe8: '宇宙放射線の増加により、すべての種が変異します。その結果、各種の特性が劇的に変化します。', // Cosmic rays
			ranking:
				'ここで、世界のランキングが確認できます。まず、ワールドマップ上の個体の数。次に、今ラウンドの進化ポイントの量。これは個体の数に依存します。最後に、使用済みおよび利用可能な進化ポイントを合計した勝利ポイントです。',
			ranking_save: 'ゲームはブラウザに自動的に保存されます。セーブデータをダウンロードしたい場合は、ここでできます。',
			ranking_no_save: 'セーブデータをダウンロードしたい場合は、ここでできます。ゲームは自動保存されません。',
			save: '今提示されたセーブデータは、このゲームで再びロードすることができますが、オリジナルゲームとも互換性があります！',
		},
		trait_hints: [
			'ラングオンズへの適応は、植物の栄養利用を改善します。さらに、ワールドマップ上のラングオンフィールドでの戦闘でのアドバンテージにもなります。', // Rangones
			'ブルーリーフへの適応は、植物の栄養利用を改善します。さらに、ワールドマップ上のブルーリーフフィールドでの戦闘でのアドバンテージにもなります。', // Blueleaf
			'ハシュームへの適応は、植物の栄養利用を改善します。さらに、ワールドマップ上のハシュームフィールドでの戦闘でのアドバンテージにもなります。', // Hushrooms
			'スティンクボールへの適応は、植物の栄養利用を改善します。さらに、ワールドマップ上のスティンクボールフィールドでの戦闘でのアドバンテージにもなります。', // Stinkballs
			'スネークルーツへの適応は、植物の栄養利用を改善します。さらに、ワールドマップ上のスネークルートフィールドでの戦闘でのアドバンテージにもなります。', // Snakeroot
			'ファイアグラスへの適応は、植物の栄養利用を改善します。さらに、ワールドマップ上のファイアグラスフィールドでの戦闘でのアドバンテージにもなります。', // Firegrass
			'繁殖率は、交配と餌を食べた時の効果を増加させ、ワールドマップ上のユニットを増加させます。', // Reproduction
			'攻撃力は、ワールドマップ上の戦闘で攻撃者の勝利の可能性を増加させます。', // Attack
			'防御力は、ワールドマップ上の戦闘で防御者の勝利の可能性を増加させます。また、捕食者に対しての勝利の可能性も増加させます。', // Defense
			'カモフラージュは、捕食者が追跡を失う可能性を増加させます。', // Camouflage
			'速度は、ワールドマップ上での移動ポイントを増加させます。また、速度は、捕食者が追跡を失う可能性を少し増加させます。', // Speed
			'知覚は、サバイバル中のミニマップの範囲を改善します。', // Perception
			'知性は、他のほとんどの特性を少し改善します。', // Intelligence
		],
	},
	KR: {
		title: 'Q-POP',
		subtitle: '우주에서의 진화',
		next: '계속',
		yes: '네',
		no: '아니요',
		turn: '턴',
		close: '닫기',
		load_game: '게임 불러오기',
		save_game: '게임 저장',
		start_game: '게임 시작',
		loading: '로딩 중',
		load: '불러오기',
		player: '플레이어 {num}',
		species: ['퍼플러스', '키위옵테릭스', '페시오다이퍼스', '이노버그', '아모르프', '척베리'],
		iq: '지능',
		iqs: ['찰스 다윈', '다윈의 조수', '다윈의 이모', '다윈의 개'],
		popup_title: 'Q-POP 보안 서비스',
		catastrophe: '재앙',
		turns: ['짧게 (5턴)', '보통 (10턴)', '길게 (20턴)', '끝까지'],
		turn_finished: '정말로 턴이 끝났나요?',
		dead: '미안하지만, 이제 끝났어요!\n당신의 종족은 사라졌습니다...',
		last_turn: '공! 마지막 턴 시작!',
		who_plays: '누가 플레이할까요?\n플레이어를 선택하지 않았어요!',
		continue_alone: '혼자 계속할래요?',
		where_to_live: '어디에서 살고 싶나요? 지도를 아직 선택하지 않았어요!',
		suicide: '정말로 이 개체를 죽일 건가요?',
		game_over: '모두 끝났어요!!\n모든 인간 플레이어가 죽었어요. 게임이 끝났습니다!',
		evo_score: '진화 점수',
		traits: [
			'랭곤에 적응',
			'블루리프에 적응',
			'허슈룸에 적응',
			'스팅볼에 적응',
			'스네이크루트에 적응',
			'파이어그래스에 적응',
			'번식률',
			'공격력',
			'방어력',
			'위장술',
			'속도',
			'지각력',
			'지능',
		],
		transition_mutations: '괴물과 돌연변이',
		transition_survival: '먹고 먹히기',
		transition_world: '종족 전쟁',
		upload_description: '여기에서 원본 또는 다운로드한 저장 게임을 업로드할 수 있습니다.',
		upload: 'qpp 파일 업로드',
		not_a_savegame: '이 파일은 유효한 Q-Pop 저장 게임이 아닙니다.',
		no_local_saves: '브라우저에서 저장된 게임을 찾을 수 없습니다.',
		really_restart: '정말로 게임을 다시 시작할까요?',
		sound_disabled: '사운드가 비활성화되었습니다. 브라우저가 사운드를 재생할 수 없는 것 같아요.',
		information:
			'이 게임은 1995년 독일에서 von Wendt Konzept GmbH가 출시한 원작 Q-Pop 게임의 리메이크입니다. 이 리메이크는 원작 게임에 최대한 가깝게, 몇 가지 편리한 기능을 추가하여 제작되었습니다. 자바스크립트를 지원하는 모든 최신 브라우저에서 실행할 수 있습니다. 소스 코드는 Github에서 무료로 이용할 수 있습니다.',
		credits_original: [
			['발행 및 개발', ['von Wendt Konzept GmbH']],
			['게임 디자인', ['Karl-L. von Wendt']],
			['프로그래밍', ['Karl-L. von Wendt', 'Lars Hammer']],
			['그래픽', ['Stefan Beyer']],
			['음악', ['Karl-L. von Wendt', 'Lars Hammer']],
		],
		credits_remake: [
			['프로그래밍', ['Mathias Bockwoldt']],
			['리버스 엔지니어링', ['Mathias Bockwoldt', 'Christian Klamt']],
			['새로운 그래픽', ['Eike Strathmann']],
			['한국어 번역', ['Mathias Bockwoldt (ChatGPT와 함께)']],
		],
		options_music: '음악',
		options_sound: '사운드',
		options_lang: '언어',
		options_this_lang: 'KR 한국어',
		options_auto_continue: '세계 지도에서 AI 배치 후 자동 진행',
		options_click_hold: '클릭 및 유지로 유닛을 배치하거나 제거',
		options_plants: '돌연변이 화면에서 식물 분포 표시',
		options_predators: '생존에서 사라진 포식자 기호 표시',
		options_tutorial: '게임 튜토리얼 표시 (끄고 켜서 리셋)',
		options_ai_speed: '세계 지도에서 AI 속도',
		options_ai_speeds: ['매우 느림', '느림', '보통', '빠름', '즉시'],
		options_transition: '전환 화면 보기 시간',
		options_restart: '게임 재시작',
		tutorial_title: '튜토리얼',
		tutorial_abort: '중단',
		tutorial: {
			welcome:
				'Q-Pop에 오신 것을 환영합니다! 이 튜토리얼은 시작하는 데 도움이 될 것입니다. 자세한 내용은 게임 설명 아래에 링크된 매뉴얼을 참조하세요. 언제든지 중단 버튼을 눌러 튜토리얼을 종료할 수 있습니다.',
			change_language: '여기 위의 버튼을 사용하여 언어 및 기타 옵션을 변경할 수 있습니다.',
			player_select:
				'당신과 컴퓨터가 플레이할 종족을 선택하세요. 플레이어 유형을 선택하려면 머리 또는 컴퓨터를 클릭하세요. 또한 각 종족에 대한 난이도 설정 (IQ 수준)을 선택하세요.',
			next: '여기에서 계속할 수 있거나 Enter를 눌러 계속할 수 있습니다.',
			turns: '게임 길이를 선택하세요. 처음에는 다섯 라운드가 충분할 수 있습니다.',
			wm_units:
				'세계 지도에 유닛을 배치하세요. 첫 번째 유닛 이후에는 다른 유닛 옆에만 배치할 수 있습니다. 산이나 물 위에 유닛을 배치할 수 없습니다. 해안이나 산 가까이에 갇히지 않도록 주의하세요. 처음에는 동일한 유형의 식물에 대부분의 유닛을 배치하는 것이 유리합니다.',
			wm_shadows:
				'그림자만큼 많은 유닛을 선택할 수 있습니다. 이렇게 하면 세계 지도에서 유닛을 이동할 수 있습니다. 돌연변이 화면에서 속성 점수를 향상시켜 더 많은 그림자를 얻을 수 있습니다. 이번 턴부터는 다른 종족의 인접 유닛과 싸울 수 있습니다.',
			wm_rightclick:
				'유닛이 있는 식물을 보려면 유닛을 오른쪽 클릭하세요. 또는 달력 아래의 아바타를 클릭하여 모든 유닛을 반투명하게 만들 수 있습니다.',
			mutation_start:
				'진화 점수를 분배하여 종족의 속성을 향상시키세요. 처음에는 100 진화 점수가 있지만, 게임이 진행됨에 따라 그 수는 성공에 따라 달라집니다. 오른쪽 원은 종족이 세계 지도에서 차지하고 있는 식물을 나타냅니다. 플러스 또는 마이너스를 클릭하여 작은 단계를 이동하거나 막대를 직접 클릭하여 큰 단계를 이동할 수 있습니다.',
			mutation_plant:
				'처음에는 가장 많이 차지한 식물에 대한 적응이 최소 50%여야 합니다. 속성에 대해 더 알고 싶다면 속성을 오른쪽 클릭하세요.',
			survival_start:
				'게임의 이 부분에서는 세계 지도에서 차지한 위치에 따라 생성된 환경에서 종족의 개체를 하나 조종합니다. 생존 맵을 클릭하거나 화살표 키 또는 WASD를 사용하여 이동하세요. 개체를 클릭하거나 스페이스바를 눌러 먹이를 먹을 수 있습니다. 절망적인 상황에 처한 경우, 개체를 오른쪽 클릭하거나 Esc 키를 눌러 그것을 죽이고 새로운 위치에서 시작할 수 있습니다.',
			survival_goals:
				'가능한 많은 식물을 먹어보세요. 적응한 식물은 더 많은 영양분을 제공합니다. 최소한 하나의 음식 바를 채워야 합니다. 또한, 암컷 옆에 서서 번식하려고 시도하세요. 마지막으로 포식자를 피하세요.',
			survival_time:
				'각 걸음마다 제한된 시간과 걸음 수가 있습니다. 죽으면 다른 개체로 계속 진행할 수 있지만, 모든 죽음은 세계 지도에서 종족의 분포에 영향을 미칩니다.',
			survival_radar:
				'종족의 감각을 사용하여 유망한 먹이, 짝, 다른 초식동물 및 포식자를 보세요. 돌연변이를 통해 감각 범위를 넓힐 수 있습니다.',
			catastrophe:
				'재앙은 매 턴마다 발생합니다. 이들은 세계의 다양한 측면을 변화시킬 수 있습니다. 유닛이 여전히 이전과 동일한 식물을 차지하고 있는지 확인해야 합니다.',
			catastrophe0: '행성의 축이 기울어져 대륙이 적도에 더 가까워졌습니다. 그 결과 평균 온도가 상승하고 해수면이 하강하며 비가 적어집니다.', // 온난화
			catastrophe1: '행성의 자전 변화로 인해 기후가 차가워지고 비가 많아집니다.', // 냉각
			catastrophe2:
				'거대한 운석이 행성을 강타했습니다. 충돌의 근처는 황폐해집니다. 수백만 톤의 모래와 먼지가 성층권으로 불어 올라가 기후를 냉각시킵니다. 극지방의 빙하가 더 많은 물을 결합시켜 해수면을 하강시킵니다.', // 혜성
			catastrophe3:
				'대륙의 특정 지역에서 새로운 수수께끼의 질병이 나타나 그 지역의 모든 종족에 영향을 미칩니다. 질병이 발생하는 지역의 모든 개체는 질병을 생존할 확률이 있습니다.', // 전염병
			catastrophe4: '거대한 화산 폭발이 인접한 모든 동물 생명을 파괴합니다.', // 화산
			catastrophe5:
				'전 세계적으로 기후가 따뜻해졌습니다. 그 결과, 극지방의 빙하가 녹아 해수면이 급격히 상승하고 저지대 해안 지역이 침수됩니다.', // 홍수
			catastrophe6: '강력한 지진이 행성의 전체 표면을 바꿉니다. 호수는 산으로, 산은 호수로 변할 수 있습니다.', // 지진
			catastrophe7:
				'인간이 행성에 착륙했습니다! 위험에 처한 자연을 돕기 위해 연구소를 짓고 실험 동물을 "멸종으로부터 구하기" 위해 사냥을 합니다. 인간은 육식동물처럼 행동하지만 자연의 적들보다 더 대처하기 어렵습니다.', // 인간
			catastrophe8: '우주 방사선의 발생이 증가하여 모든 종족이 돌연변이로 변화합니다. 그 결과, 각 종족의 특성이 극적으로 변화합니다.', // 우주선
			ranking:
				'여기에서 세계에서의 순위를 볼 수 있습니다. 첫째는 세계 지도에 있는 개체 수입니다. 둘째는 이번 턴에 사용할 수 있는 진화 점수의 양입니다. 이는 개체 수에 따라 달라집니다. 셋째는 모든 사용된 진화 점수와 사용 가능한 진화 점수의 합계인 승리 점수입니다.',
			ranking_save: '게임은 브라우저에 자동으로 저장됩니다. 저장 게임을 다운로드하고 싶다면 여기에 다운로드할 수 있습니다.',
			ranking_no_save: '저장 게임을 다운로드하고 싶다면 여기에 다운로드할 수 있습니다. 게임은 자동으로 저장되지 않습니다.',
			save: '방금 제공된 저장 게임은 이 게임에서 다시 불러올 수 있습니다. 하지만 원작 게임과도 호환됩니다!',
		},
		trait_hints: [
			'랭곤에 대한 적응은 식물의 음식 활용도를 향상시킵니다. 또한, 랭곤 필드에서의 전투에서 이점이 됩니다.', // 랭곤
			'블루리프에 대한 적응은 식물의 음식 활용도를 향상시킵니다. 또한, 블루리프 필드에서의 전투에서 이점이 됩니다.', // 블루리프
			'허슈룸에 대한 적응은 식물의 음식 활용도를 향상시킵니다. 또한, 허슈룸 필드에서의 전투에서 이점이 됩니다.', // 허슈룸
			'스팅볼에 대한 적응은 식물의 음식 활용도를 향상시킵니다. 또한, 스팅볼 필드에서의 전투에서 이점이 됩니다.', // 스팅볼
			'스네이크루트에 대한 적응은 식물의 음식 활용도를 향상시킵니다. 또한, 스네이크루트 필드에서의 전투에서 이점이 됩니다.', // 스네이크루트
			'파이어그래스에 대한 적응은 식물의 음식 활용도를 향상시킵니다. 또한, 파이어그래스 필드에서의 전투에서 이점이 됩니다.', // 파이어그래스
			'번식률은 교배 및 먹이 섭취의 효과를 증가시켜 세계 지도에 더 많은 유닛을 생성합니다.', // 번식
			'공격력은 세계 지도에서의 전투에서 공격자의 승리 확률을 높입니다.', // 공격
			'방어력은 세계 지도에서의 전투에서 수비자의 승리 확률을 높입니다. 또한, 포식자에 대한 승리 확률을 높입니다.', // 방어
			'위장술은 포식자가 플레이어의 흔적을 놓치고 추적하지 않을 확률을 높입니다.', // 위장술
			'속도는 세계 지도에서의 이동 포인트를 증가시킵니다. 또한, 속도는 포식자가 흔적을 놓칠 확률을 약간 증가시킵니다.', // 속도
			'지각력은 생존 중 미니맵의 범위를 향상시킵니다.', // 지각력
			'지능은 대부분의 다른 특성을 약간 증가시킵니다.', // 지능
		],
	},
	ZH: {
		"title": "Q-POP",
		"subtitle": "太空进化",
		"next": "继续",
		"yes": "是",
		"no": "否",
		"turn": "回合",
		"close": "关闭",
		"load_game": "加载存档",
		"save_game": "保存游戏",
		"start_game": "开始游戏",
		"loading": "加载中",
		"load": "加载",
		"player": "玩家 {num}",
		"species": ["普尔普斯", "奇异鸟翼", "佩斯奇奥菲斯", "伊诺虫", "无形者", "查克莓"],
		"iq": "智商",
		"iqs": ["查尔斯·达尔文", "达尔文助手", "达尔文阿姨", "达尔文的狗"],
		"popup_title": "Q-POP 安全服务",
		"catastrophe": "灾难",
		"turns": ["短（5 回合）", "中（10 回合）", "长（20 回合）", "直到最后"],
		"turn_finished": "确定要结束回合吗？",
		"dead": "抱歉，你已经成为历史！\n你的物种消失了...",
		"last_turn": "锣声响起！最后一回合开始！",
		"who_plays": "谁来玩？\n你还没有选择玩家！",
		"continue_alone": "你想独自继续吗？",
		"where_to_live": "你想住在哪里？你还没有把你的物种放在地图上！",
		"suicide": "你真的想杀掉这个个体吗？",
		"game_over": "游戏结束！！\n所有人类玩家都死了，游戏结束！",
		"evo_score": "进化得分",
		"traits": ["适应橙果", "适应蓝叶", "适应蘑菇", "适应臭球", "适应蛇根", "适应火草", "繁殖率", "攻击力", "防御力", "伪装", "速度", "感知", "智力"],
		"transition_mutations": "怪物和变异",
		"transition_survival": "吃或被吃",
		"transition_world": "物种之战",
		"upload_description": "在这里，你可以上传原始或下载的存档。",
		"upload": "上传 qpp 文件",
		"not_a_savegame": "该文件不是有效的 Q-Pop 存档。",
		"no_local_saves": "浏览器中未找到存档",
		"really_restart": "你真的想重启游戏吗？",
		"sound_disabled": "声音已禁用。看起来你的浏览器无法播放任何声音。",
		"information": "这款游戏是 1995 年 von Wendt Konzept GmbH 在德国发布的原版 Q-Pop 游戏的重制版。此重制版尽可能接近原版，并添加了一些便利功能。它应该可以在所有支持 JavaScript 的现代浏览器上运行。源代码在 Github 上免费提供。",
		"credits_original": [
			["发行商和开发商", ["von Wendt Konzept GmbH"]],
			["游戏设计", ["Karl-L. von Wendt"]],
			["程序设计", ["Karl-L. von Wendt", "Lars Hammer"]],
			["美术", ["Stefan Beyer"]],
			["音乐", ["Karl-L. von Wendt", "Lars Hammer"]]
		],
		"credits_remake": [
			["程序设计", ["Mathias Bockwoldt"]],
			["逆向工程", ["Mathias Bockwoldt", "Christian Klamt"]],
			["新美术", ["Eike Strathmann"]],
			["中文翻译", ["Mathias Bockwoldt（与 ChatGPT 合作）"]]
		],
		"options_music": "音乐",
		"options_sound": "音效",
		"options_lang": "语言",
		"options_this_lang": "ZH 简体中文",
		"options_auto_continue": "AI 放置在地图上后自动继续",
		"options_click_hold": "按住点击在地图上放置或移除单位",
		"options_plants": "在变异界面显示植物分布",
		"options_predators": "在生存界面显示被击败的掠食者标志",
		"options_tutorial": "显示游戏教程（开关重置）",
		"options_ai_speed": "地图上 AI 速度",
		"options_ai_speeds": ["非常慢", "很慢", "慢", "快", "瞬间"],
		"options_transition": "转场界面持续时间",
		"options_restart": "重启游戏",
		"tutorial_title": "教程",
		"tutorial_abort": "中止",
		"tutorial": {
			"welcome": "欢迎来到 Q-Pop！本教程将帮助你入门。欲了解更多详情，请查看游戏下方描述中的手册链接。你可以随时点击中止来退出教程。",
			"change_language": "你可以使用顶部的按钮更改语言和其他选项。",
			"player_select": "选择你和电脑将要玩的物种。点击头像或电脑选择玩家类型。此外，为每个物种选择一个难度等级（智商水平）。",
			"next": "你可以随时点击这里或按回车继续。",
			"turns": "选择你想玩的游戏时长。初学者建议选择五回合。",
			"wm_units": "在世界地图上放置你的单位。第一个单位后，你只能放置相邻的单位。无法放置在山脉或水域上。注意不要把自己困在海岸或山脉附近。最初最好将大多数单位放置在相同类型的植物上。",
			"wm_shadows": "你可以拾取与你的阴影数量相同的单位。这样，你可以在世界地图上移动单位。你可以在变异界面提高你的速度特性以获得更多阴影。从这回合开始，如果有剩余单位，你可以攻击不同物种的相邻单位。",
			"wm_rightclick": "右键点击一个单位查看其所在植物。或者，你可以点击日历下的头像使所有单位变得半透明。",
			"mutation_start": "分配进化点数以提升物种特性。开始时，你有 100 个进化点数，后期数量将取决于你的游戏表现。右侧的圆圈显示你的物种在世界地图上占据的植物。你可以点击加号或减号进行小步调整，或直接点击条形进行大步调整。",
			"mutation_plant": "一开始，你占据最多的植物的适应性应该至少达到 50%。右键点击任何特性以了解更多信息。",
			"survival_start": "在游戏的这一部分，你将扮演物种中的一个个体，环境将根据你在世界地图上的位置而创建。你可以通过点击生存地图或使用箭头键或 WASD 键移动。你可以通过点击个体或按空格键进食。如果你处于绝望的情况下，可以右键点击个体或按下退出键将其杀死并重新开始。",
			"survival_goals": "尽量吃掉尽可能多的植物。你的物种适应的植物将提供更多的营养。你应该至少填满一个食物条。此外，你应该试图通过走到雌性旁边来繁殖。最后，尽量避开掠食者。",
			"survival_time": "你每步有有限的步数和时间。如果你死了，你将继续使用另一个个体，但每一次死亡都会影响你物种在世界地图上的分布。",
			"survival_radar": "利用物种的感知能力寻找食物点、交配伙伴、其他食草动物和掠食者。你可以通过变异增加感知范围。",
			"catastrophe": "灾难每回合都会发生。它们会改变世界的各个方面。你应该检查你的单位是否仍然占据原先的植物。",
			"catastrophe0": "行星轴线偏移，使大陆更接近赤道。因此，平均气温上升，海平面下降，降雨量减少。", // Warming
			"catastrophe1": "行星自转变化导致气候变冷和降雨增多。", // Cooling
			"catastrophe2": "一颗巨大的陨石撞击了行星。撞击附近的区域被摧毁。数百万吨的沙尘被吹入平流层，导致气候变冷。极地冰盖冻结更多水，导致海平面下降。", // Comet
			"catastrophe3": "大陆某个特定区域出现了一种新的、神秘的疾病，影响该区域的所有物种。每个个体在疾病发生的区域内都有一定的生存几率。", // Plague
			"catastrophe4": "巨大的火山喷发摧毁了紧邻的所有动物生命。", // Volcano
			"catastrophe5": "全球气候变暖。结果是，极地冰盖融化，海平面急剧上升，低洼的沿海地区被淹没。", // Flood
			"catastrophe6": "强烈的地震改变了整个行星表面。湖泊可能变成山脉，反之亦然。", // Earthquake
			"catastrophe7": "人类降临了这颗星球！他们不懈努力帮助濒危自然，建造了一个研究站并捕猎实验动物“拯救它们免于灭绝”。人类行为像食肉动物，但比自然敌人更难摆脱。", // Humans
			"catastrophe8": "宇宙辐射增加，使所有物种发生突变。结果，每个物种的特性发生了巨大变化。", // Cosmic rays
			"ranking": "在这里，你可以看到你的世界排名。首先是世界地图上的个体数量。其次是本轮可用的进化点数。这取决于个体数量。第三是胜利点数，即所有使用和可用的进化点数的总和。",
			"ranking_save": "游戏会自动保存在浏览器中。如果你想下载存档，可以在这里下载。",
			"ranking_no_save": "如果你想下载存档，可以在这里下载。游戏不会自动保存。",
			"save": "你刚刚提供的存档可以在此游戏中再次加载。但它也兼容原版游戏！"
		},
		"trait_hints": [
			"适应橙果提高植物的食物利用率。此外，适应性在橙果区域的战斗中具有优势。", // Rangones
			"适应蓝叶提高植物的食物利用率。此外，适应性在蓝叶区域的战斗中具有优势。", // Blueleaf
			"适应蘑菇提高植物的食物利用率。此外，适应性在蘑菇区域的战斗中具有优势。", // Hushrooms
			"适应臭球提高植物的食物利用率。此外，适应性在臭球区域的战斗中具有优势。", // Stinkballs
			"适应蛇根提高植物的食物利用率。此外，适应性在蛇根区域的战斗中具有优势。", // Snakeroot
			"适应火草提高植物的食物利用率。此外，适应性在火草区域的战斗中具有优势。", // Firegrass
			"繁殖率增加交配和进食的效果，产生更多的世界地图单位。", // Reproduction
			"攻击力提高世界地图上进攻方的战斗几率。", // Attack
			"防御力提高世界地图上防守方的战斗几率。此外，它还增加了战胜掠食者的可能性。", // Defense
			"伪装增加掠食者丢失踪迹、不再追踪玩家的概率。", // Camouflage
			"速度提供更多的世界地图移动点。此外，速度稍微增加掠食者丢失踪迹的概率。", // Speed
			"感知提高生存模式中小地图的范围。", // Perception
			"智力稍微提高其他大多数特性。" // Intelligence
		]
	},
	PL: {
		"title": "Q-POP",
		"subtitle": "Ewolucja w kosmosie",
		"next": "Dalej",
		"yes": "Tak",
		"no": "Nie",
		"turn": "Tura",
		"close": "Zamknij",
		"load_game": "Wczytaj zapis",
		"save_game": "Zapisz grę",
		"start_game": "Start gry",
		"loading": "Ładowanie",
		"load": "Wczytaj",
		"player": "Gracz {num}",
		"species": ["Purplus", "Kiwiopteryx", "Pesciodyphus", "Isnobug", "Amorph", "Chuckberry"],
		"iq": "IQ",
		"iqs": ["Karol Darwin", "Pomocnik Darwina", "Ciocia Darwina", "Pies Darwina"],
		"popup_title": "Q-POP Bezpieczeństwo",
		"catastrophe": "Katastrofa",
		"turns": ["Krótka (5 tur)", "Średnia (10 tur)", "Długa (20 tur)", "Do końca"],
		"turn_finished": "Na pewno skończyłeś turę?",
		"dead": "Niestety, jesteś już historią!\nTwoje gatunki wyginęły...",
		"last_turn": "Gong! Ostatnia tura zaczyna się!",
		"who_plays": "Kto gra?\nNie wybrałeś gracza!",
		"continue_alone": "Chcesz grać dalej sam?",
		"where_to_live": "Gdzie chcesz zamieszkać? Nie umieściłeś swojego gatunku na mapie!",
		"suicide": "Na pewno chcesz zabić tę jednostkę?",
		"game_over": "KONIEC GRY!!\nWszyscy ludzcy gracze nie żyją, gra skończona!",
		"evo_score": "Punkty Ewolucji",
		"traits": ["Adaptacja do Rangones", "Adaptacja do Blueleaf", "Adaptacja do Hushrooms", "Adaptacja do Stinkballs", "Adaptacja do Snakeroots", "Adaptacja do Firegrass", "Wskaźnik rozrodczości", "Siła ataku", "Siła obrony", "Kamuflaż", "Szybkość", "Percepcja", "Inteligencja"],
		"transition_mutations": "Potwory i Mutanci",
		"transition_survival": "Jedz lub Bądź Zjedzony",
		"transition_world": "Wojna Gatunków",
		"upload_description": "Tutaj możesz przesłać oryginalny lub pobrany zapis gry.",
		"upload": "Prześlij plik qpp",
		"not_a_savegame": "Ten plik nie jest prawidłowym zapisem Q-Pop.",
		"no_local_saves": "Nie znaleziono zapisów w przeglądarce",
		"really_restart": "Na pewno chcesz zrestartować grę?",
		"sound_disabled": "Dźwięk został wyłączony. Wygląda na to, że przeglądarka nie może odtwarzać dźwięków.",
		"information": "Ta gra jest remakiem oryginalnej gry Q-Pop, wydanej w Niemczech w 1995 roku przez von Wendt Konzept GmbH. Remake ten jest jak najbliższy oryginałowi, z dodanymi kilkoma funkcjami ułatwiającymi rozgrywkę. Powinien działać na wszystkich nowoczesnych przeglądarkach obsługujących JavaScript. Kod źródłowy jest dostępny za darmo na Githubie.",
		"credits_original": [
			["Wydawca i twórca", ["von Wendt Konzept GmbH"]],
			["Projekt gry", ["Karl-L. von Wendt"]],
			["Programowanie", ["Karl-L. von Wendt", "Lars Hammer"]],
			["Grafika", ["Stefan Beyer"]],
			["Muzyka", ["Karl-L. von Wendt", "Lars Hammer"]]
		],
		"credits_remake": [
			["Programowanie", ["Mathias Bockwoldt"]],
			["Inżynieria wsteczna", ["Mathias Bockwoldt", "Christian Klamt"]],
			["Nowa grafika", ["Eike Strathmann"]],
			["Tłumaczenie na polski", ["Mathias Bockwoldt (współpraca z ChatGPT)"]]
		],
		"options_music": "Muzyka",
		"options_sound": "Dźwięk",
		"options_lang": "Język",
		"options_this_lang": "PL Polski",
		"options_auto_continue": "Automatyczne kontynuowanie po rozmieszczeniu AI na mapie świata",
		"options_click_hold": "Przytrzymaj, aby umieścić lub usunąć jednostki na mapie świata",
		"options_plants": "Pokaż rozmieszczenie roślin na ekranie mutacji",
		"options_predators": "Pokaż symbole pokonanych drapieżników w trybie przetrwania",
		"options_tutorial": "Pokaż samouczek gry (włącz/wyłącz, aby zresetować)",
		"options_ai_speed": "Prędkość AI na mapie świata",
		"options_ai_speeds": ["bardzo wolno", "wolno", "wolno", "szybko", "natychmiast"],
		"options_transition": "Czas trwania ekranu przejścia",
		"options_restart": "Restart gry",
		"tutorial_title": "Samouczek",
		"tutorial_abort": "Przerwij",
		"tutorial": {
			"welcome": "Witamy w Q-Pop! Ten samouczek pomoże Ci zacząć. Więcej szczegółów znajdziesz w podręczniku podanym w opisie gry. W każdej chwili możesz przerwać samouczek, klikając 'Przerwij'.",
			"change_language": "Możesz zmienić język i inne opcje za pomocą przycisków u góry.",
			"player_select": "Wybierz gatunek, którym Ty i komputer będziecie grać. Kliknij na głowę lub komputery, aby wybrać typ gracza. Dodatkowo, wybierz poziom trudności (poziom IQ) dla każdego gatunku.",
			"next": "Możesz zawsze kontynuować tutaj lub naciskając enter.",
			"turns": "Wybierz, jak długo chcesz grać. Na początek wystarczy pięć rund.",
			"wm_units": "Umieść swoje jednostki na mapie świata. Po umieszczeniu pierwszej jednostki, kolejne mogą być umieszczone tylko obok innych. Nie można umieszczać jednostek na górach ani wodzie. Uważaj, aby nie zablokować się blisko wybrzeża lub w górach. Na początku warto umieścić większość jednostek na tym samym rodzaju roślin.",
			"wm_shadows": "Możesz podnieść tyle jednostek, ile masz cieni. W ten sposób możesz przesuwać jednostki po mapie świata. Możesz zwiększyć swoją cechę szybkości na ekranie mutacji, aby uzyskać więcej cieni. Od tej tury możesz walczyć z sąsiednimi jednostkami innego gatunku, jeśli masz wolne jednostki.",
			"wm_rightclick": "Aby zobaczyć, na jakich roślinach znajdują się Twoje jednostki, możesz kliknąć prawym przyciskiem myszy na jednostkę, aby zobaczyć roślinę pod nią. Alternatywnie, możesz kliknąć na avatar pod kalendarzem, aby sprawić, że wszystkie jednostki staną się półprzezroczyste.",
			"mutation_start": "Rozdziel punkty ewolucji, aby poprawić cechy swojego gatunku. Na początku masz 100 punktów ewolucji, ale później w grze ich liczba będzie zależna od Twojego sukcesu w grze. Kręgi po prawej stronie pokazują, które rośliny zajmują Twoje gatunki na mapie świata. Możesz kliknąć na plus lub minus, aby dokonać małych zmian, lub bezpośrednio na pasek, aby dokonać dużych zmian.",
			"mutation_plant": "Na początku adaptacja do roślin, które zajmujesz najwięcej, powinna wynosić co najmniej 50%. Kliknij prawym przyciskiem na dowolną cechę, aby dowiedzieć się więcej.",
			"survival_start": "W tej części gry grasz jako jedno z Twoich jednostek w środowisku, które jest tworzone w zależności od pozycji, jakie zajmujesz na mapie świata. Poruszaj się, klikając na mapę przetrwania lub używając klawiszy strzałek lub WASD. Możesz jeść, klikając na jednostkę lub naciskając spację. Jeśli znajdziesz się w beznadziejnej sytuacji, możesz kliknąć prawym przyciskiem na jednostkę lub nacisnąć escape, aby ją zabić i zacząć od nowej pozycji.",
			"survival_goals": "Spróbuj zjeść jak najwięcej roślin. Rośliny, do których Twój gatunek jest przystosowany, dostarczą więcej pożywienia. Powinieneś napełnić co najmniej jeden pasek żywności. Dodatkowo, spróbuj się rozmnażać, podchodząc obok samicy. Na koniec, staraj się unikać drapieżników.",
			"survival_time": "Masz ograniczoną ilość kroków i ograniczony czas na każdy krok. Jeśli umrzesz, będziesz kontynuował z inną jednostką, ale każda śmierć wpływa na rozmieszczenie Twoich gatunków na mapie świata.",
			"survival_radar": "Użyj zmysłów swojego gatunku, aby zobaczyć obiecujące pożywienie, partnerów do rozmnażania, inne roślinożerne i drapieżniki. Możesz zwiększyć zasięg zmysłów przez mutacje.",
			"catastrophe": "Katastrofy zdarzają się co turę. Mogą zmieniać różne aspekty świata. Sprawdź, czy Twoje jednostki nadal zajmują te same rośliny co wcześniej.",
			"catastrophe0": "Oś planety przesunęła się, przesuwając kontynent bliżej równika. W rezultacie, średnia temperatura wzrasta, poziom morza opada, a opady są mniejsze.", // Warming
			"catastrophe1": "Zmiany w obrotach planety powodują chłodniejszy klimat i większe opady.", // Cooling
			"catastrophe2": "Na planetę uderzył wielki meteoryt. Okolica uderzenia zostaje zniszczona. Miliony ton piasku i pyłu zostają wyrzucone do stratosfery, ochładzając klimat. Polarne czapy lodowe wiążą więcej wody, co prowadzi do spadku poziomu morza.", // Comet
			"catastrophe3": "Na kontynencie pojawia się nowa, zagadkowa choroba, dotykająca wszystkie gatunki w danym obszarze. Każdy osobnik w miejscu występowania choroby ma pewną szansę na przeżycie.", // Plague
			"catastrophe4": "Ogromne erupcje wulkaniczne niszczą całe życie zwierzęce w bezpośrednio przyległych polach.", // Volcano
			"catastrophe5": "Globalne ocieplenie. W wyniku tego, polarna czapa lodowa topnieje, poziom morza gwałtownie się podnosi i zalewa nisko położone tereny przybrzeżne.", // Flood
			"catastrophe6": "Silne trzęsienie ziemi zmienia całą powierzchnię planety. Jeziora mogą zamienić się w góry i odwrotnie.", // Earthquake
			"catastrophe7": "Ludzie wylądowali na planecie! W swoich nieustannych wysiłkach na rzecz pomocy zagrożonej przyrodzie, budują stację badawczą na planecie i polują na zwierzęta do eksperymentów „ratując je przed wyginięciem”. Ludzie zachowują się jak mięsożercy, ale trudniej ich się pozbyć niż naturalnych wrogów.", // Humans
			"catastrophe8": "Zwiększona częstotliwość występowania promieniowania kosmicznego mutuje wszystkie gatunki. W rezultacie, cechy każdego gatunku zmieniają się dramatycznie.", // Cosmic rays
			"ranking": "Tutaj możesz zobaczyć swoje miejsce na świecie. Po pierwsze, liczba osobników na mapie świata. Po drugie, liczba dostępnych w tej rundzie punktów ewolucji. Zależy to od liczby osobników. Po trzecie, punkty zwycięstwa, które sumują wszystkie wykorzystane i dostępne punkty ewolucji.",
			"ranking_save": "Gra jest automatycznie zapisywana w przeglądarce. Jeśli chcesz pobrać zapis gry, możesz to zrobić tutaj.",
			"ranking_no_save": "Jeśli chcesz pobrać zapis gry, możesz to zrobić tutaj. Gra nie będzie automatycznie zapisywana.",
			"save": "Zapis, który właśnie został zaoferowany, można ponownie załadować w tej grze. Jest on również kompatybilny z oryginalną grą!"
		},
		"trait_hints": [
			"Adaptacja do rangones poprawia wykorzystanie pożywienia z rośliny. Ponadto adaptacja ta daje przewagę w walce na polach rangones.", // Rangones
			"Adaptacja do blueleaf poprawia wykorzystanie pożywienia z rośliny. Ponadto adaptacja ta daje przewagę w walce na polach blueleaf.", // Blueleaf
			"Adaptacja do hushrooms poprawia wykorzystanie pożywienia z rośliny. Ponadto adaptacja ta daje przewagę w walce na polach hushrooms.", // Hushrooms
			"Adaptacja do stinkballs poprawia wykorzystanie pożywienia z rośliny. Ponadto adaptacja ta daje przewagę w walce na polach stinkballs.", // Stinkballs
			"Adaptacja do snakeroots poprawia wykorzystanie pożywienia z rośliny. Ponadto adaptacja ta daje przewagę w walce na polach snakeroots.", // Snakeroot
			"Adaptacja do firegrass poprawia wykorzystanie pożywienia z rośliny. Ponadto adaptacja ta daje przewagę w walce na polach firegrass.", // Firegrass
			"Wskaźnik rozrodczości zwiększa efekty kopulacji i jedzenia, co daje więcej jednostek na mapie świata.", // Reproduction
			"Siła ataku zwiększa szanse agresora w walce na mapie świata.", // Attack
			"Siła obrony zwiększa szanse obrońcy w walce na mapie świata. Ponadto zwiększa prawdopodobieństwo wygranej z drapieżnikami.", // Defense
			"Kamuflaż zwiększa prawdopodobieństwo zgubienia śladu przez drapieżniki i zapobiega ich pościgowi.", // Camouflage
			"Szybkość daje więcej punktów ruchu na mapie świata. Ponadto szybkość zwiększa prawdopodobieństwo zgubienia śladu przez drapieżniki o niewielką wartość.", // Speed
			"Percepcja zwiększa zasięg mini mapy podczas przetrwania.", // Perception
			"Inteligencja zwiększa większość innych cech w niewielkim stopniu." // Intelligence
		]
	},
	VI: {
		"title": "Q-POP",
		"subtitle": "Tiến hoá trong không gian",
		"next": "Tiếp tục",
		"yes": "Có",
		"no": "Không",
		"turn": "Lượt",
		"close": "Đóng",
		"load_game": "Tải game lưu",
		"save_game": "Lưu game",
		"start_game": "bắt đầu game",
		"loading": "đang tải",
		"load": "tải",
		"player": "Người chơi {num}",
		"species": ["Purplus", "Kiwiopteryx", "Pesciodyphus", "Isnobug", "Amorph", "Chuckberry"],
		"iq": "IQ",
		"iqs": ["Charles Darwin", "Phụ tá Darwin", "Dì của Darwin", "Chó của Darwin"],
		"popup_title": "Dịch Vụ Bảo Mật Q-POP",
		"catastrophe": "Thảm họa",
		"turns": ["Ngắn (5 lượt)", "Vừa (10 lượt)", "Dài (20 lượt)", "Đến cùng"],
		"turn_finished": "Bạn đã thực sự hoàn thành lượt của mình chưa?",
		"dead": "Xin lỗi, nhưng bạn đã trở thành lịch sử!\nLoài của bạn đã tuyệt chủng...",
		"last_turn": "Gong! Lượt cuối cùng bắt đầu!",
		"who_plays": "Ai sẽ chơi?\nBạn chưa chọn người chơi!",
		"continue_alone": "Bạn có muốn tiếp tục một mình?",
		"where_to_live": "Bạn muốn sống ở đâu? Bạn chưa đặt loài của mình lên bản đồ!",
		"suicide": "Bạn có thực sự muốn giết cá thể này không?",
		"game_over": "KẾT THÚC RỒI!!\nTất cả người chơi đã chết, game kết thúc!",
		"evo_score": "Điểm Tiến Hoá",
		"traits": ["Thích nghi với Rangones", "Thích nghi với Lá Xanh", "Thích nghi với Nấm", "Thích nghi với Quả Hôi", "Thích nghi với Rễ Rắn", "Thích nghi với Cỏ Lửa", "Tỉ lệ Sinh sản", "Sức mạnh Tấn công", "Sức mạnh Phòng thủ", "Ngụy trang", "Tốc độ", "Cảm nhận", "Trí tuệ"],
		"transition_mutations": "Quái vật và Đột biến",
		"transition_survival": "Ăn và bị ăn",
		"transition_world": "Cuộc Chiến của Các Loài",
		"upload_description": "Tại đây, bạn có thể tải lên file game gốc hoặc đã tải về.",
		"upload": "Tải lên file qpp",
		"not_a_savegame": "Tệp không phải là game lưu Q-Pop hợp lệ.",
		"no_local_saves": "Không tìm thấy game lưu trong trình duyệt",
		"really_restart": "Bạn có thực sự muốn khởi động lại game không?",
		"sound_disabled": "Âm thanh đã bị tắt. Có vẻ như trình duyệt của bạn không thể phát âm thanh.",
		"information": "Trò chơi này là phiên bản làm lại của game Q-Pop gốc, phát hành ở Đức năm 1995 bởi von Wendt Konzept GmbH. Phiên bản làm lại này cố gắng sát với game gốc nhất có thể với một số tính năng tiện lợi thêm vào. Nó có thể chạy trên tất cả các trình duyệt hiện đại có Javascript được kích hoạt. Mã nguồn có sẵn miễn phí trên Github.",
		"credits_original": [
			["Nhà phát hành và phát triển", ["von Wendt Konzept GmbH"]],
			["Thiết kế game", ["Karl-L. von Wendt"]],
			["Lập trình", ["Karl-L. von Wendt", "Lars Hammer"]],
			["Đồ hoạ", ["Stefan Beyer"]],
			["Âm nhạc", ["Karl-L. von Wendt", "Lars Hammer"]]
		],
		"credits_remake": [
			["Lập trình", ["Mathias Bockwoldt"]],
			["Kỹ sư đảo ngược", ["Mathias Bockwoldt", "Christian Klamt"]],
			["Đồ hoạ mới", ["Eike Strathmann"]],
			["Dịch sang tiếng Việt", ["Mathias Bockwoldt (với ChatGPT)"]]
		],
		"options_music": "Âm nhạc",
		"options_sound": "Âm thanh",
		"options_lang": "Ngôn ngữ",
		"options_this_lang": "VI Tiếng Việt",
		"options_auto_continue": "Tự động tiếp tục sau khi AI đặt trên bản đồ thế giới",
		"options_click_hold": "Nhấn và giữ để đặt hoặc gỡ đơn vị khỏi bản đồ thế giới",
		"options_plants": "Hiển thị phân bố cây trên màn hình đột biến",
		"options_predators": "Hiển thị biểu tượng kẻ săn mồi bị đánh bại trong chế độ sinh tồn",
		"options_tutorial": "Hiển thị hướng dẫn trò chơi (tắt và bật lại để đặt lại)",
		"options_ai_speed": "Tốc độ AI trên bản đồ thế giới",
		"options_ai_speeds": ["cực kỳ chậm", "rất chậm", "chậm", "nhanh", "tức thì"],
		"options_transition": "Thời lượng màn hình chuyển tiếp",
		"options_restart": "Khởi động lại game",
		"tutorial_title": "Hướng Dẫn",
		"tutorial_abort": "Hủy bỏ",
		"tutorial": {
			"welcome": "Chào mừng đến với Q-Pop! Hướng dẫn này sẽ giúp bạn bắt đầu. Để biết thêm chi tiết, hãy xem hướng dẫn trong phần mô tả bên dưới trò chơi. Bạn có thể dừng hướng dẫn bất kỳ lúc nào bằng cách nhấn nút Hủy bỏ.",
			"change_language": "Bạn có thể thay đổi ngôn ngữ và các tùy chọn khác bằng các nút ở trên đây.",
			"player_select": "Chọn loài mà bạn và máy tính sẽ chơi. Nhấp vào đầu hoặc máy tính để chọn loại người chơi. Ngoài ra, chọn mức độ khó (mức IQ) cho từng loài.",
			"next": "Bạn luôn có thể tiếp tục ở đây hoặc nhấn Enter.",
			"turns": "Chọn độ dài trò chơi bạn muốn. Ban đầu, năm vòng có thể là đủ.",
			"wm_units": "Đặt đơn vị của bạn lên bản đồ thế giới. Sau đơn vị đầu tiên, bạn chỉ có thể đặt đơn vị cạnh nhau. Bạn không thể đặt đơn vị lên núi hoặc nước. Vì vậy, hãy cẩn thận để không tự nhốt mình gần bờ biển hoặc trong núi. Ban đầu, nên đặt hầu hết đơn vị lên cùng một loại cây.",
			"wm_shadows": "Bạn có thể lấy bao nhiêu đơn vị tùy theo số bóng bạn có. Bằng cách này, bạn có thể di chuyển đơn vị trên bản đồ thế giới. Bạn có thể cải thiện đặc tính tốc độ trong màn hình đột biến để có thêm bóng. Từ lượt này, bạn có thể chiến đấu với các đơn vị kề cận của loài khác nếu bạn còn đơn vị.",
			"wm_rightclick": "Để xem các đơn vị của bạn đang ở trên loại cây nào, bạn có thể nhấp chuột phải vào đơn vị để xem cây phía dưới. Hoặc bạn có thể nhấp vào avatar dưới lịch để làm tất cả các đơn vị trong suốt.",
			"mutation_start": "Phân phối điểm tiến hóa để cải thiện đặc tính của loài bạn. Ban đầu, bạn có 100 điểm tiến hóa nhưng sau đó, số lượng sẽ phụ thuộc vào thành công của bạn trong trò chơi. Các vòng tròn bên phải hiển thị cây mà loài của bạn chiếm giữ trên bản đồ thế giới. Bạn có thể nhấp vào dấu cộng hoặc trừ để điều chỉnh nhỏ hoặc nhấp trực tiếp vào thanh để điều chỉnh lớn.",
			"mutation_plant": "Ban đầu, thích nghi với cây bạn chiếm giữ nhiều nhất nên đạt ít nhất 50%. Nhấp chuột phải vào bất kỳ đặc tính nào để tìm hiểu thêm về nó.",
			"survival_start": "Trong phần này của trò chơi, bạn sẽ đóng vai một cá thể của loài bạn trong một môi trường được tạo ra dựa trên các vị trí bạn chiếm giữ trên bản đồ thế giới. Di chuyển bằng cách nhấp vào bản đồ sinh tồn hoặc sử dụng các phím mũi tên hoặc WASD. Bạn có thể ăn bằng cách nhấp vào cá thể hoặc nhấn phím cách. Nếu bạn rơi vào tình huống vô vọng, bạn có thể nhấp chuột phải vào cá thể hoặc nhấn phím thoát để giết nó và bắt đầu ở vị trí mới.",
			"survival_goals": "Cố gắng ăn càng nhiều cây càng tốt. Cây mà loài của bạn thích nghi sẽ cung cấp nhiều dinh dưỡng hơn. Bạn nên lấp đầy ít nhất một thanh thực phẩm. Ngoài ra, bạn nên cố gắng sinh sản bằng cách đi đến gần một con cái. Cuối cùng, hãy cố gắng tránh kẻ săn mồi.",
			"survival_time": "Bạn có một số bước di chuyển và thời gian giới hạn cho mỗi bước. Nếu bạn chết, bạn sẽ tiếp tục với cá thể khác, nhưng mỗi lần chết sẽ ảnh hưởng đến sự phân bố của loài bạn trên bản đồ thế giới.",
			"survival_radar": "Sử dụng giác quan của loài bạn để thấy các mảng thức ăn hấp dẫn, bạn tình, các loài ăn cỏ khác và kẻ săn mồi. Bạn có thể tăng phạm vi của giác quan bằng các đột biến.",
			"catastrophe": "Thảm họa xảy ra mỗi lượt. Chúng có thể thay đổi nhiều khía cạnh của thế giới. Bạn nên kiểm tra xem đơn vị của mình vẫn chiếm giữ cây như trước không.",
			"catastrophe0": "Trục hành tinh đã thay đổi, đưa lục địa đến gần xích đạo. Kết quả là nhiệt độ trung bình tăng, mực nước biển giảm và lượng mưa ít hơn.",
			"catastrophe1": "Thay đổi trong vòng quay của hành tinh khiến khí hậu lạnh hơn và mưa nhiều hơn.",
			"catastrophe2": "Một thiên thạch lớn đã đâm vào hành tinh. Khu vực xung quanh bị tàn phá. Hàng triệu tấn cát và bụi bị đẩy vào tầng bình lưu, làm lạnh khí hậu. Các dải băng ở cực giữ lại nhiều nước hơn, dẫn đến mực nước biển giảm.",
			"catastrophe3": "Một căn bệnh mới, bí ẩn xuất hiện trong một khu vực cụ thể của lục địa, ảnh hưởng đến tất cả các loài trong khu vực đó. Mỗi cá thể trong khu vực có căn bệnh đều có một tỷ lệ sống sót nhất định.",
			"catastrophe4": "Các vụ phun trào núi lửa lớn phá hủy tất cả động vật sống ở các ô liền kề ngay lập tức.",
			"catastrophe5": "Khí hậu toàn cầu đã ấm lên. Kết quả là các dải băng ở cực tan chảy, mực nước biển tăng đột ngột và làm ngập các vùng ven biển thấp.",
			"catastrophe6": "Một trận động đất mạnh đã thay đổi toàn bộ bề mặt hành tinh. Hồ có thể biến thành núi và ngược lại.",
			"catastrophe7": "Con người đã hạ cánh trên hành tinh! Trong nỗ lực không ngừng nghỉ để giúp đỡ thiên nhiên đang bị đe dọa, họ xây dựng một trạm nghiên cứu trên hành tinh và săn bắt động vật thí nghiệm để \"cứu chúng khỏi tuyệt chủng\". Con người cư xử như loài ăn thịt, nhưng khó thoát hơn kẻ thù tự nhiên.",
			"catastrophe8": "Tăng cường bức xạ vũ trụ làm thay đổi tất cả các loài thông qua đột biến. Kết quả là các đặc tính của mỗi loài thay đổi mạnh mẽ.",
			"ranking": "Tại đây, bạn có thể xem xếp hạng của mình trên thế giới. Đầu tiên là số lượng cá thể trên bản đồ thế giới. Thứ hai là số điểm tiến hóa có sẵn trong vòng này. Điều này phụ thuộc vào số lượng cá thể. Thứ ba là điểm chiến thắng, tất cả các điểm tiến hóa đã sử dụng và có sẵn cộng lại.",
			"ranking_save": "Trò chơi sẽ tự động lưu trong trình duyệt. Nếu bạn muốn tải xuống game lưu, bạn có thể làm điều đó ở đây.",
			"ranking_no_save": "Nếu bạn muốn tải xuống game lưu, bạn có thể làm điều đó ở đây. Trò chơi sẽ không được lưu tự động.",
			"save": "Game lưu vừa được cung cấp có thể được tải lại trong trò chơi này. Nhưng nó cũng tương thích với game gốc!"
		},
		"trait_hints": [
			"Thích nghi với rangones cải thiện khả năng sử dụng thực phẩm từ cây. Ngoài ra, thích nghi còn là lợi thế trong các trận chiến trên bản đồ thế giới trên các ô rangone.",
			"Thích nghi với lá xanh cải thiện khả năng sử dụng thực phẩm từ cây. Ngoài ra, thích nghi còn là lợi thế trong các trận chiến trên bản đồ thế giới trên các ô lá xanh.",
			"Thích nghi với nấm cải thiện khả năng sử dụng thực phẩm từ cây. Ngoài ra, thích nghi còn là lợi thế trong các trận chiến trên bản đồ thế giới trên các ô nấm.",
			"Thích nghi với quả hôi cải thiện khả năng sử dụng thực phẩm từ cây. Ngoài ra, thích nghi còn là lợi thế trong các trận chiến trên bản đồ thế giới trên các ô quả hôi.",
			"Thích nghi với rễ rắn cải thiện khả năng sử dụng thực phẩm từ cây. Ngoài ra, thích nghi còn là lợi thế trong các trận chiến trên bản đồ thế giới trên các ô rễ rắn.",
			"Thích nghi với cỏ lửa cải thiện khả năng sử dụng thực phẩm từ cây. Ngoài ra, thích nghi còn là lợi thế trong các trận chiến trên bản đồ thế giới trên các ô cỏ lửa.",
			"Tỉ lệ sinh sản tăng cường hiệu quả của việc giao phối và ăn uống, tạo ra nhiều đơn vị hơn cho bản đồ thế giới.",
			"Sức mạnh tấn công tăng cơ hội cho kẻ tấn công trong các trận chiến trên bản đồ thế giới.",
			"Sức mạnh phòng thủ tăng cơ hội cho người phòng thủ trong các trận chiến trên bản đồ thế giới. Hơn nữa, nó tăng khả năng chiến thắng trước kẻ săn mồi.",
			"Ngụy trang tăng khả năng kẻ săn mồi mất dấu vết và không theo dõi người chơi.",
			"Tốc độ tăng điểm di chuyển trên bản đồ thế giới. Ngoài ra, tốc độ tăng khả năng kẻ săn mồi mất dấu vết một ít.",
			"Cảm nhận cải thiện phạm vi của bản đồ mini trong chế độ sinh tồn.",
			"Trí tuệ cải thiện hầu hết các đặc tính khác một chút."
		]
	},	
};

export const languageKeys = Object.keys(i18n).sort();
