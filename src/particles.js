
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

  const ancho = canvas.clientWidth;
  const alto = canvas.clientHeight;

  return {

    
    tipo: Math.random() < 0.25 ? 'estrella' : 'luz',
    rotacion: Math.random() * Math.PI,
    velocidadRotacion: (Math.random() - 0.5) * 0.04,

    // Posición inicial.
    x: Math.random() * ancho,
    y: -10 - Math.random() * alto,

    // Posición horizontal de referencia.
    xInicial: Math.random() * ancho,

    // Tamaño variable.
    radio: Math.random() * 2.5 + 0.8,

    // Velocidad de caída.
    velocidad: Math.random() * 1.2 + 0.4,

    // Amplitud del movimiento lateral.
    amplitud: Math.random() * 25 + 5,

    // Fase inicial del movimiento.
    fase: Math.random() * Math.PI * 2,

    // Velocidad del balanceo.
    oscilacion: Math.random() * 0.035 + 0.01,

    // Intensidad del brillo.
    opacidad: Math.random() * 0.5 + 0.4,

    // Variación del brillo.
    pulso: Math.random() * 0.04 + 0.01

  };
}



// ------------------------------------
// DIBUJAR UNA PARTÍCULA
// ------------------------------------


function dibujarParticula(p) {

  ctx.save();

  // Creamos un degradado circular.
  const gradiente = ctx.createRadialGradient(
    p.x, p.y, 0,
    p.x, p.y, p.radio * 5
  );

  // Centro de la luz.
  gradiente.addColorStop(
    0,
    `rgba(255, 255, 230, ${p.opacidad})`
  );

  // Luz dorada intermedia.
  gradiente.addColorStop(
    0.3,
    `rgba(255, 210, 120, ${p.opacidad * 0.8})`
  );

  // Desvanecimiento exterior.
  gradiente.addColorStop(
    1,
    'rgba(255, 180, 50, 0)'
  );

  // Dibujamos el halo luminoso.
  ctx.beginPath();

  ctx.arc(
    p.x,
    p.y,
    p.radio * 5,
    0,
    Math.PI * 2
  );

  ctx.fillStyle = gradiente;
  ctx.fill();

  // Dibujamos el núcleo brillante.
  ctx.beginPath();

  ctx.arc(
    p.x,
    p.y,
    p.radio,
    0,
    Math.PI * 2
  );

  ctx.fillStyle = '#fff9dc';

  ctx.shadowBlur = 15;
  ctx.shadowColor = '#ffd27a';

  ctx.fill();

  ctx.restore();
    console.log('Dibujando particula en');
}

function dibujarEstrella(x, y, radio, rotacion) {
  ctx.save();

  ctx.translate(x, y);
  ctx.rotate(rotacion);

  ctx.beginPath();

  for (let i = 0; i < 8; i++) {
    const angulo = (Math.PI / 4) * i;
    const radioPunta = i % 2 === 0 ? radio : radio * 0.3;

    const px = Math.cos(angulo) * radioPunta;
    const py = Math.sin(angulo) * radioPunta;

    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }

  ctx.closePath();
  ctx.fillStyle = '#fff4c2';
  ctx.shadowBlur = 18;
  ctx.shadowColor = '#ffd27a';
  ctx.fill();

  ctx.restore();
    console.log('Dibujando estrella en');

}


// ------------------------------------
// ANIMAR LAS PARTÍCULAS
// ------------------------------------

function animar() {
  const ancho = canvas.clientWidth;
  const alto = canvas.clientHeight;

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

    // 1. Movimiento vertical
    p.y += p.velocidad;

    // 2. Movimiento lateral
    p.fase += p.oscilacion;
    p.x = p.xInicial + Math.sin(p.fase) * p.amplitud;

    // 3. Variación de luminosidad
    p.opacidad = 0.6 + Math.sin(p.fase * 2) * p.pulso;

    // 4. Si sale de la pantalla, creamos otra
    if (p.y > alto + 20) {
      particulas[indice] = crearParticula();
      return;
    }

    // 5. Rotación de estrellas
    if (p.tipo === 'estrella') {
      p.rotacion += p.velocidadRotacion;

      dibujarEstrella(
        p.x,
        p.y,
        p.radio * 3,
        p.rotacion
      );

    } else {
      dibujarParticula(p);
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
  console.log('Lluvia de luz activada');

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
