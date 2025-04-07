import { Container, Sprite } from "pixi.js";

export class InfoBarSymbolsPoolView extends Container {
    symbolsViews
    
    constructor(assets) {
        super()
        this.symbolsViews = [
            'Clubs',
            'Hearts',
            'Diamonds',
            'Spades',
            'Bottle',
            'Hat',
            'Pistol',
            'Watches',
            'Wild',
            'Scatter',
        ].map(name => {
            const sprite = new Sprite(assets['symbol' + name])
            sprite.anchor.set(0.5)
            sprite.visible = false
            return this.addChild(sprite)
        })
    }

    presentSymbol(symbolId) {
        const targetSymbolId = symbolId - 1
        this.symbolsViews.forEach((view, i) => {
            view.visible = i === targetSymbolId
        })
    }
}