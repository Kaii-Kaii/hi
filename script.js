import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.151.0/three.module.js";

const canvasEl = document.querySelector("#canvas");
const toggleEl = document.querySelector(".render-toggle");

const pointer = {
    x: .65,
    y: .3,
    clicked: true
};

// for codepen preview
window.setTimeout(() => {
    pointer.x = .75;
    pointer.y = .5;
    pointer.clicked = true;
}, 400);
window.setTimeout(() => {
    pointer.x = .4;
    pointer.y = .5;
    pointer.clicked = true;
}, 700);

// only for codepen preview
let isStart = true;


let isRendering = true;

let renderer, shaderScene, mainScene, sceneTest, renderTargets, camera, clock;
let basicMaterial, shaderMaterial;

const backgroundColor = new THREE.Color(0xffffff);

initScene();

updateSize();
window.addEventListener("resize", updateSize);

    function handleClickOrTouch(e) {
        e.preventDefault(); // Prevent default touch behavior

        if (e.target !== toggleEl) {
            let clientX, clientY;

            if (e.type === "click") {
                clientX = e.clientX;
                clientY = e.clientY;
            } else if (e.type === "touchstart") {
                const touch = e.touches[0];
                clientX = touch.clientX;
                clientY = touch.clientY;
            }

            pointer.x = clientX / window.innerWidth;
            pointer.y = clientY / window.innerHeight;
            pointer.clicked = true;
            isRendering = true;
        } else {
            isRendering = !isRendering;
        }

        toggleEl.innerHTML = isRendering ? "freeze" : "unfreeze";
    }

    window.addEventListener("click", handleClickOrTouch);
    window.addEventListener("touchstart", handleClickOrTouch);

render();


function initScene() {
    renderer = new THREE.WebGLRenderer({
        canvas: canvasEl,
        alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    shaderScene = new THREE.Scene();
    mainScene = new THREE.Scene();
    sceneTest = new THREE.Scene();

    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    clock = new THREE.Clock();

    renderTargets = [
        new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight),
        new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight),
    ];

    const planeGeometry = new THREE.PlaneGeometry(2, 2);

    shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            u_ratio: {type: "f", value: window.innerWidth / window.innerHeight},
            u_point: {type: "v2", value: new THREE.Vector2(pointer.x, pointer.y)},
            u_time: {type: "f", value: 0.},
            u_stop_time: {type: "f", value: 0.},
            u_stop_randomizer: {type: "v3", value: new THREE.Vector2(0, 0, 0)},
            u_texture: {type: "t", value: null},
            u_background_color: {type: "v3", value: backgroundColor}
        },
        vertexShader: document.getElementById("vertexShader").textContent,
        fragmentShader: document.getElementById("fragmentShader").textContent,
        transparent: true
    });

    basicMaterial = new THREE.MeshBasicMaterial({
        transparent: true
    });
    const backgroundColorMaterial = new THREE.MeshBasicMaterial({
        color: backgroundColor,
        transparent: true
    });

    const planeBasic = new THREE.Mesh(planeGeometry, basicMaterial);
    const planeShader = new THREE.Mesh(planeGeometry, shaderMaterial);
    const coloredPlane = new THREE.Mesh(planeGeometry, backgroundColorMaterial);
    shaderScene.add(planeShader);
    mainScene.add(coloredPlane);

    renderer.setRenderTarget(renderTargets[0]);
    renderer.render(mainScene, camera);

    mainScene.remove(coloredPlane);
    mainScene.add(planeBasic);
}


function render() {
    requestAnimationFrame(render);
    const delta = clock.getDelta();

    if (isRendering) {

        shaderMaterial.uniforms.u_texture.value = renderTargets[0].texture;
        shaderMaterial.uniforms.u_time.value = clock.getElapsedTime() + .9; // offset for 1st flower color

        if (pointer.clicked) {
            shaderMaterial.uniforms.u_point.value = new THREE.Vector2(pointer.x, 1 - pointer.y);
            shaderMaterial.uniforms.u_stop_randomizer.value = new THREE.Vector3(Math.random(), Math.random(), Math.random());
            if (isStart) {
                shaderMaterial.uniforms.u_stop_randomizer.value = new THREE.Vector3(.5, 1, 1);
                isStart = false;
            }
            shaderMaterial.uniforms.u_stop_time.value = 0.;
            pointer.clicked = false;
        }
        shaderMaterial.uniforms.u_stop_time.value += delta;

        renderer.setRenderTarget(renderTargets[1]);
        renderer.render(shaderScene, camera);

        basicMaterial.map = renderTargets[1].texture;

        renderer.setRenderTarget(null);
        renderer.render(mainScene, camera);

        let tmp = renderTargets[0];
        renderTargets[0] = renderTargets[1];
        renderTargets[1] = tmp;
    }
}

function updateSize() {
    shaderMaterial.uniforms.u_ratio.value = window.innerWidth / window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
}
