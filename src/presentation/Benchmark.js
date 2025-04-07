import { Container, Graphics, Ticker } from "pixi.js"

const TARGET_DEVICE_TIME = 200

export async function getVFXLevel({
	pixiApplication,
	testVFXMultiplier = 1,
	testDelayMultiplier = 1
}) {
	await new Promise(resolve => { setTimeout(() => resolve(), 1000 * testDelayMultiplier) }) 

	const benchStartTimeStamp = performance.now()
	const container = pixiApplication.stage.addChild(new Container)
	

	for(let i = 0; i < 100_000; i++) {
		const graphics = container
			.addChild(new Graphics)
			.beginFill(0x00FF00, 0.5)
			.drawRect(0, 0, 1000, 1000)
			.endFill()

		graphics.destroy()
	}

	container.destroy()

	const elapsedTime = performance.now() - benchStartTimeStamp

	const vfxLevel = Math.min(1, (TARGET_DEVICE_TIME / elapsedTime) * testVFXMultiplier)

	document.title = Math.trunc(elapsedTime) + ' (' + vfxLevel.toFixed(2) + ')' 

	return vfxLevel
}
