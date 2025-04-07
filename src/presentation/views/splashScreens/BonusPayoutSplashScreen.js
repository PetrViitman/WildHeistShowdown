import { Graphics, Sprite } from "pixi.js";
import { formatMoney } from "../../Utils";
import { Timeline } from "../../timeline/Timeline";
import { TextField } from "../text/TextField";
import { BaseSplashScreen } from "./BaseSplashScreen";
import { AwardPayoutView } from "./award/AwardPayoutView";
import { colorToColor } from "../GraphicalPrimitives";

export class BonusPayoutSplashScreen extends BaseSplashScreen {
	idleTimeline = new Timeline
	presentationTimeline = new Timeline

	constructor({
		assets,
		dictionary,
		isMobileDevice,
		camera,
		awardView,
		audio
	}) {
        super({
            assets,
            dictionary,
            isMobileDevice,
            camera,
			awardView,
			audio
        })

        this.initTexts(assets, dictionary)
		this.initPayout(assets)
		this.initIdleTimeline()

		/*
		document.addEventListener('keyup', ({key}) => {
			if(key!=='3')return
			this.presentPayout(12345678)
		})
			*/
	}

	initBody() {
		const {
			assets,
			dictionary,
			isMobileDevice,
		} = this

		super.initBody({
			assets,
			width: 1000,
			height: 1800,
			dictionary,
			isMobileDevice,
		})
	}

	initTexts(assets, dictionary) {
        const { bodyView, isMobileDevice } = this


		let maximalWidth = 1000
		let maximalHeight = 125
        this.headerTextField = bodyView.addChild(
			new TextField({
				maximalWidth,
				maximalHeight
			}))
			.setFontName('default')
			.setText(dictionary.congratulations)
			.setFontColor(0xFF2200)
			.setFontSize(90)
			.setAlignCenter()
			.setAlignMiddle()

		this.headerTextField.pivot.set(maximalWidth / 2, maximalHeight / 2)
        this.headerTextField.x = maximalWidth / 2
		this.headerTextField.y = 87


		maximalWidth = 1000
		maximalHeight = 90
		this.bonusGameIsOverTextField = bodyView
            .addChild(new TextField({
                maximalWidth,
                maximalHeight
            }))
            .setFontName('default')
			.setFontColor(0xFF00FF)
			.setFontSize(90)
			.setAlignCenter()
			.setAlignTop()
            .setText(dictionary.free_spins_over)

		this.bonusGameIsOverTextField.pivot.set(maximalWidth / 2, maximalHeight / 2)
        this.bonusGameIsOverTextField.x = maximalWidth / 2
        this.bonusGameIsOverTextField.y = 195


		bodyView.addChild(new TextField({
				maximalWidth: 1600,
				maximalHeight: 90
			}))
			.setFontName('default')
			.setText(dictionary.you_have_won)
			.setFontColor(0xFFFFFF)
			.setFontSize(50)
			.setAlignCenter()
			.setAlignBottom()
			.y = 785
    }

    initIdleTimeline() {
        const { awardView } = this
        this.idleTimeline = new Timeline
        this.idleTimeline
			.addAnimation({
				duration: 10000,
				onProgress: progress => {
					const subProgress = (progress * 5) % 1
					awardView.setIdleProgress(subProgress )

					this.payoutView.scale.x = 1 + 0.1 * Math.sin(Math.PI * 15 * progress) * (1 - progress)

					this.hintView.present((progress * 20) % 1)


					const headerProgress = Math.sin(Math.PI * 10 * progress)
					this.headerTextField.y = 87 + 10 * headerProgress
					this.headerTextField.scale.set(
						1,
						1 - 0.1 * headerProgress,
					)
				}
			})
			.setLoopMode()
    }

	initPayout(assets) {
		this.payoutView = this.bodyView.addChild(new AwardPayoutView(assets))
		this.payoutView.position.set(500, 1350)
	}

	async presentPayout(payout) {
		const {
			presentationTimeline,
			awardView,
			payoutView,
			bonusGameIsOverTextField
		} = this

		this.bodyView.addChildAt(awardView, 0)
		awardView.position.set(500, 800)
		awardView.setSkin('bonus')
		awardView.presentTransition(0)
		awardView.setChipsMode(false)
		this.hintView.y = 1625
		this.hintView.scale.set(0.65)
		
		this.idleTimeline.play()

		this.audio.presentCounting({duration: 2500})

		presentationTimeline
			.deleteAllAnimations()
			.addAnimation({
				duration: 2500,
				onProgress: (progress) => {
					const scaleProgress = Math.abs(Math.sin(Math.PI * ((progress * 10) % 1)))
			
					payoutView.presentDistortion(progress)
					payoutView.presentPayout(payout * progress)
					payoutView.scale.x = 1 - 0.05 * scaleProgress
					payoutView.scale.y = 1 + 0.15 * scaleProgress

					const colorProgress = Math.abs(Math.sin(Math.PI * ((progress * 2) % 1)))
					const color = colorToColor(
						255,
						255,
						0,
						255,
						0,
						255,
						colorProgress
					)

					payoutView.setColor(color)
					bonusGameIsOverTextField.setFontColor(color)

					this.awardView.setRibbonColor(
						colorToColor(
							255,
							255,
							255,
							255,
							150,
							150,
							colorProgress
						)
					)
				}
			})

		presentationTimeline
			.addAnimation({
				duration: 300,
				onProgress: progress => {
					payoutView.alpha = progress
					awardView.presentTransition(progress)
				}
			})
			.play()

		await super.setVisible()


		await new Promise(resolve => {
			this.eventMode = 'static'
			this.cursor = 'pointer'
			this.addEventListener('pointerdown', () => {
				this.removeAllListeners()
				this.eventMode = 'none'
				this.cursor = 'default'
				resolve()
				this.audio.skipSplashScreen()
			})

			presentationTimeline.addAnimation({
				delay: presentationTimeline.duration,
				duration: 5000,
				onFinish: () => resolve()
			})
		})

		await this.setVisible(false)
        this.idleTimeline.pause()
		this.presentationTimeline.pause()
	}
}