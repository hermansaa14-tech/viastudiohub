/* Viastudiohub · script común de las landing pages */

/* ================= CONFIGURACIÓN ================= */
/* Número de WhatsApp de Viastudiohub (código de país + número, solo dígitos). */
const VSH_WHATSAPP = "59100000000";
/* Medición: pegar los ID cuando existan. Vacíos = no se carga nada. */
const VSH_META_PIXEL_ID = "";   // ej. "123456789012345"
const VSH_GA4_ID = "";          // ej. "G-XXXXXXXXXX"
/* Redes sociales: pegar la dirección completa de cada perfil. Si queda vacía, el ícono no se muestra. */
const VSH_REDES = {
  instagram: "https://www.instagram.com/viastudiohub",   // confirmar
  facebook: "https://www.facebook.com/viastudiohub",     // confirmar
  tiktok: "https://www.tiktok.com/@viastudiohub",        // confirmar
};
/* ================================================= */

/* 1. Enlaces de WhatsApp con mensaje ya escrito */
document.querySelectorAll("[data-wa]").forEach(function (enlace) {
  const mensaje = enlace.getAttribute("data-wa") || "Hola, quiero más información.";
  enlace.href = "https://wa.me/" + VSH_WHATSAPP + "?text=" + encodeURIComponent(mensaje);
  enlace.target = "_blank";
  enlace.rel = "noopener";
});

/* 1b. Redes sociales del pie de página */
document.querySelectorAll("[data-red]").forEach(function (enlace) {
  const url = VSH_REDES[enlace.getAttribute("data-red")];
  if (!url) { enlace.parentElement.hidden = true; return; }
  enlace.href = url; enlace.target = "_blank"; enlace.rel = "noopener";
});

/* 2. Medición: Meta Pixel y Google Analytics 4 (solo si hay ID) */
(function () {
  if (VSH_META_PIXEL_ID) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", VSH_META_PIXEL_ID);
    window.fbq("track", "PageView");
  }
  if (VSH_GA4_ID) {
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + VSH_GA4_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", VSH_GA4_ID);
  }
  /* Cada clic en un botón de WhatsApp cuenta como contacto */
  document.querySelectorAll("[data-wa]").forEach(function (enlace) {
    enlace.addEventListener("click", function () {
      const pagina = location.pathname;
      if (window.fbq) window.fbq("track", "Contact", { content_name: pagina });
      if (window.gtag) window.gtag("event", "generate_lead", { method: "whatsapp", page_path: pagina });
    });
  });
})();

/* 3. Botón fijo en móvil: aparece cuando el botón principal sale de la pantalla */
(function () {
  const fijo = document.querySelector(".boton-fijo");
  const principal = document.querySelector(".hero-accion");
  if (!fijo || !principal || !("IntersectionObserver" in window)) return;
  new IntersectionObserver(function (entradas) {
    fijo.classList.toggle("activo", !entradas[0].isIntersecting);
  }).observe(principal);
})();

/* 4. Conversación animada en el teléfono del hero, con ejemplos por tipo de negocio.
      Con "reducir movimiento" se muestran todos los mensajes de una vez. */
