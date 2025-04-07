import { Container, Sprite } from "pixi.js";
import { LimbView } from "./LimbView";
import { BaseBootView } from "../BaseBootView";
import { BaseHandView } from "./BaseHandView";

export class BaseArmView extends LimbView {

    initLimbParts(assets) {
        const {colorableItemsViews} = this
        const scaleY = 1.15

        let view = new Sprite(assets.arm_shoulder)
        colorableItemsViews.push(view)
        view.anchor?.set(0.25, 0.5)
        this.attach({
            view,
            length: 75,
            minimalScaleX: 0.5,
            scaleY,
        })

        view = new Sprite(assets.arm_section)
        colorableItemsViews.push(view)
        view.anchor?.set(0.3, 0.5)
        this.attach({
            view,
            length: 175,
            scaleY,
            minimalScaleX: 0.2,
            zIndex: 0
        })

        view = new Sprite(assets.arm_section)
        colorableItemsViews.push(view)
        view.anchor?.set(0.3, 0.5)
        this.attach({
            view,
            length: 175,
            scaleY,
            minimalScaleX: 0.2,
        })

        view = new Sprite(assets.arm_section)
        colorableItemsViews.push(view)
        view.anchor?.set(0.3, 0.5)
        this.attach({
            view,
            length: 175,
            scaleY,
            minimalScaleX: 0.2,
            zIndex: 0
            
        })

        view = new Sprite(assets.arm_section)
        colorableItemsViews.push(view)
        view.anchor?.set(0.3, 0.5)
        this.attach({
            view,
            length: 175,
            scaleY,
            minimalScaleX: 0.2,
            zIndex: 0
        })
        view = new Sprite(assets.arm_section)
        colorableItemsViews.push(view)
        view.anchor?.set(0.3, 0.5)
        this.attach({
            view,
            length: 175,
            scaleY,
            minimalScaleX: 0.2,
            zIndex: 0
        })

        view = new Sprite(assets.arm_bottom)
        colorableItemsViews.push(view)
        view.anchor?.set(0.3, 0.5)
        this.attach({
            view,
            length: 175,
            scaleY,
            minimalScaleX: 0.2,
            zIndex: 1
        })

        view = new Container
        view.pivot.x = -25
        this.handView = this.attach({
            view,
            length: 50,
            scaleY,
            noDistortion: true,
            scaleX: 0.6,
            scaleY: 1,
            flipOffset: 0.25
        })

        const handBaseBackView = this.handView.addChild(new Sprite(assets.hand_base))
        handBaseBackView.anchor.set(0.5)
        handBaseBackView.scale.y = 1.15
        this.handBaseBackView = handBaseBackView
        this.colorableItemsViews.push(handBaseBackView)

        const handBaseFaceView = this.handView.addChild(new Sprite(assets.hand_base_face))
        handBaseFaceView.anchor.set(0.5)
        handBaseFaceView.scale.y = 1.125
        this.handBaseFaceView = handBaseFaceView
        this.colorableItemsViews.push(handBaseFaceView)

        const handBaseFaceBodyView = this.handView.addChild(new Sprite(assets.hand_base_body))
        handBaseFaceBodyView.anchor.set(0.5)
        handBaseFaceBodyView.scale.y = 1.125
        this.handBaseFaceBodyView = handBaseFaceBodyView

        this.jointScaleFactor = 2
        this.length = 400

        this.contentContainer.sortableChildren = true
        
    }

    stretch(x, y, flipProgress) {
        const finalFlipProgress = flipProgress % 1
        this.bendMultiplier = finalFlipProgress > 0.5 ? -1 : 1
        super.stretch(x, y, finalFlipProgress)

        const isFrontFacing = finalFlipProgress > 0.25 && finalFlipProgress < 0.75
        this.handBaseBackView.scale.x = Math.cos(finalFlipProgress * Math.PI * 2)
        this.handBaseFaceView.scale.x = this.handBaseBackView.scale.x
        this.handBaseFaceBodyView.scale.x = this.handBaseBackView.scale.x

        this.handBaseFaceView.visible = isFrontFacing
        this.handBaseFaceBodyView.visible = isFrontFacing
        this.handBaseBackView.visible = !this.handBaseFaceView.visible
        this.handView.zIndex = isFrontFacing ? 100 : -100
    }
}  