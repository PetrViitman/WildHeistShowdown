import { Sprite } from "pixi.js";
import { HalfBoxView } from "./HalfBoxView";
import { Timeline } from "../../timeline/Timeline";

export class BuildingBoxView extends HalfBoxView {
    initFaces(assets) {
        this.topView = this.addChild(new Sprite(assets.wall_face_light))
        this.topView.anchor.set(0.5, 1)
        this.topView.y = 0


        this.cornersViews = []

        for(let i = 0; i < 4; i+=2) {
            let view = new Sprite(assets.wall_face)
            view.anchor.set(0.5, 1)    
            this.distances[i] = 256
            this.facesViews[i] = this.addChild(view)

            view = new Sprite(assets.corner)
            view.anchor.set(0.5, 1)    
            this.distances[i + 1] = Math.hypot(245,245)
            this.facesViews[i + 1] = this.addChildAt(view , 1)
            this.cornersViews.push(view)
        }

        this.shadowsView = this.addChild(new Sprite(assets.wall_face_shadow))
        this.shadowsView.anchor.set(0.5, 0)
        this.shadowsView.y = -325

        this.shadowTimeline = new Timeline()
        this.shadowTimeline.addAnimation({
                duration: 1000,
                onProgress: progress => {
                    this.shadowsView.alpha = Math.sin(Math.PI * progress) * 0.25
                }
            })
            .setLoopMode()

        this.shadowTimeline.play()
    }

    setFlip(flipProgress) {
        super.setFlip(flipProgress)

        const { facesViews } = this


        let leftMostFaceView = facesViews[0]
        let leftMostFaceX = 0
        let rightMostFaceView = facesViews[0]
        let rightMostFaceX = 0
        facesViews.forEach(view => {
            const halfWidth = view.width * 0.5
            const faceLeftX = view.x - halfWidth
            const faceRightX = view.x + halfWidth

            if(faceLeftX < leftMostFaceX) {
                leftMostFaceX = faceLeftX
                leftMostFaceView = view
            } else if (faceRightX > rightMostFaceX){
                rightMostFaceX = faceRightX
                rightMostFaceView = view
            }
        })

        this.topView.width = rightMostFaceX - leftMostFaceX
        this.shadowsView.width = this.topView.width

        
        /*
        const { facesViews } = this
        this.topView.width = facesViews[0].width
            //+ facesViews[1].width
            + facesViews[2].width
           // + facesViews[3].width
           */
    }


    setHiddenElementsVisible(isVisible = true) {
        if(isVisible) {
            this.shadowTimeline.play()
        } else {
            this.shadowTimeline.pause()
        }
        this.shadowsView.visible = isVisible

    }
}