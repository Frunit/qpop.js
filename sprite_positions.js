const anims_players = [
	{   // Purplus
		still: {
			soffset: [0, 0],
			frames: [[0, 0]],
		},
		north: {
			soffset: [128, 64],
			frames: [[0, 0], [64, 0], [128, 0], [64, 0]],
		},
		south: {
			soffset: [64, 0],
			frames: [[64, 0], [0, 0], [128, 0], [0, 0]],
		},
		east: {
			soffset: [0, 0],
			frames: [[512, 0], [576, 0], [0, 64], [64, 64]],
		},
		west: {
			soffset: [256, 0],
			frames: [[0, 0], [64, 0], [128, 0], [192, 0]],
		},
		/*feeding: {
			soffset: [, ],
			frames: [[, ]], // 11232323
		},
		power_food: {
			soffset: [, ],
			frames: [[, ]], //
		},
		poisoned: {
			soffset: [, ],
			frames: [[, ]], // 123232323232
		},*/
		female: {
			soffset: [0, 256],
			frames: [[0, 0], [0, 0], [64, 0], [64, 0], [128, 0], [128, 0], [192, 0], [192, 0]],
		},
		offspring: {
			soffset: [256, 256],
			frames: [[0, 0], [0, 0], [64, 0], [64, 0], [0, 0], [0, 0], [64, 0], [64, 0], [0, 0], [0, 0], [128, 0], [128, 0], [0, 0], [0, 0], [128, 0], [128, 0]],
		},
		/*quicksand: {
			soffset: [, ],
			frames: [[, ]],
		},
		zapped: {
			soffset: [, ],
			frames: [[, ]],
		},
		winner: {
			soffset: [, ],
			frames: [[, ]], // 1212121212121212
		},*/
		enem_still: {
			soffset: [0, 0],
			frames: [[0, 0]],
		},
		enem_boasting: {
			soffset: [320, 0],
			frames: [[0, 0], [0, 64]],
		},
		enem_defeated: {
			soffset: [64, 0],
			frames: [[0, 0], [64, 0], [128, 0], [192, 0]],
		},
	},
	/*{   // Kiwiopteryx
		still: {
			soffset: [0, 0],
			frames: [[0, 0]],
		},
		north: {
			soffset: [, ],
			frames: [[, ]],
		},
		south: {
			soffset: [, ],
			frames: [[, ]],
		},
		east: {
			soffset: [, ],
			frames: [[, ]],
		},
		west: {
			soffset: [, ],
			frames: [[, ]],
		},
		feeding: {
			soffset: [, ],
			frames: [[, ]],
		},
		power_food: {
			soffset: [, ],
			frames: [[, ]],
		},
		poisoned: {
			soffset: [, ],
			frames: [[, ]],
		},
		female: {
			soffset: [, ],
			frames: [[, ]],
		},
		offspring: {
			soffset: [, ],
			frames: [[, ]],
		},
		quicksand: {
			soffset: [, ],
			frames: [[, ]],
		},
		zapped: {
			soffset: [, ],
			frames: [[, ]],
		},
		winner: {
			soffset: [, ],
			frames: [[, ]],
		},
		enem_still: {
			soffset: [0, 64],
			frames: [[0, 0]],
		},
		enem_boasting: {
			soffset: [320, 64],
			frames: [[0, 0], [0, 64]],
		},
		enem_defeated: {
			soffset: [64, 64],
			frames: [[0, 0], [64, 0], [128, 0], [192, 0]],
		},
	},
	{   // Pesciodyphus
		still: {
			soffset: [0, 0],
			frames: [[0, 0]],
		},
		north: {
			soffset: [, ],
			frames: [[, ]],
		},
		south: {
			soffset: [, ],
			frames: [[, ]],
		},
		east: {
			soffset: [, ],
			frames: [[, ]],
		},
		west: {
			soffset: [, ],
			frames: [[, ]],
		},
		feeding: {
			soffset: [, ],
			frames: [[, ]],
		},
		power_food: {
			soffset: [, ],
			frames: [[, ]],
		},
		poisoned: {
			soffset: [, ],
			frames: [[, ]],
		},
		female: {
			soffset: [, ],
			frames: [[, ]],
		},
		offspring: {
			soffset: [, ],
			frames: [[, ]],
		},
		quicksand: {
			soffset: [, ],
			frames: [[, ]],
		},
		zapped: {
			soffset: [, ],
			frames: [[, ]],
		},
		winner: {
			soffset: [, ],
			frames: [[, ]],
		},
		enem_still: {
			soffset: [0, 128],
			frames: [[0, 0]],
		},
		enem_boasting: {
			soffset: [320, 128],
			frames: [[0, 0], [0, 64]],
		},
		enem_defeated: {
			soffset: [64, 128],
			frames: [[0, 0], [64, 0], [128, 0], [192, 0]],
		},
	},
	{   // Isnobug
		still: {
			soffset: [0, 0],
			frames: [[0, 0]],
		},
		north: {
			soffset: [, ],
			frames: [[, ]],
		},
		south: {
			soffset: [, ],
			frames: [[, ]],
		},
		east: {
			soffset: [, ],
			frames: [[, ]],
		},
		west: {
			soffset: [, ],
			frames: [[, ]],
		},
		feeding: {
			soffset: [, ],
			frames: [[, ]],
		},
		power_food: {
			soffset: [, ],
			frames: [[, ]],
		},
		poisoned: {
			soffset: [, ],
			frames: [[, ]],
		},
		female: {
			soffset: [, ],
			frames: [[, ]],
		},
		offspring: {
			soffset: [, ],
			frames: [[, ]],
		},
		quicksand: {
			soffset: [, ],
			frames: [[, ]],
		},
		zapped: {
			soffset: [, ],
			frames: [[, ]],
		},
		winner: {
			soffset: [, ],
			frames: [[, ]],
		},
		enem_still: {
			soffset: [0, 192],
			frames: [[0, 0]],
		},
		enem_boasting: {
			soffset: [320, 192],
			frames: [[0, 0], [0, 64]],
		},
		enem_defeated: {
			soffset: [64, 192],
			frames: [[0, 0], [64, 0], [128, 0], [192, 0]],
		},
	},
	{   // Amorph
		still: {
			soffset: [0, 0],
			frames: [[0, 0]],
		},
		north: {
			soffset: [, ],
			frames: [[, ]],
		},
		south: {
			soffset: [, ],
			frames: [[, ]],
		},
		east: {
			soffset: [, ],
			frames: [[, ]],
		},
		west: {
			soffset: [, ],
			frames: [[, ]],
		},
		feeding: {
			soffset: [, ],
			frames: [[, ]],
		},
		power_food: {
			soffset: [, ],
			frames: [[, ]],
		},
		poisoned: {
			soffset: [, ],
			frames: [[, ]],
		},
		female: {
			soffset: [, ],
			frames: [[, ]],
		},
		offspring: {
			soffset: [, ],
			frames: [[, ]],
		},
		quicksand: {
			soffset: [, ],
			frames: [[, ]],
		},
		zapped: {
			soffset: [, ],
			frames: [[, ]],
		},
		winner: {
			soffset: [, ],
			frames: [[, ]],
		},
		enem_boasting: {
			soffset: [0, 256],
			frames: [[0, 0]],
		},
		enem_still: {
			soffset: [320, 256],
			frames: [[0, 0], [0, 64]],
		},
		enem_defeated: {
			soffset: [64, 256],
			frames: [[0, 0], [64, 0], [128, 0], [192, 0]],
		},
	},
	{   // Chuck Berry
		still: {
			soffset: [0, 0],
			frames: [[0, 0]],
		},
		north: {
			soffset: [, ],
			frames: [[, ]],
		},
		south: {
			soffset: [, ],
			frames: [[, ]],
		},
		east: {
			soffset: [, ],
			frames: [[, ]],
		},
		west: {
			soffset: [, ],
			frames: [[, ]],
		},
		feeding: {
			soffset: [, ],
			frames: [[, ]],
		},
		power_food: {
			soffset: [, ],
			frames: [[, ]],
		},
		poisoned: {
			soffset: [, ],
			frames: [[, ]],
		},
		female: {
			soffset: [, ],
			frames: [[, ]],
		},
		offspring: {
			soffset: [, ],
			frames: [[, ]],
		},
		quicksand: {
			soffset: [, ],
			frames: [[, ]],
		},
		zapped: {
			soffset: [, ],
			frames: [[, ]],
		},
		winner: {
			soffset: [, ],
			frames: [[, ]],
		},
		enem_still: {
			soffset: [0, 320],
			frames: [[0, 0]],
		},
		enem_boasting: {
			soffset: [320, 320],
			frames: [[0, 0], [0, 64]],
		},
		enem_defeated: {
			soffset: [64, 320],
			frames: [[0, 0], [64, 0], [128, 0], [192, 0]],
		},
	},*/
];

