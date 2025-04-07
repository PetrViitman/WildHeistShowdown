import { PopupSelectorView } from "../PopupSelectorView";
import { ButtonBarView } from "./ButtonBarView";

export class AccountSelectorView extends PopupSelectorView {
    constructor({assets, dictionary, audio}) {
        super({assets, dictionary})

        this.initButtonSwitch({assets, dictionary, audio})
        
    }

    initTexts(dictionary) {
        super.initTexts(dictionary)
        this.headerView.setText(dictionary.select_the_account)
        this.hintView.setText(dictionary.slide_to_select)
    }


    initReelSelector(assets) {
        super.initReelSelector(assets)
        this.reelSelectorView.scale.set(3)
        this.reelSelectorView.y = 225
        this.reelSelectorView.setEditable = () => {}
    }


    initButtonSwitch({assets, dictionary, audio}) {
        const view = new ButtonBarView({assets, text: dictionary.switch, audio})
        view.position.set(500, 1025)
        view.onClick = () => this.onAccountSwitchRequest?.(this.selectedAccount)
        this.buttonBarView = this.addChild(view)
    }

    setSelectableOptions(accounts) {
        if(this.accounts === accounts) return
        this.accounts = accounts



        const selectableOptions = accounts.map(account => {
            const {
                name,
                id,
                currency,
                currencyCode
            } = account
            
            return (name + '\n' + id + ' | ' + (currency?.code ?? currencyCode) ).toUpperCase()
        })

        super.setSelectableOptions(selectableOptions)
    }

    onOptionSelected(_, optionIndex) {
        const {accounts} = this
        const selectedAccount = accounts[optionIndex]
        this.selectedAccount = selectedAccount
        this.buttonBarView.setInteractive(!selectedAccount.isActive)
    }

    forceSelect(accounts = this.accounts) {
        let optionIndex = 0
        for(let i = 0; i < accounts.length; i++) {
            if(accounts[i].isActive) {
                optionIndex = i
                break
            }
        }

        this.reelSelectorView.forceSelect({optionIndex})
        this.buttonBarView.setInteractive(false)
    }
}