import { Application, BaseTexture, Spritesheet, Texture } from "pixi.js"
import { SymbolClubsView } from "../reels/cell/symbols/SymbolClubsView"
import { SymbolHeartsView } from "../reels/cell/symbols/SymbolHeartsView"
import { SymbolDiamondsView } from "../reels/cell/symbols/SymbolDiamondsView"
import { SymbolSpadesView } from "../reels/cell/symbols/SymbolSpadesView"
import { SymbolBottleView } from "../reels/cell/symbols/SymbolBottleView"
import { SymbolHatView } from "../reels/cell/symbols/SymbolHatView"
import { SymbolPistolView } from "../reels/cell/symbols/SymbolPistolView"
import { SymbolWatchesView } from "../reels/cell/symbols/SymbolWatchesView"
import { SymbolWildView } from "../reels/cell/symbols/SymbolWildView"
import { SymbolScatterView } from "../reels/cell/symbols/SymbolScatterView"
import { Base2DSymbolView } from "../reels/cell/symbols/Base2DsymbolView"
import { SafeView } from "../reels/cell/safe/SafeView"

const ICON_COLOR = '#FFEE77'

CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
	if (w < 2*r) r = w/2
	if (h < 2*r) r = h/2
	this.beginPath()
	if (r < 1) {
		this.rect(x, y, w, h)
	} else {
		if (window["opera"]) {
			this.moveTo(x+r, y)
			this.arcTo(x+r, y, x, y+r, r)
			this.lineTo(x, y+h-r)
			this.arcTo(x, y+h-r, x+r, y+h, r)
			this.lineTo(x+w-r, y+h)
			this.arcTo(x+w-r, y+h, x+w, y+h-r, r)
			this.lineTo(x+w, y+r)
			this.arcTo(x+w, y+r, x+w-r, y, r)
		} else {
			this.moveTo(x+r, y)
			this.arcTo(x+w, y, x+w, y+h, r)
			this.arcTo(x+w, y+h, x, y+h, r)
			this.arcTo(x, y+h, x, y, r)
			this.arcTo(x, y, x+w, y, r)
		}
	}
	this.closePath()
}

function createCanvas(width = 2048, height = 2048) {
	const canvas = document.createElement('canvas')
	canvas.width = width
	canvas.height = height
	canvas.context = canvas.getContext("2d")
	canvas.style.width = (width / 2) + 'px'
	canvas.style.height = (height / 2) + 'px'

	return canvas
}

function createButtonFace({
	width = 200,
	height = 200,
	channels = [
		[50, 50, 50],
		[255, 255, 255],
	]}) {
	const canvas = createCanvas(width, height)
	const {context} = canvas

	const colors = [
		'rgba(' + channels[0][0] + ', ' + channels[0][1] + ',' + channels[0][2] + ', 1)',
		'rgba(' + channels[1][0] + ', ' + channels[1][1] + ',' + channels[1][2] + ', 1)'
	]

	let gradient = context.createLinearGradient(0,0, 0, height)
	gradient.addColorStop(0, colors[0])
	gradient.addColorStop(1, colors[1])
	context.fillStyle = gradient
	
	context.beginPath()
	context.roundRect(width * 0.025, height * 0.025, width * 0.95, height * 0.95, width * 0.425)
	context.fill()


	for(let i = 0; i < 20; i++) {

		const offset = i * 0.05
		const alpha = 1 - i * offset
		const colors = [
			'rgba(' + channels[0][0] + ', ' + channels[0][1] + ',' + channels[0][2] + ',' + alpha +')',
			'rgba(' + channels[1][0] + ', ' + channels[1][1] + ',' + channels[1][2] + ',' + alpha +')'
		]
		
		context.beginPath()
		context.lineWidth = width * 0.04
		context.roundRect(
			width * (0.025 + 0.2 * offset ),
			height *  (0.025 + 0.2 * offset),
			width * (0.95 - 0.4 * offset),
			height *(0.95 - 0.4 * offset),
			width * 0.425
		)
		gradient = context.createLinearGradient(0,0, 0, height)
		gradient.addColorStop(0, colors[1])
		gradient.addColorStop(1, colors[0])
		context.strokeStyle = gradient
		context.stroke()
	}


	context.closePath()

    return canvas
}

function createButtonBarFace(width = 400, height = 125) {
	const canvas = createCanvas(width, height)
	const {context} = canvas
	const channels = [
		[50, 0, 0],
		[255, 0, 0],
	]

	const colors = [
		'rgba(' + channels[0][0] + ', ' + channels[0][1] + ',' + channels[0][2] + ', 1)',
		'rgba(' + channels[1][0] + ', ' + channels[1][1] + ',' + channels[1][2] + ', 1)'
	]

	let gradient = context.createLinearGradient(0,0, 0, height)
	gradient.addColorStop(0, colors[0])
	gradient.addColorStop(1, colors[1])
	context.fillStyle = gradient
	
	context.beginPath()
	context.roundRect(width * 0.025, height * 0.025, width * 0.95, height * 0.95, 40)
	context.fill()


	for(let i = 0; i < 20; i++) {

		const offset = i * 0.025
		const alpha = 1 - i * offset
		const colors = [
			'rgba(' + channels[0][0] + ', ' + channels[0][1] + ',' + channels[0][2] + ',' + alpha +')',
			'rgba(' + channels[1][0] + ', ' + channels[1][1] + ',' + channels[1][2] + ',' + alpha +')'
		]
		
		context.beginPath()
		context.lineWidth = width * 0.02
		context.roundRect(
			width * (0.025 + 0.2 * offset ),
			height *  (0.025 + 0.2 * offset),
			width * (0.95 - 0.4 * offset),
			height *(0.95 - 0.4 * offset),
			40
		)
		gradient = context.createLinearGradient(0,0, 0, height)
		gradient.addColorStop(0, colors[1])
		gradient.addColorStop(1, colors[0])
		context.strokeStyle = gradient
		context.stroke()
	}


	context.closePath()

    return canvas
}

