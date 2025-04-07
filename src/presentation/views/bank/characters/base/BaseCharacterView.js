import { Container, Sprite } from "pixi.js";
import { BaseLegView } from "./BaseLegView";
import { BaseArmView } from "./BaseArmView";
import { BaseSpineView } from "./spine/BaseSpineView";
import { CharacterHeadView } from "./head/CharacterHeadView";
import { BaseBeltView } from "./spine/BaseBeltView";
import { RevolverView } from "../RevolverView";
import { CapView } from "../hats/CapView";
import { HostlerView } from "../HostlerView";
import { BaseHandView } from "./BaseHandView";

const SPINE_LENGTH = 350
const LEG_LENGTH = 475
const ARM_LENGTH = 350

export class BaseCharacterView extends Container {
    currentAnimationName
    progressOffset = Math.random()
    flipProgress = 0
    animationFlipProgress = 0
    flipAngle = 0
    headFlipProgress = 0

    legsViews
    spineView
    armsViews
    headView


    idleProgress = 0

    shotProgress = 0
    audio

    limbs = {
        spine: {
            distance: SPINE_LENGTH,
            offsetDistance: 0,
            distanceProgress: 1,
            verticalAxisProgress: 0,
            flipProgress: 0,
            distortionProgress: 0,
            x: 0,
            y: 0,
        },
        legLeft: {
            distance: LEG_LENGTH,
            offsetDistance: 50,
            distanceProgress: 1,
            verticalAxisProgress: 0,
            flipProgress: 0,
            distortionProgress: 0,
            x: 0,
            y: 0
        },
        legRight: {
            distance: LEG_LENGTH,
            offsetDistance: -50,
            distanceProgress: 1,
            verticalAxisProgress: 0,
            flipProgress: 0,
            distortionProgress: 0,
            x: 0,
            y: 0
        },
        armLeft: {
            distance: ARM_LENGTH,
            offsetDistance: 50,
            distanceProgress: 1,
            verticalAxisProgress: 0,
            flipProgress: 0,
            distortionProgress: 0,
            x: 0,
            y: 0
        },
        armRight: {
            distance: ARM_LENGTH,
            offsetDistance: -50,
            distanceProgress: 1,
            verticalAxisProgress: 0,
            flipProgress: 0,
            x: 0,
            y: 0
        }
    }

    limbsStamp = {
        x: 0,
        y: 0,
        headFlipProgress: 0,
        animationFlipProgress: 0,
        spine: {x: 0, y: 0 },
        legLeft: { x: 0, y: 0 },
        legRight: { x: 0, y: 0 },
        armLeft: { x: 0, y: 0 },
        armRight: { x: 0, y: 0 },
        isFulfilled: true,
        isRequested: false
    }
    
    constructor(assets, audio) {
        super()

        this.audio = audio

        this.initContentContainer()
        this.initSpine(assets)
        this.initBelt(assets)
        this.initHostler(assets)
        this.initLegs(assets)
        this.initArms(assets)
        this.initHands(assets)
        this.initRevolver(assets)
        this.initStraps(assets)
        this.initHead(assets)
        this.initHat(assets)
    }

    initContentContainer() {
        const container = this.addChild(new Container)
        container.sortableChildren = true
        this.contentContainer = container
    }