(function () {
  const chat = document.querySelector(".chat");
  if (!chat) return;
  const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const escribiendo = chat.querySelector(".escribiendo");
  const aviso = document.querySelector(".aviso");
  const telefono = document.querySelector(".telefono");
  let turno = 0; /* cada animación nueva cancela la anterior */

  function animar() {
    const miTurno = ++turno;
    const mensajes = Array.from(chat.querySelectorAll(".msg"));
    if (reducir) {
      chat.classList.remove("animado");
      if (aviso) aviso.classList.remove("esperando");
      return;
    }
    chat.classList.add("animado");
    mensajes.forEach(function (m) { m.classList.remove("visible"); });
    if (escribiendo) escribiendo.style.display = "none";
    /* El aviso al dueño aparece al final de la conversación: es el momento clave */
    if (aviso) aviso.classList.add("esperando");

    let i = 0;
    function siguiente() {
      if (miTurno !== turno) return;
      if (i >= mensajes.length) {
        if (aviso) setTimeout(function () { if (miTurno === turno) aviso.classList.remove("esperando"); }, 500);
        return;
      }
      const msg = mensajes[i];
      const esRespuesta = msg.classList.contains("in") && escribiendo;
      if (esRespuesta) {
        chat.insertBefore(escribiendo, msg);
        escribiendo.style.display = "flex";
      }
      setTimeout(function () {
        if (miTurno !== turno) return;
        if (esRespuesta) escribiendo.style.display = "none";
        msg.classList.add("visible");
        i += 1;
        setTimeout(siguiente, 700);
      }, esRespuesta ? 1200 : 550);
    }
    setTimeout(siguiente, 400);
  }

  /* Pestañas: Tienda, Restaurante, Inmobiliaria, Academia */
  const pestanas = Array.from(document.querySelectorAll(".demo-tabs [data-demo]"));
  function mostrar(clave) {
    const plantilla = document.getElementById("demo-" + clave);
    if (!plantilla) return;
    const d = plantilla.dataset;
    chat.querySelectorAll(".msg").forEach(function (m) { m.remove(); });
    chat.insertBefore(plantilla.content.cloneNode(true), escribiendo);
    const cab = document.querySelector(".pantalla-cabecera");
    cab.querySelector(".avatar").textContent = d.letra;
    cab.querySelector("strong").textContent = d.nombre;
    cab.querySelector("small").textContent = d.sub;
    const hora = document.querySelector(".estado span");
    if (hora) hora.textContent = d.hora;
    if (telefono) telefono.setAttribute("aria-label", d.aria);
    if (aviso) {
      aviso.querySelector("strong").textContent = d.avisoT;
      aviso.querySelector("span").textContent = d.avisoD;
    }
    pestanas.forEach(function (b) { b.setAttribute("aria-selected", b.dataset.demo === clave ? "true" : "false"); });
    animar();
  }
  pestanas.forEach(function (b, idx) {
    b.addEventListener("click", function () { mostrar(b.dataset.demo); });
    b.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const sig = pestanas[(idx + (e.key === "ArrowRight" ? 1 : pestanas.length - 1)) % pestanas.length];
      sig.focus();
      mostrar(sig.dataset.demo);
    });
  });

  animar();
})();

/* 5. Historia con scroll: al bajar, la sección queda fija y cambia de rubro. */
(function () {
  const seccion = document.querySelector(".historia");
  if (!seccion) return;
  const textos = Array.from(seccion.querySelectorAll(".hs-texto"));
  const tarjetas = Array.from(seccion.querySelectorAll(".hs-tarjeta"));
  const puntos = Array.from(seccion.querySelectorAll(".hs-puntos button"));
  const escena = seccion.querySelector(".hs-escena");
  const n = textos.length;
  let actual = -1, pendiente = false;

  function activar(i) {
    if (i === actual) return;
    actual = i;
    textos.forEach(function (el, k) { el.classList.toggle("activo", k === i); });
    tarjetas.forEach(function (el, k) { el.classList.toggle("activo", k === i); });
    puntos.forEach(function (b, k) { b.setAttribute("aria-current", k === i ? "true" : "false"); });
    escena.style.setProperty("--hs-fondo", tarjetas[i].dataset.fondo);
  }
  function recorrido() { return Math.max(1, seccion.offsetHeight - window.innerHeight); }
  function calcular() {
    pendiente = false;
    let p = -seccion.getBoundingClientRect().top / recorrido();
    p = Math.min(Math.max(p, 0), 0.9999);
    activar(Math.floor(p * n));
  }
  window.addEventListener("scroll", function () {
    if (!pendiente) { pendiente = true; requestAnimationFrame(calcular); }
  }, { passive: true });
  window.addEventListener("resize", calcular);
  puntos.forEach(function (b, i) {
    b.addEventListener("click", function () {
      const inicio = seccion.getBoundingClientRect().top + window.scrollY;
      const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: inicio + (i + 0.5) / n * recorrido(), behavior: reducir ? "auto" : "smooth" });
    });
  });
  calcular();
})();

/* 6. Video: empieza solo y sin sonido cuando aparece en pantalla (los navegadores no permiten
      reproducir con sonido sin un clic). Los subtítulos están dentro del video, así se entiende igual.
      El botón "Activar sonido" lo vuelve a empezar con audio. Fuera de pantalla se pausa. */
(function () {
  document.querySelectorAll(".video-portada").forEach(function (portada) {
    if (!portada.dataset.src) return;   // video todavía en preparación
    if (portada.dataset.poster) {
      portada.classList.add("con-imagen");
      portada.style.backgroundImage = "linear-gradient(rgba(8,36,44,.25), rgba(8,36,44,.25)), url('" + portada.dataset.poster + "')";
    }
    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let caja = null, video = null, sonido = null, pausadoPorUsuario = false;

    function crear(conSonido) {
      if (caja) return;
      caja = document.createElement("div");
      caja.className = "video-caja";
      video = document.createElement("video");
      video.playsInline = true;
      video.preload = "auto";
      video.muted = !conSonido;
      video.loop = !conSonido;
      video.controls = conSonido;
      video.src = portada.dataset.src;
      if (portada.dataset.subs) {
        const pista = document.createElement("track");
        pista.kind = "subtitles"; pista.srclang = "es"; pista.label = "Español"; pista.src = portada.dataset.subs;
        video.appendChild(pista);
      }
      sonido = document.createElement("button");
      sonido.type = "button";
      sonido.className = "video-sonido";
      sonido.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>Escuchar con sonido';
      sonido.hidden = conSonido;
      sonido.addEventListener("click", function () {
        video.muted = false; video.loop = false; video.controls = true; video.currentTime = 0;
        video.play().catch(function () {});
        sonido.hidden = true; pausadoPorUsuario = false;
        if (window.gtag) window.gtag("event", "video_sound_on", { video_title: "como-funciona" });
      });
      video.addEventListener("pause", function () { if (video.controls && document.visibilityState === "visible" && enPantalla) pausadoPorUsuario = true; });
      video.addEventListener("play", function () { pausadoPorUsuario = false; });
      video.addEventListener("error", function () {
        const aviso = document.createElement("p");
        aviso.className = "video-error";
        aviso.textContent = "El video estará disponible muy pronto. Mientras tanto, puedes leer lo que dice aquí abajo.";
        caja.replaceWith(aviso);
      });
      // Tocar el video mientras está sin sonido = activar el sonido (no hace falta apuntar al botón)
      video.addEventListener("click", function () { if (video.muted) sonido.click(); });
      caja.appendChild(video); caja.appendChild(sonido);
      portada.replaceWith(caja);
      video.play().catch(function () { video.controls = true; });
      if (window.fbq) window.fbq("trackCustom", "VideoPlay");
      if (window.gtag) window.gtag("event", "video_start", { video_title: "como-funciona", autoplay: !conSonido });
    }

    /* Clic en la portada: arranca con sonido */
    portada.addEventListener("click", function () { crear(true); });

    /* Al bajar: arranca solo, sin sonido. Se pausa al salir de la pantalla. */
    let enPantalla = false;
    if (!("IntersectionObserver" in window)) return;
    new IntersectionObserver(function (entradas) {
      enPantalla = entradas[0].isIntersecting;
      if (enPantalla) {
        if (!caja && !reducir) crear(false);
        else if (video && video.paused && !pausadoPorUsuario && !video.ended) video.play().catch(function () {});
      } else if (video && !video.paused) {
        video.pause(); pausadoPorUsuario = false;
      }
    }, { threshold: 0.5 }).observe(portada.parentElement);
  });
})();

/* 7. Botón flotante: "volver arriba" aparece al bajar; la etiqueta saluda una vez. */
(function () {
  const arriba = document.querySelector(".arriba");
  const wa = document.querySelector(".wa-flotante");
  if (arriba) {
    let pendiente = false;
    const revisar = function () {
      pendiente = false;
      arriba.classList.toggle("visible", window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", function () {
      if (!pendiente) { pendiente = true; requestAnimationFrame(revisar); }
    }, { passive: true });
    revisar();
    arriba.addEventListener("click", function () {
      const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reducir ? "auto" : "smooth" });
    });
  }
  /* En computadora, la etiqueta "Probarlo en WhatsApp" aparece 4 segundos a los 8 segundos de entrar */
  if (wa && window.matchMedia("(hover: hover)").matches) {
    setTimeout(function () {
      wa.classList.add("saluda");
      setTimeout(function () { wa.classList.remove("saluda"); }, 4000);
    }, 8000);
  }
})();

/* 8. Planes: pestañas de ejemplos por tipo de negocio (los precios no cambian) */
(function () {
  const tabs = Array.from(document.querySelectorAll(".precios-tabs [data-sector]"));
  if (!tabs.length) return;
  function elegir(sector) {
    tabs.forEach(function (b) { b.setAttribute("aria-selected", b.dataset.sector === sector ? "true" : "false"); });
    document.querySelectorAll(".plan-ej").forEach(function (p) { p.hidden = p.dataset.sector !== sector; });
  }
  tabs.forEach(function (b, i) {
    b.addEventListener("click", function () { elegir(b.dataset.sector); });
    b.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const sig = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
      sig.focus(); elegir(sig.dataset.sector);
    });
  });
})();

/* 9. "Un día con tu asistente": la sección queda fija y cambia de momento al bajar.
      En cada momento los mensajes aparecen uno por uno, con "escribiendo…" antes de cada respuesta. */
(function () {
  const sec = document.querySelector(".dia-asistente");
  if (!sec) return;
  const items = Array.from(sec.querySelectorAll(".dm-item"));
  const pantallas = Array.from(sec.querySelectorAll(".dp"));
  const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const n = items.length;
  let actual = -1, turno = 0, pendiente = false;

  function animarMensajes(p) {
    const miTurno = ++turno;
    const pasos = Array.from(p.querySelectorAll("[data-anim-paso]"));
    if (reducir) { pasos.forEach(function (e) { e.classList.remove("esperando"); if (e.classList.contains("wa-escribe")) e.classList.remove("mostrando"); }); return; }
    pasos.forEach(function (e) { e.classList.add("esperando"); e.classList.remove("mostrando"); });
    let t = 250;
    pasos.forEach(function (e, i) {
      const esEscribe = e.classList.contains("wa-escribe");
      setTimeout(function () {
        if (miTurno !== turno) return;
        if (esEscribe) { e.classList.add("mostrando"); e.classList.remove("esperando"); }
        else {
          const ant = pasos[i - 1];
          if (ant && ant.classList.contains("wa-escribe")) { ant.classList.remove("mostrando"); ant.classList.add("esperando"); }
          e.classList.remove("esperando");
        }
      }, t);
      t += esEscribe ? 1100 : 750;
    });
  }
  function mostrar(i) {
    if (i === actual) return;
    actual = i;
    items.forEach(function (b, k) { b.classList.toggle("activo", k === i); b.setAttribute("aria-pressed", k === i ? "true" : "false"); });
    pantallas.forEach(function (p, k) { p.hidden = k !== i; });
    animarMensajes(pantallas[i]);
  }
  function recorrido() { return Math.max(1, sec.offsetHeight - window.innerHeight); }
  function calcular() {
    pendiente = false;
    const p = Math.min(Math.max(-sec.getBoundingClientRect().top / recorrido(), 0), 0.9999);
    const i = Math.floor(p * n);
    mostrar(i);
    const barra = items[i].querySelector(".dm-progreso i");
    if (barra) barra.style.width = ((p * n - i) * 100).toFixed(1) + "%";
  }
  window.addEventListener("scroll", function () { if (!pendiente) { pendiente = true; requestAnimationFrame(calcular); } }, { passive: true });
  window.addEventListener("resize", calcular);
  items.forEach(function (b, k) {
    b.addEventListener("click", function () {
      const inicio = sec.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: inicio + (k + 0.15) / n * recorrido(), behavior: reducir ? "auto" : "smooth" });
    });
  });
  calcular();
})();

