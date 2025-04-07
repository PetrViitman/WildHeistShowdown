import { Container, Sprite } from "pixi.js";
import { Timeline } from "../../timeline/Timeline";
import { brightnessToHexColor } from "../GraphicalPrimitives";
import { MexicanBanditView } from "./characters/bandits/mexican/MexicanBanditView";
import { BaseCharacterView } from "./characters/base/BaseCharacterView";
import { AdventurerBanditView } from "./characters/bandits/adventurer/AdventurerBanditView";

export class ForegroundView extends Container {
    cracksViews
    grassViews
    cactusesViews
    charactersViews = []
    winCallsCount = 0
    loseCallsCount = 0

    character1View
    character2View

    isWinPresentationInProgress = false

    isIdling = false

    timelines = [
        new Timeline,
        new Timeline
    ]

    constructor({assets, vfxLevel, audio}) {
        super()
        this.initCracks(assets, vfxLevel)
        this.initGrass(assets, vfxLevel)
        this.initCactuses(assets)
        this.initCharacters(assets, vfxLevel, audio)

        new Timeline()
            .addAnimation({
                duration: 5000,
                onProgress: progress => this.setIdleProgress(progress)
            })
            .setLoopMode()
            .play()

        this.presentIdle()
    }

    initCracks(assets, vfxLevel) {
        if (vfxLevel < 0.15) return

        this.cracksViews = [
            {x: 0.25, scaleFactor: 1, y: -30},
            {x: 0.5, scaleFactor: 1, y: -35},
            {x: 0.75, scaleFactor: 1, y: -30},
        ].map(({x, y, scaleFactor}) => {
            const view = new Sprite(assets.soil_crack)
            view.anchor.set(0.5, 0)
            view.y = y
            view.scale.set(scaleFactor * 1)
            view.scale.y *= 0.75
            view.offsetX = x

            return this.addChild(view)
        })
    }

    initGrass(assets, vfxLevel) {
        if (vfxLevel < 0.15) return

        this.grassViews = [
            {x: 0.075, scaleFactor: 0.475},
            {x: 0.125, scaleFactor: 0.475},
            {x: 0.1, scaleFactor: 0.65},


            {x: 0.25, scaleFactor: 0.85},
            {x: 0.275, scaleFactor: 0.55},

            {x: 0.375, scaleFactor: 0.75},
            {x: 0.425, scaleFactor: 0.75},
            {x: 0.4, scaleFactor: 1},

            {x: 0.625, scaleFactor: 0.85},
            {x: 0.65, scaleFactor: 0.55},

            {x: 0.875, scaleFactor: 0.475},
            {x: 0.925, scaleFactor: 0.475},
            {x: 0.9, scaleFactor: 0.65},

        ].map(({x, scaleFactor}) => {
            const view = new Sprite(assets.grass)
            view.anchor.set(0.5, 1)
            view.y = -10
            view.scale.set(scaleFactor)
            view.offsetX = x

            return this.addChild(view)
        })

        this.grassViews2 = [
            {x: 0.2, scaleFactor: 0.6},
            {x: 0.4, scaleFactor: 1},
            {x: 0.7, scaleFactor: 0.75},
            {x: 0.8, scaleFactor: 0.8},
            {x: 0.9, scaleFactor: 0.4},
        ].map(({x, scaleFactor}) => {
            const view = new Sprite(assets.grass)
            view.anchor.set(0.5, 1)
            view.y = 20
            view.scale.set(scaleFactor)
            view.offsetX = x

            view.tint = brightnessToHexColor(0.9)

            return this.addChild(view)
        })

        this.grassViews3 = [
            {x: 0.3, scaleFactor: 1},
            {x: 0.55, scaleFactor: 1},
            {x: 0.575, scaleFactor: 0.8},
            {x: 0.8, scaleFactor: 1},
            {x: 0.95, scaleFactor: 1},

        ].map(({x, scaleFactor}) => {
            const view = new Sprite(assets.grass)
            view.anchor.set(0.5, 1)
            view.y = 75
            view.scale.set(scaleFactor)
            view.offsetX = x

            view.tint = brightnessToHexColor(0.8)

            return this.addChild(view)
        })
    }

