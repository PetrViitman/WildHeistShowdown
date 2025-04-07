import { Sprite } from "pixi.js";
import { LimbView } from "./LimbView";
import { BaseBootView } from "../BaseBootView";

export class BaseLegView extends LimbView {

    groundY = 123

    footSpinProgress = 0

    initLimbParts(assets) {
        const scaleY = 1.4

        let view = new Sprite(assets.leg_section_joint)
        this.colorableItemsViews.push(view)
        view.anchor?.set(0.25, 0.5)
        this.attach({
            view,
            length: 75,
            scaleY,
            minimalScaleX: 0.5,
        })
        
        
        
        view = new Sprite(assets.leg_section)
        this.colorableItemsViews.push(view)
        view.anchor?.set(0.3, 0.5)
        this.attach({
            view,
            length: 175,
            scaleY,
            minimalScaleX: 0.2,
        })

        view = new Sprite(assets.leg_section)
        this.colorableItemsViews.push(view)
        view.anchor?.set(0.3, 0.5)
        this.attach({
            view,
            length: 175,
            scaleY,
            minimalScaleX: 0.2,
        })

        view = new Sprite(assets.leg_section)
        this.colorableItemsViews.push(view)
        view.anchor?.set(0.3, 0.5)
        this.attach({
            view,
            length: 175,
            scaleY,
            minimalScaleX: 0.2,
        })

        view = new Sprite(assets.leg_section)
        this.colorableItemsViews.push(view)
        view.anchor?.set(0.3, 0.5)
        this.attach({
            view,
            length: 175,
            scaleY,
            minimalScaleX: 0.2,
        })
        view = new Sprite(assets.leg_section_bottom)
        this.colorableItemsViews.push(view)
        view.anchor?.set(0.3, 0.5)
        this.attach({
            view,
            length: 175,
            scaleY,
            minimalScaleX: 0.2,
        })

        this.setTint(0x888888)
        view = new BaseBootView(assets)
        view.pivot.y = -85

        this.footView = this.attach({
            view,
            length: 100,
            scaleX: 0.75,
            scaleY: 1.15,
            rotationOffset: -Math.PI / 2,
            zIndex: 0,
            flipOffset: 0.75,
            noDistortion: true
        })

        this.jointScaleFactor = 2
        this.finalSectionLength = 250
        this.length = 450

        this.groundY = this.length + 100
    }

    stretch(x, y, flipProgress) {
        super.stretch(x, y, flipProgress)

        const angle = Math.PI * 2 * flipProgress
        const sin = Math.sin(angle)

        this.footView.rotation = -this.footSpinProgress * sin * 0.35

        if(this.isFixedBoot) {
            this.footView.rotation = this.footView.rotation -  this.contentContainer.rotation  + Math.PI / 2
        }
    }

    setHiddenElementsVisible(isVisible = true) {
        const {itemsViews} = this

        for(let i = 2; i < itemsViews.length; i++) {
            itemsViews[i].visible = isVisible
        }

        this.footView.isVisible = isVisible
    }
}