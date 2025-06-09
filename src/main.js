import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as core from "@theatre/core";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { VignetteShader } from "three/examples/jsm/shaders/VignetteShader.js";
// import studio from "@theatre/studio";
import { LoadingManager } from "three";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
const uiContainer = document.getElementById("ui-panels");
// 
document.getElementById("app-container").innerHTML = `
<!-- Loading screen -->
<div id="bg-loader">
  <div id="matterContainer"></div>
  <div id="loadingword">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#ffffff"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM5 12C5 15.866 8.13401 19 12 19V12H19C19 8.13401 15.866 5 12 5V12H5Z"
          fill="#000000"
        ></path>
      </g></svg
    ><span>Loading</span>
  </div>
  <div id="loader">
    <div class="digit" id="d1">
      <div class="nums">
        0<br />1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9
      </div>
    </div>
    <div class="digit" id="d2">
      <div class="nums">
        0<br />1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9
      </div>
    </div>
    <div class="digit" id="d3">
      <div class="nums">
        0<br />1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9
      </div>
    </div>
  </div>
</div>

<!-- Rotate warning -->
<div id="rotate-warning" class="rotate-warning">
  <div class="phone-icon">
    <svg
      fill="#ffffff"
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 401.856 401.856"
      xml:space="preserve"
      stroke="#ffffff"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <g>
          <path
            d="M276.085,114.713c-5.326-0.698-7.535,2.075-8.233,3.318c-0.698,1.224-1.979,4.561,1.349,8.807l17.336,22.29 c4.055,4.064,10.558,4.466,15.119,0.937l21.2-16.361c2.868-2.19,3.604-4.533,3.71-6.091c0.229-3.682-2.649-6.77-7.354-7.382 l-10.404-1.329c-1.243-0.182-2.553-1.683-2.63-3.069c-1.568-30.17-14.238-58.609-35.688-80.067 c-16.103-16.104-36.347-27.339-58.541-32.532c-15.807-3.72-31.996-4.236-48.109-1.521c-30.438,5.154-57.576,21.315-76.395,45.508 c-1.578,2.037-2.792,4.905,1.052,8.75c0.708,0.708,1.645,1.54,2.697,2.362c2.343,1.817,7.765,5.996,11.207,1.587 c16.323-20.98,39.13-34.549,64.681-38.862c13.502-2.286,27.1-1.865,40.43,1.243c18.628,4.37,35.63,13.817,49.142,27.339 c17.576,17.566,28.19,40.842,29.893,65.522l-1.022,0.765L276.085,114.713z"
          ></path>
          <path
            d="M359.355,207.604H206.967v26.67h134.104c3.003,0,5.432,2.438,5.432,5.441v108.229c0,3.002-2.429,5.44-5.432,5.44H206.967 v26.689h152.397c10.931,0,19.775-8.864,19.775-19.766V227.36C379.14,216.439,370.285,207.604,359.355,207.604z"
          ></path>
          <path
            d="M175.42,401.856c10.911,0,19.766-8.855,19.766-19.775V128.483c0-10.93-8.865-19.775-19.766-19.775H42.473 c-10.93,0-19.756,8.855-19.756,19.775v253.598c0,10.93,8.836,19.775,19.756,19.775H175.42z M108.617,389.779 c-6.885,0-12.45-5.565-12.45-12.441c0-6.875,5.565-12.45,12.45-12.45c6.866,0,12.441,5.575,12.441,12.45 C121.048,384.214,115.473,389.779,108.617,389.779z M49.377,146.767c0-3.002,2.438-5.432,5.441-5.432h108.228 c3.003,0,5.441,2.429,5.441,5.432v195.247c0,3.003-2.438,5.432-5.441,5.432H54.828c-3.002,0-5.441-2.429-5.441-5.432V146.767 H49.377z"
          ></path>
        </g>
      </g>
    </svg>
  </div>
  <p>Rotate your phone for a better experience</p>
</div>

<!-- Start screen -->
<div id="start-screen">
  <p>Tap to start</p>
</div>

<!-- Main content -->
<div id="main-content">
  <div id="css3-hero">
    <h1>hey im adam</h1>
    <div class="section-content"></div>
  </div>
  <section id="hero">
    <div id="hero_car"><div class="car_cont"></div></div>
  </section>
</div>
`;
// TODO
import { createPhysicsWorld } from "./Matter.js";
const { addRandomShape, cleanupMatter } = createPhysicsWorld();
createPhysicsWorld(document.getElementById("matterContainer"));

document.getElementById("ui-container").innerHTML = `
      <div class="edit-wrapper">
        <div class="edit-card">
          <span class="heading" id="EDIT_TOGGLE"><span>EDIT</span><svg fill="#ffffff" viewBox="0 0 24 24" id="settings-alt-2" data-name="Flat Color" xmlns="http://www.w3.org/2000/svg" class="icon flat-color"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path id="primary" d="M21.42,21.42h0a2,2,0,0,1-2.82,0l-7.18-7.18A6.48,6.48,0,0,1,2,9.05a7.07,7.07,0,0,1,.1-1.85A1,1,0,0,1,3.8,6.74L7,10l2.49-.5L10,7,6.74,3.8A1,1,0,0,1,7.2,2.12,7.07,7.07,0,0,1,9.05,2a6.48,6.48,0,0,1,5.19,9.4l7.18,7.18A2,2,0,0,1,21.42,21.42Z" style="fill: #ffffff;"></path></g></svg></span>
        </div>
        <div class="sub-buttons">
          <div class="sub-button" data-target="car-ui"><span>CAR</span></div>
          <div class="sub-button" data-target="camera-ui">
            <span>CAMERA</span>
          </div>
          <div class="sub-button" data-target="enviroment-ui">
            <span>ENV</span>
          </div>
          <div class="sub-button" data-target="ABOUT-ui">
            <span>ABOUT</span>
          </div>
        </div>
      </div>
`;

uiContainer.innerHTML = `
      <div id="car-ui" class="pane hidden"></div>
      <div id="camera-ui" class="pane hidden"></div>
      <div id="enviroment-ui" class="pane hidden"></div>
      <div id="ABOUT-ui" class="pane hidden"></div>
`;

