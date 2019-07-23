const anims_players = [
	{   // Purplus
		still: {
			offset: [0, 0],
			frames: [[0, 0]],
		},
		north: {
			offset: [128, 64],
			frames: [[0, 0], [64, 0], [128, 0], [64, 0]],
		},
		south: {
			offset: [64, 0],
			frames: [[64, 0], [0, 0], [128, 0], [0, 0]],
		},
		east: {
			offset: [0, 0],
			frames: [[512, 0], [576, 0], [0, 64], [64, 64]],
		},
		west: {
			offset: [256, 0],
			frames: [[0, 0], [64, 0], [128, 0], [192, 0]],
		},
		/*feeding: {
			offset: [, ],
			frames: [[, ]], // 11232323
		},
		power_food: {
			offset: [, ],
			frames: [[, ]], //
		},
		poisoned: {
			offset: [, ],
			frames: [[, ]], // 123232323232
		},*/
		female: {
			offset: [0, 256],
			frames: [[0, 0], [0, 0], [64, 0], [64, 0], [128, 0], [128, 0], [192, 0], [192, 0]],
		},
		offspring: {
			offset: [256, 256],
			frames: [[0, 0], [0, 0], [64, 0], [64, 0], [0, 0], [0, 0], [64, 0], [64, 0], [0, 0], [0, 0], [128, 0], [128, 0], [0, 0], [0, 0], [128, 0], [128, 0]],
		},
		/*quicksand: {
			offset: [, ],
			frames: [[, ]],
		},
		zapped: {
			offset: [, ],
			frames: [[, ]],
		},
		winner: {
			offset: [, ],
			frames: [[, ]], // 1212121212121212
		},*/
		enem_still: {
			offset: [0, 0],
			frames: [[0, 0]],
		},
		enem_boasting: {
			offset: [320, 0],
			frames: [[0, 0], [0, 64]],
		},
		enem_defeated: {
			offset: [64, 0],
			frames: [[0, 0], [64, 0], [128, 0], [192, 0]],
		},
	},
	/*{   // Kiwiopteryx
		still: {
			offset: [0, 0],
			frames: [[0, 0]],
		},
		north: {
			offset: [, ],
			frames: [[, ]],
		},
		south: {
			offset: [, ],
			frames: [[, ]],
		},
		east: {
			offset: [, ],
			frames: [[, ]],
		},
		west: {
			offset: [, ],
			frames: [[, ]],
		},
		feeding: {
			offset: [, ],
			frames: [[, ]],
		},
		power_food: {
			offset: [, ],
			frames: [[, ]],
		},
		poisoned: {
			offset: [, ],
			frames: [[, ]],
		},
		female: {
			offset: [, ],
			frames: [[, ]],
		},
		offspring: {
			offset: [, ],
			frames: [[, ]],
		},
		quicksand: {
			offset: [, ],
			frames: [[, ]],
		},
		zapped: {
			offset: [, ],
			frames: [[, ]],
		},
		winner: {
			offset: [, ],
			frames: [[, ]],
		},
		enem_still: {
			offset: [0, 64],
			frames: [[0, 0]],
		},
		enem_boasting: {
			offset: [320, 64],
			frames: [[0, 0], [0, 64]],
		},
		enem_defeated: {
			offset: [64, 64],
			frames: [[0, 0], [64, 0], [128, 0], [192, 0]],
		},
	},
	{   // Pesciodyphus
		still: {
			offset: [0, 0],
			frames: [[0, 0]],
		},
		north: {
			offset: [, ],
			frames: [[, ]],
		},
		south: {
			offset: [, ],
			frames: [[, ]],
		},
		east: {
			offset: [, ],
			frames: [[, ]],
		},
		west: {
			offset: [, ],
			frames: [[, ]],
		},
		feeding: {
			offset: [, ],
			frames: [[, ]],
		},
		power_food: {
			offset: [, ],
			frames: [[, ]],
		},
		poisoned: {
			offset: [, ],
			frames: [[, ]],
		},
		female: {
			offset: [, ],
			frames: [[, ]],
		},
		offspring: {
			offset: [, ],
			frames: [[, ]],
		},
		quicksand: {
			offset: [, ],
			frames: [[, ]],
		},
		zapped: {
			offset: [, ],
			frames: [[, ]],
		},
		winner: {
			offset: [, ],
			frames: [[, ]],
		},
		enem_still: {
			offset: [0, 128],
			frames: [[0, 0]],
		},
		enem_boasting: {
			offset: [320, 128],
			frames: [[0, 0], [0, 64]],
		},
		enem_defeated: {
			offset: [64, 128],
			frames: [[0, 0], [64, 0], [128, 0], [192, 0]],
		},
	},
	{   // Isnobug
		still: {
			offset: [0, 0],
			frames: [[0, 0]],
		},
		north: {
			offset: [, ],
			frames: [[, ]],
		},
		south: {
			offset: [, ],
			frames: [[, ]],
		},
		east: {
			offset: [, ],
			frames: [[, ]],
		},
		west: {
			offset: [, ],
			frames: [[, ]],
		},
		feeding: {
			offset: [, ],
			frames: [[, ]],
		},
		power_food: {
			offset: [, ],
			frames: [[, ]],
		},
		poisoned: {
			offset: [, ],
			frames: [[, ]],
		},
		female: {
			offset: [, ],
			frames: [[, ]],
		},
		offspring: {
			offset: [, ],
			frames: [[, ]],
		},
		quicksand: {
			offset: [, ],
			frames: [[, ]],
		},
		zapped: {
			offset: [, ],
			frames: [[, ]],
		},
		winner: {
			offset: [, ],
			frames: [[, ]],
		},
		enem_still: {
			offset: [0, 192],
			frames: [[0, 0]],
		},
		enem_boasting: {
			offset: [320, 192],
			frames: [[0, 0], [0, 64]],
		},
		enem_defeated: {
			offset: [64, 192],
			frames: [[0, 0], [64, 0], [128, 0], [192, 0]],
		},
	},
	{   // Amorph
		still: {
			offset: [0, 0],
			frames: [[0, 0]],
		},
		north: {
			offset: [, ],
			frames: [[, ]],
		},
		south: {
			offset: [, ],
			frames: [[, ]],
		},
		east: {
			offset: [, ],
			frames: [[, ]],
		},
		west: {
			offset: [, ],
			frames: [[, ]],
		},
		feeding: {
			offset: [, ],
			frames: [[, ]],
		},
		power_food: {
			offset: [, ],
			frames: [[, ]],
		},
		poisoned: {
			offset: [, ],
			frames: [[, ]],
		},
		female: {
			offset: [, ],
			frames: [[, ]],
		},
		offspring: {
			offset: [, ],
			frames: [[, ]],
		},
		quicksand: {
			offset: [, ],
			frames: [[, ]],
		},
		zapped: {
			offset: [, ],
			frames: [[, ]],
		},
		winner: {
			offset: [, ],
			frames: [[, ]],
		},
		enem_boasting: {
			offset: [0, 256],
			frames: [[0, 0]],
		},
		enem_still: {
			offset: [320, 256],
			frames: [[0, 0], [0, 64]],
		},
		enem_defeated: {
			offset: [64, 256],
			frames: [[0, 0], [64, 0], [128, 0], [192, 0]],
		},
	},
	{   // Chuck Berry
		still: {
			offset: [0, 0],
			frames: [[0, 0]],
		},
		north: {
			offset: [, ],
			frames: [[, ]],
		},
		south: {
			offset: [, ],
			frames: [[, ]],
		},
		east: {
			offset: [, ],
			frames: [[, ]],
		},
		west: {
			offset: [, ],
			frames: [[, ]],
		},
		feeding: {
			offset: [, ],
			frames: [[, ]],
		},
		power_food: {
			offset: [, ],
			frames: [[, ]],
		},
		poisoned: {
			offset: [, ],
			frames: [[, ]],
		},
		female: {
			offset: [, ],
			frames: [[, ]],
		},
		offspring: {
			offset: [, ],
			frames: [[, ]],
		},
		quicksand: {
			offset: [, ],
			frames: [[, ]],
		},
		zapped: {
			offset: [, ],
			frames: [[, ]],
		},
		winner: {
			offset: [, ],
			frames: [[, ]],
		},
		enem_still: {
			offset: [0, 320],
			frames: [[0, 0]],
		},
		enem_boasting: {
			offset: [320, 320],
			frames: [[0, 0], [0, 64]],
		},
		enem_defeated: {
			offset: [64, 320],
			frames: [[0, 0], [64, 0], [128, 0], [192, 0]],
		},
	},*/
];

