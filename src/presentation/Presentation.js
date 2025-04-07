import { Application, settings, MIPMAP_MODES, Ticker, BitmapFont, Sprite, Container, Graphics, SCALE_MODES, EventBoundary, Text } from "pixi.js"
import { AdaptiveContainer } from "./views/adaptiveDesign/AdaptiveContainer"
import { Timeline } from "./timeline/Timeline"
import { BackgroundView } from "./views/BackgroundView"
import { getPreloadingAssets, getAssets } from "./Assets"
import { ReelsView } from "./views/reels/ReelsView"
import { formatMoney, getRandomLoseReels, setViewport } from "./Utils"
import { isIOS, TURBO_MODE_TIME_SCALE, WIN_COEFFICIENTS } from "./Constants"
import { BonusAwardSplashScreen } from "./views/splashScreens/BonusAwardSplashScreen"
import { BonusPayoutSplashScreen } from "./views/splashScreens/BonusPayoutSplashScreen"
import { LoadingScreen } from "./views/loadingScreen/LoadingScreen"
import { getVFXLevel } from "./Benchmark"
import { BigWinPayoutSplashScreen } from "./views/splashScreens/BigWinPayoutSplashScreen"
import { Camera } from "./views/adaptiveDesign/Camera"
import { InteractiveLayerView } from "./views/InteractiveLayerView"
import { BankView } from "./views/bank/BankView"
import { SkyView } from "./views/bank/SkyView"
import { AwardView } from "./views/splashScreens/award/AwardView"
import { GUIView } from "./views/GUI/GUIView"
import { TextField } from "./views/text/TextField"
import { Audio } from "./audio/Audio"
import { flipRTLPlaceholders, isRTLTextDirection, getDictionary, isBadRasterLanguage } from "./Dictionary"

settings.MIPMAP_MODES = MIPMAP_MODES.ON

export class Presentation {
	preloadingAssetsMap
	assetsMap
	audioMap
	assets
	pixiApplication
	loadingScreen
	backgroundView
	reelsView
	interactiveLayerView
	bonusAwardSplashScreen
	bonusPayoutSplashScreen
	bigWinPayoutSplashScreen
	splashScreens = []
	remainingAutoSpinsCount = 0
	isTurboMode
	vfxLevel
	isMobileDevice
	camera
	languageCode
	accounts
	isLTRTextDirection
	isMobileApplicationClient
	audio = new Audio()

