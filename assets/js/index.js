/* Inicio: ejemplo de costos y acceso directo al cálculo. */
(function () {
  "use strict";

  var U = window.USDecide;
  var MONTO_EJEMPLO = 100;
  var CATEGORIA_EJEMPLO = "juegos";
  var categoriaSeleccionada = "juegos";

  var resultados = U.calcularTodos(MONTO_EJEMPLO, CATEGORIA_EJEMPLO, false);
  var masBarato = resultados[0];
  var masCaro = resultados[resultados.length - 1];

  document.getElementById("ejemploMin").textContent = U.formatearARS(masBarato.total);
  document.getElementById("ejemploMinMedio").textContent = masBarato.medio.nombre;
  document.getElementById("ejemploMax").textContent = U.formatearARS(masCaro.total);
  document.getElementById("ejemploMaxMedio").textContent = masCaro.medio.nombre;
  document.getElementById("ejemploAhorro").textContent = U.formatearARS(masCaro.total - masBarato.total);

  var botonesCategoria = document.querySelectorAll("[data-categoria]");
  botonesCategoria.forEach(function (boton) {
    boton.addEventListener("click", function () {
      categoriaSeleccionada = boton.dataset.categoria;
      botonesCategoria.forEach(function (opcion) {
        var seleccionado = opcion === boton;
        opcion.classList.toggle("btn-usd", seleccionado);
        opcion.classList.toggle("btn-usd-outline", !seleccionado);
        opcion.setAttribute("aria-pressed", String(seleccionado));
      });
    });
  });

  var formulario = document.getElementById("formInicio");
  var mensaje = document.getElementById("mensajeInicio");
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    var campo = document.getElementById("montoInicio");
    var monto = Number(campo.value);
    if (!Number.isFinite(monto) || monto < 0.01 || monto > 100000) {
      mensaje.textContent = "Ingresá un monto válido entre US$ 0,01 y US$ 100.000.";
      mensaje.hidden = false;
      campo.setAttribute("aria-invalid", "true");
      campo.focus();
    } else {
      mensaje.hidden = true;
      campo.removeAttribute("aria-invalid");
      U.guardarConsulta(monto, categoriaSeleccionada);
      window.location.href = "secciones/comparativa.html";
    }
  });
})();