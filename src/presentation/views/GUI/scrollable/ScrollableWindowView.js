import { Container, Graphics, Sprite } from "pixi.js";
import { AdaptiveContainer } from "../../adaptiveDesign/AdaptiveContainer";
import { TextField } from "../../text/TextField";
import { ButtonCloseView } from "./ButtonCloseView";
import { GUIView } from "../GUIView";
import { Timeline } from "../../../timeline/Timeline";

export class ScrollableWindow extends AdaptiveContainer {
    wrapperContainer
    contentView
    scrollBarView

    scrollProgress = 0
    scrollSlideProgress = 0
    isInteractionInProgress

    textField
    iconView
    audio

    releaseTimeline = new Timeline


    async init({assets, dictionary, coefficients, isLTRTextDirection, locale, audio}) {
        this.audio = audio

        this.initOverlay(assets)

        this.initWrapperContainer(assets, isLTRTextDirection)
        this.initIcon(assets)
        this.initHeader(dictionary)
        this.initButtons(assets, isLTRTextDirection, audio)

        this.initScrollableContainer()
        await this.initContent({assets, dictionary, coefficients, isLTRTextDirection, locale})
        
        this.initScrollBar(assets, isLTRTextDirection)


        this.setScroll(0)
        this.iconView.position.set(isLTRTextDirection ? 75: 925, 75)
    }

    initWrapperContainer(assets, isLTRTextDirection) {
        const width = 1000
        const height = 1750
        this.wrapperContainer = this
            .addChild(new AdaptiveContainer )
            .setSourceArea({width, height})
            .setTargetArea({x: 0.025, y: 0.025, width: 0.95, height: 0.95})

        const offset = 20
        let sprite = new Sprite(assets.rectangle)
        sprite.position.set(offset)
        sprite.width = width - offset * 2
        sprite.height = height - offset * 2
        sprite.tint = 0x000000
        this.wrapperContainer.addChild(sprite)

        this.bordersViews = [
            {x: 0, y: height / 2, height},
            {x: width / 2, y: 0, width, rotation: Math.PI / 2},
            {x: width, y: height / 2, height, rotation: Math.PI},
            {x: width / 2, y: height, width, rotation: -Math.PI / 2},
        ].forEach(({
            x, y, rotation = 0, width = 0, height = 0
        }) => {
            const sprite = new Sprite(assets.UIBorder)
            sprite.anchor.set(0, 0.5)
            sprite.rotation = rotation
            sprite.position.set(x, y)

            if (width) {
                sprite.height = width - 100
            }

            if (height) {
                sprite.height = height - 100
            }

            return this.wrapperContainer.addChild(sprite)
        })

        this.cornersViews = [
            {x: 0, y: 0},
            {x: width, y: 0, scaleX: -1},
            {x: 0, y: height, scaleY: -1},
            {x: width, y: height, scaleX: -1, scaleY: -1},
        ].forEach(({
            x, y, scaleX = 1, scaleY = 1
        }) => {
            const sprite = new Sprite(assets.UICorner)
            sprite.scale.set(scaleX, scaleY)
            sprite.position.set(x, y)

            return this.wrapperContainer.addChild(sprite)
        })

        sprite = new Sprite(assets.UIBorder)
        sprite.anchor.set(0, 0.5)
        sprite.rotation = -Math.PI / 2
        sprite.height = width - 20
        sprite.position.set(width / 2, 150)
        this.wrapperContainer.addChild(sprite)

        const {wrapperContainer} = this
        wrapperContainer.eventMode = 'static'
        wrapperContainer.addEventListener('pointerdown', e => {
            GUIView.isOverlayInteraction = true
        })

        wrapperContainer.addEventListener('pointerup', () => { GUIView.isOverlayInteraction = false })
        wrapperContainer.addEventListener('pointerleave', () => { GUIView.isOverlayInteraction = false })
        wrapperContainer.addEventListener('pointercancel', () => { GUIView.isOverlayInteraction = false })
        wrapperContainer.addEventListener('pointerout', () => { GUIView.isOverlayInteraction = false })
        wrapperContainer.addEventListener('pointerupoutside', () => { GUIView.isOverlayInteraction = false })
    }

    initIcon(assets) {
        const sprite = new Sprite(assets.iconInfo)
        sprite.anchor.set(0.5)
        this.iconView = this.wrapperContainer.addChild(sprite)
    }

    initScrollableContainer(width = 975, height = 1580) {
        const container = this.wrapperContainer.addChild(new Container)
        container.position.set(15, 155)

        container.mask = container
            .addChild(new Graphics)
            .beginFill(0xFFFFFF)
            .drawRect(0, 0, width, height)
            .endFill()

        this.scrollableContainer = container

        container.eventMode = 'static'
        container.addEventListener('pointerdown', e => {
            this.releaseTimeline.deleteAllAnimations()
            this.clickTimeStamp = Date.now()
            GUIView.isOverlayInteraction = true
            const {x, y} = this.scrollableContainer.toLocal(e.global)

            this.clickX = x
            this.clickY = y - this.contentView.y

            this.slideX = x
            this.slideY = y

            this.isInteractionInProgress = true

            this.interactionStartY = y
        })

        container.addEventListener('pointerup', (e) => { this.onRelease(e) })
        container.addEventListener('globalmove', (e) => { this.isInteractionInProgress && this.onSlide(e) })
        container.onglobalmousemove = (e) => { this.isInteractionInProgress && this.onSlide(e) }
        container.onglobalpointermove = (e) => { this.isInteractionInProgress && this.onSlide(e) }
        container.addEventListener('pointercancel', (e) => { this.onRelease(e) })
        container.addEventListener('pointerupoutside', (e) => { this.onRelease(e) })

    }