function createIconSpin(width = 175, height = 200) {
	const canvas = createCanvas(width, height)

	const {context} = canvas

	context.strokeStyle = ICON_COLOR
	context.lineWidth = width * 0.15


	context.beginPath()
	context.arc(width / 2, height / 2, width * 0.375, Math.PI * 0.75, Math.PI * 1.525, false)
	context.stroke()

	context.beginPath()
	context.arc(width / 2, height / 2, width * 0.375, Math.PI * 1.75, Math.PI * 0.525, false)
	context.stroke()

	let path=new Path2D()
	context.fillStyle = ICON_COLOR
	path.moveTo(width * 0.5, width * 0.05)
	path.lineTo(width * 0.5 + width * 0.2, width * 0.2)
	path.lineTo(width * 0.5, width * 0.35)
	context.fill(path)

	path=new Path2D()
	context.fillStyle = ICON_COLOR
	path.moveTo(width * 0.5, width * (0.05 + 0.745))
	path.lineTo(width * 0.5 - width * 0.2, width * (0.2 + 0.745))
	path.lineTo(width * 0.5, width * (0.35 + 0.745))
	context.fill(path)

    return canvas
}


function createCharacter(character = 'M', fontSize = 75) {
	const canvas = createCanvas(fontSize, fontSize)
	const width = fontSize
	const height = fontSize
	const {context} = canvas
	const finalFontSize = fontSize * 0.85
    const text = character

    context.font = "bold " + finalFontSize +"px Tahoma"
    context.textBaseline = "middle";

    context.fillStyle = "green";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "white";


    context.fillText(text, width * 0.5 - context.measureText(character).width * 0.5, height * 0.5)


    return canvas
}


function createIconSkip(width = 150, height = 150) {
	const canvas = createCanvas(width, height)
	const {context} = canvas



	context.beginPath()
	context.fillStyle = ICON_COLOR
	context.lineWidth = width * 0.1
	context.lineJoin = "round"
	context.strokeStyle = ICON_COLOR
	context.moveTo(width * 0.1, height * 0.1)
	context.lineTo(width * 0.65, height * 0.5)
	context.lineTo(width * 0.1, height * 0.9 )
	context.closePath()
	context.stroke()
	context.fill()


	context.beginPath()
	context.roundRect(width * 0.8, 0, width * 0.2, height, width * 0.05)
	context.fill()
	context.closePath()

    return canvas
}

function createIconTurbo(width = 150, height = 100) {
	const canvas = createCanvas(width, height)
	const {context} = canvas

	for(let i = 0; i < 2; i++ ) {
		const offsetX = i * 0.45

		context.beginPath()
		context.fillStyle = ICON_COLOR
		context.lineWidth = width * 0.05
		context.lineJoin = "round"
		context.strokeStyle = ICON_COLOR
		context.moveTo(width * (0.05 + offsetX), height * 0.05)
		context.lineTo(width * (0.5 + offsetX), height * 0.5)
		context.lineTo(width * (0.05 + offsetX), height * 0.95)
		context.closePath()
		context.stroke()
		context.fill()
	}

    return canvas
}

function createIconErase(width = 175, height = 175) {
	const canvas = createCanvas(width, height)
	const {context} = canvas

	context.beginPath()
	context.strokeStyle = ICON_COLOR
	context.lineWidth = width * 0.075
	context.lineJoin = "round"
	context.strokeStyle = ICON_COLOR
	context.moveTo(width * 0.375, height * 0.15)
	context.lineTo(width * 0.95, height * 0.15)
	context.lineTo(width * 0.95, height * 0.85)
	context.lineTo(width * 0.375, height * 0.85)
	context.lineTo(width * 0.05, height * 0.5)
	context.closePath()
	context.stroke()



	
	
	/*
	context.beginPath()
	context.fillStyle = '#FF0000'
	context.scale(0.8, 0.8)
	context.roundRect(width * -0.4, height * -0.1, width * 0.8, height * 0.2, width * 0.025)
	context.fill()
	*/

	context.fillStyle = ICON_COLOR
	context.beginPath()
	context.translate(width * 0.6, height / 2)
	context.scale(0.5, 0.5)
	context.rotate(Math.PI * 0.25)
	context.roundRect(width * -0.4, height * -0.1, width * 0.8, height * 0.2, width * 0.025)
	context.fill()
	context.roundRect(width * -0.1, height * -0.4, width * 0.2, height * 0.8, width * 0.025)
	context.fill()
	context.closePath()



    return canvas
}

function createIconBuyFeature(width = 175, height = 175) {
	const canvas = createCanvas(width, height)
	const {context} = canvas

	context.strokeStyle = ICON_COLOR
	context.lineWidth = width * 0.05
	context.lineJoin = "round"

	context.beginPath()
	context.arc(width / 2, height / 2, width * 0.25, 0, Math.PI, false)
	context.stroke()


	context.beginPath()
	context.fillStyle = ICON_COLOR
	context.roundRect(width * 0.225, height * 0.465, width * 0.55, height * 0.05, width * 0.025)
	context.fill()
	context.closePath()

	context.beginPath()
	context.fillStyle = ICON_COLOR
	context.roundRect(width * 0.05, height * 0.275, width * 0.75, height * 0.1, width * 0.025)
	context.fill()
	context.closePath()

	context.beginPath()
	context.fillStyle = ICON_COLOR
	context.roundRect(width * 0.225, height * 0.3, width * 0.05, height * 0.25, width * 0.025)
	context.fill()
	context.closePath()

	context.beginPath()
	context.fillStyle = ICON_COLOR
	context.roundRect(width * 0.725, height * 0.3, width * 0.05, height * 0.25, width * 0.025)
	context.fill()
	context.closePath()

	context.beginPath()
	context.fillStyle = ICON_COLOR
	context.roundRect(width * 0.4, height * 0.315, width * 0.05, height * 0.425, width * 0.025)
	context.fill()
	context.closePath()

	context.beginPath()
	context.fillStyle = ICON_COLOR
	context.roundRect(width * 0.55, height * 0.315, width * 0.05, height * 0.425, width * 0.025)
	context.fill()
	context.closePath()

	context.beginPath()
	context.fillStyle = ICON_COLOR
	context.lineWidth = width * 0.05
	context.lineJoin = "round"
	context.strokeStyle = ICON_COLOR
	context.moveTo(width * 0.15, height * 0.325)
	context.lineTo(width * 0.25, height * 0.325)
	context.lineTo(width * 0.25, height * 0.5 )
	context.closePath()
	context.stroke()
	context.fill()
	


	context.beginPath()
	context.fillStyle = ICON_COLOR
	context.arc(width * 0.25, height * 0.8, width * 0.085, 0, Math.PI * 2, false)
	context.closePath()
	context.fill()

	context.beginPath()
	context.fillStyle = ICON_COLOR
	context.arc(width * 0.75, height * 0.8, width * 0.085, 0, Math.PI * 2, false)
	context.closePath()
	context.fill()


    return canvas
}

