import { isIos } from "./Utils"

export const CELL_WIDTH = 250
export const CELL_HEIGHT = 240
export const REELS_COUNT = 6
export const REELS_WIDTH = REELS_COUNT * CELL_WIDTH
export const REELS_HEIGHT = 5 * CELL_HEIGHT
export const WILD_SYMBOL_ID = 9
export const SCATTER_SYMBOL_ID = 10
export const REELS_OFFSETS = [1, 0.5, 0, 0, 0.5, 1]
export const REELS_LENGTHS = [3, 4, 5, 5, 4, 3]
export const SYMBOLS_IDS = [
	0, // EMPTY
	1, // ♣️ CLUBS
	2, // ♥️ HEARTS
	3, // ♦️ DIAMONDS
	4, // ♠️ SPADES
	5, // RUM
	6, // HAT
	7, // PISTOL
	8, // WATCHES
	WILD_SYMBOL_ID, // WILD
	SCATTER_SYMBOL_ID, // SCATTER
]

export const RANDOM_REELS_SYMBOLS_IDS = [
	[1, 2, 3, 4, 5, 6, 7, 8],
	[1, 2, 3, 4, 5, 6, 7, 8],
	[1, 2, 3, 4, 5, 6, 7, 8],
	[1, 2, 3, 4, 5, 6, 7, 8],
	[1, 2, 3, 4, 5, 6, 7, 8],
	[1, 2, 3, 4, 5, 6, 7, 8],
]
export const TURBO_MODE_TIME_SCALE = 1.5
export const REGULAR_SYMBOLS_IDS = [1, 2, 3, 4, 5, 6, 7, 8]
export const POSSIBLE_REELS_SYMBOLS = [
	[0, ...REGULAR_SYMBOLS_IDS, SCATTER_SYMBOL_ID],
	[0, ...REGULAR_SYMBOLS_IDS, WILD_SYMBOL_ID, SCATTER_SYMBOL_ID],
	[0, ...REGULAR_SYMBOLS_IDS, WILD_SYMBOL_ID, SCATTER_SYMBOL_ID],
	[0, ...REGULAR_SYMBOLS_IDS, WILD_SYMBOL_ID, SCATTER_SYMBOL_ID],
	[0, ...REGULAR_SYMBOLS_IDS, WILD_SYMBOL_ID, SCATTER_SYMBOL_ID],
	[0, ...REGULAR_SYMBOLS_IDS, WILD_SYMBOL_ID, SCATTER_SYMBOL_ID],
]

export const WIN_COEFFICIENTS = {
	BIG: 20,
	HUGE: 35,
	MEGA: 50,
}
export const isIOS = isIos()