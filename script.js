
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

// ==========================================
// SETTINGS - CHANGE THESE TO CUSTOMIZE TREE
// ==========================================

const FPS = 60;

const SPIN_SPEED = 0.25;
const TREE_R = 1.5;
const TIERS = 5;

const NUM_ORNAMENTS = 45;
const GARLAND_TURNS = 4.5;

const SNOW_COUNT = 700;

const TREE_HEIGHT = 4.5;

// ==========================================
// SCENE SETUP
// ==========================================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x080d12);

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.set(0, 2.7, 10);
camera.lookAt(0, 2, 0);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

document.getElementById('scene').appendChild(renderer.domElement);

// ==========================================
// LIGHTING
// ==========================================

const ambientLight = new THREE.AmbientLight(0xefc070, 0.7);
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight(0x9bbcff, 2);
moonLight.position.set(-5, 8, 5);
scene.add(moonLight);

const frontLight = new THREE.PointLight(0xffd28a, 30, 15);
frontLight.position.set(3, 5, 5);
scene.add(frontLight);

// ==========================================
// TREE GROUP
// ==========================================

const tree = new THREE.Group();
scene.add(tree);

// ==========================================
// TREE RADIUS
// ==========================================

function radiusAt(y) {

    if (y >= 1) return 0;

    const tier = (y * TIERS) % 1;

    return TREE_R * (1 - y) *
        (0.62 + 0.38 * (1 - tier));
}

// ==========================================
// BUILD TREE
// ==========================================

function buildTree() {

    const geometry = new THREE.BufferGeometry();

    const positions = [];
    const colors = [];

    const greenColors = [
        0x061c12,
        0x092719,
        0x0b351f,
        0x124327,
        0x18552c,
        0x206333
    ];

    // Foliage
    for (let i = 0; i < 10000; i++) {

        const y = Math.random() * 0.98;
        const radius = radiusAt(y);

        const angle = Math.random() * Math.PI * 2;
        const r = radius * (0.8 + Math.random() * 0.2);

        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;

        positions.push(
            x,
            y * TREE_HEIGHT,
            z
        );

        const color = new THREE.Color(
            greenColors[Math.floor(Math.random() * greenColors.length)]
        );

        colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3)
    );

    geometry.setAttribute(
        'color',
        new THREE.Float32BufferAttribute(colors, 3)
    );

    const material = new THREE.PointsMaterial({
        size: 0.045,
        vertexColors: true,
        sizeAttenuation: true
    });

    const foliage = new THREE.Points(geometry, material);

    tree.add(foliage);

    // ======================================
    // TRUNK
    // ======================================

    const trunkGeometry = new THREE.CylinderGeometry(
        0.16,
        0.22,
        0.8,
        16
    );

    const trunkMaterial = new THREE.MeshStandardMaterial({
        color: 0x63391f,
        roughness: 0.9
    });

    const trunk = new THREE.Mesh(
        trunkGeometry,
        trunkMaterial
    );

    trunk.position.y = -0.1;

    tree.add(trunk);

    // ======================================
    // GARLAND
    // ======================================

    const garlandPoints = [];

    const segments = 1000;

    for (let i = 0; i <= segments; i++) {

        const t = i / segments;

        const y = 0.04 + t * 0.86;

        const angle = t * GARLAND_TURNS * Math.PI * 2;

        const r = radiusAt(y) * 1.04 + 0.025;

        garlandPoints.push(
            new THREE.Vector3(
                Math.cos(angle) * r,
                y * TREE_HEIGHT,
                Math.sin(angle) * r
            )
        );
    }

    const garlandGeometry = new THREE.BufferGeometry()
        .setFromPoints(garlandPoints);

    const garlandMaterial = new THREE.LineBasicMaterial({
        color: 0xe5ae37
    });

    const garland = new THREE.Line(
        garlandGeometry,
        garlandMaterial
    );

    tree.add(garland);

    // ======================================
    // ORNAMENTS
    // ======================================

