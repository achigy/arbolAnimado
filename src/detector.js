
// Importamos la biblioteca de Teachable Machine.
// Nos permite cargar nuestro modelo y analizar imágenes.
import * as tmImage from '@teachablemachine/image';

// Dirección donde guardamos nuestro modelo.
const MODEL_URL =`${import.meta.env.BASE_URL}model/`;

// Variable donde almacenaremos el modelo una vez cargado.
let model = null;

/**
 * Carga el modelo de reconocimiento de Teachable Machine.
 * Esta función se ejecuta una sola vez al iniciar el detector.
 */
export async function cargarModelo() {
  try {
    // Cargamos la estructura del modelo y sus pesos.
    model = await tmImage.load(
      MODEL_URL + 'model.json',
      MODEL_URL + 'metadata.json'
    );

    console.log('Modelo cargado correctamente');

    // Devolvemos el modelo para confirmar que se cargó.
    return model;

  } catch (error) {
    // Si algo falla, mostramos el error en la consola.
    console.error('Error al cargar el modelo:', error);
    throw error;
  }
}

/**
 * Analiza una imagen de la cámara y devuelve
 * las probabilidades de las categorías entrenadas.
 */

export async function detectarArbol(video) {
  // Comprobamos que el modelo esté cargado.
  if (!model) {
    console.warn('El modelo todavía no está cargado');
    return null;
  }

  // Analizamos la imagen actual de la cámara.
  const predicciones = await model.predict(video);

  // Buscamos la probabilidad de cada categoría.
  const arbol = predicciones.find(
    resultado => resultado.className === 'Class 1'
  );

  const sinArbol = predicciones.find(
    resultado => resultado.className === 'Class 2'
  );

  // Mostramos los resultados en la consola.
  console.log('Árbol:', arbol?.probability);
  console.log('Sin árbol:', sinArbol?.probability);

  // Consideramos que hay un árbol si clase1 supera el 95 %.
  const hayArbol = arbol && arbol.probability >= 0.95;

  // Devolvemos un resultado fácil de utilizar.
  return {
    hayArbol,
    confianza: arbol?.probability ?? 0,
    predicciones
  };
}