/* 10. Servicios: se resalta la fila que está en el centro de la pantalla. */
(function () {
  const filas = Array.from(document.querySelectorAll(".sv-fila"));
  if (!filas.length || !("IntersectionObserver" in window)) return;
  const obs = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) { if (e.isIntersecting) { filas.forEach(function (f) { f.classList.toggle("activo", f === e.target); }); } });
  }, { rootMargin: "-45% 0px -45% 0px" });
  filas.forEach(function (f) { obs.observe(f); });
})();

/* 11. "Así construimos tu solución": al bajar cambia el servicio activo y su ejemplo
       se arma pieza por pieza (boceto punteado con guías → contenido), con un cursor que va
       a cada pieza. Con "reducir movimiento" se muestra todo armado. */
(function () {
  const sec = document.querySelector(".construye");
  if (!sec) return;
  const items = Array.from(sec.querySelectorAll(".cs-item"));
  const lienzos = Array.from(sec.querySelectorAll(".cs-lienzo"));
  const nombres = Array.from(sec.querySelectorAll(".cs-proy"));
  const cuenta = sec.querySelector(".cs-cuenta"), total = sec.querySelector(".cs-total");
  const estado = sec.querySelector(".cs-estado"), barraPie = sec.querySelector(".cs-progbar i");
  const tarjeta = sec.querySelector(".cs-tarjeta");
  const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const n = items.length;
  let actual = -1, turno = 0, pendiente = false;

  function visibles(l) { return Array.from(l.querySelectorAll(".cs-el")).filter(function (e) { return getComputedStyle(e).display !== "none"; }); }
  function pie(hechas, de, listo) {
    cuenta.textContent = hechas; total.textContent = de;
    barraPie.style.width = (de ? hechas / de * 100 : 0) + "%";
    estado.textContent = listo ? "listo ✓" : "construyendo…";
  }
  function armar(l) {
    const miTurno = ++turno;
    const els = visibles(l);
    const cursor = l.querySelector(".cs-cursor");
    const piezas = els.filter(function (e) { return !e.classList.contains("cs-con"); }).length;
    let hechas = 0;
    l.classList.remove("terminado");
    if (reducir) { els.forEach(function (e) { e.classList.remove("vacio", "boceto"); e.classList.add("listo"); }); l.classList.add("terminado"); pie(piezas, piezas, true); return; }
    els.forEach(function (e) { e.classList.remove("boceto", "listo"); e.classList.add("vacio"); });
    pie(0, piezas, false);
    let t = 350;
    els.forEach(function (e) {
      const con = e.classList.contains("cs-con");
      setTimeout(function () {
        if (miTurno !== turno) return;
        e.classList.remove("vacio"); e.classList.add("boceto");
        if (!con) {
          cursor.style.setProperty("--cx", (e.offsetLeft + e.offsetWidth * .62) + "px");
          cursor.style.setProperty("--cy", (e.offsetTop + e.offsetHeight * .55) + "px");
        }
      }, t);
      setTimeout(function () {
        if (miTurno !== turno) return;
        e.classList.remove("boceto"); e.classList.add("listo");
        if (!con) pie(++hechas, piezas, hechas === piezas);
      }, t + (con ? 250 : 750));
      t += con ? 250 : 600;
    });
    setTimeout(function () { if (miTurno === turno) l.classList.add("terminado"); }, t + 900);
  }
  function mostrar(i) {
    if (i === actual) return;
    actual = i;
    items.forEach(function (b, k) { b.classList.toggle("activo", k === i); b.setAttribute("aria-pressed", k === i ? "true" : "false"); });
    lienzos.forEach(function (l, k) { l.hidden = k !== i; });
    nombres.forEach(function (s, k) { s.hidden = k !== i; });
    tarjeta.style.setProperty("--ag-activo", getComputedStyle(lienzos[i]).getPropertyValue("--ag"));
    armar(lienzos[i]);
  }
  function recorrido() { return Math.max(1, sec.offsetHeight - window.innerHeight); }
  function calcular() {
    pendiente = false;
    const r = sec.getBoundingClientRect();
    const p = Math.min(Math.max(-r.top / recorrido(), 0), 0.9999);
    // No empezar a armar hasta que la sección esté a la vista
    if (actual === -1 && r.top > window.innerHeight * .5) return;
    const i = Math.floor(p * n);
    mostrar(i);
    const barra = items[i].querySelector(".cs-progreso i");
    if (barra) barra.style.width = ((p * n - i) * 100).toFixed(1) + "%";
  }
  window.addEventListener("scroll", function () { if (!pendiente) { pendiente = true; requestAnimationFrame(calcular); } }, { passive: true });
  let anchoPrevio = window.innerWidth;
  window.addEventListener("resize", function () { if (window.innerWidth !== anchoPrevio) { anchoPrevio = window.innerWidth; const i = actual; actual = -2; mostrar(Math.max(i, 0)); } calcular(); });
  items.forEach(function (b, k) {
    b.addEventListener("click", function () {
      const inicio = sec.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: inicio + (k + 0.1) / n * recorrido(), behavior: reducir ? "auto" : "smooth" });
      if (k === actual) armar(lienzos[k]);
    });
  });
  calcular();
})();