	setup({
		wrapperHTMLElementId,
		customVFXLevel,
		customUIOption,
		languageCode,
		preloadingAssetsMap,
		assetsMap,
		audioMap,
		isMobileApplicationClient = false,
		isSpecialMobileApplicationClient = false,
		dictionary,
		isLTRTextDirection = !isRTLTextDirection(languageCode)
	}) {
		this.isLTRTextDirection = isLTRTextDirection
		this.isMobileApplicationClient = isMobileApplicationClient
		this.isSpecialMobileApplicationClient = isSpecialMobileApplicationClient
		TextField.isLTRTextDirection = isLTRTextDirection
		TextField.isDynamicCharacterSet = !isLTRTextDirection || isBadRasterLanguage(languageCode)

		dictionary && !isLTRTextDirection && flipRTLPlaceholders(dictionary)
		this.dictionary = dictionary
		this.preloadingAssetsMap = preloadingAssetsMap
		this.assetsMap = assetsMap
		this.audioMap = audioMap

		this.languageCode = languageCode
		this.pixiApplication = new Application({
			background: 0x000000
		})
		this.vfxLevel = customVFXLevel
		this.pixiApplication.view.setAttribute('touch-action', 'none')
		this.pixiApplication.renderer.plugins.accessibility.destroy();
		delete this.pixiApplication.renderer.plugins.accessibility;


		// UI OPTION DETECT...
		this.isMobileDevice =
			'ontouchstart' in window
			|| navigator.maxTouchPoints > 0 
			|| navigator.msMaxTouchPoints > 0
		
		if (customUIOption === 'mobile')
			this.isMobileDevice = true
		else if (customUIOption === 'desktop')
			this.isMobileDevice = false
		// ...UI OPTION DETECT

		// CANVAS APPENDING...
		Object.assign(this.pixiApplication.view.style, {
			width: '100%',
			height: '100%',
			position: 'absolute',
			'z-index': 1,
		})
		document.getElementById(wrapperHTMLElementId)
				.appendChild(this.pixiApplication.view)
		// ...CANVAS APPENDING

		Ticker.shared.add(() => {
			Timeline.update()
		})

		// GUI...
		this.pixiGUIApplication = new Application({
			background: 0x0a153d,
			backgroundAlpha: 0,
			resolution: window.devicePixelRatio
		})
		
		this.pixiGUIApplication.view.setAttribute('touch-action', 'none')
		this.pixiGUIApplication.renderer.plugins.accessibility.destroy();
		delete this.pixiGUIApplication.renderer.plugins.accessibility;

        // CANVAS APPENDING...
		Object.assign(this.pixiGUIApplication.view.style, {
			width: '100%',
			height: '100%',
			position: 'absolute',
			'z-index': 1,
			'pointer-events': 'none'
		})
		document.getElementById(wrapperHTMLElementId)
				.appendChild(this.pixiGUIApplication.view)

		const overlay = this.pixiGUIApplication.view;
		const canvas = this.pixiApplication.view;



		const redirectPointerEvent = (event) => {
			GUIView.isOverlayInteraction || canvas.dispatchEvent(
				new PointerEvent(event.type, event)
			);
		}

		[
			'pointerdown',
			'pointerup',
			'pointermove',
			'pointerover',
			'pointerout',
		].forEach((eventName) => {
			overlay.addEventListener(eventName, (event) => {
				redirectPointerEvent(event)
			});
		});

		// ...CANVAS APPENDING
		// ...GUI
		
		this.guiView = new GUIView(wrapperHTMLElementId)
		this.guiView.alpha = 0.0001
		this.guiView.onWindowVisibleStateChanged = (isVisible) => {
			this.pixiApplication.stage.visible = !isVisible

			this.setGamePlayTimeScale(Number(!isVisible))
		}

		this.pixiGUIApplication.stage.addChild(this.guiView)
		
		if (
			isMobileApplicationClient
			&& !isSpecialMobileApplicationClient
		) {
			setViewport("width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover")
			let { style } = document.body

			const width = screen.width + 'px'
			const height = screen.height + 'px'

			style.margin = '0px'
			style.width = width
			style.height = height

			AdaptiveContainer.isFullScreenMode = true

			style = document.getElementById(wrapperHTMLElementId).style
			style.width = width
			style.height = height
		}

		AdaptiveContainer.install([this.pixiApplication, this.pixiGUIApplication], true)

		return this
	}

	async init({
		initialReels = getRandomLoseReels(),
		currencyCode,
		betsOptions,
		bet,
		minimalBet,
		maximalBet,
		balance,
		coefficients,
		accounts,
		buyFeatureBetMultiplier,
		locale
	}) {
		// ADJUSTING RESOLUTION...
		const highestResolution = window.devicePixelRatio
		const lowestResolution = Math.min(1.5, highestResolution)
		const resolutionDelta = highestResolution - lowestResolution

		if (this.vfxLevel) {
			this.pixiApplication.renderer.resolution = Math.max(lowestResolution, this.vfxLevel)
		} else {

			const vfxLevel = await getVFXLevel({
				pixiApplication: this.pixiApplication
			})

			this.pixiApplication.renderer.resolution = lowestResolution + resolutionDelta * vfxLevel
			this.vfxLevel = vfxLevel
		}
		// ...ADJUSTING RESOLUTION

		// FETCHING DICTIONARY...
		if (!this.dictionary) {
			this.dictionary = await getDictionary(this.languageCode)
		}
		// ...FETCHING DICTIONARY

		this.assets = await getPreloadingAssets(this.preloadingAssetsMap, this.vfxLevel)
		this.initBitmapFonts(accounts)
		this.initLoadingScreen(this.assets)
		AdaptiveContainer.onResize()

		this.assets = await getAssets(this.assetsMap, this.vfxLevel)
		this.audio.load(this.audioMap)
		await this.guiView.init({
			gameAssets: this.assets,
			dictionary: this.dictionary,
			currencyCode,
			vfxLevel: this.vfxLevel,
			buyFeatureBetMultiplier,
			coefficients,
			isLTRTextDirection: this.isLTRTextDirection,
			isMobileApplicationClient: this.isMobileApplicationClient,
			isSpecialMobileApplicationClient: this.isSpecialMobileApplicationClient,
			locale,
			audio: this.audio
		})

		this.initCamera()
		this.initBackground()
		this.initBank()
		this.initReels({initialReels, coefficients})
		this.initSplashScreens()
		this.pixiApplication.stage.addChild(this.loadingScreen)
		this.pixiApplication.renderer.backgroundColor = 0x0a153d
		this.initInteractiveLayer()
		AdaptiveContainer.onResize()
		await this.reelsView.preRenderSymbols()
		this.guiView.alpha = 0


		this.guiView.refresh({
			dictionary: this.dictionary,
			currencyCode,
			betsOptions,
			autoplayOptions: [5, 10, 25, 50, 100, Infinity],
			balance,
			payout: 0,
			bet,
			minimalBet,
			maximalBet,
			accounts,
		})

		this.guiView.onAutoplaySpinsCountChange = (spinsCount) => {
			this.remainingAutoSpinsCount = spinsCount
			this.guiView.refresh({remainingAutoSpinsCount: spinsCount})
		}

		this.guiView.onTurboToggle = (isTurboMode) => {
			this.gamePlayTimeScale = isTurboMode ? TURBO_MODE_TIME_SCALE : 1
			this.isTurboMode = isTurboMode
			this.setGamePlayTimeScale()
		}

		this.guiView.onSkipRequested = () => { this.skip() }
		this.guiView.visible = true


		await this.loadingScreen.presentInteractionRequest(this.assets)

		const isSignedIn = accounts.find(account => account.isActive)

		isSignedIn && this.guiView.requestFullScreen()

		await Promise.all([
			this.loadingScreen.hide((progress) => {
				this.guiView.alpha = progress
			}).then(() => {
				this.pixiGUIApplication.view.style['pointer-events'] = 'auto'
				isSignedIn && this.guiView.requestFullScreen()
				this.loadingScreen.destroy()
			}),
			this.presentIntro()
		])
	}

