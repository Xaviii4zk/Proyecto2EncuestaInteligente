# M1665 - Proyecto 2: Encuesta inteligente

Prototipo web local hecho con HTML, CSS y JavaScript. Los datos se guardan en arrays para simular una base de datos en memoria.

## Historias de usuario

- Como alumno, quiero enviar una valoracion de 1 a 5 para que el docente conozca mi satisfaccion.
- Como alumno, quiero anadir un comentario opcional para aportar contexto a la puntuacion.
- Como docente, quiero seleccionar un grupo (DAW1A, DAW1B o ASIX1) para segmentar los datos.

## Funcionalidades implementadas

- Formulario con grupo, puntuacion de 1 a 5 y comentario opcional.
- Simulacion de base de datos con un array de respuestas.
- Panel filtrado por grupo o por todos los grupos.
- KPIs de respuestas, media, porcentaje de valoraciones positivas y grupo analizado.
- Grafico de barras con distribucion de puntuaciones.
- Graficos circulares tipo quesito para puntuaciones y porcentaje positivo.
- Comparativa de media por grupo.
- Listado de respuestas filtradas con tarjetas coloreadas segun puntuacion.

## Estructura

- `index.html`: estructura principal de la pagina.
- `styles.css`: estilos visuales y responsive.
- `script.js`: datos simulados, eventos, calculos y renderizado del panel.
- `README.md`: notas del proyecto.

## Como usarlo

Abrir `index.html` en el navegador.

Al enviar una respuesta desde el formulario, se anade al array `surveyResponses` durante la sesion actual. Si se recarga la pagina, vuelven los datos iniciales definidos en `script.js`.

## Posibles mejoras

- Guardar respuestas en `localStorage`.
- Conectar la aplicacion con Supabase.
- Publicar el proyecto en Vercel.
- Anadir validaciones mas detalladas.
- Exportar los datos filtrados a CSV.

## Notas de desarrollo

- Fecha:
- Cambios realizados:
- Dudas:
- Pendiente:
