import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { DragControls } from "three/addons/controls/DragControls.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

////////////////////////////////////////////////////
////////////////////////DEFINES/////////////////////
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

let container;

let camera, scene, renderer, material, material2, mesh;
let orbitalControl, dragControl;

let enableSelection = false;

let keysPressed = {};
let flySpeed = 250;

let currentShape = "cube";

let geometryMap;

let settings;
let selectedObject = null;
let objectFolder = null;
let panel = null;
let gui = null;

const clock = new THREE.Clock();
const objects = [];
const mouse = new THREE.Vector2(),
  raycaster = new THREE.Raycaster();

const params = {
  asset: "Shroom",
};
//const assets = ["Shroom", "morph_test"];

const colorStart = 0xff0000; // red
const colorEnd = 0x0000ff; // blue

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

//////////////////////////////////////////////////
/////////////////////INIT/////////////////////////
init();
CreatePanel();

function init() {
  container = document.getElementById("app");
  //document.body.appendChild(container);

  //Camera Setup
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.set(100, 300, 300);

  //Scene Setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);
  scene.fog = new THREE.Fog(0xa0a0a0, 200, 2000);

  //Lights
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 5);
  hemiLight.position.set(0, 200, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 5);
  dirLight.position.set(0, 200, 100);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 180;
  dirLight.shadow.camera.bottom = -100;
  dirLight.shadow.camera.left = -120;
  dirLight.shadow.camera.right = 120;
  scene.add(dirLight);

  geometryMap = {
    cube: new THREE.BoxGeometry(100, 32, 32),
    sphere: new THREE.SphereGeometry(50, 32, 32),
    torus: new THREE.TorusGeometry(30, 8, 32, 100),
  };

  //Object Creation
  const geometry = new THREE.BoxGeometry(100, 32, 32);
  material = new THREE.MeshPhongMaterial({
    color: 0xedac58, // base color
    specular: 0x111111, // specular highlight color
    shininess: 50, // how shiny the surface is
    emissive: 0x000000, // optional glow
    flatShading: false, // set to true for flat shading style
  });

  //material2 = new THREE.MeshBasicMaterial();
  //material2.color.set(0xf4f57);

  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 100, 0);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  objects.push(mesh);

  //Grid
  const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
  grid.material.opacity = 0.2;
  grid.material.transparent = true;
  scene.add(grid);

  //Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setAnimationLoop(animate);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  container.appendChild(renderer.domElement);

  //Controls
  dragControl = new DragControls([...objects], camera, renderer.domElement);
  dragControl.rotateSpeed = 2;

  orbitalControl = new OrbitControls(camera, renderer.domElement);
  orbitalControl.enabled = true;

  dragControl.addEventListener("dragstart", () => {
    orbitalControl.enabled = false;
  });
  dragControl.addEventListener("dragend", () => {
    orbitalControl.enabled = true;
  });

  // add event listener to highlight dragged objects
  document.addEventListener("click", onClick);
  window.addEventListener("resize", onWindowResize);
  window.addEventListener("keydown", onKeyPress);
  window.addEventListener("keyup", onKeyRelease);

  window.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("app");
    if (!container) {
      console.error("Element with ID 'app' not found!");
      return;
    }

    console.log("Container width:", container.clientWidth);
    console.log("Container height:", container.clientHeight);
  });
}

//Update loop
function animate() {
  //Timers
  const delta = clock.getDelta();
  const time = clock.getElapsedTime(); // seconds
  const t = (Math.sin(time) + 1) / 2; // oscillate t between 0 and 1

  //Color Interpolation
  //material.color.setHex(interpolateHexColor(colorStart, colorEnd, t));

  //mesh.rotation.x += 0.01;
  //mesh.rotation.y += 0.01;

  //Control Updates
  if (orbitalControl.enabled) {
    orbitalControl.update();
  }

  handleFlyControls(delta);

  //Draw call
  renderer.render(scene, camera);
}

//////////////////////////////////////////////////////////////////
//////////////////////////API CALLS///////////////////////////////
function updateColor(color) {
  fetch("http://localhost:3000/shape/color", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ color: color }),
  });

  console.log("fetch call: Color");
}

function updateShape(type) {
  fetch("http://localhost:3000/shape/type", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: type }),
  });

  console.log("fetch call: Shape");
}

//////////////////////////////////////////////////////////////////
/////////////////////////////GUI//////////////////////////////////

function CreatePanel() {
  gui = new GUI({ width: 300 });

  // Create section
  objectFolder = gui.addFolder("Objects");
  objectFolder
    .add({ CreateObject: createObject }, "CreateObject")
    .name("Create Object");
  objectFolder.open();

  // Panel to show object-specific controls
  panel = gui.addFolder("Object Properties");
  panel.open();
  setSelectedObject(mesh);
}

