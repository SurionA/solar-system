import * as THREE from "three";

const AU = 149597871 * 1000;
const G = 6.67408 * Math.pow(10, -11);
const SCALE = 20 / AU;
const TIMESTEP = 3600 * 24;

export class Star {
  constructor({ name, x, y, r, m, velocityY = 0, texturePath }) {
    this.name = name;
    this.orbitMaxLength = Math.round(Math.abs(x * SCALE * 2 * Math.PI));
    this.X = x * AU;
    this.Y = y * AU;
    this.R = r * SCALE * 50000;
    this.m = m;
    this.distanceToSun = 0;
    this.velocityX = 0;
    this.velocityY = velocityY;
    this.orbit = [];

    this.sphere = new THREE.Mesh(
      new THREE.SphereGeometry(this.R, 100, 100),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(texturePath),
      })
    );
  }

  animate() {
    const X = this.X * SCALE;
    const Y = this.Y * SCALE;

    // console.log({ R: this.R, X, Y });
    this.sphere.position.x = X;
    this.sphere.position.y = Y;
    // this.sphere.position.z = 0;

    // console.log({ r_X: this.sphere.rotation.x, r_Y: this.sphere.rotation.y });
    this.sphere.rotation.x += 0.01;
    // this.sphere.rotation.y += 0.01;
  }
}

export class Planet extends Star {
  constructor(state) {
    super(state);
    this.R = state.r * SCALE * 2000000;
    this.sphere = new THREE.Mesh(
      new THREE.SphereGeometry(this.R, 100, 100),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(state.texturePath),
      })
    );
    // this.sphere.rotation.z = 4.5;
    // this.sphere.rotation.y = -0.005;
  }

  attraction(body) {
    const distX = body.X - this.X;
    const distY = body.Y - this.Y;
    const distance = Math.sqrt(distX ** 2 + distY ** 2);

    if (body instanceof Star) {
      this.distanceToSun = distance;
    }

    const force = (G * this.m * body.m) / distance ** 2;
    const theta = Math.atan2(distY, distX);
    const fx = Math.cos(theta) * force;
    const fy = Math.sin(theta) * force;

    return { fx, fy };
  }

  updatePosition(bodies) {
    const { fx, fy } = bodies.reduce(
      (acc, body) => {
        if (body !== this) {
          const { fx, fy } = this.attraction(body);
          acc.fx += fx;
          acc.fy += fy;
        }

        return acc;
      },
      { fx: 0, fy: 0 }
    );

    this.velocityX += (fx / this.m) * TIMESTEP;
    this.velocityY += (fy / this.m) * TIMESTEP;

    this.X += this.velocityX * TIMESTEP;
    this.Y += this.velocityY * TIMESTEP;
    // this.orbit.push([
    //   Math.floor(this.X * SCALE + this.centerX),
    //   Math.floor(this.Y * SCALE + this.centerY),
    // ]);
    // this.orbit = [...new Set(this.orbit.slice(this.orbitMaxLength * -1))];
  }
}
