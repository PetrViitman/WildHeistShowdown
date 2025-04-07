import { Timeline } from "../../timeline/Timeline";
import { colorToColor } from "../GraphicalPrimitives";
import { TextField } from "../text/TextField";
import { BaseSplashScreen } from "./BaseSplashScreen";

export class BonusAwardSplashScreen extends BaseSplashScreen {
	presentationTimeline = new Timeline
	idleTimeline
	spinsCountTextField
	spinsWonTextField
	dictionary

	constructor({
		assets,
		dictionary,
		renderer,
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

		this.dictionary = dictionary
        this.initTexts({
			assets,
			dictionary,
			renderer,
			isMobileDevice
		})

		this.initIdleTimeline()

		/*
		document.addEventListener('keyup', ({key}) => {
			if(key!=='2')return
			this.presentAward({awardedFreeSpinsCount: 15, awardedKeysCount: 1})
		})
			*/
    }
	

	initTexts({
		dictionary,
		assets,
		renderer,
		isMobileDevice
	}) {
        const { bodyView } = this

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
		this.spinsWonTextField = bodyView
            .addChild(new TextField({
                maximalWidth,
                maximalHeight
            }))
            .setFontName('default')
			.setFontColor(0xFF00FF)
			.setFontSize(90)
			.setAlignCenter()
			.setAlignTop()
            .setText(dictionary.free_spins_won)

		this.spinsWonTextField.pivot.set(maximalWidth / 2, maximalHeight / 2)
        this.spinsWonTextField.x = maximalWidth / 2
        this.spinsWonTextField.y = 195

		// FS COUNT TEXT LINE...
		maximalWidth = 200
		maximalHeight = 200
        this.spinsCountTextField = bodyView
            .addChild(new TextField({
                maximalWidth,
                maximalHeight
            }))
            .setFontName(
			'0123456789.,',
			[
				assets.payout_0,
				assets.payout_1,
				assets.payout_2,
				assets.payout_3,
				assets.payout_4,
				assets.payout_5,
				assets.payout_6,
				assets.payout_7,
				assets.payout_8,
				assets.payout_9,
				assets.payout_period,
				assets.payout_period,
			])
			.setFontColor(0xFFFFFF)
			.setFontSize(maximalHeight)
			.setAlignCenter()
			.setAlignMiddle()
			.setLetterSpacing(-maximalHeight / 5)

		this.spinsCountTextField.pivot.set(maximalWidth / 2, maximalHeight / 2)

        this.spinsCountTextField.position.set(500, 420)
        // ...FS COUNT TEXT LINE

		/*
		bodyView.addChild(
			new TextField({
				maximalWidth: 1600,
				maximalHeight: 60
			}))
			.setFontName('default')
			.setText(dictionary[
				(isMobileDevice ? 'tap' : 'click')
				+ '_anywhere_to_continue'
			])
			.setFontColor(0xFFFFFF)
			.setFontSize(90)
			.setAlignCenter()
			.setAlignMiddle()
			.y = 1300

		*/
    }

	initIdleTimeline() {
        this.idleTimeline = new Timeline

        this.idleTimeline
			.deleteAllAnimations()
			.addAnimation({
				duration: 10000,
				onProgress: progress => {
					const subProgress = (progress * 5) % 1
					this.awardView.setIdleProgress(subProgress)

					const spinsCountProgress = (subProgress * 4) % 1
					const bouncingProgress = Math.sin(Math.PI *1 * spinsCountProgress)

					const headerProgress = Math.sin(Math.PI * 10 * progress)
					this.headerTextField.scale.set(
						1,
						1 - 0.1 * headerProgress,
					)

					this.headerTextField.y = 87 + 10 * headerProgress

					this.spinsCountTextField.scale.set(
						1.55 + 0.35 * bouncingProgress,
						1.55 + 0.25 * bouncingProgress,
					)

					this.spinsWonTextField.scale.set(
						1 - 0.1 * bouncingProgress,
						1
					)

					const color = colorToColor(
						255,
						255,
						0,
						255,
						0,
						255,
						bouncingProgress
					)

					this.spinsCountTextField.setFontColor(color)
					this.spinsWonTextField.setFontColor(color)

					this.hintView.present(spinsCountProgress)
				}
			})
			.setLoopMode()
    }

	async presentAward({awardedFreeSpinsCount, awardedKeysCount = 0}) {
		const pageSymbolsIds = []
		const { awardView, dictionary } = this

		this.bodyView.addChildAt(this.awardView, 0)
		awardView.position.set(500, 900)
		awardView.setSkin('bonus')
		awardView.presentTransition(0)
		awardView.setChipsMode()


		this.idleTimeline.play()
		this.spinsCountTextField.setText(awardedFreeSpinsCount)

		await super.setVisible()

		await new Promise(resolve => {
			this.presentationTimeline
				.deleteAllAnimations()
				.addAnimation({
					duration: 300,
					onProgress: progress => {
						awardView.presentTransition(progress)
					},
				})
				.addAnimation({
					duration: 5000,
					onProgress: progress => {
						const multiplier = 1 + 0.75 * Math.sin(Math.PI * progress)
						const scrollProgress = progress ** 2 * multiplier * pageSymbolsIds.length
						const currentSymbolIndex = Math.trunc(scrollProgress)

						/*
						
						booksViews[0].presentScrolling({
							progress: scrollProgress % 1,
							currentSymbolId: pageSymbolsIds[currentSymbolIndex - 1] ?? -1,
							nextSymbolId: pageSymbolsIds[currentSymbolIndex] ?? -1,
						})*/
					},
					onFinish: () => resolve()
				})/*
				.addAnimation({
					delay: 4500,
					duration: 1500,
					onProgress: progress => booksViews[0].presentWin(progress)
				})
				.addAnimation({
					delay: 6000,
					duration: 5000,
					onFinish: () => resolve()
				})*/
				.play()

			this.eventMode = 'static'
			this.cursor = 'pointer'
			this.addEventListener('pointerdown', () => {
				this.removeAllListeners()
				this.eventMode = 'none'
				this.cursor = 'default'
				resolve()
				this.audio.skipSplashScreen()
			})
		})

		await this.setVisible(false)
		this.idleTimeline.pause()
		this.presentationTimeline.pause()
	}
}