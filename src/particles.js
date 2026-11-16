
/*
  LLUVIA DE LUZ
  Sistema de partículas con Canvas API
*/

// Declaramos las variables, pero todavía no buscamos el canvas.
let canvas = null;
let ctx = null;

let particulas = [];
let lluviaActiva = false;
let animationId = null;


// ------------------------------------
// INICIALIZAR EL SISTEMA
// ------------------------------------

export function inicializarParticulas() {

  // Ahora sí buscamos el canvas en el HTML.
  canvas = document.querySelector('#light-canvas');

  // Verificamos que exista.
  if (!canvas) {
    console.error('No se encontró el canvas de partículas');
    return;
  }

  // Obtenemos el contexto para dibujar.
  ctx = canvas.getContext('2d');

  // Ajustamos el tamaño inicial.
  ajustarCanvas();

  // Escuchamos cambios de tamaño.
  window.addEventListener('resize', ajustarCanvas);

  console.log('Sistema de partículas inicializado');
}


// ------------------------------------
// AJUSTAR EL TAMAÑO DEL LIENZO
// ------------------------------------

function ajustarCanvas() {

  const rect = canvas.getBoundingClientRect();

  const escala = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = rect.width * escala;
  canvas.height = rect.height * escala;

  ctx.setTransform(escala, 0, 0, escala, 0, 0);
}


// ------------------------------------
// CREAR UNA PARTÍCULA
// ------------------------------------

function crearParticula() {

  return {
    x: Math.random() * canvas.clientWidth,
    y: -10 - Math.random() * canvas.clientHeight,

    radio: Math.random() * 2.5 + 1,

    velocidad: Math.random() * 1.5 + 0.5,

    movimientoX: Math.random() - 0.5,

    opacidad: Math.random() * 0.5 + 0.3
  };
}


// ------------------------------------
// DIBUJAR UNA PARTÍCULA
// ------------------------------------

function dibujarParticula(p) {

  ctx.beginPath();

  ctx.arc(p.x, p.y, p.radio, 0, Math.PI * 2);

  ctx.fillStyle = `rgba(255, 210, 120, ${p.opacidad})`;

  ctx.shadowBlur = 15;
  ctx.shadowColor = '#ffd27a';

  ctx.fill();

  ctx.shadowBlur = 0;
}


// ------------------------------------
// ANIMAR LAS PARTÍCULAS
// ------------------------------------

function animar() {

  ctx.clearRect(
    0,
    0,
    canvas.clientWidth,
    canvas.clientHeight
  );

  if (particulas.length < 100) {
    particulas.push(crearParticula());
  }

  // Actualizamos cada partícula.
  particulas.forEach((p, indice) => {

    p.y += p.velocidad;
    p.x += p.movimientoX;

    dibujarParticula(p);

    if (p.y > canvas.clientHeight + 10) {
      particulas.splice(indice, 1);
    }
  });

  if (lluviaActiva) {
    animationId = requestAnimationFrame(animar);
  }
}


// ------------------------------------
// ACTIVAR LA LLUVIA
// ------------------------------------

export function activarLluvia() {

  if (!canvas || !ctx) return;

  if (lluviaActiva) return;

  lluviaActiva = true;

  animar();
}


// ------------------------------------
// DETENER LA LLUVIA
// ------------------------------------

export function detenerLluvia() {

  if (!ctx) return;

  lluviaActiva = false;

  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  particulas = [];

  ctx.clearRect(
    0,
    0,
    canvas.clientWidth,
    canvas.clientHeight
  );
}
