import { Container, Sprite } from "pixi.js";
import { TextField } from "../../text/TextField";
import { Timeline } from "../../../timeline/Timeline";
import { colorToColor } from "../../GraphicalPrimitives";
import { formatMoney } from "../../../Utils";
import { GUIView } from "../GUIView";

const HEIGHT = 225

export class ReelSelectorView extends Container {
    textFields
    selectableOptions = new Array(7).fill(0)
    shiftPerItem = 1 / this.selectableOptions.length
    formattedSelectableOptions = []
    selectedOptionIndex = 0
    progressOffset = 0
    progress = 0

    clickX = 0
    clickY = 0

    slideX = 0
    slideY = 0

    timeline = new Timeline
    switchTimeline = new Timeline
    selectedTextField

    isEditable = false

    possibleInputCharacters = '0123456789.'
    userInput = ''
    isUserInputValid = true
    minimalValue = 0
    maximalValue = Infinity
    clickTimeStamp = 0
    frameView
    trianglesIconsViews

    constructor(assets, isDynamicCharacterSet) {
        super()
        this.initPanel(assets)
        this.initTextFields(isDynamicCharacterSet)
        this.setSelectableOptions()
        this.initFrame(assets)
        this.initTriangles(assets)
    }

    initPanel(assets) {
        const sprite = new Sprite(assets.bigRoundedRectangle)
        sprite.eventMode = 'static'
        sprite.anchor.set(0.5)
        sprite.position.set(0, HEIGHT / 2)
        sprite.scale.set(0.4)

        this.addChild(sprite)
    }

    setLocked(isLocked = true) {
        this.isLocked = isLocked
    }

    setSelectableOptions(options = []) {
        if (this.isLocked) {
            return
        }

        if (this.isEditable) {
            return
        }

        let isSameSetOfOptions = true
        for(let i = 0; i < options.length; i++) {
            if(options[i] !== this.selectableOptions[i]) {
                isSameSetOfOptions = false
                break
            } 
        }

        if (this.selectableOptions.length !== options.length) {
            isSameSetOfOptions = false
        }

        if(isSameSetOfOptions) {
            return
        }

        this.formattedSelectableOptions = this.formatOptions?.(options) ?? options

        this.selectableOptions = options
        this.progress = 0
        this.progressOffset = 0
        this.adjust()

        this.onSelectableOptionsUpdated?.()
    }

    initTextFields(isDynamicCharacterSet) {
        const maximalWidth = 150
        const maximalHeight = 50

        this.eventMode = 'static'
        this.addEventListener('pointerdown', (e) => {
            this.clickTimeStamp = Date.now()
            GUIView.isOverlayInteraction = true
            const {x, y} = this.toLocal(e.global)

            this.clickX = x
            this.clickY = y

            this.slideX = x
            this.slideY = y

            this.isInteractionInProgress = true
            this.progressOffset = this.progress

            this.timeline.deleteAllAnimations()
        })

        this.addEventListener('pointerup', () => { this.onRelease() })
        this.addEventListener('globalmove', (e) => { this.isInteractionInProgress && this.onSlide(e) })
        this.onglobalmousemove = (e) => { this.isInteractionInProgress && this.onSlide(e) }
        this.onglobalpointermove = (e) => { this.isInteractionInProgress && this.onSlide(e) }
        // this.addEventListener('pointerleave', () => { this.onRelease() })
        this.addEventListener('pointercancel', () => { this.onRelease() })
        // this.addEventListener('pointerout', () => { this.onRelease() })
        this.addEventListener('pointerupoutside', () => { this.onRelease() })

        this.textFields = this.selectableOptions
            .map(_ => {
                const textField = this
                    .addChild(new TextField({maximalWidth, maximalHeight, isDynamicCharacterSet}))
                    .setFontName('default')
                    .setFontSize(maximalHeight * 0.85)
                    .setFontColor(0xFFFFFF)
                    .setAlignCenter()
                    .setAlignMiddle()

                textField.pivot.set(maximalWidth / 2, maximalHeight / 2)

                return textField
            })

        this.selectedTextField = this.textFields[Math.trunc(this.textFields.length / 2)]
    }

    initFrame(assets) {
        const {textFields} = this
        const container = this.addChild(new Container)
        const height = textFields[0].maximalHeight
        container.pivot.y = height / 2
        container.y = 87 + height / 2

        const offsets = [
            0,
            height
        ].forEach(y => {
            const sprite = new Sprite(assets.rectangle)
            sprite.anchor.set(0.5)
            sprite.tint = 0xf8ee89
            sprite.y = y
            sprite.width = 158
            sprite.height = 1.5
            container.addChild(sprite)
        })

        this.frameView = container
    }

    initTriangles(assets) {
        this.trianglesIconsViews = [45, 177].map(y => {
            const sprite = new Sprite(assets.iconTriangle)
            sprite.anchor.set(0.5)
            sprite.y = y
            sprite.scale.set(0.5)
            sprite.tint = 0x00FF00
            sprite.alpha = 0
            
            return this.addChild(sprite)
        })
    }

