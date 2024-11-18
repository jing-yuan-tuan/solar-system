import { Component, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  title = 'solar-system';

  async ngAfterViewInit(): Promise<void> {
    // Scene, Renderer, and Camera
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('#bg') as HTMLCanvasElement,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(-90, 140, 140);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x333333);
    const pointLight = new THREE.PointLight(0xffffff, 2, 1000);
    pointLight.position.set(0, 0, 0);
    pointLight.castShadow = true;
    scene.add(ambientLight, pointLight);

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();
    scene.background = new THREE.CubeTextureLoader().load([
      'assets/images/space.jpg',
      'assets/images/space.jpg',
      'assets/images/space.jpg',
      'assets/images/space.jpg',
      'assets/images/space.jpg',
      'assets/images/space.jpg',
    ]);

    // Add Stars
    const addStars = (scene: THREE.Scene) => {
      const starGeometry = new THREE.BufferGeometry();
      const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8,
      });

      const starVertices = [];
      for (let i = 0; i < 1000; i++) {
        const x = Math.random() * 2000 - 1000;
        const y = Math.random() * 2000 - 1000;
        const z = Math.random() * 2000 - 1000;
        starVertices.push(x, y, z);
      }

      starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);
    };
    addStars(scene);

    // Sun
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(16, 30, 30),
      new THREE.MeshBasicMaterial({ map: textureLoader.load('assets/images/sun.jpg') })
    );
    sun.castShadow = true;
    scene.add(sun);

    // Create Planets
    const createPlanet = (
      size: number,
      texture: string,
      position: number,
      ring?: { innerRadius: number; outerRadius: number; texture: string }
    ) => {
      const planet = new THREE.Mesh(
        new THREE.SphereGeometry(size, 30, 30),
        new THREE.MeshStandardMaterial({ map: textureLoader.load(texture) })
      );
      const planetGroup = new THREE.Object3D();
      planetGroup.add(planet);
      planet.position.x = position;

      if (ring) {
        const ringMesh = new THREE.Mesh(
          new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32),
          new THREE.MeshBasicMaterial({
            map: textureLoader.load(ring.texture),
            side: THREE.DoubleSide,
          })
        );
        ringMesh.position.x = position + 0.1;
        ringMesh.rotation.x = -0.5 * Math.PI;
        planetGroup.add(ringMesh);
      }

      scene.add(planetGroup);
      return { mesh: planet, group: planetGroup };
    };

    const mercury = createPlanet(3.2, 'assets/images/mercury.jpg', 28);
    const venus = createPlanet(5.8, 'assets/images/venus.jpg', 44);
    const earth = createPlanet(6, 'assets/images/earth.jpg', 62);
    const mars = createPlanet(4, 'assets/images/mars.jpg', 78);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);

    // Lazy Load dat.GUI
    if (typeof window !== 'undefined') {
      const { GUI } = await import('dat.gui');
      const gui = new GUI();
      const orbitSpeed = { speed: 0.04 };
      gui.add(orbitSpeed, 'speed', 0.01, 0.1).name('Orbit Speed');
    }

    // GSAP Animation
    const focusOnPlanet = (planetPosition: THREE.Vector3) => {
      gsap.to(camera.position, {
        x: planetPosition.x,
        y: planetPosition.y + 10,
        z: planetPosition.z + 20,
        duration: 2,
        onUpdate: () => camera.lookAt(planetPosition),
      });
    };
    focusOnPlanet(new THREE.Vector3(62, 0, 0)); // Focus on Earth initially

    // Animate Scene
    const animate = () => {
      sun.rotateY(0.004);
      mercury.group.rotateY(0.04);
      venus.group.rotateY(0.02);
      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);

    // Handle Resizing
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
}
