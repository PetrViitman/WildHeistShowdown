import { Container, Sprite } from "pixi.js";
import { getLightSpot, getRectangleSpot } from "../../../GraphicalPrimitives";

export class SubstitutionEffectView extends Container {
    contentContainer
    glowView
    raysViews

    constructor(assets) {
        super()
        this.initContentContainer()
        this.initGlowView(assets)
        this.initRays(assets)
    }

    initContentContainer() {
        this.contentContainer = this.addChild(new Container)
        this.contentContainer.alpha = 0
        this.contentContainer.scale.set(3)
    }

    initGlowView(assets) {
        const view = new Sprite(assets.sparkle_glow)
        view.anchor.set(0.5)
        view.scale.set(2)
        this.glowView = view

        this.contentContainer.addChild(view)
    }

    initRays(assets) {
        this.raysViews = new Array(8)
            .fill(0)
            .map((_) => {
                const view = new Sprite(assets.ray)
                view.anchor.set(0.5)
                this.contentContainer.addChild(view)

                return view
            })
    }

    setProgress(progress) {
        this.contentContainer.alpha = 1
        this.raysViews.forEach((view, i) => {
            const viewProgress = (i * (1 / 8) + progress) % 1;
            const localProgress = viewProgress > 0.5
                ? 1 - (viewProgress - 0.5) * 2
                : viewProgress * 2;

            view.scale.set(
                (0.05 + 0.25 * localProgress),
                (0.05 + 0.25 * (1 - localProgress)),
            );
            view.rotation = ((i + 1) / 5) * Math.PI * 2 + 0.5 * viewProgress;
        })

    }

    present(progress) {
        this.setProgress(progress)
        this.contentContainer.alpha = Math.sin(Math.PI * progress)
    }

    setColor(color = 0xFFFFFF) {
        this.raysViews.forEach(view => {
            view.tint = color
        })

        this.glowView.tint = color
    }

    setSourceBlur(intensity = 1) {
        this.glowView.scale.set(2 * intensity)
    }
}