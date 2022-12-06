import * as THREE from 'three'

export class MovmentInput{
    public target: any;
    public keys: any;
;

    constructor() {
        this.target = document;
        this.initialize();    
    }

    initialize() {
        this.keys = {};

        this.target.addEventListener('keydown',(e: KeyboardEvent) => this.onKeyDown(e),false);
        this.target.addEventListener('keyup',(e: KeyboardEvent) => this.onKeyUp(e),false);  
    }

    onKeyDown(e: KeyboardEvent) {
        
        this.keys[e.key] = true;
        //console.log(e.key);
        //console.log(this.keys[e.key]);
    }

    onKeyUp(e: KeyboardEvent) {
        this.keys[e.key] = false;
        //console.log(this.keys[e.key]);
    }

    key(key: any){
        //console.log(key); 
        return !!this.keys[key];
    }

}