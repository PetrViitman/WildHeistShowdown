import { GUIView } from "../../GUIView";
import { ButtonBarView } from "../../selectors/accounts/ButtonBarView";

export class ButtonBonusView extends ButtonBarView {
    clickTimestamp
    clickX
    clickY



    setupInteractionListeners() {
        this.addEventListener('pointerup', ({global}) => {

            if(Date.now() - this.clickTimestamp > 250) return
            if(Math.abs(global.x - this.clickX) > 10) return
            if(Math.abs(global.y - this.clickY) > 10) return

            GUIView.isOverlayInteraction = true

            if(!this.isResponsive) return
            this.onClick()
            this.presentClick()
        })

        this.addEventListener('pointerdown', ({global}) => {
            this.clickTimestamp = Date.now()

            this.clickX = global.x
            this.clickY = global.y
            
            GUIView.isOverlayInteraction = false
        })
        this.addEventListener('pointerleave', () => { GUIView.isOverlayInteraction = false })
        this.addEventListener('pointercancel', () => { GUIView.isOverlayInteraction = false })
        this.addEventListener('pointerout', () => { GUIView.isOverlayInteraction = false })
        this.addEventListener('pointerupoutside', () => { GUIView.isOverlayInteraction = false })
    }
}