    initCactuses(assets) {
        this.cactusesViews = [
            {x: 0.5 -0.125, scaleFactor: 0.733},
            {x: 0.5 +0.125, scaleFactor: 0.733},
        ].map(({x, scaleFactor}) => {
            const view = new Sprite(assets.cactus)
            view.anchor.set(0.5, 1)
            view.y = 160
            view.scale.set(scaleFactor)
            view.offsetX = x

            return this.addChild(view)
        })

        this.cactusesViews[0].scale.x *= -1
    }

    initCharacters(assets, vfxLevel, audio) {

        if(vfxLevel < 0.2) return

        this.charactersViews = [0.4, 0.6].map((offsetX, i) => {
            const view = i
                ? new AdventurerBanditView(assets, audio)
                : new MexicanBanditView(assets, audio)
            view.offsetX = offsetX
            view.scale.set(0.35)
            view.y = 25

            view.legsViews.forEach(view => view.isFixedBoot = true)

            return this.addChild(view)
        })


        this.charactersViews[0].setFlip(0.55)
        this.charactersViews[0].setFlip(0)
        this.charactersViews[1].setFlip(0)
        // this.charactersViews[1].setFlip(0.55)
    }

    setFlip(progress) {
        let subProgress = (progress * 2) % 1
        this.cracksViews?.forEach(view => {
            const finalProgress = (1 - ((view.offsetX + subProgress)) % 1)
            view.x = -1000 + 2000 * finalProgress
            view.alpha = Math.min(1, Math.sin(Math.PI * finalProgress) * 1) * 0.5
        })

        subProgress = (progress * 2) % 1
        this.grassViews?.forEach(view => {
            const finalProgress = (1 - ((view.offsetX + subProgress)) % 1)
            view.x = -1000 + 2000 * finalProgress
            view.alpha = Math.min(1, Math.sin(Math.PI * finalProgress) * 3)
        })

        subProgress = (progress * 3) % 1
        this.grassViews2?.forEach(view => {
            const finalProgress = (1 - ((view.offsetX + subProgress)) % 1)
            view.x = -1000 + 2000 * finalProgress
            view.alpha = Math.min(1, Math.sin(Math.PI * finalProgress) * 3)
        })

        subProgress = (progress * 4) % 1
        this.grassViews3?.forEach(view => {
            const finalProgress = (1 - ((view.offsetX + subProgress)) % 1)
            view.x = -1000 + 2000 * finalProgress
            view.alpha = Math.min(1, Math.sin(Math.PI * finalProgress) * 3)
        })

        subProgress = (progress * 5) % 1
        
        this.cactusesViews.forEach((view, i) => {
            const finalProgress = (1 - ((view.offsetX + subProgress)) % 1)
            view.x = -1000 + 2000 * finalProgress
            view.alpha = Math.min(1, Math.sin(Math.PI * finalProgress) * 5)

            const offsetX = view.x < 0
                ? Math.max(-250, view.x)
                : Math.min(250, view.x)


            if (this.isLocked) {
                view.skew.x = Math.max(-0.25, Math.min(0.25, 0.25 - 250 / Math.abs(offsetX) * 0.25))

                if(i) view.skew.x *= -1
            }
        })

        this.charactersViews?.forEach((view, i) => {
            const finalProgress = (1 - ((view.offsetX + subProgress)) % 1)
            view.x = -1000 + 2000 * finalProgress
            view.alpha = Math.min(1, Math.sin(Math.PI * finalProgress) * 5)
        })

    
    }

