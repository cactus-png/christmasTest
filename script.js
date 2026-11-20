
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

// ==========================================
// SETTINGS
// ==========================================

const SETTINGS = {
    STYLE: "hybrid",

    CHARACTER_DENSITY: 0.75,
    BRIGHTNESS: 0.70,

    SPIN_SPEED: 0.35,

    TREE_R: 1.5,
    TIERS: 5,
    TREE_HEIGHT: 4.5,

    NUM_ORNAMENTS: 45,
    GARLAND_TURNS: 4.5,

    SNOW_AMOUNT: 0.60,

    FONT_SIZE: 12
};

// ASCII shading gradient
const SHADE = ".,:;=+*#%@";

// ==========================================
// SCENE SETUP
// ==========================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x080d12);

const camera = new THREE.PerspectiveCamera(
    45, 1, 0.1, 100
);

camera.position.set(0, 2.7, 10);
camera.lookAt(0, 2, 0);

// Hidden 3D renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: false
});

renderer.setPixelRatio(1);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

// Render target for ASCII conversion
const renderTarget = new THREE.WebGLRenderTarget(
    160, 80,
    {
        format: THREE.RGBAFormat,
        type: THREE.UnsignedByteType,
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        depthBuffer: true
    }
);

// Visible ASCII canvas
const canvas = document.createElement('canvas');

canvas.id = 'ascii-canvas';

document.getElementById('scene').appendChild(canvas);

const ctx = canvas.getContext('2d');

// Pixel data
let pixelData = new Uint8Array(160 * 80 * 4);

// ASCII grid
let cols = 160;
let rows = 80;

let cellWidth = 8;
let cellHeight = 13;

// ==========================================
// LIGHTING
// ==========================================

const ambientLight = new THREE.AmbientLight(
    0xffffff, 0.7
);

scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight(
    0x9bbcff, 2
);

moonLight.position.set(-5, 8, 5);

scene.add(moonLight);

