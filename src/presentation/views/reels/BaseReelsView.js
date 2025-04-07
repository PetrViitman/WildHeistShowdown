import { Container, Graphics, Sprite } from 'pixi.js'
import { SingleReelView } from './SingleReelView'
import { AdaptiveContainer } from '../adaptiveDesign/AdaptiveContainer'
import { Timeline } from '../../timeline/Timeline'
import { generateMatrix, getRandomLoseReels, getRandomSymbolId } from '../../Utils'
import {
	CELL_HEIGHT,
	CELL_WIDTH,
	POSSIBLE_REELS_SYMBOLS,
	REELS_COUNT,
	REELS_HEIGHT,
	REELS_LENGTHS,
	REELS_OFFSETS,
	REELS_WIDTH,
	SCATTER_SYMBOL_ID,
	WILD_SYMBOL_ID
} from '../../Constants'

export class BaseReelsView extends Container {
	contentContainer
	maskedContainer
	reelsContainer
	maskView
	reelsViews = []
	cellsViews = []
	timeline = new Timeline
	highlightTimeline = new Timeline
	infoBarView
	audio
	patchMap

	constructor({
		initialSymbolsIds,
		assets,
		vfxLevel,
		audio
	}) {
		super()

		this.audio = audio
		this.contentContainer = this.addChild(new Container)

		this.initReels({
			initialSymbolsIds,
			assets,
			vfxLevel,
			audio
		})

		this.initMask(assets)
		this.setMasked()
	}

	initReels({
		initialSymbolsIds,
		assets,
		vfxLevel,
		audio
	}) {
		const container = new Container()

		for (let i = 0; i < REELS_COUNT; i++) {
			const reelView = new SingleReelView({
				index: i,
				initialSymbolsIds: initialSymbolsIds[i],
				assets,
				vfxLevel,
				possibleSymbolsIds: POSSIBLE_REELS_SYMBOLS[i],
				audio
			})

			reelView.onCellFallIn = cellIndex => this.onReelPatched(i, cellIndex)
			reelView.onReelStopHit = () => this.onReelStopHit(i)
			reelView.x = i * CELL_WIDTH
			reelView.y = REELS_OFFSETS[i] * CELL_HEIGHT
			this.reelsViews.push(container.addChild(reelView))
			this.cellsViews.push(reelView.cellsViews)
		}
	
		this.reelsContainer = this.contentContainer.addChild(container)
	}

	initMask(assets) {
		const container = this.contentContainer.addChild(new Container)

		this.maskedContainer = container

		//const view = new Sprite(assets.reels_bottom)
		//view.anchor.set(0.5)
		//view.position.set(REELS_WIDTH / 2, REELS_HEIGHT / 2)
		//view.scale.set(2.25)

		// container.mask = view

		// this.maskView = container.addChild(view)
	}

	// API...
	reset() {
		this.timeline
			.wind(0, false)
			.pause()
			.deleteAllAnimations()

		this.reelsViews.forEach((view) => view.reset())
	}

	async preRenderSymbols(symbolsIds = getRandomLoseReels()) {
        await Promise.all(
            this.reelsViews.map((reelView, i) => {
                return reelView.preRenderSymbols(symbolsIds[i]);
            }),
        );

        this.reelsViews.forEach((reelView) =>
            reelView.onPreRendered());
    }

	getCurrentSymbolsIds() {
		const reels = []

		for(let x = 0; x < REELS_COUNT; x++) {
			const reel = []
			for(let y = 0; y < REELS_LENGTHS[x]; y++) {
				reel[y] = this.cellsViews[x][y + 1].currentSymbolId
			}

			reels.push(reel)
		}

		return reels
	}

	getAllCellsWithSymbolId(symbolId) {
		const { reelsViews } = this
		const cellsViews = []

		for(let x = 0; x < reelsViews.length; x++) {
			for(let y = 0; y < REELS_LENGTHS[x]; y++) {
				const cellView = this.cellsViews[x][y + 1]
				if (cellView.currentSymbolId === symbolId)
					cellsViews.push(cellView)
			}
		}

		return cellsViews
	}