/* 12. Escenario "Cómo trabajan juntas": un punto lleva los datos por cada conexión,
       el módulo de llegada se enciende y su contador de operaciones sube. Solo corre mientras se ve. */
(function () {
  const caja = document.querySelector(".escenario");
  if (!caja) return;
  const NS = "http://www.w3.org/2000/svg";
  const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let visible = false;
  if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }, { threshold: 0.2 }).observe(caja);
  else visible = true;
  const esperar = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  caja.querySelectorAll(".esc-svg").forEach(function (svg) {
    const segs = Array.from(svg.querySelectorAll(".seg")).map(function (p) {
      const on = p.cloneNode(); on.setAttribute("class", "seg-on"); p.after(on);
      const punto = document.createElementNS(NS, "circle"); punto.setAttribute("class", "pulso"); punto.setAttribute("r", 6); punto.style.opacity = 0;
      svg.appendChild(punto);
      return { p: p, on: on, punto: punto, L: p.getTotalLength(), paso: +p.dataset.step, a: p.dataset.to };
    });
    const pasos = Math.max.apply(null, segs.map(function (s) { return s.paso; }));
    const nodo = function (id) { return svg.querySelector('.nodo[data-id="' + id + '"]'); };
    if (reducir) {
      segs.forEach(function (s) { s.on.style.opacity = 1; });
      svg.querySelectorAll(".nodo").forEach(function (n) { n.classList.add("on"); });
      svg.querySelectorAll(".contador").forEach(function (c) { c.textContent = "1"; });
      return;
    }
    function correr(grupo, dur) {
      return new Promise(function (listo) {
        const t0 = performance.now();
        function f(t) {
          const k = Math.min((t - t0) / dur, 1), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          grupo.forEach(function (s) {
            const pt = s.p.getPointAtLength(s.L * e);
            s.punto.setAttribute("cx", pt.x); s.punto.setAttribute("cy", pt.y);
            s.punto.style.opacity = k < 1 ? 1 : 0;
            s.on.style.opacity = e;
          });
          if (k < 1) requestAnimationFrame(f); else listo();
        }
        requestAnimationFrame(f);
      });
    }
    async function vuelta() {
      // Espera a que el escenario esté a la vista y que este dibujo sea el visible (celular o computadora)
      while (!visible || svg.getBoundingClientRect().width === 0) await esperar(400);
      svg.querySelectorAll(".nodo").forEach(function (n) { n.classList.remove("on"); });
      segs.forEach(function (s) { s.on.style.opacity = 0; });
      await esperar(300);
      svg.querySelectorAll(".nodo[data-inicio]").forEach(function (n) { n.classList.add("on"); });
      await esperar(500);
      for (let p = 1; p <= pasos; p++) {
        const grupo = segs.filter(function (s) { return s.paso === p; });
        await correr(grupo, 950);
        Array.from(new Set(grupo.map(function (s) { return s.a; }))).forEach(function (id) {
          const n = nodo(id); n.classList.add("on");
          const c = n.querySelector(".contador"); if (c) c.textContent = +c.textContent + 1;
        });
        await esperar(250);
      }
      await esperar(1800);
      vuelta();
    }
    vuelta();
  });
})();