const anims_predators = [
	{   // Dino
		still: {
			offset: [0, 0],
			frames: [[0, 0]],
		},
		north: {
			offset: [0, 0],
			frames: [[576, 0], [0, 64], [64, 64], [128, 64]],
		},
		south: {
			offset: [192, 64],
			frames: [[0, 0], [64, 0], [128, 0], [192, 0]],
		},
		east: {
			offset: [64, 0],
			frames: [[0, 0], [64, 0], [128, 0], [192, 0]],
		},
		west: {
			offset: [320, 0],
			frames: [[0, 0], [64, 0], [128, 0], [192, 0]],
		},
		attack: {
			offset: [0, 0],
			frames: [[128, 64], [0, 192], [64, 192], [128, 192]],  // N E S W
		},
		winner: {
			offset: [0, 64],
			frames: [[448, 0], [512, 0], [576, 0], [0, 64], [576, 0]],
		},
		defeated: [
			{  // Stars
				offset: [64, 128],
				frames: [[0, 0], [0, 64], [0, 128], [0, 192]],
			},
			{  // Crying
				offset: [320, 128],
				frames: [[0, 0], [0, 64], [0, 128], [0, 192]],
			},
			{  // Skeleton
				offset: [576, 128],
				frames: [[0, 0]],
			},
		],
	},
	/*{   // Mushroom
		still: {
			offset: [0, 0],
			frames: [[0, 0]],
		},
		north: {
			offset: [, ],
			frames: [[, ]],
		},
		south: {
			offset: [, ],
			frames: [[, ]],
		},
		east: {
			offset: [, ],
			frames: [[, ]],
		},
		west: {
			offset: [, ],
			frames: [[, ]],
		},
		attack: {
			offset: [, ],
			frames: [[, ]],
		},
		winner: {
			offset: [, ],
			frames: [[, ]],
		},
		defeated: [
			{
				offset: [, ],
				frames: [[, ]],
			},
			{
				offset: [, ],
				frames: [[, ]],
			},
			{
				offset: [, ],
				frames: [[, ]],
			},
		],
	},
	{   // Human
		still: {
			offset: [0, 0],
			frames: [[0, 0]],
		},
		north: {
			offset: [, ],
			frames: [[, ]],
		},
		south: {
			offset: [, ],
			frames: [[, ]],
		},
		east: {
			offset: [, ],
			frames: [[, ]],
		},
		west: {
			offset: [, ],
			frames: [[, ]],
		},
		attack: {
			offset: [, ],
			frames: [[, ]],
		},
		winner: {
			offset: [, ],
			frames: [[, ]],
		},
		defeated: [
			{
				offset: [, ],
				frames: [[, ]],
			},
			{
				offset: [, ],
				frames: [[, ]],
			},
			{
				offset: [, ],
				frames: [[, ]],
			},
		],
	},*/
];