const panes = document.querySelectorAll(".pane");
const carUI = document.getElementById("car-ui");
const cameraUI = document.getElementById("camera-ui");
const enviromentUI = document.getElementById("enviroment-ui");
const ABOUT_ui = document.getElementById("ABOUT-ui");
const car_subButton = document.getElementById("car-subbutton");
const EDIT_TOGGLE = document.getElementById("EDIT_TOGGLE");
const buttons = document.querySelectorAll(".sub-button");
const cameraControlsUI = document.getElementById("cameraPositions");
cameraControlsUI.innerHTML = `
  <label>
    <input type="radio" name="camera" value="1" data-camera="1"/>
    <span>1</span>
  </label>
  <label>
    <input type="radio" name="camera" value="2" data-camera="2" />
    <span>2</span>
  </label>
  <label>
    <input type="radio" name="camera" value="3" data-camera="3" />
    <span>3</span>
  </label>
`;
const EDIT_UI = document.getElementById("ui-container");
uiContainer.classList.add("hidden"); // hide all panes initially
EDIT_TOGGLE.addEventListener("click", () => {
  EDIT_TOGGLE.innerHTML = `<span>EDIT</span><svg fill="#ffffff" viewBox="0 0 24 24" id="settings-alt-2" data-name="Flat Color" xmlns="http://www.w3.org/2000/svg" class="icon flat-color"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path id="primary" d="M21.42,21.42h0a2,2,0,0,1-2.82,0l-7.18-7.18A6.48,6.48,0,0,1,2,9.05a7.07,7.07,0,0,1,.1-1.85A1,1,0,0,1,3.8,6.74L7,10l2.49-.5L10,7,6.74,3.8A1,1,0,0,1,7.2,2.12,7.07,7.07,0,0,1,9.05,2a6.48,6.48,0,0,1,5.19,9.4l7.18,7.18A2,2,0,0,1,21.42,21.42Z" style="fill: #ffffff;"></path></g></svg>`;
  panes.forEach((p) => p.classList.add("hidden")); // hide all
  uiContainer.classList.toggle("hidden"); // toggle UI container
  cameraControlsUI.style.pointerEvents = "auto";
  cameraControlsUI.style.opacity = "1";
});

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.getAttribute("data-target");
    panes.forEach((p) => p.classList.add("hidden")); // hide all
    document.getElementById(targetId).classList.remove("hidden"); // show target
    document.getElementById(targetId).style.zIndex = "20";
    if (targetId == "ABOUT-ui") {
      cameraControlsUI.style.pointerEvents = "none";
      cameraControlsUI.style.opacity = "0";
    } else {
      cameraControlsUI.style.pointerEvents = "auto";
      cameraControlsUI.style.opacity = "1";
    }
    EDIT_TOGGLE.innerHTML = `X`;
    uiContainer.classList.remove("hidden"); // ensure UI container is visible
  });
});
const hideUIB = document.getElementById("hide-ui");

document.getElementById("hide-ui-checkbox").addEventListener("change", (e) => {
  if (e.target.checked) {
    cameraControlsUI.style.pointerEvents = "none";
    cameraControlsUI.style.opacity = "0";
    EDIT_UI.style.opacity = "0";
    EDIT_UI.style.pointerEvents = "none";
    hideUIB.style.opacity = "0.5";
    uiContainer.style.opacity = "0.5";
    uiContainer.style.pointerEvents = "none";
    document.querySelectorAll(".pane").forEach((p) => {

      p.style.pointerEvents = "none";
    });

  } else {
    cameraControlsUI.style.pointerEvents = "auto";
    cameraControlsUI.style.opacity = "1";
    EDIT_UI.style.opacity = "1";
    EDIT_UI.style.pointerEvents = "auto";
    hideUIB.style.opacity = "1";
    uiContainer.style.opacity = "1";
    uiContainer.style.pointerEvents = "auto";
    document.querySelectorAll(".pane").forEach((p) => {

      p.style.pointerEvents = "auto";
    });
  }
});

// colors
document.querySelectorAll(".pane").forEach((p) => p.classList.add("hidden"));
const colorOptions = [
  // Row 1: Sleek & Stealthy (Black/Grey variants)
  "#000000",
  "#121212",
  "#1a1a1a",
  "#2e2e2e",
  "#3f3f3f",

  // Row 2: Cold Metals (Gunmetal to Silver Blue)
  "#63666A",
  "#4a4a4a",
  "#5a5a68",
  "#6b7985",
  "#8c9aa8",

  // Row 3: Bloodline Reds (Sport, deep, moody reds)
  "#4b0000",
  "#520017",
  "#700f0f",
  "#8c1a1a",
  "#a83232",

  // Row 4: Royal & Luxury Purples
  "#2c003e",
  "#3e005c",
  "#5a008f",
  "#8202a8",
  "#b31cd6",

  // Row 5: Neon & Cyberpunk Vibes
  "#00fff7",
  "#0ff0b3",
  "#08fdd8",
  "#8ef9f3",
  "#cbf9ff",

  // Row 6: Golds & Yellows
  "#887a00",
  "#a89000",
  "#c2a700",
  "#e5c100",
  "#fff700",

  // Row 7: Greens (Dark forest to neon toxic)
  "#00290f",
  "#014d2c",
  "#016e3a",
  "#00a859",
  "#00ff77",

  // Row 8: Blues (Elegant to tech)
  "#00002c",
  "#000047",
  "#002b80",
  "#0059b3",
  "#0095ff",
];

const colorContainer = document.createElement("div");
colorContainer.id = "color-swatches";
colorContainer.innerHTML = `
  ${colorOptions
    .map(
      (color) => `
    <label class="label" style="background:${color}; box-shadow: 0 0 4px ${color};">
      <input type="radio" name="color_car" value="${color}" />
    </label>
  `
    )
    .join("")}
`;
carUI.appendChild(colorContainer);
//stickerChoiceContainer ui

const stickerTypeContainer = document.createElement("div");
stickerTypeContainer.id = "sticker-ui-mat";
carUI.appendChild(stickerTypeContainer);

const stickerChoiceContainer = document.createElement("div");
stickerChoiceContainer.id = "sticker-ui";
stickerChoiceContainer.innerHTML = `
  <span data-sticker="none">❌</span>
  ${Array.from(
    { length: 12 },
    (_, i) => `<span data-sticker="${i + 1}">${i + 1}</span>`
  ).join("")}
`;
carUI.appendChild(stickerChoiceContainer);

stickerTypeContainer.innerHTML = `<div id="sticker-ui-mat">
  <label class="ui-mat-label">
    <input type="checkbox" value="metalness" />
    <span>Metalness</span>
    <input type="range" class="intensity" min="-80" max="80" step="10" value="20" />
  </label>

  <label class="ui-mat-label">
    <input type="checkbox" value="ao" />
    <span>AO</span>
    <input type="range" class="intensity" min="-20" max="50" step="10" value="3" />
  </label>

  <label class="ui-mat-label">
    <input type="checkbox" value="normal" checked  />
    <span>Normal</span>
    <input type="range" class="intensity" min="-20" max="20" step="1" value="0.5" />
  </label>

  <label class="ui-mat-label">
    <input type="checkbox" value="map"/>
    <span>Map</span>
    <input type="range" class="intensity" min="0" max="1" step="0.01" value="1" />
  </label>

  <label class="ui-mat-label">
    <input type="checkbox" value="bump" />
    <span>Bump</span>
    <input type="range" class="intensity" min="-20" max="20" step="1" value="0.1" />
  </label>
</div>

`;

const envControls = document.createElement("div");
envControls.id = "envControls";
enviromentUI.appendChild(envControls);