/* 13. Landing "Diagnóstico": "¿A qué te dedicas?". La persona escribe su trabajo (o toca un atajo)
       y se muestran ejemplos de su rubro, reconocido por palabras clave. Si no se reconoce, se
       muestran tareas generales. El botón de WhatsApp lleva lo que escribió.
       Desde un anuncio: /diagnostico/#abogados abre directamente ese rubro. */
(function () {
  const sec = document.querySelector(".dq");
  if (!sec) return;
  const campo = sec.querySelector(".dq-campo"), form = sec.querySelector(".dq-form");
  const atajos = Array.from(sec.querySelectorAll(".dq-atajo"));
  const paneles = Array.from(sec.querySelectorAll(".dq-panel"));
  const res = sec.querySelector(".dq-resultado"), eco = sec.querySelector(".dq-eco"), titulo = sec.querySelector(".dq-titulo");
  const wa = sec.querySelector(".dq-wa");
  const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const norm = function (x) { return x.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); };
  let espera = null, actual = null;

  function buscar(texto) {
    const t = norm(texto);
    let mejor = null, puntos = 0;
    paneles.forEach(function (p) {
      const claves = (p.dataset.claves || "").split("|").filter(Boolean);
      let n = 0;
      claves.forEach(function (c) { if (t.indexOf(norm(c)) !== -1) n++; });
      if (n > puntos) { puntos = n; mejor = p; }
    });
    return mejor || paneles.find(function (p) { return p.dataset.rubro === "general"; });
  }
  function mostrar(texto, panel, desplazar) {
    texto = texto.trim();
    if (texto.length < 3 && !panel) { res.hidden = true; actual = null; atajos.forEach(function (a) { a.classList.remove("activo"); }); return; }
    panel = panel || buscar(texto);
    eco.textContent = "«" + texto + "»";
    titulo.textContent = panel.dataset.titulo || "Estas tareas suelen poder hacerse solas en casi cualquier trabajo";
    atajos.forEach(function (a) { a.classList.toggle("activo", a.dataset.rubro === panel.dataset.rubro); });
    const msg = "Hola, me dedico a: " + texto + ". Quiero saber qué tareas de mi trabajo se pueden automatizar.";
    wa.dataset.wa = msg;
    wa.href = "https://wa.me/" + VSH_WHATSAPP + "?text=" + encodeURIComponent(msg);
    if (panel !== actual) {
      paneles.forEach(function (p) { p.hidden = p !== panel; p.classList.remove("dq-entra"); });
      void panel.offsetWidth;
      panel.classList.add("dq-entra");
      actual = panel;
    }
    res.hidden = false;
    if (desplazar) res.scrollIntoView({ behavior: reducir ? "auto" : "smooth", block: "start" });
  }
  campo.addEventListener("input", function () {
    clearTimeout(espera);
    espera = setTimeout(function () { mostrar(campo.value, null, false); }, 350);
  });
  form.addEventListener("submit", function (e) { e.preventDefault(); clearTimeout(espera); mostrar(campo.value, null, true); });
  atajos.forEach(function (a) {
    a.addEventListener("click", function () {
      campo.value = a.dataset.frase;
      const p = paneles.find(function (x) { return x.dataset.rubro === a.dataset.rubro; });
      mostrar(campo.value, p, true);
    });
  });

  // Ejemplos que se escriben solos en el campo vacío, para inspirar
  const ejemplos = (campo.dataset.ejemplos || "").split("|").filter(Boolean);
  if (!reducir && ejemplos.length) {
    let i = 0, j = 0, borrando = false;
    (function tic() {
      if (campo.value || document.activeElement === campo) { campo.placeholder = ejemplos[0]; setTimeout(tic, 800); return; }
      const e = ejemplos[i];
      j += borrando ? -1 : 1;
      campo.placeholder = e.slice(0, j) + (j < e.length || borrando ? "|" : "");
      let pausa = borrando ? 25 : 60;
      if (!borrando && j >= e.length) { borrando = true; pausa = 1600; }
      else if (borrando && j <= 0) { borrando = false; i = (i + 1) % ejemplos.length; pausa = 300; }
      setTimeout(tic, pausa);
    })();
  }

  const inicial = location.hash.slice(1);
  const at = atajos.find(function (a) { return a.dataset.rubro === inicial; });
  if (at) setTimeout(function () { at.click(); }, 60);
})();

