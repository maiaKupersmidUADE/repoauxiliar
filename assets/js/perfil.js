(function () {
  "use strict";
  var U = window.USDecide;
  var CLAVE_CUENTA = "usdecide.cuenta.demo";
  var CLAVE_MEDIOS = "usdecide.medios.demo";
  var acceso = document.getElementById("accesoCuenta");
  var panel = document.getElementById("panelCuenta");
  var formCuenta = document.getElementById("formCuenta");
  var modoRegistro = document.getElementById("modoRegistro");
  var modoIngreso = document.getElementById("modoIngreso");
  var campoNombre = document.getElementById("campoNombre");
  var nombre = document.getElementById("nombreCuenta");
  var email = document.getElementById("emailCuenta");
  var clave = document.getElementById("claveCuenta");
  var mensajeCuenta = document.getElementById("mensajeCuenta");
  var modo = "registro";
  var prefs = U.leerPreferencias();
  var cuenta = leer(CLAVE_CUENTA);
  var sesionActiva = false;

  function leer(claveDato) {
    try { return JSON.parse(localStorage.getItem(claveDato) || "null"); }
    catch (e) { return null; }
  }
  function guardar(claveDato, dato) {
    try { localStorage.setItem(claveDato, JSON.stringify(dato)); return true; }
    catch (e) { return false; }
  }
  function aviso(nodo, tipo, texto) {
    nodo.className = "aviso aviso-" + tipo + " mb-3";
    nodo.textContent = texto;
    nodo.hidden = false;
  }
  function cambiarModo(nuevoModo) {
    modo = nuevoModo;
    var registro = modo === "registro";
    campoNombre.hidden = !registro;
    nombre.required = registro;
    modoRegistro.className = registro ? "btn btn-usd flex-fill" : "btn btn-usd-outline flex-fill";
    modoIngreso.className = registro ? "btn btn-usd-outline flex-fill" : "btn btn-usd flex-fill";
    modoRegistro.setAttribute("aria-pressed", String(registro));
    modoIngreso.setAttribute("aria-pressed", String(!registro));
    document.getElementById("tituloAcceso").textContent = registro ? "Creá tu cuenta demo" : "Ingresá a tu cuenta";
    document.getElementById("botonCuenta").textContent = registro ? "Crear mi cuenta" : "Iniciar sesión";
    clave.autocomplete = registro ? "new-password" : "current-password";
    mensajeCuenta.hidden = true;
  }
  function mostrarPanel() {
    acceso.hidden = true;
    panel.hidden = false;
    document.getElementById("saludoCuenta").textContent = "¡Hola, " + cuenta.nombre + "!";
    document.getElementById("emailPerfil").textContent = cuenta.email;
    cargarMedios();
    document.getElementById("exencion").checked = prefs.exencion;
  }
  function cargarMedios() {
    var medios = leer(CLAVE_MEDIOS) || {};
    document.getElementById("banco").value = medios.banco || "";
    document.getElementById("billetera").value = medios.billetera || "";
    ["tipoTarjeta", "marcaTarjeta"].forEach(function (grupo) {
      document.querySelectorAll('input[name="' + grupo + '"]').forEach(function (c) {
        c.checked = Array.isArray(medios[grupo]) && medios[grupo].indexOf(c.value) !== -1;
      });
    });
  }
  modoRegistro.addEventListener("click", function () { cambiarModo("registro"); });
  modoIngreso.addEventListener("click", function () { cambiarModo("ingreso"); });
  formCuenta.addEventListener("submit", function (evento) {
    evento.preventDefault();
    var correo = email.value.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      aviso(mensajeCuenta, "error", "Ingresá un correo electrónico válido."); email.focus(); return;
    }
    if (clave.value.length < 6) {
      aviso(mensajeCuenta, "error", "La contraseña demo debe tener al menos 6 caracteres."); clave.focus(); return;
    }
    if (modo === "registro") {
      var nombreIngresado = nombre.value.trim();
      if (nombreIngresado.length < 2) {
        aviso(mensajeCuenta, "error", "Ingresá tu nombre para crear la cuenta."); nombre.focus(); return;
      }
      cuenta = { nombre: nombreIngresado, email: correo };
      if (!guardar(CLAVE_CUENTA, cuenta)) {
        aviso(mensajeCuenta, "error", "No se pudo crear la cuenta demo en este navegador."); return;
      }
      aviso(mensajeCuenta, "ok", "Cuenta demo creada. Tus preferencias quedan guardadas en este navegador.");
    } else {
      if (!cuenta || cuenta.email !== correo) {
        aviso(mensajeCuenta, "error", "No encontramos una cuenta demo con ese correo. Creá una cuenta primero."); return;
      }
      aviso(mensajeCuenta, "ok", "Sesión demo iniciada.");
    }
    clave.value = "";
    try { sessionStorage.setItem("usdecide.sesion.demo", "activa"); } catch (e) {}
    window.setTimeout(mostrarPanel, 350);
  });
  document.getElementById("cerrarSesion").addEventListener("click", function () {
    panel.hidden = true; acceso.hidden = false; formCuenta.reset();
    try { sessionStorage.removeItem("usdecide.sesion.demo"); } catch (e) {}
    cambiarModo("ingreso");
  });
  document.getElementById("formMedios").addEventListener("submit", function (evento) {
    evento.preventDefault();
    var medios = {
      banco: document.getElementById("banco").value,
      billetera: document.getElementById("billetera").value,
      tipoTarjeta: Array.from(document.querySelectorAll('input[name="tipoTarjeta"]:checked')).map(function (c) { return c.value; }),
      marcaTarjeta: Array.from(document.querySelectorAll('input[name="marcaTarjeta"]:checked')).map(function (c) { return c.value; })
    };
    var guardado = guardar(CLAVE_MEDIOS, medios);
    aviso(document.getElementById("mensajeMedios"), guardado ? "ok" : "error",
      guardado ? "Preferencias de medios guardadas en este navegador." : "No se pudieron guardar los medios.");
  });
  document.getElementById("formPrefs").addEventListener("submit", function (evento) {
    evento.preventDefault();
    prefs.exencion = document.getElementById("exencion").checked;
    var guardado = U.guardarPreferencias(prefs);
    aviso(document.getElementById("mensajePrefs"), guardado ? "ok" : "error",
      guardado ? "Preferencias de cálculo actualizadas." : "No se pudieron guardar las preferencias.");
  });
  try { sesionActiva = sessionStorage.getItem("usdecide.sesion.demo") === "activa"; } catch (e) {}
  if (sesionActiva && cuenta && cuenta.nombre && cuenta.email) mostrarPanel();
  else cambiarModo(cuenta ? "ingreso" : "registro");
})();