import { OrbitControls } from "./jsm/OrbitControls.js";

let state = {
    scene: undefined,
    camera: undefined,
    renderer: undefined,
    controls: undefined,
    model: undefined,
    joystick: {
        isActivate: false
    }
}

const init = () => {
    state.scene = new THREE.Scene();
    state.scene.background = new THREE.Color( 0xa0a0a0 );
    state.scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );

    const clock = new THREE.Clock();


    
    state.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    state.camera.position.set( 0, 2, 3 );

    state.renderer = new THREE.WebGLRenderer();
    state.renderer.setSize( window.innerWidth, window.innerHeight );
    document.querySelector("#model").appendChild( state.renderer.domElement );
    
    const dirLight = new THREE.DirectionalLight( 0xf7e5df );
    dirLight.position.set( 3, 1000, 2500 );
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = - 2;
    dirLight.shadow.camera.left = - 2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = 0.06;
    dirLight.shadow.camera.far = 4000;
    state.scene.add(dirLight);
    
    const hemiLight = new THREE.HemisphereLight( 0x707070, 0x444444 );
    hemiLight.position.set( 0, 120, 0 );
    state.scene.add(hemiLight);
    
    const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ),new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: true} ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    state.scene.add(mesh);
    
    
    //xstate.controls = new OrbitControls( state.camera, state.renderer.domElement );
    function animate() {
        requestAnimationFrame( animate );
        //state.controls.update();
    
        state.renderer.render( state.scene, state.camera );
    }
    animate();
    
}

const addPlayer = () => {
    const loader = new THREE.GLTFLoader();
    loader.load('/gltf/ball.glb', ( gltf ) => {
        state.model = gltf.scene
        state.model.position.set(0,0,0);
        state.scene.add( state.model );
    });
    
}

const joystick = {
    mousedown: (e) => {
        console.log(e)
        let joystickBody = document.querySelector("#joystick")
        let joystickControl = document.querySelector("#joystick-control")
        joystickBody.classList.remove('d-none')
        joystickControl.classList.remove('d-none')

        state.joystick.isActivate = true

        joystickBody.style.top = `${e.offsetY-12}px`
        joystickBody.style.left = `${e.offsetX-12}px`

        joystickControl.style.top = `${e.offsetY-12}px`
        joystickControl.style.left = `${e.offsetX-12}px`
    },
    mouseup: (e) => {
        let joystickBody = document.querySelector("#joystick")
        let joystickControl = document.querySelector("#joystick-control")
        let joystickLine = document.querySelector("#joystick-line")

        state.joystick.isActivate = false

        joystickBody.classList.add('d-none')
        joystickControl.classList.add('d-none')
        joystickLine.classList.add('d-none')

    },
    move: (e) => {
        if (state.joystick.isActivate) {
            let joystickControl = document.querySelector("#joystick-control")
            let joystickBody = document.querySelector("#joystick")
            let joystickLine = document.querySelector("#joystick-line")

            joystickLine.classList.remove('d-none')

            let controlPosition = {
                x: e.clientX-9,
                y: e.clientY-9
            }

            let joystickPosition = {
                x: Number(joystickBody.style.left.split('px')[0])+12,
                y: Number(joystickBody.style.top.split('px')[0])+12
            }

            let radian = joystick.getAngle(controlPosition, joystickPosition)

            joystickControl.style.top = `${controlPosition.y}px`
            joystickControl.style.left = `${controlPosition.x}px`

            joystickLine.querySelector('line').setAttribute("x1", e.clientX);
            joystickLine.querySelector('line').setAttribute("y1", e.clientY);

            joystickLine.querySelector('line').setAttribute("x2", joystickPosition.x);
            joystickLine.querySelector('line').setAttribute("y2", joystickPosition.y);
        }
    },
    getAngle: (p1, p2) => {
        if (state.joystick.isActivate) {
            let defX =  p1.x - p2.x;
            let defY =  p1.y - p2.y;
            let angle = Math.atan2(defY, defX);
            
            return angle;
        }
    },
}


document.addEventListener("mousedown", joystick.mousedown);
document.addEventListener("mouseup", joystick.mouseup);
document.addEventListener("mousemove", joystick.move);

init()
addPlayer()
