import React, { Suspense, useRef, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useNavigate } from "react-router-dom"; // 👈 Importa el hook

// Precarga para optimizar tiempos
useGLTF.preload("/models/house.glb");

// Componente que carga el modelo y posiciona cámara/controles automáticamente
function SceneAutoFit({ controlsRef, cameraRef }) {
  const gltf = useGLTF("/models/house.glb");
  const { camera } = useThree();

  useEffect(() => {
    if (!gltf?.scene) return;

    const scene = gltf.scene;

    // Bounding box del modelo
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    // Calcular distancia necesaria para encuadrar con la FOV actual
    const fov = camera.fov * (Math.PI / 180);
    const fitHeightDistance = maxDim / 2 / Math.tan(fov / 2);
    const fitWidthDistance = fitHeightDistance / camera.aspect;
    const distance = Math.max(fitHeightDistance, fitWidthDistance) * 1.25; // padding 25%

    // Posicionar la cámara en dirección diagonal (x,y,z) desde el centro
    const direction = new THREE.Vector3(1, 1, 1).normalize();
    const newCamPos = center.clone().add(direction.multiplyScalar(distance));

    camera.position.copy(newCamPos);
    camera.near = Math.max(0.01, maxDim / 1000);
    camera.far = Math.max(1000, maxDim * 200);
    camera.updateProjectionMatrix();

    // Ajustar target de los controles al centro del modelo
    if (controlsRef?.current) {
      controlsRef.current.target.copy(center);
      controlsRef.current.update();
    }

    // (No reubicamos la malla; trabajamos con coordenadas originales)
  }, [gltf, camera, controlsRef]);

  // Renderiza el modelo
  return <primitive object={gltf.scene} />;
}

