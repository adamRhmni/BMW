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

// TODO
import { createPhysicsWorld } from "./Matter.js";
const { addRandomShape, cleanupMatter } = createPhysicsWorld();
createPhysicsWorld(document.getElementById("matterContainer"));


// studio.initialize();

const projTHEATER = core.getProject("BMW", { state: State });
const toggle = document.getElementById("hero_toggle");

const sheet = projTHEATER.sheet("car");
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
scene.background = new THREE.Color(0xfff);
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
const hero_menu_button = document.getElementById("hero_menu_button");
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
  bgLoader.style.opacity = "0";
  bgLoader.style.display = "none";
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

audioLoader.load(
  "sound/UI2.flac",
  (buffer) => {
    UI2sond.setBuffer(buffer);
    UI2sond.setLoop(false);
    UI2sond.setVolume(0.8);
    UI2sond.setRefDistance(20); // for 3D spatial effect
  }
);
camera.add(UI2sond);
audioLoader.load(
  "sound/ui1.flac",
  (buffer) => {
    UIsond.setBuffer(buffer);
    UIsond.setLoop(false);
    UIsond.setVolume(0.8);
    UIsond.setRefDistance(20); // for 3D spatial effect
  }
);
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


const helmetTexture = new THREE.TextureLoader(loadermanager).load('brokenGlass.png');