	initLoadingScreen() {
		const {
			pixiApplication: {stage},
			assets,
			dictionary,
			isMobileDevice,
		} = this

		this.loadingScreen = stage
			.addChild
			(
				new LoadingScreen({
					assets,
					dictionary,
					isMobileDevice
				})
			)
	}

	initBackground() {
		const {
			pixiApplication: {stage},
			assets,
			vfxLevel,
			isMobileDevice
		} = this

		this.backgroundView = stage.addChild(
			new BackgroundView(assets))
	}

	initReels({
		initialReels,
		coefficients,
	}) {
		const {
			pixiApplication: {stage, renderer},
			assets,
			dictionary,
			vfxLevel,
			isMobileDevice,
			camera,
			audio
		} = this

		this.reelsView = stage.addChild(
			new ReelsView({
				initialSymbolsIds: initialReels,
				assets,
				renderer,
				dictionary,
				coefficients,
				vfxLevel,
				isMobileDevice,
				camera,
				audio
			}))

		this.reelsView.infoBarView = this.guiView.infoBarView
		this.bankView.attachReels(this.reelsView)

		// this.reelsView.alpha = 0
		window.flipFactor = 0.25


		this.reelsView.alpha = 0
				window.flipFactor = 10


		window.flipFactor = 0.25 * 0.65
		this.reelsView.alpha = 1
		this.bankView.setFlip(0)
	}

	initBank() {
		const {
			pixiApplication: {stage},
			assets,
			vfxLevel,
			audio
		} = this

		this.skyView = stage.addChild(new SkyView(assets, vfxLevel))
		this.bankView = stage.addChild(
			new BankView({assets, vfxLevel, audio})
		)

		this.bankView.skyView = this.skyView
	}

	initSplashScreens() {
		const {
			pixiApplication: {stage, renderer},
			assets,
			dictionary,
			isMobileDevice,
			camera,
			vfxLevel,
			audio
		} = this

		const awardView = new AwardView({assets, vfxLevel, audio})

		this.bonusAwardSplashScreen = stage
			.addChild(new BonusAwardSplashScreen({
				camera,
				assets,
				renderer,
				dictionary,
				isMobileDevice,
				awardView,
				audio
			}))
		this.bonusPayoutSplashScreen = stage
			.addChild(new BonusPayoutSplashScreen({
				camera,
				assets,
				renderer,
				dictionary,
				isMobileDevice,
				awardView,
				audio
			}))
		this.bigWinPayoutSplashScreen = stage
			.addChild(new BigWinPayoutSplashScreen({
				camera,
				assets,
				renderer,
				dictionary,
				isMobileDevice,
				awardView,
				audio
			}))

		this.splashScreens = [
			this.bonusAwardSplashScreen,
			this.bonusPayoutSplashScreen,
			this.bigWinPayoutSplashScreen
		]
	}

