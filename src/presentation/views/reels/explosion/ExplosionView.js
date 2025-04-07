import { Container, Sprite } from "pixi.js";
import { SmokeBranchView } from "./SmokeBranchView";
import { Timeline } from "../../../timeline/Timeline";
import { SymbolHeartsView } from "../cell/symbols/SymbolHeartsView";
import { SymbolClubsView } from "../cell/symbols/SymbolClubsView";
import { SymbolDiamondsView } from "../cell/symbols/SymbolDiamondsView";
import { SymbolSpadesView } from "../cell/symbols/SymbolSpadesView";
import { BrickView } from "./BrickView";
import { BricksPoolView } from "./BricksPoolView";

const BRANCHES = [
    {
        distance: 750,
        zAngle: Math.PI * 0.75,
        yAngle: -Math.PI / 2.5,
        progressOffset: 0.25,
    },
    {
        distance: 650,
        zAngle: Math.PI * 0.25,
        yAngle: -Math.PI / 2.5,
        progressOffset: 1,
    },



    {
        distance: 750,
        zAngle: Math.PI * 0.65,
        yAngle: -Math.PI / 5,
        progressOffset: 0,
    },
    {
        distance: 750,
        zAngle: Math.PI * 0.35,
        yAngle: -Math.PI / 5,
        progressOffset: 0.35,
    },

    {
        distance: 750,
        zAngle: Math.PI * 0.5,
        yAngle: -Math.PI / 2.5,
        progressOffset: 0,
    },
]

const SYMBOLS = [
    {
        skin: 'hearts',
        distance: 1050,
        zAngle: Math.PI * 0.475,
        yAngle: -Math.PI / 1.25,
        progressOffset: 0,
        flipOffset: 0.25,
        spinOffset: 0,
        scaleFactor: 1,
    },
    {
        skin: 'hearts',
        distance: 750,
        zAngle: Math.PI * 0.85,
        yAngle: -Math.PI / 2.5,
        progressOffset: 0.25,
        flipOffset: 0.1,
        spinOffset: 0,
        scaleFactor: 1,
    },

    {
        skin: 'diamonds',
        distance: 750,
        zAngle: Math.PI * 0.15,
        yAngle: -Math.PI / 2.5,
        progressOffset: 0.5,
        flipOffset: 0.25,
        spinOffset: 0,
        scaleFactor: 1,
    },

    {
        skin: 'diamonds',
        distance: 750,
        zAngle: Math.PI * 0.75,
        yAngle: -Math.PI / 1,
        progressOffset: 0,
        flipOffset: 0,
        spinOffset: 0,
        scaleFactor: 1,
    },

    {
        skin: 'spades',
        distance: 750,
        zAngle: Math.PI * 0.25,
        yAngle: -Math.PI / 1,
        progressOffset: 0,
        flipOffset: 0.25,
        spinOffset: 0,
        scaleFactor: 1,
    },

    {
        skin: 'clubs',
        distance: 1000,
        zAngle: Math.PI * 0.55,
        yAngle: -Math.PI / 1.5,
        progressOffset: 0,
        flipOffset: 0.35,
        spinOffset: 0,
        scaleFactor: 1,
    },

    {
        skin: 'diamonds',
        distance: 750,
        zAngle: Math.PI * 0.325,
        yAngle: -Math.PI / 1.5,
        progressOffset: 0,
        flipOffset: 0,
        spinOffset: 0,
        scaleFactor: 1,
    },
]

export class ExplosionView extends Container {
    flashView
    smokeContainer
    smokeBranchesViews
    reelsView

    constructor(assets, vfxLevel) {
       super()

       this.initBricks(assets)
       this.initFlash(assets)
       
       this.initSmokeBranches(assets)
       this.initSymbols(assets, vfxLevel)
       this.present(1)
   
       /*
       new Timeline()
        .addAnimation({
            duration: 1250,
            onProgress: progress => {
                this.present(progress)
            }
        })
        .setLoopMode()
        .play()

        */
        
    }

    initFlash(assets) {
        const sprite = this.addChild(new Sprite(assets.flash))
        sprite.anchor.set(0.5)
        this.flashView = sprite
    }

