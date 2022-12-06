
import * as THREE from 'three'
import { MovmentInput } from './MovementInput';


export class MovmentInputController{
    public KEYS: any;
    public objects: any;
    public box: any;
    public target: any;
    public translation: any;
    public pressedKey: any;
    public clock: any;
    public inputMovement: MovmentInput;


    //temp data
    walkDirection = new THREE.Vector3()

    //constant
   
    moveVelocity = 2


    constructor(objects: any){
        
        this.objects = objects;  
        this.target = document;
        this.clock = new THREE.Clock();
        this.inputMovement = new MovmentInput;
        this.translation = new THREE.Vector3(0,1,0);
        this.KEYS = {"a": 65, "s": 83, "w": 'w', "d": 68};
        this.initialize();
    }

    initialize() {
        this.target.addEventListener('keydown',(e: KeyboardEvent) => this.onKeyDown(e),false);
        this.target.addEventListener('keyup',(e: KeyboardEvent) => this.onKeyUp(e),false);  
    }

    public update(){
        const velocity = 0.05;
        this.updateTranslation();
    }

    updateTranslation(){   
        const delta = this.clock.getDelta(); // seconds
        const movespeed = 200*delta; //speed
        const rotateAngle = Math.PI / 2 * delta; //rotation Angle

        if(this.pressedKey == "w"){
            this.objects.value.position.z += 1;
            console.log(this.objects.value.position);
        }
        if(this.pressedKey == "s"){
            this.objects.value.position.z -=1;
            console.log(this.objects.value.position);
        }
        if(this.pressedKey == "d"){
            this.objects.value.rotation.y += rotateAngle;
            console.log(this.objects.value.position);
            console.log(this.objects.value.rotation)
        }
        if(this.pressedKey == "a"){
            this.objects.value.rotation.y -= rotateAngle;
            console.log(this.objects.value.position);
            console.log(this.objects.value.rotation)
        }
        
        
    }

    onKeyDown(e: KeyboardEvent) {
        console.log(e.key);
        this.pressedKey = e.key;
    }

    onKeyUp(e: KeyboardEvent) {
        console.log(e.key + "lifted");
        this.pressedKey = null;
    }

    private directionOffset(keysPressed: any) {
        var directionOffset = 0 // w

        if (keysPressed[this.KEYS.W]) {
            if (keysPressed[this.KEYS.A]) {
                directionOffset = Math.PI / 4 // w+a
            } else if (keysPressed[this.KEYS.D]) {
                directionOffset = - Math.PI / 4 // w+d
            }
        } else if (keysPressed[this.KEYS.S]) {
            if (keysPressed[this.KEYS.A]) {
                directionOffset = Math.PI / 4 + Math.PI / 2 // s+a
            } else if (keysPressed[this.KEYS.D]) {
                directionOffset = -Math.PI / 4 - Math.PI / 2 // s+d
            } else {
                directionOffset = Math.PI // s
            }
        } else if (keysPressed[this.KEYS.A]) {
            directionOffset = Math.PI / 2 // a
        } else if (keysPressed[this.KEYS.D]) {
            directionOffset = - Math.PI / 2 // d
        }

        return directionOffset
    }

    
}