import { Component, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  title = 'solar-system';

  async ngAfterViewInit(): Promise<void> {
    // Renderer, Scene, and Camera
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('#bg') as HTMLCanvasElement,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000020); // Dark blue background

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 100, 200);
    camera.lookAt(0, 0, 0);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    const pointLight = new THREE.PointLight(0xffffff, 2);
    pointLight.position.set(100, 100, 100);
    pointLight.castShadow = true;
    scene.add(ambientLight, pointLight);

    // Texture Loader with Error Handling
    const textureLoader = new THREE.TextureLoader();
    const loadTexture = (path: string): THREE.Texture => {
      return textureLoader.load(
        path,
        undefined,
        undefined,
        (err) => console.error(`Error loading texture: ${path}`, err)
      );
    };

    // Sun
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(16, 30, 30),
      new THREE.MeshBasicMaterial({ map: loadTexture('images/sun.jpg') })
    );
    scene.add(sun);

    // Create Planets Function
    const createPlanet = (
      size: number,
      texture: string,
      position: number,
      ring?: { innerRadius: number; outerRadius: number; texture: string }
    ) => {
      const planetMaterial = new THREE.MeshStandardMaterial({ map: loadTexture(texture) });
      const planet = new THREE.Mesh(new THREE.SphereGeometry(size, 30, 30), planetMaterial);

      const planetGroup = new THREE.Object3D();
      planetGroup.add(planet);
      planet.position.x = position;

      if (ring) {
        const ringMesh = new THREE.Mesh(
          new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32),
          new THREE.MeshBasicMaterial({
            map: loadTexture(ring.texture),
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

    // Planets with Textures
    const mercury = createPlanet(3.2, 'images/mercury.jpg', 28);
    const venus = createPlanet(5.8, 'images/venus.jpg', 44);
    const earth = createPlanet(6, 'images/earth.jpg', 62);
    const mars = createPlanet(4, 'images/mars.jpg', 78);
    const jupiter = createPlanet(12, 'images/jupiter.jpg', 100);
    const saturn = createPlanet(10, 'images/saturn.jpg', 138, {
      innerRadius: 10,
      outerRadius: 20,
      texture: '/images/saturn ring.png',
    });
    const uranus = createPlanet(7, 'images/uranus.jpg', 176, {
      innerRadius: 7,
      outerRadius: 12,
      texture: 'images/uranus ring.png',
    });
    const neptune = createPlanet(7, 'images/neptune.jpg', 200);
    const pluto = createPlanet(2.8, 'images/pluto.jpg', 216);

    // Add Stars
    const addStars = () => {
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
    addStars();

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate Sun and Planets
      sun.rotation.y += 0.004;
      mercury.group.rotateY(0.02);
      venus.group.rotateY(0.01);
      earth.group.rotateY(0.008);
      mars.group.rotateY(0.005);
      jupiter.group.rotateY(0.002);
      saturn.group.rotateY(0.0015);
      uranus.group.rotateY(0.001);
      neptune.group.rotateY(0.0009);
      pluto.group.rotateY(0.0008);

      renderer.render(scene, camera);
    };
    animate();

    // Handle Resizing
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
}
