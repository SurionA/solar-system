import "./style.css";
import * as THREE from "three";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Star, Planet } from "./Planet.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const sun = new Star({
  name: "sun",
  x: 0,
  y: 0,
  r: 696340,
  m: 1.98892 * Math.pow(10, 30),
  texturePath: "./textures/sunmap.jpg",
});

const planets = [
  {
    name: "mercury",
    x: 0.387,
    y: 0,
    r: 2439.7,
    m: 3.3 * Math.pow(10, 23),
    velocityY: 47.362 * 1000,
    texturePath: "./textures/mercurymap.jpg",
  },
  {
    name: "venus",
    x: 0.723,
    y: 0,
    r: 6051.8,
    m: 4.8685 * Math.pow(10, 24),
    velocityY: 35.02 * 1000,
    texturePath: "./textures/venusmap.jpg",
  },
  {
    name: "earth",
    x: -1,
    y: 0,
    r: 6371,
    m: 5.9742 * Math.pow(10, 24),
    velocityY: 29.78 * 1000,
    texturePath: "./textures/earthmap.jpg",
  },
  {
    name: "mars",
    x: -1.54,
    y: 0,
    r: 3389.5,
    m: 6.39 * Math.pow(10, 23),
    velocityY: 24.077 * 1000,
    texturePath: "./textures/marsmap.jpg",
  },
  {
    name: "jupiter",
    x: -5.2,
    y: 0,
    r: 69911,
    m: 1.8986 * Math.pow(10, 27),
    velocityY: 13.07 * 1000,
    texturePath: "./textures/jupitermap.jpg",
  },
  {
    name: "saturn",
    x: -9.58,
    y: 0,
    r: 58232,
    m: 5.6846 * Math.pow(10, 26),
    velocityY: 9.69 * 1000,
    texturePath: "./textures/saturnmap.jpg",
  },
].map((planet) => new Planet(planet));

scene.add(sun.sphere);
planets.forEach((planet) => scene.add(planet.sphere));

camera.position.z = 100;

const animate = function () {
  requestAnimationFrame(animate);
  sun.animate();
  planets.forEach((planet) => {
    planet.updatePosition([sun, ...planets]);

    planet.animate();
  });

  renderer.render(scene, camera);
};

animate();
