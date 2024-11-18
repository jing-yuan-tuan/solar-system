declare module 'three/examples/jsm/controls/OrbitControls' {
  import { Camera } from 'three';
  import { EventDispatcher } from 'three/src/core/EventDispatcher';
  import { Vector3 } from 'three/src/math/Vector3';

  class OrbitControls extends EventDispatcher {
    constructor(object: Camera, domElement?: HTMLElement);

    object: Camera;
    domElement: HTMLElement | Document;

    // API
    enabled: boolean;
    target: Vector3;

    minDistance: number;
    maxDistance: number;

    minZoom: number;
    maxZoom: number;

    minPolarAngle: number;
    maxPolarAngle: number;

    minAzimuthAngle: number;
    maxAzimuthAngle: number;

    enableDamping: boolean;
    dampingFactor: number;

    enableZoom: boolean;
    zoomSpeed: number;

    enableRotate: boolean;
    rotateSpeed: number;

    enablePan: boolean;
    panSpeed: number;
    screenSpacePanning: boolean;
    keyPanSpeed: number;

    autoRotate: boolean;
    autoRotateSpeed: number;

    enableKeys: boolean;
    keys: { LEFT: number; UP: number; RIGHT: number; BOTTOM: number };
    mouseButtons: { LEFT: MOUSE; MIDDLE: MOUSE; RIGHT: MOUSE };
    touches: { ONE: TOUCH; TWO: TOUCH };

    update(): boolean;

    listenToKeyEvents(domElement: HTMLElement): void;
    saveState(): void;
    reset(): void;
    dispose(): void;
    getPolarAngle(): number;
    getAzimuthalAngle(): number;
    getDistance(): number;

    // EventDispatcher mixins
    addEventListener(type: string, listener: (event: any) => void): void;
    hasEventListener(type: string, listener: (event: any) => void): boolean;
    removeEventListener(type: string, listener: (event: any) => void): void;
    dispatchEvent(event: { type: string; target: any }): void;
  }

  export { OrbitControls };
  export default OrbitControls;
}
