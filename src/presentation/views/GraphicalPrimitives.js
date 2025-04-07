import { Graphics } from "pixi.js"

export function getGradient({
	width = 123,
	height = 123,
	color = 0xFFFFFF,
}) {
	const halfWidth = width / 2
	const alphaStep = 1 / halfWidth
	const graphics = new Graphics()

	let alpha = alphaStep

	for (let x = 0; x < halfWidth; x++) {
		alpha = Math.min(1, alpha + alphaStep)
		graphics
			.beginFill(color, alpha)
			.drawRect(x, 0, 1, height)
			.drawRect(width - x, 0, 1, height)
	}

	graphics.endFill()
	graphics.cacheAsBitmap = true
	graphics.pivot.set(halfWidth, height / 2)

	return graphics
}

export function getLightSpot({
	intensity = 0.1,
	radius = 123,
	color = 0xFFFFFF,
}) {
	const alphaStep = intensity / radius
	const graphics = new Graphics()

	let alpha = alphaStep

	for (let x = radius; x > 0; x--) {
		alpha = Math.min(1, alpha + alphaStep)
		graphics
			.beginFill(color, alpha)
			.drawCircle(0, 0, x)
	}

	graphics.endFill()
	graphics.cacheAsBitmap = true

	return graphics
}

export function getRectangleSpot({
	intensity = 0.1,
	width = 123,
	height = 123,
	color = 0xFFFFFF,
}) {
	const sideSize = Math.max(width, height)
	const alphaStep = intensity / sideSize
	const graphics = new Graphics()
	const scaleFactor = width / height
	let alpha = alphaStep

	for (let y = sideSize; y > 0; y--) {
		alpha = Math.min(1, alpha + alphaStep)
		graphics
			.beginFill(color, alpha)
			.drawRoundedRect(
				-(y / 2) * scaleFactor,
				-y / 2,
				y * scaleFactor,
				y,
			);
	}

	graphics.endFill()
	graphics.cacheAsBitmap = true

	return graphics
}

export function brightnessToHexColor(brightness) {
	if (Number.isNaN(brightness)) {
		return 0xFFFFFF
	}
	let hex = Math.trunc(255 * Math.min(1, Math.max(0, brightness))).toString(16)
	if (hex.length === 1) { hex = '0' + hex }

	return parseInt('0x' + hex + hex + hex, 16)
}

function chanelToHex(chanelValue) {
	let hex = Math.trunc(255 * Math.min(1, Math.max(0, chanelValue))).toString(16)
	if (hex.length === 1) hex = '0' + hex

	return hex + ''
}

export function toHexColor(red, green, blue) {
	const redHex = chanelToHex(red)
	const greenHex = chanelToHex(green)
	const blueHex = chanelToHex(blue)
	
	return parseInt('0x' + redHex + greenHex + blueHex, 16)
}

export function brightenColor(red, green, blue, brightness) {
	const redHex = chanelToHex(Math.min(1, red * brightness))
	const greenHex = chanelToHex(Math.min(1, green * brightness))
	const blueHex = chanelToHex(Math.min(1, blue * brightness))

	return parseInt('0x' + redHex + greenHex + blueHex, 16)
}

export function colorToColor(red1, green1, blue1, red2, green2, blue2, progress) {
	const deltaRed = red2 - red1
	const deltaGreen = green2 - green1
	const deltaBlue = blue2 - blue1

	return toHexColor(
		(red1 + deltaRed * progress) / 255,
		(green1 + deltaGreen * progress) / 255,
		(blue1 + deltaBlue * progress) / 255
	)
}

export function createCanvas(width = 400, height = 400) {
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	canvas.context = canvas.getContext("2d");
	canvas.style.width = (width / 2) + 'px'
	canvas.style.height = (height / 2) + 'px'


	canvas.style.position = "absolute";
	canvas.style.zIndex = 500000;
	var body = document.getElementsByTagName("body")[0];
	body.appendChild(canvas);

	return canvas
}

