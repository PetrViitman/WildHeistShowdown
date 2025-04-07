import { Container } from 'pixi.js'
import { ReelCellView } from './cell/ReelCellView'
import { getRandomSymbolId } from '../../Utils'
import { Timeline } from '../../timeline/Timeline'

import {
	CELL_HEIGHT,
	CELL_WIDTH,
	POSSIBLE_REELS_SYMBOLS,
	REELS_COUNT,
	REELS_LENGTHS,
	SCATTER_SYMBOL_ID,
	WILD_SYMBOL_ID,
} from '../../Constants'

export class SingleReelView extends Container {
	index
	cellsContainer
	cellsViews = []
	maskView
	targetSymbolsIds
	spinTimeline = new Timeline
	spinAccelerationTimeline = new Timeline
	spinFinishTimeline = new Timeline
	featureTimeline = new Timeline
	tensionView
	hitEffectView
	acceleration
	audio

	constructor({
		index,
		assets,
		vfxLevel,
		possibleSymbolsIds = POSSIBLE_REELS_SYMBOLS[1],
		initialSymbolsIds = new Array(length).fill(0),
		camera,
		audio
	}) {
		super()
		this.audio = audio
		this.camera = camera
		this.index = index
		this.initCells({
			assets,
			initialSymbolsIds: [
				getRandomSymbolId(index),
				...initialSymbolsIds,
				getRandomSymbolId(index)
			],
			possibleSymbolsIds,
			vfxLevel
		})
	}

	initCells({
		assets,
		initialSymbolsIds,
		possibleSymbolsIds,
		vfxLevel
	}) {
		const {cellsViews, index} = this
		const isSecurable = index === 2 || index === 3

		this.cellsContainer = this.addChild(new Container)

		for (let i = -1; i < REELS_LENGTHS[index]; i++) {
			const cellView = new ReelCellView({
				reelIndex: index,
				possibleSymbolsIds,
				assets,
				vfxLevel,
				isSecurable,
				isPayable: i >= 0
			})

			cellView.y = CELL_HEIGHT * (i + 0.5)
			cellView.x = CELL_WIDTH * 0.5
			cellView.presentSymbol(initialSymbolsIds[i + 1])
			cellsViews.push(this.cellsContainer.addChild(cellView))
			cellView.onFallIn = () => this.onCellFallIn?.(i)
		}

		cellsViews.push(cellsViews[0])
	}

	adjustDistortion() {
		const {cellsContainer} = this
		this.cellsViews.forEach(view => {
			view.adjustDistortion(-cellsContainer.pivot.y + cellsContainer.y)
		})
	}
	
	// API...
	setTimeScale(scale) {
		const scaleDescriptor = {name: 'scale', value: scale}

		this.spinTimeline.setTimeScaleFactor(scaleDescriptor) 
		this.spinAccelerationTimeline.setTimeScaleFactor(scaleDescriptor) 
		this.spinFinishTimeline.setTimeScaleFactor(scaleDescriptor)
		this.featureTimeline.setTimeScaleFactor(scaleDescriptor)

		for(let i = 1; i <= REELS_LENGTHS[this.index]; i++)
			this.cellsViews[i].setTimeScale(scale)
	}

	async preRenderSymbols(symbolsIds) {
        this.cellsViews.forEach((cellView) =>
            cellView.preRenderSymbols());
        this.setTimeScale(5);
		this.featureTimeline.deleteAllAnimations().addAnimation({
			duration: 100,
			onProgress: progress => {
				this.cellsViews.forEach(view => {
					view.sparklesPoolView?.presentFallout(progress)
					view.coinsBurstView?.presentFallout(progress)
				})
			}
		}).play()

        await this.presentSpinStart();
        await this.presentSpinStop({
            delay: 500,
            symbolsIds,
        });
        this.setTimeScale(1);
    }

    onPreRendered() {
        this.cellsViews.forEach((cellView) =>
            cellView.onPreRendered())

		this.adjustDistortion()
    }

	reset() {
		const {
			spinTimeline,
			spinAccelerationTimeline,
			spinFinishTimeline,
			featureTimeline
		} = this

		this.cellsViews.forEach(view => view.reset())

		spinTimeline.isPlaying && spinTimeline.wind(1)
		spinAccelerationTimeline.isPlaying && spinAccelerationTimeline.wind(1)
		spinFinishTimeline.isPlaying && spinFinishTimeline.wind(1)
		featureTimeline.isPlaying && featureTimeline.wind(1)
	}