envControls.innerHTML = `
  <label class="ui-mat-label2">
    <span>Tone Mapping</span>
    <input type="range" class="intensity" id="toneMappingSlider" min="2" max="7" step="0.1" value="5" />
  </label>

  <label class="ui-mat-label2">
    <span>Bloom Intensity</span>
    <input type="range" class="intensity" id="bloomIntensitySlider" min="-1" max="3" step="0.1" value="1" />
  </label>
<label class="ui-mat-label2">
    <span>Bloom Glow</span>
    <input type="range" class="intensity" id="bloomGlowSlider" min="0" max="0.9" step="0.1" value="0.1" />
  </label>
  <label class="ui-mat-label2">
    <span>Car Env Intensity</span>
    <input type="range" class="intensity" id="CarEnvIntensity" min="10" max="40" step="1" value="30" />
  </label>
`;
const SoundControls = document.createElement("div");
SoundControls.id = "SoundControls";
enviromentUI.appendChild(SoundControls);

SoundControls.innerHTML = `
  <label class="ui-sound-label">
    <span>No Son Of Mine</span>
    <input type="radio" name="song" class="ui-sound-radio" value="Foo Fighters - No Son Of Mine.mp3"/>
  </label>

  <label class="ui-sound-label">
    <span>10 Day Miracle Challenge</span>
    <input type="radio" name="song" class="ui-sound-radio" value="Death Valley Girls - 10 Day Miracle Challenge.mp3" checked />
  </label>

  <label class="ui-sound-label">
    <span>No Skips (ft. Ralph Real)</span>
    <input type="radio" name="song" class="ui-sound-radio" value="Oddisee - No Skips (ft. Ralph Real).mp3"/>
  </label>

  <label class="ui-sound-label">
    <span>Muted</span>
    <input type="radio" name="song" class="ui-sound-radio" value="Muted"/>
  </label>
`;

const toneSlider = document.getElementById("toneMappingSlider");
const bloomSlider = document.getElementById("bloomIntensitySlider");
const bloomGlowSlider = document.getElementById("bloomGlowSlider");
const carEnvIntensitySlider = document.getElementById("CarEnvIntensity");

// cameraSettings
const cameraSettings = {
  lerp: 0.1,
  shake: false,
  blur: false,
};

const cameraUIContainer = document.createElement("div");
cameraUIContainer.id = "camera-ui-panel";
cameraUI.appendChild(cameraUIContainer);

// Insert UI content
cameraUIContainer.innerHTML = `
  <label class="ui-mat-label">
    <span>Lerp</span>
    <input type="range" min="0" max="1" step="0.01" value="${cameraSettings.lerp}" class="camera-lerp-range" />
  </label>
  <label class="ui-mat-label"><input type="checkbox" value="shake" /> Camera Shake</label>
  <label class="ui-mat-label"><input type="checkbox" value="blur" /> Blur</label>
  <label class="ui-mat-label"><input type="checkbox" value="bloom" /> Bloom</label>
`;

// sticker transform
const stickerTransformUI = document.createElement("div");
stickerTransformUI.id = "sticker-transform-ui";
carUI.appendChild(stickerTransformUI);

stickerTransformUI.innerHTML = `
  <label class="ui-mat-labelform">
    <span>Rotation</span>
    <input type="range" id="rotationSlider" min="0" max="${
      Math.PI * 2
    }" step="0.01" value="${Math.PI / 4}" />
  </label>
`;

const rotationSlider = document.getElementById("rotationSlider");

ABOUT_ui.innerHTML = `
<div id="about-wrapper">
  <div class="about-content">
    <h1>About Me</h1>
    <h2>Adam Rhmni</h2>
    <p>
      I’m a 3D web developer and creative technologist with 1.5+ years of experience in real-time graphics. My work blends code and design to craft cinematic, interactive web scenes using:
    </p>
    <ul>
      <li>Three.js, React Three Fiber (R3F), GLSL, Next.js</li>
      <li>Rapier.js for physics, Theater.js for animation control</li>
      <li>Yuka.js for AI behaviors, Postprocessing effects (Bloom, FXAA)</li>
      <li>Custom shaders, scene logic, level design, optimization</li>
      <li>responsive 3D UI/UX</li>
      <li>Focused on performance, detail, and real-time immersion</li>
    </ul>
    <p>
      All visuals, effects, physics, and logic are handcrafted with precision. I use open standards and bleeding-edge tools to bring stories and concepts to life on the web.
    </p>
    <h3>Terms & Usage</h3>
    <p>
      All models and audio used are sourced legally from free libraries such as Sketchfab and Freesound, under appropriate licenses. This site is for showcasing work only. All code, shaders, and assets written or customized by me are private and protected.
    </p>
    <p>
      No part of this site may be copied or reused. Stealing or reproducing any code, design, or asset without permission is strictly forbidden and may lead to legal consequences.
    </p>
    <h3>Socials</h3>
    <ul>
      <li>Instagram: <a href="https://www.instagram.com/adam_rhmnii" target="_blank">@adam_rhmnii</a></li>
      <li>GitHub: <a href="https://github.com/adamRhmni" target="_blank">@adamRhmni</a></li>
    </ul>
    <footer>
      © 2025 Adam Rhmni — All rights reserved.<br />
      All models, sounds, and libraries used are under legal licenses.<br />
      No part of this project may be redistributed.
    </footer>
  </div>
</div>
`;

// studio.initialize();

// const projTHEATER = core.getProject("BMW", { state: State });
const toggle = document.getElementById("hero_toggle");

// const sheet = projTHEATER.sheet("car");
function lockLandscape() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen().then(() => {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock("landscape").catch(console.warn);
      }
    });
  }
}

const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xfff);
// scene.fog = new THREE.FogExp2(0xc8d0d0, 0.0095);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const camera_2 = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});

const maxpexilratio = Math.min(window.devicePixelRatio, 2);
renderer.setPixelRatio(maxpexilratio);
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 8;
camera.position.y = 3;
camera.position.x = 3;
controls.enableDamping = true;
controls.dampingFactor = 0.1;
// controls.enabled = false;
controls.enablePan = false;
controls.minDistance = 1;

// loading
const loadermanager = new LoadingManager();
const loadermanagerforsongs = new LoadingManager();
let loadingComplete = false;
let appStarted = false;
// Create LoadingManager

const bgLoader = document.getElementById("bg-loader");
const startScreen = document.getElementById("start-screen");
const rotateWarning = document.getElementById("rotate-warning");
const mainContent = document.getElementById("main-content");
let mainAnimationStart = null;
// Set up loading counter animation
loadermanager.onProgress = (_, loaded, total) => {
  let pct = String(Math.floor((loaded / total) * 100)).padStart(3, "0");
  pct.split("").forEach((n, i) => {
    document.querySelector(
      `#d${i + 1} .nums`
    ).style.transform = `translateY(-${n}em)`;
  });
};

// When loading completes
loadermanager.onLoad = () => {
  loadingComplete = true;

  gsap.to(bgLoader,{
    duration: 1.3,
    opacity: 0,
    scale:2,
    ease:"power2.out",
    onComplete: () => {
      bgLoader.style.display = "none";
    }

  })
  // cleanupMatter();
  // After fade out, check orientation and show appropriate screen
  setTimeout(() => {
    checkOrientation();

    // If orientation is correct, show start screen
    if (!isPortrait()) {
      startScreen.style.display = "flex";
      setTimeout(() => {
        startScreen.style.opacity = "1";
      }, 100);
    }
  }, 500);
};