const ORNAMENT_COLORS = [
    0x8b0000, 
    0xb22222, 
    0xdc143c, 
    0xff0000,
    0x806000, 
    0xa67c00, 
    0xb8860b, 
    0xd4af37, 
    0xffd700,
    0x004b23, 
    0x006400, 
    0x008000, 
    0x228b22, 
    0x50c878
];

    const ornamentGeometry = new THREE.SphereGeometry(
        0.075,
        16,
        16
    );

    for (let i = 0; i < NUM_ORNAMENTS; i++) {

        const y = 0.04 + (1 - Math.sqrt(Math.random())) * 0.85;

        const angle = Math.random() * Math.PI * 2;

        const r = radiusAt(y) * 1.04 + 0.035;

        const color = ornamentColors[
            Math.floor(Math.random() * ornamentColors.length)
        ];

        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.55,
            roughness: 0.2,
            emissive: color,
            emissiveIntensity: 0.2
        });

        const ornament = new THREE.Mesh(
            ornamentGeometry,
            material
        );

        ornament.position.set(
            Math.cos(angle) * r,
            y * TREE_HEIGHT,
            Math.sin(angle) * r
        );

        ornament.userData.phase = Math.random() * Math.PI * 2;
        ornament.userData.speed = 1.5 + Math.random() * 2.5;

        tree.add(ornament);

    }

    // ======================================
    // CHRISTMAS STAR
    // ======================================

    const starGeometry = new THREE.OctahedronGeometry(0.22, 0);

    const starMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: 0xffa500,
        emissiveIntensity: 2,
        metalness: 0.8,
        roughness: 0.2
    });

    const star = new THREE.Mesh(
        starGeometry,
        starMaterial
    );

    star.position.y = TREE_HEIGHT + 0.15;

    tree.add(star);

    const starLight = new THREE.PointLight(
        0xffd700,
        15,
        4
    );

    starLight.position.copy(star.position);

    tree.add(starLight);

    tree.userData.star = star;
    tree.userData.starLight = starLight;
}

// ==========================================
// SNOW
// ==========================================

const snowGeometry = new THREE.BufferGeometry();

const snowPositions = [];

const snowSpeeds = [];

for (let i = 0; i < SNOW_COUNT; i++) {

    snowPositions.push(
        (Math.random() - 0.5) * 12,
        Math.random() * 9,
        (Math.random() - 0.5) * 10
    );

    snowSpeeds.push(
        0.5 + Math.random() * 1.5
    );
}

snowGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(snowPositions, 3)
);

const snowMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.035,
    transparent: true,
    opacity: 0.85
});

const snow = new THREE.Points(
    snowGeometry,
    snowMaterial
);

scene.add(snow);

// ==========================================
// UPDATE SNOW
// ==========================================

function updateSnow(delta) {

    const positions = snow.geometry.attributes.position.array;

    for (let i = 0; i < SNOW_COUNT; i++) {

        const index = i * 3;

        positions[index + 1] -= snowSpeeds[i] * delta;

        positions[index] += Math.sin(Date.now() * 0.001 + i) * 0.001;

        if (positions[index + 1] < -1) {

            positions[index + 1] = 9;

            positions[index] = (Math.random() - 0.5) * 12;

        }
    }

    snow.geometry.attributes.position.needsUpdate = true;
}

// ==========================================
// BUILD EVERYTHING
// ==========================================

buildTree();

// ==========================================
// ANIMATION
// ==========================================

const clock = new THREE.Clock();

let elapsed = 0;

function animate() {

    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.05);

    elapsed += delta;

    // Rotate tree
    tree.rotation.y += SPIN_SPEED * delta;

    // Ornament flickering
    tree.children.forEach(object => {

        if (object.geometry &&
            object.geometry.type === 'SphereGeometry') {

            const flicker =
                0.5 + 0.5 * Math.sin(
                    elapsed * object.userData.speed +
                    object.userData.phase
                );

            object.material.emissiveIntensity =
                0.1 + flicker * 0.9;
        }
    });

    // Star flickering
    const starFlicker = 1.2 +
        Math.sin(elapsed * 4) * 0.8;

    tree.userData.star.material.emissiveIntensity = starFlicker;

    tree.userData.starLight.intensity = 10 + starFlicker * 5;

    // Snow
    updateSnow(delta);

    renderer.render(scene, camera);
}

animate();

// ==========================================
// WINDOW RESIZING
// ==========================================

window.addEventListener('resize', () => {

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

});