	initInteractiveLayer() {
		const {
			pixiApplication: { stage },
		} = this

		this.interactiveLayerView = stage.addChild(new InteractiveLayerView)
		this.interactiveLayerView.onClick = () => { this.skip() }
	}

	initCamera() {
		this.camera = new Camera(this.pixiApplication.stage)
	}

	async initBitmapFonts(accounts) {
		const bitmapPhrases = []
		Object.values(this.dictionary).forEach(text => bitmapPhrases.push(text))

		TextField.fontStyles.default =  {
			fontFamily: "Helvetica",
			dropShadow: true,
			dropShadowDistance: 5,
			dropShadowAngle: Math.PI / 2,
			dropShadowColor: 0x190445,
			fontWeight: 'bold',
			fontSize:  45,
			fill: ['#FFFFFF', '#CCCCCC'],
		}

		const defaultCharacterSet = ' 0123456789x:,./ABCDEFGHIJKLMNOPQRSTUVWXYZ∞-|½×='
		BitmapFont.from(
			"default",
			TextField.fontStyles.default,
			{
				chars: this.isLTRTextDirection
					? [new Set([
						...(accounts.map(({name}) => name).join('').split('')),
						...(bitmapPhrases.join('').split('')),
						...defaultCharacterSet
					])]
					: [...defaultCharacterSet]
			}
		)
	}

	// API...
	destroy() {
		AdaptiveContainer.uninstall()
		Ticker.shared.stop()
		this.pixiApplication.stage.destroy(true)
		Timeline.destroy()
	}

	skip() {
		this.guiView.refresh({isSkipExpected: false})
		this.interactiveLayerView.setInteractive(false)
		this.reelsView.setInteractive(false)
		this.setGamePlayTimeScale(4)
	}

	setGamePlayTimeScale(scale = 1) {
		const turboMultiplier = this.isTurboMode ? TURBO_MODE_TIME_SCALE : 1
		const finalTimeSale = scale * turboMultiplier
		this.reelsView?.setTimeScale(finalTimeSale)
		this.bankView?.setTimeScale(finalTimeSale)

		this.audio?.setTimeScale(scale)
	}

	async getUserInput({
		bet,
		balance,
		betsOptions,
		payout = 0,
		currencyCode,
		winCurrencyCode,
		minimalBet,
		maximalBet,
		activeBonusDescriptor,
		accounts
	}) {
		this.setGamePlayTimeScale()

		this.guiView.refresh({
			bet,
			balance,
			betsOptions,
			currencyCode,
			winCurrencyCode,
			minimalBet,
			maximalBet,
			isSpinExpected: true,
			isSkipExpected: false,
			activeBonusDescriptor,
			payout,
			accounts
		})


		this.interactiveLayerView.setInteractive(false)
		this.reelsView.refreshPayoutsInfo(bet)
		this.reelsView.setInteractive()

		this.remainingAutoSpinsCount = Math.max(0, this.remainingAutoSpinsCount - 1)
		if (this.remainingAutoSpinsCount) {
			return { key: 'make_bet' }
		}

		this.guiView.refresh({
			remainingAutoSpinsCount: this.remainingAutoSpinsCount,
		})

		payout && this.bankView.presentIdle()

		return this.guiView.getUserInput()
	}

	presentBonuses(bonuses = []) {
		this.guiView.presentBonuses(bonuses)
	}


	async presentIntro() {
		this.audio.recoverCookieMuteState()
		this.audio.playMusic()
		// this.assets.music.play({loop: true})
		this.setGamePlayTimeScale()
		this.guiView.refresh({ isSkipExpected: true })
		this.interactiveLayerView.setInteractive()
		this.reelsView.setInteractive(false)
		this.guiView.infoBarView.presentIdle()

		await this.bankView.presentPanorama({
			duration: 2000,
			initialFlipProgress: 0.5,
			flipProgressDelta: 0.5
		})

		this.setGamePlayTimeScale()
		this.guiView.refresh({ isSkipExpected: true })
		this.interactiveLayerView.setInteractive()
		this.reelsView.setInteractive(false)

		await this.bankView.presentIntro()
		this.bankView.presentIdle()
	}

	
	async presentSpinStart({
		balance,
		commonPayout = 0,
		freeSpinsCount,
		currencyCode,
		winCurrencyCode = currencyCode,
		multiplier = 1,
	}) {
		const { reelsView, dictionary, isLTRTextDirection } = this
		const isSkipExpected = false
		const formattedPayout = formatMoney({
			value: commonPayout ?? 0,
			isLTRTextDirection
		})

		this.bankView.presentIdle()
		this.guiView.infoBarView.presentSpinStart()

		this.audio.presentSpinStart()
		this.guiView.presentPopup()

		this.guiView.refresh({
			activePopupName: '',
			remainingAutoSpinsCount: this.remainingAutoSpinsCount,
			isSpinExpected: false,
			isSkipExpected,
			balance,
			payout: commonPayout,
			currencyCode,
			winCurrencyCode
		})

		this.setGamePlayTimeScale()
		this.interactiveLayerView.setInteractive(isSkipExpected)
		reelsView.setInteractive(false)


		// INFO BAR MESSAGE...
		if (commonPayout >= 0) {
			this.presentMessage(dictionary.you_have_won + ' ' + formattedPayout + ' ' + currencyCode)
		} else {
			this.presentMessage(dictionary.good_luck)
		}
		// ...INFO BAR MESSAGE

		this.bankView.presentTension()

		return reelsView.presentSpinStart({
			freeSpinsCount,
			multiplier
		})
	}

