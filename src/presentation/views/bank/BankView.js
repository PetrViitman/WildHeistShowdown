import { Container, Sprite } from "pixi.js";
import { AdaptiveContainer } from "../adaptiveDesign/AdaptiveContainer";
import { Timeline } from "../../timeline/Timeline";
import { FoundationView } from "./FoundationView";
import { BuildingBoxView } from "./BuildingBoxView";
import { WedgesRingView } from "./WedgesRingView";
import { WallRingView } from "./WallRingView";
import { BaseCharacterView } from "./characters/base/BaseCharacterView";
import { ForegroundView } from "./ForegroundView";
import { ExplosionView } from "../reels/explosion/ExplosionView";
import { BurningMoneyPoolView } from "./burningMoney/BurningMoneyPoolView";

export class BankView extends AdaptiveContainer {
    flipProgress = 0
    idleFlipProgress = 0

    contentContainer
    foundationView
    buildingBoxView
    wallRingView

    timeline = new Timeline

    idleFactor = 1

    audio

    constructor({assets, vfxLevel, audio}) {
        super()

        this.audio = audio
        this.vfxLevel = vfxLevel
        this.setSourceArea({width: 600, height: 600})
            // .highlight(0x0055FF, 0.25)

        this.contentContainer = this.addChild(new Container)
        this.contentContainer.position.set(300, 525)
        this.contentContainer.scale.set(0.65)

        // DEBUG...
        const s =this.contentContainer.addChildAt(new Sprite(assets.sunset), 0)
        s.anchor.set(0.5)
        s.scale.set(1 / 0.65 * 2, 1 / 0.65)
        s.x = -50
        s.y = 7
        // ...DEBUG

        this.initFoundation(assets, vfxLevel)
        this.initWedges(assets)
        this.initWallRing(assets)
        this.initBuildingBox(assets)
        this.initBurningMoneyPool(assets, vfxLevel)
        this.initExplosion(assets, vfxLevel)
        this.initForeground(assets)
        
        
        

        let x = 0
        let y = 0
        const boxes = new Array(0).fill(0).map((_, i) => {
            const boxView = this.contentContainer.addChild(new BaseCharacterView(assets))
            


            boxView.x = x - 150
            boxView.y = y - 550 + 410
            boxView.scale.set(0.175)
            //boxView.scale.set(0.5)
            //boxView.scale.set(0.5)

            x += 125

            if (x > 300) {
                x = 0
                y += 50
            }

            if (y > 500) y = 0
            return boxView
        })
        

        new Timeline()
            .addAnimation({
                duration: 20000,
                onProgress: progress => {
                    this.idleFlipProgress = 0.00203125 * Math.sin(Math.PI * 2 * progress)
                    this.setFlip()
                }
            })
            .setLoopMode()
            .play()

        this.setHiddenElementsVisible(false)
    }

    initFoundation(assets, vfxLevel) {
        const foundationView = this
            .contentContainer
            .addChild(new FoundationView(assets, vfxLevel))

        foundationView.position.set(0, 50)
        this.foundationView = foundationView
    }

    initWallRing(assets) {
        const wallRingView = this.wedgesRingView.addChild(new WallRingView(assets))

        wallRingView.zIndex = 2
        wallRingView.position.set(0, -335)

        this.wallRingView = wallRingView
    }

    initWedges(assets) {
        const {vfxLevel, audio} = this
        const wedgesRingView = this.foundationView.addChild(new WedgesRingView({
            assets,
            vfxLevel,
            audio
        }))

        wedgesRingView.zIndex = 3
        wedgesRingView.position.set(0, -118)

        this.wedgesRingView = wedgesRingView
    }

    initBuildingBox(assets) {
        const buildingBoxView = this.wedgesRingView.addChild(new BuildingBoxView(assets))

        buildingBoxView.zIndex = 1


        this.buildingBoxView = buildingBoxView
    }

    initExplosion(assets, vfxLevel) {
        const view = new ExplosionView(assets, vfxLevel)
        view.y = -300

        this.explosionView = this
            .contentContainer
            .addChild(view)
    }

    initBurningMoneyPool(assets, vfxLevel) {
        if(vfxLevel < 0.15) return
        
        const view = new BurningMoneyPoolView(assets)
        view.y = -350
        this.burningMoneyPoolView = this
            .contentContainer
            .addChild(view)
    }