// Check if device is in portrait mode
function isPortrait() {
  return window.innerHeight > window.innerWidth;
}

// Check orientation and show/hide appropriate screens
function checkOrientation() {
  if (loadingComplete) {
    if (isPortrait()) {
      rotateWarning.style.display = "flex";
      startScreen.style.display = "none";
    } else {
      rotateWarning.style.display = "none";

      // If app hasn't started yet, show start screen
      if (!appStarted) {
        startScreen.style.display = "flex";
      } else {
        startScreen.style.display = "none";
      }
    }
  }
}

// Start the application when clicked

const listener = new THREE.AudioListener();
camera.add(listener);
// camera_2.add(listener);

const audioLoader = new THREE.AudioLoader(loadermanager);
const songsLoader = new THREE.AudioLoader(loadermanagerforsongs);
const entersound = new THREE.PositionalAudio(listener);
const bgsound = new THREE.PositionalAudio(listener);
const UIsond = new THREE.PositionalAudio(listener);
const UI2sond = new THREE.PositionalAudio(listener);

audioLoader.load("sound/UI2.flac", (buffer) => {
  UI2sond.setBuffer(buffer);
  UI2sond.setLoop(false);
  UI2sond.setVolume(0.8);
  UI2sond.setRefDistance(20); // for 3D spatial effect
});
camera.add(UI2sond);
audioLoader.load("sound/ui1.flac", (buffer) => {
  UIsond.setBuffer(buffer);
  UIsond.setLoop(false);
  UIsond.setVolume(0.8);
  UIsond.setRefDistance(20); // for 3D spatial effect
});
camera.add(UIsond);

audioLoader.load(
  "sound/songs/Death Valley Girls - 10 Day Miracle Challenge.mp3",
  (buffer) => {
    bgsound.setBuffer(buffer);
    bgsound.setLoop(true);
    bgsound.setVolume(0.8);
    bgsound.setRefDistance(20); // for 3D spatial effect
  }
);
camera.add(bgsound);
audioLoader.load("sound/hart.flac", (buffer) => {
  entersound.setBuffer(buffer);
  entersound.setLoop(false);
  entersound.setVolume(1);
  entersound.setRefDistance(20); // for 3D spatial effect
});

renderer.setSize(window.innerWidth, window.innerHeight);
const modelcont = document.querySelector(".car_cont");

modelcont.appendChild(renderer.domElement);

// make renderer for effects
const renderScene = new RenderPass(scene, camera_2);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);

const bloomParams = {
  intensity: 1,
  radius: 0.1,
  threshold: 0.1,
};

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  bloomParams.intensity,
  bloomParams.radius,
  bloomParams.threshold
);

//TODO

//
composer.addPass(bloomPass);

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 5;

renderer.physicallyCorrectLights = true;
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const vignettePass = new ShaderPass(VignetteShader);
vignettePass.uniforms["offset"].value = 1.5;
vignettePass.uniforms["darkness"].value = 1.5;
composer.addPass(vignettePass);
// envControls

toneSlider?.addEventListener("input", (e) => {
  UIsond.play();
  const val = parseFloat(e.target.value);
  // console.log("Tone Mapping:", val);
  renderer.toneMappingExposure = val;
});

// Bloom Intensity
bloomSlider?.addEventListener("input", (e) => {
  UIsond.play();
  const val = parseFloat(e.target.value);
  // console.log("Bloom Intensity:", val);
  bloomPass.strength = val;
});
bloomGlowSlider?.addEventListener("input", (e) => {
  UIsond.play();
  const val = parseFloat(e.target.value);
  // console.log("Bloom Intensity:", val);
  bloomPass.radius = val;
});
stickerTypeContainer.querySelectorAll(".ui-mat-label").forEach((label) => {
  const checkbox = label.querySelector('input[type="checkbox"]');
  const slider2 = label.querySelector('input[type="range"]');

  checkbox.addEventListener("change", () => {
    UI2sond.play();
    slider2.disabled = !checkbox.checked;
  });

  slider2.addEventListener("input", () => {
    UI2sond.play();

    // Update intensity per map type...
    // console.log(type, value);
  });
});

cameraUIContainer.querySelector(".camera-lerp-range").oninput = (e) => {
  cameraSettings.lerp = parseFloat(e.target.value);
  // console.log("Camera lerp value changed to:", cameraSettings.lerp);
  // You handle actual camera lerping logic
  controls.dampingFactor = cameraSettings.lerp;
};
cameraUIContainer
  .querySelectorAll("input[type='checkbox']")
  .forEach((input) => {
    input.addEventListener("change", (e) => {
      UI2sond.play();
      cameraSettings[e.target.value] = e.target.checked;
      // Apply or remove camera effect here (shake, blur, bloom)
    });
  });

pmremGenerator.compileEquirectangularShader();

const helmetTexture = new THREE.TextureLoader(loadermanager).load(
  "brokenGlass.png"
);

const helmetMaterial = new THREE.MeshBasicMaterial({
  map: helmetTexture,
  transparent: true,
  depthWrite: false, // important so it doesn't block everything
});

const helmetGeometry = new THREE.PlaneGeometry(2, 2); // Adjust size as needed
const helmetOverlay = new THREE.Mesh(helmetGeometry, helmetMaterial);

// Add to camera, so it moves with it
camera_2.add(helmetOverlay);

// Position the overlay slightly in front of the camera
helmetOverlay.position.set(0, 0, -0.5); // negative Z = in front

camera_2.position.set(-720, 229, 2);
function blink(timer) {
  document.getElementById("eyelidTop").style.transform = "translateY(0)";
  document.getElementById("eyelidBottom").style.transform = "translateY(0)";

  setTimeout(() => {
    document.getElementById("eyelidTop").style.transform = "translateY(-100%)";
    document.getElementById("eyelidBottom").style.transform =
      "translateY(100%)";
  }, timer); // Blink open after 150ms
}
function Longblink() {
  document.getElementById("eyelidTop").style.transform = "translateY(0)";
  document.getElementById("eyelidBottom").style.transform = "translateY(0)";

  setTimeout(() => {
    renderScene.camera = camera;
  }, 150); // Blink open after 150ms
  setTimeout(() => {
    document.getElementById("eyelidTop").style.transform = "translateY(-100%)";
    document.getElementById("eyelidBottom").style.transform =
      "translateY(100%)";
  }, 1000); // Blink open after 150ms
}

// Example: blink every few seconds
let cleanintervalBlink = setInterval(blink(150), 4000);

// Function to stop blinking
function stopBlinking() {
  clearInterval(cleanintervalBlink);
}
let doesastronautMeshFollow = false;
let astronautMesh;
let AstronautMixer;
new GLTFLoader(loadermanager).load("/astronaut.glb", (gltf) => {
  astronautMesh = gltf.scene;
  astronautMesh.scale.set(1, 1, 1);
  astronautMesh.position.set(-720, 227, -8);
  astronautMesh.rotation.set(0, 1.5, 0);
  astronautMesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  AstronautMixer = new THREE.AnimationMixer(astronautMesh);
  const clips = gltf.animations;
  const clip = clips[0];
  const action = AstronautMixer.clipAction(clip);
  action.reset().setLoop(THREE.LoopRepeat).play();

  scene.add(astronautMesh);
});