    presentIdle(progress) {
        const {progressOffset} = this
        const shiftedProgress = (progress + progressOffset) % 1
        this.contentContainer.position.set(0, 0)
        this.setHeadFlip(0.035 * Math.sin(Math.PI * 2 * shiftedProgress ))
        this.animationFlipProgress = 0.025 * Math.sin(Math.PI * 2 * shiftedProgress)
        this.stretch({
            name: 'spine',
            distanceProgress: 0,
            verticalAxisProgress: -1.9 -0.05 * Math.sin(Math.PI * 4 * shiftedProgress),
            distortionProgress: 0.05 * Math.sin(Math.PI * 4 * shiftedProgress),
        })
        
        this.stretch({
            name: 'legLeft',
            distanceProgress: 0,
            verticalAxisProgress: 0.8,
            distortionProgress: 0.05,
        })

        progress = (progress + 0.5) % 1

        this.stretch({
            name: 'legRight',
            distanceProgress: 0,
            verticalAxisProgress: 0.8,
            distortionProgress: -0.05,
        })


        progress = (progress + 0.5) % 1
        this.stretch({
            name: 'armLeft',
            distanceProgress: 0.25 * Math.sin(Math.PI * 2 * progress),
            verticalAxisProgress: 0.75,
            distortionProgress: 0.05,
        })

        progress = (progress + 0.5) % 1
        this.stretch({
            name: 'armRight',
            distanceProgress: 0.25 * Math.sin(Math.PI * 2 * progress),
            verticalAxisProgress: 0.75,
            distortionProgress: -0.05,
        })
    }

    presentTremble(progress) {
        const trembleProgress = Math.sin(Math.PI * 8 * progress ) * (1 - progress)


        this.contentContainer.y = 250 * Math.abs(Math.sin(Math.PI * 12 * progress )) * (1 - progress)


        this.animationFlipProgress = 0.25 * trembleProgress
        this.stretch({
            name: 'spine',
            distanceProgress:  0.5 * trembleProgress,
            verticalAxisProgress: -1.9 + 0.25 * trembleProgress,
            distortionProgress: 1 * trembleProgress
        })
        
        this.stretch({
            name: 'legLeft',
            distanceProgress: 0,
            verticalAxisProgress: 0.8,
            distortionProgress: 0.05,
        })

        progress = (progress + 0.5) % 1

        this.stretch({
            name: 'legRight',
            distanceProgress: 0,
            verticalAxisProgress: 0.8,
            distortionProgress: -0.05,
        })


        progress = (progress + 0.5) % 1
        this.stretch({
            name: 'armLeft',
            distanceProgress: 0.5 * Math.sin(Math.PI * 2 * progress),
            verticalAxisProgress: 0.75 - 0.4 * trembleProgress,
            distortionProgress: 0.05 + 0.5 * trembleProgress,
        })

        progress = (progress + 0.5) % 1
        this.stretch({
            name: 'armRight',
            distanceProgress: 0.5 * Math.sin(Math.PI * 2 * progress),
            verticalAxisProgress: 0.75 - 0.4 * trembleProgress,
            distortionProgress: 0.05 + 0.5 * trembleProgress,
        })
    }


    presentHide(progress) {
        const { progressOffset } = this
        const sitProgress = Math.sin(Math.PI * progress)
        this.contentContainer.y = 300 * sitProgress


        this.animationFlipProgress = 0.1 * Math.sin(Math.PI * 2 * progress)
        const angleOffset = progressOffset * Math.PI

        this.stretch({
            name: 'spine',
            distanceProgress: 0,
            verticalAxisProgress: -1.9 + 0.75 * Math.sin(Math.PI * 4 * progress + angleOffset) * (1 - progress),
            distortionProgress: 0.5 * Math.sin(Math.PI * 4 * progress + angleOffset),
        })
        
        this.stretch({
            name: 'legLeft',
            distanceProgress: 0,
            verticalAxisProgress: 0.8 - 0.4 * sitProgress,
            distortionProgress: -0.05,
        })

        progress = (progress + 0.5) % 1

        this.stretch({
            name: 'legRight',
            distanceProgress: 0,
            verticalAxisProgress: 0.8 - 0.4 * sitProgress,
            distortionProgress: -0.05,
        })


        progress = (progress + 0.5) % 1
        this.stretch({
            name: 'armLeft',
            distanceProgress: 0.5 * Math.sin(Math.PI * 2 * progress),
            verticalAxisProgress: 0.75 - 0.4 * sitProgress,
            distortionProgress: 0.05,
        })

        progress = (progress + 0.5) % 1
        this.stretch({
            name: 'armRight',
            distanceProgress: 0.5 * Math.sin(Math.PI * 2 * progress),
            verticalAxisProgress: 0.75 - 0.4 * sitProgress,
            distortionProgress: -0.05,
        })
    }

