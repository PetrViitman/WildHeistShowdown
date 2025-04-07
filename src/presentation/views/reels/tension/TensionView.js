import { BLEND_MODES, Container, Filter, Graphics, Sprite } from "pixi.js";
import { CELL_HEIGHT, CELL_WIDTH, REELS_HEIGHT, REELS_LENGTHS } from "../../../Constants";
import { colorToColor } from "../../GraphicalPrimitives";

export class TensionView extends Container {
	reelIndex

	constructor(assets, reelIndex) {
		super()

		this.reelIndex = reelIndex
		this.initSymbols(assets)
		this.alpha = 0
	}

	initSymbols(assets) {
		this.symbolsViews = new Array(5).fill(0).map(_ => {
			const sprite = new Sprite(assets.symbol_tension)
			sprite.scale.set(3)
			sprite.anchor.set(0.5)
			sprite.tint= 0xFFFF00

			return this.addChild(sprite)
		})
	}

	setProgress(progress) {
		const motionProgress = (progress * 3) % 1
		const {reelIndex} = this
		const finalProgress = (motionProgress + reelIndex * 0.1) % 1

		const offsetX = reelIndex - 2.5

		this.symbolsViews.forEach((view, i) => {
			const shiftedProgress = (finalProgress + i * 0.2) % 1
			const floatingProgress =  Math.sin(Math.PI * shiftedProgress)
			view.y = -CELL_HEIGHT + CELL_HEIGHT * (REELS_LENGTHS[reelIndex] + 1) * (1 - shiftedProgress)
			view.x = 55 * floatingProgress * offsetX

			view.tint = colorToColor(
				255,
				255,
				0,
				255,
				0,
				0,
				1 - floatingProgress
			)
			// view.rotation = shiftedProgress * offsetX
			const scaleFactor = 0.75 + 0.25 * (1 - ( Math.abs(offsetX) / 2.5))

			const scale = (0.75 + Math.sin(Math.PI * shiftedProgress)) * 1.5 * scaleFactor
			view.scale.set(scale* 0.75, scale* 1.75)
		})


		this.alpha = Math.min(1, Math.sin(Math.PI * progress) * 3)
	}
}