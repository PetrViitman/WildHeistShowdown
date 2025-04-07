import { Application, Sprite } from "pixi.js";
import { AdaptiveContainer } from "../adaptiveDesign/AdaptiveContainer";
import { createAtlas,extractHighResolutionSymbols } from "./GUIGraphics";
import { ButtonSpinView } from "./buttons/ButtonSpinView";
import { ButtonSkipView } from "./buttons/ButtonSkipView";
import { ButtonBetMoreView } from "./buttons/ButtonBetMoreView";
import { ButtonBetLessView } from "./buttons/ButtonBetLessView";
import { ButtonInfoView } from "./buttons/ButtonInfoView";
import { ButtonTurboView } from "./buttons/ButtonTurboView";
import { ButtonAutoplayView } from "./buttons/ButtonAutoplayView";
import { BottomGradientView } from "./BottomGradientView";
import { IndicatorBalanceView } from "./indicators/IndicatorBalanceView";
import { IndicatorBetView } from "./indicators/IndicatorBetView";
import { IndicatorWinView } from "./indicators/IndicatorWinView";
import { InfoBarView } from "./indicators/infoBar/InfoBarView";
import { ButtonFullScreenView } from "./buttons/ButtonFullScreenView";
import { Timeline } from "../../timeline/Timeline";
import { OverlayView } from "./OverlayView";
import { BetSelectorView } from "./selectors/bet/BetSelectorView";
import { AutoplaySelectorView } from "./selectors/AutoplaySelectorView";
import { AccountSelectorView } from "./selectors/accounts/AccountSelectorView";
import { ButtonBuyFeatureView } from "./buttons/ButtonBuyFeatureView";
import { BuyFeatureSelectorView } from "./selectors/buyFeature/BuyFeatureSelectorView";
import { PaytableView } from "./scrollable/paytable/PaytableView";
import { BonusPanelView } from "./bonuses/BonusPanelView";
import { BonusSelectorView } from "./scrollable/bonusSelector/BonusSelectorView";
import { ButtonBonusView } from "./buttons/ButtonBonusView";
import { ButtonHomeView } from "./buttons/ButtonHomeView";
import { ButtonAudioView } from "./buttons/ButtonAudioView";
import { NetworkStatusView } from "./NetworkStatusView";
import { isIOS } from "../../Constants";


export class GUIView extends AdaptiveContainer {
    bottomGradientView
    buttonSpinView
    buttonSkipView
    buttonBetView
    buttonBetMoreView
    buttonBetLessView
    buttonInfoView
    buttonAutoplayView
    buttonTurboView
    buttonFullScreenView
    buttonBuyFeatureView
    buttonBonusView
    buttonAudioView
    buttonHomeView

    indicatorBalanceView
    indicatorBetView
    indicatorWinView
    infoBarView

    networkStatusView
    betSelectorView
    autoplaySelectorView
    buyFeatureSelectorView
    popupsViews = []
    activePopupName
    activePopupView

    bonusPanelView

    paytableView
    bonusSelectorView
    windowsViews = []
    activeWindowName
    activeWindowView

    leftCornerGroupView
    audioGroupView
    bottomGroupView
    leftSideGroupView
    rightSideGroupView

    FPS = 0
    resolve = undefined
    isHidden = false
    isSpinExpected = false
    isSkipExpected = false
    activePopupName = ''
    currencyCode = ''
    betsOptions = []
    formattedBetsOptions = []
    autoplayOptions = []
    payout = 0
    balance = 0
    bet = 0
    betIndex = 0
    isTurboMode = false
    remainingAutoSpinsCount = 0
    dictionary = {}
    accounts = []
    fullScreeRequestTimeline = new Timeline
    timeline = new Timeline
    invalidSettingsResponseTimeline = new Timeline
    audio

    isFullscreenModeAvailable
    