function createIconBonus(width = 90, height = 90) {
	const canvas = createCanvas(width, height)
	const {context} = canvas
	const lineWidth = width * 0.075

	context.strokeStyle = ICON_COLOR
	context.lineWidth = lineWidth
	context.lineJoin = "round"


	context.fillStyle = ICON_COLOR

	context.roundRect(width * 0.1, height * 0.22, width * 0.8, height * 0.72, width * 0.15)
	context.fill()


	context.save()
	context.roundRect(width * 0.2, height * 0.3, width * 0.6, height * 0.55, width * 0.125)
	context.fill()
	context.clip()
	context.clearRect(0, 0, width, height)
	context.restore()


	context.roundRect(width * 0.4, height * 0.15, width * 0.2, height * 0.825, width * 0.025)
	context.fill()
	context.roundRect(width * 0.05, height * 0.45, width * 0.9, height * 0.15, width * 0.025)
	context.fill()

	context.beginPath()
	context.moveTo(width * 0.25, height * 0.1)
	context.lineTo(width * 0.35, height * 0.05)
	context.lineTo(width * 0.5, height * 0.175 )
	context.closePath()
	context.stroke()
	context.fill()

	context.beginPath()
	context.moveTo(width * 0.75, height * 0.1)
	context.lineTo(width * 0.65, height * 0.05)
	context.lineTo(width * 0.5, height * 0.175 )
	context.closePath()
	context.stroke()
	context.fill()


    return canvas
}

function createIconBonusFreeBet(width = 90, height = 90) {
	const canvas = createIconBonus(width, height)
	const {context} = canvas
	

	context.strokeStyle = ICON_COLOR
	context.lineJoin = "round"
	context.fillStyle = ICON_COLOR


	context.save()
	context.roundRect(width * 0.2, height * 0.275, width * 0.6, height * 0.6, width * 0.125)
	context.fill()
	context.clip()
	context.clearRect(0, 0, width, height)
	context.restore()


	context.roundRect(width * 0.35, height * 0.375, width * 0.15, height * 0.4, width * 0.025)
	context.fill()

	context.roundRect(width * 0.35, height * 0.3725, width * 0.325, height * 0.125, width * 0.025)
	context.fill()

	context.roundRect(width * 0.35, height * 0.575, width * 0.3, height * 0.1, width * 0.025)
	context.fill()

    return canvas
}


function createIconBonusHalfBet(width = 90, height = 90) {
	const canvas = createIconBonus(width, height)
	const {context} = canvas
	

	context.strokeStyle = ICON_COLOR
	context.lineJoin = "round"
	context.fillStyle = ICON_COLOR


	context.save()
	context.roundRect(width * 0.2, height * 0.275, width * 0.6, height * 0.6, width * 0.125)
	context.fill()
	context.clip()
	context.clearRect(0, 0, width, height)
	context.restore()



	context.beginPath()
	context.moveTo(width * 0.85, height * 0.275)
	context.lineTo(width * 0.85, height * 0.9)
	context.lineTo(width * 0.15, height * 0.875 )
	context.closePath()
	context.fill()

    return canvas
}

function createIconBonusDoubleUp(width = 90, height = 90) {
	const canvas = createIconBonus(width, height)
	const {context} = canvas
	

	context.strokeStyle = ICON_COLOR
	context.lineJoin = "round"
	context.fillStyle = ICON_COLOR


	context.save()
	context.roundRect(width * 0.2, height * 0.275, width * 0.6, height * 0.6, width * 0.125)
	context.fill()
	context.clip()
	context.clearRect(0, 0, width, height)
	context.restore()


	context.roundRect(width * 0.6, height * 0.4, width * 0.15, height * 0.05, width * 0.01)
	context.fill()

	context.roundRect(width * 0.6, height * 0.5, width * 0.15, height * 0.05, width * 0.025)
	context.fill()

	context.roundRect(width * 0.6, height * 0.6, width * 0.15, height * 0.075, width * 0.01)
	context.fill()

	context.roundRect(width * 0.7, height * 0.4, width * 0.05, height * 0.15, width * 0.025)
	context.fill()

	context.roundRect(width * 0.6, height * 0.5, width * 0.05, height * 0.15, width * 0.025)
	context.fill()


	context.translate(width * 0.425, height * 0.55)
	context.rotate(Math.PI / 4)
	context.roundRect(-width * 0.15, -height * 0.05, width * 0.3, height * 0.1, width * 0.025)
	context.fill()

	context.rotate(Math.PI / 2)
	context.roundRect(-width * 0.15, -height * 0.05, width * 0.3, height * 0.1, width * 0.025)
	context.fill()

    return canvas
}