const anims_predators = [
	{   // Dino
		still: {
			soffset: [0, 0],
			frames: [[0, 0]],
		},
		north: {
			soffset: [0, 0],
			frames: [[576, 0], [0, 64], [64, 64], [128, 64]],
		},
		south: {
			soffset: [192, 64],
			frames: [[0, 0], [64, 0], [128, 0], [192, 0]],
		},
		east: {
			soffset: [64, 0],
			frames: [[0, 0], [64, 0], [128, 0], [192, 0]],
		},
		west: {
			soffset: [320, 0],
			frames: [[0, 0], [64, 0], [128, 0], [192, 0]],
		},
		attack: {
			soffset: [0, 0],
			frames: [[128, 64], [0, 192], [64, 192], [128, 192]],  // N E S W
		},
		winner: {
			soffset: [0, 64],
			frames: [[448, 0], [512, 0], [576, 0], [0, 64], [576, 0]],
		},
		defeated: [
			{  // Stars
				soffset: [64, 128],
				frames: [[0, 0], [0, 64], [0, 128], [0, 192]],
			},
			{  // Crying
				soffset: [320, 128],
				frames: [[0, 0], [0, 64], [0, 128], [0, 192]],
			},
			{  // Skeleton
				soffset: [576, 128],
				frames: [[0, 0]],
			},
		],
	},
	/*{   // Mushroom
		still: {
			soffset: [0, 0],
			frames: [[0, 0]],
		},
		north: {
			soffset: [, ],
			frames: [[, ]],
		},
		south: {
			soffset: [, ],
			frames: [[, ]],
		},
		east: {
			soffset: [, ],
			frames: [[, ]],
		},
		west: {
			soffset: [, ],
			frames: [[, ]],
		},
		attack: {
			soffset: [, ],
			frames: [[, ]],
		},
		winner: {
			soffset: [, ],
			frames: [[, ]],
		},
		defeated: [
			{
				soffset: [, ],
				frames: [[, ]],
			},
			{
				soffset: [, ],
				frames: [[, ]],
			},
			{
				soffset: [, ],
				frames: [[, ]],
			},
		],
	},
	{   // Human
		still: {
			soffset: [0, 0],
			frames: [[0, 0]],
		},
		north: {
			soffset: [, ],
			frames: [[, ]],
		},
		south: {
			soffset: [, ],
			frames: [[, ]],
		},
		east: {
			soffset: [, ],
			frames: [[, ]],
		},
		west: {
			soffset: [, ],
			frames: [[, ]],
		},
		attack: {
			soffset: [, ],
			frames: [[, ]],
		},
		winner: {
			soffset: [, ],
			frames: [[, ]],
		},
		defeated: [
			{
				soffset: [, ],
				frames: [[, ]],
			},
			{
				soffset: [, ],
				frames: [[, ]],
			},
			{
				soffset: [, ],
				frames: [[, ]],
			},
		],
	},*/
];