	setBrightness({
		key = 1,
		map = new Array(REELS_COUNT).fill(0).map((_, i) => new Array(REELS_LENGTHS[i]).fill(1)),
		brightness = 0.25,
	}) {
		const {cellsViews} = this

		for(let x = 0; x < map.length; x++) {
			cellsViews[x][0].setBrightness(brightness)
					
					
			for(let y = 0; y < map[x].length; y++)
				if(map[x][y] === key) {
					const cellView = cellsViews[x][y + 1]
					cellView.setBrightness(brightness)
				}
		}
	}

	setMasked(isMasked = true) {
		if (isMasked) {
			this.maskedContainer.addChild(this.reelsContainer)
		} else {
			this.contentContainer.addChildAt(this.reelsContainer, 1)
		}
	}

	async presentSpinStart() {
		this.reset()
		this.setMasked()
		/*
		this.timeline
			.deleteAllAnimations()
			.addAnimation({
				duration: 300,
				onStart: () => {
					this.reelsContainer.pivot.set(REELS_WIDTH / 2, REELS_HEIGHT / 2)
					this.reelsContainer.position.set(REELS_WIDTH / 2, REELS_HEIGHT / 2)
				},
				onProgress: progress => {
					

					const scale = 1 - 0.1 * Math.sin(Math.PI * progress)
					this.cellsViews.forEach(reel => reel.forEach(cellView => cellView.scale.y = 1 / scale))

					this.reelsContainer.scale.y = scale
				},
				onFinish: () => {
					this.reelsContainer.pivot.set(0)
					this.reelsContainer.position.set(0)
				}
			})
			.addAnimation({
				delay: 150,
				onDelayFinish: () => {
					this.setMasked()
				}
			})
			.play()
		*/
		
		return Promise.all(
			this.reelsViews.map((view, i) =>
				view.presentSpinStart(i * 200)))        
	}

	async presentSpinStop({
		targetSymbolsIds = getRandomLoseReels(),
		ignoreTension = false
	}) {
		let scattersCount = 0
		let delay = 0
		
		await Promise.all(
			this.reelsViews.map((reel, i) => {
				const isIndependentReel = true
				let isTensionReel = false
			
				if(i && isIndependentReel) {
					if (
						!ignoreTension
						&& scattersCount >= 2
					) {
						isTensionReel = true
						delay += 750
					} else {
						delay += 200
					}
				}

				for(let y = 0; y < targetSymbolsIds[i].length; y++)
					if(targetSymbolsIds[i][y] === SCATTER_SYMBOL_ID)
						scattersCount++

				return reel.presentSpinStop({
					cellsViews: this.cellsViews,
					symbolsIds: targetSymbolsIds[i],
					delay,
					tensionDuration: isTensionReel ? 1500 : undefined
				}) 
			}))
	}

