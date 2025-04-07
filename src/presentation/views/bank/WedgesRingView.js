import { Container, Graphics, Sprite } from "pixi.js";
import { WedgeView } from "./WedgeView";
import { TorchView } from "./torch/TorchView";
import { Timeline } from "../../timeline/Timeline";
import { CrenelationView } from "./CrenelationView";
import { BaseCharacterView } from "./characters/base/BaseCharacterView";
import { CrateView } from "./CrateView";
import { TableView } from "./TableView";

export class WedgesRingView extends Container {
    constructor({assets, vfxLevel, audio}) {
        super(assets)

        this.initCrenelations(assets, vfxLevel)
        this.initCrates(assets)
        this.initPillars(assets)
        this.initTorches(assets, vfxLevel)

        this.initCharacters({assets, vfxLevel,audio})
        this.sortableChildren = true


        if(this.charactersViews) {
            new Timeline()
                .addAnimation({
                    duration: 5000,
                    onProgress: _ => this.charactersViews.forEach(view => view.adjust())
                })
                .setLoopMode()
                .play()
        }
    }

    initCharacters({assets, vfxLevel, audio}) {
        if(vfxLevel < 0.3) return

        this.timelines = []
        const positions = [
            [50, 175],
            [175, 50, 0.95],
            [-50, -175, 0.5],
            [-175, -50, 0.1]
        ]


        this.charactersViews = positions.map(([
            x,
            y,
            initialFlipProgress = 0
        ], i) => {
            const view = new BaseCharacterView(assets, audio)
            view.translate = (x, z) => {
                view.distance = Math.hypot(x, z)
                view.positionAngle = Math.atan2(z, x)
            }
            view.translate(x, y)

            view.initialFlipProgress = initialFlipProgress
            view.additionalFlipProgress = 0
            view.y = -511
            view.scale.set(0.175 * 0.9)
            view.legsViews.forEach(view => view.setHiddenElementsVisible(false))
            view.progressOffset = i * 0.2

            this.timelines.push(new Timeline)

            return this.addChild(view)
        })

        this.charactersViews[0]?.setShirtColor(0xFFFFAA)
        this.charactersViews[0]?.setLegsColor(0x888888)
        this.charactersViews[1]?.setShirtColor(0xBBBBBB)
        this.charactersViews[1]?.setLegsColor(0x666666)
        this.charactersViews[2]?.setShirtColor(0xFFFFFF)
        this.charactersViews[3]?.setShirtColor(0xFFEEAA)

        this.presentIdleIntro()

        /*
        new Timeline()
            .addAnimation({
                duration: 3000,
                onProgress: progress => {
                    const angle = Math.PI * 2 * progress
                    const flipProgress = (this.flipProgress + progress) % 1

                    this.charactersViews[0].setFlip(flipProgress) 
                    this.charactersViews[0].presentSlowWalk((progress * 3) % 1) 
                    this.charactersViews[0].adjust() 
                    this.charactersViews[0].translate(
                        120 * Math.cos(angle),
                        120 * Math.sin(angle),
                    )
                }
            })
            .addAnimation({
                duration: 3000,
                onProgress: progress => {
                    this.charactersViews[1].presentRandomShooting(progress) 
                    this.charactersViews[1].adjust() 

                }
            })
            .addAnimation({
                duration: 3000,
                onProgress: progress => {
                    this.charactersViews[2].presentRandomShooting(progress) 
                    this.charactersViews[2].adjust() 

                }
            })
            .addAnimation({
                duration: 3000,
                onProgress: progress => {
                    this.charactersViews[3].presentRandomShooting(progress) 
                    this.charactersViews[3].adjust() 

                }
            })
            .setLoopMode()
            .play()
        */
    }


    initCrenelations(assets, vfxLevel) {
        this.tableView = new TableView(assets)
        this.tableView.zIndex = 0
        this.tableView.y = -512
        this.tableView.scale.set(0.4)
        this.addChild(this.tableView)


        this.crenelationsViews = [


            [-118, 245],
            [ 118, 245],



            [245, 118, 0.25],
            [245, -118, 0.25],



            [-118, -245],
            [ 118, -245],



            [-245, 118, 0.25],
            [-245, -118, 0.25],

        ].map(([
            x,
            y,
            angleOffset = 0
        ]) => {
            const pillarView = new CrenelationView(assets)
            pillarView.distance = Math.hypot(x, y)
            pillarView.positionAngle = Math.atan2(y, x)
            pillarView.angleOffset = angleOffset
            pillarView.y = -511
            pillarView.scale.set(0.51)

            return this.addChild(pillarView)
        })
    }

    initCrates(assets) {
        this.cratesViews = [
            [-125, 175],

            [175, -50, 0.1],

            [60, -175, 0.175],

        ].map(([
            x,
            y,
            angleOffset = 0
        ]) => {
            const crateView = new CrateView(assets)
            crateView.visible = false
            crateView.distance = Math.hypot(x, y)
            crateView.positionAngle = Math.atan2(y, x)

            crateView.angleOffset = angleOffset
            crateView.y = -475
            crateView.scale.set(0.25)

            return this.addChild(crateView)
        })
    }


