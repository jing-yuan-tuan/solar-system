import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class ThreeJsService {
  createPlanet(size: number, texture: string, position: number, ring?: { innerRadius: number, outerRadius: number, texture: string }) {
    const textureLoader = new THREE.TextureLoader();
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
      map: textureLoader.load(texture),
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);
    if (ring) {
      const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        map: textureLoader.load(ring.texture),
        side: THREE.DoubleSide,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      obj.add(ringMesh);
      ringMesh.position.x = position;
      ringMesh.rotation.x = -0.5 * Math.PI;
    }
    mesh.position.x = position;
    return { mesh, obj };
  }
}