export function createButtonFaceTexture(width = 200, height = 200) {
	const canvas = createCanvas(width, height)
	canvas.style.position = 'absolute'
	canvas.style.left = '0px'

	const {context} = canvas

	let gradient = context.createLinearGradient(0,0, 0, height);
	gradient.addColorStop(0, '#FF0055');
	gradient.addColorStop(1, '#FF8844');

	context.fillStyle = gradient
	
	context.beginPath();
	context.roundRect(0, 0, width, height, width * 0.45);
	context.fill();
	context.stroke();


	context.closePath();
}

export function createSpinIconTexture(width = 175, height = 200) {
	const canvas = createCanvas(width, height)
	canvas.style.position = 'absolute'
	canvas.style.left = '100px'

	const {context} = canvas

	context.strokeStyle = "#FFFFFF";
	context.lineWidth = width * 0.15;


	context.beginPath();
	context.arc(width / 2, height / 2, width * 0.375, 0, Math.PI * 1.525, false)
	context.stroke();

	const path=new Path2D();
	context.fillStyle = "#FFFFFF";
	path.moveTo(width * 0.5, width * 0.05);
	path.lineTo(width * 0.5 + width * 0.2, width * 0.2);
	path.lineTo(width * 0.5, width * 0.35);
	context.fill(path);
}


export function createSkipIconTexture(width = 150, height = 150) {
	const canvas = createCanvas(width, height)
	canvas.style.position = 'absolute'
	canvas.style.left = '200px'

	const {context} = canvas

	const path=new Path2D();
	context.fillStyle = "#FFFFFF";
	path.moveTo(width * 0, 0);
	path.lineTo(width * 0.65, height * 0.5);
	path.lineTo(width * 0, height );
	context.fill(path);


	context.beginPath();
	context.fillRect(width * 0.8, 0, width * 0.2, height, width * 0.05)
	context.fill();
	context.closePath();
}

export function createTurboIconTexture(width = 150, height = 100) {
	const canvas = createCanvas(width, height)
	canvas.style.position = 'absolute'
	canvas.style.left = '300px'

	const {context} = canvas

	for(let i = 0; i < 2; i++ ) {
		const offsetX = i * 0.5
		const path=new Path2D();
		context.fillStyle = "#FFFFFF";
		path.moveTo(width * offsetX, 0);
		path.lineTo(width * (0.5 + offsetX), height * 0.5);
		path.lineTo(width * offsetX, height );
		context.fill(path);
	}

}

export function createAutoplayIconTexture(width = 175, height = 175) {
	const canvas = createCanvas(width, height)
	canvas.style.position = 'absolute'
	canvas.style.top = '100px'
	canvas.style.left = '0px'

	const {context} = canvas

	context.strokeStyle = "#FFFFFF";
	context.lineWidth = width * 0.11;


	context.beginPath();
	context.arc(width / 2, height / 2, width * 0.375, Math.PI * 0.675, Math.PI * 1.525, false)
	context.stroke();

	let path=new Path2D();
	context.fillStyle = "#FFFFFF";
	path.moveTo(width * 0.5, width * 0.05);
	path.lineTo(width * 0.5 + width * 0.1, width * 0.125);
	path.lineTo(width * 0.5, width * 0.2);
	context.fill(path);

	context.beginPath();
	context.arc(width / 2, height / 2, width * 0.375, -Math.PI * 0.3, Math.PI * 0.525, false)
	context.stroke();

	path=new Path2D();
	context.fillStyle = "#FFFFFF";
	path.moveTo(width * 0.5, width * 0.8);
	path.lineTo(width * 0.5 - width * 0.1, width * 0.875);
	path.lineTo(width * 0.5, width * 0.95);
	context.fill(path);


	path=new Path2D();
	context.fillStyle = "#FFFFFF";
	path.moveTo(width * 0.4, height * 0.3);
	path.lineTo(width * 0.7, height * 0.5);
	path.lineTo(width * 0.4, height * 0.7 );
	context.fill(path);

}