    initPillars(assets) {
        this.pillarsViews = [


            [-118, 280],
            [ 118, 280],



            [280, 118, 0.75],
            [280, -118, 0.75],



            [-118, -280, 0.5],
            [ 118, -280, 0.5],



            [-280, 118, 0.25],
            [-280, -118, 0.25],

        ].map(([
            x,
            y,
            angleOffset = 0
        ]) => {
            const pillarView = new WedgeView(assets)
            pillarView.distance = Math.hypot(x, y)
            pillarView.positionAngle = Math.atan2(y, x)
            pillarView.angleOffset = angleOffset

            return this.addChild(pillarView)
        })
    }

    initTorches(assets, vfxLevel) {
        const isHighVFXLevel = vfxLevel >= 0.15
        const distances = [190, 300]

        this.torchesViews = [


            [-distances[0], distances[1]],
            [ distances[0], distances[1]],



            [distances[1], distances[0], 0.75],
            [distances[1], -distances[0], 0.75],



            [-distances[0], -distances[1], 0.5],
            [ distances[0], -distances[1], 0.5],



            [-distances[1], distances[0], 0.25],
            [-distances[1], -distances[0], 0.25],

        ].map(([
            x,
            y,
            angleOffset = 0
        ], i) => {
            const pillarView = new TorchView({
                assets,
                progressOffset: i * 0.17,
                isFlipped: i % 2 !== 0,
                isBurning: isHighVFXLevel || i < 2
            })
            pillarView.distance = Math.hypot(x, y)
            pillarView.positionAngle = Math.atan2(y, x)
            pillarView.angleOffset = angleOffset
            pillarView.scale.set( 0.65)

            pillarView.y = -450

            return this.addChild(pillarView)
        })

        new Timeline()
            .addAnimation({
                duration: 1500,
                onProgress: progress => {
                    this.torchesViews.forEach(view => {
                        if(!view.visible) return
                        view.present(progress)
                    })
                }
            })
            .setLoopMode()
            .play()
    }

    setFlip(flipProgress = this.flipProgress) {

        this.flipProgress = flipProgress
        const angle = flipProgress * Math.PI * 2

        this.tableView.setFlip(flipProgress)

        this.charactersViews?.forEach(view => {
            const finalFlipProgress = (flipProgress + view.initialFlipProgress + view.additionalFlipProgress) % 1
            view.x = view.distance * Math.cos(view.positionAngle + angle)
            view.zIndex = view.distance * Math.sin(view.positionAngle + angle) * 0.0001
            view.setFlip(finalFlipProgress)
        })

        this.cratesViews.forEach(view => {
            if(!view.visible) return

            const finalFlipProgress = (flipProgress + view.angleOffset) % 1
            view.x = view.distance * Math.cos(view.positionAngle + angle)
            view.zIndex = view.distance * Math.sin(view.positionAngle + angle) * 0.0001
            view.setFlip(finalFlipProgress)
        })

        this.crenelationsViews.forEach(view => {
            if(!view.visible) return

            view.x = view.distance * Math.cos(view.positionAngle + angle)
            view.zIndex = view.distance * Math.sin(view.positionAngle + angle)
            view.setFlip(flipProgress + view.angleOffset)

            view.skew.x = -0.15 * Math.cos(view.positionAngle + angle)
        })

        this.pillarsViews.forEach(view => {
            if(!view.visible) return

            view.x = view.distance * Math.cos(view.positionAngle + angle)
            const finalFlipProgress = (flipProgress + view.angleOffset) % 1
            view.zIndex = view.distance * Math.sin(view.positionAngle + angle)
            view.setFlip(finalFlipProgress)
  
            if (finalFlipProgress > 0.75) {
                view.zIndex += 1000
            } else if (finalFlipProgress > 0.5) {
                view.zIndex -= 1000
            } else if (finalFlipProgress > 0.25) {
                view.zIndex -= 1000
            } else {
                view.zIndex += 1000
            }

        })

        this.torchesViews.forEach(view => {
            if(!view.visible) return

            view.x = view.distance * Math.cos(view.positionAngle + angle)
            const finalFlipProgress = (flipProgress + view.angleOffset) % 1
            view.zIndex = view.distance * Math.sin(view.positionAngle + angle)
            view.setFlip(finalFlipProgress)

            if (finalFlipProgress > 0.75) {
                view.zIndex += 1000
            } else if (finalFlipProgress > 0.5) {
                view.zIndex -= 1000
            } else if (finalFlipProgress > 0.25) {
                view.zIndex -= 1000
            } else {
                view.zIndex += 1000
            }

        })
    }

    presentMovement() {

    }