    presentTrianglesBlink(isUpwardDirected = true) {
        const {trianglesIconsViews} = this
        trianglesIconsViews.forEach(view => 
            view.scale.y = isUpwardDirected ? 0.5 : -0.5
        )

        this.switchTimeline
            .deleteAllAnimations()
            .addAnimation({
                duration: 250,
                onProgress: progress => {
                    const finalProgress = Math.sin(Math.PI * progress)

                    trianglesIconsViews.forEach(view => view.alpha = finalProgress)
                }
            })
            .play()
    }

    adjust() {
        if (this.isLocked) {
            return
        }

        const {
            textFields,
            progress,
            selectableOptions,
            formattedSelectableOptions,
        } = this

        const finalProgress = (progress + this.progressOffset) % selectableOptions.length        
        const heightPerItem = HEIGHT / textFields.length
        const shift = heightPerItem * (finalProgress - Math.trunc(finalProgress))

        let selectedOptionIndex = Math.round(finalProgress)
        if(selectedOptionIndex >= selectableOptions.length) {
            selectedOptionIndex -= selectableOptions.length
        }


        let distanceToFrame = Infinity
        textFields.forEach((textField, i) => {
            textField.setFontColor(0xf8ee89)
            let finalOptionIndex = Math.trunc(finalProgress + i)

            textField.y = HEIGHT - (HEIGHT * i / textFields.length - shift) - heightPerItem / 2


            textField.alpha = 1
            
            if(textField.y > HEIGHT) {
                textField.y -= HEIGHT
                finalOptionIndex = Math.trunc(finalProgress + textFields.length)
            }

            finalOptionIndex -= Math.trunc(textFields.length / 2)

            if (finalOptionIndex === this.selectedOptionIndex) {
                this.selectedTextField = textField
            }

            if(finalOptionIndex >= selectableOptions.length) {
                finalOptionIndex -= selectableOptions.length
            } else if(finalOptionIndex < 0) {
                finalOptionIndex += selectableOptions.length
            }
        
            textField.setText(formattedSelectableOptions[finalOptionIndex % this.selectableOptions.length])

            const rollProgress = (textField.y / HEIGHT)
            let distortion = Math.sin(Math.PI * rollProgress - Math.PI * 0.5 )

            textField.y = HEIGHT * 0.5 + HEIGHT * 0.5 * distortion
            textField.scale.y = Math.sin(Math.PI * rollProgress)
            textField.alpha = textField.scale.y ** 1.75

            const newDistanceToFrame = Math.abs(textField.y - this.frameView?.y)
            if(newDistanceToFrame < distanceToFrame) {
                distanceToFrame = newDistanceToFrame
                this.selectedTextField = textField
            }
        })

        if(this.selectedOptionIndex !== selectedOptionIndex) {
            this.selectedOptionIndex = selectedOptionIndex

            if(!isNaN(this.selectableOptions[selectedOptionIndex])) {
                this.setUserInput(this.selectableOptions[selectedOptionIndex])
                this.validateUserInput()
            }

            this.onOptionSelected?.(this.selectableOptions[selectedOptionIndex], selectedOptionIndex)
        }

        this.selectedTextField.setFontColor(0x00FF00)
    }

    onRelease() {
        if(!this.isInteractionInProgress) return

        GUIView.isOverlayInteraction = false
        this.isInteractionInProgress = false
        
        const isSlideRelease = this.clickY !== this.slideY
        const releasePointDistance = Math.abs(this.slideY - this.clickY)
        const isEditRequested = releasePointDistance <= 5 && (Date.now() - this.clickTimeStamp) < 500
        
        if (isEditRequested) {
            this.forceSelect({
                optionIndex: this.selectedOptionIndex,
                dropUserInput: false,
                ignoreSameOptionIndex: true
            })

            this.onClick?.()
        } else if (isSlideRelease) {
            this.progress = (this.progress + this.progressOffset) % this.selectableOptions.length
            this.progressOffset = 0

            const initialProgress = this.progress
            const progressDelta = Math.round(this.progress) - initialProgress        

            this.timeline
                .deleteAllAnimations()
                .addAnimation({
                    duration: 500,
                    onProgress: progress => {
                        this.progress = initialProgress + progressDelta * progress
                        this.adjust()
                    }
                })
                .play()
        }
    }

    onSlide(e) {
        const { x, y } = this.toLocal(e.global)
        const distanceToFrame = this.clickY - this.frameView.y
        if (
            Math.abs(distanceToFrame) <= this.frameView.height / 2
            && Math.abs(y - this.clickY) < 10
        ) {
            return
        }

        this.setEditable(false)

        const { selectableOptions, textFields } = this
        const length = selectableOptions.length

        this.slideX = x
        this.slideY = y
        this.progress = (((y - this.clickY) / (HEIGHT / textFields.length)) % length + length) % length
        this.adjust()
        this.userInput = ''
    }