	async presentSpinStart(delay) {
		const {
			index,
			cellsViews,
			cellsContainer
		} = this

		// DELAYED ROLL BACK...
		await this
			.spinTimeline
			.deleteAllAnimations()
			.addAnimation({
				delay: delay || 1,
				duration: 300,
				onDelayFinish: () => this.targetSymbolsIds = undefined,
				onProgress: (progress) => {
					const reversedProgress = 1 - progress
					this.cellsViews[0].y = -CELL_HEIGHT * 0.5 - CELL_HEIGHT * reversedProgress
					// this.cellsViews[finalCellIndex].y = (REELS_LENGTHS[index] + 0.5) * CELL_HEIGHT + CELL_HEIGHT * reversedProgress
					cellsContainer.pivot.y = progress ** 2 * CELL_HEIGHT * 0.5
					this.adjustDistortion()
				}
			})
			.setLoopMode(false)
			.play()
		// ...DELAYED ROLL BACK

		// ACCELERATION...
		this.spinAccelerationTimeline
			.deleteAllAnimations()
			.addAnimation({
				duration: 250,
				onProgress: (progress) => {
					this.spinTimeline.setTimeScaleFactor({
						name: 'acceleration',
						value: 1 + progress * 7,
					})
					this.cellsViews.forEach((view) => {
						const regress = 1 - progress
						view.setBlur(progress)
						view.setIdleFactor(regress)
						view.setGlowIntensity(regress)
					})

					this.adjustDistortion()
				}
			})
			.windToTime(1)
			.play()
		// ...ACCELERATION

		// INFINITE SPIN...
		let shiftsCount = 0
		this.spinTimeline
			.deleteAllAnimations()
			.addAnimation({
				duration: 300,
				onProgress: (progress) => {
					cellsContainer.y = progress * CELL_HEIGHT * this.scale.y

					// ROLL BACK REVERT...
					if(cellsContainer.pivot.y > 0)
						cellsContainer.pivot.y = (1 - progress) * CELL_HEIGHT * 0.5
					// ...ROLL BACK REVERT


					// FINAL DESCENDENCE...
					if(
						this.targetSymbolsIds
						&& this.targetSymbolsIds.length <= 1
					) {
						// removing blur
						cellsViews.forEach(view => view.setBlur(1 - progress))
					}
					// ...FINAL DESCENDENCE

					this.adjustDistortion()
				},
				onFinish: () => {
					cellsViews

					if (this.targetSymbolsIds?.length) {

						// SYMBOLS SWAP...
						cellsContainer.y = 0
						for (let i = cellsViews.length - 2; i > 0; i--) {
							cellsViews[i].presentSymbol(cellsViews[i - 1].currentSymbolId)
							cellsViews[i].scale.set(cellsViews[i - 1].scale.x)
						}
						// ...SYMBOLS SWAP

						// NEXT TOP SYMBOLS...
						const nextSymbolId = this.targetSymbolsIds.pop()
						cellsViews[0].presentSymbol(nextSymbolId)
						// ...NEXT TOP SYMBOLS

						// STOP ON TARGET SYMBOLS...
						if(this.targetSymbolsIds && !this.targetSymbolsIds.length) 
							this.spinTimeline.setLoopMode(false)
						// ...STOP ON TARGET SYMBOLS

						for(let i = 0; i < cellsViews.length - 1; i++) {
							const view = cellsViews[i]
							const shiftedY = i
							view.y = shiftedY * CELL_HEIGHT - CELL_HEIGHT / 2
						}

					} else {
						shiftsCount++

						for(let i = 0; i < cellsViews.length - 1; i++) {
							const view = cellsViews[i]
							const shiftedY = (i + shiftsCount) % (cellsViews.length - 1)
							view.y = shiftedY * CELL_HEIGHT - CELL_HEIGHT / 2
						}
					}

					this.adjustDistortion()
				} 
			})
			.setLoopMode()
			.play()
		// ...INFINITE SPIN
	}

	presentImmediateSpinStop(targetSymbolsIds) {
		this.spinTimeline.setLoopMode(false).wind(1).deleteAllAnimations()
		this.spinAccelerationTimeline.wind(1).deleteAllAnimations()
		this.spinFinishTimeline.wind(1).deleteAllAnimations()
		this.featureTimeline.wind(1).deleteAllAnimations()

		this.cellsContainer.pivot.y = 0
		this.cellsContainer.y = 0


		for (let i = 0; i < this.cellsViews.length - 1; i++) {
			this.cellsViews[i].y = i * CELL_HEIGHT - CELL_HEIGHT / 2
		}

		targetSymbolsIds.forEach((symbolId, i) => {
			this.cellsViews[i].setBlur(0)
			this.cellsViews[i + 1].presentSymbol(symbolId)
		})
		this.adjustDistortion()
	}