const target1 = new THREE.Vector3(-724, 233, -50);
const target2 = new THREE.Vector3(700, 233, 80);
const target3 = new THREE.Vector3(0, 4, 0);
const target4 = new THREE.Vector3(0, 4, 0);
let duration1 = 5.5;
let duration2 = 4.5;
let duration3 = 3;
let duration4 = 4;

// Add target vectors to Theatre for live control
// const target1Obj = sheet.object("Target1", {
//   x: target1.x,
//   y: target1.y,
//   z: target1.z,
// });
// target1Obj.onValuesChange((values) => {
//   target1.set(values.x, values.y, values.z);
// });

// const target2Obj = sheet.object("Target2", {
//   x: target2.x,
//   y: target2.y,
//   z: target2.z,
// });
// target2Obj.onValuesChange((values) => {
//   target2.set(values.x, values.y, values.z);
// });

// const target3Obj = sheet.object("Target3", {
//   x: target3.x,
//   y: target3.y,
//   z: target3.z,
// });
// target3Obj.onValuesChange((values) => {
//   target3.set(values.x, values.y, values.z);
// });

// const target4Obj = sheet.object("Target4", {
//   x: target4.x,
//   y: target4.y,
//   z: target4.z,
// });
// target4Obj.onValuesChange((values) => {
//   target4.set(values.x, values.y, values.z);
// });

// // Add durations to Theatre for live control
// const durationsObj = sheet.object("AnimationDurations", {
//   duration1: duration1,
//   duration2: duration2,
//   duration3: duration3,
//   duration4: duration4,
// });
// durationsObj.onValuesChange((values) => {
//   duration1 = values.duration1;
//   duration2 = values.duration2;
//   duration3 = values.duration3;
//   duration4 = values.duration4;
// });

//
cameraControlsUI.style.pointerEvents = "none";
cameraControlsUI.style.opacity = "0";
EDIT_UI.style.opacity = "0";
EDIT_UI.style.pointerEvents = "none";
hideUIB.style.opacity = "0";

hideUIB.style.pointerEvents = "none";

function UI_HIDE(param) {
  if (param) {
    cameraControlsUI.style.pointerEvents = "none";
    cameraControlsUI.style.opacity = "0";
    EDIT_UI.style.opacity = "0";
    EDIT_UI.style.pointerEvents = "none";
  } else {
    cameraControlsUI.style.pointerEvents = "auto";
    cameraControlsUI.style.opacity = "1";
    EDIT_UI.style.opacity = "1";
    EDIT_UI.style.pointerEvents = "auto";
  }
}
UI_HIDE(true);
function startSpaceMan() {
  // A — from current look direction
  // 1. Start position

  const tweenObj = { t: 0 };

  // Step 1 - First target
  const start1 = new THREE.Vector3()
    .copy(camera_2.getWorldDirection(new THREE.Vector3()))
    .add(camera_2.position);

  gsap.to(tweenObj, {
    t: 1,
    duration: 6,
    ease: "power2.inOut",
    onStart: () => {
      let cleanintervalBlink = setInterval(blink(150), 3000);
      // bgsound.play();
      entersound.play();
    },
    onUpdate: () => {
      const interp = new THREE.Vector3().lerpVectors(
        start1,
        target1,
        tweenObj.t
      );
      camera_2.lookAt(interp);
    },
    onComplete: () => {
      camera_2.lookAt(target1);

      // Step 2 - Second target
      const start2 = new THREE.Vector3()
        .copy(camera_2.getWorldDirection(new THREE.Vector3()))
        .add(camera_2.position);

      tweenObj.t = 0;

      gsap.to(tweenObj, {
        t: 1,
        duration: 4,
        ease: "power2.inOut",
        onUpdate: () => {
          const interp = new THREE.Vector3().lerpVectors(
            start2,
            target2,
            tweenObj.t
          );
          camera_2.lookAt(interp);
        },
        onComplete: () => {
          camera_2.lookAt(target2);

          // Step 3 - Third target
          const start3 = new THREE.Vector3()
            .copy(camera_2.getWorldDirection(new THREE.Vector3()))
            .add(camera_2.position);

          tweenObj.t = 0;

          gsap.to(tweenObj, {
            t: 1,
            duration: 4,
            ease: "power2.inOut",
            onUpdate: () => {
              const interp = new THREE.Vector3().lerpVectors(
                start3,
                target3,
                tweenObj.t
              );
              camera_2.lookAt(interp);
            },
            onComplete: () => {
              doesastronautMeshFollow = true;
              camera_2.lookAt(target3);

              // Step 4 - Final target (long one)
              const start4 = new THREE.Vector3()
                .copy(camera_2.getWorldDirection(new THREE.Vector3()))
                .add(camera_2.position);

              tweenObj.t = 0;

              gsap.to(tweenObj, {
                t: 1,
                duration: 6,
                ease: "power2.inOut",
                onUpdate: () => {
                  const interp = new THREE.Vector3().lerpVectors(
                    start4,
                    target4,
                    tweenObj.t
                  );
                  camera_2.lookAt(interp);
                },
                onComplete: () => {
                  entersound.play();
                  camera_2.lookAt(target4);
                  // bgsound.play()
                  stopBlinking();
                  Longblink();

                  vignettePass.uniforms["offset"].value = 0;
                  vignettePass.uniforms["darkness"].value = 0;

                  bgsound.play();
                  UI_HIDE(false);
                  hideUIB.style.opacity = "0.8";

                  hideUIB.style.pointerEvents = "auto";
                },
              });
            },
          });
        },
      });
    },
  });
}

function startApp() {
  if (loadingComplete && !isPortrait()) {
    appStarted = true;
    startScreen.style.opacity = "0";
    cleanupMatter();
    startSpaceMan();

    setTimeout(() => {
      startScreen.style.display = "none";

      if (true) {
        controls.enabled = true;

        setTimeout(() => {}, 500);
      }
      // });

      mainAnimationStart = true;
    }, 300);

    // Remove event listener to prevent repeat
    document.removeEventListener("click", startApp);
  }
}

// Event listeners
document.addEventListener("click", startApp);
window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
new RGBELoader(loadermanager).load("/nebula.hdr", (BGhdr) => {
  BGhdr.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = BGhdr;
  scene.environment = BGhdr;
  BGhdr.castShadow = true;
});

let blackHoleMixer;

// TODO: GLB
new GLTFLoader(loadermanager).load("/blackhole.glb", (gltf) => {
  const Mesh = gltf.scene;
  Mesh.scale.set(92, 92, 92);
  Mesh.position.set(-318, 0, 4);
  Mesh.rotation.set(-6, -18, -66);
  Mesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  blackHoleMixer = new THREE.AnimationMixer(Mesh);
  const clips = gltf.animations;
  const clip = clips[0];
  const action = blackHoleMixer.clipAction(clip);
  action.reset().setLoop(THREE.LoopRepeat).play();

  scene.add(Mesh);
});

