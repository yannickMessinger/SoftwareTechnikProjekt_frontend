import * as THREE from 'https://cdn.skypack.dev/three@0.136';

export class InputController {
	public target: any;
	public current: any;
	public previous: any;
  public camera: any;
  public keys: any;
  public previousKeys: any;
  public rotation: any;
  public translation: any;
  public phi: any;
  public theta: any;
  public timesCalled: any;

  constructor(camera: any) {
    this.target = document;
    this.camera = camera;
    this.rotation = new THREE.Quaternion();
    this.translation = new THREE.Vector3(0, 0, 0);
    this.keys = {}
    this.previousKeys = {}
    this.phi = 0;
    this.theta = 0;
    console.log(this.camera);
    this.initialize_();    
  }

  initialize_() {
    this.current = {
      leftButton: false,
      rightButton: false,
      mouseXDelta: 0,
      mouseYDelta: 0,
      mouseX: 0,
      mouseY: 0,
    };
    this.previous = null;
    this.target.addEventListener('mousedown', (e: MouseEvent) => this.onMouseDown(e), false);
    this.target.addEventListener('mouseup', (e: MouseEvent) => this.onMouseUp(e), false);
    this.target.addEventListener('mousemove', (e: MouseEvent) => this.onMouseMove(e), false);
    this.target.addEventListener('keydown', (e: KeyboardEvent) => this.onKeyDown(e), false);
    this.target.addEventListener('keyup', (e: KeyboardEvent) => this.onKeyUp(e), false);
  }

  onMouseMove(e: MouseEvent) {
    this.current.mouseX = e.pageX - window.innerWidth / 2;
    this.current.mouseY = e.pageY - window.innerHeight / 2;

    if (this.previous === null) {
      this.previous = {...this.current};
    }

    this.current.mouseXDelta = this.current.mouseX - this.previous.mouseX;
    this.current.mouseYDelta = this.current.mouseY - this.previous.mouseY;
  }

  onMouseDown(e: MouseEvent) {
    this.onMouseMove(e);
    switch (e.button) {
      case 0: {
        this.current.leftButton = true;
        break;
      }
      case 2: {
        this.current.rightButton = true;
        break;
      }
    }
  }

  onMouseUp(e: MouseEvent) {
    this.onMouseMove(e);
    switch (e.button) {
      case 0: {
        this.current.leftButton = false;
        break;
      }
      case 2: {
        this.current.rightButton = false;
        break;
      }
    }
  }

  onKeyDown(e: KeyboardEvent) {
    this.keys[e.key] = true;
    this.updateTranslation();
  }

  onKeyUp(e: KeyboardEvent) {
    this.keys[e.key] = false;
    this.updateTranslation();
  }

  key(key: any) {
    return !!this.keys[key];
  }

  updateRotation() {
    const xh = this.current.mouseXDelta / window.innerWidth;
    const yh = this.current.mouseYDelta / window.innerHeight;
    this.phi += -xh * 0.08;
    this.theta = this.clamp(this.theta + -yh * 0.08, -Math.PI / 3, Math.PI / 3);
    const qx = new THREE.Quaternion();
    qx.setFromAxisAngle(new THREE.Vector3(0,1,0), this.phi);
    const qz = new THREE.Quaternion();
    qz.setFromAxisAngle(new THREE.Vector3(1,0,0), this.theta);
    const q = new THREE.Quaternion();
    q.multiply(qx);
    q.multiply(qz);
    this.rotation.copy(q);
    this.camera.value.camera.quaternion.copy(this.rotation);
  }

  updateTranslation() {
    const forwardVelocity = (this.key("w") ? 1 : 0) + (this.key("s") ? -1 : 0);
    const strafeVelocity = (this.key("a") ? 1 : 0) + (this.key("d") ? -1 : 0);

    const qx = new THREE.Quaternion();
    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi);

    const forward = new THREE.Vector3(0,0,-1)
    forward.applyQuaternion(qx);
    forward.multiplyScalar(forwardVelocity * 0.01 * 2);

    const left = new THREE.Vector3(-1,0,0)
    left.applyQuaternion(qx);
    left.multiplyScalar(strafeVelocity * 0.01 * 2);

    this.translation.add(forward);
    this.translation.add(left);

    this.camera.value.camera.position.copy(this.translation);
  }

  clamp(x:any, a:any, b:any) {
    return Math.min(Math.max(x, a), b);
  }

};