    async init({
        gameAssets,
        dictionary,
        currencyCode = 'FUN',
        vfxLevel,
        buyFeatureBetMultiplier,
        coefficients,
        isLTRTextDirection = true,
        isMobileApplicationClient = false,
        isSpecialMobileApplicationClient = false,
        locale,
        audio
    }) {

        const assets = await createAtlas({assets: gameAssets, vfxLevel})
        for (const [key, value] of Object.entries(gameAssets)) {
            assets[key] = value
        }

        this.isMobileApplicationClient = isMobileApplicationClient
        this.isSpecialMobileApplicationClient = isSpecialMobileApplicationClient
        this.isFullscreenModeAvailable = !isMobileApplicationClient && !isIOS

        //extractHighResolutionSymbols(gameAssets)

        this.audio = audio
        this.initBonusPanel(assets, dictionary)
        this.initOverlay(assets)
        this.initGradient(assets)
        this.initButtons(assets, isMobileApplicationClient, isSpecialMobileApplicationClient)
        this.initIndicators({assets, dictionary, isLTRTextDirection})
        this.initBetSelector({assets, dictionary, currencyCode, isLTRTextDirection})
        this.initBuyFeatureSelector({assets, dictionary, currencyCode, buyFeatureBetMultiplier, isLTRTextDirection})
        this.initAutoplaySelector({assets, dictionary})
        this.initAccountSelector({assets, dictionary})
        this.initNetworkStatus(assets)
        await this.initPaytable({assets, dictionary, coefficients, isLTRTextDirection})
        this.initBonusSelector({assets, dictionary, isLTRTextDirection, locale})
    }

    initBonusPanel(assets, dictionary) {
        const view = new BonusPanelView({assets, dictionary, audio: this.audio})

        view.onButtonCloseClick = () => {
            this.resolve?.({
                key: 'trigger_bonus',
            })
        }
        this.bonusPanelView = this.addChild(view)
    }

    initOverlay(assets) {
        this.overlayView = this.addChild(new OverlayView(assets))
        this.overlayView.alpha = 0
        this.overlayView.visible = false
        this.overlayView.onClick = () => {
            if (this.activePopupView?.canBeDismissed()) {
                this.presentPopup()
            }

            this.activePopupView?.onOverlayClick()
        }
    }

    initBetSelector({assets, dictionary, currencyCode, isLTRTextDirection}) {
        this.betSelectorView = this.addChild(new BetSelectorView({assets, dictionary, currencyCode, isLTRTextDirection, audio: this.audio}))
        this.betSelectorView.infoBarView = this.infoBarView
        this.betSelectorView.onOptionSelected = (bet) => {
            this.resolve?.({
                key: 'change_bet',
                value: bet
            })
        }

        this.betSelectorView.onSelectedBetIsTooSmall = () => {
            this.buttonSpinView.setInteractive(false)
            this.buttonBetLessView.setInteractive(false)
        }

        this.betSelectorView.onSelectedBetIsTooBig = () => {
            this.buttonSpinView.setInteractive(false)
            this.buttonBetMoreView.setInteractive(false)
        }
        this.popupsViews.push(this.betSelectorView)
    }

    initBuyFeatureSelector({
        assets,
        dictionary,
        currencyCode,
        buyFeatureBetMultiplier,
        isLTRTextDirection,
    }) {
        this.buyFeatureSelectorView = this.addChild(
            new BuyFeatureSelectorView({
                assets,
                dictionary,
                currencyCode,
                buyFeatureBetMultiplier,
                isLTRTextDirection,
                audio: this.audio
            })
        )

        this.buyFeatureSelectorView.infoBarView = this.infoBarView
        this.buyFeatureSelectorView.onPurchaseRequest = () => {
            this.resolve?.({
                key: 'buy_feature',
                value: this.bet
            })
        }  
        this.popupsViews.push(this.buyFeatureSelectorView)
    }

    initAutoplaySelector({assets, dictionary}) {
        this.autoplaySelectorView = this.addChild(
            new AutoplaySelectorView({assets, dictionary})
        )

        /*
        this.autoplaySelectorView.onOptionSelected = (selectedOptionIndex) => {
            // this.onAutoplaySpinsCountChange?.(this.autoplayOptions[selectedOptionIndex])
            // this.remainingAutoSpinsCount = this.autoplayOptions[selectedOptionIndex]
        }
        */

        this.popupsViews.push(this.autoplaySelectorView)
    }

    initAccountSelector({assets, dictionary}) {
        this.accountSelectorView = this.addChild(
            new AccountSelectorView({assets, dictionary, audio: this.audio})
        )

        this.accountSelectorView.onAccountSwitchRequest = async account => {
            this.accountSelectorView.setLocked()
            this.presentNetworkStatus(false)
            await this.presentPopup()
            this.presentNetworkStatus(true)
            this.accountSelectorView.setLocked(false)
            this.resolve?.({
                key: 'change_account',
                value:  account
            })
        }

        this.popupsViews.push(this.accountSelectorView)
    }