const helmetMaterial = new THREE.MeshBasicMaterial({
  map: helmetTexture,
  transparent: true,
  depthWrite: false // important so it doesn't block everything
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
new GLTFLoader(loadermanager).load("astronaut.glb", (gltf) => {
  astronautMesh = gltf.scene;
  astronautMesh.scale.set(1, 1, 1);
  astronautMesh.position.set(-720, 227, -8);
  astronautMesh.rotation.set(0, 1.5, 0);

  // Add to Theatre for live control
  // const astronautObj = sheet.object("Astronaut", {
  //   position: {
  //     x: astronautMesh.position.x,
  //     y: astronautMesh.position.y,
  //     z: astronautMesh.position.z,
  //   },
  //   scale: astronautMesh.scale.x,
  //   rotation: {
  //     x: astronautMesh.rotation.x,
  //     y: astronautMesh.rotation.y,
  //     z: astronautMesh.rotation.z,
  //   },
  // });
  // astronautObj.onValuesChange((values) => {
  //   astronautMesh.position.set(
  //     values.position.x,
  //     values.position.y,
  //     values.position.z
  //   );
  //   astronautMesh.scale.set(values.scale, values.scale, values.scale);
  //   astronautMesh.rotation.set(
  //     values.rotation.x,
  //     values.rotation.y,
  //     values.rotation.z
  //   );
  // });
  // astronautMesh.traverse((child) => {
  //   if (child.isMesh) {
  //     child.castShadow = true;
  //     child.receiveShadow = true;
  //   }
  // });

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
let duration1 = 6;
let duration2 = 5;
let duration3 = 4;
let duration4 = 6;

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

function UI_HIDE(param) {

  if(param){
    cameraControlsUI.style.pointerEvents = "none";
    cameraControlsUI.style.opacity = "0";
    EDIT_UI.style.opacity = "0";
    EDIT_UI.style.pointerEvents = "none";



  }else{
    cameraControlsUI.style.pointerEvents = "auto";
    cameraControlsUI.style.opacity = "1";
    EDIT_UI.style.opacity = "1";
    EDIT_UI.style.pointerEvents = "auto";



  }
  
}
UI_HIDE(true);
function startSpaceMan(){
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
        let cleanintervalBlink = setInterval(blink(150), 4000);
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
                    camera_2.lookAt(target4);
                            // bgsound.play()
                    stopBlinking();
                    Longblink();
                    
                    vignettePass.uniforms["offset"].value = 0;
                    vignettePass.uniforms["darkness"].value = 0;
                    
                    bgsound.play();
                    UI_HIDE(false);

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
    // lockLandscape();
    setTimeout(() => {
      startScreen.style.display = "none";
      // targetVignetteStrength = -0.01;
      // bgsound.play();
      // sheet.sequence.play().then(() =>
      if (true) {
        animationcamera = false;
        controls.enabled = true;


        hero_menu_button.style.transform = "translate3d(0, 0, 0)";
        setTimeout(() => {
          // controls.minPolarAngle = 0;
          // controls.maxPolarAngle = Math.PI / 2;
          // controls.enablePan = false;
          // controls.maxDistance = 15;
          // controls.minDistance = 3;
        }, 500);
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
new RGBELoader(loadermanager).load(
  "nebula.hdr",
  (BGhdr) => {
    BGhdr.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = BGhdr;
    scene.environment = BGhdr;
    BGhdr.castShadow = true;
  }
);

//TODO:
let CrowMixerQ;

let blackHoleMixer;

// TODO: GLB
new GLTFLoader(loadermanager).load("blackhole.glb", (gltf) => {
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
new GLTFLoader(loadermanager).load("bmw_glb.glb", (gltf) => {
  carMesh = gltf.scene;

  carMesh.position.set(0, 0, 0);

  carMesh.traverse((child) => {
    // child.castShadow = true;
    // child.receiveShadow = true;

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
      repeatXSlider.oninput = (e) => {
        tex.repeat.x = parseFloat(e.target.value);
      };
      repeatYSlider.oninput = (e) => {
        tex.repeat.y = parseFloat(e.target.value);
      };
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

// Add the asteroid belt to the scene

//
// const textloader = new FontLoader(loadermanager);
//
// const menuGroup = new THREE.Group();

// const menuTEXT = [
//   // { text: "MY WORK", position: { x: -12.5, y: 0, z: 12.5 } },
//   // { text: "WHO IM", position: { x: 12.5, y: 0, z: 12.5 } },
//   // { text: "ABOUT", position: { x: -12.5, y: 0, z: -12.5 } },
//   // { text: "SETTINGS", position: { x: 12.5, y: 0, z: -12.5 } },
// ];
// textloader.load("/NEXLABS/fonts/Orbitron_Regular.json", (font) => {
//   const textMaterial = new THREE.MeshStandardMaterial({
//     color: 0xffffff,
//     // envMapIntensity: 1.5, // increased reflection effect
//     // transparent: true,
//     // metalness: 1,
//     // roughness: 0.1,
//   });

//   menuTEXT.forEach((item) => {
//     const textGeometry = new TextGeometry(item.text, {
//       font: font,
//       size: 2,
//       height: 0.2,
//       curveSegments: 2,
//       bevelEnabled: true,
//       bevelThickness: 0.03,
//       bevelSize: 0.02,
//       bevelOffset: 0,
//       bevelSegments: 5,
//     });

//     textGeometry.center();

//     const textMesh = new THREE.Mesh(textGeometry, textMaterial);
//     textMesh.name = item.text; // <- assign name
//     textMesh.scale.z = 0.008;
//     textMesh.rotation.x = -Math.PI / 2;
//     textMesh.position.set(item.position.x, item.position.y, item.position.z);
//     textMesh.userData.originalPosition = textMesh.position.clone();
//     // textMesh.receiveShadow = true;
//     menuGroup.add(textMesh);
//   });
// });
// // Add a simple cube to the scene
// const cubeGeometry = new THREE.SphereGeometry(1);

// const cubeMaterial = new THREE.MeshStandardMaterial({
//   color: "black",
//   envMapIntensity: 1.5, // increased reflection effect
//   transparent: true,
//   metalness: 1,
//   roughness: 0.1,
// });

// const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// cube.position.set(5, 0.5, 5);
// cube.name = "backButton";
// cube.material.opacity = 0.0;
// menuGroup.add(cube);
// menuGroup.rotation.y = Math.PI / 8.7;
// menuGroup.position.y = 120;
// menuGroup.position.z = 5;
// menuGroup.position.x = 3;
// const element = document.getElementById("css3-hero");
// const content = element.querySelector(".section-content");

// const changeSectionCSSR3 = (option) => {
//   const data = {
//     "MY WORK": {
//       html: `<ul><li><a href="https://astra-ecommerce.onrender.com" target="_blank">E-commerce website</a></li><li><a href="https://adamrhmni.github.io/astra-solar-system/?fbclid=PAY2xjawJx8gFleHRuA2FlbQIxMQABp3E47mJpad02ahc-Tov-yQwx2Se77Z3XQmmUrWCodrwAfmRpQWXaRAsHB2mR_aem_-fzfh5Y9-5usZdUNTX9UOg" target="_blank">solar system</a></li><li>Game using shaders</li></ul>`,
//       rotateY: "-360deg",
//       top: "50vh",
//       left: "5vw",
//     },
//     "WHO IM": {
//       html: `<p>I'm <a href="https://www.instagram.com/adam_rhmnii?igsh=MW5mdmtvZWpsdTB2bQ==" target="_blank">Adam</a>,ceo of NexLabs<br/>im a web dev, shaders artist,and UI/UX,i have working with R3F theater and im developing my own particle system lib , <a href="https://www.instagram.com/nex.labs?igsh=a3JpZHIyZzU3Nmo1" target="_blank">lets contect !</a></p>`,
//       rotateY: "-360deg",
//       top: "15vh",
//       left: "15vw",
//     },
//     ABOUT: {
//       html: "<p>I build interactive experiences using WebGL, shaders, and physics</p>",
//       rotateY: "360deg",
//       top: "35vh",
//       left: "20vw",
//     },
//     SETTINGS: {
//       html: `<label>Muted <input type='checkbox' id="mutedbutton"></label>`,
//       rotateY: "360deg",
//       top: "5vh",
//       left: "10vw",
//     },
//   };

//   if (option && data[option]) {
//     const { html, rotateY, top, left } = data[option];

//     element.style.opacity = 1;
//     element.style.transform = `rotateY(${rotateY}) scale(1)`;
//     element.style.top = top;
//     element.style.left = left;

//     element.querySelector("h1").innerHTML = option;
//     content.innerHTML = html;
//     if (option === "SETTINGS") {
//       document.getElementById("mutedbutton").addEventListener("change", (u) => {
//         if (u.target.checked) {
//           bgsound.pause();
//         } else {
//           bgsound.play();
//         }
//       });
//     }
//   } else {
//     element.style.opacity = 0;
//     element.style.transform = "scale(0.95)";
//     content.innerHTML = "";
//   }
// };

// scene.add(menuGroup);
// changeSectionCSSR3(null);
// // TODO: use theater insted on this

// const originalPosition = camera.position.clone();
// const toggledPosition = new THREE.Vector3(
//   originalPosition.x,
//   144,
//   originalPosition.z
// );

// toggle.addEventListener("change", () => {
//   animationcamera = null;
//   // lockLandscape();
//   const isToggled = toggle.checked;
//   const targetPosition = isToggled ? toggledPosition : originalPosition;


//   gsap.to(camera.position, {
//     duration: 2,
//     x: targetPosition.x,
//     y: targetPosition.y,
//     z: targetPosition.z,
//     ease: "power4.out",
//     onStart: () => {
//       controls.enabled = false;
//     },
//     onComplete: () => {
//       if (!isToggled) {
//         controls.enabled = true;
//         controls.enablePan = false;
//       }
//     },
//   });
// });
// //raycasting textmenu
// const raycaster = new THREE.Raycaster();
// const mouse = new THREE.Vector2();
// let LastMeshMenu = null;
// let userdatamesh = null;

// window.addEventListener("click", (event) => {
//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//   raycaster.setFromCamera(mouse, camera);
//   const intersects = raycaster.intersectObjects(menuGroup.children);
//   if (intersects.length > 0) {
//     menuGroup.children.forEach((mesh) => {
//       if (mesh.name === intersects[0].object.name) {
//         activemenusound.play();
//         if (!LastMeshMenu) {
//           changeSectionCSSR3(intersects[0].object.name);
//           cube.material.opacity = 1;
//           const box = new THREE.Box3().setFromObject(mesh);
//           const meshCenter = new THREE.Vector3();
//           box.getCenter(meshCenter);
//           // Step 2: OrbitControls target (where camera is looking)
//           const viewTarget = controls.target.clone();
//           // Step 3: Move mesh into view target
//           const offset = new THREE.Vector3().subVectors(viewTarget, meshCenter);
//           const finalMeshPos = mesh.position.clone().add(offset);
//           gsap.to(mesh.position, {
//             x: finalMeshPos.x + 3,
//             y: finalMeshPos.y + 120,
//             z: finalMeshPos.z + 5,
//             duration: 1.2,
//             ease: "power2.out",
//           });
//           // Step 4: Compute forward direction from camera to target
//           const direction = new THREE.Vector3()
//             .subVectors(viewTarget, camera.position)
//             .normalize();
//           const zoomAmount = 13; // negative = zoom in
//           // Step 5: Final camera position after zoom
//           const zoomTarget = camera.position
//             .clone()
//             .add(direction.multiplyScalar(zoomAmount));
//           // Step 6: Animate camera zoom (while still looking at viewTarget)
//           const startCamPos = camera.position.clone();
//           const tempCam = new THREE.Vector3();
//           const zoomAnim = { t: 0 };
//           gsap.to(zoomAnim, {
//             t: 1,
//             duration: 1.2,
//             ease: "power2.out",
//             onUpdate: () => {
//               tempCam.lerpVectors(startCamPos, zoomTarget, zoomAnim.t);
//               camera.position.copy(tempCam);
//               camera.lookAt(viewTarget);
//             },
//             onComplete: () => {
//               controls.update(); // optional sync
//             },
//           });
//           LastMeshMenu = mesh;
//           userdatamesh = mesh.userData.originalPosition;
//         } else {
//           if (LastMeshMenu.name === mesh.name || mesh.name === "backButton") {
//             if (mesh.name === "backButton") {
//               changeSectionCSSR3(null);
//               const box = new THREE.Box3().setFromObject(mesh);
//               const meshCenter = new THREE.Vector3();
//               box.getCenter(meshCenter);
//               // Step 2: OrbitControls target (where camera is looking)
//               const viewTarget = controls.target.clone();

//               gsap.to(LastMeshMenu.position, {
//                 x: LastMeshMenu.userData.originalPosition.x,
//                 y: LastMeshMenu.userData.originalPosition.y,
//                 z: LastMeshMenu.userData.originalPosition.z,
//                 duration: 1.2,
//                 ease: "power2.out",
//               });
//               // Step 4: Compute forward direction from camera to target
//               const direction = new THREE.Vector3()
//                 .subVectors(viewTarget, camera.position)
//                 .normalize();
//               const zoomAmount = -13; // negative = zoom in
//               // Step 5: Final camera position after zoom
//               const zoomTarget = camera.position
//                 .clone()
//                 .add(direction.multiplyScalar(zoomAmount));
//               // Step 6: Animate camera zoom (while still looking at viewTarget)
//               const startCamPos = camera.position.clone();
//               const tempCam = new THREE.Vector3();
//               const zoomAnim = { t: 0 };
//               gsap.to(zoomAnim, {
//                 t: 1,
//                 duration: 1.2,
//                 ease: "power2.out",
//                 onUpdate: () => {
//                   tempCam.lerpVectors(startCamPos, zoomTarget, zoomAnim.t);
//                   camera.position.copy(tempCam);
//                   camera.lookAt(viewTarget);
//                 },
//                 onComplete: () => {
//                   controls.update(); // optional sync
//                 },
//               });
//               LastMeshMenu = null;
//               cube.material.opacity = 0.0;
//             } else {
//               changeSectionCSSR3(null);
//               cube.material.opacity = 0.0;
//               const box = new THREE.Box3().setFromObject(mesh);
//               const meshCenter = new THREE.Vector3();
//               box.getCenter(meshCenter);
//               // Step 2: OrbitControls target (where camera is looking)
//               const viewTarget = controls.target.clone();

//               gsap.to(mesh.position, {
//                 x: mesh.userData.originalPosition.x,
//                 y: mesh.userData.originalPosition.y,
//                 z: mesh.userData.originalPosition.z,
//                 duration: 1.2,
//                 ease: "power2.out",
//               });
//               // Step 4: Compute forward direction from camera to target
//               const direction = new THREE.Vector3()
//                 .subVectors(viewTarget, camera.position)
//                 .normalize();
//               const zoomAmount = -13; // negative = zoom in
//               // Step 5: Final camera position after zoom
//               const zoomTarget = camera.position
//                 .clone()
//                 .add(direction.multiplyScalar(zoomAmount));
//               // Step 6: Animate camera zoom (while still looking at viewTarget)
//               const startCamPos = camera.position.clone();
//               const tempCam = new THREE.Vector3();
//               const zoomAnim = { t: 0 };

//               gsap.to(zoomAnim, {
//                 t: 1,
//                 duration: 1.2,
//                 ease: "power2.out",
//                 onUpdate: () => {
//                   tempCam.lerpVectors(startCamPos, zoomTarget, zoomAnim.t);
//                   camera.position.copy(tempCam);
//                   camera.lookAt(viewTarget);
//                 },
//                 onComplete: () => {
//                   controls.update(); // optional sync
//                 },
//               });
//               LastMeshMenu = null;
//             }
//           }
//         }
//       }
//     });
//   }
// });

// let localLastMesh = null;
// window.addEventListener("mousemove", (evt) => {
//   const localMouse = new THREE.Vector2(
//     (evt.clientX / window.innerWidth) * 2 - 1,
//     -(evt.clientY / window.innerHeight) * 2 + 1
//   );
//   const localRaycaster = new THREE.Raycaster();
//   localRaycaster.setFromCamera(localMouse, camera);
//   const localIntersects = localRaycaster.intersectObjects(menuGroup.children);

//   if (localIntersects.length > 0) {
//     document.body.style.cursor = "pointer";
//     const currentHovered = localIntersects[0].object;
//     // If a different mesh is hovered, revert the previous one if it's not the backButton
//     if (
//       localLastMesh &&
//       localLastMesh !== currentHovered &&
//       localLastMesh.name !== "backButton"
//     ) {
//       gsap.to(localLastMesh.rotation, {
//         x: localLastMesh.userData.originalRotation,
//         duration: 0.5,
//         ease: "power2.inOut",
//       });
//     }
//     // Only animate non-backButton meshes
//     if (currentHovered.name !== "backButton") {
//       if (currentHovered.userData.originalRotation === undefined) {
//         currentHovered.userData.originalRotation = currentHovered.rotation.x;
//       }
//       gsap.to(currentHovered.rotation, {
//         x: currentHovered.userData.originalRotation + Math.PI * 2,
//         duration: 0.5,
//         ease: "power2.inOut",
//       });
//     }
//     localLastMesh = currentHovered;
//   } else {
//     document.body.style.cursor = "default";
//     if (localLastMesh && localLastMesh.name !== "backButton") {
//       gsap.to(localLastMesh.rotation, {
//         x: localLastMesh.userData.originalRotation,
//         duration: 0.5,
//         ease: "power2.inOut",
//       });
//     }
//     localLastMesh = null;
//   }
// });
let lerPP = 0.04;
//
controls.addEventListener("start", () => {
  UI_HIDE(true);




  lerPP = 0.005;

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
      duration: 2,
      ease: "power2.out",
    });
});

controls.addEventListener("end", () => {
  UI_HIDE(false);



  lerPP = 0.04;
  // Smoothly ramp the cutoff frequency back to 22050 Hz and then remove the filter
  const currentFilter = bgsound.getFilter();
  if (currentFilter) {
    gsap.to(currentFilter.frequency, {
      value: 22050,
      duration: 2,
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

const cameraPositionsUI = document
  .getElementById("cameraPositions")
  .querySelectorAll("span");
cameraPositionsUI.forEach((el) => {
  el.addEventListener("click", () => {
    UIsond.play();
    const target = el.getAttribute("data-camera");
    if (target === "1") {
      camOffset.set(3, 2.5, 5);
    } else if (target === "2") {
      camOffset.set(0, 4, 9);
    } else if (target === "3") {
      camOffset.set(0, 2, -3);
    }
  });
});
//
//

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

// Include Simplex noise (snoise) if not already in your shader
// You MUST include the snoise function or import it from a shader chunk

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
const count = 1000;
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
//   vec3 pos = position;

//   // Wind-like movement
//   float wind = snoise(vec3(pos.x * 0.5 + uTime * 0.4, pos.y * 0.5, pos.z));
//   float turbulence = snoise(vec3(pos.xy * 1.5, uTime * 0.2));

//   pos.x += wind * 0.1;
//   pos.y += turbulence * 0.2;

//   vAlpha = smoothstep(0.0, 1.0, turbulence);

//   gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
//   gl_PointSize = 0.05;
// }
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
let Xrotate = 0.008;
let Yrotate = 0.002;
let Zrotate = 0.005;
let Xtimerotate = 0.5;
let Ytimerotate = 0.7;
let Ztimerotate = 1.4;
const offsetA = new THREE.Vector3(-6, 1, 0);

function animate(time) {
  requestAnimationFrame(animate);

  // const currentTime = performance.now();
  // let timeDelta = (currentTime - slowMotionPrevTime) / 1000;
  // slowMotionPrevTime = currentTime;
  // timeDelta *= slowMotionScale;
  // if (animationcamera) {
  //   camera.position.lerp(
  //     new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z),
  //     lerpFactor
  //   );
  //   // Interpolate lookAt target
  //   const interpolatedTarget = new THREE.Vector3().copy(
  //     camera.getWorldDirection(new THREE.Vector3())
  //   );
  //   interpolatedTarget.lerp(
  //     currentLookAt.clone().sub(camera.position),
  //     lerpFactor
  //   );
  //   camera.lookAt(camera.position.clone().add(interpolatedTarget));
  // }
  
  const delta = clock.getDelta(); // only call once per frame

  // if (blackHoleMixer) blackHoleMixer.update(delta * 0.1);
  if (AstronautMixer) AstronautMixer.update(delta);

  asteroidBelt.rotation.y += 0.01;
  asteroidBelt.rotation.x += 0.002;

  asteroidBelt.children.forEach((asteroid) => {
    asteroid.rotation.x += 0.007 * Math.random();
    asteroid.rotation.y += 0.005 * Math.random();
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
  angle += 0.0005;
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
      if(e.target.checked === true){
        bgsound.stop();
      }else{
        bgsound.play();
      }
      
    } else {
      bgsound.stop();
      songsLoader.load(
        `sound/songs/${selectedValue}`,
        (buffer) => {
          bgsound.setBuffer(buffer);
          bgsound.setLoop(true);
          bgsound.setVolume(0.8);
          bgsound.setRefDistance(20); // for 3D spatial effect
          bgsound.play();
        }
      );
      
    }
  });
});
