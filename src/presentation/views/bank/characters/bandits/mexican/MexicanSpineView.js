import { BaseBellyView } from "../../base/spine/BaseBellyView";
import { BaseChestView } from "../../base/spine/BaseChestView";
import { BaseNeckView } from "../../base/spine/BaseNeckView";
import { BasePelvisView } from "../../base/spine/BasePelvisView";
import { BaseSpineView } from "../../base/spine/BaseSpineView";
import { MexicanBellyView } from "./MexicanBellyView";
import { MexicanChestView } from "./MexicanChestView";

export class MexicanSpineView extends BaseSpineView {
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

    
        view = new MexicanBellyView(assets)
        this.bellyView = view
        view.pivot.y = 100
        this.attach({
            view,
            length: 100,
            rotationOffset: - Math.PI * 1.5,
        })

        view = new MexicanChestView(assets)
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
}