function createIconHome(width = 175, height = 125) {
	const canvas = createCanvas(width, height)
	const {context} = canvas

	context.fillStyle = '#b6c1c7'

	context.roundRect(
		width * 0.35,
		height * 0.5 -height * 0.075,
		width * 0.45,
		height * 0.15,
		width * 0.025
	)
	context.fill()


	context.translate(width * 0.35, height * 0.5)
	context.rotate(Math.PI * -0.75)
	
	context.scale(1.15, 1.15)
	for(let i = 0; i < 2; i++) {
		context.rotate(Math.PI * 0.5)
		context.roundRect(-width * 0.03, -height * 0.05, width * 0.25, height * 0.1, width * 0.025)
		context.fill()
	}

    return canvas
}

function createIconHomeBackground(width = 190, height = 125) {
	const canvas = createCanvas(width, height)
	const {context} = canvas

	context.fillStyle = '#FFFFFF'
	context.roundRect(0, 0, width, height, width * 0.5)
	context.rect(0, 0, width / 2, height)
	context.fill()
	

    return canvas
}

function createIconTriangle(width = 190, height = 125) {
	const canvas = createCanvas(width, height)
	const {context} = canvas
	context.fillStyle = '#FFFFFF'
	context.lineWidth = width * 0.1

	context.moveTo(width * 0.1, height * 0.9)
	context.lineTo(width * 0.5, height * 0.1)
	context.lineTo(width * 0.9, height * 0.9 )
	context.fill()
	

    return canvas
}

function createIconAutoplay(isTriangleVisible = true, width = 175, height = 175) {
	const canvas = createCanvas(width, height)
	const {context} = canvas

	context.strokeStyle = ICON_COLOR
	context.lineWidth = width * 0.07


	context.beginPath()
	context.arc(width / 2, height / 2, width * 0.375, Math.PI * 0.675, Math.PI * 1.525, false)
	context.stroke()

	let path=new Path2D()
	context.fillStyle = ICON_COLOR
	path.moveTo(width * 0.5, width * 0.05)
	path.lineTo(width * 0.5 + width * 0.1, width * 0.125)
	path.lineTo(width * 0.5, width * 0.2)
	context.fill(path)

	context.beginPath()
	context.arc(width / 2, height / 2, width * 0.375, -Math.PI * 0.3, Math.PI * 0.525, false)
	context.stroke()

	path=new Path2D()
	context.fillStyle = ICON_COLOR
	path.moveTo(width * 0.5, width * 0.8)
	path.lineTo(width * 0.5 - width * 0.1, width * 0.875)
	path.lineTo(width * 0.5, width * 0.95)
	context.fill(path)



	if(isTriangleVisible) {
		context.beginPath()
		context.fillStyle = ICON_COLOR
		context.lineWidth = width * 0.05
		context.lineJoin = "round"
		context.strokeStyle = ICON_COLOR
		context.moveTo(width * 0.4, height * 0.35)
		context.lineTo(width * 0.65, height * 0.5)
		context.lineTo(width * 0.4, height * 0.65 )
		context.closePath()
		context.stroke()
		context.fill()
	}


    return canvas
}

function createIconWatches(width = 100, height = 100) {
	const canvas = createCanvas(width, height)
	const {context} = canvas

	context.strokeStyle = ICON_COLOR
	context.fillStyle = ICON_COLOR
	context.lineWidth = width * 0.05


	context.beginPath()
	context.arc(width / 2, height / 2, width * 0.3, 0, Math.PI * 2, false)
	context.stroke()

	context.beginPath()
	context.arc(width / 2, height / 2, width * 0.035, 0, Math.PI * 2, false)
	context.fill()
	context.stroke()

	context.roundRect(width * 0.4, height * 0.1, width * 0.2, height * 0.05, width * 0.025)
	context.fill()
	context.roundRect(width * 0.4, height * 0.85, width * 0.2, height * 0.05, width * 0.025)
	context.fill()


	context.save()
	context.translate(width / 2, height / 2)
	context.rotate(Math.PI / 4)
	context.roundRect(width * -0.025, height * 0, width * 0.05, height * 0.2, width * 0.025)
	context.fill()

	context.rotate(Math.PI / 2)
	context.roundRect(width * -0.025, height * 0, width * 0.05, height * 0.235, width * 0.025)
	context.fill()

    return canvas
}


function createIconBet(width = 100, height = 100) {
	const canvas = createCanvas(width, height)
	const {context} = canvas
	const offsetY = height * 0.1

	context.lineWidth = width * 0.075

	for(let y = 1; y < 3; y++) {
		context.strokeStyle = ICON_COLOR
		context.beginPath()
		context.ellipse(width * 0.5, height * 0.2 * (y + 1) + offsetY, width * 0.425, height * 0.225, 0, -Math.PI * 0.15, Math.PI * 1.15)
		context.stroke()
	}
	context.strokeStyle = ICON_COLOR
	context.beginPath()
	context.ellipse(width * 0.5, height * 0.2 + offsetY, width * 0.425, height * 0.225, 0, 0, Math.PI * 2)
	context.stroke()
	context.fillStyle = ICON_COLOR
	context.fill()

    return canvas
}


function createIconWallet(width = 95, height = 95) {
	const canvas = createCanvas(width, height)
	const {context} = canvas

	context.lineWidth = width * 0.05
	context.strokeStyle = ICON_COLOR
	context.fillStyle = ICON_COLOR
	context.beginPath()
	context.roundRect(width * 0.025, height * 0.05, width * 0.5, height * 0.9, width * 0.1)
	context.fill()
	context.roundRect(width * 0.025, height * 0.05, width * 0.675, height * 0.9, width * 0.1)
	context.stroke()
	context.beginPath()
	context.roundRect(width * 0.025, height * 0.05, width * 0.85, height * 0.9, width * 0.1)
	context.stroke()
	context.beginPath()
	context.roundRect(width * 0.875, height * 0.4, width * 0.1, height * 0.2, width * 0.01)
	context.fill()
	context.stroke()


	context.strokeStyle = '#000000'
	context.fillStyle = '#000000'
	context.lineWidth = width * 0.025
	context.beginPath()
	context.roundRect(width * 0.375, height * 0.425, width * 0.075, height * 0.2, width * 0.1)
	context.fill()
	context.clip()
	context.clearRect(0, 0, width, height)

    return canvas
}


