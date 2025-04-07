import { Container, Sprite } from 'pixi.js'

export class AtlasCharacter extends Container {
	currentSprite
	symbolsSprites = {}
	spaceSizeReferenceSymbol = '.'

	constructor({characters = '0123456789', textures, color = 0xffffff}) {
		super()
		const texturesArray = Object.values(textures)
		characters.split('').forEach((char, i) => {
			this.symbolsSprites[char] = this.addChild(new Sprite(texturesArray[i]))
			this.symbolsSprites[char].visible = false
			this.symbolsSprites[char].anchor.set(0.5)
		})

		this.setColor(color)
	}

	setColor(color = 0xffffff) {
		Object.values(this.symbolsSprites).forEach((sprite) => {
			sprite.tint = color
		})
	}

	setCharacter(character) {
		const targetSprite = this.symbolsSprites[character]
			?? this.symbolsSprites[this.spaceSizeReferenceSymbol]
			?? this.symbolsSprites[0]

		if (this.currentSprite !== undefined)
			this.currentSprite.visible = false

		this.currentSprite = targetSprite
		this.currentSprite.alpha = this.symbolsSprites[character] ? 1 : 0
		this.currentSprite.visible = true
	}
}
