import { BaseCharacterView } from "../../base/BaseCharacterView";
import { BaseChestView } from "../../base/spine/BaseChestView";
import { AdventurerBeltView } from "./AdventurerBeltView";
import { AdventurerHeadView } from "./AdventurerHeadView";
import { AdventurerSpineView } from "./AdventurerSpineView";
import { HatView } from "./HatView";

export class AdventurerBanditView extends BaseCharacterView {

    constructor(assets, audio) {
        super(assets, audio)

        this.setLegsColor(0x332233)
        //this.setShirtColor(0xb48b5b)
        this.setShirtColor(0x999900)
        this.setButtonsColor(0xFFCCAA)
        this.spineView.neckView.setColor(0xFF0000)

        /*
        new Timeline()
            .addAnimation({
                duration: 1000,
                onProgress: progress => this.updateIdleElements(progress)
            })
            .setLoopMode()
            .play()
        */
    }

    initHead(assets) {
        const view = new AdventurerHeadView(assets)
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

    //b48b5b
    initStraps() {

    }

    initSpine(assets) {
        this.spineView = this.contentContainer.addChild(new AdventurerSpineView(assets))
        this.spineView.zIndex = 0
    }
    

    initHat(assets) {
        const view = new HatView(assets)

        view.scale.set(1.5)

        this.headView.attachHat(view)
    }

    initBelt(assets) {
        const view = new AdventurerBeltView(assets)

        this.spineView.bellyView.attachBelt(view)
    }

    presentHideBehindCactus(progress) {
        this.flipProgress = 0
        const sitProgress = Math.sin(Math.PI * progress)
        this.contentContainer.y = 200 * sitProgress


        this.setHeadFlip(-0.1 * sitProgress)

        this.flipProgressOffset = 0.1 * Math.sin(Math.PI * 2 * progress)
        this.stretch({
            name: 'spine',
            distanceProgress: 0,
            verticalAxisProgress: -1.9 + 0.25 * sitProgress,
            flipProgress: 0,
            distortionProgress: 0.1 * Math.sin(Math.PI * 4 * progress)  - 0.65 * sitProgress,
        })
        
        this.stretch({
            name: 'legLeft',
            distanceProgress: 0,
            verticalAxisProgress: 0.8 - 0.4 * sitProgress,
            flipProgress: 0,
            distortionProgress: 0.05 + 0.5 * sitProgress,
        })

        progress = (progress + 0.5) % 1

        this.stretch({
            name: 'legRight',
            distanceProgress: 0,
            verticalAxisProgress: 0.8 - 0.4 * sitProgress,
            flipProgress: 0,
            distortionProgress: -0.05,
        })


        progress = (progress + 0.5) % 1
        this.stretch({
            name: 'armLeft',
            distanceProgress: 0.5 * Math.sin(Math.PI * 2 * progress),
            verticalAxisProgress: 0.75 - 0.4 * sitProgress,
            flipProgress: 0,
            distortionProgress: 0.05 + 0.5 * sitProgress,
        })

        progress = (progress + 0.5) % 1
        this.stretch({
            name: 'armRight',
            distanceProgress: 0.5 * Math.sin(Math.PI * 2 * progress),
            verticalAxisProgress: 0.75 - 0.4 * sitProgress,
            flipProgress: 0,
            distortionProgress: -0.05,
        })
    }

    presentJumpFlip(progress) {
        let subProgress = progress
        let jumpProgress = progress

        if (progress <= 0.4) {
            subProgress = progress / 0.4
            jumpProgress =  subProgress ** 2

            this.animationFlipProgress = 0.05 * subProgress
            this.contentContainer.y = 150 * jumpProgress

            this.stretch({
                name: 'spine',
                distanceProgress: 0,
                verticalAxisProgress: -1.9 + 0.25 * jumpProgress,
                flipProgress: 0,
                distortionProgress: -0.25 * jumpProgress,
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
                distanceProgress: 0.5 * Math.sin(Math.PI * 2 * subProgress) -0.2,
                verticalAxisProgress: 0.8 - 0.3 * jumpProgress,
                flipProgress: 0,
                distortionProgress: -0.05,
            })

        } else {
            subProgress = (progress - 0.4) / 0.6
            const sin = Math.sin(Math.PI * subProgress)
            jumpProgress =  Math.min(1, subProgress * 1.5)
            const jumpRegress = 1 - jumpProgress

            this.setFlip(1 - 0.45 * subProgress)
            // this.animationFlipProgress = 0.05 - 0.45 * subProgress
            this.contentContainer.y = 150 - 150 * Math.min(1, subProgress * 2) ** 2 - 100 * sin ** 2

            this.stretch({
                name: 'spine',
                distanceProgress: 0,
                verticalAxisProgress: -1.9 + 0.25 * jumpRegress,
                flipProgress: 0,
                distortionProgress: -0.25 * jumpRegress,
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
                distanceProgress: -0.3 - 0.5 * subProgress,
                verticalAxisProgress: 0.5 - 0.1 * subProgress,
                flipProgress: 0,
                distortionProgress: -0.05,
            })
        }
    }


    presentTurnBack(progress) {
        //this.animationFlipProgress = -0.4 * (1 - progress)

        this.setFlip(0.55 + 0.45 * progress)

        const floatingProgress = Math.sin(Math.PI * progress)

        this.stretch({
            name: 'spine',
            distanceProgress: 0,
            verticalAxisProgress: -1.9 + 0.25 * floatingProgress,
            flipProgress: 0,
            distortionProgress: 0.5 * floatingProgress,
        })
        
        this.stretch({
            name: 'legLeft',
            distanceProgress: 0,
            verticalAxisProgress: 0.8,
            flipProgress: 0,
            distortionProgress: 0.05,
        })

        this.stretch({
            name: 'legRight',
            distanceProgress: 0.25 * floatingProgress,
            verticalAxisProgress: 0.8 - 0.2 * floatingProgress,
            flipProgress: 0,
            distortionProgress: -0.05 ,
        })


        this.stretch({
            name: 'armLeft',
            distanceProgress: 0.5 * Math.sin(Math.PI * 2 * progress),
            verticalAxisProgress: 0.8 - 0.2 * progress,
            flipProgress: 0,
            distortionProgress: 0.05,
        })

        this.stretch({
            name: 'armRight',
            distanceProgress: 0.5 * progress -0.2,
            verticalAxisProgress: 0.8 - 0.3 * progress,
            flipProgress: 0,
            distortionProgress: -0.05,
        })
    }


    presentLose1(progress) {
        this.flipProgress = 0
        const floatingProgress = Math.sin(Math.PI * progress)

        this.setHeadFlip(-0.2 * floatingProgress)
        this.animationFlipProgress = -0.1 * floatingProgress

        this.stretch({
            name: 'spine',
            distanceProgress: 0,
            verticalAxisProgress: -1.9,// - 0.2 * floatingProgress,
            flipProgress: 0,
            distortionProgress: 0.5 * floatingProgress,
        })
        
        this.stretch({
            name: 'legLeft',
            distanceProgress: 0,
            verticalAxisProgress: 0.8,
            flipProgress: 0,
            distortionProgress: 0.05,
        })

        this.stretch({
            name: 'legRight',
            distanceProgress: 0.25 * floatingProgress,
            verticalAxisProgress: 0.8 + 0.1 * floatingProgress,
            flipProgress: 0,
            distortionProgress: -0.05
        })


        this.stretch({
            name: 'armLeft',
            distanceProgress: -0.5,
            verticalAxisProgress: 0.2 + 0.6 * (1 - floatingProgress) + 0.1 * Math.sin(Math.PI * 6 * progress),
            flipProgress: 0,
            distortionProgress: 0.05 + 0.1 * Math.sin(Math.PI * 6 * progress),
        })

        this.stretch({
            name: 'armRight',
            distanceProgress: -0.5,
            verticalAxisProgress: 0.8 - 0.2 * floatingProgress,
            flipProgress: 0,
            distortionProgress: -0.05 - 0.1 * floatingProgress,
        })
    }


    presentLose2(progress) {
        this.flipProgress = 0
        const floatingProgress = Math.sin(Math.PI * progress)
        
        this.setHeadFlip(0.075 * floatingProgress)
        this.animationFlipProgress = -0.075 * floatingProgress

        this.stretch({
            name: 'spine',
            distanceProgress: 0,
            verticalAxisProgress: -1.9 - 0.1 * floatingProgress,
            flipProgress: 0,
            distortionProgress: 0,
        })
        
        this.stretch({
            name: 'legLeft',
            distanceProgress: 0,
            verticalAxisProgress: 0.8,
            flipProgress: 0,
            distortionProgress: 0.05,
        })

        this.stretch({
            name: 'legRight',
            distanceProgress: 0.25 * floatingProgress,
            verticalAxisProgress: 0.8 + 0.1 * floatingProgress,
            flipProgress: 0,
            distortionProgress: -0.05
        })


        this.stretch({
            name: 'armLeft',
            distanceProgress: 0.5 * progress,
            verticalAxisProgress: 0.8 - 0.5 * floatingProgress,
            flipProgress: 0,
            distortionProgress: 0.05 + 0.2 * floatingProgress,
        })

        this.stretch({
            name: 'armRight',
            distanceProgress: -0.5,
            verticalAxisProgress: 0.8 - 0.5 * floatingProgress,
            flipProgress: 0,
            distortionProgress: -0.05 - 0.1 * floatingProgress,
        })
    }

    presentDance(progress) {
        super.presentDance(progress)
        this.flipProgress = 0
    }


    presentIdle(progress) {
        const angle = Math.PI * 2 * progress
        const sin =  Math.sin(angle)


        this.setHeadFlip(-0.05 + 0.065 * Math.sin(Math.PI * 4 * progress ) * progress)

        this.animationFlipProgress = -0.05 + 0.025 * Math.sin(Math.PI * 2 * progress)

        



        this.stretch({
            name: 'spine',
            distanceProgress: 0,
            verticalAxisProgress: -1.9 -0.05 * Math.sin(Math.PI * 4 * progress),
            distortionProgress: -0.15 * Math.sin(Math.PI * 4 * progress),
        })
        
        this.stretch({
            name: 'legLeft',
            distanceProgress: 0,
            verticalAxisProgress: 0.8,
            distortionProgress: 0.05,// + 0.1 * Math.abs(sin),
        })

        progress = (progress + 0.5) % 1

        this.stretch({
            name: 'legRight',
            distanceProgress:  0,//0.5 * Math.abs(sin),
            verticalAxisProgress: 0.8,
            distortionProgress: -0.05,// + 0.1 * Math.abs(sin),
        })


        progress = (progress + 0.5) % 1
        this.stretch({
            name: 'armLeft',
            distanceProgress: 0.5 * Math.sin(Math.PI * 2 * progress) - 0.25 * Math.abs(sin),
            verticalAxisProgress: 0.5 - 0.15 * Math.abs(sin),
            distortionProgress: 0.05,
        })

        progress = (progress + 0.5) % 1
        this.stretch({
            name: 'armRight',
            distanceProgress: -0.2 - 0.75 * Math.abs(sin) * progress,
            verticalAxisProgress: 0.75 - 0.35  * Math.abs(sin) * progress,
            distortionProgress: -0.1 + 0.35 * Math.abs(sin) * progress,
        })
    }

    presentTension(progress) {
        this.flipProgress = 0
        this.setHeadFlip(-0.15 )
        this.animationFlipProgress = 0.05 + 0.05 * Math.sin(Math.PI * 4 * progress)
        this.stretch({
            name: 'spine',
            distanceProgress: 0,
            verticalAxisProgress: -1.9 + 0.05 * Math.sin(Math.PI * 4 * progress),
            distortionProgress: -0.15 * Math.sin(Math.PI * 2 * progress) - 0.1,
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
            distanceProgress: -0.75,
            verticalAxisProgress: 0.5,
            distortionProgress: 0.25 - 0.2 * Math.abs(Math.sin(Math.PI * 4 * progress)),
        })

        progress = (progress + 0.5) % 1
        this.stretch({
            name: 'armRight',
            distanceProgress: 0.5 * Math.sin(Math.PI * 2 * progress) - 0.35 * Math.sin(Math.PI * progress),
            verticalAxisProgress: 0.75 - 0.25 * Math.sin(Math.PI * progress),
            distortionProgress: -0.05  + 0.1 * Math.sin(Math.PI * progress),
        })
    }

    onShot() {
        this.audio.presentForegroundShot()
    }
}