function createIconFullScreen(width = 100, height = 100) {
	const canvas = createCanvas(width, height)
	const {context} = canvas

	context.translate(width * 0.5, height * 0.5)
	context.rotate(Math.PI * -0.25)
	context.scale(1.15, 1.15)
	for(let i = 0; i < 4; i++) {
		context.rotate(Math.PI * 0.5)
		context.beginPath()
		context.fillStyle = ICON_COLOR
		context.roundRect(width * 0.2, height * -0.1, width * 0.25, height * 0.2, width * 0.025)
		context.fill()

		context.beginPath()
		context.fillStyle = ICON_COLOR
		context.lineWidth = width * 0.025
		context.lineJoin = "round"
		context.strokeStyle = ICON_COLOR
		context.moveTo(width * 0.35, height * -0.2)
		context.lineTo(width * 0.5, height * 0)
		context.lineTo(width * 0.35, height * 0.2 )
		context.closePath()
		context.stroke()
		context.fill()
	}

    return canvas
}

function createIconMinimizeScreen(width = 100, height = 100) {
	const canvas = createCanvas(width, height)
	const {context} = canvas

	context.translate(width * 0.5, height * 0.5)
	context.rotate(Math.PI * -0.25)
	context.scale(1.15, 1.15)
	for(let i = 0; i < 4; i++) {
		context.rotate(Math.PI * 0.5)
		context.beginPath()
		context.fillStyle = ICON_COLOR
		context.roundRect(width * 0.2, height * -0.1, width * 0.25, height * 0.2, width * 0.025)
		context.fill()

		context.beginPath()
		context.fillStyle = ICON_COLOR
		context.lineWidth = width * 0.025
		context.lineJoin = "round"
		context.strokeStyle = ICON_COLOR
		context.moveTo(width * 0.25, height * -0.2)
		context.lineTo(width * 0.1, height * 0)
		context.lineTo(width * 0.25, height * 0.2 )
		context.closePath()
		context.stroke()
		context.fill()
	}

    return canvas
}


function createIconBetMore(width = 200, height = 200) {
	const canvas = createCanvas(width, height)
	const {context} = canvas

	context.strokeStyle = ICON_COLOR
	context.lineWidth = width * 0.1


	context.beginPath()
	context.arc(width / 2, height / 2, width * 0.4, 0, Math.PI * 2, false)
	context.stroke()

	context.beginPath()
	context.fillStyle = ICON_COLOR
	context.roundRect(width * 0.25, height * 0.4, width * 0.5, height * 0.2, width * 0.025)
	context.fill()

    context.roundRect(width * 0.4, height * 0.25, width * 0.2, height * 0.5, width * 0.025)
	context.fill()
	context.closePath()
    return canvas
}

function createIconBetLess(width = 200, height = 200) {
	const canvas = createCanvas(width, height)
	const {context} = canvas

	context.strokeStyle = ICON_COLOR
	context.lineWidth = width * 0.1


	context.beginPath()
	context.arc(width / 2, height / 2, width * 0.4, 0, Math.PI * 2, false)
	context.stroke()

	context.beginPath()
	context.fillStyle = ICON_COLOR
	context.roundRect(width * 0.25, height * 0.4, width * 0.5, height * 0.2, width * 0.025)


	context.fill()
	context.closePath()
    return canvas
}


function createIconInfo(width = 100, height = 100) {
	const canvas = createCanvas(width, height)
	const {context} = canvas

	context.strokeStyle = ICON_COLOR
	context.lineWidth = width * 0.1


	context.beginPath()
	context.arc(width / 2, height / 2, width * 0.4, 0, Math.PI * 2, false)
	context.stroke()

	context.beginPath()
	context.fillStyle = ICON_COLOR
	context.roundRect(width * 0.4, height * 0.25, width * 0.2, height * 0.15, width * 0.05)
	context.fill()
	context.closePath()

	context.beginPath()
	context.fillStyle = ICON_COLOR
	context.roundRect(width * 0.4, height * 0.45, width * 0.2, height * 0.3, width * 0.05)


	context.fill()
	context.closePath()
    return canvas
}


function createIconClose(width = 90, height = 90) {
	const canvas = createCanvas(width, height)
	const {context} = canvas

	context.strokeStyle = ICON_COLOR
	context.lineWidth = width * 0.1
	context.translate(width / 2, -height * 0.2)
	context.rotate(Math.PI / 4)

	context.beginPath()
	context.arc(width / 2, height / 2, width * 0.4, 0, Math.PI * 2, false)
	context.stroke()
	
	context.beginPath()
	context.fillStyle = ICON_COLOR
	context.roundRect(width * 0.425, height * 0.2, width * 0.15, height * 0.6, width * 0.025)
	context.fill()

	context.save()
	context.translate(width, 0)
	context.rotate(Math.PI / 2)
	context.roundRect(width * 0.425, height * 0.2, width * 0.15, height * 0.6, width * 0.025)
	context.restore()

	context.fill()
	context.closePath()

    return canvas
}

