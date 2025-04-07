import { TextField } from "../text/TextField";
import { BaseSplashScreen } from "./BaseSplashScreen";
import { Timeline } from "../../timeline/Timeline";
import { WIN_COEFFICIENTS } from "../../Constants";
import { AwardPayoutView } from "./award/AwardPayoutView";
import { colorToColor } from "../GraphicalPrimitives";


export class BigWinPayoutSplashScreen extends BaseSplashScreen {
	presentationTimeline = new Timeline
	idleTimeline = new Timeline

	initBody() {
		/*
		document.addEventListener('keyup', ({key}) => {
			if(key!=='1')return
			this.presentPayout({
				coefficient: 100, 
				payout: 102030
			})
		})
			*/



		const {
			assets,
			dictionary,
			isMobileDevice,
			renderer
		} = this

		super.initBody({
			assets,
			width: 1000,
			height: 1800
		})

		const { bodyView } = this
		
		bodyView.setTargetArea({
			x: 0,
			y: 0,
			width: 1,
			height: 0.9
		})

		const maximalWidth = 1000
		const maximalHeight = 125
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

		this.captionTextField = bodyView.addChild(
			new TextField({
				maximalWidth: 1000,
				maximalHeight: 200
			}))
			.setFontName('default')
			.setFontSize(200)
			.setAlignCenter()
			.setAlignMiddle()

		this.captionTextField.pivot.set(500, 100)
		this.captionTextField.position.set(500, 245)

		/*
		bodyView.addChild(
			new TextField({
				maximalWidth: 1000,
				maximalHeight: 90
			}))
			.setFontName('default')
			.setText(dictionary[
				(isMobileDevice ? 'tap' : 'click')
				+ '_anywhere_to_continue'
			])
			.setFontColor(0xFFFFFF)
			.setFontSize(60)
			.setAlignCenter()
			.setAlignMiddle()
			.y = 1500
		*/

		
		this.initPayout(assets)
	}

	initPayout(assets) {
		this.payoutView = this.bodyView.addChild(new AwardPayoutView(assets))
		this.payoutView.position.set(500, 1350)
	}

	/*
	initIdleTimeline() {
        const { awardView } = this

        this.idleTimeline = new Timeline

        this.idleTimeline
			.deleteAllAnimations()
			.addAnimation({
				duration: 10000,
				onProgress: progress => {
					awardView.pivot.y = 15 * Math.sin(Math.PI * 4 * progress)
					awardView.scale.set((DECORATION_SCALE + 0.15) + 0.1 * Math.sin(Math.PI * progress))
					awardView.setIdleProgress((progress * 11) % 1 )
				}
			})
			.setLoopMode()
			.play()
    }
			*/


	addSubWinAnimation({
		timeline,
		isFirstSubWin = false,
		isFinalSubWin = true,
		fontColor = 0xFFEE00,
		name,
		text = '',
	}) {
		const {
			awardView,
			captionTextField,
		} = this
	
		const delay = timeline.duration || 1
		const duration = isFinalSubWin ? 3000 : 2750

		const levelMap = {
			'big': 0,
			'huge': 1,
			'mega': 2
		}

		timeline
		// WIN PRESENTATION...
			.addAnimation({
				delay,
				duration: 300,
				onDelayFinish: () => {
					isFirstSubWin
					||
					this.audio.presentBigWinTransition(levelMap[name])
					awardView.setSkin(name)
					captionTextField
						.setFontColor(fontColor)
						.setText(text)
				},
				onProgress: (progress) => {
					const reversedProgress = 1 - progress
					captionTextField.alpha = progress ** 2
					captionTextField.y = 200 + 245 * reversedProgress


					awardView.presentTransition(progress)

					if(isFirstSubWin) return
					// const distortionProgress = Math.sin(Math.PI * 3 * progress) * (progress - 1)
					// awardView.y = 775 + 200 * distortionProgress
				}
			})
			.addAnimation({
				delay,
				duration,
				onProgress: (progress) => {
					const scaleProgress = Math.abs(Math.cos(Math.PI * 2 * ((progress * 3) % 1))) 
					captionTextField.scale.set(1 - 0.1 * scaleProgress)
				}
			})
		// ...WIN PRESENTATION

		// FADE AWAY TO NEXT SUB WIN...
		isFinalSubWin || timeline
			.addAnimation({
				delay: delay + duration,
				duration: 250,
				onProgress: (progress) => {
					const reversedProgress = 1 - progress
					captionTextField.scale.set(reversedProgress)
					awardView.presentTransition(reversedProgress)
				}
			})
		// ...FADE AWAY TO NEXT SUB WIN
	}

