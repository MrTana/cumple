# Cumpleaños

App web de una sola página que muestra los cumpleaños de tus contactos de Google mes a mes, usando la People API (solo lectura).

## Despliegue en Cloudflare Pages

- Proyecto conectado a este repositorio, rama `main`.
- Framework preset: ninguno. Build command: vacío. Output directory: `/`.
- En Google Cloud, agrega la URL de Pages (por ejemplo `https://cumple.pages.dev`) en "Orígenes autorizados de JavaScript" del ID de cliente OAuth.

## Uso

Abre la página, abre el engrane de arriba, pega tu ID de cliente de Google y pulsa "Conectar con Google". Los datos se guardan solo en tu navegador.

## PWA

La página es instalable (manifest, service worker e iconos en `icons/`). En el teléfono: abre la URL en Chrome (Android) o Safari (iPhone) y elige "Instalar app" / "Añadir a pantalla de inicio". Funciona sin conexión con los últimos cumpleaños guardados.
