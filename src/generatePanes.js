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
const uiContainer = document.getElementById("ui-panels");
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
  <span data-camera="1"><span>1</span></span>
  <span data-camera="2"><span>2</span></span>
  <span data-camera="2"><span>3</span></span>
`
const EDIT_UI = document.getElementById("ui-container");
document.getElementById("ui-panels").classList.add("hidden"); // hide all panes initially
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
    if(targetId =="ABOUT-ui"){
      cameraControlsUI.style.pointerEvents = "none";
      cameraControlsUI.style.opacity = "0";
    }else{
      cameraControlsUI.style.pointerEvents = "auto";
      cameraControlsUI.style.opacity = "1";
    }
    EDIT_TOGGLE.innerHTML = `X`;
    uiContainer.classList.remove("hidden"); // ensure UI container is visible
  });
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
    <span>Repeat X</span>
    <input type="range" id="repeatXSlider" min="1" max="10" step="1" value="2" />
  </label>
  <label class="ui-mat-labelform">
    <span>Repeat Y</span>
    <input type="range" id="repeatYSlider" min="1" max="10" step="1" value="2" />
  </label>
  <label class="ui-mat-labelform">
    <span>Rotation</span>
    <input type="range" id="rotationSlider" min="0" max="${
      Math.PI * 2
    }" step="0.01" value="${Math.PI / 4}" />
  </label>
`;
const repeatXSlider = document.getElementById("repeatXSlider");
const repeatYSlider = document.getElementById("repeatYSlider");
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