	presentSpinStop({
		targetSymbols = getRandomLoseReels(),
		payout,
		isBonusPurchased
	}) {
		this.targetSymbolsIds = targetSymbols.map(reel => reel.map(symbolId => symbolId))
		this.setGamePlayTimeScale()
		this.guiView.refresh({ isSkipExpected: true })
		this.interactiveLayerView.setInteractive()
		this.reelsView.setInteractive(false)

		payout && this.bankView.presentWin()
		
		this.audio.presentSpinStop()

		return this.reelsView.presentSpinStop({
			targetSymbols,
			isBonusPurchased
		})
	}

	presentCascade({
		payout,
		currencyCode,
		corruptionMap,
		patchMap,
		multiplier = 1,
	}) {
		this.guiView.refresh({ isSkipExpected: true, currencyCode })
		this.setGamePlayTimeScale()

		this.audio.presentWin()

		return this.reelsView.presentCascade({
			payout,
			corruptionMap,
			patchMap,
			multiplier,
			currencyCode
		})
	}

	async presentWin({
		payout,
		coefficient,
		commonPayout,
		currencyCode
	}) {
		this.setGamePlayTimeScale()
		const {
			reelsView,
		} = this
		
		this.guiView.refresh({
			isSkipExpected: true,
			payout: commonPayout,
			currencyCode
		})
		this.interactiveLayerView.setInteractive()
		this.reelsView.setInteractive(false)

		reelsView
			.presentWin({
				totalPayout: payout,
				coefficient,
			})

		this.guiView.infoBarView.presentCommonPayout({payout, currencyCode})
	}

	async presentFreeSpinsAward({awardedFreeSpinsCount, freeSpinsCount}) {
		this.guiView.refresh({ isSkipExpected: true })

		this.interactiveLayerView.setInteractive()
		this.reelsView.setInteractive(false)
		this.setGamePlayTimeScale()
		this.guiView.infoBarView.presentFreeSpinsAward({
			scattersCount: this.reelsView.getScattersCount(),
			freeSpinsCount: awardedFreeSpinsCount
		})

		this.audio.presentBigWin()
		this.camera.setAngle(0)
		await this.bankView.presentFreeSpinsAward(freeSpinsCount)

		this.guiView.refresh({ isSkipExpected: false })
		this.interactiveLayerView.setInteractive(false)
		this.setGamePlayTimeScale()

		return this.bonusAwardSplashScreen.presentAward({
			awardedFreeSpinsCount
		})
	}
	

	presentLose() {
		this.guiView.infoBarView.presentLose()
		this.bankView.presentLose()
		this.presentMessage(this.dictionary.no_luck)
	}


	async presentTransitionToBonusGame({
		awardedFreeSpinsCount,
		multiplier
	}) {
		this.setGamePlayTimeScale()
		this.guiView.refresh({ isSkipExpected: false })
		this.interactiveLayerView.setInteractive(false)
		this.reelsView.setInteractive(false)

		this.guiView.infoBarView.presentFreeSpinsAward({
			scattersCount: this.reelsView.getScattersCount(),
			freeSpinsCount: awardedFreeSpinsCount
		})
		this.audio.presentFreeSpinsIntro()
		await this.reelsView.presentFreeSpinsAward(awardedFreeSpinsCount)
		this.audio.presentBigWin()
		await this.bonusAwardSplashScreen.presentAward({awardedFreeSpinsCount, awardedKeysCount: 5})
		
		this.setGamePlayTimeScale()
		this.guiView.refresh({ isSkipExpected: true })
		this.interactiveLayerView.setInteractive()
		this.reelsView.setInteractive(false)
		await this.bankView.presentTransitionToFreeSpinsPart1(multiplier)


		this.setGamePlayTimeScale()
		this.guiView.refresh({ isSkipExpected: true })
		this.interactiveLayerView.setInteractive()
		this.reelsView.setInteractive(false)
		return this.bankView.presentTransitionToFreeSpinsPart2(awardedFreeSpinsCount)
	}


