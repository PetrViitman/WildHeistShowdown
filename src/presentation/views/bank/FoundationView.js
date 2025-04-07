import { Container, Graphics, Sprite } from "pixi.js";
import { PillarView } from "./PillarView";
import { HalfBoxView } from "./HalfBoxView";
import { StairsView } from "./stairs/StairsView";
import { BaseCharacterView } from "./characters/base/BaseCharacterView";
import { Timeline } from "../../timeline/Timeline";
import { BarrelView } from "./BarrelView";
import { StallView } from "./StallView";
import { brightnessToHexColor } from "../GraphicalPrimitives";
import { CrateView } from "./CrateView";


const BRING_TO_FRONT_Z_INDEX = 1000

export class FoundationView extends HalfBoxView {
    pillarsViews
    stairsView
    
    constructor(assets, vfxLevel) {
        super(assets)

        this.initPillars(assets, vfxLevel)

        this.initCorners()
        this.initStairs(assets, vfxLevel)
        this.initCrates(assets)
        this.initGrass(assets)
        //this.initSandCorners(assets)
        this.initCactuses(assets)
        this.sortableChildren = true
    }

    initFaces(assets) {
        this.backgroundView = this.addChild(new Sprite(assets.foundation_light))
        this.backgroundView.anchor.set(0.5, 1)

        this.zIndexDistances = []
        for(let i = 0; i < 2; i++) {
            const view = new Sprite(assets.foundation_face)
            view.anchor.set(0.5, 1)
            view.y = -1

            this.distances[i] = 439
            this.zIndexDistances[i] = Math.hypot(this.distances[i], this.distances[i])
            this.facesViews[i] = this.addChild(view)
        }
    }

    initCorners() {
        const distance = Math.hypot(439, 439)
        this.cornersViews = [
            0,
            0,
            0,
            0
        ].map(_ => {
            const view = this
                .addChild(new Container)
                //.beginFill(0x00FF00, 0)
                //.drawRect(-10, -10, 20, 20)
                //.endFill()

            view.distance = distance
            return view
        })
    }

    initCactuses(assets) {
        this.cactusesViews = [
            [-275, 1100],

            [275, 1100],

        ].map(([
            x,
            y,
        ]) => {
            const cactusView = new Sprite(assets.cactus)
            cactusView.anchor.set(0.5, 1)
            cactusView.translate = (x, z) => {
                cactusView.distance = Math.hypot(x, z)
                cactusView.positionAngle = Math.atan2(z, x)
            }

            cactusView.translate(x, y)

            cactusView.y = 200
            cactusView.scale.set(0.55)
            cactusView.visible = false

            return this.addChild(cactusView)
        })
        

        this.cactusesViews[1].scale.x *= -1
    }

    initGrass(assets) {
        this.grassViews = [
            [-75, 625, 0.4],
            [-100, 650, 0.5],
        ].map(([
            x,
            z,
            scale,
        ]) => {
            const view = new Sprite(assets.grass)
            view.anchor.set(0.5, 1)
            view.translate = (x, z) => {
                view.distance = Math.hypot(x, z)
                view.positionAngle = Math.atan2(z, x)
            }

            view.translate(x, z)

            view.y = 0
            view.scale.set(scale)

            return this.addChild(view)
        })

        new Timeline()
            .addAnimation({
                duration: 3000,
                onProgress: progress => {
                    const sin = Math.max(0.5, (1 - Math.sin(Math.PI * progress)))
                    this.grassViews.forEach((view, i) => {
                        const finalProgress = (i * 0.25 + progress) % 1
                        view.skew.x = 0.2 * Math.sin(Math.PI * 8 * finalProgress) * sin
                        // view.rotation = 0.03 * Math.sin(Math.PI * 2 * finalProgress) 
                    })
                }
            })
            .setLoopMode()
            .play()

    }

    initCrates(assets) {
        this.cratesViews = [
            [-120, 600, 0, 0.25, 0.025 ],
            [-190, 550, 0, 0.45, -0.1],

            [190, 500, 0, 0.45, 0.2],
            [120, 600, 0, 0.25, 0.975],

            [520, 170, 0, 0.45, 0.1],
            [-510, 170, 0, 0.45, -0.05],
            

        ].map(([
            x,
            z,
            y = 0,
            scale = 0.4,
            angleOffset = 0
        ]) => {
            const barrelView = new CrateView(assets)
            barrelView.distance = Math.hypot(x, z)
            barrelView.positionAngle = Math.atan2(z, x)

            barrelView.angleOffset = angleOffset
            barrelView.y = y
            barrelView.scale.set(scale)
            // barrelView.pivot.y = barrelView.height

            return this.addChild(barrelView)
        })
    }

