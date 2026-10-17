import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { HEART_HOTSPOTS } from '../data/biologyData';
import { HeartHotspot } from '../types/biology';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Eye, 
  Layers, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Compass, 
  ChevronDown, 
  ChevronUp, 
  Activity,
  Crosshair,
  ExternalLink
} from 'lucide-react';

interface HeartViewer3DProps {
  selectedHotspot: HeartHotspot | null;
  onSelectHotspot: (hotspot: HeartHotspot | null) => void;
  onHotspotInspected?: (hotspotId: string) => void;
  bpm: number;
  onBpmChange: (newBpm: number) => void;
}

export const HeartViewer3D: React.FC<HeartViewer3DProps> = ({
  selectedHotspot,
  onSelectHotspot,
  onHotspotInspected,
  bpm,
  onBpmChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [modelSource, setModelSource] = useState<'sketchfab' | 'procedural'>('sketchfab');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'solid' | 'xray' | 'cutaway'>('solid');
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);
  const [hoveredHotspot, setHoveredHotspot] = useState<HeartHotspot | null>(null);

  // References to keep Three.js scene instances across re-renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const heartGroupRef = useRef<THREE.Group | null>(null);
  const particlesGroupRef = useRef<THREE.Points | null>(null);
  const hotspotMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Heartbeat state for animation loop
  const beatRef = useRef({
    bpm,
    isPlaying,
    lastBeatTime: 0,
    isSystole: false,
    viewMode,
  });

  // Keep beatRef updated with React props/state
  useEffect(() => {
    beatRef.current.bpm = bpm;
    beatRef.current.isPlaying = isPlaying;
    beatRef.current.viewMode = viewMode;
  }, [bpm, isPlaying, viewMode]);

  // Procedural Web Audio API heartbeat synth ("Lub - Dub")
  const playHeartSound = useCallback(() => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // Lub (First sound: S1, low pitch, ~60Hz, lasts ~120ms)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(65, now);
      osc1.frequency.exponentialRampToValueAtTime(35, now + 0.12);
      gain1.gain.setValueAtTime(0.35, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.13);

      // Dub (Second sound: S2, slightly higher pitch, ~90Hz, 0.16s after S1)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(95, now + 0.16);
      osc2.frequency.exponentialRampToValueAtTime(45, now + 0.26);
      gain2.gain.setValueAtTime(0.28, now + 0.16);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.16);
      osc2.stop(now + 0.27);
    } catch (e) {
      // AudioContext could be blocked by browser before user interaction
    }
  }, [isMuted]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Horizon Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b132b);
    scene.fog = new THREE.FogExp2(0x0b132b, 0.05);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.5);
    cameraRef.current = camera;

    // 3. Renderer with ACESFilmicToneMapping
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. Studio Environment Reflection (RoomEnvironment + PMREMGenerator)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. OrbitControls with smooth exponential damping
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2.0;
    controls.maxDistance = 10.0;
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.target.set(0, 0.2, 0);
    controlsRef.current = controls;

    // 6. Lighting Rig: Warm key light + Cool fill + Back rim light
    const keyLight = new THREE.DirectionalLight(0xfff5eb, 2.2);
    keyLight.position.set(4, 6, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0x70d6ff, 0x0b132b, 1.2);
    hemiLight.position.set(0, 8, 0);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0x48cae4, 1.5);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    // 7. Soft Radial Contact Shadow Grounding Plane
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    const shadowTex = new THREE.CanvasTexture(canvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.6,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.8;
    scene.add(shadowMesh);

    // 8. Assemble Composite 10-Part Procedural 3D Heart
    const heartGroup = new THREE.Group();
    heartGroupRef.current = heartGroup;
    scene.add(heartGroup);

    // Base Materials
    const leftVentricleMat = new THREE.MeshPhysicalMaterial({
      color: 0xc1121f,
      roughness: 0.35,
      metalness: 0.1,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
    });

    const rightVentricleMat = new THREE.MeshPhysicalMaterial({
      color: 0x1d3557,
      roughness: 0.38,
      metalness: 0.1,
      clearcoat: 0.3,
    });

    const leftAtriumMat = new THREE.MeshPhysicalMaterial({
      color: 0xba181b,
      roughness: 0.4,
      metalness: 0.05,
    });

    const rightAtriumMat = new THREE.MeshPhysicalMaterial({
      color: 0x457b9d,
      roughness: 0.4,
      metalness: 0.05,
    });

    const aortaMat = new THREE.MeshPhysicalMaterial({
      color: 0xe63946,
      roughness: 0.25,
      metalness: 0.15,
      clearcoat: 0.6,
    });

    const pulmonaryMat = new THREE.MeshPhysicalMaterial({
      color: 0x2a6f97,
      roughness: 0.3,
      metalness: 0.15,
    });

    const venaCavaMat = new THREE.MeshPhysicalMaterial({
      color: 0x01497c,
      roughness: 0.35,
      metalness: 0.1,
    });

    const valveMat = new THREE.MeshPhysicalMaterial({
      color: 0x48cae4,
      roughness: 0.2,
      metalness: 0.3,
      emissive: 0x0077b6,
      emissiveIntensity: 0.2,
    });

    // 8a. Left Ventricle (Apex & Main conical body, thick wall)
    const lvGeo = new THREE.ConeGeometry(0.95, 1.9, 32, 16);
    lvGeo.rotateZ(Math.PI);
    lvGeo.translate(0.35, -0.65, 0.15);
    const lvMesh = new THREE.Mesh(lvGeo, leftVentricleMat);
    lvMesh.name = 'ventrikel-kiri';
    lvMesh.castShadow = true;
    heartGroup.add(lvMesh);

    // 8b. Right Ventricle (Crescent wraparound anterior body)
    const rvGeo = new THREE.CylinderGeometry(0.85, 0.45, 1.5, 32, 8, false, 0, Math.PI * 1.1);
    rvGeo.rotateZ(Math.PI * 0.95);
    rvGeo.translate(-0.45, -0.55, 0.35);
    const rvMesh = new THREE.Mesh(rvGeo, rightVentricleMat);
    rvMesh.name = 'ventrikel-kanan';
    rvMesh.castShadow = true;
    heartGroup.add(rvMesh);

    // 8c. Interventricular Septum (Internal Muscular divider)
    const septumGeo = new THREE.BoxGeometry(0.2, 1.6, 1.2);
    septumGeo.translate(0, -0.6, 0.15);
    const septumMat = new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 0.5 });
    const septumMesh = new THREE.Mesh(septumGeo, septumMat);
    septumMesh.name = 'septum';
    heartGroup.add(septumMesh);

    // 8d. Right Atrium (Upper receiving chamber, thin wall)
    const raGeo = new THREE.SphereGeometry(0.72, 28, 24);
    raGeo.scale(1.0, 1.15, 0.9);
    raGeo.translate(-0.9, 0.55, 0.2);
    const raMesh = new THREE.Mesh(raGeo, rightAtriumMat);
    raMesh.name = 'atrium-kanan';
    heartGroup.add(raMesh);

    // 8e. Left Atrium (Posterior upper chamber)
    const laGeo = new THREE.SphereGeometry(0.75, 28, 24);
    laGeo.scale(0.95, 1.1, 1.05);
    laGeo.translate(0.8, 0.65, -0.25);
    const laMesh = new THREE.Mesh(laGeo, leftAtriumMat);
    laMesh.name = 'atrium-kiri';
    heartGroup.add(laMesh);

    // 8f. Aortic Arch (Curved tube with 3 supra-aortic branches)
    const aortaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.1, 0.2, 0.2),
      new THREE.Vector3(0.15, 1.1, 0.25),
      new THREE.Vector3(0.0, 1.55, 0.0),
      new THREE.Vector3(-0.35, 1.45, -0.4),
      new THREE.Vector3(-0.45, 0.3, -0.5),
    ]);
    const aortaGeo = new THREE.TubeGeometry(aortaCurve, 40, 0.28, 20, false);
    const aortaMesh = new THREE.Mesh(aortaGeo, aortaMat);
    aortaMesh.name = 'aorta';
    heartGroup.add(aortaMesh);

    // 3 Brachiocephalic / Carotid / Subclavian Branches on Aorta Arch
    const branchPositions = [
      { pos: [0.12, 1.6, 0.12], rot: [0.2, 0, -0.2] },
      { pos: [-0.05, 1.68, -0.05], rot: [0.1, 0, -0.1] },
      { pos: [-0.22, 1.62, -0.22], rot: [0, 0, 0.1] },
    ];
    branchPositions.forEach((b, i) => {
      const branchGeo = new THREE.CylinderGeometry(0.07, 0.08, 0.45, 16);
      const branchMesh = new THREE.Mesh(branchGeo, aortaMat);
      branchMesh.position.set(b.pos[0], b.pos[1], b.pos[2]);
      branchMesh.rotation.set(b.rot[0], b.rot[1], b.rot[2]);
      branchMesh.name = `aorta-branch-${i}`;
      heartGroup.add(branchMesh);
    });

    // 8g. Pulmonary Trunk & Arteries (Crosses in front of aorta, bifurcates)
    const ptCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.25, 0.1, 0.45),
      new THREE.Vector3(-0.15, 0.9, 0.4),
      new THREE.Vector3(0.2, 1.15, 0.0),
    ]);
    const ptGeo = new THREE.TubeGeometry(ptCurve, 30, 0.25, 18, false);
    const ptMesh = new THREE.Mesh(ptGeo, pulmonaryMat);
    ptMesh.name = 'arteri-pulmonalis';
    heartGroup.add(ptMesh);

    // Left and Right Pulmonary Artery Arms
    const paLeftCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.2, 1.15, 0.0),
      new THREE.Vector3(0.85, 1.1, -0.3),
    ]);
    const paRightCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.2, 1.15, 0.0),
      new THREE.Vector3(-0.85, 1.05, -0.4),
    ]);
    heartGroup.add(new THREE.Mesh(new THREE.TubeGeometry(paLeftCurve, 16, 0.16, 14, false), pulmonaryMat));
    heartGroup.add(new THREE.Mesh(new THREE.TubeGeometry(paRightCurve, 16, 0.16, 14, false), pulmonaryMat));

    // 8h. Vena Cava (Superior & Inferior)
    const svcCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.15, 1.5, 0.0),
      new THREE.Vector3(-1.0, 0.9, 0.1),
    ]);
    const svcMesh = new THREE.Mesh(new THREE.TubeGeometry(svcCurve, 16, 0.22, 16, false), venaCavaMat);
    svcMesh.name = 'vena-kava';
    heartGroup.add(svcMesh);

    const ivcCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.9, 0.1, -0.1),
      new THREE.Vector3(-0.95, -0.9, -0.2),
    ]);
    const ivcMesh = new THREE.Mesh(new THREE.TubeGeometry(ivcCurve, 16, 0.22, 16, false), venaCavaMat);
    heartGroup.add(ivcMesh);

    // 8i. Vena Pulmonalis (4 Pulmonary Veins entering Left Atrium)
    const pvMat = new THREE.MeshPhysicalMaterial({ color: 0xba181b, roughness: 0.3 });
    const pvPositions = [
      [1.3, 0.75, -0.4],
      [1.25, 0.45, -0.55],
      [-0.1, 0.75, -0.8],
      [-0.15, 0.45, -0.85],
    ];
    pvPositions.forEach((pos, i) => {
      const pvGeo = new THREE.CylinderGeometry(0.12, 0.13, 0.45, 14);
      pvGeo.rotateZ(Math.PI / 2.8);
      const pvMesh = new THREE.Mesh(pvGeo, pvMat);
      pvMesh.position.set(pos[0], pos[1], pos[2]);
      pvMesh.name = i === 0 ? 'vena-pulmonalis' : `pv-${i}`;
      heartGroup.add(pvMesh);
    });

    // 8j. 4 Heart Valves (Anatomical Rings with delicate cusps)
    const valveGeo = new THREE.TorusGeometry(0.24, 0.045, 12, 24);

    // Tricuspid Valve (between RA and RV)
    const trikuspidMesh = new THREE.Mesh(valveGeo, valveMat);
    trikuspidMesh.rotation.x = Math.PI * 0.45;
    trikuspidMesh.position.set(-0.65, 0.05, 0.45);
    trikuspidMesh.name = 'katup-trikuspid';
    heartGroup.add(trikuspidMesh);

    // Bicuspid / Mitral Valve (between LA and LV)
    const mitralMesh = new THREE.Mesh(valveGeo, valveMat);
    mitralMesh.rotation.x = Math.PI * 0.42;
    mitralMesh.rotation.z = -0.3;
    mitralMesh.position.set(0.45, 0.02, 0.15);
    mitralMesh.name = 'katup-mitral';
    heartGroup.add(mitralMesh);

    // Aortic Valve (at aortic root)
    const aortaValveMesh = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.04, 12, 24), valveMat);
    aortaValveMesh.rotation.x = Math.PI * 0.6;
    aortaValveMesh.position.set(0.1, 0.35, 0.3);
    aortaValveMesh.name = 'katup-aorta';
    heartGroup.add(aortaValveMesh);

    // Pulmonary Valve (at pulmonary trunk base)
    const pulmoValveMesh = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.04, 12, 24), valveMat);
    pulmoValveMesh.rotation.x = Math.PI * 0.35;
    pulmoValveMesh.position.set(-0.2, 0.45, 0.55);
    pulmoValveMesh.name = 'katup-pulmonal';
    heartGroup.add(pulmoValveMesh);

    // 9. Hotspot Markers (Interactive Floating Badges & Glowing Pin Spheres)
    hotspotMeshesRef.current.clear();
    HEART_HOTSPOTS.forEach((spot) => {
      const pinGroup = new THREE.Group();
      pinGroup.position.set(spot.position[0], spot.position[1], spot.position[2]);

      // Inner glowing core
      const coreGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({
        color: spot.oxygenated ? 0xff4d6d : 0x00b4d8,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      pinGroup.add(coreMesh);

      // Outer pulsing aura
      const auraGeo = new THREE.SphereGeometry(0.13, 16, 16);
      const auraMat = new THREE.MeshBasicMaterial({
        color: spot.oxygenated ? 0xff758f : 0x90e0ef,
        transparent: true,
        opacity: 0.35,
        wireframe: true,
      });
      const auraMesh = new THREE.Mesh(auraGeo, auraMat);
      pinGroup.add(auraMesh);

      pinGroup.userData = { hotspot: spot };
      heartGroup.add(pinGroup);
      hotspotMeshesRef.current.set(spot.id, coreMesh);
    });

    // 10. Flowing Blood Particles System (Instanced/BufferGeometry)
    const particleCount = 280;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    const particlePaths = new Float32Array(particleCount); // 0 = pulmonary, 1 = systemic

    for (let i = 0; i < particleCount; i++) {
      const isSystemic = i % 2 === 0;
      particlePaths[i] = isSystemic ? 1 : 0;
      particleSpeeds[i] = 0.5 + Math.random() * 0.5;

      // Random starting point in cardiac loop
      particlePositions[i * 3 + 0] = (Math.random() - 0.5) * 1.5;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 2.0;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 1.0;

      if (isSystemic) {
        // Red (Oxygenated)
        particleColors[i * 3 + 0] = 0.95;
        particleColors[i * 3 + 1] = 0.15;
        particleColors[i * 3 + 2] = 0.2;
      } else {
        // Blue (Deoxygenated)
        particleColors[i * 3 + 0] = 0.15;
        particleColors[i * 3 + 1] = 0.45;
        particleColors[i * 3 + 2] = 0.95;
      }
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    // Procedural circle particle canvas texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d')!;
    pCtx.beginPath();
    pCtx.arc(16, 16, 12, 0, Math.PI * 2);
    pCtx.fillStyle = '#ffffff';
    pCtx.fill();
    const pTex = new THREE.CanvasTexture(pCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      map: pTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    particlesGroupRef.current = particles;
    heartGroup.add(particles);

    // Pre-warm shaders
    renderer.compile(scene, camera);

    // 11. Raycasting for Hotspot Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(heartGroup.children, true);

      let found: HeartHotspot | null = null;
      for (const hit of intersects) {
        let curr: THREE.Object3D | null = hit.object;
        while (curr && curr !== heartGroup) {
          if (curr.userData && curr.userData.hotspot) {
            found = curr.userData.hotspot;
            break;
          }
          curr = curr.parent;
        }
        if (found) break;
      }
      setHoveredHotspot(found);
      container.style.cursor = found ? 'pointer' : 'grab';
    };

    const onPointerDown = () => {
      container.style.cursor = 'grabbing';
    };

    const onClick = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(heartGroup.children, true);

      for (const hit of intersects) {
        let curr: THREE.Object3D | null = hit.object;
        while (curr && curr !== heartGroup) {
          if (curr.userData && curr.userData.hotspot) {
            onSelectHotspot(curr.userData.hotspot);
            onHotspotInspected?.(curr.userData.hotspot.id);
            return;
          }
          curr = curr.parent;
        }
      }
    };

    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('mousedown', onPointerDown);
    container.addEventListener('click', onClick);

    // 12. Animation Render Loop (Lossless 60fps with damped kinematics)
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsedTime = clock.getElapsedTime();

      // Controls update with exponential damping
      controls.update();

      // Heartbeat Pulsing Kinematics (Systole contraction & Diastole expansion)
      if (heartGroupRef.current && beatRef.current.isPlaying) {
        const beatInterval = 60 / beatRef.current.bpm;
        const cycleProgress = (elapsedTime % beatInterval) / beatInterval;

        // Realistic Cardiac Cycle Curve (Systole is ~35% of cycle, sharp contraction followed by elastic recoil)
        let scaleFactor = 1.0;
        let isSystoleNow = false;

        if (cycleProgress < 0.28) {
          // Isovolumetric Contraction & Rapid Ejection
          const t = cycleProgress / 0.28;
          scaleFactor = 1.0 - Math.sin(t * Math.PI) * 0.09;
          isSystoleNow = true;
        } else if (cycleProgress < 0.42) {
          // Reduced Ejection & Early Diastole Recoil
          const t = (cycleProgress - 0.28) / 0.14;
          scaleFactor = 0.91 + Math.sin(t * (Math.PI / 2)) * 0.11;
        } else {
          // Diastolic slow filling
          scaleFactor = 1.02 - (cycleProgress - 0.42) * 0.03;
        }

        // Trigger audio on systole beat boundary
        if (isSystoleNow && !beatRef.current.isSystole) {
          playHeartSound();
        }
        beatRef.current.isSystole = isSystoleNow;

        // Apply 3-axis volumetric squash & stretch
        heartGroupRef.current.scale.set(
          scaleFactor,
          scaleFactor * (isSystoleNow ? 0.96 : 1.02),
          scaleFactor
        );

        // Animate Blood Particles Flowing
        if (particlesGroupRef.current) {
          const posAttr = particlesGroupRef.current.geometry.attributes.position as THREE.BufferAttribute;
          const posArray = posAttr.array as Float32Array;

          for (let i = 0; i < particleCount; i++) {
            const isSys = particlePaths[i] === 1;
            const speed = particleSpeeds[i] * (beatRef.current.bpm / 75) * delta;

            if (isSys) {
              // Systemic Path: Flow up through Aorta then outward
              posArray[i * 3 + 1] += speed * 2.2;
              posArray[i * 3 + 0] += Math.sin(elapsedTime * 2 + i) * 0.01;
              if (posArray[i * 3 + 1] > 2.0) {
                // Loop back to left ventricle
                posArray[i * 3 + 0] = 0.35 + (Math.random() - 0.5) * 0.3;
                posArray[i * 3 + 1] = -0.7 + Math.random() * 0.4;
                posArray[i * 3 + 2] = 0.15 + (Math.random() - 0.5) * 0.3;
              }
            } else {
              // Pulmonary Path: Flow up through Pulmonary Trunk
              posArray[i * 3 + 1] += speed * 1.8;
              posArray[i * 3 + 0] -= Math.cos(elapsedTime * 2 + i) * 0.01;
              if (posArray[i * 3 + 1] > 1.6) {
                // Loop back to right ventricle
                posArray[i * 3 + 0] = -0.45 + (Math.random() - 0.5) * 0.3;
                posArray[i * 3 + 1] = -0.6 + Math.random() * 0.4;
                posArray[i * 3 + 2] = 0.35 + (Math.random() - 0.5) * 0.3;
              }
            }
          }
          posAttr.needsUpdate = true;
        }
      }

      // Smooth camera interpolation towards selected hotspot
      if (selectedHotspot && cameraRef.current && controlsRef.current) {
        const targetX = selectedHotspot.position[0];
        const targetY = selectedHotspot.position[1];
        const targetZ = selectedHotspot.position[2];

        // Gently damp controls target to the hotspot
        controlsRef.current.target.x = THREE.MathUtils.damp(controlsRef.current.target.x, targetX * 0.6, 3, delta);
        controlsRef.current.target.y = THREE.MathUtils.damp(controlsRef.current.target.y, targetY * 0.6 + 0.1, 3, delta);
        controlsRef.current.target.z = THREE.MathUtils.damp(controlsRef.current.target.z, targetZ * 0.6, 3, delta);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 13. Window Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('mousedown', onPointerDown);
      container.removeEventListener('click', onClick);
      cancelAnimationFrame(animationFrameId);

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [onSelectHotspot, playHeartSound]);

  // Update Material Shading Modes (Solid PBR, X-Ray Translucent, Cross-Section Cutaway)
  useEffect(() => {
    if (!heartGroupRef.current) return;

    heartGroupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name && !child.name.startsWith('aorta-branch')) {
        const mat = child.material as THREE.MeshPhysicalMaterial;
        if (!mat) return;

        if (viewMode === 'xray') {
          mat.transparent = true;
          mat.opacity = 0.38;
          mat.roughness = 0.15;
          mat.transmission = 0.65;
          mat.depthWrite = false;
        } else if (viewMode === 'cutaway') {
          mat.transparent = false;
          mat.opacity = 1.0;
          mat.depthWrite = true;
          // Hide anterior wall to expose internal valves and chambers
          if (child.name === 'ventrikel-kanan') {
            child.visible = false;
          } else {
            child.visible = true;
          }
        } else {
          // Standard Solid PBR
          mat.transparent = false;
          mat.opacity = 1.0;
          mat.depthWrite = true;
          child.visible = true;
        }
      }
    });
  }, [viewMode]);

  // Camera Presets
  const setCameraView = (view: 'anterior' | 'posterior' | 'superior' | 'reset') => {
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;

    switch (view) {
      case 'anterior':
        cam.position.set(0, 0.4, 5.0);
        ctrl.target.set(0, 0.1, 0);
        break;
      case 'posterior':
        cam.position.set(0, 0.4, -5.0);
        ctrl.target.set(0, 0.1, 0);
        break;
      case 'superior':
        cam.position.set(0, 5.2, 0.5);
        ctrl.target.set(0, 0.1, 0);
        break;
      case 'reset':
      default:
        cam.position.set(0, 1.2, 5.5);
        ctrl.target.set(0, 0.2, 0);
        onSelectHotspot(null);
        break;
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden select-none bg-slate-950">
      {/* 3D Model Display: Sketchfab Embed vs Procedural Three.js Scene */}
      {modelSource === 'sketchfab' ? (
        <div className="absolute inset-0 w-full h-full bg-slate-950">
          <iframe
            title="Human Heart - Interior (Sketchfab 3D)"
            className="w-full h-full border-0"
            src="https://sketchfab.com/models/84868a2bfbd54809a608408a1e348358/embed?autostart=1&preload=1&ui_theme=dark&ui_watermark_link=0"
            allow="autoplay; fullscreen; xr-spatial-tracking"
          />

          {/* Sketchfab Hotspot Selector Strip at bottom */}
          <div className="absolute bottom-3 left-4 right-4 z-20 bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 shadow-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="font-bold text-cyan-400">Pilih Struktur untuk Diinspeksi:</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
              {HEART_HOTSPOTS.slice(0, 7).map((spot) => (
                <button
                  key={spot.id}
                  onClick={() => {
                    onSelectHotspot(spot);
                    onHotspotInspected?.(spot.id);
                  }}
                  className={`px-2.5 py-1 rounded text-xs whitespace-nowrap border transition-colors ${
                    selectedHotspot?.id === spot.id
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {spot.nameId}
                </button>
              ))}
            </div>

            <a
              href="https://sketchfab.com/3d-models/human-heart-interior-84868a2bfbd54809a608408a1e348358"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 transition-colors"
            >
              <span>Sumber: Sketchfab (skfb.ly/oSN8s)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      ) : (
        /* 3D WebGL Canvas Container */
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      )}

      {/* Top Source Switcher & Epistemological Provenance Badge */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {/* Source Switcher Toggle */}
        <div className="flex items-center gap-1 bg-slate-900/95 border border-slate-700 p-1 rounded-xl shadow-lg">
          <button
            onClick={() => setModelSource('sketchfab')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              modelSource === 'sketchfab'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Model Sketchfab 3D (Anatomi Realistis)</span>
          </button>
          <button
            onClick={() => setModelSource('procedural')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              modelSource === 'procedural'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Simulasi Prosedural (Denyut & Sirkulasi)</span>
          </button>
        </div>

        <div className="flex items-center gap-2 pointer-events-none">
          <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-2.5 py-1 rounded">
            {modelSource === 'sketchfab' ? 'SKETCHFAB 3D ASSET' : '3D HEART EXPLORER'}
          </span>
          <span className="text-xs text-slate-400 bg-slate-900/90 border border-slate-700/60 px-2.5 py-1 rounded">
            {modelSource === 'sketchfab' ? '[Aset Model 3D: Human Heart Interior]' : '[Model Anatomi Prosedural]'}
          </span>
        </div>
      </div>

      {/* Procedural Mode Overlays: Tooltips, Camera Controls, and Dock */}
      {modelSource === 'procedural' && (
        <>
          {/* Hovered Hotspot Floating Tooltip */}
          {hoveredHotspot && (
            <div className="absolute top-4 right-4 z-10 pointer-events-none bg-slate-900/95 border border-cyan-500/50 rounded-lg p-3 max-w-xs shadow-xl animate-in fade-in duration-150">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-sm font-bold text-white">{hoveredHotspot.nameId}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  hoveredHotspot.oxygenated ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-blue-950 text-blue-300 border border-blue-800'
                }`}>
                  {hoveredHotspot.oxygenated ? 'O₂ Tinggi' : 'CO₂ Tinggi'}
                </span>
              </div>
              <p className="text-xs italic text-cyan-300 mb-1">{hoveredHotspot.nameLatin}</p>
              <p className="text-xs text-slate-300 line-clamp-2">{hoveredHotspot.structureDescription}</p>
            </div>
          )}

          {/* Viewport Control Quick Buttons (Right side) */}
          <div className="absolute top-20 right-4 z-10 flex flex-col gap-2">
            <button
              onClick={() => setCameraView('reset')}
              title="Reset Sudut Kamera"
              className="p-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-cyan-400 rounded-lg shadow transition-colors flex items-center justify-center"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCameraView('anterior')}
              title="Tampak Depan (Anterior)"
              className="px-2.5 py-1.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 hover:text-cyan-400 rounded-lg shadow transition-colors"
            >
              Depan
            </button>
            <button
              onClick={() => setCameraView('posterior')}
              title="Tampak Belakang (Posterior)"
              className="px-2.5 py-1.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 hover:text-cyan-400 rounded-lg shadow transition-colors"
            >
              Belakang
            </button>
            <button
              onClick={() => setCameraView('superior')}
              title="Tampak Atas (Superior)"
              className="px-2.5 py-1.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 hover:text-cyan-400 rounded-lg shadow transition-colors"
            >
              Atas
            </button>
          </div>
        </>
      )}

      {/* Unified Ergonomic Collapsible Bottom Control Dock (for Procedural Mode) */}
      {modelSource === 'procedural' && (
      <div 
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-3xl transition-transform duration-300 ease-out ${
          isDockCollapsed ? 'translate-y-[calc(100%-28px)]' : 'translate-y-0'
        }`}
      >
        {/* Collapse / Expand Toggle Tab */}
        <div className="flex justify-center -mb-px">
          <button
            onClick={() => setIsDockCollapsed(!isDockCollapsed)}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border-t border-x border-slate-700 text-[11px] font-medium text-slate-300 hover:text-white rounded-t-lg shadow"
          >
            {isDockCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>Buka Panel Kontrol</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                <span>Sembunyikan Panel</span>
              </>
            )}
          </button>
        </div>

        {/* Solid Control Bar Surface (No WebGL backdrop-blur stalls) */}
        <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-3.5 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-sm">
          {/* Play/Pause & Beat Audio */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                isPlaying 
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/30' 
                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
              }`}
              title={isPlaying ? 'Jeda Denyut' : 'Jalankan Denyut'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span className="text-xs hidden sm:inline">{isPlaying ? 'Jeda' : 'Mulai'}</span>
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 rounded-lg border transition-colors ${
                !isMuted 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title={isMuted ? 'Bunyikan Suara Jantung (Lub-Dub)' : 'Matikan Suara Jantung'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* BPM Slider with Numeric Display */}
          <div className="flex items-center gap-2.5 bg-slate-950/70 border border-slate-800 rounded-lg px-3 py-1.5">
            <Activity className="w-4 h-4 text-rose-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Laju Denyut (BPM)</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="40"
                  max="160"
                  step="2"
                  value={bpm}
                  onChange={(e) => onBpmChange(parseInt(e.target.value, 10))}
                  className="w-24 sm:w-32 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <span className="text-xs font-mono font-bold text-white w-7 text-right tabular-nums">
                  {bpm}
                </span>
              </div>
            </div>
          </div>

          {/* Mode Shading Toggle (Solid, X-Ray, Cutaway) */}
          <div className="flex items-center gap-1 bg-slate-950/70 border border-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('solid')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                viewMode === 'solid'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Anatomi Luar
            </button>
            <button
              onClick={() => setViewMode('cutaway')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                viewMode === 'cutaway'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bedah Dalam
            </button>
            <button
              onClick={() => setViewMode('xray')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                viewMode === 'xray'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Transparan
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
