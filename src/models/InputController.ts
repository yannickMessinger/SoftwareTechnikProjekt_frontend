export class InputController {
    public target: any
    public current: any
    public previous: any
    public keys: any
    public previousKeys: any

    constructor() {
        this.target = document
        this.initialize()
    }

    initialize() {
        this.current = {
            leftButton: false,
            rightButton: false,
            mouseXDelta: 0,
            mouseYDelta: 0,
            mouseX: 0,
            mouseY: 0,
        }
        this.previous = null
        this.keys = {}
        this.previousKeys = {}
        this.target.addEventListener(
            "mousedown",
            (e: MouseEvent) => this.onMouseDown(e),
            false
        )
        this.target.addEventListener(
            "mousemove",
            (e: MouseEvent) => this.onMouseMove(e),
            false
        )
        this.target.addEventListener(
            "mouseup",
            (e: MouseEvent) => this.onMouseUp(e),
            false
        )
        this.target.addEventListener(
            "keydown",
            (e: KeyboardEvent) => this.onKeyDown(e),
            false
        )
        this.target.addEventListener(
            "keyup",
            (e: KeyboardEvent) => this.onKeyUp(e),
            false
        )
    }

    onMouseMove(e: MouseEvent) {
        this.current.mouseX = e.pageX - window.innerWidth / 2
        this.current.mouseY = e.pageY - window.innerHeight / 2

        if (this.previous === null) {
            this.previous = { ...this.current }
        }
        this.current.mouseXDelta = this.current.mouseX - this.previous.mouseX
        this.current.mouseYDelta = this.current.mouseY - this.previous.mouseY
    }

    onMouseDown(e: MouseEvent) {
        this.onMouseMove(e)

        switch (e.button) {
            case 0: {
                this.current.leftButton = true
            }
            case 2: {
                this.current.rightButton = true
            }
        }
    }

    onMouseUp(e: MouseEvent) {
        this.onMouseMove(e)
        switch (e.button) {
            case 0: {
                this.current.leftButton = false
                break
            }
            case 2: {
                this.current.rightButton = false
                break
            }
        }
    }

    onKeyDown(e: KeyboardEvent) {
        this.keys[e.keyCode] = true
    }

    onKeyUp(e: KeyboardEvent) {
        this.keys[e.keyCode] = false
    }

    key(keyCode: any) {
        return !!this.keys[keyCode]
    }

    isReady() {
        return this.previous !== null
    }

    update() {
        if (this.previous !== null) {
            this.current.mouseXDelta =
                this.current.mouseX - this.previous.mouseX
            this.current.mouseYDelta =
                this.current.mouseY - this.previous.mouseY

            this.previous = { ...this.current }
        }
    }

    clamp(x: any, a: any, b: any) {
        return Math.min(Math.max(x, a), b)
    }
}