    initPillars(assets, vfxLevel) {
        if(vfxLevel > 0.15) {
            this.chainsViews = [
                [-258, 390],
                [258, 390],

                [-258, -390],
                [258, -390],

                [390, -258, Math.PI / 2],
                [390, 258, Math.PI / 2],

                [-390, -258, Math.PI / 2],
                [-390, 258, Math.PI / 2],

            ].map(([
                x,
                y,
                angleOffset = 0
            ]) => {
                const view = new Sprite(assets.chain)
                view.anchor.set(0.5, 0.15)
                view.scale.set(0.625)
                view.distance = Math.hypot(x, y)
                view.positionAngle = Math.atan2(y, x)
                view.angleOffset = angleOffset
                view.y = -175

                return this.addChild(view)
            })
        }


        this.pillarsViews = [
            [-390, 390, 1 - 0.025],

            [-132, 390, 1 + 0.01],
            [ 132, 390, 0 - 0.01],

            [ 390, 390, 0.75 + 0.025],

            [390, 132, 0.75 + 0.01],
            [390, -132, 0.75 - 0.01],

            [-390, -390, 0.5 + 0.025],

            [-132, -390, 0.5 - 0.01],
            [ 132, -390, 0.5 + 0.01],

            [390, -390, 0.5 - 0.025],

            [-390, 132, 0.25 - 0.01],
            [-390, -132, 0.25 + 0.01],

        ].map(([
            x,
            y,
            angleOffset = 0
        ]) => {
            const pillarView = new PillarView(assets, vfxLevel)
            pillarView.distance = Math.hypot(x, y)
            pillarView.positionAngle = Math.atan2(y, x)
            pillarView.angleOffset = angleOffset
            pillarView.y = -117

            return this.addChild(pillarView)
        })

        new Timeline()
            .addAnimation({
                duration: 1000,
                onProgress: progress => {
                    this.pillarsViews.forEach((view, i) => {
                        const reflectionAlpha = Math.sin(Math.PI * ((i * 0.2 + progress) % 1))
                        view.scale.set(0.5)
                        view.setReflectionAlpha(reflectionAlpha)
                    })
                }
            })
            .setLoopMode()
            .play()


        new Timeline()
            .addAnimation({
                duration: 7500,
                onProgress: progress => {
                    const sin = Math.max(0.5, (1 - Math.sin(Math.PI * progress)))
                    this.chainsViews?.forEach((view, i) => {
                        const finalProgress = (i * 0.25 + progress) % 1
                        view.skew.x = 0.2 * Math.sin(Math.PI * 8 * finalProgress) * sin
                        // view.rotation = 0.03 * Math.sin(Math.PI * 2 * finalProgress) 
                    })
                }
            })
            .setLoopMode()
            .play()
    }

    initStairs(assets, vfxLevel) {

        let descriptors = [
            [0, 437, 0.25 ],
        ]

        if (vfxLevel >= 0.15) {
            descriptors = [descriptors[0], ...[
                [0, -437, 0.75 ],
                [437, 0, 0 ],
                [-437, 0, 0.5 ],
            ]]
        }

        this.stairsViews = descriptors.map(([
            x,
            z,
            angleOffset = 0
        ]) => {
            const stairsView = new StairsView(assets)
            stairsView.distance = Math.hypot(x, z)
            stairsView.positionAngle = Math.atan2(z, x)

            stairsView.angleOffset = angleOffset
            stairsView.y = 0
            stairsView.scale.set(0.5)

            return this.addChild(stairsView)
        })
    }

