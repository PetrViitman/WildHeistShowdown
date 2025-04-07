import { Container, Sprite } from "pixi.js";

export class RevolverView extends Container {
    flashProgress = 0

    constructor(assets) {
        super()

        this.initHandle(assets)
        this.initFrame(assets)
        this.initDrum(assets)
        this.initFaces(assets)
        this.initHammer(assets)
        this.initFlash(assets)
        this.sortableChildren = true

        this.presentFlash(0)
    }

    initHammer(assets) {
        const sprite = new Sprite(assets.revolver_face_2)
        sprite.anchor.set(0.5, 1)
        sprite.y = -100
        this.hammerView = this.addChild(sprite)
    }

    initHandle(assets) {
        const sprite = new Sprite(assets.revolver_handle)
        sprite.anchor.set(0.5)
        sprite.zIndex = 0
        this.handleView = this.addChild(sprite)
    }

    initDrum(assets) {
        const container = this.addChild(new Container)
        container.y = -113

        let sprite = new Sprite(assets.revolver_drum_stretch)
        sprite.anchor.set(0.5)
        this.drumStretchView = container.addChild(sprite)

        sprite = new Sprite(assets.revolver_drum_side)
        sprite.anchor.set(0.5)
        this.drumSideView = container.addChild(sprite)

        sprite = new Sprite(assets.revolver_drum_face)
        sprite.anchor.set(0.5)
        this.drumFaceView = container.addChild(sprite)

        sprite = new Sprite(assets.revolver_drum_back)
        sprite.anchor.set(0.5)
        this.drumBackView = container.addChild(sprite)


        this.drumView = container
    }

    initFrame(assets) {
        let sprite = new Sprite(assets.revolver_frame_rib)
        sprite.anchor.set(0.5)
        sprite.y = -90
        this.frameRibView = this.addChild(sprite)
        
        sprite = new Sprite(assets.revolver_frame_bottom)
        sprite.anchor.set(0.5)
        sprite.y = -90
        this.frameBottomView = this.addChild(sprite)

        sprite = new Sprite(assets.revolver_frame_bottom_stretch)
        sprite.anchor.set(0.5)
        sprite.y = -90
        this.frameBottomBackView = this.addChild(sprite)

        sprite = new Sprite(assets.revolver_frame_top)
        sprite.anchor.set(0.5)
        sprite.y = -115
        this.frameTopView = this.addChild(sprite)
    }

    initFaces(assets) {
        let sprite = new Sprite(assets.revolver_face_stretch)
        sprite.anchor.set(0.5)
        sprite.y = -143
        this.trunkFaceStretchView = this.addChild(sprite)

        sprite = new Sprite(assets.revolver_face)
        sprite.anchor.set(0.5)
        sprite.y = -143
        this.trunkFaceView = this.addChild(sprite)
    }

    initFlash(assets) {
        let sprite = new Sprite(assets.revolver_flash_front)
        sprite.anchor.set(0.5)
        sprite.y = -140
        this.flashFrontView = this.addChild(sprite)

        sprite = new Sprite(assets.revolver_flash_side)
        sprite.anchor.set(0.1, 0.5)
        this.flashSideView = this.addChild(sprite)
        sprite.y = -140
    }

    setFlip(flipProgress) {
        const angle = Math.PI * 2 * flipProgress
        const sin = Math.sin(angle)
        const cos = Math.cos(angle)
        const shiftedCos = Math.cos(angle + Math.PI / 2)
        const shiftedSin = Math.sin(angle + Math.PI / 2)

        this.handleView.scale.x = 0.5 + 0.5 * Math.abs(cos)
        this.handleView.skew.x = cos * -0.3


        this.drumFaceView.x = 40 * cos
        this.drumFaceView.scale.x = sin
        this.drumFaceView.visible = flipProgress > 0.5

        this.drumStretchView.x = flipProgress > 0.5 ? -this.drumFaceView.x : this.drumFaceView.x
        this.drumStretchView.scale.x = this.drumFaceView.scale.x

        this.drumBackView.x = -this.drumFaceView.x
        this.drumBackView.scale.x = this.drumFaceView.scale.x
        this.drumBackView.visible = !this.drumFaceView.visible


        const frameOffset = flipProgress > 0.25 && flipProgress < 0.75 ? 8 : -8
        this.frameBottomView.x = 80 * cos - frameOffset * sin
        this.frameBottomView.zIndex = Math.trunc(60 * shiftedCos - 1 * shiftedSin)
        this.frameBottomView.scale.x = cos

        this.frameRibView.x = 65 * cos
        this.frameRibView.zIndex = this.frameBottomView.zIndex

        this.frameBottomBackView.x = 80 * cos + frameOffset * sin
        this.frameBottomBackView.zIndex = this.frameBottomView.zIndex - 1
        this.frameBottomBackView.scale.x = cos

        this.frameTopView.x = 185 * cos
        this.frameTopView.scale.x = cos
        this.frameTopView.zIndex = Math.trunc(100 * shiftedCos)

        this.drumView.x = 115 * cos
        this.drumView.zIndex = Math.trunc(90 * shiftedCos)
        this.drumSideView.scale.x = cos


        this.trunkFaceStretchView.x = 300 * cos
        this.trunkFaceStretchView.scale.x = sin
        this.trunkFaceStretchView.zIndex = Math.trunc(150 * shiftedCos)

        this.trunkFaceView.x = this.trunkFaceStretchView.x
        this.trunkFaceView.scale.x = this.trunkFaceStretchView.scale.x
        this.trunkFaceView.zIndex = Math.trunc(150 * shiftedCos)
        this.trunkFaceView.visible = flipProgress > 0.5


        this.hammerView.x = 32 * cos
        this.hammerView.scale.x = 0.75 + 0.25 * Math.abs(cos)
        this.hammerView.zIndex = Math.trunc(-45 * shiftedCos)
        this.hammerView.skew.x = cos * 0.3

        this.flashFrontView.x = 300 * cos
        this.flashFrontView.zIndex = 400 * shiftedCos
        this.flashFrontView.scaleX = sin
        this.flashFrontView.alpha = Math.min(1, Math.abs(sin) * 2)


        this.flashSideView.x = 300 * cos
        this.flashSideView.zIndex = 500 * shiftedCos
        this.flashSideView.scaleX = cos
        this.flashSideView.alpha = Math.min(1, Math.abs(cos) * 2)

        this.adjustFlashDistortion()
    }

    adjustFlashDistortion() {
        const {
            flashProgress,
            flashFrontView,
            flashSideView
        } = this

        const scaleProgress = (1 - flashProgress) * 8

        flashFrontView.scale.set(
            flashFrontView.scaleX * scaleProgress,
            scaleProgress
        )
        flashSideView.scale.set(
            flashSideView.scaleX * scaleProgress,
            scaleProgress
        )
    }

    presentFlash(progress) {
        this.flashProgress = Math.min(1, (1 - Math.sin(Math.PI * progress)) * 2)

        this.adjustFlashDistortion()
    }

    reset() {
        this.presentFlash(0)
    }
}