const loadingPage2 = document.getElementById("loadingpage");
const stikerLM = new THREE.LoadingManager();
const stikerloaderLoader = new THREE.TextureLoader(stikerLM);
stikerLM.onStart = (url, itemsLoaded, itemsTotal) => {
  loadingPage2.style.opacity = "1";
  loadingPage2.style.transform = "scale(1)";
};
let stickerTexture;
stikerLM.onLoad = () => {
  loadingPage2.style.opacity = "0";
  loadingPage2.style.transform = "scale(0.95)";
};

loadermanagerforsongs.onStart = (url, itemsLoaded, itemsTotal) => {
  loadingPage2.style.opacity = "1";
  loadingPage2.style.transform = "scale(1)";
};
loadermanagerforsongs.onLoad = () => {
  loadingPage2.style.opacity = "0";
  loadingPage2.style.transform = "scale(0.95)";
};

const mainOrbitGroup = new THREE.Group();

let carMesh;
new GLTFLoader(loadermanager).load("/bmw_glb.glb", (gltf) => {
  carMesh = gltf.scene;

  carMesh.position.set(0, 0, 0);

  carMesh.traverse((child) => {
    child.castShadow = true;
    child.receiveShadow = true;

    // Just boost all materials
    if (child.material && child.material.isMeshStandardMaterial) {
      // child.material.envMap = envMap;
      child.material.envMapIntensity = 25;
      child.material.emissive = new THREE.Color(0x000000); // start black

      carEnvIntensitySlider?.addEventListener("input", (e) => {
        UIsond.play();
        const val = parseFloat(e.target.value);
        // console.log("Bloom Intensity:", val);
        child.material.envMapIntensity = val;
      });
    }
  });

  const body = carMesh.getObjectByName("Object_5");
  const headlight = carMesh.getObjectByName("headlight");
  const Driver_Door = carMesh.getObjectByName("Driver_Door_Material_#692_0");
  const Passenger_Door = carMesh.getObjectByName(
    "Passenger_Door_Material_#692_0"
  );
  const Top_body = carMesh.getObjectByName("Body_Material_#692_0");
  // Driver_Door_Material_#692_0
  // Passenger_Door_Material_#692_0
  // Body_Material_#692_0

  // (1) helper functions unchanged
  const clearAllMaps = (mat) => {
    ["normalMap", "bumpMap", "metalnessMap", "aoMap", "map"].forEach(
      (m) => (mat[m] = null)
    );
    mat.bumpScale = 0;
    mat.normalScale.set(1, 1);
    mat.needsUpdate = true;
  };
  const applyTextureToMap = (mat, type, tex, intensity = null) => {
    mat.needsUpdate = true;
    switch (type) {
      case "metalness":
        mat.metalnessMap = tex;
        mat.metalness = intensity !== null ? parseFloat(intensity) : 1;
        break;
      case "ao":
        mat.aoMap = tex;
        mat.aoMapIntensity = intensity !== null ? parseFloat(intensity) : 1;
        break;
      case "normal":
        mat.normalMap = tex;
        // if intensity passed, use that for both X/Y
        const nVal = intensity !== null ? parseFloat(intensity) : 0.5;
        mat.normalScale.set(nVal, nVal);
        break;
      case "map":
        mat.map = tex;
        // no built-in “map intensity” in standard material; you could control material.opacity
        if (intensity !== null) mat.opacity = parseFloat(intensity);
        mat.transparent = intensity !== null && intensity < 1;
        break;
      case "bump":
        mat.bumpMap = tex;
        mat.bumpScale = intensity !== null ? parseFloat(intensity) : 0.1;
        break;
    }
  };
  const removeTextureFromMap = (mat, type) => {
    switch (type) {
      case "metalness":
        mat.metalnessMap = null;
        mat.metalness = 0;
        break;
      case "ao":
        mat.aoMap = null;
        mat.aoMapIntensity = 0;
        break;
      case "normal":
        mat.normalMap = null;
        mat.normalScale.set(1, 1);
        break;
      case "map":
        mat.map = null;
        mat.opacity = 1;
        mat.transparent = false;
        break;
      case "bump":
        mat.bumpMap = null;
        mat.bumpScale = 0;
        break;
    }
  };

  // (2) sticker‐click handler, updated
  stickerChoiceContainer.querySelectorAll("span").forEach((span) => {
    span.addEventListener("click", () => {
      UI2sond.play();
      const choice = span.dataset.sticker;
      const mat = Driver_Door.material;
      mat.needsUpdate = true;

      if (choice === "none") {
        clearAllMaps(mat);
        return;
      }

      // load texture
      const tex = stikerloaderLoader.load(`${choice}sticker.png`);
      Object.assign(tex, {
        encoding: THREE.sRGBEncoding,
        anisotropy: renderer.capabilities.getMaxAnisotropy(),
        wrapS: (tex.wrapT = THREE.RepeatWrapping),
      });

      // get all sliders and checkboxes
      const checkboxes = stickerTypeContainer.querySelectorAll(
        'input[type="checkbox"]'
      );
      const sliders = stickerTypeContainer.querySelectorAll(
        'input[type="range"]'
      );

      // (2a) when a checkbox is already checked on click, apply its map immediately with current slider value
      checkboxes.forEach((chk) => {
        if (chk.checked) {
          // find the sibling range input inside the same label
          const slider = chk.parentElement.querySelector('input[type="range"]');
          const currentVal = slider ? slider.value : null;
          applyTextureToMap(mat, chk.value, tex, currentVal);
        }
        // attach onchange for future toggles
        chk.onchange = (e) => {
          const type = e.target.value;
          const slider = e.target.parentElement.querySelector(
            'input[type="range"]'
          );
          if (e.target.checked) {
            // use current slider value
            const val = slider ? slider.value : null;
            applyTextureToMap(mat, type, tex, val);
          } else {
            removeTextureFromMap(mat, type);
          }
        };
      });

      // (2b) attach input listeners to sliders so they update “intensity” live,
      // but only if its checkbox is checked
      sliders.forEach((rangeInput) => {
        const parentLabel = rangeInput.parentElement;
        const chk = parentLabel.querySelector('input[type="checkbox"]');
        const type = chk.value;

        rangeInput.addEventListener("input", (e) => {
          UIsond.play();
          if (!chk.checked) return; // only update if map is applied
          const v = parseFloat(e.target.value);
          switch (type) {
            case "metalness":
              mat.metalness = v;
              break;
            case "ao":
              mat.aoMapIntensity = v;
              break;
            case "normal":
              mat.normalScale.set(v, v);
              break;
            case "map":
              mat.opacity = v;
              mat.transparent = v < 1;
              break;
            case "bump":
              mat.bumpScale = v;
              break;
          }
          mat.needsUpdate = true;
        });
      });

      // (2c) if you also want to control repeat/rotation sliders, leave them as‐is:

      rotationSlider.oninput = (e) => {
        tex.rotation = parseFloat(e.target.value);
      };
    });
  });
  // Apply the sticker material to the door

  // }
  if (headlight) {
    const headLight = new THREE.SpotLight(
      0xeaff31,
      10,
      20,
      Math.PI / 8,
      0.5,
      1
    );
    // const spotLightHelper = new THREE.SpotLightHelper(headLight);
    // scene.add(spotLightHelper);

    headLight.position.set(0, 0, 0);
    headLight.rotation.set(0, 0.1, -1.5);

    headlight.add(headLight);

    // ---- Second Light ----
    const headLight2 = new THREE.SpotLight(
      0xffffff,
      10,
      20,
      Math.PI / 8,
      0.5,
      1
    );
    // const spotLightHelper2 = new THREE.SpotLightHelper(headLight2);
    // scene.add(spotLightHelper2);
    headLight2.position.set(0, 0, -28.5);
    headLight2.rotation.set(0, -0.1, -1.5);

    headlight.add(headLight2);
  }
  // UI logic for color changing
  document.querySelectorAll("input[name=color_car]").forEach((rb) => {
    rb.addEventListener("change", () => {
      UI2sond.play();
      //   entersound.play();
      const newColor = new THREE.Color(rb.value);
      const highlight = newColor.clone().offsetHSL(0, 0.1, 0.2); // light tint
      const tl = gsap.timeline({
        defaults: {
          ease: "power2.Out",
          duration: 0.6,
        },
      });
      body.traverse((piece) => {
        tl.to(
          piece.scale,
          {
            y: 1.15,
          },
          0
        );
        if (piece.material) {
          // Animate both base color and emissive
          tl.to(
            piece.material.color,
            {
              r: newColor.r,
              g: newColor.g,
              b: newColor.b,
            },
            0
          );
        }
        tl.to(
          piece.scale,
          {
            y: 1,
          },
          ">"
        );
        // if (piece.material) {
        //   // Animate both base color and emissive

        //   tl.to(
        //     piece.scale,
        //     {
        //       y: 1.4,
        //     },
        //     0
        //   )
        //     .to(
        //       piece.material.color,
        //       {
        //         r: newColor.r,
        //         g: newColor.g,
        //         b: newColor.b,
        //       },
        //       0
        //     )
        //     .to(
        //       piece.scale,
        //       {
        //         y: 1,
        //       },
        //       ">"
        //     );
        // }
      });
    });
  });
  // carMesh.add(field);
  mainOrbitGroup.add(carMesh);
  // scene.add(carMesh);
});

