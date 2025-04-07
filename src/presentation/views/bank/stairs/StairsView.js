import { Container } from "pixi.js";
import { StairsStageTopView } from "./StairsStageTopView";
import { StairsStageMiddleView } from "./StairsStageMiddleView";
import { StairsStageBottomView } from "./StairsStageBottomView";

export class StairsView extends Container {
    stagesViews = []
    
    constructor(assets) {
        super()

        this.initStages(assets)
    }

    initStages(assets) {
        const { stagesViews } = this

        let stageView = this.addChild(new StairsStageTopView(assets))
        stageView.y = -154
        stagesViews.push(stageView)

        stageView = this.addChild(new StairsStageMiddleView(assets))
        stageView.y = -77
        stagesViews.push(stageView)

        stageView = this.addChild(new StairsStageBottomView(assets))
        stageView.y = 0
        stagesViews.push(stageView)
    }


    setFlip(flipProgress) {
        let distance = 43
        this.stagesViews.forEach(view => {
            
            view.x = distance * Math.cos(Math.PI * 2 * flipProgress)
            view.setFlip(flipProgress)

            distance += 42
        })
    }
}