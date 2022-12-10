
import * as THREE from 'three'
import { KeyboardState } from './KeyboardState';


export class MovmentInputController{
    public camera: any;
    public KEYS: any;
    public previousKeys: any;
    public objects: any;
    public box: any;
    public target: any;
    public translation: any;
    public pressedKey: any;
    public clock: any;
    public keyboard: KeyboardState;



    //temp data
    walkDirection = new THREE.Vector3()

    //constant
   
    moveVelocity = 2


    constructor(objects: any, camera: any){
        this.objects = objects;  
        this.camera = camera;
        this.target = document;
        this.clock = new THREE.Clock();
        this.translation = new THREE.Vector3(0,1,0);
        this.KEYS = {"a": 65, "s": 83, "w": 'w', "d": 68};
        this.keyboard = new KeyboardState();
        this.initialize();
    }

    initialize() {
    }

    public update(){
        const velocity = 0.05;
        this.updateTranslation();
        this.updateCamera();
    }

    updateTranslation(){   
        const delta = this.clock.getDelta(); // seconds
        const movespeed = 2*delta; //speed
        const rotateAngle = Math.PI / 2 * delta; //rotation Angle

        if(this.keyboard.pressed("W")){
            this.objects.value.mesh.translateZ(-movespeed); 
        }
        if(this.keyboard.pressed("S")){
            this.objects.value.mesh.translateZ(movespeed);
        }
        if(this.keyboard.pressed("D")){
            this.objects.value.mesh.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
        }
        if(this.keyboard.pressed("A")){
            this.objects.value.mesh.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
        }
        if(this.keyboard.pressed("Q")){
            this.objects.value.mesh.translateY(movespeed)
        }
        if(this.keyboard.pressed("E")){
            this.objects.value.mesh.translateY(-movespeed)
        }
    }
    updateCamera(){
        let relativeCameraOffset = new THREE.Vector3(0,0.5,2);
        let cameraOffset = relativeCameraOffset.applyMatrix4( this.objects.value.mesh.matrixWorld);

        this.camera.value.camera.position.x = cameraOffset.x;
        this.camera.value.camera.position.y = cameraOffset.y;
        this.camera.value.camera.position.z = cameraOffset.z;
        
        this.camera.value.camera.lookAt( this.objects.value.mesh.position);
    }
}