function setSelectedObject(obj) {
  selectedObject = obj;

  // Clear existing panel
  if (panel) {
    panel.destroy(); // lil-gui supports this
  }

  panel = gui.addFolder("Object Properties");

  // Position controls
  panel.add(obj.position, "x", -100, 100).name("Position X");
  panel.add(obj.position, "y", -100, 100).name("Position Y");
  panel.add(obj.position, "z", -100, 100).name("Position Z");

  // Rotation controls
  panel.add(obj.rotation, "x", 0, Math.PI * 2).name("Rotation X");
  panel.add(obj.rotation, "y", 0, Math.PI * 2).name("Rotation Y");
  panel.add(obj.rotation, "z", 0, Math.PI * 2).name("Rotation Z");

  // Color (proxy getter/setter)
  if (obj.material && obj.material.color) {
    const colorProxy = {
      get color() {
        return `#${obj.material.color.getHexString()}`;
      },
      set color(val) {
        obj.material.color.set(val);
        updateColor(val);
      },
    };
    panel.addColor(colorProxy, "color").name("Color");
  }

  // Shape (if needed)
  const shapeProxy = {
    get shape() {
      return obj.userData.shape || "cube";
    },
    set shape(newShape) {
      // Replace geometry only
      const newGeometry = geometryMap[newShape];
      if (!newGeometry) return;

      const oldPos = obj.position.clone();
      const oldRot = obj.rotation.clone();

      const newMesh = new THREE.Mesh(newGeometry, obj.material.clone());
      newMesh.position.copy(oldPos);
      newMesh.rotation.copy(oldRot);
      newMesh.userData.shape = newShape;

      scene.remove(obj);
      scene.add(newMesh);

      const index = objects.indexOf(obj);
      if (index !== -1) objects[index] = newMesh;

      selectedObject = newMesh;
      setSelectedObject(newMesh); // rebind GUI
      updateShape(newShape);

      dragControl.dispose();
      dragControl = new DragControls(objects, camera, renderer.domElement);

      dragControl.addEventListener("dragstart", () => {
        orbitalControl.enabled = false;
      });
      dragControl.addEventListener("dragend", () => {
        orbitalControl.enabled = true;
      });
    },
  };
  panel.add(shapeProxy, "shape", Object.keys(geometryMap)).name("Shape");

  panel.open();
}
//////////////////////////////////////////////////////////////////
////////////////////////////HELPER////////////////////////////////

//Hexa Interpolation
function interpolateHexColor(from, to, t) {
  // Clamp t between 0 and 1
  t = Math.max(0, Math.min(1, t));

  // Parse hex colors to RGB
  const fromRGB = {
    r: (from >> 16) & 0xff,
    g: (from >> 8) & 0xff,
    b: from & 0xff,
  };

  const toRGB = {
    r: (to >> 16) & 0xff,
    g: (to >> 8) & 0xff,
    b: to & 0xff,
  };

  // Interpolate each channel
  const r = Math.round(fromRGB.r + (toRGB.r - fromRGB.r) * t);
  const g = Math.round(fromRGB.g + (toRGB.g - fromRGB.g) * t);
  const b = Math.round(fromRGB.b + (toRGB.b - fromRGB.b) * t);

  // Convert back to hex
  const hex = (r << 16) + (g << 8) + b;
  return hex;
}

//Flying controls handler
function handleFlyControls(delta) {
  const speed = flySpeed * delta;
  const direction = new THREE.Vector3();

  if (keysPressed["KeyW"]) direction.z -= 1;
  if (keysPressed["KeyS"]) direction.z += 1;
  if (keysPressed["KeyA"]) direction.x -= 1;
  if (keysPressed["KeyD"]) direction.x += 1;
  if (keysPressed["Space"]) direction.y += 1;
  if (keysPressed["ControlLeft"]) direction.y -= 1;
  if (keysPressed["ShiftLeft"]) flySpeed = 500;

  direction.applyQuaternion(camera.quaternion).normalize();
  camera.position.addScaledVector(direction, speed);
  orbitalControl.target.addScaledVector(direction, speed);
}

function createObject() {
  const geometry = geometryMap["cube"];
  const newMesh = new THREE.Mesh(geometry, material.clone());
  newMesh.position.set(Math.random() * 100 - 50, 10, Math.random() * 100 - 50);
  newMesh.castShadow = true;
  newMesh.receiveShadow = true;
  newMesh.userData.shape = "cube";
  scene.add(newMesh);
  objects.push(newMesh);

  setSelectedObject(newMesh);

  dragControl.dispose();
  dragControl = new DragControls([...objects], camera, renderer.domElement);
  dragControl.rotateSpeed = 2;

  dragControl.addEventListener("dragstart", () => {
    orbitalControl.enabled = false;
  });
  dragControl.addEventListener("dragend", () => {
    orbitalControl.enabled = true;
  });
}

//////////////////////////////////////////////////////////////////
//////////////////////////EVENTS//////////////////////////////////

//Click
function onClick(event) {
  event.preventDefault();

  if (enableSelection === true) {
    const draggableObjects = controls.objects;
    draggableObjects.length = 0;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersections = raycaster.intersectObjects(objects, true);

    if (intersections.length > 0) {
      const target = intersections[0].object;
      setSelectedObject(target);

      dragging = true;
      dragControl.enabled = true;
      orbitalControl.enabled = false;

      controls.transformGroup = true;
      draggableObjects.push(group);
    } else {
      dragging = false;
      dragControl.enabled = false;
      orbitalControl.enabled = true;
    }
  }
}

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

//Resize
function onWindowResize() {
  renderer.setSize(container.clientWidth, container.clientHeight);
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
}

//Key press
function onKeyPress(event) {
  keysPressed[event.code] = true;
}

//Key release
function onKeyRelease(event) {
  keysPressed[event.code] = false;
}
