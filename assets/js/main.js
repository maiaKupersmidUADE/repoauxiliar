/*
 * USDecide - comportamientos comunes a todas las páginas:
 * aviso de demostración y fecha de actualización en el pie.
 */
(function () {
  "use strict";

  var U = window.USDecide;

  // Año del pie de página.
  var anio = document.getElementById("anioPie");
  if (anio) anio.textContent = new Date().getFullYear();

  // Fecha de actualización de los datos (pie de página).
  var fechaPie = document.getElementById("fechaPie");
  if (fechaPie) fechaPie.textContent = U.formatearFecha(U.datos.actualizacion);

  // Los avisos de demostración solo se muestran si data.js tiene demo: true.
  var avisos = document.querySelectorAll("[data-aviso-demo]");
  avisos.forEach(function (aviso) {
    aviso.hidden = !U.datos.demo;
  });
})();