    async initPaytable({assets, dictionary, coefficients, isLTRTextDirection}) {
        const view = new PaytableView()
        this.paytableView = this.addChild(view)
        await view.init({assets, dictionary, coefficients, isLTRTextDirection, audio: this.audio})
        view.visible = false
        view.alpha = 0
        view.onButtonCloseClick = () => {
            this.presentWindow()
        }
        view.onOverlayClick = () => {
            this.presentWindow()
        }

        this.windowsViews.push(view)
    }

    async initBonusSelector({assets, dictionary, isLTRTextDirection, locale}){
        const view = new BonusSelectorView()
        await view.init({
            assets,
            dictionary,
            isLTRTextDirection,
            locale,
            audio: this.audio,
            isMobileApplicationClient: this.isMobileApplicationClient
        })
        view.visible = false
        view.alpha = 0
        view.onButtonCloseClick = () => {
            this.presentWindow()
        }
        view.onOverlayClick = () => {
            this.presentWindow()
        }

        view.onBonusActivationRequest = (bonusDescriptor) => {
            this.presentWindow()
            this.resolve?.({
                key: 'trigger_bonus',
                value:  bonusDescriptor
            })

        }

        this.bonusSelectorView = this.addChild(view)

        this.windowsViews.push(view)
    }

    initNetworkStatus(assets) {
        const view = new NetworkStatusView(assets)
        this.networkStatusView = this.addChild(view)
    }

    presentWindow(name)  {
        const windowsMap = {
            'bonuses': this.bonusSelectorView,
            'paytable': this.paytableView,
        }

        const oldWindowView = windowsMap[this.activeWindowName]
        const newWindowView = windowsMap[name]


        this.activeWindowName = name
        this.activeWindowView = newWindowView


        if(newWindowView) {
            this.activePopupName = undefined
        }

        this.refresh()
        
        const {activePopupView, overlayView} = this

        this.windowsViews.forEach(view => { view.visible = false })
        this.timeline
            .wind(1)
            .deleteAllAnimations()
            .addAnimation({
                duration: 250,
                onStart: () => {
                    if (!newWindowView) {
                        this.onWindowVisibleStateChanged?.(false)
                    }
                },
                onProgress: progress => {
                    const regress = 1 - progress

                    if(oldWindowView) {
                        oldWindowView.alpha = Math.min(oldWindowView.alpha, regress)
                        oldWindowView.visible = oldWindowView.alpha > 0
                    }

                    if(newWindowView) {
                        newWindowView.alpha = Math.max(newWindowView.alpha, progress)
                        newWindowView.visible = newWindowView.alpha > 0
                    }

                    if(activePopupView) {
                        activePopupView.alpha = Math.min(activePopupView.alpha, regress)
                        activePopupView.visible = activePopupView.alpha > 0

                        overlayView.alpha = Math.min(overlayView.alpha, regress)
                        overlayView.visible = overlayView.alpha > 0
                    }
                },
                onFinish: () => {
                    this.refresh()
                    this.activePopupView = undefined

                    if (newWindowView) {
                        this.onWindowVisibleStateChanged?.(true)
                    }
                }
            })
            .windToTime(1)
            .play()
    }

    initGradient(assets) {
        this.bottomGradientView = this.addChild(new BottomGradientView(assets))
    }