    presentFade(progress) {
        const { progressOffset } = this
        const multiplier = [0.2].includes(progressOffset) < 0.4 ? 1 : -1
        const sitProgress = Math.sin(Math.PI * progress)
        this.contentContainer.x = 150 * sitProgress * multiplier
        this.contentContainer.y = 300 * sitProgress

        this.animationFlipProgress = sitProgress * multiplier * -0.5


        this.stretch({
            name: 'spine',
            distanceProgress: 0,
            verticalAxisProgress: -1.9 + 0.75 * sitProgress,
            distortionProgress: 0.5 * sitProgress * multiplier,
        })
        
        this.stretch({
            name: 'legLeft',
            distanceProgress: 0,
            verticalAxisProgress: 0.8 - 0.4 * sitProgress,
            distortionProgress: -0.05,
        })

        progress = (progress + 0.5) % 1

        this.stretch({
            name: 'legRight',
            distanceProgress: 0,
            verticalAxisProgress: 0.8 - 0.4 * sitProgress,
            distortionProgress: -0.05,
        })


        progress = (progress + 0.5) % 1
        this.stretch({
            name: 'armLeft',
            distanceProgress: 0.5 * Math.sin(Math.PI * 2 * progress),
            verticalAxisProgress: 0.75 - 0.4 * sitProgress,
            distortionProgress: 0.05,
        })

        progress = (progress + 0.5) % 1
        this.stretch({
            name: 'armRight',
            distanceProgress: 0.5 * Math.sin(Math.PI * 2 * progress),
            verticalAxisProgress: 0.75 - 0.4 * sitProgress,
            distortionProgress: -0.05,
        })
    }

    presentWalk(progress) {
        this.stretch({
            name: 'spine',
            distanceProgress: 0,
            verticalAxisProgress: -1.9,
            distortionProgress: 0.1 * Math.sin(Math.PI * 4 * progress),
        })
        
        this.stretch({
            name: 'legLeft',
            distanceProgress: -0.5 * Math.sin(Math.PI * 2 * progress),
            verticalAxisProgress: 0.7 + 0.2 * Math.sin(Math.PI * 1 * progress),
            distortionProgress: 0,
        })

        progress = (progress + 0.5) % 1

        this.stretch({
            name: 'legRight',
            distanceProgress: -0.5 * Math.sin(Math.PI * 2 * progress),
            verticalAxisProgress: 0.7 + 0.2 * Math.sin(Math.PI * 1 * progress),
            distortionProgress: 0,
        })


        progress = (progress + 0.5) % 1
        this.stretch({
            name: 'armLeft',
            distanceProgress: 0.5 * Math.sin(Math.PI * 2 * progress),
            verticalAxisProgress: 0.75,
            distortionProgress: -0.05,
        })

        progress = (progress + 0.5) % 1
        this.stretch({
            name: 'armRight',
            distanceProgress: 0.5 * Math.sin(Math.PI * 2 * progress),
            verticalAxisProgress: 0.75,
            distortionProgress: 0.05,
        })
    }

    onShot() {
        this.audio.presentBackgroundShot()
    }