function createIconMute(width = 90, height = 90) {
	const canvas = createCanvas(width, height)
	const {context} = canvas

	context.strokeStyle = ICON_COLOR
	context.fillStyle = ICON_COLOR
	context.lineWidth = width * 0.1
	context.beginPath()
	context.arc(width * 0.55, height / 2, width * 0.4, Math.PI * -0.4, Math.PI * 0.4, false)
	context.stroke()

	context.beginPath()
	context.arc(width * 0.55, height / 2, width * 0.2, Math.PI * -0.4, Math.PI * 0.4, false)
	context.stroke()


	context.beginPath()
	context.arc(width / 2, height / 2, width * 0.25, Math.PI * 0.5, Math.PI * 1.5, false)
	context.stroke()
	context.fill()

	context.beginPath()
	context.arc(width * 0.2, height / 2, width * 0.1, Math.PI * 0.5, Math.PI * 1.5, false)
	context.stroke()
	context.fill()


	context.beginPath()
	context.translate(width / 2, height / 2)
	context.rotate(-Math.PI / 6)
	context.rect(width * -0.5, -height * 0.05, width * 2, height * 0.25)
	context.clip()
	context.clearRect(-width, -height, width * 2, height * 2)


	context.roundRect(width * -0.5, 0, width * 1.025, height * 0.1, width * 0.01)
	context.fill()
    return canvas
}

function createIconUnmute(width = 90, height = 90) {
	const canvas = createCanvas(width, height)
	const {context} = canvas

	context.strokeStyle = ICON_COLOR
	context.fillStyle = ICON_COLOR
	context.lineWidth = width * 0.1
	context.beginPath()
	context.arc(width * 0.55, height / 2, width * 0.4, Math.PI * -0.4, Math.PI * 0.4, false)
	context.stroke()

	context.beginPath()
	context.arc(width * 0.55, height / 2, width * 0.2, Math.PI * -0.4, Math.PI * 0.4, false)
	context.stroke()


	context.beginPath()
	context.arc(width / 2, height / 2, width * 0.25, Math.PI * 0.5, Math.PI * 1.5, false)
	context.stroke()
	context.fill()

	context.beginPath()
	context.arc(width * 0.2, height / 2, width * 0.1, Math.PI * 0.5, Math.PI * 1.5, false)
	context.stroke()
	context.fill()

    return canvas
}

function createIconUnmuteLoading(width = 90, height = 90) {
	const canvas = createCanvas(width, height)
	const {context} = canvas

	context.strokeStyle = ICON_COLOR
	context.fillStyle = ICON_COLOR
	context.lineWidth = width * 0.1

	context.globalAlpha = 0.5;
	context.beginPath()
	context.arc(width * 0.55, height / 2, width * 0.4, Math.PI * -0.4, 0, false)
	context.stroke()

	context.beginPath()
	context.arc(width * 0.55, height / 2, width * 0.2, Math.PI * -0.4, 0, false)
	context.stroke()
	context.globalAlpha = 1;


	context.beginPath()
	context.arc(width / 2, height / 2, width * 0.25, Math.PI * 0.5, Math.PI * 1.5, false)
	context.stroke()
	context.fill()

	context.beginPath()
	context.arc(width * 0.2, height / 2, width * 0.1, Math.PI * 0.5, Math.PI * 1.5, false)
	context.stroke()
	context.fill()


	for(let x = 0; x < 3; x++) {
		context.beginPath()
		context.arc(width * (0.6 + x * 0.165), height * 0.65, width * 0.06, 0, Math.PI * 2)
		context.fill()

	}

    return canvas
}

function createIconWin(width = 100, height = 100) {
	const canvas = createCanvas(width, height)
	const {context} = canvas


	context.strokeStyle = ICON_COLOR
	context.fillStyle = ICON_COLOR

	context.beginPath()
	context.lineWidth = width * 0.1
	context.arc(width / 2, height / 2, width * 0.4, 0, Math.PI * 2, false)
	context.stroke()


	context.save()
    context.beginPath()
    context.translate(width / 2, height / 2)
	const radius = width * 0.225
	const n = 5
	const inset = 1.5
    context.moveTo(0,0-radius)
    for (var i = 0; i < n; i++) {
        context.rotate(Math.PI / n)
        context.lineTo(0, 0 - (radius*inset))
        context.rotate(Math.PI / n)
        context.lineTo(0, 0 - radius)
    }
    context.closePath()
    context.fill()
    context.restore()

    return canvas
}

function createRectangle(width = 90, height = 90) {
	const canvas = createCanvas(width, height)
	const {context} = canvas

	context.fillStyle = '#FFFFFF'
	context.fillRect(0, 0, width, height)

    return canvas
}

function createGradient(width = 248, height = 400) {
	const canvas = createCanvas(width, height)
	const {context} = canvas
	const colors = ['rgba(0, 0, 0, 0)', 'rgba(255,255,255, 0.85)' , 'rgba(255,255,255, 1)']
	const gradient = context.createLinearGradient(0,0, 0, height)
	gradient.addColorStop(0, colors[0])
	gradient.addColorStop(0.35, colors[1])
	gradient.addColorStop(1, colors[2])
	context.fillStyle = gradient
	context.fillRect(0, 0, width, height)

    return canvas
}

function createBigRoundedRectangle(width = 400, height = 590) {
	const canvas = createCanvas(width, height)
	const {context} = canvas

	context.fillStyle = '#000000'
	context.lineWidth = width * 0.01
	context.strokeStyle = '#f8ee89'
	context.roundRect(width * 0.005, height * 0.005, width * 0.985, height * 0.985, width * 0.1)
	context.fill()

	context.roundRect(width * 0.005, height * 0.005, width * 0.985, height * 0.985, width * 0.1)
	context.stroke()

	
    return canvas
}

function createUICorner(width = 500, height = 500) {
	const canvas = createCanvas(100, 100)
	const {context} = canvas

	context.fillStyle = '#000000'
	context.lineWidth = width * 0.01
	context.strokeStyle = '#f8ee89'
	context.roundRect(3, 3, width, height, width * 0.075)
	context.fill()

	context.roundRect(3, 3, width, height, width * 0.075)
	context.stroke()

	
    return canvas
}