	async presentSpinStop({
		symbolsIds = [1, 2, 3, 4, 5, 6],
		delay,
		tensionDuration,
		cellsViews
	}) {
		if(!this.spinTimeline.isPlaying) return

		const { tensionView } = this

		if(tensionDuration) {
			// TENSION DELAY...
			await this
				.featureTimeline
				.deleteAllAnimations()
				.addAnimation({
					delay: delay,
					duration: tensionDuration,
					onStart: () => {
						this.audio.presentTensionStart()
					},
					onProgress: progress => {
						tensionView?.setProgress(progress)
						const brightness = Math.min(1, progress * 10) 

						cellsViews?.forEach((reel, i) => {
							if ( i!== this.index)
							reel.forEach(
								cellView => {
									if(cellView.currentSymbolId === SCATTER_SYMBOL_ID && cellView.isIdling()) {
										cellView.setBrightness(1)
										
										const teaseProgress = (progress * 2) % 1
										cellView.presentWinBox(teaseProgress)
										cellView.getSymbolView().presentTeasing?.(teaseProgress )
									} else {
										cellView.setBrightness(
											Math.min(cellView.getBrightness(), 1 - progress)
										)
									}
								}
							)
						})

						this.cellsViews.forEach(view => view.setBrightness(Math.max(view.getBrightness(), brightness)))
						this.adjustDistortion()
					},
					onFinish: () => {
						this.index === REELS_COUNT - 1
						&& this.audio.presentTensionStop()
					}
				})
				.play()
			// ...TENSION DELAY
		} else {
			// DEFAULT DELAY...
			await this
				.featureTimeline
				.deleteAllAnimations()
				.addAnimation({
					delay
				})
				.play()
			// ...DEFAULT DELAY
		}

		// WAIT TILL STOP ON TARGET SYMBOLS... 
		this.targetSymbolsIds = [
			getRandomSymbolId(this.index),
			...symbolsIds,
			getRandomSymbolId(this.index)
		]

		const finalCellIndex = this.cellsViews.length - 1
		await this.spinTimeline.play()
		// ...WAIT TILL STOP ON TARGET SYMBOLS

		this.onReelStopHit?.()

		// FLEX UP-DOWN...
		await this
			.spinTimeline
			.deleteAllAnimations()
			.addAnimation({
				duration: 300,
				onProgress: (progress) => {

					const subProgress = Math.sin(Math.PI * progress)

					this.cellsContainer.pivot.y = subProgress * CELL_HEIGHT * 0.5
					this.cellsViews.forEach(view => {
						view.setBlur(0)
						view.setIdleFactor(progress)
						view.setGlowIntensity(progress)
					})


					// hiding top & bottom cells
					this.cellsViews[0].y = -CELL_HEIGHT - CELL_HEIGHT * progress
					this.cellsViews[finalCellIndex].y = REELS_LENGTHS[this.index] * CELL_HEIGHT
						+ CELL_HEIGHT * 2 * progress


					if(this.index === REELS_COUNT - 1) {
						cellsViews?.forEach(
							reel => reel.forEach(
								view => view.setBrightness(Math.max(view.getBrightness(), progress))
							)
						)
					}

					this.adjustDistortion()
				},
			})
			.setTimeScaleFactor({
				name: 'acceleration',
				value: 1
			})
			.play()
		// ...FLEX UP-DOWN
		

		// SCATTER TEASING...
		return Promise.all(symbolsIds.map((id, y) => {
			if(id === SCATTER_SYMBOL_ID) {
				this.audio.presentScatter()
				return this.cellsViews[y + 1].presentScatterTeasing()
			}
		}))
		// ...SCATTER TEASING
	}

	presentSymbol(symbolId, y) {
		this.cellsViews[y + 1].presentSymbol(symbolId)
	}

	presentWin(map = [1, 1, 1, 1]) {
		const { cellsViews } = this

		return Promise.all(map.map((value, y) => {
			if (value) return cellsViews[y + 1].presentWin()
		}))
	}

	presentCascade({
		y,
		distance,
		symbolId,
		delay
	}) {
		const fallingCellView = this.cellsViews[y - distance + 1]
		const idleProgressOffset = fallingCellView?.getSymbolView().idleProgressOffset ?? Math.random()
		const targetCellIndex = y + 1
		const targetCellView = this.cellsViews[targetCellIndex]

		fallingCellView?.randomizeIdleOffset()
		fallingCellView?.presentSymbol(0)

		if(symbolId === SCATTER_SYMBOL_ID) {
			this.bringCellToFront(targetCellIndex)
		}

		return targetCellView.presentFallIn({
			symbolId,
			distance,
			idleProgressOffset,
			delay
		})
	}

	isSpinning() {
		return this.spinTimeline.isPlaying
	}

	bringCellToFront(cellIndex) {
		this.cellsContainer.addChild(this.cellsViews[cellIndex])
	}
	// ...API
}
