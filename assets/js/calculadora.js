/*
 * Página Calculadora: formulario con validación y feedback visual.
 */
(function () {
  "use strict";

  var U = window.USDecide;
  var formulario = document.getElementById("formCalculo");
  var campoMonto = document.getElementById("monto");
  var errorMonto = document.getElementById("errorMonto");
  var contenedorCategorias = document.getElementById("categorias");
  var mensaje = document.getElementById("mensajeForm");
  var boton = document.getElementById("botonCalcular");
  var estadoExencion = document.getElementById("estadoExencion");

  var MONTO_MIN = 0.01;
  var MONTO_MAX = 100000;
  var intentoEnviar = false;

  /* ---------- Categorías (se arman desde data.js) ---------- */

  function crearCategorias() {
    U.datos.categorias.forEach(function (cat, i) {
      var radio = U.el("input", "btn-check");
      radio.type = "radio";
      radio.name = "categoria";
      radio.id = "cat-" + cat.id;
      radio.value = cat.id;
      radio.checked = i === 0;

      var etiqueta = U.el("label", "btn btn-usd-outline", cat.nombre);
      etiqueta.setAttribute("for", radio.id);

      contenedorCategorias.appendChild(radio);
      contenedorCategorias.appendChild(etiqueta);
    });
  }

  function categoriaElegida() {
    var elegida = formulario.querySelector('input[name="categoria"]:checked');
    return elegida ? elegida.value : null;
  }

  /* ---------- Validación ---------- */

  // Devuelve un texto de error, o "" si el monto es válido.
  function validarMonto() {
    var texto = campoMonto.value.trim();
    if (texto === "") return "Ingresá el precio en dólares.";

    var valor = Number(texto);
    if (!isFinite(valor)) return "Ingresá solo números, por ejemplo 100 o 49,99.";
    if (valor < MONTO_MIN) return "El precio tiene que ser mayor a cero.";
    if (valor > MONTO_MAX) return "El máximo permitido es US$ 100.000.";
    return "";
  }

  function mostrarEstadoMonto() {
    var error = validarMonto();
    if (error) {
      errorMonto.textContent = error;
      campoMonto.classList.add("is-invalid");
      campoMonto.classList.remove("is-valid");
      campoMonto.setAttribute("aria-invalid", "true");
    } else {
      errorMonto.textContent = "";
      campoMonto.classList.remove("is-invalid");
      campoMonto.classList.add("is-valid");
      campoMonto.setAttribute("aria-invalid", "false");
    }
    return error === "";
  }

  function mostrarMensaje(tipo, texto) {
    mensaje.className = "aviso aviso-" + tipo + " mb-3";
    mensaje.textContent = texto;
    mensaje.hidden = false;
  }

  /* ---------- Eventos ---------- */

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    intentoEnviar = true;

    if (!mostrarEstadoMonto()) {
      mostrarMensaje("error", "Revisá el precio ingresado antes de continuar.");
      campoMonto.focus();
      return;
    }

    var usd = Math.round(Number(campoMonto.value) * 100) / 100;
    var guardado = U.guardarConsulta(usd, categoriaElegida());

    if (!guardado) {
      mostrarMensaje("error", "No pudimos guardar tu consulta. Revisá que el navegador permita guardar datos del sitio.");
      return;
    }

    boton.disabled = true;
    mostrarMensaje("ok", "Listo, calculando el costo final de " + U.formatearUSD(usd) + "…");
    window.setTimeout(function () {
      window.location.href = "comparativa.html";
    }, 600);
  });

  // Una vez que la persona intentó enviar, se valida mientras escribe.
  campoMonto.addEventListener("input", function () {
    if (intentoEnviar) mostrarEstadoMonto();
  });

  campoMonto.addEventListener("blur", function () {
    if (campoMonto.value.trim() !== "") {
      intentoEnviar = true;
      mostrarEstadoMonto();
    }
  });

  /* ---------- Inicio ---------- */

  crearCategorias();

  var prefs = U.leerPreferencias();
  estadoExencion.textContent = prefs.exencion
    ? "Estás calculando CON exenciones impositivas."
    : "Estás calculando SIN exenciones impositivas.";
})();