const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(-318, 0, 4);
light.castShadow = true;

scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// Add ambient light to Theatre for live control

//mouse light

//
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  camera_2.aspect = window.innerWidth / window.innerHeight;
  camera_2.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

// const camera2Obj = sheet.object("Camera2", {
//   position: {
//     x: camera_2.position.x,
//     y: camera_2.position.y,
//     z: camera_2.position.z,
//   },
//   aspect: camera_2.aspect,
// });

// camera2Obj.onValuesChange((values) => {
//   camera_2.position.set(
//     values.position.x,
//     values.position.y,
//     values.position.z
//   );
//   camera_2.aspect = values.aspect;
//   camera_2.updateProjectionMatrix();
// });

scene.add(camera_2);

window.addEventListener("resize", onWindowResize);
const clock = new THREE.Clock();

// Store latest Theatre values

// Update latest values on change

// Smooth interpolation factor (0.05 = smooth, 1 = instant)
// let lerpFactor = 0.1;

// Animate loop

// modelcont.addEventListener("click", () => {

//   sheet.sequence.play();
// });
// //
//
// TODO fake grafity

const asteroidCount = 150;

const aseColorsb = [
  new THREE.Color(0x4b4b4b), // dark grey
  new THREE.Color(0x5c5248), // rocky brown
  new THREE.Color(0x3b3b3b), // basalt grey
  new THREE.Color(0x6e6259), // dusty brown
  new THREE.Color(0x2f2f2f), // charcoal
];

// add rockets
const asteroidBelt = new THREE.Group();

for (let i = 0; i < asteroidCount; i++) {
  const asteroidMaterial = new THREE.MeshStandardMaterial({
    color: aseColorsb[THREE.MathUtils.randInt(0, aseColorsb.length - 1)],
  });
  const widthSegments = Math.floor(Math.random() * 5) + 3; // 4–8
  const heightSegments = Math.floor(Math.random() * 5) + 3; // 4–8

  const asteroidGeometry = new THREE.SphereGeometry(
    THREE.MathUtils.randFloat(0.1, 0.3),
    widthSegments,
    heightSegments
  );
  //   const asteroidGeometry = new THREE.SphereGeometry(
  //     0.1 , // Random size between 0.1 and 0.5
  //   4,
  //   4
  // );

  const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
  asteroid.scale.set(
    THREE.MathUtils.randFloat(0.5, 1.1), // Random scale between 0.1 and 0.5
    THREE.MathUtils.randFloat(0.5, 1.3), // Random scale between 0.1 and 0.5
    THREE.MathUtils.randFloat(0.5, 1.1) // Random scale between 0.1 and 0.5
  );

  // Random position in orbit
  const angle = Math.random() * Math.PI * 2;
  const distance = THREE.MathUtils.randFloat(25, 40);

  asteroid.position.set(
    distance * Math.cos(angle),
    THREE.MathUtils.randFloat(-5, 5), // Small variation
    distance * Math.sin(angle)
  );

  // Add each asteroid to the asteroid belt
  asteroidBelt.add(asteroid);
}

let lerPP = 0.04;
//
controls.addEventListener("start", () => {
  hideUIB.style.opacity = "0";
  hideUIB.style.pointerEvents = "none";
  document.body.style.cursor = "none";
  UI_HIDE(true);

  gsap.to(
    { value: lerPP },
    {
      value: 0.001,
      duration: 1,
      ease: "power2.out",
      onUpdate: function () {
        lerPP = this.targets()[0].value;
      },
    }
  );
  // Apply a lowpass filter effect with a smooth transition to bgsound
  const audioContext = bgsound.context;
  const filter = audioContext.createBiquadFilter();
  filter.type = "lowpass";
  // Start with a high cutoff frequency
  filter.frequency.value = 22050;
  bgsound.setFilter(filter);

  // Smoothly lower the cutoff frequency to 1000 Hz over 1 second
  gsap.to(filter.frequency, {
    value: 1000,
    duration: 2.5,
    ease: "power2.out",
  });
});

controls.addEventListener("end", () => {
  hideUIB.style.opacity = "0.8";
  hideUIB.style.pointerEvents = "auto";
  document.body.style.cursor = "default";
  UI_HIDE(false);

  gsap.to(
    { value: lerPP },
    {
      value: 0.04,
      duration: 1,
      ease: "power2.out",
      onUpdate: function () {
        lerPP = this.targets()[0].value;
      },
    }
  );
  // Smoothly ramp the cutoff frequency back to 22050 Hz and then remove the filter
  const currentFilter = bgsound.getFilter();
  if (currentFilter) {
    gsap.to(currentFilter.frequency, {
      value: 22050,
      duration: 3,
      ease: "power2.out",
      onComplete: () => {
        bgsound.setFilter(null);
      },
    });
  } else {
    bgsound.setFilter(null);
  }
});
const center = new THREE.Vector3(-318, 0, 4);
const radius = 318;
let angle = 0;