    initForeground(assets) {
        const {vfxLevel, audio} = this

        const view = this.contentContainer.addChild(new ForegroundView({assets, vfxLevel, audio}))
        view.y = 100
        view.y = 75
        this.foregroundView = view
    }

    setFlip(progress = this.flipProgress) {
        // if(this.flipProgress === progress) return

        this.flipProgress = progress

        const finalFlipProgress = (progress + this.idleFlipProgress * this.idleFactor) % 1
        this.skyView?.setFlip((finalFlipProgress * 2) % 1)

        this.foundationView.setFlip(finalFlipProgress)
        this.wedgesRingView.setFlip(finalFlipProgress)
        this.buildingBoxView.setFlip(finalFlipProgress)
        this.wallRingView.setFlip(finalFlipProgress)


        const angle = Math.PI * 2 * finalFlipProgress + Math.PI / 2

        this.reelsView.position.set(
            256 * Math.cos(angle),
            -250,
        )

        this.reelsView.setFlip((finalFlipProgress + 0.25) % 1 )
        this.reelsView.alpha = finalFlipProgress < 0.25 || finalFlipProgress > 0.75 ? 1 : 0


        this.foregroundView.setFlip(finalFlipProgress)
    }

    attachReels(reelsView) {
        this.wedgesRingView.addChild(reelsView)
        reelsView.scale.set(0.3)
        reelsView.zIndex = 900

        this.reelsView = reelsView
        this.explosionView.reelsView = reelsView
        this.explosionView.bankContainer = this.contentContainer

        this.setReelsVisible(false)

        const {multiplierView} = reelsView
        multiplierView.position.set(0, -740)
        multiplierView.scale.set(0.27)

        this.contentContainer.addChild(multiplierView)
    }


    updateTargetArea(sidesRatio) {
        const {
            offsetTop = 0,
            offsetBottom = 0
        } = this

        if(sidesRatio > 1) {
            this.setTargetArea({x: 0, y: offsetTop, width: 1, height: 0.9 - offsetBottom})
        } else {
            this.setTargetArea({x: -0.3, y: offsetTop, width: 1.6, height: 0.9 - offsetBottom})
        }
    }


    onAdjustedToTargetArea() {
        this.foundationView.onResize(
            AdaptiveContainer.width,
            AdaptiveContainer.height
        )
    }


    presentPanorama({
        duration = 3000,
        initialFlipProgress = 0,
        flipProgressDelta = 1
    }) {
        this.setHiddenElementsVisible()

        return this
            .timeline
            .deleteAllAnimations()
            .addAnimation({
                duration,
                onStart: () => {
                    this.setReelsVisible(false)
                    this.foregroundView.setLocked(false)
                    this.reelsView.multiplierView.alpha = 0
                    this.idleFactor = 0
                },
                onProgress: progress => {
                    this.flipProgress = initialFlipProgress + flipProgressDelta * progress
                }
            })
            .play()
    }

    async presentIntro() {
        this.setHiddenElementsVisible()
        await this.foregroundView.presentAssault()
        this.wedgesRingView.presentAssault()
      
        return this
            .timeline
            .deleteAllAnimations()
            .addAnimation({
                duration: 1250,
                onStart: () => {
                    this.foregroundView.setLocked()
                    this.setHiddenElementsVisible(false)
                    this.burningMoneyPoolView?.present()
                    this.setReelsVisible()
                    this.audio.presentExplosion()
                },
                onProgress: progress => {
                    this.explosionView.present(progress)
                    this.idleFactor = Math.min(1, progress * 2)

                    this.reelsView.multiplierView.alpha = Math.max(0, progress - 0.5) / 0.5
                },
            })
            .play()
    }

    presentTransitionToFreeSpinsPart1(multiplier = 1) {
        this.foregroundView.presentIdle()
        return this
            .timeline
            .deleteAllAnimations()
            .addAnimation({
                duration: 3000,
                onStart: () => {
                    this.reelsView.setMasked()
                    this.setHiddenElementsVisible()
                    this.setReelsVisible()
                    this.foregroundView.setLocked(false)
                    this.reelsView.setWrapped()
                    this.idleFactor = 0
                },
                onProgress: progress => {
                    this.flipProgress = progress
                    this.setReelsVisible(progress < 0.5)

                    this.reelsView.multiplierView.presentTransition({
                        initialMultiplier: multiplier,
                        multiplier: 8,
                        progress
                    })
                    
                    /*
                    this.reelsView.multiplierView.presentShift({
                        multiplier: 8,
                        isIncrementing: false,
                        progress
                    })
                    */
                }
            })
            .addAnimation({duration: 3250})
            .play()
    }