    presentRandomShooting(progress) {

        progress = (progress + this.progressOffset) % 1
        const shotProgress = (progress * 8 + this.progressOffset) % 1
        const flashProgress = Math.min(1, shotProgress * 1.5)
        this.revolverView.presentFlash(Math.min(1, flashProgress * 2))

        if(shotProgress > 0.1 && this.shotProgress <= 0.1) {
            this.onShot()
        }
        
        this.shotProgress = shotProgress


        const floatingShotProgress = Math.sin(Math.PI * flashProgress)


        this.setHeadFlip(Math.sin(Math.PI * 4 * progress) * 0.05)
        
        
        this.animationFlipProgress = 0.05 * Math.sin(Math.PI * 2 * progress)
        progress = (progress * 2) % 1

        this.stretch({
            name: 'spine',
            distanceProgress: 0,// 0.2 - Math.sin(Math.PI * 2 * flashProgress) * (1 - flashProgress),
            verticalAxisProgress: -1.9 - 0.1 * Math.sin(Math.PI * 2 * progress),
            flipProgress: 0,
            distortionProgress: 0.5 * Math.sin(Math.PI * 2 * (progress + this.progressOffset))
                + 0.2 * Math.sin(Math.PI * 2 * flashProgress) * (1 - flashProgress),
        })
        
        this.stretch({
            name: 'legLeft',
            distanceProgress: 0,
            verticalAxisProgress: 0.8,
            distortionProgress: 0,
        })

        progress = (progress + 0.5) % 1

        this.stretch({
            name: 'legRight',
            distanceProgress: 0,
            verticalAxisProgress: 0.8,
            distortionProgress: 0,
        })

        progress = (progress + 0.5) % 1
        this.stretch({
            name: 'armLeft',
            distanceProgress: -0.35,
            verticalAxisProgress: 0.65,
            distortionProgress: 0,
        })

        progress = (progress + 0.5) % 1
        this.stretch({
            name: 'armRight',
            distanceProgress: -0.85 + floatingShotProgress * 0.2,
            verticalAxisProgress: 0.45 - floatingShotProgress * 0.2,
            distortionProgress: 0,
        })
    }

    presentTension(progress) {
        this.presentDance(progress)
    }

    presentDance(progress) {
        const floatingProgress = Math.sin(Math.PI * 8 * progress)
        const floatingProgress2 = Math.sin(Math.PI * 5 * progress)
        const floatingProgress3 = Math.sin(Math.PI * 4 * progress)

        this.setHeadFlip(floatingProgress3 * 0.1)

        this.contentContainer.y = -50 * Math.abs(floatingProgress)


        this.animationFlipProgress = 0.1 * floatingProgress

        this.stretch({
            name: 'spine',
            distanceProgress: 0,
            verticalAxisProgress: -1.9 + 0.25 * floatingProgress * (1 - progress),
            distortionProgress: - floatingProgress2 * 0.5,
        })
        
        this.stretch({
            name: 'legLeft',
            distanceProgress: 0,
            verticalAxisProgress: 0.8 + 0.2 * floatingProgress,
            distortionProgress: 0.05,
        })

        this.stretch({
            name: 'legRight',
            distanceProgress: 0.25 * floatingProgress,
            verticalAxisProgress: 0.8 - 0.2 * floatingProgress,
            distortionProgress: -0.05 * floatingProgress ,
        })


        this.stretch({
            name: 'armLeft',
            distanceProgress: 0.5 * floatingProgress2 -0.2,
            verticalAxisProgress: 0.7  - 0.2 * floatingProgress,
            distortionProgress: 0.05 * floatingProgress,
        })

        this.stretch({
            name: 'armRight',
            distanceProgress: 0.5 * floatingProgress2 -0.2,
            verticalAxisProgress: 0.7 + 0.2 * floatingProgress,
            distortionProgress: -0.05,
        })
    }

    initLegs(assets) {
        this.legsViews = [0, 0].map(_ => {
            const view  = new BaseLegView(assets)
            return this.contentContainer.addChild(view)
        })

        this.spineView.pelvisView.attachLegs(this.legsViews)
    }

    stretch({
        name,
        distance = this.limbs[name]?.distance,
        offsetDistance = this.limbs[name]?.offsetDistance,
        distanceProgress = this.limbs[name]?.distanceProgress,
        verticalAxisProgress = this.limbs[name]?.verticalAxisProgress,
        distortionProgress = this.limbs[name]?.distortionProgress,
    }) {
        const direction = this.limbs[name]
        if(!direction) return

        const flipAngle = Math.PI * 2 * (this.flipProgress + this.animationFlipProgress)
        const sin = Math.sin(flipAngle)
        const cos = Math.cos(flipAngle)

        direction.distanceProgress = distanceProgress
        direction.verticalAxisProgress = verticalAxisProgress
        direction.distortionProgress = distortionProgress

        const finalDistance = distance * distanceProgress
        direction.x = finalDistance * sin + offsetDistance * cos + distance * distortionProgress
        direction.y = distance * verticalAxisProgress
    }