mainOrbitGroup.add(asteroidBelt);
scene.add(mainOrbitGroup);

const camOffset = new THREE.Vector3(2, 2, 0);
const offsetA = new THREE.Vector3(-6, 1, 0);
const cameraPositionsUI = document
  .getElementById("cameraPositions")
  .querySelectorAll("input");
cameraPositionsUI.forEach((el) => {
  el.addEventListener("change", (e) => {
    if (e.target.checked) {
      UIsond.play();
      const target = el.getAttribute("data-camera");
      if (target === "1") {
        camOffset.set(3, 2.5, 5);
        offsetA.set(-6, 1, 0);
      } else if (target === "2") {
        camOffset.set(0, 4, 9);
        offsetA.set(-4, 2, 0);
      } else if (target === "3") {
        camOffset.set(0, 2, -3);
        offsetA.set(-6, 2, -4);
      }
    }
  });
});

const vertexShaderDUST = `
// GLSL simplex noise by Ian McEwan, Ashima Arts (compact)
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0)) +
    i.y + vec4(0.0, i1.y, i2.y, 1.0)) +
    i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857; // 1/7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(
    vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3))
  );
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1),
                          dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1),
                              dot(p2,x2), dot(p3,x3)));
}
precision highp float;

uniform float uTime;
uniform float uTimeX;
uniform float uTimeX2;
uniform float uPosX;
uniform float uPosY;
uniform float uPosXY;
uniform float uPointsSize;
uniform float uWindForceX;
uniform float uWindForceY;

varying float vAlpha;

void main() {
  vec3 pos = position;

  // Wind-like movement
  float wind = snoise(vec3(pos.x * uPosX + uTime * uTimeX, pos.y * uPosY, pos.z));
  float turbulence = snoise(vec3(pos.xy * uPosXY, uTime * uTimeX2));

  pos.x += wind * uWindForceX;
  pos.y += turbulence * uWindForceY;

  vAlpha = smoothstep(0.0, 1.0, turbulence);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = uPointsSize;
}
`;
const fragmentShaderDUST = `
uniform sampler2D uTexture;
varying float vAlpha;

void main() {
  vec4 tex = texture2D(uTexture, gl_PointCoord);
  if (tex.a < 0.1) discard; // smooth alpha edges
  gl_FragColor = vec4(vec3(1.0), vAlpha * tex.a);
}

`;
// TODO 1000
// dust particle system
const count = 1500;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(count * 3);
const initialPositions = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
  const x = THREE.MathUtils.randFloat(-3, 4);
  const y = THREE.MathUtils.randFloat(-1, 3);
  const z = THREE.MathUtils.randFloat(-3, 3);

  positions[i * 3 + 0] = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = z;

  initialPositions[i * 3 + 0] = x;
  initialPositions[i * 3 + 1] = y;
  initialPositions[i * 3 + 2] = z;
}
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const particleTexture = new THREE.TextureLoader(loadermanager).load(
  "circle.png"
); // white circle PNG with alpha
//   void main() {

const uniforms = {
  uTime: { value: 0 },
  uTimeX: { value: 0.06 },
  uTimeX2: { value: 0.06 },
  uPosX: { value: 4.5 },
  uPosY: { value: 2.5 },
  uPosXY: { value: 1.5 },
  uPointsSize: { value: 0.05 },
  uWindForceX: { value: -8.1 },
  uWindForceY: { value: -4.1 },
  uTexture: { value: particleTexture },
};

//

const matparticle = new THREE.ShaderMaterial({
  uniforms,
  vertexShader: vertexShaderDUST,
  fragmentShader: fragmentShaderDUST,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

const particles = new THREE.Points(geometry, matparticle);
scene.add(particles);

// sprites
// Smaller rotation values
let Xrotate = 0.002; // was 0.008
let Yrotate = 0.0005; // was 0.002
let Zrotate = 0.0015; // was 0.005

// Optional: slower oscillation speed
let Xtimerotate = 0.08;
let Ytimerotate = 0.08;
let Ztimerotate = 0.3;

function animate(time) {
  requestAnimationFrame(animate);

  const delta = clock.getDelta(); // only call once per frame

  if (blackHoleMixer) blackHoleMixer.update(delta * 0.3);
  if (AstronautMixer) AstronautMixer.update(delta * 2);

  asteroidBelt.rotation.y += 0.008;
  asteroidBelt.rotation.x += 0.001;

  asteroidBelt.children.forEach((asteroid) => {
    asteroid.rotation.x += 0.005 * Math.random();
    asteroid.rotation.y += 0.003 * Math.random();
  });
  // car grafity
  if (carMesh) {
    // forward movement

    // oscillating sway
    const t = clock.getElapsedTime();
    carMesh.rotation.y += Math.sin(t * Xtimerotate) * Xrotate;
    carMesh.rotation.x += Math.sin(t * Ytimerotate) * Yrotate;
    carMesh.rotation.z += Math.sin(t * Ztimerotate) * Zrotate;
  }
  // — orbit the group —
  angle += 0.0004;
  mainOrbitGroup.position.set(
    center.x + radius * Math.cos(angle),
    center.y,
    center.z + radius * Math.sin(angle)
  );
  // — compute where camera should be —
  const desiredCamPos = mainOrbitGroup.position.clone().add(camOffset);
  camera.position.lerp(desiredCamPos, lerPP); // smooth follow

  // — make OrbitControls look at the car —
  controls.target.copy(mainOrbitGroup.position);
  // dust particle
  matparticle.uniforms.uTime.value = clock.getElapsedTime();
  //

  if (doesastronautMeshFollow) {
    const targetPos = mainOrbitGroup.position.clone().add(offsetA);
    astronautMesh.position.lerp(targetPos, 0.9); // smooth follow
  }

  particles.position
    .copy(mainOrbitGroup.position)
    .add(new THREE.Vector3(0, 0, 0));

  composer.render();
  controls.update();

  // menuGroup.rotation.z += 0.01;
}
animate();

// TODO
document.querySelectorAll(".ui-sound-radio").forEach((radio) => {
  radio.addEventListener("change", (e) => {
    UI2sond.play();
    const selectedValue = e.target.value;

    // Your logic here — use selectedValue
    if (selectedValue === "Muted") {
      if (e.target.checked === true) {
        bgsound.stop();
      } else {
        bgsound.play();
      }
    } else {
      bgsound.stop();
      songsLoader.load(`sound/songs/${selectedValue}`, (buffer) => {
        bgsound.setBuffer(buffer);
        bgsound.setLoop(true);
        bgsound.setVolume(0.8);
        bgsound.setRefDistance(20); // for 3D spatial effect
        bgsound.play();
      });
    }
  });
});
