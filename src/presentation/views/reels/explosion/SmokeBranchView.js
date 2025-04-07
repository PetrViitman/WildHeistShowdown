import { Container, Sprite } from "pixi.js";
import { brightnessToHexColor } from "../../GraphicalPrimitives";

export class SmokeBranchView extends Container {
    headView
    smokesViews = []

    constructor(assets) {
        super()

        this.initSmokes(assets)
        this.initHead(assets)
    }

    initSmokes(assets) {
        this.smokesViews = new Array(20).fill(0).map(_ => {
            const sprite = new Sprite(assets.smoke)
            sprite.anchor.set(0.5)
            return this.addChild(sprite)
        })
    }

    initHead(assets) {
        const sprite = new Sprite(assets.debree_head)
        sprite.anchor.set(0.5)

        this.headView = this.addChild(sprite)
    }

    present({
        progress = 0,
        distance = 750,
        zAngle = Math.PI * 0.75,
        yAngle = -Math.PI / 3.5,
    }){
        const stepMultiplier = 0.05
        const {
            smokesViews,
            headView
        } = this

        const boostedProgress = progress * 2

        const progressOffset = stepMultiplier * smokesViews.length
        let subProgress = Math.min(0, progress - progressOffset)
        const cos = Math.cos(zAngle)
        const sin = Math.sin(yAngle)
        const distancePerItem = 1 / smokesViews.length

        let x = 0
        let y = 0

        const stepDistance = distancePerItem * distance 

        smokesViews.forEach((view, i) => {
            const itemProgressOffset = i * distancePerItem
            const shiftedProgress = Math.min(1, Math.max(0, boostedProgress - itemProgressOffset))
            const moveProgress = i / (smokesViews.length - 1)


            const sin = Math.sin(yAngle + Math.PI * moveProgress)

            view.position.set(x, y)

            const regress = Math.max(0.25, (1 - moveProgress))

            x += stepDistance * regress  * cos
            y += stepDistance * regress  * sin + stepDistance * 0.1 * progress


            view.alpha = Math.min(1, Math.sin(Math.PI * 0.5 * shiftedProgress) * 2)
            view.rotation = i * 1.25 + progress * 3 * moveProgress
            view.scale.set(
                (0.5 + Math.sin(Math.PI * 0.5 * shiftedProgress) * 1.25 * (1 - moveProgress)) * 0.5
               
            )


            // view.tint = brightnessToHexColor(1 - shiftedProgress * (1 - moveProgress) * 0.5)

            subProgress += stepMultiplier

            if(view.alpha > 0) {
                headView.position.set(view.x,  view.y)
                headView.scale.set(view.scale.x, view.scale.y)
                headView.rotation = view.rotation
            }
        })
        //const headProgress = Math.min(1, boostedProgress)

        const headProgress = Math.min(1, boostedProgress)

        headView.alpha = Math.min(1, (1 - headProgress) * 3)

        const headScale = Math.max(0.75, headView.scale.x * (1 - headProgress))

        headView.scale.set(
            headView.scale.x * headScale,
            headView.scale.y * headScale
        )


        /*
        const headProgress = Math.min(1, boostedProgress)
        headView.position.set(
            distance * cos * headProgress,
            distance * Math.sin(yAngle + Math.PI * headProgress) * headProgress
        )
            */
    }
}