    initSpine(assets) {
        this.spineView = this.contentContainer.addChild(new BaseSpineView(assets))
        this.spineView.zIndex = 0
    }

    initBelt(assets) {
        const view = new BaseBeltView(assets)

        this.spineView.bellyView.attachBelt(view)
    }

    initHostler(assets) {
        const view = new HostlerView(assets)
        view.scale.set(1.75)
        this.spineView.pelvisView.attachHostler(view)
        this.contentContainer.addChild(view)
    }

    initHead(assets) {
        const view = new CharacterHeadView(assets)
        view.pivot.y = 35

        this
            .spineView
            .attach({
                view,
                length: 100,
                rotationOffset: - Math.PI * 1.5,
                scaleX: 0.75,
                scaleY: 0.65,
                noDistortion: true
            })

        this.headView = view
    }

    initArms(assets) {
        this.armsViews = [0, 0].map(_ => {
            const view  = new BaseArmView(assets)
            return this.contentContainer.addChild(view)
        })

        this.spineView.chestView.attachArms(this.armsViews)
    }

    initHands(assets) {
        this.handsViews = [0, 0].map(_ => {
            const view  = new BaseHandView(assets)
            return this.contentContainer.addChild(view)
        })

    }

    initRevolver(assets) {
        const view = new RevolverView(assets)
        view.scale.set(0.65)
        this.revolverView = view
        this.handsViews[1].attachRevolver(view)
    }

    initStraps(assets) {
        this.strapsViews = [0, 0].map(_ => {
            const view  = new Sprite(assets.strap)
            view.anchor.set(0.5)
            return this.contentContainer.addChild(view)
        })

        this.spineView.chestView.attachStraps(this.strapsViews)
    }

    initHat(assets) {
        const view = new CapView(assets)

        this.headView.attachHat(view)
    }

    setFlip(flipProgress) {
        if(flipProgress < 0) flipProgress = 1 + flipProgress
        this.flipProgress = flipProgress
    }


    setFixedBoots() {
        this.legsViews.forEach(view => view.isFixedBoot = true)
    }

    adjust() {
        const {
            spineView,
            armsViews,
            legsViews,
            handsViews,
            flipProgress,
            limbs
        } = this

        let finalFlipProgress =  (this.animationFlipProgress + flipProgress) % 1
        if(finalFlipProgress < 0) finalFlipProgress += 1


        this.headView.animationFlipProgress = this.headFlipProgress

        spineView.stretch(
            spineView.x + limbs.spine.x,
            spineView.y + limbs.spine.y,
            finalFlipProgress
        )

        limbs.armLeft.jointX = armsViews[0].x
        limbs.armLeft.jointY = armsViews[0].y
        armsViews[0].stretch(
            armsViews[0].x + limbs.armLeft.x,
            armsViews[0].y + limbs.armLeft.y,
            finalFlipProgress + 0.5
        )

        limbs.armRight.jointX = armsViews[1].x
        limbs.armRight.jointY = armsViews[1].y
        armsViews[1].stretch(
            armsViews[1].x + limbs.armRight.x,
            armsViews[1].y + limbs.armRight.y,
            finalFlipProgress + 0.5
        )

        limbs.legLeft.jointX = legsViews[0].x
        limbs.legLeft.jointY = legsViews[0].y
        legsViews[0].stretch(
            legsViews[0].x + limbs.legLeft.x,
            legsViews[0].y + limbs.legLeft.y,
            finalFlipProgress
        )

        limbs.legRight.jointX = legsViews[1].x
        limbs.legRight.jointY = legsViews[1].y
        legsViews[1].stretch(
            legsViews[1].x + limbs.legRight.x,
            legsViews[1].y + limbs.legRight.y,
            finalFlipProgress
        )

        handsViews[0].position.set(
            armsViews[0].x + limbs.armLeft.x,
            armsViews[0].y + limbs.armLeft.y,
        )

        const angle = Math.PI * 2 * finalFlipProgress
        const cos = Math.cos(angle)

        handsViews[0].scale.x = -1
        handsViews[0].setFlip(1 - finalFlipProgress )
        handsViews[0].zIndex = armsViews[0].zIndex
        + Math.trunc(Math.abs(limbs.armLeft.x) * cos)

        handsViews[1].position.set(
            armsViews[1].x + limbs.armRight.x,
            armsViews[1].y + limbs.armRight.y,
        )

        handsViews[1].setFlip(finalFlipProgress )
        handsViews[1].zIndex = armsViews[1].zIndex
        + Math.trunc(Math.abs(limbs.armRight.x) * cos)

        return this
    }

