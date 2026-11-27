/*
 * Página Comparativa: muestra el costo final en pesos de cada medio de pago.
 */
(function () {
  "use strict";

  var U = window.USDecide;
  var consulta = U.leerConsulta();
  var vacio = document.getElementById("vacio");
  var contenido = document.getElementById("contenidoComparativa");

  if (!consulta) {
    vacio.hidden = false;
    contenido.hidden = true;
    return;
  }

  var prefs = U.leerPreferencias();
  var categoria = U.buscarCategoria(consulta.categoria);
  var resultados = U.calcularTodos(consulta.usd, consulta.categoria, prefs.exencion);
  var masBarato = resultados[0];
  var masCaro = resultados[resultados.length - 1];

  /* ---------- Resumen de la compra ---------- */

  document.getElementById("resumenCompra").textContent =
    U.formatearUSD(consulta.usd) + " en " + categoria.nombre;
  document.getElementById("resumenCotizacion").textContent =
    "Cotización usada: " + U.formatearARS(U.datos.cotizacion) + " por dólar. " +
    (prefs.exencion ? "Con exenciones impositivas." : "Sin exenciones impositivas.");

  /* ---------- Tarjetas de medios de pago ---------- */

  var lista = document.getElementById("listaMedios");

  resultados.forEach(function (r, posicion) {
    var esMejor = posicion === 0 && masBarato.total < masCaro.total;
    var tarjeta = U.el("article", "usd-card medio-card" + (esMejor ? " medio-card-top" : ""));

    if (esMejor) {
      tarjeta.appendChild(U.el("span", "badge-usd", "RECOMENDADO · MENOR COSTO"));
    }

    var titulo = U.el("h3", "h5 mt-2 mb-1", r.medio.nombre);
    tarjeta.appendChild(titulo);
    tarjeta.appendChild(U.el("p", "medio-desc mb-2", r.medio.descripcion));

    var total = U.el("p", "total-ars mb-0", U.formatearARS(r.total));
    tarjeta.appendChild(total);
    tarjeta.appendChild(U.el("p", "medio-desc mb-3", "Costo final estimado"));

    var enlace = U.el("a", "btn " + (esMejor ? "btn-usd-claro" : "btn-usd") + " w-100", "Ver desglose");
    enlace.href = "desglose.html?medio=" + encodeURIComponent(r.medio.id);
    enlace.setAttribute("aria-label", "Ver desglose de " + r.medio.nombre);
    tarjeta.appendChild(enlace);

    lista.appendChild(tarjeta);
  });

  /* ---------- Ahorro ---------- */

  var diferencia = masCaro.total - masBarato.total;
  var bloqueAhorro = document.getElementById("bloqueAhorro");

  if (diferencia > 0) {
    document.getElementById("montoAhorro").textContent = U.formatearARS(diferencia);
    document.getElementById("textoAhorro").textContent =
      "Pagando con " + masBarato.medio.nombre.toLowerCase() +
      " en lugar de " + masCaro.medio.nombre.toLowerCase() + ".";
    bloqueAhorro.hidden = false;
  }
})();
