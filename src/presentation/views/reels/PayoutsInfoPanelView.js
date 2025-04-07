import { Container, Sprite } from "pixi.js"
import { TextField } from "../text/TextField"
import { CELL_HEIGHT, CELL_WIDTH, REELS_COUNT, SCATTER_SYMBOL_ID, WILD_SYMBOL_ID } from "../../Constants"
import { Timeline } from "../../timeline/Timeline"
import { formatMoney } from "../../Utils"

const PAYOUTS_IDS_COLOR_MAP = {
	1: 0xAAFF55,
	2: 0xFF2200,
	3: 0xFF22AA,
	4: 0x55AAFF,
	5: 0x22FFFF,
	6: 0x2266FF,
	7: 0xEEEEEE,
	8: 0xFFAA22,
	9: 0xAAFF00,
	10: 0xFFFF00,	
}



const ZOOM_DELTA = 0.5

export class PayoutsInfoPanelView extends Container {
	coefficients
	bet
	reelsView
	contentContainer
	panelView
	symbolContainer
	payoutsContainer
	payoutsViews = []
	capturedSymbolParentContainer
	capturedSymbolView
	capturedSymbolId
	timeline = new Timeline
	camera
	isHiding
	
	constructor({
		assets,
		reelsView,
		coefficients,
		camera
	}) {
		super()

		this.camera = camera
		this.coefficients = coefficients
		this.reelsView = reelsView
		this.contentContainer = this.addChild(new Container)
		this.initPanel(assets)
		this.initPayouts()
		this.initSymbolContainer()
		this.contentContainer.visible = false
	}

	initSymbolContainer() {
		this.symbolContainer = this.contentContainer.addChild(new Container)
		this.symbolContainer.position.set(
			CELL_WIDTH * 0.5,
			CELL_HEIGHT * 0.5
		)
	}

	initPanel(assets) {
		const sprite = new Sprite(assets.payouts_panel)
		sprite.scale.set(1.23)
		sprite.y = -30
		this.panelView = this.contentContainer.addChild(sprite)
	}

	initPayouts() {
		this.payoutsContainer = this
			.contentContainer
			.addChild(new Container)
	
		for(let i = 0; i < 4; i++) {
			const textField = this
				.payoutsContainer
				.addChild(
					new TextField({
						maximalWidth: 190,
						maximalHeight: 43
					}))
				.setFontName('default')
				.setFontColor(0xFFFFFF)
				.setFontSize(50)
				.setAlignMiddle()
			
			textField.y = i * 43 + 23
			this.payoutsViews.push(textField)
		}
	}

	hide() {
		const {
			camera,
			timeline,
			reelsView,
			contentContainer
		} = this

		if(!contentContainer.visible) return
		if(this.isHiding) return

		return timeline
			.deleteAllAnimations()
			.addAnimation({
				duration: 150,
				onStart: () => {
					this.isHiding = true
				},
				onProgress: (progress) => {
					reelsView.setBrightness({ brightness: progress })
					//reelsView.winTabloidView.alpha = progress
					contentContainer.alpha = 1 - progress
					camera
						.focus({view: this.capturedSymbolView})
						.setZoom(1 + ZOOM_DELTA  * (1 - progress))


					this.capturedSymbolView.presentCoefficients(1 - progress)
				},
				onFinish: () => {
					this.capturedSymbolParentContainer
						.addChild(this.capturedSymbolView)

					this.capturedSymbolView = undefined
					this.contentContainer.visible = false
					this.isHiding = false
					this.reelsView.timeline.play()
				}
			})
			.windToTime(1)
			.play()
	}

	updatePayoutsTexts() {
		const {coefficients, payoutsViews } = this
		const capturedSymbolId = this.capturedSymbolId
		const color = PAYOUTS_IDS_COLOR_MAP[capturedSymbolId]

		if(capturedSymbolId === undefined) return

		if (coefficients[capturedSymbolId]) {

			const coefficientsArray = Object.values(coefficients[capturedSymbolId])
			const textFieldHeight = 250 / coefficientsArray.length

			payoutsViews.forEach((view, i) => {
				const coefficient = coefficientsArray[coefficientsArray.length - 1 - i]
				const payout = formatMoney({value: coefficient * this.bet})

				view.visible = !!coefficient
				view.setText((coefficientsArray.length - i + 2) + 'x: ' + payout)
				view.y = textFieldHeight * i + 5
				view.setMaximalHeight(textFieldHeight)
			})
		} else if (capturedSymbolId === WILD_SYMBOL_ID) {
			payoutsViews.forEach(view => view.setText(''))
			payoutsViews[0].y = 5
			payoutsViews[0].setMaximalHeight(250)
			payoutsViews[0].setText('WILD')
		} else if (capturedSymbolId === SCATTER_SYMBOL_ID) {
			payoutsViews.forEach(view => view.setText(''))
			payoutsViews[0].y = 5
			payoutsViews[0].setMaximalHeight(250)
			payoutsViews[0].setText('SCATTER')
		}


		color && payoutsViews.forEach(view => {
			view.setFontColor(color)
		})
	}

	async presentPayouts({
		capturedSymbolView,
		x,
		y,
		symbolId,
	}){
		const {
			camera,
			timeline,
			reelsView,
			contentContainer,
		} = this


		if(contentContainer.visible) return
		
		// KEEPING PANEL INSIDE REELS...
		if (x < REELS_COUNT - 3) {
			this.payoutsContainer.x = 265
			this.panelView.x = -25
		} else {
			this.payoutsContainer.x = -195
			this.panelView.x = -240
		}
		// ...KEEPING PANEL INSIDE REELS

		this.capturedSymbolParentContainer = capturedSymbolView.parent
		this.capturedSymbolView = capturedSymbolView
		this.capturedSymbolId = symbolId
		this.symbolContainer.addChild(capturedSymbolView)
		this.contentContainer.position.set(
			x * CELL_WIDTH,
			y * CELL_HEIGHT)

		this.updatePayoutsTexts()
		
		await timeline
			.deleteAllAnimations()
			.addAnimation({
				duration: 250,
				onStart: () => {
					this.contentContainer.visible = true
				},
				onProgress: (progress) => {
					contentContainer.alpha = progress
					//reelsView.winTabloidView.alpha = 1 - progress
					reelsView.setBrightness({
						brightness: 1 - progress
					})
					
					capturedSymbolView.setBrightness(1)

					this.capturedSymbolView.presentCoefficients(progress)

					camera
						.focus({view: this.capturedSymbolView})
						.setZoom(1 + ZOOM_DELTA  * progress)
				}
			})
			.play()

		timeline
			.deleteAllAnimations()
			.addAnimation({
				duration: 5000,
				onProgress: progress => {
					reelsView.timeline.pause()
					reelsView.cellsViews.forEach(reel => reel.forEach(view => {
						const symbolView = view.getSymbolView()
						if(symbolView !== capturedSymbolView) {
							symbolView.setBrightness(0)
						}
					}))
	
					capturedSymbolView.setBrightness(1)
				}
			})
			.setLoopMode()
			.play()
	}

	setBet(bet) {
		this.bet = bet
		this.updatePayoutsTexts()
	}
}