    initButtons(
        assets,
        isMobileApplicationClient,
        isSpecialMobileApplicationClient
    ) {
        const {audio} = this
        const leftCornerGroupView = this.addChild(new AdaptiveContainer)
            .stickTop()
            .stickLeft()
            .setTargetArea({x: 0, y: 0, width: 1, height: 1})
            .setSourceArea({width: 600, height: 600})

        this.leftCornerGroupView = leftCornerGroupView

        const audioGroupView = this.addChild(new AdaptiveContainer)
            .stickRight()

        this.audioGroupView = audioGroupView

        const bottomGroupView = this.addChild(new AdaptiveContainer)
            .setSourceArea({width: 1000, height: 480})

        this.bottomGroupView = bottomGroupView

        const rightSideGroupView = this.addChild(new AdaptiveContainer)
            .setSourceArea({width: 850, height: 500})
            .setTargetArea({x: 0, y: 0.1, width: 1, height: 0.8})
            .stickRight()

        this.rightSideGroupView = rightSideGroupView

        const leftSideGroupView = this.addChild(new AdaptiveContainer)
            .setSourceArea({width: 1000, height: 500})
            .setTargetArea({x: 0, y: 0.25 * 0.9, width: 1, height: 0.5 * 0.9})
            .stickLeft()

        this.leftSideGroupView = leftSideGroupView

        const buttonsViews = [
            new ButtonSpinView(assets, audio),
            new ButtonSkipView(assets, audio),
            new ButtonBetMoreView(assets, audio),
            new ButtonBetLessView(assets, audio),
            new ButtonTurboView(assets, audio),
            new ButtonAutoplayView(assets, audio),
            new ButtonInfoView(assets, audio),
            new ButtonBuyFeatureView(assets, audio),
            new ButtonBonusView(assets, audio),
            new ButtonAudioView(assets, audio),
        ]

        buttonsViews.forEach(view => { bottomGroupView.addChild(view) })

        this.buttonSpinView = buttonsViews[0]
        this.buttonSkipView = buttonsViews[1]
        this.buttonBetMoreView = buttonsViews[2]
        this.buttonBetLessView = buttonsViews[3]
        this.buttonTurboView = buttonsViews[4]
        this.buttonAutoplayView = buttonsViews[5]
        this.buttonInfoView = buttonsViews[6]
        this.buttonBuyFeatureView = buttonsViews[7]
        this.buttonBonusView = buttonsViews[8]
        this.buttonAudioView = buttonsViews[9]

        this.buttonBonusView.scale.set(0.5)
        this.buttonBuyFeatureView.scale.set(0.5)
        this.buttonInfoView.scale.set(0.5)
        this.buttonAudioView.scale.set(0.5)

        if (isMobileApplicationClient && !isSpecialMobileApplicationClient) {
            this.buttonHomeView = new ButtonHomeView(assets, audio)
            this.buttonHomeView.y = 50
            this.buttonHomeView.scale.set(0.5)
            this.buttonHomeView.onClick = () => {
                this.resolve?.({ key: 'home' })
            }

            this.leftCornerGroupView.addChild(this.buttonHomeView)
        } else if (this.isFullscreenModeAvailable) {
            this.buttonFullScreenView = new ButtonFullScreenView(assets, audio)
            this.buttonFullScreenView.scale.set(0.5)
            this.buttonFullScreenView.onClick = () => {
                if(document.fullscreenElement) {
                    this.exitFullscreen()
                } else {
                    this.requestFullScreen() 
                }
            }
        }

        this.buttonsViews = buttonsViews
        this.audioGroupView.addChild(this.buttonAudioView)

        this.leftSideGroupView.addChild(
            this.buttonInfoView,
            this.buttonBuyFeatureView,
            this.buttonBonusView
        )

        this.buttonFullScreenView && this.leftSideGroupView.addChild(this.buttonFullScreenView)
       
        this.buttonAutoplayView.onClick = () => {
            if(!this.remainingAutoSpinsCount) {
                this.presentPopup('autoplay')
            } else {
                this.onAutoplaySpinsCountChange?.(0)
            }
        }

        this.buttonInfoView.onClick = () => {
            this.presentWindow('paytable')
        }

        this.buttonAudioView.onClick = () => {
            this.buttonAudioView.setMuted(!this.buttonAudioView.isMuted)

            this.audio.setMuted({isMuted: this.buttonAudioView.isMuted})
            // this.onAutoplaySpinsCountChange?.(this.autoplayOptions[this.autoplaySelectorView.getSelectedOptionIndex()])
        }

        this.buttonSpinView.onClick = () => {
            if(this.activePopupName === 'autoplay') {
                this.onAutoplaySpinsCountChange?.(this.autoplayOptions[this.autoplaySelectorView.getSelectedOptionIndex()])
            }

            this.resolve?.({ key: 'make_bet', value:  this.betsOptions[this.betIndex] })
            this.buttonSkipView.presentClick()
            this.requestFullScreen()
        }
        this.buttonSkipView.onClick = () => {
            this.onSkipRequested?.()
			this.isSkipExpected = false
            this.buttonSpinView.presentClick()
        }

        this.buttonBetMoreView.onClick = () => {
            const { betsOptions } = this
            this.betIndex = Math.min(betsOptions.length - 1, this.betIndex + 1)
            this.resolve?.({
                key: 'change_bet',
                value:  betsOptions[this.betIndex]
            })

            this.betSelectorView.forceSelect({optionIndex: this.betIndex, dropUserInput: true})
        }
        this.buttonBetLessView.onClick = () => {
            const { betsOptions } = this
            this.betIndex = Math.max(0, this.betIndex - 1)
            this.resolve?.({
                key: 'change_bet',
                value: betsOptions[this.betIndex]
            })

            this.betSelectorView.forceSelect({optionIndex: this.betIndex, dropUserInput: true})
        }

        this.buttonTurboView.onClick = () => {
            this.isTurboMode = !this.isTurboMode
            this.onTurboToggle?.(this.isTurboMode)
            this.buttonTurboView.setActive(this.isTurboMode)
        }


        this.buttonBuyFeatureView.onClick = () => {
            if(!this.maximalBet) {
                this.resolve?.({ key: 'request_sign_in' })
                return
            }
            this.presentPopup('buy')
        }

        this.buttonBonusView.onClick = () => {
            this.resolve?.({ key: 'request_bonuses' })
            this.presentPopup()
        }
        
        audio.onAudioReady = () => this.buttonAudioView.onAudioReady()
    }

    