function createUIBorder(width = 500, height = 500) {
	const canvas = createCanvas(100, 100)
	const {context} = canvas

	context.fillStyle = '#000000'
	context.lineWidth = width * 0.01
	context.strokeStyle = '#f8ee89'
	context.roundRect(3, - 200, width, height, width * 0.1)
	context.fill()

	context.roundRect(3, - 200, width, height, width * 0.1)
	context.stroke()

    return canvas
}

function createIndicatorPanel(width = 400, height = 100) {
	const canvas = createCanvas(width, height)
	const {context} = canvas
	const color = '#FFFFFF'
	context.fillStyle = color
	context.roundRect(2, 2, width - 4, height - 4, height * 0.2)
	context.fill()

    return canvas
}

function createSymbolIcon(symbolView) {
	const pixiApplication = new Application()
	pixiApplication.renderer.plugins.accessibility.destroy()
	delete pixiApplication.renderer.plugins.accessibility
	symbolView.idleProgressOffset = 0
	symbolView.update(0.15)
	symbolView.setSpin(0)
	symbolView.scale.set(1)
	if(symbolView.blurredBodyView) {
		symbolView.blurredBodyView.visible = false
	}
	symbolView.flamesContainer.visible = false
	const canvas = pixiApplication.renderer.extract.canvas(symbolView)
	pixiApplication.destroy()

	return canvas
}

function createSafeIcon(safeView) {
	const pixiApplication = new Application()
	pixiApplication.renderer.plugins.accessibility.destroy()
	delete pixiApplication.renderer.plugins.accessibility
	safeView.update(0.035)
	if (safeView.substitutionEffectView) {
		safeView.substitutionEffectView.visible = false
	}

	const canvas = pixiApplication.renderer.extract.canvas(safeView)
	pixiApplication.destroy()

	return canvas
}

export async function createAtlas({assets, vfxLevel, characters = []}) {
    const canvasWidth = 2048
    const canvasHeight = 2048
    const canvas = createCanvas(canvasWidth, canvasHeight)
    const {context} = canvas

    const sourceMap = {
        frames: {},
        meta: {
            format: "RGBA8888",
            size: {
                w: canvasWidth,
                h: canvasHeight
            },
            scale: 1
        }
    }

	const symbolsViews = vfxLevel >= 0.15
	? [
		new SymbolClubsView(assets),
        new SymbolHeartsView(assets),
        new SymbolDiamondsView(assets),
        new SymbolSpadesView(assets),
        new SymbolBottleView(assets),
        new SymbolHatView(assets),
        new SymbolPistolView(assets),
        new SymbolWatchesView(assets),
        new SymbolWildView(assets),
        new SymbolScatterView(assets),
	]
	: [
		new Base2DSymbolView(1, assets),
        new Base2DSymbolView(2, assets),
        new Base2DSymbolView(3, assets),
        new Base2DSymbolView(4, assets),
        new Base2DSymbolView(5, assets),
        new Base2DSymbolView(6, assets),
        new Base2DSymbolView(7, assets),
        new Base2DSymbolView(8, assets),
        new Base2DSymbolView(9, assets),
        new Base2DSymbolView(10, assets),
	]

	const alphabetDescriptors = []
	const fontSize = 75
	let x = 0
	let y = 1400
	for (let i = 0; i < characters.length; i++) {
		const character = characters[i]
		alphabetDescriptors.push({
			name: character,
			image: createCharacter(character, fontSize),
			x,
			y
		})

		x += fontSize
		if(x + fontSize >= 2048) {
			x = 0
			y+= fontSize
		}
	}


    const descriptors = [
        {name: 'buttonFace', image: createButtonFace({}), x: 0, y: 0},
        {name: 'iconSpin', image: createIconSpin(), x: 200, y: 0},
        {name: 'iconSkip', image: createIconSkip(), x: 400, y: 0},
        {name: 'iconTurbo', image: createIconTurbo(), x: 600, y: 0},
        {name: 'iconAutoplay', image: createIconAutoplay(), x: 800, y: 0},
        {name: 'iconAutoplayActive', image: createIconAutoplay(false), x: 800, y: 200},
        {name: 'iconErase', image: createIconErase(), x: 1000, y: 200},
        {name: 'iconBuyFeature', image: createIconBuyFeature(), x: 1200, y: 200},
        {name: 'iconBonus', image: createIconBonus(), x: 1405, y: 205},
        {name: 'iconBonusFreeBet', image: createIconBonusFreeBet(), x: 1505, y: 205},
		{name: 'iconBonusHalfBet', image: createIconBonusHalfBet(), x: 1405, y: 305},
		{name: 'iconBonusDoubleUp', image: createIconBonusDoubleUp(), x: 1505, y: 305},
        {name: 'iconHome', image: createIconHome(), x: 1600, y: 200},
        {name: 'iconWatches', image: createIconWatches(), x: 1600, y: 400},


        // {name: 'buttonFaceGray', image: createButtonFace({channels: [[50, 0, 0], [255, 0, 0]]}), x: 1600, y: 800},
        {name: 'iconBet', image: createIconBet(), x: 1000, y: 0},
        {name: 'iconBetMore', image: createIconBetMore(), x: 1200, y: 0},
        {name: 'iconBetLess', image: createIconBetLess(), x: 1400, y: 0},
        {name: 'iconInfo', image: createIconInfo(), x: 1600, y: 0},
        {name: 'iconClose', image: createIconClose(), x: 1805, y: 5},
        {name: 'iconAudioMute', image: createIconMute(), x: 1905, y: 5},
        {name: 'iconAudioUnmute', image: createIconUnmute(), x: 1805, y: 105},
        {name: 'iconAudioLoading', image: createIconUnmuteLoading(), x: 1905, y: 105},
        {name: 'iconWallet', image: createIconWallet(), x: 0, y: 200},
        {name: 'iconFullScreen', image: createIconFullScreen(), x: 100, y: 200},
        {name: 'iconMinimizeScreen', image: createIconMinimizeScreen(), x: 100, y: 300},
        {name: 'iconWin', image: createIconWin(), x: 200, y: 200},
        {name: 'rectangle', image: createRectangle(), x: 305, y: 205, padding: 5}, 
        {name: 'buttonBarFace', image: createButtonBarFace(), x: 405, y: 203}, 

        {name: 'gradient', image: createGradient(), x: 1800, y: 200},
        {name: 'indicatorPanel', image: createIndicatorPanel(), x: 0, y: 400},
        {name: 'infoBarPanel', image: createIndicatorPanel(1200), x: 400, y: 400},

		{name: 'symbolClubs', image: createSymbolIcon(symbolsViews[0]), x: 5, y: 605, maximalWidth: 190, maximalHeight: 190},
        {name: 'symbolHearts', image: createSymbolIcon(symbolsViews[1]), x: 205, y: 605, maximalWidth: 190, maximalHeight: 190},
        {name: 'symbolDiamonds', image: createSymbolIcon(symbolsViews[2]), x: 405, y: 605, maximalWidth: 190, maximalHeight: 190},
        {name: 'symbolSpades', image: createSymbolIcon(symbolsViews[3]), x: 605, y: 605, maximalWidth: 190, maximalHeight: 190},
        {name: 'symbolBottle', image: createSymbolIcon(symbolsViews[4]), x: 805, y: 605, maximalWidth: 190, maximalHeight: 190},
        {name: 'symbolHat', image: createSymbolIcon(symbolsViews[5]), x: 1005, y: 605, maximalWidth: 190, maximalHeight: 190},
        {name: 'symbolPistol', image: createSymbolIcon(symbolsViews[6]), x: 1205, y: 605, maximalWidth: 190, maximalHeight: 190},
        {name: 'symbolWatches', image: createSymbolIcon(symbolsViews[7]), x: 1405, y: 605, maximalWidth: 190, maximalHeight: 190},
        {name: 'symbolWild', image: createSymbolIcon(symbolsViews[8]), x: 1605, y: 605, maximalWidth: 190, maximalHeight: 190},
        {name: 'symbolScatter', image: createSymbolIcon(symbolsViews[9]), x: 1805, y: 605, maximalWidth: 190, maximalHeight: 190},
        {name: 'safe', image: createSafeIcon(new SafeView(assets, vfxLevel)), x: 1805, y: 805, maximalWidth: 190, maximalHeight: 190},

		
		{name: 'bigRoundedRectangle', image: createBigRoundedRectangle(), x: 5, y: 805}, 

		{name: 'UICorner', image: createUICorner(), x: 1005, y: 805}, 
		{name: 'UIBorder', image: createUIBorder(), x: 1005, y: 905}, 
		{name: 'iconHomeBackground', image: createIconHomeBackground(), x: 605, y: 805}, 
		{name: 'iconTriangle', image: createIconTriangle(), x: 805, y: 805},
		...alphabetDescriptors
    ].forEach(({
        name, x, y, image,
		maximalWidth = image.width,
		maximalHeight = image.height,
		padding = 0
    }) => {
		let scaleX = 1
		if(image.width > maximalWidth) scaleX = maximalWidth / image.width
		let scaleY = 1
		if(image.height > maximalHeight) scaleY = maximalHeight / image.height
		const scale = Math.min(scaleX, scaleY)
		const width = image.width * scale
		const height = image.height * scale

		const finalWidth = width - padding * 2
		const finalHeight = height - padding * 2

        context.drawImage(image, x, y, width, height)
        sourceMap.frames[name] = {
            frame: {x: x + padding, y: y + padding, w: finalWidth, h: finalHeight},
            rotated: false,
            trimmed: false,
            spriteSourceSize: {x: padding, y: padding, w: finalWidth, h: finalHeight},
            sourceSize: {w: finalWidth, h: finalHeight},
            pivot: {x: 0.5, y: 0.5}
        }
    })

    const spriteSheet = new Spritesheet(
        new Texture(new BaseTexture(canvas)),
        sourceMap
    )



	//canvas.style.position = "absolute"
	//canvas.style.zIndex = 500000
	//var body = document.getElementsByTagName("body")[0]
	//body.appendChild(canvas)
	

    return spriteSheet.parse()
    
}