const anims_clouds = {
	fight_hor: {
		size: [100, 64],
		offset: [14, 0],
		soffset: [0, 0],
		frames: [[100, 0], [200, 0], [300, 0], [0, 64], [0, 0], [100, 0], [200, 0], [300, 0], [0, 64], [0, 0], [100, 64], [200, 64]], // 234512345167
	},
	fight_vert: {
		size: [64, 100],
		offset: [0, 14],
		soffset: [0, 128],
		frames: [[64, 0], [128, 0], [192, 0], [256, 0], [0, 0], [64, 0], [128, 0], [192, 0], [256, 0], [0, 0], [320, 0], [384, 0]], // 234512345167
	},
	love_hor: {
		size: [100, 64],
		offset: [14, 0],
		soffset: [0, 228],
		frames: [[100, 0], [200, 0], [300, 0], [0, 64], [0, 0], [100, 0], [200, 0], [300, 0], [0, 64], [0, 0], [100, 64], [200, 64]], // 234512345167
	},
	love_vert: {
		size: [64, 100],
		offset: [0, 14],
		soffset: [0, 356],
		frames: [[64, 0], [128, 0], [192, 0], [256, 0], [0, 0], [64, 0], [128, 0], [192, 0], [256, 0], [0, 0], [320, 0], [384, 0]], // 234512345167
	},
};
