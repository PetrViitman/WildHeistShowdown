import { Timeline } from "../../../../../timeline/Timeline";
import { BaseCharacterView } from "../../base/BaseCharacterView";
import { BaseSpineView } from "../../base/spine/BaseSpineView";
import { DynamiteView } from "./DynamiteView";
import { MexicanBeltView } from "./MexicanBeltView";
import { MexicanHeadView } from "./MexicanHeadView";
import { MexicanSpineView } from "./MexicanSpineView";
import { SombreroView } from "./SombreroView";

export class MexicanBanditView extends BaseCharacterView {
    constructor(assets, audio) {
        super(assets, audio)

        this.initDynamite(assets)
        this.attachDynamite()

        this.setLegsColor(0x333333)
        this.setShirtColor(0xCC2200)
        this.setShirtColor(0xCC22CC)
        this.setShirtColor(0xFF5500)
    }

    initHead(assets) {
        const view = new MexicanHeadView(assets)
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

    initStraps() {

    }

    initDynamite(assets) {
        const view = new DynamiteView(assets)
        this.dynamiteView = view
    }

    initBelt(assets) {
        const view = new MexicanBeltView(assets)

        this.spineView.bellyView.attachBelt(view)
    }

    initHat(assets) {
        const view = new SombreroView(assets)

        view.scale.set(2.25)

        this.headView.attachHat(view)
    }

    initSpine(assets) {
        this.spineView = this.contentContainer.addChild(new MexicanSpineView(assets))
        this.spineView.zIndex = 0
    }

    presentThroughDynamite(progress) {
        this.animationFlipProgress = progress
        this.attachDynamite(progress < 0.35)
        const dynamiteProgress = Math.max(0, progress - 0.35) / 0.65
        const { dynamiteView } = this

        dynamiteView.visible = dynamiteProgress < 1

        if(dynamiteProgress) {
            dynamiteView.position.set(
                -220 - 400 * dynamiteProgress ** 2,
                -535 - Math.sin(Math.PI  * 0.75 * dynamiteProgress) * 1000
            )

            this.dynamiteView.scale.set(
                0.75 * (1 - 0.4 * dynamiteProgress),
            )

            dynamiteView.rotation = -Math.PI * 2 * dynamiteProgress ** 2
        } else {
            dynamiteView.position.set(
                0
            )

            this.dynamiteView.scale.set(-0.75, 0.75)
            dynamiteView.rotation = 0
        }


        this.stretch({
            name: 'spine',
            distanceProgress: 0,// 0.2 - Math.sin(Math.PI * 2 * flashProgress) * (1 - flashProgress),
            verticalAxisProgress: -1.9 + 0.25 * Math.sin(Math.PI * progress),
            flipProgress: 0,
            distortionProgress: 1 * Math.sin(Math.PI * progress),
        })
        
        this.stretch({
            name: 'legLeft',
            distanceProgress: 0,
            verticalAxisProgress: 0.8,
            flipProgress: 0,
            distortionProgress: 0.25 * Math.sin(Math.PI * 2 * Math.min(1, progress * 2)),
        })

        progress = (progress + 0.5) % 1

        this.stretch({
            name: 'legRight',
            distanceProgress: 0,
            verticalAxisProgress: 0.8,
            flipProgress: 0,
            distortionProgress: 0,
        })


        progress = (progress + 0.5) % 1
        this.stretch({
            name: 'armLeft',
            distanceProgress: -0.25 - 0.75 * Math.min(1, progress * 1.5),
            verticalAxisProgress: 0.6 - 1.3 * Math.sin(Math.PI * Math.min(1, progress * 2)),
            flipProgress: 0,
            distortionProgress: -0.2,
        })

        progress = (progress + 0.5) % 1
        this.stretch({
            name: 'armRight',
            distanceProgress: -0.5,
            verticalAxisProgress: 0.65,
            flipProgress: 0,
            distortionProgress: 0.2 + 0.2 * Math.sin(Math.PI * Math.min(1, progress * 2)),
        })

    }

    attachDynamite(isAttached = true) {
        if(this.isDynamiteAttached === isAttached) return

        this.isDynamiteAttached = isAttached

        if (isAttached) {
            this.handsViews[0].attachDynamite(this.dynamiteView)
            this.dynamiteView.scale.set(-0.75, 0.75)
        } else {
            this.handsViews[0].dynamiteView = null
            this.addChildAt(this.dynamiteView, 0)
        }
    }

    presentJumpFlip(progress) {
        let subProgress = progress
        let jumpProgress = progress

        if (progress <= 0.4) {
            subProgress = progress / 0.4
            jumpProgress =  subProgress ** 2

            this.animationFlipProgress = -0.05 * subProgress
            this.contentContainer.y = 150 * jumpProgress

            this.stretch({
                name: 'spine',
                distanceProgress: 0,
                verticalAxisProgress: -1.9 + 0.25 * jumpProgress,
                flipProgress: 0,
                distortionProgress: 0.25 * jumpProgress,
            })
            
            this.stretch({
                name: 'legLeft',
                distanceProgress: 0,
                verticalAxisProgress: 0.8 - 0.25 * jumpProgress,
                flipProgress: 0,
                distortionProgress: 0.05,
            })
    
            this.stretch({
                name: 'legRight',
                distanceProgress: 0,
                verticalAxisProgress: 0.8 - 0.25 * jumpProgress,
                flipProgress: 0,
                distortionProgress: -0.05,
            })
    
    
            this.stretch({
                name: 'armLeft',
                distanceProgress: 0.5 * Math.sin(Math.PI * 2 * subProgress),
                verticalAxisProgress: 0.8 - 0.2 * jumpProgress,
                flipProgress: 0,
                distortionProgress: 0.05,
            })
    
            this.stretch({
                name: 'armRight',
                distanceProgress: 0.5 * Math.sin(Math.PI * 2 * subProgress),
                verticalAxisProgress: 0.8 - 0.2 * jumpProgress,
                flipProgress: 0,
                distortionProgress: -0.05,
            })
        } else {
            subProgress = (progress - 0.4) / 0.6
            const sin = Math.sin(Math.PI * subProgress)
            jumpProgress =  Math.min(1, subProgress * 1.5)
            const jumpRegress = 1 - jumpProgress

            this.setFlip(0.45 * subProgress)
            this.contentContainer.y = 150 - 150 * Math.min(1, subProgress * 2)** 2 - 100 * sin ** 2

            this.stretch({
                name: 'spine',
                distanceProgress: 0,
                verticalAxisProgress: -1.9 + 0.25 * jumpRegress,
                flipProgress: 0,
                distortionProgress: 0.25 * jumpRegress,
            })
            
            this.stretch({
                name: 'legLeft',
                distanceProgress: 0,
                verticalAxisProgress: 0.8 - 0.25 * jumpRegress,
                flipProgress: 0,
                distortionProgress: 0.05,
            })
    
            this.stretch({
                name: 'legRight',
                distanceProgress: 0,
                verticalAxisProgress: 0.8 - 0.25 * jumpRegress,
                flipProgress: 0,
                distortionProgress: -0.05,
            })
    
    
            this.stretch({
                name: 'armLeft',
                distanceProgress: 0.5 * Math.sin(Math.PI * 2 * subProgress),
                verticalAxisProgress: 0.8 - 0.2 * jumpRegress,
                flipProgress: 0,
                distortionProgress: 0.05,
            })
    
            this.stretch({
                name: 'armRight',
                distanceProgress: -0.8 * subProgress,
                verticalAxisProgress: 0.6 - 0.2 * subProgress,
                flipProgress: 0,
                distortionProgress: -0.05,
            })
        }
    }

    presentTurnBack(progress) {
        this.setFlip(0.45 * (1 - progress))

        const floatingProgress = Math.sin(Math.PI * progress)

        this.stretch({
            name: 'spine',
            distanceProgress: 0,
            verticalAxisProgress: -1.9 + 0.25 * floatingProgress,
            flipProgress: 0,
            distortionProgress: -0.5 * floatingProgress,
        })
        

        this.stretch({
            name: 'legLeft',
            distanceProgress: 0.25 * floatingProgress,
            verticalAxisProgress: 0.8 - 0.2 * floatingProgress,
            flipProgress: 0,
            distortionProgress: -0.05 ,
        })

        this.stretch({
            name: 'legRight',
            distanceProgress: 0,
            verticalAxisProgress: 0.8,
            flipProgress: 0,
            distortionProgress: 0.05,
        })

        this.stretch({
            name: 'armLeft',
            distanceProgress: 0.5 * progress -0.2,
            verticalAxisProgress: 0.8 - 0.3 * progress,
            flipProgress: 0,
            distortionProgress: -0.05,
        })

        this.stretch({
            name: 'armRight',
            distanceProgress: 0.5 * Math.sin(Math.PI * 2 * progress),
            verticalAxisProgress: 0.8 - 0.2 * progress,
            flipProgress: 0,
            distortionProgress: 0.05,
        })
    }

    presentLose1(progress) {
        this.flipProgress = 0
        const floatingProgress = Math.sin(Math.PI * progress)

        this.setHeadFlip(0.2 * floatingProgress)
        this.animationFlipProgress = 0.1 * floatingProgress

        this.stretch({
            name: 'spine',
            distanceProgress: 0,
            verticalAxisProgress: -1.9,// - 0.2 * floatingProgress,
            flipProgress: 0,
            distortionProgress: -0.5 * floatingProgress,
        })
        
        this.stretch({
            name: 'legLeft',
            distanceProgress: 0.25,
            verticalAxisProgress: 0.8 + 0.1 * floatingProgress,
            flipProgress: 0,
            distortionProgress: 0.05
        })

        this.stretch({
            name: 'legRight',
            distanceProgress: 0,
            verticalAxisProgress: 0.8,
            flipProgress: 0,
            distortionProgress: -0.05,
        })


        this.stretch({
            name: 'armLeft',
            distanceProgress: -0.5,
            verticalAxisProgress: 0.8 - 0.2 * floatingProgress,
            flipProgress: 0,
            distortionProgress: 0.05 + 0.1 * floatingProgress,
        })

        this.stretch({
            name: 'armRight',
            distanceProgress: -0.5,
            verticalAxisProgress: 0.2 + 0.6 * (1 - floatingProgress) + 0.1 * Math.sin(Math.PI * 6 * progress),
            flipProgress: 0,
            distortionProgress: -0.05 - 0.1 * Math.sin(Math.PI * 6 * progress),
        })
    }

    presentLose2(progress) {
        this.flipProgress = 0
        const floatingProgress = Math.sin(Math.PI * progress)
        
        this.setHeadFlip(-0.075 * floatingProgress)
        this.animationFlipProgress = 0.075 * floatingProgress

        this.stretch({
            name: 'spine',
            distanceProgress: 0,
            verticalAxisProgress: -1.9 - 0.1 * floatingProgress,
            flipProgress: 0,
            distortionProgress: 0,
        })
        
        this.stretch({
            name: 'legLeft',
            distanceProgress: 0.25 * floatingProgress,
            verticalAxisProgress: 0.8 + 0.1 * floatingProgress,
            flipProgress: 0,
            distortionProgress: 0.05
        })
        this.stretch({
            name: 'legRight',
            distanceProgress: 0,
            verticalAxisProgress: 0.8,
            flipProgress: 0,
            distortionProgress: -0.05,
        })


        this.stretch({
            name: 'armLeft',
            distanceProgress: -0.5,
            verticalAxisProgress: 0.8 - 0.5 * floatingProgress,
            flipProgress: 0,
            distortionProgress: 0.05 + 0.1 * floatingProgress,
        })

        this.stretch({
            name: 'armRight',
            distanceProgress: 0.5 * progress,
            verticalAxisProgress: 0.8 - 0.5 * floatingProgress,
            flipProgress: 0,
            distortionProgress: -0.05 - 0.2 * floatingProgress,
        })
    }

    presentDance(progress) {
        super.presentDance(progress)
        this.flipProgress = 0
    }

    reset() {
        super.reset()
        this.dynamiteView.visible = false
    }


    presentIdle(progress) {
        this.setHeadFlip(0.05 * Math.sin(Math.PI * 2 * progress ))
        this.animationFlipProgress = 0.05 + 0.05 * Math.sin(Math.PI * 4 * progress)
        this.stretch({
            name: 'spine',
            distanceProgress: 0,
            verticalAxisProgress: -1.9 + 0.05 * Math.sin(Math.PI * 4 * progress),
            distortionProgress: -0.15 * Math.sin(Math.PI * 2 * progress),
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
            verticalAxisProgress: 0.75,
            distortionProgress: 0.05 - 0.1 * Math.sin(Math.PI * progress),
        })

        progress = (progress + 0.5) % 1
        this.stretch({
            name: 'armRight',
            distanceProgress: 0.5 * Math.sin(Math.PI * 2 * progress) - 0.35 * Math.sin(Math.PI * progress),
            verticalAxisProgress: 0.75 - 0.25 * Math.sin(Math.PI * progress),
            distortionProgress: -0.05  + 0.1 * Math.sin(Math.PI * progress),
        })
    }

    presentTension(progress) {
        this.flipProgress = 0
        this.setHeadFlip(0.15 )
        this.animationFlipProgress = 0.05 - 0.1 * Math.sin(Math.PI * 4 * progress)
        this.stretch({
            name: 'spine',
            distanceProgress: 0,
            verticalAxisProgress: -1.9 + 0.05 * Math.sin(Math.PI * 4 * progress),
            distortionProgress: -0.15 * Math.sin(Math.PI * 2 * progress) + 0.3,
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
            verticalAxisProgress: 0.75,
            distortionProgress: 0.05 - 0.2 * Math.abs(Math.sin(Math.PI * 2 * progress)),
        })

        progress = (progress + 0.5) % 1
        this.stretch({
            name: 'armRight',
            distanceProgress: 0.5 ,
            verticalAxisProgress: 0.75 - 0.25 * Math.abs(Math.sin(Math.PI * 4 * progress)),
            distortionProgress: -0.3  + 0.3 * Math.sin(Math.PI * 4 * progress),
        })
    }

    onShot() {
        this.audio.presentForegroundShot()
    }
}