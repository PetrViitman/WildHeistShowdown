import { Sprite } from "pixi.js"
import { CharacterHeadView } from "../../base/head/CharacterHeadView"
import { EarView } from "../../base/head/EarView"
import { EyeView } from "../../base/head/EyeView"
import { HairView } from "../../base/head/HairView"
import { MouthView } from "../../base/head/MouthView"
import { MexicanEyeView } from "./MexicanEyeView"

export class MexicanHeadView extends CharacterHeadView {
    constructor(assets) {
        super(assets)
    }

    initFaces(assets) {
        this.baseView = new Sprite(assets.head_base)
        this.baseView.anchor.set(0.5)
        this.baseView.zIndex = 0
        this.addChild(this.baseView)


        let view = new Sprite(assets.head_side)
        view.y = -100
        view.scaleFactor = 1
        view.anchor.set(0.6, 0)
        this.distances[0] = 100
        this.facesViews[0] = this.addChild(view)


        view = new Sprite(assets.head_face)
        view.y = -115
        view.scaleFactor = 1
        view.anchor.set(0.5, 0)
        this.distances[1] = 100
        this.facesViews[1] = this.addChild(view)

        view = new Sprite(assets.head_side)
        view.y = -100
        view.scaleFactor = 1
        view.isFlipped = true
        view.anchor.set(0.6, 0)
        this.distances[2] = 100
        this.facesViews[2] = this.addChild(view)


        this.mouthView = new MouthView(assets)
        this.mouthView.y = 40
        this.addChild(this.mouthView)

     

        this.noseSideView = new Sprite(assets.head_nose_side)
        this.noseSideView.anchor.set(0, 0)
        this.noseSideView.y = -30
        this.addChild(this.noseSideView)

        this.noseView = new Sprite(assets.head_nose_face)
        this.noseView.anchor.set(0.5, 0)
        this.noseView.y = -35
        this.addChild(this.noseView)

        this.eyesViews = []
        this.eyeLeft = new EyeView(assets)
        this.eyeLeft.progressOffset = 0.06
        this.eyeLeft.y = 0
        this.addChild(this.eyeLeft)
        this.eyeLeft.setColor(0x550000)
        this.eyesViews.push(this.eyeLeft)

        this.eyeRight = new MexicanEyeView(assets)
        this.eyeRight.progressOffset = 1 - 0.06
        this.eyeRight.y = 0
        this.addChild(this.eyeRight)
        this.eyesViews.push(this.eyeRight)


        this.earsViews = []
        this.earLeft = new EarView(assets)
        this.earLeft.progressOffset = 0.275
        this.earLeft.y = 35
        this.earLeft.scale.set(1.15)
        this.addChild(this.earLeft)
        this.earLeft.setMirrored()
        this.earsViews.push(this.earLeft)

        this.earRight = new EarView(assets)
        this.earRight.progressOffset = 1 - 0.275
        this.earRight.y = 35
        this.earRight.scale.set(1.15)
        this.addChild(this.earRight)
        this.earsViews.push(this.earRight)
    }

    initHair(assets) {
        super.initHair(assets)

        const color = 0x333333

        this.mustachesViews = []
        this.mustacheLeft = new Sprite(assets.mustache)
        this.mustacheLeft.anchor.set(0.9, 0.5)
        this.mustacheLeft.progressOffset = 0.015
        this.mustacheLeft.y = 50
        this.mustacheLeft.tint = color
        this.addChild(this.mustacheLeft)
        this.mustachesViews.push(this.mustacheLeft)

        this.mustacheRight = new Sprite(assets.mustache)
        this.mustacheRight.anchor.set(0.9, 0.5)
        this.mustacheRight.progressOffset = 1 - 0.015
        this.mustacheRight.y = 50
        this.mustacheRight.tint = color
        this.addChild(this.mustacheRight)
        this.mustachesViews.push(this.mustacheRight)

        this.hairView.setColor(color)

        this.eyesViews.forEach(view => {
            view.setBrowColor(color)
        })
    }

    attachHat(hatView) {
        this.hatView = this.addChild(hatView)
        this.hatView.zIndex = 1000
        this.hatView.y = -100
    }

    setFlip(flipProgress) {
        super.setFlip(flipProgress)

        const finalFlipProgress = (flipProgress + this.animationFlipProgress) % 1

        let progress = (finalFlipProgress + this.mustacheLeft.progressOffset) % 1
        this.mustacheLeft.zIndex = progress > 0.5 ? -3 : 3
        this.mustacheLeft.x = 150 * Math.cos( progress * Math.PI * 2)
        this.mustacheLeft.skew.x = Math.cos(progress * Math.PI * 2) * 0.3
        this.mustacheLeft.scale.set(
            Math.sin( progress * Math.PI * 2) * 1.5,
            1.5
        )       

        progress = (finalFlipProgress + this.mustacheRight.progressOffset) % 1
        this.mustacheRight.zIndex = progress > 0.5 ? -3 : 3
        this.mustacheRight.x = 150 * Math.cos( progress * Math.PI * 2)
        this.mustacheRight.skew.x = Math.cos(progress * Math.PI * 2) * 0.3
        this.mustacheRight.scale.set(
            -Math.sin( progress * Math.PI * 2) * 1.5,
            1.5
        )

    }
}