export function createBetIconTexture(width = 200, height = 200) {
	const canvas = createCanvas(width, height)
	canvas.style.position = 'absolute'
	canvas.style.top = '100px'
	canvas.style.left = '100px'

	const {context} = canvas
	const offsetY = height * 0.1

	for(let y = 1; y < 3; y++) {
		context.lineWidth = width * 0.125;
		context.strokeStyle = "#FFFFFF";
		context.beginPath();
		context.ellipse(width * 0.5, height * 0.2 * (y + 1) + offsetY, width * 0.425, height * 0.225, 0, -Math.PI * 0.2, Math.PI * 1.2);
		context.stroke();
	}

	context.lineWidth = width * 0.125;
	context.strokeStyle = "#FFFFFF";
	context.beginPath();
	context.ellipse(width * 0.5, height * 0.2 + offsetY, width * 0.425, height * 0.225, 0, 0, Math.PI * 2);
	context.stroke();
	context.fillStyle = "#FFFFFF";
	context.fill();
}


export function createBetMoreIconTexture(width = 200, height = 200) {
	const canvas = createCanvas(width, height)
	canvas.style.position = 'absolute'
	canvas.style.top = '100px'
	canvas.style.left = '200px'

	const {context} = canvas
	const offsetY = height * 0.1

	context.strokeStyle = "#FFFFFF";
	context.lineWidth = width * 0.1;


	context.beginPath();
	context.arc(width / 2, height / 2, width * 0.4, 0, Math.PI * 2, false)
	context.stroke();

	context.beginPath();
	context.fillStyle = "#FFFFFF";
	context.roundRect(width * 0.4, height * 0.25, width * 0.2, height * 0.5, width * 0.025)

	context.save();
	context.translate(width, 0);
	context.rotate(Math.PI / 2);
	context.roundRect(width * 0.4, height * 0.25, width * 0.2, height * 0.5, width * 0.025)
	context.restore()

	context.fill();
	context.closePath();
}

export function createBetLessIconTexture(width = 200, height = 200) {
	const canvas = createCanvas(width, height)
	canvas.style.position = 'absolute'
	canvas.style.top = '100px'
	canvas.style.left = '300px'

	const {context} = canvas
	const offsetY = height * 0.1

	context.strokeStyle = "#FFFFFF";
	context.lineWidth = width * 0.1;


	context.beginPath();
	context.arc(width / 2, height / 2, width * 0.4, 0, Math.PI * 2, false)
	context.stroke();

	context.beginPath();
	context.fillStyle = "#FFFFFF";
	context.roundRect(width * 0.25, height * 0.4, width * 0.5, height * 0.2, width * 0.025)


	context.fill();
	context.closePath();
}


export function createInfoIconTexture(width = 200, height = 200) {
	const canvas = createCanvas(width, height)
	canvas.style.position = 'absolute'
	canvas.style.top = '200px'
	canvas.style.left = '0px'

	const {context} = canvas
	const offsetY = height * 0.1

	context.strokeStyle = "#FFFFFF";
	context.lineWidth = width * 0.1;


	context.beginPath();
	context.arc(width / 2, height / 2, width * 0.4, 0, Math.PI * 2, false)
	context.stroke();

	context.beginPath();
	context.fillStyle = "#FFFFFF";
	context.roundRect(width * 0.4, height * 0.25, width * 0.2, height * 0.15, width * 0.025)
	context.roundRect(width * 0.4, height * 0.45, width * 0.2, height * 0.3, width * 0.025)


	context.fill();
	context.closePath();
}


export function createCloseIconTexture(width = 200, height = 200) {
	const canvas = createCanvas(width, height)
	canvas.style.position = 'absolute'
	canvas.style.top = '200px'
	canvas.style.left = '100px'

	const {context} = canvas
	const offsetY = height * 0.1

	context.strokeStyle = "#FFFFFF";
	context.lineWidth = width * 0.1;
	context.translate(width / 2, -height * 0.2);
	context.rotate(Math.PI / 4);


	context.beginPath();
	context.arc(width / 2, height / 2, width * 0.4, 0, Math.PI * 2, false)
	context.stroke();

	context.beginPath();
	context.fillStyle = "#FFFFFF";
	context.roundRect(width * 0.425, height * 0.2, width * 0.15, height * 0.6, width * 0.025)

	context.save();
	context.translate(width, 0);
	context.rotate(Math.PI / 2);
	context.roundRect(width * 0.425, height * 0.2, width * 0.15, height * 0.6, width * 0.025)
	context.restore()

	context.fill();
	context.closePath();
}