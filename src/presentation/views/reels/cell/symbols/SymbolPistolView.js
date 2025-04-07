import { Timeline } from "../../../../timeline/Timeline";
import { brightnessToHexColor } from "../../../GraphicalPrimitives";
import { Base3DSymbolView } from "./Base3DSymbolView";
import { Container, Sprite } from "pixi.js";

export class SymbolPistolView extends Base3DSymbolView {
    initFaces() {
        const {
			facesContainer,
			facesViews,
			distances,
			angles,
            assets,
		} = this



        // BASE...
        let sprite = new Sprite(assets.symbol_pistol_base)
		sprite.anchor.set(0.5)
        facesContainer.addChild(sprite)
        // ...BASE

        // DRUM...
        this.drumContainer = facesContainer.addChild(new Container)
        this.drumSectionsViews = new Array(5).fill(0).map(_ => {
            const sprite = new Sprite(assets.symbol_pistol_drum_section)
            sprite.anchor.set(0.5)

            return this.drumContainer.addChild(sprite)
        })

        // ...DRUM

    }

    setDrumFlip(progress) {
        this.drumSectionsViews.forEach((view, i) => {
            const shiftedProgress = (progress +  i * 0.2) % 1

            view.y =  - 42 + 34 * Math.sin(Math.PI * (shiftedProgress - 0.5 ))
            view.scale.y = Math.sin(Math.PI * shiftedProgress)
            view.tint = brightnessToHexColor(Math.sin(Math.PI * shiftedProgress) * Math.max(0.25, this.brightness))
        })
    }

    setFlip(flipProgress = 0) {
        const {
            facesContainer
        } = this

		super.setFlip(flipProgress)

        this.drumContainer.skew.x = -facesContainer.skew.x
        this.setDrumFlip(Math.abs(flipProgress * 10))
        /*

        starView.skew.x = -facesContainer.skew.x
        topView.skew.x = this.starView.skew.x
        starView.rotation = -this.facesContainer.rotation


        const scaleProgress = Math.min(1, Math.max(0, Math.abs(flipProgress) * 7))
        bottomView.scale.y = 0.5 + 0.5 * scaleProgress
        bottomView.y = 40 * (1 - scaleProgress)


        topView.scale.y = 0.5 + 0.5 * scaleProgress
        topView.y = -110 + 35 * scaleProgress
        
        sideLeftView.scale.y = 0.5 + 0.5 * scaleProgress
        sideRightView.scale.y = 0.5 + 0.5 * scaleProgress
        
        // starView.scale.y = 1 - 0.25 * scaleProgress
        starView.y = -10 + 35 * scaleProgress

*/
        //this.facesSubContainer.width = 181
	}

    setFloating(floatingProgress) {
        super.setFloating(floatingProgress)
		//this.beerView.skew.y = Math.sin(Math.PI * 8 * floatingProgress) * 0.1
		//this.beerView.scale.y = 0.8 + Math.sin(Math.PI * 5 * floatingProgress) * 0.2
	}

    initFlames() {
		super.initFlames(this.assets.symbol_pistol_glow)
	}

    initBlurredBody() {
        const {
            assets,
		} = this

		this.blurredBodyView = this.addChild(new Sprite(assets.symbol_pistol_motion_blur))
        this.blurredBodyView.scale.set(2)
        this.blurredBodyView.anchor.set(0.5, 0.65)
	}
}