    initIndicators({assets, dictionary, isLTRTextDirection}) {
        const {bottomGroupView} = this

        this.indicatorBalanceView = bottomGroupView.addChild(new IndicatorBalanceView({assets, isLTRTextDirection}))
        this.indicatorBetView = bottomGroupView.addChild(new IndicatorBetView({assets, dictionary, isLTRTextDirection}))
        this.indicatorWinView = bottomGroupView.addChild(new IndicatorWinView({assets, isLTRTextDirection}))
        this.infoBarView = bottomGroupView.addChild(new InfoBarView({assets, dictionary, isLTRTextDirection}))

        this.indicatorBetView.onClick = () => {
            if(!this.maximalBet) {
                this.resolve?.({ key: 'make_bet', value:  this.betsOptions[this.betIndex] })
                return
            }
            this.presentPopup('bet')
        }

        this.indicatorBalanceView.onClick = () => {
            if(!this.maximalBet) {
                this.resolve?.({ key: 'make_bet', value:  this.betsOptions[this.betIndex] })
                return
            }
            this.presentPopup('account')
        }
    }

    updateTargetArea(sidesRatio) {
        const {
            indicatorBalanceView,
            indicatorBetView,
            indicatorWinView,
            infoBarView,
            buttonSpinView,
            buttonSkipView,
            buttonBetLessView,
            buttonBetMoreView,
            buttonTurboView,
            buttonAutoplayView,
            buttonInfoView,
            buttonFullScreenView,
            buttonBuyFeatureView,
            buttonBonusView,
            buttonAudioView,
            bottomGroupView,
            leftSideGroupView,
            rightSideGroupView,
            leftCornerGroupView,
            audioGroupView,

            offsetTop = 0,
            offsetBottom = 0
        } = this

        if(!bottomGroupView) return

        leftCornerGroupView.setTargetArea({x: 0, y: offsetTop, width: 1, height: 1  - offsetBottom})
        buttonFullScreenView?.setFullscreenMode(document.fullscreenElement)


        if (sidesRatio > 1) {
            leftSideGroupView.setTargetArea({
                x: 0.05,
                y: offsetTop + 0.25 * 0.9,
                width: 0.95,
                height: 0.5 * 0.9 - offsetBottom
            })
            rightSideGroupView.addChild(
                buttonSpinView,
                buttonSkipView,
                buttonTurboView,
                buttonAutoplayView
            )

            buttonFullScreenView?.position.set(105, -20 + 75)
            buttonBonusView.position.set(105, 135 + 75)
            buttonInfoView.position.set(105, 250 + 75)
            buttonBuyFeatureView.position.set(105, 365 + 75)

            audioGroupView
                .setSourceArea({width: 850, height: 500})
                .setTargetArea({x: 0, y: 0.1, width: 1, height: 0.8})

            const x = 725
            buttonAudioView.position.set(x, 0)
            buttonAudioView.scale.set(0.25)

            buttonSpinView.position.set(x, 250)
            buttonSpinView.scale.set(0.65)

            buttonSkipView.position.set(x, 250)
            buttonSkipView.scale.set(0.65)
            
            buttonAutoplayView.position.set(x,  125)
            buttonAutoplayView.scale.set(0.5)

            buttonTurboView.position.set(x,375)
            buttonTurboView.scale.set(0.5)

        
            infoBarView.position.set(500, 50)
            infoBarView.scale.set(0.7725)

            const indicatorsY = 125

            buttonBetLessView.position.set(500 - 190, indicatorsY)
            buttonBetLessView.scale.set(0.35)
            buttonBetMoreView.position.set(500 + 190, indicatorsY)
            buttonBetMoreView.scale.set(0.35)

            indicatorBalanceView.position.set(500 - 375, indicatorsY)
            indicatorBalanceView.scale.set(0.75)

            indicatorBetView.position.set(500, indicatorsY)
            indicatorBetView.scale.set(0.75)

            indicatorWinView.position.set(500 + 375, indicatorsY)
            indicatorWinView.scale.set(0.75)

            bottomGroupView.pivot.y = -800
            bottomGroupView
                .setSourceArea({width: 1000, height: 1000})
                .setTargetArea({x: 0.05, y: offsetTop, width: 0.9, height: 1 - offsetBottom})
                .stickBottom()
                .highlight

            this.infoBarView.expand(Math.min(2, Math.max(1.1, sidesRatio * 1)))

        } else {

            buttonAudioView.position.set(950, 150)
            buttonAudioView.scale.set(0.5)

            leftSideGroupView.setTargetArea({
                x: 0,
                y: offsetTop + 0.25 * 0.9,
                width: 1,
                height: 0.5 * 0.9 - offsetBottom
            })

            audioGroupView
                .setSourceArea({width: 1000, height: 500})
                .setTargetArea({x: 0, y: offsetTop + 0.25 * 0.9, width: 1, height: 0.5 * 0.9 - offsetBottom})

            bottomGroupView.addChild(
                buttonSpinView,
                buttonSkipView,
                buttonTurboView,
                buttonAutoplayView
            )

            const isWidePortrait = sidesRatio > 0.6
            const offsetY = isWidePortrait ? 1160 : 1460

            buttonFullScreenView?.position.set(55, 55)
            buttonBonusView.position.set(55, 220)
            buttonInfoView.position.set(55, 405)
            buttonBuyFeatureView.position.set(55, 515)

            buttonSpinView.position.set(500, 360 + offsetY)
            buttonSpinView.scale.set(1.1)

            buttonSkipView.position.set(500, 360 + offsetY)
            buttonSkipView.scale.set(1.1)
            

            buttonTurboView.position.set(500 - 400, 330 + offsetY)
            buttonTurboView.scale.set(0.75)

            buttonBetLessView.position.set(500 - 220, 335 + offsetY)
            buttonBetLessView.scale.set(0.85)
            buttonBetMoreView.position.set(500 + 220, 335 + offsetY)
            buttonBetMoreView.scale.set(0.85)

            buttonAutoplayView.position.set(500 + 400, 330 + offsetY)
            buttonAutoplayView.scale.set(0.75)

            buttonAudioView.position.set(945, 45)


            const indicatorsY = 200  + offsetY
            indicatorBalanceView.position.set(500 - 315, indicatorsY)
            indicatorBalanceView.scale.set(0.75)

            indicatorBetView.position.set(500, indicatorsY)
            indicatorBetView.scale.set(0.75)

            indicatorWinView.position.set(500 + 315, indicatorsY)
            indicatorWinView.scale.set(0.75)


            infoBarView.position.set(500, 125 + offsetY)
            infoBarView.scale.set(0.7725)

            bottomGroupView.pivot.y = 0
            bottomGroupView
                .setSourceArea({width: 1000, height: isWidePortrait ? 1500 : 1800})
                .setTargetArea({
                    x: 0,
                    y: offsetTop,
                    width: 1,
                    height: 0.9 - offsetBottom
                })
                .stickMiddle()

            const infoBarExpansionMultiplier = isWidePortrait ? 1.5 : 2
            this.infoBarView.expand(Math.max(1, sidesRatio * infoBarExpansionMultiplier))
        }
    }


