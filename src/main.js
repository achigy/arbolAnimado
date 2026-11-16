
import { cargarModelo, detectarArbol } from './detector.js';
import './style.css'
import {
  inicializarParticulas,
  activarLluvia,
  detenerLluvia
} from './particles.js';

document.querySelector('#app').innerHTML = `
  <main class="experience">
    <h1>Lluvia de Luz</h1>
    <p>Una experiencia de luz y esperanza para tu hogar.</p>

    <div class="camera-container">

      <video id="camera" autoplay playsinline muted></video>

      <canvas id="light-canvas"></canvas>

      <div class="message" id="message">
        Tu experiencia navideña comienza aquí ✨
      </div>

    </div>

    <button id="start">Activar experiencia</button>
  </main>
`
inicializarParticulas();
const video = document.querySelector('#camera')
const button = document.querySelector('#start')
const message = document.querySelector('#message')

let modeloCargado = false;
let deteccionActiva = false;

async function analizarCamara() {

  // Si detenemos el detector, no hacemos más análisis.
  if (!deteccionActiva) return;

  // Esperamos hasta que el video tenga un fotograma disponible.
  if (video.readyState < 2) {
    setTimeout(analizarCamara, 500);
    return;
  }
  try {
    // Enviamos el video al modelo de inteligencia artificial.
    const resultado = await detectarArbol(video);

    // Convertimos la confianza de decimal a porcentaje.
    const porcentaje = (
      (resultado?.confianza ?? 0) * 100
    ).toFixed(1);

    // Comprobamos si el modelo reconoció un árbol.
    if (resultado?.hayArbol) {

      message.textContent =
        `¡Árbol detectado! Confianza: ${porcentaje}%`;
      
      activarLluvia();

    } else {

      message.textContent =
        `Buscando árbol... Confianza: ${porcentaje}%`;

      detenerLluvia();
    }

  } catch (error) {

    // Mostramos cualquier problema durante el reconocimiento.
    console.error('Error durante la detección:', error);

    message.textContent = 'Error al analizar la cámara';

    // Detenemos el ciclo si ocurre un error.
    deteccionActiva = false;
    return;
  }

  // Esperamos medio segundo antes de analizar otra imagen.
  setTimeout(analizarCamara, 500);
}

button.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment'
      },
      audio: false
    })

    video.srcObject = stream
    
    // Esperamos a que el video comience a reproducirse.
    await video.play();

    // Cargamos el modelo solamente la primera vez.
    if (!modeloCargado) {

      message.textContent = 'Cargando modelo de reconocimiento...';

      await cargarModelo();

      modeloCargado = true;
      console.log('Modelo cargado y listo para usar');
    }

    // Activamos el reconocimiento.
    deteccionActiva = true;

    // Comenzamos a analizar los fotogramas.
    analizarCamara();

    message.textContent = '¡La cámara está funcionando! ✨'
    button.textContent = 'Experiencia activada'
  } catch (error) {
    message.textContent = 'No se pudo acceder a la cámara.'
    console.error(error)
  }
})
