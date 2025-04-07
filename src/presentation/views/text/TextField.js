import { Graphics, BitmapText, Container, Text } from 'pixi.js'
import { AtlasText } from './AtlasText'

const ALIGN_IDS = {
	LEFT: 'left',
	CENTER: 'center',
	RIGHT: 'right',
	TOP: 'top',
	MIDDLE: 'middle',
	BOTTOM: 'bottom',
}

export class TextField extends Container {
	static fontStyles = {}
	static isLTRTextDirection = true
	static isDynamicCharacterSet

	text
	maximalWidth
	maximalHeight
	style = {
		familyName: undefined,
		fontSize: 20,
		fontColor: 0xffffff,
		letterSpacing: 0,
		letterFalling: 0,
	}
	areaGraphics
	horizontalAlignMode = ALIGN_IDS.LEFT
	verticalAlignMode = ALIGN_IDS.TOP
	bitmapText
	atlasText
	textView
	isDynamicCharacterSet
	charactersPerLineCount = Infinity

	constructor({
		maximalWidth = undefined,
		maximalHeight = undefined,
		isDynamicCharacterSet = TextField.isDynamicCharacterSet
	}) {
		super()

		this.maximalWidth = maximalWidth
		this.maximalHeight = maximalHeight
		this.isDynamicCharacterSet = isDynamicCharacterSet
		this.setFontName()
		this.setText('')
	}

	highlightArea() {
		if (!this.areaGraphics)
			this.areaGraphics = this.addChildAt(new Graphics(), 0)

		const width = this.maximalWidth ?? this.width
		const height = this.maximalHeight ?? this.height

		this.areaGraphics
			.clear()
			.beginFill(0xffffff, 0.25)
			.drawRect(0, 0, width, height)
			.drawRect(
				0,
				0,
				width,
				height,
			)
			.endFill()

		return this
	}

	setText(text = '', forceReset = false) {
		let finalText = text + ''
		if (finalText === this.text && !forceReset)
			return this

		if (!TextField.isLTRTextDirection) {
			let prefixRTL = ''
			for(let i = finalText.length - 1; i >= 0; i--) {
				if ('?!.-'.includes(finalText[i])) {
					prefixRTL += finalText[i]
				} else {
					break
				}
			}

			finalText = prefixRTL + finalText.substring(0, finalText.length - prefixRTL.length)
		}


		const finalTexts = text.split?.("║") ?? [finalText ?? '']

		this.text = finalTexts.join('\n')

		const {charactersPerLineCount} = this

		if (charactersPerLineCount) {
			this.text = ''

			finalTexts.forEach((finalText, paragraphIndex) => {
				let buffer = ''

				if (finalText.length < charactersPerLineCount) {
					buffer = finalText + (finalTexts.length > 1 ? '\n' : '')
				} else {
					let elapsedCharactersCount = 0
					let characterIndex = 0
					while (elapsedCharactersCount < finalText.length) {
						let textLine = finalText.substring(characterIndex, characterIndex + charactersPerLineCount)

						if (elapsedCharactersCount + charactersPerLineCount < finalText.length) {
							for (let i = textLine.length; i > 0; i--) {
								if(textLine[i] === ' ') {
									textLine = textLine.substring(0, i)
									break
								}
							}
						}

						buffer += textLine
						characterIndex += textLine.length
						elapsedCharactersCount += Math.max(0, textLine.length) || charactersPerLineCount

						if(
							paragraphIndex < finalTexts.length - 1 
							|| elapsedCharactersCount < finalText.length
						) {
							buffer += '\n'
						}
					}
				}

				if (!TextField.isLTRTextDirection) {
					if (text[text.length - 1] === '®') {
						buffer = buffer.substring(0, buffer.length - 1)
					} else {
						const lines = buffer.split('\n')
						buffer = ''

						for(let i = lines.length - 1; i >= 0; i--) {
							buffer += lines[i]
							if (i) buffer += '\n'
						}
					}

				}

				this.text += buffer
			})

			if(this.marker) {
				console.log('|' + this.text + '|')
			}
		}

		if (!this.textView)
			return this

		this.textView.text = this.text
		if (this.atlasText)
			this.atlasText.setText(this.text)

		return this.adjust()
	}

	setMaximalWidth(maximalWidth) {
		this.maximalWidth = maximalWidth

		return this.adjust()
	}

	setMaximalHeight(maximalHeight) {
		this.maximalHeight = maximalHeight

		return this.adjust()
	}

	setCharactersPerLineCount(charactersPerLineCount) {
		this.charactersPerLineCount = charactersPerLineCount

		return this.setText(this.text, true)
	}

	setAlignLeft() {
		return this.setHorizontalAlignMode(
			TextField.isLTRTextDirection
				? ALIGN_IDS.LEFT
				: ALIGN_IDS.RIGHT
		)
	}

	setAlignCenter() {
		return this.setHorizontalAlignMode(ALIGN_IDS.CENTER)
	}

	setAlignRight() {
		return this.setHorizontalAlignMode(
			TextField.isLTRTextDirection
				? ALIGN_IDS.RIGHT
				: ALIGN_IDS.LEFT
			)
	}

	setAlignTop() {
		return this.setVerticalAlignMode(ALIGN_IDS.TOP)
	}

