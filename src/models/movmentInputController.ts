
import * as THREE from 'three'
import { MovmentInput } from './MovementInput';


export class MovmentInputController{
    public KEYS: any;
    public objects: any;
    public box: any;
    public target: any;
    public translation: any;
    public inputMovement: MovmentInput;


    //temp data
    walkDirection = new THREE.Vector3()

    //constant
   
    moveVelocity = 2


    constructor(objects: any){
        
        this.objects = objects;
        
        this.target = document;
        this.inputMovement = new MovmentInput;
        this.translation = new THREE.Vector3(0,1,0);
        this.KEYS = {"a": 65, "s": 83, "w": 87, "d": 68};
    }

    

    public update(){
        const velocity = 0.05;
        this.updateTranslation();
    }

    updateTranslation(){     
        if(this.inputMovement.key(this.KEYS.W) == this.KEYS.W){
            this.objects.value.position.z +=1;
            console.log(this.objects.value.position);
        }
        
        
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