    initSymbols(assets, vfxLevel) {
        if (vfxLevel < 0.15) return

        this.symbolsViews = SYMBOLS.map(({
            skin = 'hearts',
        }) => {
            let view

            const traceView = new Sprite(assets.trace)

            traceView.anchor.set(0.65, 0.5)
            traceView.scale.set(1)

            switch(skin) {
                case 'hearts': view = new SymbolHeartsView(assets); break
                case 'clubs': view = new SymbolClubsView(assets); break
                case 'diamonds': view = new SymbolDiamondsView(assets); break
                case 'spades': view = new SymbolSpadesView(assets); break
            }

            view.traceView = this.addChild(traceView)

            view.setBlur(0)
            view.flamesContainer.visible = false

            return this.addChild(view)
        })
    }

    initSmokeBranches(assets) {
        this.smokeContainer = this.addChild(new Container)
      
        this.smokeBranchesViews = BRANCHES.map(() => {
            return this.smokeContainer.addChild(new SmokeBranchView(assets))
        })
    }

    initBricks(assets) {
        this.bricksView = this.addChild(new BricksPoolView(assets))
    }

    present(progress) {
        if(this.bankContainer)
        this.bankContainer.pivot.y = 20 * Math.sin(Math.PI * 12 * progress) * (1 - progress)


        const flashProgress =  Math.min(1, progress * 5)
        if(this.reelsView)
        this.reelsView.alpha = flashProgress >= 0.5 ? 1 : 0
        
        this.flashView.scale.set(4 * Math.sin(flashProgress * Math.PI))
        
        this.bricksView.alpha = Math.sin(Math.sin(flashProgress * Math.PI * 0.5))

        // this.flashView.alpha = flashProgress
        this.bricksView.presentDecomposition(Math.min(1, progress * 2) ** 2)

        const finalProgressDelta = 0.85
        const finalProgressGap = 1 - finalProgressDelta


        BRANCHES.forEach(({
            distance = 750,
            zAngle = Math.PI * 0.75,
            yAngle = -Math.PI / 3.5,
            progressOffset = 0
        }, i) => {

            const shiftedProgress = Math.max(
                0,
                Math.min(finalProgressDelta, progress - finalProgressGap * progressOffset)
            ) / finalProgressDelta


            this.smokeBranchesViews[i].present({
                distance,
                zAngle,
                yAngle,
                progress: shiftedProgress
            })
        })

        this.smokeContainer.alpha = Math.min(1, (1 - progress) * 2)

        this.symbolsViews && SYMBOLS.forEach(({
            distance = 750,
            zAngle = Math.PI * 0.75,
            yAngle = -Math.PI / 3.5,
            progressOffset = 0,
            flipOffset = 0,
            spinOffset = 0,
            scaleFactor = 1,
        }, i) => {
            const shiftedProgress = Math.max(
                0,
                Math.min(finalProgressDelta, progress - finalProgressGap * progressOffset)
            ) / finalProgressDelta


            const view = this.symbolsViews[i]

            const cos = Math.cos(zAngle)
            const sin = Math.sin(yAngle + shiftedProgress * Math.PI)
            const finalDistance = distance * shiftedProgress

            view.setFlip((shiftedProgress * 1 + flipOffset) % 1)
            view.setSpin((shiftedProgress * 2 + spinOffset) % 1)
            view.scale.set((0.2 + 0.15 * shiftedProgress) * scaleFactor)
            // view.setBrightness(1 - shiftedProgress)

            view.previousX = view.x
            view.previousY = view.y

            view.position.set(
                finalDistance * cos,
                finalDistance * sin
            )

            const {
                previousX = view.x,
                previousY = view.y
            } = view
            
            const angle = Math.atan2(view.y - previousY, view.x - previousX)
            view.traceView.rotation = angle
            view.traceView.scale.x = 0.55 + 0.75 * shiftedProgress
            view.traceView.scale.y = 0.5 + 0.75 * Math.abs(Math.sin(Math.PI * 4 * shiftedProgress))



            view.traceView.position.set(view.x, view.y)
            view.alpha = Math.min(1, Math.sin(Math.PI * shiftedProgress) * 2)
            view.traceView.alpha = view.alpha
        })
    }
}