    initContent({assets, dictionary, coefficients, isLTRTextDirection, locale}) {
        this.contentView = this
            .scrollableContainer
            .addChild(new Container)
    }

    initScrollBar(assets, isLTRTextDirection) {
        const { contentView, scrollableContainer } = this
        const view = new Sprite(assets.rectangle)
        view.tint = 0xf8ee89
        view.width = 10
        view.x = isLTRTextDirection ? this.scrollableContainer.mask.width - view.width : 0
        view.alpha = 0.75
        view.height = Math.max(0, Math.min(1, scrollableContainer.mask.height / contentView.height)) * scrollableContainer.mask.height

        this.scrollBarView = this
            .scrollableContainer
            .addChild(view)
    }

    initHeader(dictionary) {
        let maximalWidth = 650
        let maximalHeight = 100
        let textField = new TextField({maximalWidth, maximalHeight})
            .setFontName('default')
            .setAlignMiddle()
            .setAlignCenter()
            .setFontColor(0xf8ee89)
            .setFontSize(maximalHeight)
            .setText(dictionary.paytable)

        textField.pivot.set(maximalWidth / 2, maximalHeight / 2)
        textField.position.set(500, 75)
        this.textField = this.wrapperContainer.addChild(textField)
    }

    initButtons(assets, isLTRTextDirection, audio) {
        this.buttonCloseView = this
            .wrapperContainer
            .addChild(new ButtonCloseView(assets, audio))

        this.buttonCloseView.position.set(isLTRTextDirection ? 925 : 75, 75)
        this.buttonCloseView.scale.set(0.5)
        this.buttonCloseView.onClick = () => {
            this.onButtonCloseClick?.()
        }
    }

    initOverlay(assets, dictionary) {
        const container = new AdaptiveContainer()
        this.addChild(container)
        container.setSourceArea({width: 100, height: 100})
            .setTargetArea({x: 0, y: 0, width: 1, height: 1})
            .stretchHorizontally()
            .stretchVertically()

        const sprite = new Sprite(assets.rectangle)
        sprite.anchor.set(0.5)
        sprite.scale.set(1.25)
        sprite.position.set(50)
        sprite.tint = 0x000000
        sprite.alpha = 0.95

        container.addChild(sprite)

        container.eventMode = 'static'
        container.addEventListener('pointerdown', e => {
            GUIView.isOverlayInteraction = true
            this.onOverlayClick?.()
        })

        container.addEventListener('pointerup', () => { GUIView.isOverlayInteraction = false })
        container.addEventListener('pointerleave', () => { GUIView.isOverlayInteraction = false })
        container.addEventListener('pointercancel', () => { GUIView.isOverlayInteraction = false })
        container.addEventListener('pointerout', () => { GUIView.isOverlayInteraction = false })
        container.addEventListener('pointerupoutside', () => { GUIView.isOverlayInteraction = false })
    }

    setScroll(progress) {
        const {
            scrollBarView,
            contentView,
            scrollableContainer
        } = this

        const finalProgress = Math.min(1, Math.max(0, this.scrollProgress + progress))

        let delta = Math.max(0, contentView.height - scrollableContainer.mask.height)
        contentView.y = -delta * finalProgress
        
        if(!scrollBarView) return

        delta = Math.max(0, scrollableContainer.mask.height - scrollBarView?.height)
        scrollBarView.y = delta * finalProgress
        scrollBarView.height = Math.max(0, Math.min(1, scrollableContainer.mask.height / contentView.height)) * scrollableContainer.mask.height
        scrollBarView.visible = contentView.height > scrollableContainer.mask.height
    }

    onRelease(e) {
        this.isInteractionInProgress = false
        this.scrollProgress = this.scrollSlideProgress
        this.scrollSlideProgress = 0

        const slideDelta = this.interactionStartY - this.slideY
        const absSlideDelta = Math.abs(slideDelta)
        const finalSlideDelta = Math.min(1000, absSlideDelta) * (slideDelta / absSlideDelta)

        const timeScaleFactor =  1 - Math.min(1, (Date.now() - this.clickTimeStamp) / 500)

        const slideProgressDelta = finalSlideDelta / this.contentView.height * timeScaleFactor
        const slideProgress = this.slideProgress


        this.releaseTimeline
            .deleteAllAnimations()
            .addAnimation({
                duration: 5000 * Math.abs(slideProgressDelta),
                onProgress: progress => {
                   this.setScroll(-slideProgress + slideProgressDelta * progress)
                }
            })
            .play()
    }

    onSlide(e) {
        const { scrollableContainer, contentView } = this
        const { x, y } = scrollableContainer.toLocal(e.global)

        this.slideX = x
        this.slideY = y

        const progress = (y - this.clickY) /  (contentView.height - scrollableContainer.mask.height)

        this.slideProgress = progress

        this.setScroll(-progress)
    }

    setVisible(isVisible = true) {
        this.visible = isVisible

        const {timeline} = this.contentView
        if (isVisible) {
            timeline?.play()
        } else {
            timeline?.pause()
        }
    }

    setAdaptiveDesignOffsets({offsetTop = 0, offsetBottom = 0}) {
        this.wrapperContainer
            .setTargetArea({x: 0.025, y: 0.025 + offsetTop, width: 0.95, height: 0.95 - offsetBottom - offsetTop})
    }
}