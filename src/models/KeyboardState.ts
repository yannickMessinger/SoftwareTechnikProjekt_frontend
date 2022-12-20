export class KeyboardState {
    public keyCodes: any
    public modifiers: any
    public ALIAS: any

    constructor() {
        this.keyCodes = {}
        this.modifiers = {}
        this.ALIAS = {}
        this.init()
    }

    init() {
        // bind keyEvents
        document.addEventListener("keydown", this.onKeyDown.bind(this), false)
        document.addEventListener("keyup", this.onKeyUp.bind(this), false)

        this.modifiers = ["shift", "ctrl", "alt", "meta"]
        this.ALIAS = {
            left: 37,
            up: 38,
            right: 39,
            down: 40,
            space: 32,
            pageup: 33,
            pagedown: 34,
            tab: 9,
        }
    }

    pressed(keyDesc: any): boolean {
        let keys = keyDesc.split("+")
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i]
            var pressed
            if (this.modifiers.indexOf(key) !== -1) {
                pressed = this.modifiers[key]
            } else if (Object.keys(this.ALIAS).indexOf(key) != -1) {
                pressed = this.keyCodes[this.ALIAS[key]]
            } else {
                pressed = this.keyCodes[key.toUpperCase().charCodeAt(0)]
            }
            if (!pressed) return false
        }
        return true
    }

    onKeyChange(event: KeyboardEvent, pressed: boolean) {
        let keyCode = event.keyCode
        this.keyCodes[keyCode] = pressed

        // update this.modifiers
        this.modifiers["shift"] = event.shiftKey
        this.modifiers["ctrl"] = event.ctrlKey
        this.modifiers["alt"] = event.altKey
        this.modifiers["meta"] = event.metaKey
    }

    onKeyDown(event: KeyboardEvent) {
        this.onKeyChange(event, true)
    }

    onKeyUp(event: KeyboardEvent) {
        this.onKeyChange(event, false)
    }

    destroy() {
        // unbind keyEvents
        document.removeEventListener("keydown", this.onKeyDown, false)
        document.removeEventListener("keyup", this.onKeyUp, false)
    }
}
