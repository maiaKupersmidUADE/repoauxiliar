/*
 * USDecide - lógica de cálculo y almacenamiento
 * Depende de data.js (window.USDECIDE_DATA).
 */
(function () {
  "use strict";

  var D = window.USDECIDE_DATA;
  var CLAVE_CONSULTA = "usdecide.consulta";
  var CLAVE_PREFS = "usdecide.preferencias";

  /* ---------- Formato ---------- */

  function formatearARS(valor) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0
    }).format(valor);
  }

  function formatearUSD(valor) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "USD",
      currencyDisplay: "code",
      minimumFractionDigits: 2
    }).format(valor).replace("USD", "US$");
  }

  function formatearPorcentaje(valor) {
    return String(valor).replace(".", ",") + "%";
  }

  function formatearFecha(iso) {
    var f = new Date(iso);
    var fecha = new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(f);
    var hora = new Intl.DateTimeFormat("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(f);
    return fecha + " - " + hora;
  }

  /* ---------- Búsquedas ---------- */

  function buscarCategoria(id) {
    for (var i = 0; i < D.categorias.length; i++) {
      if (D.categorias[i].id === id) return D.categorias[i];
    }
    return null;
  }

  function buscarMedio(id) {
    for (var i = 0; i < D.medios.length; i++) {
      if (D.medios[i].id === id) return D.medios[i];
    }
    return null;
  }

  /* ---------- Cálculo ---------- */

  // Devuelve el desglose completo de un medio de pago.
  // Cada línea se redondea por separado para que las filas sumen el total.
  function calcularMedio(usd, categoria, medio, tieneExencion) {
    var base = Math.round(usd * D.cotizacion);
    var exento = tieneExencion && medio.aplicaExencion;
    var pctPercepcion = exento ? 0 : medio.percepcion;

    var lineas = {
      base: base,
      categoria: Math.round(base * categoria.recargo / 100),
      pais: Math.round(base * medio.pais / 100),
      percepcion: Math.round(base * pctPercepcion / 100),
      comision: Math.round(base * medio.comision / 100)
    };

    return {
      medio: medio,
      usd: usd,
      cotizacion: D.cotizacion,
      porcentajes: {
        categoria: categoria.recargo,
        pais: medio.pais,
        percepcion: pctPercepcion,
        comision: medio.comision
      },
      exento: exento,
      lineas: lineas,
      total: lineas.base + lineas.categoria + lineas.pais + lineas.percepcion + lineas.comision
    };
  }

  // Calcula todos los medios y los ordena del más barato al más caro.
  function calcularTodos(usd, idCategoria, tieneExencion) {
    var categoria = buscarCategoria(idCategoria) || D.categorias[0];
    var resultados = D.medios.map(function (medio) {
      return calcularMedio(usd, categoria, medio, tieneExencion);
    });
    resultados.sort(function (a, b) { return a.total - b.total; });
    return resultados;
  }

  /* ---------- Almacenamiento (con manejo de errores) ---------- */

  function leer(almacen, clave) {
    try {
      var texto = almacen.getItem(clave);
      return texto ? JSON.parse(texto) : null;
    } catch (e) {
      return null;
    }
  }

  function escribir(almacen, clave, valor) {
    try {
      almacen.setItem(clave, JSON.stringify(valor));
      return true;
    } catch (e) {
      return false;
    }
  }

  function guardarConsulta(usd, categoria) {
    return escribir(window.sessionStorage, CLAVE_CONSULTA, { usd: usd, categoria: categoria });
  }

  function leerConsulta() {
    var c = leer(window.sessionStorage, CLAVE_CONSULTA);
    if (!c || typeof c.usd !== "number" || !buscarCategoria(c.categoria)) return null;
    return c;
  }

  function leerPreferencias() {
    var p = leer(window.localStorage, CLAVE_PREFS) || {};
    return {
      exencion: p.exencion === true,
      tarjetas: Array.isArray(p.tarjetas) ? p.tarjetas : []
    };
  }

  function guardarPreferencias(prefs) {
    return escribir(window.localStorage, CLAVE_PREFS, prefs);
  }

  /* ---------- Utilidad para crear elementos del DOM ---------- */

  function el(etiqueta, clase, texto) {
    var nodo = document.createElement(etiqueta);
    if (clase) nodo.className = clase;
    if (texto !== undefined) nodo.textContent = texto;
    return nodo;
  }

  window.USDecide = {
    datos: D,
    formatearARS: formatearARS,
    formatearUSD: formatearUSD,
    formatearPorcentaje: formatearPorcentaje,
    formatearFecha: formatearFecha,
    buscarCategoria: buscarCategoria,
    buscarMedio: buscarMedio,
    calcularMedio: calcularMedio,
    calcularTodos: calcularTodos,
    guardarConsulta: guardarConsulta,
    leerConsulta: leerConsulta,
    leerPreferencias: leerPreferencias,
    guardarPreferencias: guardarPreferencias,
    el: el
  };
})();
