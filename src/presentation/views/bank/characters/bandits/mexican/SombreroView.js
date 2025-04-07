import { Container, Sprite } from "pixi.js";

export class SombreroView extends Container {
    baseView
    cylinderView
    symbolsViews

    
    constructor(assets) {
        super()

        this.initBase(assets)
        this.initCylinder(assets)
        this.initSymbols(assets)
    }

    initBase(assets) {
        const sprite = new Sprite(assets.sombrero_base)
        sprite.anchor.set(0.5)
        this.baseView = this.addChild(sprite)
    }

    initCylinder(assets) {
        const sprite = new Sprite(assets.sombrero_cylinder)
        sprite.anchor.set(0.5, 1)
        sprite.y = -15
        this.cylinderView = this.addChild(sprite)
    }

    initSymbols(assets) {
        this.symbolsViews = [
            'diamonds',
            'clubs',
            'hearts',
            'spades',
            'diamonds',
            'clubs',
            'hearts',
            'spades',
            'hearts',
        ].map(symbolName => {
            const sprite = new Sprite(assets['sombrero_' + symbolName])
            sprite.anchor.set(0.5)


            return this.addChild(sprite)
        })
    }

    setFlip(flipProgress) {
        const angle = Math.PI * 2 * flipProgress
        const cos = Math.cos(angle)

        this.cylinderView.scale.x = 1 + 0.2 * Math.abs(cos)
        this.cylinderView.skew.x = 0.15 * cos

        const progress = (flipProgress * 2) % 1
        this.symbolsViews.forEach((view, i) => {
            const shiftedProgress = (progress +  i * 0.11111) % 1
            const angle = Math.PI * 2 * shiftedProgress

            view.x =  -145 * Math.sin(Math.PI * (shiftedProgress - 0.5 ))
            view.y =  -7 * Math.cos(angle)
            view.rotation = -0.2 * Math.sin(angle)
            view.scale.x = Math.sin(Math.PI * shiftedProgress)
        })
    }
}