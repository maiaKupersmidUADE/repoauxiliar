/*
 * Página de inicio: ejemplo calculado con los mismos datos del sitio.
 */
(function () {
  "use strict";

  var U = window.USDecide;
  var MONTO_EJEMPLO = 100;
  var CATEGORIA_EJEMPLO = "juegos";

  var resultados = U.calcularTodos(MONTO_EJEMPLO, CATEGORIA_EJEMPLO, false);
  var masBarato = resultados[0];
  var masCaro = resultados[resultados.length - 1];

  document.getElementById("ejemploMin").textContent = U.formatearARS(masBarato.total);
  document.getElementById("ejemploMinMedio").textContent = masBarato.medio.nombre;
  document.getElementById("ejemploMax").textContent = U.formatearARS(masCaro.total);
  document.getElementById("ejemploMaxMedio").textContent = masCaro.medio.nombre;
  document.getElementById("ejemploAhorro").textContent = U.formatearARS(masCaro.total - masBarato.total);
})();