/* 14. Diagnóstico: interruptor "A mano / Se hace sola" (la primera vez que la sección
       aparece en pantalla cambia solo a "Se hace sola") y calculadora de tiempo repetido. */
(function () {
  const sec = document.querySelector(".tareas-sec");
  if (sec) {
    const botones = Array.from(sec.querySelectorAll(".tz-switch button"));
    let tocado = false;
    function modo(m) {
      sec.classList.toggle("modo-auto", m === "auto");
      botones.forEach(function (b) { const si = b.dataset.modo === m; b.classList.toggle("activo", si); b.setAttribute("aria-pressed", si ? "true" : "false"); });
    }
    botones.forEach(function (b) { b.addEventListener("click", function () { tocado = true; modo(b.dataset.modo); }); });
    if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const obs = new IntersectionObserver(function (e) {
        if (e[0].isIntersecting) {
          obs.disconnect();
          setTimeout(function () { if (!tocado) modo("auto"); }, 2200);
        }
      }, { threshold: 0.6 });
      obs.observe(sec.querySelector(".tz-card"));
    }
  }

  const calc = document.querySelector(".calc-sec");
  if (!calc) return;
  const filas = Array.from(calc.querySelectorAll(".cl-fila"));
  const horasEl = calc.querySelector(".cl-horas"), diasEl = calc.querySelector(".cl-dias span");
  const boton = calc.querySelector("[data-wa-base]");
  function calcular() {
    let minSemana = 0; const elegidas = [];
    filas.forEach(function (f) {
      const on = f.querySelector("input[type=checkbox]").checked;
      const rango = f.querySelector("input[type=range]");
      f.querySelector("output").textContent = rango.value;
      f.classList.toggle("apagada", !on);
      if (!on) return;
      minSemana += (+rango.value) * (+f.querySelector("select").value);
      elegidas.push(f.querySelector(".cl-check span").textContent.toLowerCase());
    });
    const horas = Math.round(minSemana * 52 / 12 / 60);
    horasEl.textContent = horas;
    diasEl.textContent = (Math.round(horas / 8 * 10) / 10).toString().replace(".", ",");
    if (boton) {
      const txt = boton.dataset.waBase.replace("{h}", horas).replace("{t}", elegidas.join(", ") || "ninguna marcada");
      boton.dataset.wa = txt;
      boton.href = "https://wa.me/" + VSH_WHATSAPP + "?text=" + encodeURIComponent(txt);
    }
  }
  calc.addEventListener("input", calcular);
  calc.addEventListener("change", calcular);
  calcular();
})();