    setIdleProgress(progress) {
        const sin = Math.max(0.5, (1 - Math.sin(Math.PI * progress)))

        this.grassViews3?.forEach(view => {
            const finalProgress = (view.offsetX + progress) % 1
            view.skew.x = 0.2 * Math.sin(Math.PI * 8 * finalProgress) * sin
            // view.rotation = 0.03 * Math.sin(Math.PI * 2 * finalProgress) 
        })

        this.grassViews2?.forEach(view => {
            const finalProgress = (view.offsetX + progress) % 1
            view.skew.x = 0.2 * Math.sin(Math.PI * 8 * finalProgress) * sin
            // view.rotation = 0.03 * Math.sin(Math.PI * 2 * finalProgress) 
        })


        this.grassViews?.forEach(view => {
            const finalProgress = (view.offsetX + progress) % 1
            view.skew.x = 0.2 * Math.sin(Math.PI * 8 * finalProgress) * sin
            // view.rotation = 0.03 * Math.sin(Math.PI * 2 * finalProgress) 
        })

        /*
        this.charactersViews?.forEach((view, i) => {
            i && view.presentIdle(progress)
            view.adjust()
        })
            */

        this.charactersViews.forEach(view => {
            view.adjust()
        })
    }

    setLocked(isLocked = true) {
        this.isLocked = isLocked
    }


    presentIdle() {
        const {
            timelines,
            charactersViews,
        } = this

        if(!charactersViews.length) return

        if(this.isWinPresentationInProgress) return this.presentWinOutro()


        if(this.isWinOutroInProgress) return


        if(this.isIdling) return

        this.isIdling = true


        charactersViews.forEach(view => view.refreshLimbsStamp())

        timelines[1].deleteAllAnimations()
        timelines[0]
            .deleteAllAnimations()
            .addAnimation({
                duration: 2000,
                onProgress: progress => {
                    charactersViews.forEach(view => view.presentAnimation({progress, name: 'Idle'}))
                }
            })
            .setLoopMode()
            .play()

    }

    presentTension() {
        const {
            timelines,
            charactersViews,
        } = this

        if(!charactersViews.length) return

        if(this.isWinPresentationInProgress) return this.presentWinOutro()


        if(this.isWinOutroInProgress) return

        this.isIdling = false

        charactersViews.forEach(view => view.refreshLimbsStamp())

        timelines[1].deleteAllAnimations()
        timelines[0]
            .deleteAllAnimations()
            .addAnimation({
                duration: 2500,
                onProgress: progress => {
                    charactersViews.forEach(view => view.presentAnimation({progress, name: 'Tension'}))
                }
            })
            .setLoopMode()
            .play()

    }

    presentLose() {
        
        if(!this.charactersViews.length) return

        this.isIdling = false

        this.loseCallsCount++
        const isOddCall = this.loseCallsCount % 2
        const {
            timelines,
            charactersViews,
        } = this

        const character1View = isOddCall ? charactersViews[0] : charactersViews[1]
        const character2View = isOddCall ? charactersViews[1] : charactersViews[0]

        charactersViews.forEach(view => view.refreshLimbsStamp())
        timelines[1].deleteAllAnimations()
        timelines[0]
            .deleteAllAnimations()
            .addAnimation({
                duration: 1000,
                onProgress: progress => {
                    character1View.presentAnimation({name: 'Lose1', progress})
                    character2View.presentAnimation({name: 'Lose2', progress})
                },
                onFinish: () => {
                    charactersViews.forEach(view => view.refreshLimbsStamp())
                    timelines[0]
                        .deleteAllAnimations()
                        .addAnimation({
                            duration: 2000,
                            onProgress: progress => {
                                charactersViews.forEach(view => view.presentAnimation({progress, name: 'Idle'}))
                            }
                        })
                        .setLoopMode()
                        .windToTime(1)
                        .play()
                }
            })
            .play()
    }