    forceSelect({optionIndex, dropUserInput, ignoreSameOptionIndex = false}) {
        if (this.isLocked) {
            return
        }

        if(!ignoreSameOptionIndex && this.selectedOptionIndex === optionIndex) return
        this.timeline.wind(1)
        this.progressOffset = 0
        this.progress = optionIndex
        if(this.progress < 0) this.progress = this.selectableOptions.length - 1
        
        this.selectedOptionIndex = optionIndex


        if (dropUserInput || !this.userInput) {
            this.setUserInput(this.selectableOptions[optionIndex])
            this.selectedTextField.setText(this.userInput)
        }

        this.adjust()
        this.validateUserInput()
    }

    setUserInput(value) {
        const editableSymbols = '0123456789.'
        const valueText = value.toFixed?.(2) ?? (value + '')
        this.userInput = ''

        for (let i = 0; i < valueText.length; i++) {
            if(editableSymbols.includes(valueText[i])) {
                this.userInput += valueText[i]
            }
        }
    }

    onClick() {
        const distanceToFrame = this.clickY - this.frameView.y
        if (Math.abs(distanceToFrame) <= this.frameView.height / 2) {
            this.setEditable()
        } else if (distanceToFrame < 0) {
            if (this.isEditable) {
              this.setEditable(false)
            } else {
                let nextOptionIndex = this.selectedOptionIndex + 1
                if(nextOptionIndex >= this.selectableOptions.length) {
                    nextOptionIndex = 0
                }
                
                this.forceSelect({optionIndex: nextOptionIndex, dropUserInput: true})
                this.onBetEdited()
                this.presentTrianglesBlink()
            }
        } else {
            if (this.isEditable) {
               this.setEditable(false)
            } else {
                let nextOptionIndex = this.selectedOptionIndex - 1
                if(nextOptionIndex < 0) {
                    nextOptionIndex = this.selectableOptions.length - 1
                }
                
                this.forceSelect({optionIndex: nextOptionIndex, dropUserInput: true})
                this.onBetEdited()
                this.presentTrianglesBlink(false)
            }
        }
    }

    getEditablePreset() {

    }

    setEditable(isEditable = true) {
        this.timeline.wind(1)

        if (isEditable) {
            this.timeline
                .deleteAllAnimations()
                .addAnimation({
                    duration: 500,
                    onProgress: progress => {
                        const subProgress = Math.sin(Math.PI * progress)
                        const offset = progress < 0.5 ? '|' : ' '

                        this.selectedTextField.setText(this.userInput + offset)
                        this.selectedTextField.alpha = 1 - 0.5 * subProgress
                    }
                })
                .setLoopMode()
                .play()

            this.validateUserInput()
        }

        if(this.isEditable === isEditable) return
        this.onEditableStateChange?.(isEditable)

        if(isEditable) {
            this.setUserInput(this.getEditablePreset() ?? this.selectedTextField.text) 
        } else {
            this.timeline
                .setLoopMode(false)
                .wind(1)

            this.selectedTextField.setText( formatMoney({value: Number(this.userInput)}) )
            this.selectedTextField.alpha = 1

            this.validateUserInput()
            if(!this.isUserInputValid) {
                this.setUserInput(this.selectableOptions[this.selectedOptionIndex])
                this.selectedTextField.setText(this.userInput)
            }

            this.onBetEdited()
        }

        this.isEditable = isEditable
    }

    canAdd(text) {
        if(!this.possibleInputCharacters.includes(text)) return

        const { userInput } = this
        const inputLength = userInput.length
        
        if(inputLength === 0 && text === '.') return
        if(userInput[0] === '0' && inputLength === 1 && text !== '.') return
        const periodIndex = userInput.indexOf('.')
        if(periodIndex > 0 && text === '.') return
        if(periodIndex > 0 && inputLength > periodIndex + 2) return

        return true
    }

    validateUserInput() {
        const value = Number(this.userInput)

        if(value < this.minimalValue) {
            this.onUserInputTooSmall?.()
            return this.isUserInputValid = false
        }
        
        if(value > this.maximalValue) {
            this.onUserInputTooBig?.()
            return this.isUserInputValid = false
        }
        

        this.onUserInputIsValid?.(value)
        this.isUserInputValid = true
    }

    onKeyboardInput(key) {
        if(!this.isEditable) return
        
        if(key === 'Backspace') {
            this.setUserInput(this.userInput.substring(0, this.userInput.length - 1))
        } else if (this.canAdd(key)){
            this.userInput += key
        }

        this.onBetEdited()
    }


    onBetEdited() {
        const { selectedTextField } = this
        this.validateUserInput()

        if (this.isUserInputValid) {
            selectedTextField.setFontColor(0x00FF00)
            this.onOptionSelected?.(Number(this.userInput), this.selectedOptionIndex)
        } else {
            selectedTextField.setFontColor(0xFF0000)
        }

        const maximalLength = this.maximalValue.toFixed(3).length

        if(this.userInput.length > maximalLength) {
            this.setUserInput(this.userInput.substring(0, maximalLength))
        }
    }

    onDoubleUp() {
        this.setUserInput((Number(this.userInput) * 2))
        this.onBetEdited()
    }

    onDoubleDown() {
        this.setUserInput((Number(this.userInput) / 2))
        this.onBetEdited()
    }
}