export function extractHighResolutionSymbols(assets) {
	const canvasWidth = 2048
    const canvasHeight = 2048
    const canvas = createCanvas(canvasWidth, canvasHeight)
    const {context} = canvas

    const sourceMap = {
        frames: {},
        meta: {
            format: "RGBA8888",
            size: {
                w: canvasWidth,
                h: canvasHeight
            },
            scale: 1
        }
    }

	let x = 0
	let y = 1

    const descriptors = [
		{name: 'symbolClubs', image: createSymbolIcon(new SymbolClubsView(assets))},
        {name: 'symbolHearts', image: createSymbolIcon(new SymbolHeartsView(assets))},
        {name: 'symbolDiamonds', image: createSymbolIcon(new SymbolDiamondsView(assets))},
        {name: 'symbolSpades', image: createSymbolIcon(new SymbolSpadesView(assets))},
        {name: 'symbolBottle', image: createSymbolIcon(new SymbolBottleView(assets))},
        {name: 'symbolHat', image: createSymbolIcon(new SymbolHatView(assets))},
        {name: 'symbolPistol', image: createSymbolIcon(new SymbolPistolView(assets))},
        {name: 'symbolWatches', image: createSymbolIcon(new SymbolWatchesView(assets))},
        {name: 'symbolWild', image: createSymbolIcon(new SymbolWildView(assets))},
        {name: 'symbolScatter', image: createSymbolIcon(new SymbolScatterView(assets))},
    ].forEach(({
        image,
    }, i) => {
		x++ 
		if(x > 5) {
			x = 1
			y++
		}
        context.drawImage(image, 256 * x, 256 * y)
    })


	canvas.style.position = "absolute"
	canvas.style.zIndex = 500000
	var body = document.getElementsByTagName("body")[0]
	body.appendChild(canvas)
}