	async presentCascade({
		corruptionMap/* = [
			[0, 1, 0],
			[1, 0, 0, 0],
			[1, 1, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 1, 0],
			[0, 0, 0],
		]*/,
		patchMap,
		/*
		= [
			[1],
			[1],
			[1, 1],
			[],
			[1],
			[],
		],*/
		multiplier = 1
	}) {
		this.setMasked()
		this.patchMap = patchMap
		const currentSymbolsIds = this.getCurrentSymbolsIds()

		// MAPPING GOLDEN FRAME WINS...
		currentSymbolsIds.forEach((reel, x) => reel.forEach((value, y) => {
			if (corruptionMap[x][y] && value < 0) {
				corruptionMap[x][y] = -1
			}
		}))
		// ...MAPPING GOLDEN FRAME WINS

		// MAPPING CASCADE...
		const cascadeMap = generateMatrix()
		for (let x = 0; x < REELS_COUNT; x++) {
			let distance = 0
			for (let y = REELS_LENGTHS[x] - 1; y >= 0; y--) {    
				if(corruptionMap[x][y] > 0) {
					distance++
					cascadeMap[x][y] = 0
				} else {
					cascadeMap[x][y + distance] = distance
				}
			}
		}
		// ...MAPPING CASCADE

		// CORRUPTION...
		this.setMasked(false)
		let promises = []
		for (let x = 0; x < cascadeMap.length; x++)
			for(let y = REELS_LENGTHS[x] - 1; y >= 0; y--)
				corruptionMap[x][y]
					&& promises.push(
						this.reelsViews[x]
							.cellsViews[y + 1]
							.presentCorruption({
								isSecured: corruptionMap[x][y] < 0,
								isPaying: !!multiplier
							}))


		// CELLS HIGHLIGHT...
		// WIN MAPS SETUP...
		// DEBUG...
		const highlightMap = corruptionMap.map(reel => reel.map(symbolId => {
			if (symbolId === 0) return 1
			return 0
		}))
		// ...DEBUG
		// ...WIN MAPS SETUP

		promises.push(
			this.highlightTimeline
				.deleteAllAnimations()
				.addAnimation({
					duration: 1000,
					onProgress: progress => {
						let brightness = 1

						if (progress < 0.25) {
							brightness = 1 - progress / 0.25
						} else if (progress > 0.75) {
							brightness = (progress - 0.75) / 0.25
						} else {
							brightness = 0
						}

						this.setBrightness({
							map: highlightMap,
							key: 1,
							brightness
						})
					}
				})
				.play()
			)
			
		// ...CELLS HIGHLIGHT

	
		await Promise.all(promises)

		this.setMasked()
		// ...CORRUPTION
		
		// FALL...
		promises = []
		for (let x = 0; x < cascadeMap.length; x++) {
			for(let y = REELS_LENGTHS[x] - 1; y >= 0; y--) {
				const offsetY = y - cascadeMap[x][y]
				const symbolId = corruptionMap[x][offsetY] >= 0
					? currentSymbolsIds[x][offsetY]
					: WILD_SYMBOL_ID

				cascadeMap[x][y]
				&& promises.push(
					this.reelsViews[x]
						.presentCascade({
							y,
							distance: cascadeMap[x][y],
							symbolId
						}))

			}
		}

		await Promise.all(promises)
		// ...FALL

		// PATCH FALL...
		if(!patchMap) return
		promises = []
		for (let x = 0; x < patchMap.length; x++)
			for(let y = patchMap[x].length - 1; y >= 0; y--) {
				promises.push(
					this.reelsViews[x]
						.presentCascade({
								y,
								distance: 6,
								symbolId: patchMap[x][y],
								delay: x * 50 || 1
						}))					
		}
		
		await Promise.all(promises)
		// ...PATCH FALL
	}

	onReelPatched(reelIndex, cellIndex) {

	}

	onReelStopHit(reelIndex) {

	}

	setTimeScale(scale) {
		for(const reelView of this.reelsViews)
			reelView.setTimeScale(scale)

		this.timeline.setTimeScaleFactor({name: 'scale', value: scale})
		this.highlightTimeline.setTimeScaleFactor({name: 'scale', value: scale})
	}


	presentRandomLoseSymbols() {
		let symbolsIds = getRandomLoseReels()
		
		for(let x = 0; x < REELS_COUNT; x++) {
			for(let y = 0; y < REELS_LENGTHS[x]; y++) {
				this.cellsViews[x][y + 1]
					.presentSymbol(symbolsIds[x][y])
			}
		}
	}

	isSpinning() {
		for (let i = 0; i < this.reelsViews.length; i++) {
			if (this.reelsViews[i].isSpinning()) {
				return true
			}
		}

		return false
	}
	// ...API
}
