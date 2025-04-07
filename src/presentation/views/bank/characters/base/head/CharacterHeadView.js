import { Graphics, Sprite } from "pixi.js";
import { BoxView } from "../../../BoxView";
import { EyeView } from "./EyeView";
import { MouthView } from "./MouthView";
import { EarView } from "./EarView";
import { HairView } from "./HairView";

export class CharacterHeadView extends BoxView {
    animationFlipProgress = 0

    constructor(assets) {
        super(assets)
        this.initHair(assets)
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
        this.eyesViews.push(this.eyeLeft)

        this.eyeRight = new EyeView(assets)
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

        //this.mask = new Sprite(assets.head_base)
        //this.mask.anchor.set(0.5)
        //this.mask.zIndex = 0
        //this.addChild(this.mask)
    }

    initHair(assets) {
        this.hairView = this.addChild(new HairView(assets))
        this.hairView.scale.set(1.75)
        this.hairView.y = -50
    }

    setFlip(flipProgress) {
        let finalFlipProgress = (flipProgress + this.animationFlipProgress) % 1
        if (finalFlipProgress < 0) finalFlipProgress += 1

        const {facesViews} = this

        const shift = 0.25

        this.facesViews.forEach((view, i) => {
            const faceProgress = (shift * i + finalFlipProgress) % 1

            view.x = this.distances[i] * Math.sin( faceProgress * Math.PI * 2)
            view.scale.x = Math.cos(faceProgress * Math.PI * 2)

            if (view.isFlipped) view.scale.x *= -1
            view.zIndex = 0

            view.zIndex = faceProgress < 0.25 || faceProgress > 0.75 ? -1 : 1

           view.alpha = 1 - Math.abs(Math.sin(faceProgress * Math.PI * 2)) * 1
        })


        let width = 0

        facesViews.forEach(view => {
            if(view.zIndex >= 0) width += Math.abs(view.width) * view.scaleFactor
        })

        
        this.baseView.skew.x = Math.cos(finalFlipProgress * Math.PI * 2) * 0.2
        this.facesViews[1].skew.x = Math.cos(finalFlipProgress * Math.PI * 2) * 0.1
        this.facesViews[0].skew.x =  this.baseView.skew.x
        this.facesViews[2].skew.x =  this.baseView.skew.x

        this.baseView.width = 215 +  75 * Math.abs(Math.cos(finalFlipProgress * Math.PI * 2))

        this.mouthView.zIndex = finalFlipProgress > 0.5 ? -2 : 2
        this.mouthView.x = 150 * Math.cos( finalFlipProgress * Math.PI * 2)
        this.mouthView.setScaleX(Math.abs(Math.sin( finalFlipProgress * Math.PI * 2)))
        this.mouthView.visible = flipProgress < 0.5
        //this.mouthView.scale.y =  0.65
        this.mouthView.setSkew(Math.cos(finalFlipProgress * Math.PI * 2) * 0.15)



        

        this.noseView.zIndex = finalFlipProgress > 0.5 ? -5 : 5
        this.noseView.x = 137 * Math.cos( finalFlipProgress * Math.PI * 2)
        this.noseView.skew.x = Math.cos(finalFlipProgress * Math.PI * 2) * 0.3
        this.noseView.scale.x =  Math.sin( finalFlipProgress * Math.PI * 2)

        this.noseSideView.zIndex = finalFlipProgress > 0.5 ? -4 : 4

        if (finalFlipProgress < 0.25 || finalFlipProgress > 0.75) {
            this.noseSideView.x = this.noseView.x - this.noseView.width / 2
        } else {
            this.noseSideView.x = this.noseView.x + this.noseView.width / 2
        }
        
        this.noseSideView.scale.x =  Math.cos( finalFlipProgress * Math.PI * 2)

        
        
        let progress = (finalFlipProgress + this.earLeft.progressOffset) % 1
        this.earLeft.zIndex = progress > 0.5 ? -5 : 5
        this.earLeft.x = 117 * Math.cos( progress * Math.PI * 2)
        this.earLeft.rotation = Math.cos( progress * Math.PI * 2) * 0.1
        this.earLeft.setFlip((progress + 0.2) % 1)   

        progress = (finalFlipProgress + this.earRight.progressOffset) % 1
        this.earRight.zIndex = progress > 0.5 ? -5 : 5
        this.earRight.x = 117 * Math.cos( progress * Math.PI * 2)
        this.earRight.rotation = Math.cos( progress * Math.PI * 2) * 0.1
        this.earRight.setFlip((progress + 0.3) % 1 )

        this.earsViews.forEach(view => view.skew.x = this.baseView.skew.x * 1.5)



        progress = (finalFlipProgress + this.eyeLeft.progressOffset) % 1
        this.eyeLeft.zIndex = progress > 0.5 ? -3 : 3
        this.eyeLeft.x = 138 * Math.cos( progress * Math.PI * 2)
        this.eyeLeft.skew.x = Math.cos(progress * Math.PI * 2) * 0.3
        this.eyeLeft.scale.x =  Math.sin( progress * Math.PI * 2)        

        progress = (finalFlipProgress + this.eyeRight.progressOffset) % 1
        this.eyeRight.zIndex = progress > 0.5 ? -3 : 3
        this.eyeRight.x = 137 * Math.cos( progress * Math.PI * 2)
        this.eyeRight.skew.x = Math.cos(progress * Math.PI * 2) * 0.3
        this.eyeRight.scale.x =  -Math.sin( progress * Math.PI * 2)


        this.eyesViews.forEach(view => view.setOpen(Math.abs(Math.sin(Math.PI * 8 * finalFlipProgress))))

        this.mouthView.setOpen(Math.abs(Math.sin(Math.PI * 8 * finalFlipProgress)) * 0.8)


        this.hatView?.setFlip(finalFlipProgress)
        if(this.hatView) {
            this.hatView.x = -20 * Math.cos(Math.PI * 2 * finalFlipProgress)
        }


        this.hairView.setFlip(finalFlipProgress)
        this.hairView.zIndex = 3
        this.hairView.skew.x = this.baseView.skew.x
        this.hairView.scale.x = 1.65 + 0.275 * Math.abs(Math.cos(Math.PI * 2 * finalFlipProgress))
    }

    attachHat(hatView) {
        this.hatView = this.addChild(hatView)
        this.hatView.zIndex = 1000
        this.hatView.y = -115
    }
}