    refresh(parametersMap = {}) {
        for (const [key, value] of Object.entries(parametersMap))
			this[key] = value

        const isBetExpected = !!this.maximalBet

        // DETECTING CLOSEST BET INDEX...
        let closestBetIndex = 0
        let shortestDelta = Infinity
        this.betsOptions.forEach((betOption, i) => {
            const betDelta = Math.abs(betOption - this.bet)
            if (betDelta < shortestDelta) {
                shortestDelta = betDelta
                closestBetIndex = i
            }
        })
        this.betIndex = closestBetIndex
        // ...DETECTING CLOSEST BET INDEX

        this.indicatorWinView.setValue(this.payout, this.winCurrencyCode ?? this.currencyCode)
        this.indicatorBalanceView.setValue(this.balance, this.currencyCode)
        this.indicatorBetView.setValue(this.bet, this.currencyCode)

        this.accountSelectorView.setSelectableOptions(this.accounts)
        this.accountSelectorView.forceSelect()

        this.autoplaySelectorView.setSelectableOptions(this.autoplayOptions)

        this.betSelectorView.setSelectableOptions(this.betsOptions)
        this.betSelectorView.currencyCode = this.currencyCode
        this.betSelectorView.forceSelect({optionIndex: this.betIndex})
        this.betSelectorView.setBetLimits(this.minimalBet, this.maximalBet)

        this.bonusPanelView.presentBonus(this.activeBonusDescriptor)
        this.bonusPanelView.setInteractive(this.activeBonusDescriptor && this.isSpinExpected)

        this.buyFeatureSelectorView.refresh({bet: this.bet, currencyCode: this.currencyCode, maximalBet: this.maximalBet})
        this.paytableView.refresh({bet: this.bet, currencyCode: this.currencyCode})

        const isFreeBet = this.activeBonusDescriptor?.type === 3

        this.buttonBetMoreView.setInteractive(isBetExpected && !isFreeBet && this.isSpinExpected && this.betIndex < this.betsOptions.length - 1)
        this.buttonBetLessView.setInteractive(isBetExpected && !isFreeBet && this.isSpinExpected && this.betIndex > 0)

        this.buttonSpinView.setInteractive(this.isSpinExpected)
        this.buttonSpinView.visible = !this.isSkipExpected
        this.buttonSkipView.visible = this.isSkipExpected
        this.buttonSkipView.setInteractive(this.isSkipExpected)

        this.buttonAutoplayView.presentSpinsCount(this.remainingAutoSpinsCount)
        this.buttonAutoplayView.setInteractive(
            isBetExpected
            && !this.activeBonusDescriptor
            && this.isSpinExpected
            || this.remainingAutoSpinsCount
        )

        this.betSelectorView.setInteractive({
            isMaximalBetButtonInteractive: this.bet < this.maximalBet,
            isMinimalBetButtonInteractive: this.bet > this.minimalBet,
        })

        this.betSelectorView.onMinimalBetRequested = () => {
            this.betIndex = 0
            this.resolve?.({
                key: 'change_bet',
                value:  this.betsOptions[this.betIndex]
            })
            this.betSelectorView.forceSelect({optionIndex: this.betIndex, dropUserInput: true}    
        )}

        this.betSelectorView.onMaximalBetRequested = () => {
            this.betIndex = this.betsOptions.length - 1
            this.resolve?.({
                key: 'change_bet',
                value:  this.betsOptions[this.betIndex]
            })
            this.betSelectorView.forceSelect({optionIndex: this.betIndex, dropUserInput: true}    
        )}


        this.indicatorBetView.setInteractive(
            isBetExpected
            && this.isSpinExpected
            && this.activePopupName !== 'bet'
        )
        this.indicatorBetView.presentBonus(this.activeBonusDescriptor)
        this.indicatorBalanceView.setInteractive(
            isBetExpected
            && this.accounts.find(account => account.isActive)?.id !== -1
            && this.isSpinExpected
            && this.activePopupName !== 'account'
        )

        this.buttonBuyFeatureView.setInteractive(
            !this.activeBonusDescriptor
            && this.isSpinExpected
            && this.activePopupName !== 'buy'
        )
        this.buttonBonusView.setInteractive(
            isBetExpected
            && this.isSpinExpected
            // && this.accounts.find(account => account.isActive)?.id !== -1
            // && this.accounts.find(account => account.isActive)?.isPrimary
            && !this.activeBonusDescriptor
        )


        switch(this.activePopupName) {
            case 'autoplay':
                this.buttonAutoplayView.setInteractive(false)
                break
        }
        
    }

