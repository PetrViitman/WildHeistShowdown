import { Container } from 'pixi.js'
import { AtlasCharacter } from './AtlasCharacter'

export class AtlasText extends Container {
	hiddenCharacters = []
	bitmapCharacters = []
	availableCharacters
	textures
	letterSpacing
	text = ''
	color = 0xffffff
	sampleHeight = 0
	fontScaleFactor
	blurScaleFactor = 1
	distortionFactor = 0
	distortionHeight = 0

	constructor({availableCharacters, textures}) {
		super()
		this.textures = textures
		this.availableCharacters = availableCharacters

		Object.values(textures).forEach((texture) => {
			this.sampleHeight = Math.max(
				texture.trim?.height ?? texture.orig.height,
				this.sampleHeight,
			)
		})

		this.setFontSize(this.sampleHeight)
	}

	getBitmapCharacter(index) {
		if (!this.bitmapCharacters[index]) {
			const bitmapCharacter = new AtlasCharacter({
				characters: this.availableCharacters,
				textures: this.textures,
			})
			this.bitmapCharacters[index] = this.addChild(bitmapCharacter)
		}

		return this.bitmapCharacters[index]
	}

	setText(text = '') {
		this.text = text

		return this.adjust()
	}

	setColor(color = 0xffffff) {
		this.color = color

		return this.adjust()
	}

	setLetterSpacing(letterSpacing = 0) {
		this.letterSpacing = letterSpacing
		this.adjust()

		return this
	}

	setDistortion(distortionFactor = 0) {
		this.distortionFactor = distortionFactor

		return this
	}

	setDistortionHeight(height) {
		this.distortionHeight = height

		return this
	}

	adjust() {
		let x = 0
		for (let i = 0; i < this.text.length; i++) {
			
			const bitmapCharacter = this.getBitmapCharacter(i)
			bitmapCharacter.visible = true
			bitmapCharacter.scale.set(this.fontScaleFactor)
			bitmapCharacter.setCharacter(this.text[i])
			bitmapCharacter.setColor(this.color)
			bitmapCharacter.skew.x = 0
			bitmapCharacter.visible = !this.hiddenCharacters.includes(this.text[i])


			const characterHalfWidth = 
			(
				bitmapCharacter.width < 1
					? this.sampleHeight * this.fontScaleFactor
					: bitmapCharacter.width
			)  * 0.5
			x += characterHalfWidth

			bitmapCharacter.scale.x = this.fontScaleFactor
			bitmapCharacter.setColor(this.color)

			bitmapCharacter.x = x
			bitmapCharacter.y = bitmapCharacter.height / 2


			x += characterHalfWidth + this.letterSpacing
		}

		for (let i = this.text.length; i < this.bitmapCharacters.length; i++) {
			this.bitmapCharacters[i].visible = false
			this.bitmapCharacters[i].skew.x = 0
		}

		this.finalTextWidth = x - this.letterSpacing

		return this
	}


	onAdjusted() {
		if(!this.distortionFactor) return

		for (let i = 0; i < this.text.length; i++) {
			const bitmapCharacter = this.getBitmapCharacter(i)
			const symbolsProgress = i / (this.text.length - 1)
			const progress = 0.25 + (1 - symbolsProgress) * 0.5
			const angle = Math.PI * 2 * progress
			const sin = Math.sin(angle)
			bitmapCharacter.skew.x = sin * this.distortionFactor
			bitmapCharacter.y = bitmapCharacter.height / 2 + Math.sin(Math.PI * symbolsProgress) * this.distortionHeight
		}
	}

	setFontSize(fontSize = 20) {
		this.fontScaleFactor = fontSize / this.sampleHeight

		return this.adjust()
	}
}
