import { Sprite } from "pixi.js"
import { CharacterHeadView } from "../../base/head/CharacterHeadView"
import { AdventurerHairView } from "./AdventurerHairView"

export class AdventurerHeadView extends CharacterHeadView {
    constructor(assets) {
        super(assets)
        this.noseView.scale.y =  0.85
        this.noseSideView.scale.y =  0.85

        this.eyesViews.forEach(view => {
            view.setColor(0x55BB00)
        })
    }

    initHair(assets) {
        this.hairView = this.addChild(new AdventurerHairView(assets))
        this.hairView.scale.set(1.75)
        this.hairView.y = -50

        const color = 0x880000
        // const color = 0x550000

        this.mustachesViews = []
        this.mustacheLeft = new Sprite(assets.adventurer_mustache)
        this.mustacheLeft.anchor.set(0.9, 0.1)
        this.mustacheLeft.progressOffset = 0.0125
        this.mustacheLeft.rotation = 0.25
        this.mustacheLeft.y = 40
        this.mustacheLeft.tint = color
        this.addChild(this.mustacheLeft)
        this.mustachesViews.push(this.mustacheLeft)

        this.mustacheRight = new Sprite(assets.adventurer_mustache)
        this.mustacheRight.anchor.set(0.9, 0.1)
        this.mustacheRight.progressOffset = 1 - 0.0125
        this.mustacheRight.rotation = -0.35
        this.mustacheRight.y = 40
        this.mustacheRight.tint = color
        this.addChild(this.mustacheRight)
        this.mustachesViews.push(this.mustacheRight)

        this.hairView.setColor(color)

        this.eyesViews.forEach(view => {
            view.setBrowColor(color)
            view.setBrowTension(1)
        })
    }

    attachHat(hatView) {
        this.hatView = this.addChild(hatView)
        this.hatView.zIndex = 1000
        this.hatView.y = -90
    }

    setFlip(flipProgress) {
        super.setFlip(flipProgress)

        const finalFlipProgress = (flipProgress + this.animationFlipProgress) % 1

        let progress = (finalFlipProgress + this.mustacheLeft.progressOffset) % 1
        this.mustacheLeft.zIndex = progress > 0.5 ? -2 : 2
        this.mustacheLeft.x = 140 * Math.cos( progress * Math.PI * 2)
        this.mustacheLeft.skew.x = Math.cos(progress * Math.PI * 2) * 0.3
        this.mustacheLeft.scale.set(
            Math.sin( progress * Math.PI * 2) * 1.5,
            1.5
        )       

        progress = (finalFlipProgress + this.mustacheRight.progressOffset) % 1
        this.mustacheRight.zIndex = progress > 0.5 ? -2 : 2
        this.mustacheRight.x = 140 * Math.cos( progress * Math.PI * 2)
        this.mustacheRight.skew.x = Math.cos(progress * Math.PI * 2) * 0.3
        this.mustacheRight.scale.set(
            -Math.sin( progress * Math.PI * 2) * 1.5,
            1.5
        )

    }
}