    setHiddenElementsVisible(isVisible = true) {
        const {
            crenelationsViews,
            torchesViews,
            pillarsViews
        } = this


        torchesViews[3].visible = isVisible
        torchesViews[4].visible = isVisible
        torchesViews[5].visible = isVisible
        torchesViews[7].visible = isVisible


        crenelationsViews[3].visible = isVisible
        crenelationsViews[4].visible = isVisible
        crenelationsViews[5].visible = isVisible
        crenelationsViews[7].visible = isVisible

        pillarsViews[0].visible = isVisible
        pillarsViews[1].visible = isVisible
        pillarsViews[3].visible = isVisible
        pillarsViews[4].visible = isVisible
        pillarsViews[5].visible = isVisible
        pillarsViews[7].visible = isVisible



        this.setFlip()

    }

    setReelsPillarsVisible(isVisible = true) {
        this.pillarsViews[0].visible = isVisible
        this.pillarsViews[1].visible = isVisible
    }

    async presentAssault() {
        const {
            timelines,
            charactersViews,
        } = this

        if(!charactersViews) return
        
        charactersViews.forEach(view => view.refreshLimbsStamp())
        timelines.forEach(timeline => timeline.deleteAllAnimations())

        timelines[0]
            .addAnimation({
                duration: 1000,
                onProgress: progress => {
                    charactersViews.forEach(view => {
                        view.presentAnimation({name: 'Hide', progress})
                    })
                },
                onFinish: () => {
                    charactersViews.forEach((view, i) => {
                        view.refreshLimbsStamp()
                        timelines[i]
                            .deleteAllAnimations()
                            .addAnimation({
                                duration: 6000 + i * 2234,
                                onProgress: progress => {
                                    const subProgress = ((( 6000 + i * 2234) * progress) / 4500) % 1
                                    charactersViews[i].presentAnimation({name: 'RandomShooting', progress: subProgress, mixProgressDelta: 0.05})
                                },
                                onFinish: () => {
                                    charactersViews[i].refreshLimbsStamp()
                                }
                            })
                            .addAnimation({
                                delay: timelines[i].duration,
                                duration: 1000,
                                onProgress: progress => {
                                    charactersViews[i].presentAnimation({name: 'Fade', progress })
                                },
                                onFinish: () => {
                                    charactersViews[i].refreshLimbsStamp()
                                }
                            })
                            .setLoopMode()
                            .play()
                    })
                }
            })
            .play()

    }

    presentIdleIntro() {
        const {
            timelines,
            charactersViews,
        } = this

        if(!charactersViews) return
        
        charactersViews.forEach(view => view.refreshLimbsStamp())
        timelines.forEach(timeline => timeline.deleteAllAnimations())

        return timelines[0]
            .addAnimation({
                duration: 2500,
                onProgress: progress => {
                    charactersViews.forEach(view => {
                        view.presentAnimation({name: 'Idle', progress})
                    })
                },
            })
            .setLoopMode()
            .play()
    }


    presentIdle() {
        return
        const {
            timelines,
            charactersViews,
        } = this

        if(!charactersViews) return
        
        charactersViews.forEach(view => view.refreshLimbsStamp())
        timelines.forEach(timeline => timeline.deleteAllAnimations())

        return timelines[0]
            .addAnimation({
                duration: 2500,
                onProgress: progress => {
                    charactersViews.forEach(view => {
                        view.presentAnimation({name: 'Idle', progress})
                    })
                },
            })
            .setLoopMode()
            .play()
    }


    async presentShooting() {
        const {
            timelines,
            charactersViews,
        } = this

        if(!charactersViews) return
        
        charactersViews.forEach((view, i) => {
            view.refreshLimbsStamp()
            timelines[i]
                .deleteAllAnimations()
                .addAnimation({
                    duration: 6000 + i * 2234,
                    onProgress: progress => {
                        const subProgress = ((( 6000 + i * 2234) * progress) / 4500) % 1
                        charactersViews[i].presentAnimation({name: 'RandomShooting', progress: subProgress, mixProgressDelta: 0.05})
                    },
                    onFinish: () => {
                        charactersViews[i].refreshLimbsStamp()
                    }
                })
                .addAnimation({
                    delay: timelines[i].duration,
                    duration: 1000,
                    onProgress: progress => {
                        charactersViews[i].presentAnimation({name: 'Fade', progress })
                    },
                    onFinish: () => {
                        charactersViews[i].refreshLimbsStamp()
                    }
                })
                .setLoopMode()
                .play()
        })

    }

    presentTension() {
        const {
            timelines,
            charactersViews,
        } = this

        if(!charactersViews) return
        
        charactersViews.forEach((view, i) => {
            view.refreshLimbsStamp()
            timelines[i]
                .deleteAllAnimations()
                .addAnimation({
                    duration: 5000,
                    onProgress: progress => {
                        charactersViews[i].presentAnimation({name: 'Tension', progress})
                    },
                })
                .setLoopMode()
                .play()
        })
    }
}