    setShirtColor(color = 0xFFFFFF) {
        this.spineView.setShirtColor(color)
        this.armsViews.forEach(view => {
            view.setColor(color)
        })
    }

    setLegsColor(color = 0xFFFFFF) {
        this.spineView.setLegsColor(color)
        this.legsViews.forEach(view => {
            view.setColor(color)
        })
    }

    setButtonsColor(color = 0xFFFFFF) {
        this.spineView.setButtonsColor(color)
    }

    setHeadFlip(flipProgress) {
        this.headFlipProgress = flipProgress
    }

    refreshLimbStamp(name) {
        const { limbs, limbsStamp } = this
        limbsStamp[name].x = limbs[name].x
        limbsStamp[name].y = limbs[name].y
    }

    refreshLimbsStamp() {

        this.limbsStamp.x = this.contentContainer.x
        this.limbsStamp.y = this.contentContainer.y
        this.limbsStamp.headFlipProgress = this.headFlipProgress % 1
        this.limbsStamp.animationFlipProgress = this.animationFlipProgress % 1
        this.refreshLimbStamp('spine')
        this.refreshLimbStamp('legLeft')
        this.refreshLimbStamp('legRight')
        this.refreshLimbStamp('armLeft')
        this.refreshLimbStamp('armRight')
        this.limbsStamp.isFulfilled = false
        this.reset()
    }

    mixLimbStamp(name, scale){
        const { limbs, limbsStamp } = this
        const deltaX = limbs[name].x - limbsStamp[name].x
        const deltaY = limbs[name].y - limbsStamp[name].y
        limbs[name].x = limbsStamp[name].x + deltaX * scale
        limbs[name].y = limbsStamp[name].y + deltaY * scale
    }

    presentAnimation({
        name = 'Idle',
        progress = 0,
        mixProgressDelta = 0.25,
    }) {
        const { limbsStamp } = this

        this['present' + name](progress)

        if(limbsStamp.isFulfilled) return

        const mixScale = Math.min(1, progress / mixProgressDelta)

        this.mixLimbStamp('spine', mixScale)
        this.mixLimbStamp('legLeft', mixScale)
        this.mixLimbStamp('legRight', mixScale)
        this.mixLimbStamp('armLeft', mixScale)
        this.mixLimbStamp('armRight', mixScale)

        let deltaAngle = this.animationFlipProgress - limbsStamp.animationFlipProgress
        this.animationFlipProgress = limbsStamp.animationFlipProgress + deltaAngle * mixScale

        deltaAngle = this.headFlipProgress - limbsStamp.headFlipProgress
        this.headFlipProgress = limbsStamp.headFlipProgress + deltaAngle * mixScale

        const deltaX = this.contentContainer.x - limbsStamp.x
        const deltaY = this.contentContainer.y - limbsStamp.y
        this.contentContainer.position.set(
            limbsStamp.x + deltaX * mixScale,
            limbsStamp.y + deltaY * mixScale
        )

        if (mixScale === 1) limbsStamp.isFulfilled = true
    }

    reset() {
        this.revolverView.reset()
    }
}