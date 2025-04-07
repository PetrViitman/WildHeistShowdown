import { Container, Sprite } from "pixi.js";
import { LimbView } from "../LimbView";
import { BasePelvisView } from "./BasePelvisView";
import { BaseBellyView } from "./BaseBellyView";
import { BaseChestView } from "./BaseChestView";
import { BaseNeckView } from "./BaseNeckView";

export class BaseSpineView extends LimbView {
    constructor(assets) {
        super(assets)

        this.length = 500

    }

    initLimbParts(assets) {

        this.bendMultiplier = -1
        
        let view = new BasePelvisView(assets)
        this.pelvisView = view
        view.pivot.y = 85
        this.attach({
            view,
            length: 100,
            rotationOffset: - Math.PI * 1.5,
        })

    
        view = new BaseBellyView(assets)
        this.bellyView = view
        view.pivot.y = 100
        this.attach({
            view,
            length: 100,
            rotationOffset: - Math.PI * 1.5,
        })

        view = new BaseChestView(assets)
        this.chestView = view
        view.pivot.y = 55
        this.attach({
            view,
            length: 100,
            rotationOffset: - Math.PI * 1.5,
        })

        view = new BaseNeckView(assets)
        this.neckView = view
        view.pivot.y = 45
        this.attach({
            view,
            length: 100,
            rotationOffset: - Math.PI * 1.5,
            zIndex: 0
        })
    }

    setShirtColor(color) {
        this.bellyView.setColor(color)
        this.chestView.setColor(color)
        this.neckView.setColor(color)
    }

    setLegsColor(color) {
        this.pelvisView.setColor(color)
    }

    setButtonsColor(color) {
        this.chestView.setButtonsColor(color)
        this.bellyView.setButtonsColor(color)
    }
}