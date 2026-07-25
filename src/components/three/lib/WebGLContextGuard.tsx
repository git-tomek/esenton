'use client';

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

/**
 * Prevents the default "context lost = dead canvas" behaviour and resets the
 * renderer state when the browser restores the WebGL context (e.g. after the
 * GPU was reclaimed on a backgrounded tab).
 */
export function WebGLContextGuard() {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;

    const onLost = (event: Event) => {
      event.preventDefault();
    };

    const onRestored = () => {
      gl.resetState();
    };

    canvas.addEventListener('webglcontextlost', onLost, false);
    canvas.addEventListener('webglcontextrestored', onRestored, false);

    return () => {
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
    };
  }, [gl]);

  return null;
}
