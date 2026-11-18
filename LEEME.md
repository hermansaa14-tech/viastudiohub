# Viastudiohub · Landing pages

Tres páginas estáticas (HTML + CSS + un poco de JavaScript), listas para subir a Hostinger.

## Estructura

```
asistente-whatsapp/index.html     → viastudiohub.com/asistente-whatsapp/
agenda-recordatorios/index.html   → viastudiohub.com/agenda-recordatorios/
automatizaciones/index.html       → viastudiohub.com/automatizaciones/
assets/css/vsh.css                → estilos comunes
assets/js/vsh.js                  → número de WhatsApp y animación del chat
```

## Cómo subirlas a Hostinger

1. hPanel → Sitios web → viastudiohub.com → Administrador de archivos.
2. Entrar en `public_html`.
3. Subir el contenido de esta carpeta tal cual (las tres carpetas y `assets`), sin cambiar nombres.
4. Abrir `https://viastudiohub.com/asistente-whatsapp/` para comprobar.

## Antes de publicar

- **Número de WhatsApp:** en `assets/js/vsh.js`, cambiar `VSH_WHATSAPP = "59100000000"` por el número real (código de país + número, solo dígitos). Todos los botones de las tres páginas se actualizan.
- **Página principal:** el logo enlaza a `https://viastudiohub.com/`. Mientras no exista el sitio, se puede poner allí una redirección a una de las landing.
- **SSL:** verificar en hPanel que el certificado HTTPS esté activo.

## Medición (importante)

En `assets/js/vsh.js`, pegar los ID cuando existan:

- `VSH_META_PIXEL_ID` → ID del píxel de Meta (Administrador de eventos).
- `VSH_GA4_ID` → ID de Google Analytics 4 (formato `G-XXXXXXXXXX`).

Cada clic en un botón de WhatsApp se registra como **Contact** (Meta) y **generate_lead** (GA4). Usar esos eventos como conversión en las campañas.

## Bloques listos para activar

En cada página hay dos bloques comentados (`<!-- ... -->`):

- **TESTIMONIOS:** activar solo con clientes reales (nombre, negocio, foto y resultado verdaderos). Fotos en `assets/img/`.
- **GARANTÍA:** activar cuando la garantía esté decidida.

## Notas

- Las páginas se generan con una plantilla común; si se edita a mano, mantener iguales las tres.

- Los textos y ejemplos de los chats son ilustrativos (negocios ficticios).
- No hay precios en las páginas: se dan en la demo.
- Las fuentes se cargan desde Google Fonts (Bricolage Grotesque y Atkinson Hyperlegible).