    async presentTransitionToFreeSpinsPart2(awardedFreeSpinsCount) {
        await this.foregroundView.presentAssault()

        return this
            .timeline
            .deleteAllAnimations()
            .addAnimation({
                duration: 1250,
                onStart: () => {
                    this.foregroundView.setLocked()
                    this.reelsView.presentRandomSymbols()
		            this.reelsView.setFreeSpinsMode()
                    this.reelsView.presentFreeSpinsCount(awardedFreeSpinsCount)
                    this.reelsView.tensionPoolView?.drop()
                    this.setHiddenElementsVisible(false)
                    this.setReelsVisible()
                    this.reelsView.setWrapped(false)
                    this.wedgesRingView.presentAssault()
                    this.burningMoneyPoolView?.present()
                    this.audio.presentExplosion()
                },
                onProgress: progress => {
                    this.explosionView.present(progress)
                    this.idleFactor = Math.min(1, progress * 2)
                },
            })
            .play()
    }

    presentFreeSpinsAward(freeSpinsCount) {
        return this.reelsView.presentFreeSpinsAward(freeSpinsCount)
    }


    setReelsVisible(isVisible = true) {
        this.reelsView.visible = isVisible
        this.wedgesRingView.setReelsPillarsVisible(!isVisible)
    }


    presentTransitionFromFreeSpinsPart1(multiplier = 1) {
        return this
            .timeline
            .deleteAllAnimations()
            .addAnimation({
                duration: 3000,
                onStart: () => {
                    this.reelsView.setMasked()
                    this.setHiddenElementsVisible()
                    this.setReelsVisible()
                    this.reelsView.setWrapped()
                    this.foregroundView.setLocked(false)
                    this.idleFactor = 0
                    this.foregroundView.presentIdle()
                },
                onProgress: progress => {
                    this.flipProgress = progress
                    this.setReelsVisible(progress < 0.5)

                    this.reelsView.multiplierView.presentTransition({
                        initialMultiplier: multiplier,
                        multiplier: 1,
                        progress
                    })
                }
            })
            .addAnimation({duration: 3250})
            .play()
    }

    async presentTransitionFromFreeSpinsPart2() {
        await this.foregroundView.presentAssault()

        return this
            .timeline
            .deleteAllAnimations()
            .addAnimation({
                duration: 1250,
                onStart: () => {
                    this.foregroundView.setLocked()
                    this.reelsView.presentRandomSymbols()
		            this.reelsView.setFreeSpinsMode(false)
                    this.reelsView.tensionPoolView?.drop()
                    this.setHiddenElementsVisible(false)
                    this.setReelsVisible()
                    this.reelsView.setWrapped(false)
                    this.wedgesRingView.presentAssault()
                    this.burningMoneyPoolView?.present()
                    this.audio.presentExplosion()
                },
                onProgress: progress => {
                    this.explosionView.present(progress)
                    this.idleFactor = Math.min(1, progress * 2)
                },
            })
            .play()
    }

    setTimeScale(scale) {
		this.timeline.setTimeScaleFactor({name: 'scale', value: scale})
        this.foregroundView.setTimeScale(scale)
        this.burningMoneyPoolView?.setTimeScale(scale)
	}

    setHiddenElementsVisible(isVisible = true) {
        this.buildingBoxView.setHiddenElementsVisible(isVisible)
        this.wedgesRingView.setHiddenElementsVisible(isVisible)
        this.foundationView.setHiddenElementsVisible(isVisible)
    }

    presentIdle() {
        this.foregroundView.presentIdle()
        this.wedgesRingView.presentIdle()
    }

    presentWin() {
        this.foregroundView.presentWin()
        this.wedgesRingView.presentShooting()
    }

    presentLose() {
        this.foregroundView.presentLose()
    }

    async presentTransitionToBonusGame() {
        await this.foregroundView.presentIntro()
        this.wedgesRingView.presentAssault()
    }

    async presentTransitionToDefaultGame() {
        await this.foregroundView.presentIntro()
        this.wedgesRingView.presentAssault()
    }

    presentTension() {
        this.foregroundView.presentTension()
        // this.wedgesRingView.presentTension()
    }

    setAdaptiveDesignOffsets({offsetTop, offsetBottom}) {
        this.offsetTop = offsetTop
        this.offsetBottom = offsetBottom + offsetTop
        this.onResize()
    }
}