/**
 * Cool studio key/fill/rim setup to match the concept's blue mood. Only the
 * meshes without a COMBINED bake (paper pages, pen, coffee, chair mesh) react
 * to these lights — the baked meshes are rendered unlit.
 */
export function StudioLights() {
  return (
    <>
      {/* Bright, airy white-blue grade to match the concept (blum.png). */}
      {/* Directionals kept low so the desk's baked AO reads as shadow rather */}
      {/* than being washed out by direct light (AO only attenuates indirect). */}
      <ambientLight intensity={0.4} color="#f4f7ff" />
      <directionalLight position={[3, 4.5, 2.5]} intensity={0.2} color="#ffffff" />
      <directionalLight position={[-4, 2, -1]} intensity={0.2} color="#ffffff" />
      <directionalLight position={[0, 1.5, -4]} intensity={0.2} color="#ffffff" />
    </>
  );
}
