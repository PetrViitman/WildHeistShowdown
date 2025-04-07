import {Container, Sprite} from 'pixi.js'
import {SparkleView} from './SparkleView'
import {TorchCoalView} from './TorchCoalView'
import { colorToColor } from '../../GraphicalPrimitives'

export class TorchView extends Container {
    flamesContainer

    flamesViews

    coalView

    sparklesViews

    progressOffset

    barsViews

    crossbarView

    handleView

    isBurning

    constructor({
        assets,
        progressOffset = 0,
        isFlipped = false,
        isBurning = true,
    }) {
        super()

        this.isBurning = isBurning
        this.progressOffset = progressOffset
        this.initCrossbar(assets)
        this.initHandle(assets)

        if(isBurning) {
            this.initFlames(assets, isFlipped)
            this.initCoal(assets)
            this.initSparkles(assets)
        }

        this.initCup(assets)
        this.initBars(assets)
    }
    
    initHandle(assets) {
        const sprite = new Sprite(assets.torch_handle)
        sprite.anchor.set(0, 1)
        sprite.scale.set(1, 0.5)
        sprite.y = 20

        this.handleView = this.addChild(sprite)
    }

    initCrossbar(assets) {
        const sprite = new Sprite(assets.torch_crossbar)
        sprite.anchor.set(0.5)
        sprite.scale.set(0.5)
        sprite.y = 10

        this.crossbarView = this.addChild(sprite)
    }

    initFlames(assets, isFlipped) {
        this.flamesContainer = this.addChild(new Container)
        this.flamesContainer.y = -30
        this.flamesContainer.scale.x = isFlipped ? -0.75 : 0.75
        this.flamesContainer.scale.y = 0.75
        this.flamesViews = new Array(10)
            .fill(0)
            .map(() => {
                const sprite = new Sprite(assets.fire_particle)
                sprite.anchor.set(0.5)

                return this.flamesContainer.addChildAt(sprite, 0)
            })
    }

    initCoal(assets) {
        const view = new TorchCoalView(assets)
        view.y = -10
        this.coalView = this.addChild(view)
    }

    initCup(assets) {
        const sprite = new Sprite(assets.torch_cup)
        sprite.anchor.set(0.5)
        sprite.scale.set(0.5)
        sprite.y = 5

        this.addChild(sprite)
    }

    initBars(assets) {
        this.barsViews = new Array(5).fill(0).map(_ => {
            const sprite = new Sprite(assets.torch_tooth)
            sprite.scale.set(0.5, 0.75)
            sprite.y = -13
            sprite.anchor.set(0.5, 1)


            return this.addChild(sprite)
        })
    }

    initSparkles(assets) {
        this.sparklesViews = new Array(4)
            .fill(0)
            .map(() => {
                return this.addChild(new SparkleView(assets))
            })
    }

    setFlamesProgress(progress) {
        const {flamesContainer} = this
        flamesContainer.skew.x = 0.1 * Math.sin(Math.PI * 2 * progress)
        
        const shiftStep = 1 / this.flamesViews.length
        this.flamesViews.forEach((view, i) => {
            const shiftedProgress = (i * shiftStep + progress) % 1

            view.y = 10 -100 * shiftedProgress//  ** 2
            view.x = 15 * Math.sin(Math.PI * 5 * shiftedProgress) * (1 - shiftedProgress)
            //view.scale.set(0.75 * Math.sin(Math.PI * shiftedProgress) * (1 - shiftedProgress))
            view.scale.set(0.5 + 0.25  * (1 - shiftedProgress))
            view.rotation = Math.PI * 2.25 * (shiftStep * i + shiftedProgress)
            view.alpha = 1 - shiftedProgress
            //view.skew.x = 0.5 * Math.sin(Math.PI * 2 * shiftedProgress) * (1 - shiftedProgress) - flamesContainer.skew.x

            view.tint = colorToColor(
                244,
                255,
                0,
                255,
                0,
                0,
                Math.min(1, shiftedProgress * 1)
            )
        })
    }

    setSparklesProgress(progress) {
        const shiftStep = 1 / this.sparklesViews.length
        this.sparklesViews.forEach((view, i) => {
            const shiftedProgress = (i * shiftStep + progress) % 1
            const floatingSubProgress = Math.sin(Math.PI * shiftedProgress)

            view.y = -135 * shiftedProgress
            view.x = 40 * Math.sin(Math.PI * 3 * shiftedProgress) * floatingSubProgress * (1 - shiftedProgress)
            view.scale.set(1.5 * floatingSubProgress)
            view.rotation = Math.PI * 5 * (shiftStep * i + shiftedProgress)
            view.alpha = floatingSubProgress

            view.lightView.alpha = floatingSubProgress
            view.setSpin(Math.abs(Math.sin(Math.PI * 7 * shiftedProgress)))
        })
    }

    present(progress) {
        if(!this.isBurning) return

        const finalProgress = (progress + this.progressOffset) % 1

        this.setFlamesProgress(finalProgress)
        this.coalView.setProgress(finalProgress)
        this.setSparklesProgress(finalProgress)
    }

    setFlip(flipProgress) {

        const {crossbarView, handleView} = this
        const progress = (flipProgress * 2) % 1


        const angle = Math.PI * 2 * flipProgress
        const sin = Math.sin(angle)
        const cos = Math.cos(angle)

        crossbarView.x = sin * 65
        handleView.x = crossbarView.x

        crossbarView.scale.x = cos * 0.5
        handleView.scale.x = -sin * 0.5

        this.barsViews.forEach((view, i) => {
            const shiftedProgress = (progress +  i * 0.2) % 1

            view.x =  -35 * Math.sin(Math.PI * (shiftedProgress - 0.5 ))
            view.scale.x = Math.sin(Math.PI * shiftedProgress) * 0.5
            // view.skew.x = -0.15 * Math.cos(Math.PI * 2 * (0.5 + shiftedProgress))
        })
    }
    
}