    presentError(errorCode) {
        this.presentPopup()
        this.presentWindow()
        this.fullScreeRequestTimeline.deleteAllAnimations()
        this.exitFullscreen()
    }

    exitFullscreen() {

        document.cancelFullScreen?.()?.catch((err) => {})
        document.webkitCancelFullScreen?.()?.catch((err) => {})
        document.mozCancelFullScreen?.()?.catch((err) => {})
        document.exitFullscreen?.()?.catch((err) => {})
    
        this.fullScreeRequestTimeline
            .deleteAllAnimations()
            .addAnimation({
                duration: 10,
                onFinish: () => {
                    AdaptiveContainer.onResize()
                }
            })
            .play()

        
    }

    getUserInput() {
        this.buttonSpinView.presentIdle()

        return new Promise(resolve => {
            this.resolve = resolve
        })
    }

    presentMessage(text) {
        this.infoBarView.presentMessage(text)
    }

    presentWin(descriptor) {
        this.infoBarView.presentWin(descriptor)
    }

    requestFullScreen() {
        if (!this.isFullscreenModeAvailable) return

        this.fullScreeRequestTimeline
            .deleteAllAnimations()
            .addAnimation({
                duration: 100,
                onFinish: () => {
                    const wrapperHTMLElement = document.body
                    const options = {navigationUI: 'hide'}

                    wrapperHTMLElement.requestFullScreen?.(options)?.catch((err) => {})
                    wrapperHTMLElement.webkitRequestFullScreen?.(options)?.catch((err) => {})
                    wrapperHTMLElement.mozRequestFullScreen?.(options)?.catch((err) => {})
                    wrapperHTMLElement.requestFullscreen?.(options)?.catch((err) => {})
                }
            })
            .play()
    }

