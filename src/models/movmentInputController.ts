
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


    //temp data
    walkDirection = new THREE.Vector3()

    //constant
   
    moveVelocity = 2


    constructor(objects: any){
        
        this.objects = objects;  
        this.target = document;
        this.clock = new THREE.Clock();
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
        const movespeed = 2*delta; //speed
        const rotateAngle = Math.PI / 2 * delta; //rotation Angle

        if(this.pressedKey == "w"){
            this.objects.value.mesh.translateZ(-movespeed); 
        }
        if(this.pressedKey == "s"){
            this.objects.value.mesh.translateZ(movespeed);
        }
        if(this.pressedKey == "d"){
            this.objects.value.mesh.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
        }
        if(this.pressedKey == "a"){
            this.objects.value.mesh.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
        }
        
        
    }

    onKeyDown(e: KeyboardEvent) {
        this.pressedKey = e.key;
    }

    onKeyUp(e: KeyboardEvent) {
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