	async presentPayout({
		coefficient, 
		payout
	}) {
		const {
			dictionary,
			captionTextField,
			awardView,
			presentationTimeline,
			idleTimeline,
			payoutView
		} = this
		this.idleTimeline.play()
		this.bodyView.addChildAt(this.awardView, 1)
		awardView.position.set(500, 800)
		awardView.setSkin('big')
		awardView.setChipsMode(false)

		awardView.presentTransition(0)
		this.hintView.y = 1625
		this.hintView.scale.set(0.65)


		idleTimeline
			.deleteAllAnimations()
			.addAnimation({
				duration: 10000,
				onProgress: progress => {
					const subProgress = (progress * 5) % 1
					awardView.setIdleProgress(subProgress )

					payoutView.scale.x = 1 + 0.1 * Math.sin(Math.PI * 15 * progress) * (1 - progress)

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

		presentationTimeline.wind(0).deleteAllAnimations()
		captionTextField.alpha = 0
		
		await this.setVisible()

		const isHugeWin = coefficient >= WIN_COEFFICIENTS.HUGE
		const isMegaWin = coefficient >= WIN_COEFFICIENTS.MEGA

		this.addSubWinAnimation({
			isFirstSubWin: true,
			timeline: presentationTimeline,
			text: dictionary.big_win,
			fontColor: 0xFF5500,
			isFinalSubWin: !isHugeWin && !isMegaWin,
			name: 'big'
		})

		isHugeWin
		&& this.addSubWinAnimation({
			timeline: presentationTimeline,
			text: dictionary.huge_win,
			fontColor: 0xFFFF00,
			isFinalSubWin: !isMegaWin,
			name: 'huge'
		})

		isMegaWin
		&& this.addSubWinAnimation({
			timeline: presentationTimeline,
			text: dictionary.mega_win,
			fontColor: 0xFF00FF,
			name: 'mega'
		})

		let countingDuration = 3000
		if(isHugeWin) countingDuration += 3000
		if(isMegaWin) countingDuration += 3000

		this.audio.presentCounting({duration: countingDuration})

		await new Promise(resolve => {

			presentationTimeline
				.addAnimation({
					duration: countingDuration,
					onProgress: (progress) => {
						const scaleProgress = Math.abs(Math.sin(Math.PI * ((progress * 10) % 1)))
			
						payoutView.presentDistortion(progress)
						payoutView.presentPayout(payout * progress)
						payoutView.scale.x = 1 - 0.05 * scaleProgress
						payoutView.scale.y = 1 + 0.15 * scaleProgress

						const colorProgress = Math.sin(Math.PI * Math.abs(Math.sin(Math.PI * ((progress * 4) % 1))))
						const color = colorToColor(
							255,
							255,
							0,
							255,
							200,
							0,
							colorProgress
						)

						payoutView.setColor(color)
					}
				})
				.addAnimation({
					duration: 300,
					onProgress: progress => {
						//awardView.scale.set(DECORATION_SCALE * progress ** 2)
						payoutView.alpha = progress
					}
				})
				.addAnimation({
					delay: 300,
					duration: 200,
					onProgress: progress => {
						//awardView.scale.set(DECORATION_SCALE - 0.025 * Math.sin(Math.PI * progress))
					}
				})
				.addAnimation({
					delay: 500,
					duration: countingDuration - 500,
					onProgress: progress => {
						//awardView.scale.set(DECORATION_SCALE + 0.01 * progress)
					},
				})
				.addAnimation({
					duration: countingDuration + 3000,
					onFinish: () => resolve()
				})
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
		idleTimeline.pause()
		presentationTimeline.pause()
	}
}