/*
 * Página Perfil y ajustes:
 *  - formulario para guardar tarjetas (solo alias y últimos 4 dígitos)
 *  - interruptor de exenciones impositivas
 */
(function () {
  "use strict";

  var U = window.USDecide;

  var formTarjeta = document.getElementById("formTarjeta");
  var campoAlias = document.getElementById("alias");
  var campoTipo = document.getElementById("tipo");
  var campoUltimos = document.getElementById("ultimos4");
  var mensajeTarjeta = document.getElementById("mensajeTarjeta");
  var listaTarjetas = document.getElementById("listaTarjetas");
  var sinTarjetas = document.getElementById("sinTarjetas");

  var formPrefs = document.getElementById("formPrefs");
  var interruptor = document.getElementById("exencion");
  var mensajePrefs = document.getElementById("mensajePrefs");

  var prefs = U.leerPreferencias();

  var NOMBRES_TIPO = {
    credito: "Crédito",
    debito: "Débito",
    prepaga: "Prepaga",
    billetera: "Billetera virtual"
  };

  /* ---------- Mensajes ---------- */

  function mostrar(nodo, tipo, texto) {
    nodo.className = "aviso aviso-" + tipo + " mb-3";
    nodo.textContent = texto;
    nodo.hidden = false;
  }

  /* ---------- Validación de cada campo ---------- */

  // Cada validador devuelve un texto de error o "" si el campo es válido.
  var validadores = {
    alias: function (valor) {
      var v = valor.trim();
      if (v === "") return "Ponele un alias a la tarjeta, por ejemplo “Visa del banco”.";
      if (v.length < 3) return "El alias tiene que tener al menos 3 caracteres.";
      if (v.length > 20) return "El alias puede tener hasta 20 caracteres.";
      if (!/^[\p{L}\p{N} ]+$/u.test(v)) return "Usá solo letras, números y espacios.";
      return "";
    },
    tipo: function (valor) {
      return valor === "" ? "Elegí el tipo de tarjeta." : "";
    },
    ultimos4: function (valor) {
      var v = valor.trim();
      if (v === "") return "Ingresá los últimos 4 dígitos.";
      if (!/^\d{4}$/.test(v)) return "Son exactamente 4 números, sin espacios.";
      return "";
    }
  };

  function validarCampo(campo) {
    var error = validadores[campo.name](campo.value);
    var contenedorError = document.getElementById("error-" + campo.id);
    contenedorError.textContent = error;

    campo.classList.toggle("is-invalid", error !== "");
    campo.classList.toggle("is-valid", error === "");
    campo.setAttribute("aria-invalid", error !== "" ? "true" : "false");
    return error === "";
  }

  var campos = [campoAlias, campoTipo, campoUltimos];
  var intentoEnviar = false;

  campos.forEach(function (campo) {
    campo.addEventListener("blur", function () {
      if (campo.value !== "" || intentoEnviar) validarCampo(campo);
    });
    campo.addEventListener("input", function () {
      if (intentoEnviar || campo.classList.contains("is-invalid")) validarCampo(campo);
    });
  });

  // Solo permite escribir dígitos en el campo de últimos 4.
  campoUltimos.addEventListener("input", function () {
    campoUltimos.value = campoUltimos.value.replace(/\D/g, "").slice(0, 4);
  });

  /* ---------- Lista de tarjetas guardadas ---------- */

  function dibujarTarjetas() {
    listaTarjetas.textContent = "";
    sinTarjetas.hidden = prefs.tarjetas.length > 0;

    prefs.tarjetas.forEach(function (t, indice) {
      var item = U.el("li", "tarjeta-guardada");

      var texto = U.el("div", "");
      texto.appendChild(U.el("strong", "d-block", t.alias));
      texto.appendChild(
        U.el("span", "text-muted-usd", (NOMBRES_TIPO[t.tipo] || t.tipo) + " · **** " + t.ultimos4)
      );

      var borrar = U.el("button", "btn btn-usd-outline btn-sm", "Quitar");
      borrar.type = "button";
      borrar.setAttribute("aria-label", "Quitar la tarjeta " + t.alias);
      borrar.addEventListener("click", function () {
        prefs.tarjetas.splice(indice, 1);
        U.guardarPreferencias(prefs);
        dibujarTarjetas();
        mostrar(mensajeTarjeta, "ok", "Quitaste la tarjeta “" + t.alias + "”.");
      });

      item.appendChild(texto);
      item.appendChild(borrar);
      listaTarjetas.appendChild(item);
    });
  }

  /* ---------- Envío del formulario de tarjeta ---------- */

  formTarjeta.addEventListener("submit", function (evento) {
    evento.preventDefault();
    intentoEnviar = true;

    var todoValido = campos.map(validarCampo).every(Boolean);

    if (!todoValido) {
      mostrar(mensajeTarjeta, "error", "Hay campos para corregir. Revisá los mensajes en rojo.");
      var primerError = formTarjeta.querySelector(".is-invalid");
      if (primerError) primerError.focus();
      return;
    }

    if (prefs.tarjetas.length >= 5) {
      mostrar(mensajeTarjeta, "error", "Podés guardar hasta 5 tarjetas. Quitá una para agregar otra.");
      return;
    }

    prefs.tarjetas.push({
      alias: campoAlias.value.trim(),
      tipo: campoTipo.value,
      ultimos4: campoUltimos.value.trim()
    });

    if (!U.guardarPreferencias(prefs)) {
      prefs.tarjetas.pop();
      mostrar(mensajeTarjeta, "error", "No pudimos guardar la tarjeta. Revisá que el navegador permita guardar datos del sitio.");
      return;
    }

    formTarjeta.reset();
    intentoEnviar = false;
    campos.forEach(function (c) {
      c.classList.remove("is-valid", "is-invalid");
      c.removeAttribute("aria-invalid");
    });
    dibujarTarjetas();
    mostrar(mensajeTarjeta, "ok", "Tarjeta guardada. Solo se guardaron el alias y los últimos 4 dígitos.");
  });

  /* ---------- Preferencias (interruptor de exenciones) ---------- */

  formPrefs.addEventListener("submit", function (evento) {
    evento.preventDefault();
    prefs.exencion = interruptor.checked;

    if (U.guardarPreferencias(prefs)) {
      mostrar(
        mensajePrefs,
        "ok",
        prefs.exencion
          ? "Preferencias guardadas: los cálculos van a considerar tus exenciones."
          : "Preferencias guardadas: los cálculos van a incluir las percepciones completas."
      );
    } else {
      mostrar(mensajePrefs, "error", "No pudimos guardar tus preferencias. Revisá que el navegador permita guardar datos del sitio.");
    }
  });

  /* ---------- Inicio ---------- */

  interruptor.checked = prefs.exencion;
  dibujarTarjetas();
})();