	setAlignMiddle() {
		return this.setVerticalAlignMode(ALIGN_IDS.MIDDLE)
	}

	setAlignBottom() {
		return this.setVerticalAlignMode(ALIGN_IDS.BOTTOM)
	}

	setHorizontalAlignMode(horizontalAlignMode) {
		if (this.horizontalAlignMode === horizontalAlignMode)
			return this

		const { textView } = this

		if(textView) {
			if (textView.style) {
				textView.style.align = horizontalAlignMode;
			} else {
				textView.align = horizontalAlignMode;
			}
		}

		this.horizontalAlignMode = horizontalAlignMode
		this.adjust()

		return this
	}

	setVerticalAlignMode(verticalAlignMode) {
		if (this.verticalAlignMode === verticalAlignMode)
			return this

		this.verticalAlignMode = verticalAlignMode
		this.adjust()

		return this
	}

	adjust() {
		if (!this.textView) return this

		this.areaGraphics?.clear()
		this.textView.scale.set(1)
		this.textView.visible = true

		const textFullWidth = this.textView.finalTextWidth ?? this.textView.width
		const textFullHeight = this.textView.height
		const maximalWidth = this.maximalWidth ?? textFullWidth
		const maximalHeight = this.maximalHeight ?? textFullHeight

		let scaleX = 1
		let scaleY = 1

		if (maximalWidth)
			scaleX = Math.min(1, maximalWidth / textFullWidth)

		if (textFullHeight)
			scaleY = Math.min(1, maximalHeight / textFullHeight)
		
		const scale = Math.min(scaleX, scaleY)

		this.textView.scale.set(scale)

		let x = 0
		let y = 0

		switch (this.horizontalAlignMode) {
			case ALIGN_IDS.CENTER:
				x = (maximalWidth - textFullWidth * scale) * 0.5
				break
			case ALIGN_IDS.RIGHT:
				x = (maximalWidth - textFullWidth * scale)
				break
			default:
				x = 0
				break
		}

		switch (this.verticalAlignMode) {
			case ALIGN_IDS.TOP:
				y = 0
				break
			case ALIGN_IDS.BOTTOM:
				y = maximalHeight - this.textView.height * scaleY
				break
			default:
				y = maximalHeight * 0.5 - this.textView.height * 0.5
				break
		}

		this.textView.position.set(x, y)

		if (this.areaGraphics)
			this.highlightArea()


		this.atlasText?.onAdjusted()

		return this
	}

	setLetterSpacing(letterSpacing = 0) {
		this.style.letterSpacing = letterSpacing

		if (this.bitmapText)
			this.bitmapText.letterSpacing = letterSpacing
		else if (this.atlasText)
			this.atlasText.setLetterSpacing(letterSpacing)

		this.adjust()

		return this
	}

	setDistortion(distortionFactor = 0) {
		if (this.atlasText)
			this.atlasText.setDistortion(distortionFactor)

		this.adjust()

		return this
	}

	setDistortionHeight(height) {
		if (this.atlasText)
			this.atlasText.setDistortionHeight(height)

		this.adjust()

		return this
	}

	setSymbolsScale(scaleFactor = 1) {
		if (this.atlasText)
			this.atlasText.setSymbolsScale(scaleFactor)

		this.adjust()

		return this
	}

	setFontName(fontName = '', textures) {
		if (this.style.familyName === fontName && !textures)
			return this

		this.style.familyName = fontName
		if (this.textView) {
			this.removeChild(this.textView)
			this.textView.destroy()
			this.textView = null
		}

		// atlas font case
		if (textures && fontName) {
			this.atlasText = new AtlasText({
				availableCharacters: fontName,
				textures,
			})
			this.bitmapText = null
			this.textView = this.addChild(this.atlasText)
		}

		if (!this.textView) {
			try {
				this.atlasText = null

				if (this.isDynamicCharacterSet) {
					this.bitmapText = new Text('')

					const fontStyle = TextField.fontStyles[fontName]
					if(fontStyle) {
						this.bitmapText.style =  fontStyle
					}
				} else {
					this.bitmapText = new BitmapText('', {fontName})
				}

				this.textView = this.addChild(this.bitmapText)
			} catch (e) {}
		}

		return this.setFontSize(this.style.fontSize)
			.setFontColor(this.style.fontColor)
			.setLetterSpacing(this.style.letterSpacing)
			.setHorizontalAlignMode(this.horizontalAlignMode)
			.setVerticalAlignMode(this.verticalAlignMode)
			.setText(this.text)
	}

	setFontSize(fontSize) {
		this.style.fontSize = fontSize

		if (this.bitmapText) {
			this.bitmapText.fontSize = fontSize

			if (this.bitmapText.style) {
				this.bitmapText.style.fontSize = fontSize
			}
		}
		else if (this.atlasText)
			this.atlasText.setFontSize(fontSize)

		return this.adjust()
	}

	setFontColor(color) {
		this.style.fontColor = color
		this.atlasText?.setColor(color)
		if (this.bitmapText) 
			this.bitmapText.tint = color

		return this.adjust()
	}

	setHiddenCharacters(hiddenCharacters = []) {
		if(!this.atlasText) return
		this.atlasText.hiddenCharacters = hiddenCharacters
	}
}
