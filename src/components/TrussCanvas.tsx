import { useEffect, useRef, type PropsWithChildren } from "react";
import { Matrix4, Mesh, Quaternion, Vector3 } from "three";
import { Canvas } from "@react-three/fiber";
import {
  CameraControls,
  Cylinder,
  OrthographicCamera,
  PerspectiveCamera,
  Sphere,
} from "@react-three/drei";

export function TrussCanvas() {
  const nodes = [
    new Vector3(0, 0, 0),
    new Vector3(1, 0, 0),
    new Vector3(2, 0, 0),
    new Vector3(1.5, Math.sqrt(3) / 2, 0),
    new Vector3(0.5, Math.sqrt(3) / 2, 0),
  ];

  const connections = [
    [0, 1],
    [0, 4],
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 3],
    [3, 4],
  ];

  const members = [];

  return (
    <Canvas>
      <hemisphereLight args={["#FFFFFF", "#000000", 0.9]} />
      <OrthographicCamera makeDefault zoom={100} position={[0, 0, 5]} />

      <CameraControls />
      {nodes.map((node) => (
        <Sphere position={node} args={[0.05]}>
          <meshPhongMaterial color="red" />
        </Sphere>
      ))}
      {connections.map((c) => (
        <Member point1={nodes[c[0]]} point2={nodes[c[1]]}>
          <meshPhongMaterial color="white" />
        </Member>
      ))}
      <ambientLight intensity={0.1} />
    </Canvas>
  );
}

const k = new Vector3(0, 0, 1);
function Member({
  children,
  point1,
  point2,
}: PropsWithChildren<{ point1: Vector3; point2: Vector3 }>) {
  const radius = 0.02;
  const mesh = useRef<Mesh>(null);
  const length = point1.distanceTo(point2);
  const diff = new Vector3().subVectors(point2, point1).divideScalar(2);
  const midPoint = new Vector3().addVectors(point1, diff);
  useEffect(() => {
    if (!mesh.current) return;
    mesh.current.lookAt(new Vector3().crossVectors(diff, k).add(midPoint));
    if (mesh.current.quaternion.y === 0 && mesh.current.quaternion.z === 0) {
      mesh.current.setRotationFromAxisAngle(k, Math.PI / 2);
    }
    // console.log(mesh.current.quaternion);
    // mesh.current.quaternion.w = 0;
    // mesh.current.quaternion.normalize();
    // mesh.current.rotateOnWorldAxis(mesh.current.up, Math.PI / 2);
  }, []);
  return (
    <Cylinder ref={mesh} args={[radius, radius, length]} position={midPoint}>
      {children}
    </Cylinder>
  );
}