const frontLight = new THREE.PointLight(
    0xffd28a, 30, 15
);

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

    const tier = (y * SETTINGS.TIERS) % 1;

    return SETTINGS.TREE_R * (1 - y) *
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
        0x206333,
        0x287b3d,
        0x32904a
    ];

    // Foliage
    for (let i = 0; i < 12000; i++) {

        const y = Math.random() * 0.98;

        const radius = radiusAt(y);

        const angle = Math.random() * Math.PI * 2;

        const r = radius * (
            0.8 + Math.random() * 0.2
        );

        positions.push(
            Math.cos(angle) * r,
            y * SETTINGS.TREE_HEIGHT,
            Math.sin(angle) * r
        );

        const color = new THREE.Color(
            greenColors[
                Math.floor(Math.random() * greenColors.length)
            ]
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

    const foliageMaterial = new THREE.PointsMaterial({
        size: 0.075,
        vertexColors: true,
        sizeAttenuation: true
    });

    const foliage = new THREE.Points(
        geometry,
        foliageMaterial
    );

    tree.add(foliage);

    // ======================================
    // TRUNK
    // ======================================

    const trunkGeometry = new THREE.CylinderGeometry(
        0.16, 0.22, 0.8, 16
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

        const angle =
            t * SETTINGS.GARLAND_TURNS * Math.PI * 2;

        const r = radiusAt(y) * 1.04 + 0.025;

        garlandPoints.push(
            new THREE.Vector3(
                Math.cos(angle) * r,
                y * SETTINGS.TREE_HEIGHT,
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

    const ornamentColors = [
        0xc92828,
        0xf1c40f,
        0x3498db,
        0xe056fd,
        0xffffff,
        0x00d2d3,
        0xff7f50
    ];

    const ornamentGeometry = new THREE.SphereGeometry(
        0.075, 16, 16
    );

    for (let i = 0; i < SETTINGS.NUM_ORNAMENTS; i++) {

        const y = 0.04 +
            (1 - Math.sqrt(Math.random())) * 0.85;

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
            y * SETTINGS.TREE_HEIGHT,
            Math.sin(angle) * r
        );

        ornament.userData.phase = Math.random() * Math.PI * 2;

        ornament.userData.speed =
            1.5 + Math.random() * 2.5;

        tree.add(ornament);
    }

    // ======================================
    // CHRISTMAS STAR
    // ======================================

    const starGeometry = new THREE.OctahedronGeometry(
        0.22, 0
    );

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

    star.position.y = SETTINGS.TREE_HEIGHT + 0.15;

    tree.add(star);

    const starLight = new THREE.PointLight(
        0xffd700, 15, 4
    );

    starLight.position.copy(star.position);

    tree.add(starLight);

    tree.userData.star = star;
    tree.userData.starLight = starLight;
}

// ==========================================
// SNOW
// ==========================================

const SNOW_COUNT = Math.round(700 * SETTINGS.SNOW_AMOUNT);

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
    size: 0.07
});

const snow = new THREE.Points(
    snowGeometry,
    snowMaterial
);

scene.add(snow);

// ==========================================
// UPDATE SNOW
// ==========================================

function updateSnow(delta, elapsed) {

    const positions = snow.geometry.attributes.position.array;

    for (let i = 0; i < SNOW_COUNT; i++) {

        const index = i * 3;

        positions[index + 1] -= snowSpeeds[i] * delta;

        positions[index] +=
            Math.sin(elapsed * 1.5 + i) * 0.001;

        if (positions[index + 1] < -1) {

            positions[index + 1] = 9;

            positions[index] =
                (Math.random() - 0.5) * 12;
        }
    }

    snow.geometry.attributes.position.needsUpdate = true;
}

// ==========================================
// ASCII CHARACTER SELECTION
// ==========================================

function getCharacter(r, g, b) {

    const brightness = Math.min(
        1,
        (0.2126 * r + 0.7152 * g + 0.0722 * b)
        / 255 * SETTINGS.BRIGHTNESS
    );

    // Background removal
    if (brightness < 0.045) return null;

    // Preserve recognizable Christmas colors
    if (r > g * 1.5 && r > b * 1.3) {
        return brightness > 0.55 ? '●' : 'o';
    }

    // Gold decorations
    if (r > 150 && g > 90 && b < 110) {
        return brightness > 0.7 ? '*' : 'o';
    }

    // Snow and bright white objects
    if (r > 190 && g > 190 && b > 190) {
        return brightness > 0.8 ? '*' : '.';
    }

    // Blue ornaments
    if (b > r * 1.4 && b > g * 1.1) {
        return brightness > 0.6 ? '●' : 'o';
    }

    // Green foliage shading
    const index = Math.floor(
        brightness * (SHADE.length - 1)
    );

    return SHADE[
        Math.max(0, Math.min(SHADE.length - 1, index))
    ];
}

// ==========================================
// ASCII RENDERING
// ==========================================

function renderASCII() {

    renderer.setRenderTarget(renderTarget);

    renderer.clear();

    renderer.render(scene, camera);

    renderer.readRenderTargetPixels(
        renderTarget,
        0, 0,
        cols, rows,
        pixelData
    );

    renderer.setRenderTarget(null);

    ctx.fillStyle = '#080d12';

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${SETTINGS.FONT_SIZE}px monospace`;

    ctx.textBaseline = 'top';

    ctx.textAlign = 'center';

    for (let y = 0; y < rows; y++) {

        for (let x = 0; x < cols; x++) {

            const index =
                ((rows - 1 - y) * cols + x) * 4;

            const r = pixelData[index];
            const g = pixelData[index + 1];
            const b = pixelData[index + 2];
            const a = pixelData[index + 3];

            if (a === 0) continue;

            const character = getCharacter(r, g, b);

            if (!character) continue;

            // Character density adjustment
            const hash = (x * 73856093 ^ y * 19349663) >>> 0;

            if (
                hash % 1000 >
                SETTINGS.CHARACTER_DENSITY * 1000
            ) continue;

            // Preserve original RGB color
            ctx.fillStyle = `rgb(${r},${g},${b})`;

            ctx.fillText(
                character,
                x * cellWidth + cellWidth / 2,
                y * cellHeight
            );
        }
    }
}

// ==========================================
// RESIZE
// ==========================================

function resize() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * Math.min(window.devicePixelRatio, 2);
    canvas.height = height * Math.min(window.devicePixelRatio, 2);

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    const dpr = Math.min(window.devicePixelRatio, 2);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    cellWidth = SETTINGS.FONT_SIZE * 0.62;
    cellHeight = SETTINGS.FONT_SIZE * 1.15;

    cols = Math.max(1, Math.floor(width / cellWidth));
    rows = Math.max(1, Math.floor(height / cellHeight));

    renderTarget.setSize(cols, rows);

    pixelData = new Uint8Array(cols * rows * 4);

    camera.aspect = width / height;

    camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);

// ==========================================
// BUILD SCENE
// ==========================================

buildTree();

resize();

// ==========================================
// ANIMATION
// ==========================================

const clock = new THREE.Clock();

let elapsed = 0;

function animate() {

    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.05);

    elapsed += delta;

    // Tree rotation
    tree.rotation.y += SETTINGS.SPIN_SPEED * delta;

    // Ornament flickering
    tree.children.forEach(object => {

        if (
            object.geometry &&
            object.geometry.type === 'SphereGeometry'
        ) {

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
    const starFlicker =
        1.2 + Math.sin(elapsed * 4) * 0.8;

    tree.userData.star.material.emissiveIntensity =
        starFlicker;

    tree.userData.starLight.intensity =
        10 + starFlicker * 5;

    // Snow
    updateSnow(delta, elapsed);

    // Convert 3D scene to ASCII
    renderASCII();
}

animate();