	async presentTransitionToDefaultGame({payout, balance, currencyCode, multiplier}) {
		this.setGamePlayTimeScale()
		this.guiView.refresh({ isSkipExpected: false })
		this.interactiveLayerView.setInteractive(false)
		this.reelsView.setInteractive(false)

		this.guiView.infoBarView.presentCommonPayout({payout, delay: 10000, currencyCode})
		this.audio.presentBigWin()
		await this.reelsView.presentFreeSpinsAward(0)
		
		await this.bonusPayoutSplashScreen.presentPayout(payout)
		this.interactiveLayerView.setInteractive(true)
		this.guiView.refresh({ isSkipExpected: true })
		const {isLTRTextDirection} = this
		const formattedPayout = formatMoney({
			value: payout,
			currencyCode,
			isLTRTextDirection
		})

		this.presentMessage(
			isLTRTextDirection
				? this.dictionary.you_have_won + ' ' + formattedPayout
				: formattedPayout + ' ' + this.dictionary.you_have_won
		)

		this.guiView.refresh({balance, payout })
		this.setGamePlayTimeScale()
		this.guiView.refresh({ isSkipExpected: true })
		this.interactiveLayerView.setInteractive()
		this.reelsView.setInteractive(false)

		await Promise.all([
			this.reelsView.presentFreeSpinsCount(0),
			this.bankView.presentTransitionFromFreeSpinsPart1(multiplier)
		])

		this.setGamePlayTimeScale()
		this.guiView.refresh({ isSkipExpected: true })
		this.interactiveLayerView.setInteractive()
		this.reelsView.setInteractive(false)

		return this.bankView.presentTransitionFromFreeSpinsPart2()
	}

	presentTotalWin({
		totalCoefficient,
		totalPayout,
		currencyCode,
		balance
	}) {
		this.setGamePlayTimeScale()
		this.guiView.infoBarView.presentCommonPayout({payout: totalPayout, currencyCode})
		if(totalCoefficient < WIN_COEFFICIENTS.BIG) return

		this.guiView.refresh({
			isSkipExpected: false ,
			balance: balance - totalPayout,
			currencyCode
		})
		this.interactiveLayerView.setInteractive(false)

		this.audio.presentBigWin()
		return this.bigWinPayoutSplashScreen.presentPayout({
			coefficient: totalCoefficient,
			payout: totalPayout,
		})
	}

	presentMessage(text) {
		return this.guiView.presentMessage(text)
	}

	presentError(errorCode) {
		this.setGamePlayTimeScale()
		this.reelsView.reset()
		this.remainingAutoSpinsCount = 0
		this.guiView.refresh({
			isSkipExpected: false,
			remainingAutoSpinsCount: 0,
			errorText: this.dictionary['error_' + errorCode] ?? errorCode
		})

		this.guiView.presentError(errorCode)

		this.bankView.presentLose()

		this.interactiveLayerView.setInteractive(false)
	}

	dropRemainingAutoSpinsCount() {
		this.remainingAutoSpinsCount = 0
		this.guiView.refresh({
			remainingAutoSpinsCount: 0,
		})
	}

	presentNetworkStatus(isResponsive = true) {
		if(!isResponsive) {
			this.interactiveLayerView.setInteractive(false)
			this.reelsView.setInteractive(false)
		}

		this.guiView.presentNetworkStatus(isResponsive)
	}

	setAdaptiveDesignOffsets({
		offsetTop = 0,
		offsetBottom = 0,
	}) {
		this.bankView?.setAdaptiveDesignOffsets({offsetTop, offsetBottom})
		this.skyView?.setAdaptiveDesignOffsets({offsetTop, offsetBottom})
		this.splashScreens?.forEach(view => view.setAdaptiveDesignOffsets({offsetTop, offsetBottom}))
		this.guiView?.setAdaptiveDesignOffsets({offsetTop, offsetBottom})
	}

	resolve() {
		this.guiView.resolve?.({})
	}


	setAudioPaused(isPaused = true) {
		this.audio.setPaused(isPaused)
	}
	// ...API
}