export default function Home() {
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);

  // límites de zoom (en unidades de distancia desde target)
  const MIN_DISTANCE = 0.5;
  const MAX_DISTANCE = 200;

  // Maneja el scroll cuando el puntero está sobre el contenedor del Canvas
  const handleWheel = (e) => {
    // Sólo cuando tenemos controles y cámara
    if (!controlsRef.current || !cameraRef.current) return;

    e.preventDefault(); // evitar que la página haga scroll mientras se usa el visor

    const camera = cameraRef.current;
    const controls = controlsRef.current;

    // Vector desde target hacia la cámara (dirección del "away")
    const awayVec = camera.position.clone().sub(controls.target).normalize();

    // deltaY positivo => rueda hacia abajo => queremos alejar (zoom out)
    // deltaY negativo => rueda hacia arriba => acercar (zoom in)
    const zoomFactor = -e.deltaY * 0.01; // ajuste la sensibilidad cambiando 0.01

    // Nueva posición tentativa
    const newPos = camera.position
      .clone()
      .addScaledVector(awayVec, -zoomFactor);

    // Calcular distancia resultante al target y clampearla
    const newDist = newPos.distanceTo(controls.target);
    const clampedDist = Math.min(Math.max(newDist, MIN_DISTANCE), MAX_DISTANCE);

    // Si el newDist no coincide con clampedDist, recomponer la posición
    const finalVec = newPos.clone().sub(controls.target).normalize();
    camera.position.copy(
      controls.target.clone().addScaledVector(finalVec, clampedDist)
    );

    camera.updateProjectionMatrix();
    controls.update();
  };

  const handleNavigation = (section) => {
    console.log(`Navegando a: ${section}`);
    // Ejemplo: navigate(`/${section.toLowerCase()}`);
  };
  const navigate = useNavigate();
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
        <Header onNavigate={handleNavigation} />

        <main className="pt-24">
          <section className="max-w-7xl mx-auto px-6 py-16 text-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl font-bold text-slate-800 leading-tight">
                Diseña el
                <span className="bg-gradient-to-r from-[#8C9985] to-[#514124] bg-clip-text text-transparent">
                  {" "}
                  Futuro
                </span>
              </h1>
              {/* Contenedor del Canvas: capture wheel para zoom */}
              <div
                className="w-full flex justify-center items-center my-12"
                onWheel={handleWheel} // el wheel se procesa aquí (solo cuando puntero encima)
                style={{ touchAction: "none" }} // mejora comportamiento en touch/trackpads
              >
                <div className="w-full md:w-2/3 h-[70vh] bg-white rounded-xl shadow-lg overflow-hidden">
                  <Canvas
                    camera={{ position: [5, 5, 8], fov: 50 }}
                    // preserveDrawingBuffer puede ser útil si quieres capturas, pero lo dejo desactivado por performance
                    // gl={{ preserveDrawingBuffer: true }}
                  >
                    {/* guardamos referencia a la cámara desde dentro de la escena */}
                    <CameraRefSetter cameraRef={cameraRef} />

                    <ambientLight intensity={0.8} />
                    <directionalLight position={[5, 10, 5]} intensity={1} />

                    <Suspense fallback={<HtmlLoader />}>
                      <SceneAutoFit
                        controlsRef={controlsRef}
                        cameraRef={cameraRef}
                      />
                    </Suspense>

                    <OrbitControls
                      ref={controlsRef}
                      enablePan={true}
                      enableRotate={true}
                      enableZoom={true}
                      // Estos límites aplican para interacciones normales (pero el onWheel tiene su propio clamp)
                      minDistance={MIN_DISTANCE}
                      maxDistance={MAX_DISTANCE}
                      makeDefault
                    />
                  </Canvas>
                </div>
              </div>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Plataforma integral para arquitectos profesionales. Accede a
                recursos especializados, herramientas avanzadas y servicios
                premium para transformar tus ideas en realidad.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
                <button
                  onClick={() => navigate("/productos")}
                  className="bg-[#8C9985] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  Explorar Productos
                </button>
                <button
                  onClick={() => navigate("/servicios")}
                  className="border-2 border-slate-700 text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-slate-700 hover:text-white"
                >
                  Ver Servicios
                </button>
              </div>
            </div>
          </section>

          {/* Características */}
          <section className="bg-white/80 backdrop-blur-sm py-20">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-4xl font-bold text-center text-slate-800 mb-16">
                ¿Por qué elegirnos?
              </h2>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: "📐",
                    title: "Herramientas Profesionales",
                    description:
                      "Accede a las mejores herramientas de diseño y modelado 3D especializadas para arquitectura moderna.",
                  },
                  {
                    icon: "🏗️",
                    title: "Recursos Especializados",
                    description:
                      "Biblioteca completa de materiales, texturas, modelos y documentación técnica siempre actualizada.",
                  },
                  {
                    icon: "👥",
                    title: "Comunidad Profesional",
                    description:
                      "Conecta con arquitectos de todo el mundo, comparte proyectos y colabora en tiempo real.",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center group"
                  >
                    <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Estadísticas */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                {[
                  { number: "x+", label: "Arquitectos Activos" },
                  { number: "x+", label: "Proyectos Completados" },
                  { number: "99%", label: "Satisfacción Cliente" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl"
                  >
                    <div className="text-4xl font-bold text-[#8C9985] mb-2">
                      {stat.number}
                    </div>
                    <div className="text-slate-600 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA final */}
          <section className="bg-gradient-to-r from-[#363835] to-[#5C5E59] py-20 text-white">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-4xl font-bold mb-6">¿Listo para comenzar?</h2>
              <p className="text-xl text-slate-300 mb-8">
                Únete a "x" de arquitectos que ya confían en nuestra plataforma
              </p>
              <button
                onClick={() => handleNavigation("login")}
                className="px-8 py-4 rounded-xl font-semibold text-lg bg-[#8C9985] hover:bg-[#847a6d] shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105"
              >
                Comenzar Ahora
              </button>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
}

/* ---------- Helpers / pequeños componentes ---------- */

// Componente para setear referencia de la cámara desde dentro del Canvas
function CameraRefSetter({ cameraRef }) {
  const { camera } = useThree();
  useEffect(() => {
    if (cameraRef) cameraRef.current = camera;
  }, [camera, cameraRef]);
  return null;
}

// Fallback visual mientras carga (puedes estilizarlo)
function HtmlLoader() {
  return (
    <mesh>
      {/* Un fallback simple — puedes reemplazar por spinner HTML/CSS */}
      <HtmlOverlay text="Cargando modelo..." />
    </mesh>
  );
}

// Pequeño overlay HTML (usa DOM fuera de WebGL)
function HtmlOverlay({ text }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div className="bg-white/80 text-slate-800 px-4 py-2 rounded-md shadow">
        {text}
      </div>
    </div>
  );
}
