/*
 * Página Desglose: explica cómo se compone el importe final de un medio de pago.
 */
(function () {
  "use strict";

  var U = window.USDecide;
  var consulta = U.leerConsulta();
  var vacio = document.getElementById("vacio");
  var contenido = document.getElementById("contenidoDesglose");

  if (!consulta) {
    vacio.hidden = false;
    contenido.hidden = true;
    return;
  }

  var prefs = U.leerPreferencias();
  var categoria = U.buscarCategoria(consulta.categoria);
  var resultados = U.calcularTodos(consulta.usd, consulta.categoria, prefs.exencion);

  // El medio viene en la URL (?medio=debito). Si no existe, se usa el más barato.
  var idPedido = new URLSearchParams(window.location.search).get("medio");
  var elegido = resultados[0];
  resultados.forEach(function (r) {
    if (r.medio.id === idPedido) elegido = r;
  });

  var L = elegido.lineas;
  var P = elegido.porcentajes;

  document.getElementById("tituloMedio").textContent = elegido.medio.nombre;
  document.getElementById("subtituloCompra").textContent =
    U.formatearUSD(consulta.usd) + " en " + categoria.nombre;

  /* ---------- Tabla de desglose ---------- */

  var cuerpo = document.getElementById("filasDesglose");

  function fila(concepto, detalle, importe, esTotal) {
    var tr = U.el("tr", esTotal ? "fila-total" : "");
    var celdaConcepto = U.el("th", "", concepto);
    celdaConcepto.scope = "row";
    if (detalle) {
      celdaConcepto.appendChild(U.el("span", "detalle-fila", detalle));
    }
    tr.appendChild(celdaConcepto);
    tr.appendChild(U.el("td", "importe", importe));
    cuerpo.appendChild(tr);
  }

  fila(
    "Monto base",
    U.formatearUSD(consulta.usd) + " × " + U.formatearARS(elegido.cotizacion),
    U.formatearARS(L.base)
  );
  fila(
    "Recargo por tipo de compra",
    U.formatearPorcentaje(P.categoria) + " (" + categoria.nombre + ")",
    U.formatearARS(L.categoria)
  );
  fila("Impuesto PAIS", U.formatearPorcentaje(P.pais) + " en esta simulación", U.formatearARS(L.pais));
  fila(
    "Percepciones impositivas",
    U.formatearPorcentaje(P.percepcion) + (elegido.exento ? " (con exención)" : prefs.exencion && !elegido.medio.aplicaExencion ? " (este medio no usa percepciones)" : " (sin exención)"),
    U.formatearARS(L.percepcion)
  );
  fila(
    "Comisión del medio",
    U.formatearPorcentaje(P.comision),
    U.formatearARS(L.comision)
  );
  fila("Costo final en ARS", "", U.formatearARS(elegido.total), true);

  /* ---------- Explicación de cada concepto ---------- */

  var glosario = document.getElementById("glosarioDesglose");
  var conceptos = [
    ["Monto base", U.datos.conceptos.base],
    ["Recargo por tipo de compra", U.datos.conceptos.categoria],
    ["Impuesto PAIS", U.datos.conceptos.pais],
    ["Percepciones impositivas", U.datos.conceptos.percepcion],
    ["Comisión del medio", U.datos.conceptos.comision]
  ];
  conceptos.forEach(function (par) {
    glosario.appendChild(U.el("dt", "", par[0]));
    glosario.appendChild(U.el("dd", "", par[1]));
  });

  /* ---------- Cambiar de medio de pago ---------- */

  var otros = document.getElementById("otrosMedios");
  resultados.forEach(function (r) {
    var item = U.el("li", "");
    var enlace = U.el("a", "list-group-item list-group-item-action otro-medio", r.medio.nombre + " — " + U.formatearARS(r.total));
    enlace.href = "desglose.html?medio=" + encodeURIComponent(r.medio.id);
    if (r.medio.id === elegido.medio.id) {
      enlace.classList.add("active");
      enlace.setAttribute("aria-current", "true");
    }
    item.appendChild(enlace);
    otros.appendChild(item);
  });
})();
