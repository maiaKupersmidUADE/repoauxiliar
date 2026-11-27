/*
 * Página Transparencia: fecha de actualización y fuentes oficiales.
 */
(function () {
  "use strict";

  var U = window.USDecide;

  document.getElementById("fechaActualizacion").textContent =
    U.formatearFecha(U.datos.actualizacion);
  document.getElementById("cotizacionVigente").textContent =
    U.formatearARS(U.datos.cotizacion) + " por dólar — " + U.datos.cotizacionNombre;

  var lista = document.getElementById("listaFuentes");
  U.datos.fuentes.forEach(function (fuente) {
    var item = U.el("li", "fuente-item");

    var enlace = U.el("a", "fw-semibold", fuente.nombre);
    enlace.href = fuente.url;
    enlace.target = "_blank";
    enlace.rel = "noopener noreferrer";
    enlace.appendChild(U.el("span", "visually-hidden", " (se abre en una pestaña nueva)"));

    item.appendChild(enlace);
    item.appendChild(U.el("p", "mb-0 text-muted-usd", fuente.uso));
    lista.appendChild(item);
  });
})();