    presentPopup(name) {
        const { popupsViews, overlayView } = this
        const popupsMap = {
            'bet': this.betSelectorView,
            'buy': this.buyFeatureSelectorView,
            'autoplay': this.autoplaySelectorView,
            'account': this.accountSelectorView,
        }

        const oldPopupView = popupsMap[this.activePopupName]
        const newPopupView = popupsMap[name]

        oldPopupView?.reelSelectorView?.setEditable(false)

        this.activePopupName = name
        this.activePopupView = newPopupView
        this.refresh()

        this.infoBarView.setVisible(name !== 'account')

        popupsViews.forEach(view => { view.visible = false })
        return this
            .timeline
            .wind(1)
            .deleteAllAnimations()
            .addAnimation({
                duration: 250,
                onProgress: progress => {
                    const regress = 1 - progress

                    if(oldPopupView) {
                        oldPopupView.alpha = Math.min(oldPopupView.alpha, regress)
                        oldPopupView.visible = oldPopupView.alpha > 0
                    }

                    if(newPopupView) {
                        newPopupView.alpha = Math.max(newPopupView.alpha, progress)
                        overlayView.alpha = Math.max(overlayView.alpha, progress)
                        newPopupView.visible = newPopupView.alpha > 0
                    } else {
                        overlayView.alpha = Math.min(overlayView.alpha, regress)
                    }

                    overlayView.visible = overlayView.alpha > 0
                },
                onFinish: () => {
                    this.refresh()
                }
            })
            .windToTime(1)
            .play()
    }

    setAdaptiveDesignOffsets({offsetTop, offsetBottom}) {
        this.offsetTop = offsetTop
        this.offsetBottom = offsetBottom + offsetTop
        this.onResize()

        this.windowsViews.forEach(view => {
            view.setAdaptiveDesignOffsets({offsetTop: 0, offsetBottom})
        })

        this.popupsViews.forEach(view => {
            view.setAdaptiveDesignOffsets({offsetTop: 0, offsetBottom})
        })
    }

    presentBonuses(bonuses) {
        const isPrimaryAccountActive = this.accounts.find(account => account.isActive)?.isPrimary

        this.bonusSelectorView.refresh(bonuses, isPrimaryAccountActive)
        this.presentWindow('bonuses')
    }

    presentNetworkStatus(isResponsive = true) {
        if(!isResponsive) {
            this.refresh({
                isSpinExpected: false
            })
        }

		this.networkStatusView.present(isResponsive)
	}
}