    setFlip(flipProgress) {
        const shift = 0.5 / this.facesViews.length


        let leftMostX = 0
        let leftMostZ = 0
        let rightMostX = 0
        let rightMostZ = 0

        this.cornersViews.forEach((view, i) => {
            const progress = (0.125 + (i * 0.25) + flipProgress) % 1
            const angle = Math.PI * 2 * progress

            view.x = view.distance * Math.cos(angle)
            view.zIndex = view.distance * Math.sin(angle)

            if(view.x < leftMostX) {
                leftMostX = view.x
                leftMostZ = view.zIndex
            } else if (view.x > rightMostX) {
                rightMostX = view.x
                rightMostZ = view.zIndex
            }
        })

        this.facesViews.forEach((view, i) => {
            let faceProgress = (shift * i + flipProgress) % 1
            const isMirrored = faceProgress < 0.25 || faceProgress > 0.75

            if (isMirrored) faceProgress += 0.5

            view.x = this.distances[i] * Math.sin( faceProgress * Math.PI * 2)
            view.scale.x = Math.abs(Math.cos(faceProgress * Math.PI * 2))
            const tint = brightnessToHexColor(1 - Math.abs(Math.sin(faceProgress * Math.PI * 2)) * 0.5)
            
            view.tint = tint

            if(view.x < 0) {
                view.zIndex = leftMostZ
            } else {
                view.zIndex = rightMostZ
            }

            view.zIndex += BRING_TO_FRONT_Z_INDEX
        })

        this.backgroundView.zIndex = Math.min(leftMostZ, rightMostZ) - 1 + BRING_TO_FRONT_Z_INDEX
    
        this.flipProgress = flipProgress
        const angle = flipProgress * Math.PI * 2

        const {stairsView} = this

        this.chainsViews?.forEach(view => {
            view.x = view.distance * Math.cos(view.positionAngle + angle)
            const finalAngle = view.positionAngle + angle
            // view.setFlip(flipProgress + view.angleOffset )
            view.zIndex = view.distance * Math.sin(finalAngle)
            view.scale.x = Math.cos(angle +view.angleOffset) * 0.625
            view.visible = view.scale.x > 0.25
        })

        this.pillarsViews.forEach(view => {
            view.x = view.distance * Math.cos(view.positionAngle + angle)
            view.setFlip(flipProgress + view.angleOffset )
            view.zIndex = view.distance * Math.sin(view.positionAngle + angle)
        })

        this.cratesViews.forEach((view, i) => {
            const finalFlipProgress = (flipProgress + view.angleOffset) % 1
            const finalAngle = view.positionAngle + angle
            view.setFlip(finalFlipProgress )

            view.x = view.distance * Math.cos(finalAngle)
            view.zIndex = view.distance * Math.sin(finalAngle)

            const offsetSize = view.width / 2

            if (view.x > leftMostX - offsetSize && view.x < 0 && view.zIndex < leftMostZ) {
                view.zIndex -= 100000
            } else if (view.x > 0 && view.x < rightMostX + offsetSize && view.zIndex < rightMostZ) {
                view.zIndex -= 100000
            }

            view.zIndex += BRING_TO_FRONT_Z_INDEX
        })

        this.grassViews.forEach((view, i) => {
            const finalFlipProgress = (flipProgress + view.angleOffset) % 1
            const finalAngle = view.positionAngle + angle

            view.x = view.distance * Math.cos(finalAngle)
            view.zIndex = view.distance * Math.sin(finalAngle)

            const offsetSize = view.width / 2

            if (view.x > leftMostX - offsetSize && view.x < 0 && view.zIndex < leftMostZ) {
                view.zIndex -= 100000
            } else if (view.x > 0 && view.x < rightMostX + offsetSize && view.zIndex < rightMostZ) {
                view.zIndex -= 100000
            }

            view.zIndex += BRING_TO_FRONT_Z_INDEX
        })

        this.stairsViews.forEach((view) => {
            if(!view.visible) return

            const finalFlipProgress = (flipProgress + view.angleOffset) % 1
            const finalAngle = view.positionAngle + angle
            view.setFlip(finalFlipProgress)

            view.x = view.distance * Math.cos(finalAngle)
            view.zIndex = (view.distance + 2) * Math.sin(finalAngle)

            const offsetSize = view.width / 2

            if (view.x > leftMostX - offsetSize && view.x < 0 && view.zIndex < leftMostZ) {
                view.zIndex -= 100000
            } else if (view.x > 0 && view.x < rightMostX + offsetSize && view.zIndex < rightMostZ) {
                view.zIndex -= 100000
            }

            view.zIndex += BRING_TO_FRONT_Z_INDEX
        })

        /*
        this.sandCornersViews.forEach((view) => {
            const finalAngle = view.positionAngle + angle


            view.x = view.distance * Math.cos(finalAngle)
            view.zIndex = (view.distance + 2) * Math.sin(finalAngle)

            const offsetSize = view.width / 2

            if (view.x > leftMostX - offsetSize && view.x < 0 && view.zIndex < leftMostZ) {
                view.zIndex -= 100000
            } else if (view.x > 0 && view.x < rightMostX + offsetSize && view.zIndex < rightMostZ) {
                view.zIndex -= 100000
            }

            view.zIndex += BRING_TO_FRONT_Z_INDEX
        })*/


        this.cactusesViews.forEach(view => {
            const finalAngle = view.positionAngle + angle
            view.x = view.distance * Math.cos(finalAngle)
            view.zIndex = view.distance * Math.sin(finalAngle)

            view.zIndex += BRING_TO_FRONT_Z_INDEX
        })

        this.backgroundView.width = this.facesViews[0].width + this.facesViews[1].width
    }

    onResize(width, height) {
        const ratio = width / height
        const finalWidth = 850 * ratio

       // this.cactusesViews[0].translate(-finalWidth / 2, 1000)
       // this.cactusesViews[1].translate(finalWidth / 2, 1000)
    }

    setHiddenElementsVisible(isVisible) {
        const {pillarsViews, stairsViews} = this

        pillarsViews[8].visible = isVisible
        pillarsViews[7].visible = isVisible

        

        this.stairsViews.forEach((view, i) => {
            if(i) {
                view.visible = isVisible
            }
        })
    }
}