    presentWinOutro() {
        const {
            timelines,
            charactersViews,
        } = this

        if(!charactersViews.length) return

        this.isWinPresentationInProgress = false
        this.isWinOutroInProgress = true

        this.isIdling = false

        const character1View = this.character1View ?? charactersViews[0]
        const character2View = this.character2View ?? charactersViews[1]
        
        charactersViews.forEach(view => view.refreshLimbsStamp())

        timelines[0]
            .deleteAllAnimations()
            .addAnimation({
                duration: 2000,
                onProgress: progress => {
                    character1View.presentAnimation({name: 'Idle', progress})
                },
            })
            .setLoopMode()
            .play()

        timelines[1]
            .deleteAllAnimations()
            .addAnimation({
                duration: 500,
                onProgress: progress => {
                    character2View.presentAnimation({name: 'TurnBack', progress})
                },
                onFinish: () => {
                    this.isWinOutroInProgress = false
                    character2View.refreshLimbsStamp()
                    timelines[1]
                        .deleteAllAnimations()
                        .addAnimation({
                            duration: 2000,
                            onProgress: progress => {
                                character2View.presentAnimation({name: 'Idle', progress})
                            }
                        })
                        .setLoopMode()
                        .windToTime(1)
                        .play()
                }
            })
            .play()
    }


    presentWin() {
        const {
            timelines,
            charactersViews,
        } = this

        if(!charactersViews.length) return

        this.isIdling = false
        
        this.isWinPresentationInProgress = true
        this.winCallsCount++
        const isOddCall = this.winCallsCount % 2
        


        const character1View = isOddCall ? charactersViews[0] : charactersViews[1]
        const character2View = isOddCall ? charactersViews[1] : charactersViews[0]

        this.character1View = character1View
        this.character2View = character2View

        charactersViews.forEach(view => view.refreshLimbsStamp())

        timelines[0]
            .deleteAllAnimations()
            .addAnimation({
                duration: 3000,
                onProgress: progress => {
                    character1View.presentAnimation({name: 'Dance', progress})
                }
            })
            .setLoopMode()
            .play()

        timelines[1]
            .deleteAllAnimations()
            .addAnimation({
                duration: 750,
                onProgress: progress => {
                    character2View.presentAnimation({name: 'JumpFlip', progress})
                },
                onFinish: () => {
                    character2View.refreshLimbsStamp()
                    timelines[1]
                        .deleteAllAnimations()
                        .addAnimation({
                            delay: timelines[1].duration,
                            duration: 3000,
                            onProgress: progress => {
                                character2View.presentAnimation({name: 'RandomShooting', progress})
                            }
                        })
                        .setLoopMode()
                        .windToTime(1)
                        .play()
                }
            })
            .play()
    }


    async presentAssault() {
        const {
            timelines,
            charactersViews,
        } = this

        if(!charactersViews.length) return

        this.isIdling = false
        
        charactersViews.forEach(view => view.refreshLimbsStamp())

        const character1View = charactersViews[0]
        const character2View = charactersViews[1]

        

        timelines[1].deleteAllAnimations()
        timelines[1]
            .deleteAllAnimations()
            .addAnimation({
                duration: 1000,
                onProgress: progress => {
                    character2View.presentAnimation({name: 'HideBehindCactus', progress})
                },
                onFinish: () => {
                    character2View.refreshLimbsStamp()
                    timelines[1]
                        .deleteAllAnimations()
                        .addAnimation({
                            duration: 2000,
                            onProgress: progress => {
                                character2View.presentAnimation({name: 'Idle', progress})
                            }
                        })
                        .setLoopMode()
                        .windToTime(1)
                        .play()
                }
                
            })
            .play()

        return new Promise(resolve => {
            timelines[0]
                .deleteAllAnimations()
                .addAnimation({
                    duration: 1000,
                    onProgress: progress => {
                        character1View.presentAnimation({name: 'ThroughDynamite', progress})
                    },
                    onFinish: () => {
                        resolve()
                        character1View.refreshLimbsStamp()
                        timelines[0]
                            .deleteAllAnimations()
                            .addAnimation({
                                duration: 2000,
                                onProgress: progress => {
                                    character1View.presentAnimation({name: 'Idle', progress})
                                }
                            })
                            .setLoopMode()
                            .windToTime(1)
                            .play()
                    }
                    
                })
                .play()
        })
    }

    setTimeScale(scale) {
        this.timelines.forEach(timeline => {
            timeline.setTimeScaleFactor({name: 'scale', value: scale})
        })
	}

}