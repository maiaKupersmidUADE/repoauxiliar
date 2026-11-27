/*
 * USDecide - datos editables
 * --------------------------------------------------------------
 * IMPORTANTE: todos los valores de este archivo son de DEMOSTRACIÓN.
 * Para actualizar cotización, porcentajes o fecha alcanza con editar
 * este archivo: no hace falta tocar el resto del código.
 *
 * Los porcentajes se expresan en "por ciento" (30 = 30%).
 */
window.USDECIDE_DATA = {
  // Mientras sea true, el sitio muestra el aviso de "valores de demostración".
  demo: true,

  // Fecha y hora de la última actualización manual de los valores (formato ISO).
  actualizacion: "2026-11-26T10:00:00",

  // Cotización usada para convertir dólares a pesos (ARS por US$ 1).
  cotizacion: 1250,
  cotizacionNombre: "Dólar oficial (valor de demostración)",

  // Tipos de compra. "recargo" es un % extra propio de la categoría.
  categorias: [
    { id: "juegos", nombre: "Juegos", recargo: 0 },
    { id: "ropa", nombre: "Ropa", recargo: 0 },
    {
      id: "suscripciones",
      nombre: "Suscripciones",
      recargo: 21,
      nota: "Incluye un recargo del 21% (IVA sobre servicios digitales, valor de demostración)."
    }
  ],

  // Medios de pago.
  //  pais        -> % de impuesto PAIS
  //  percepcion  -> % de percepciones impositivas
  //  comision    -> % de comisión propia del medio
  //  aplicaExencion -> si es true, el usuario con exenciones paga 0% de percepción
  medios: [
    {
      id: "dolares-cuenta",
      nombre: "Dólares en cuenta",
      descripcion: "Pagás con dólares que ya tenés en tu cuenta bancaria.",
      pais: 0,
      percepcion: 0,
      comision: 2.4,
      aplicaExencion: false
    },
    {
      id: "debito",
      nombre: "Tarjeta de débito",
      descripcion: "Se debita de tu cuenta en pesos al momento de la compra.",
      pais: 0,
      percepcion: 30,
      comision: 0,
      aplicaExencion: true
    },
    {
      id: "credito",
      nombre: "Tarjeta de crédito",
      descripcion: "El importe llega en el resumen de la tarjeta.",
      pais: 0,
      percepcion: 30,
      comision: 0,
      aplicaExencion: true
    },
    {
      id: "billetera",
      nombre: "Billetera virtual",
      descripcion: "Por ejemplo, Mercado Pago.",
      pais: 0,
      percepcion: 30,
      comision: 1.5,
      aplicaExencion: true
    }
  ],

  // Fuentes oficiales de referencia (página de Transparencia).
  fuentes: [
    {
      nombre: "Banco Central de la República Argentina (BCRA)",
      url: "https://www.bcra.gob.ar/",
      uso: "Cotizaciones de referencia y normativa cambiaria."
    },
    {
      nombre: "Banco de la Nación Argentina (BNA)",
      url: "https://www.bna.com.ar/",
      uso: "Cotización del dólar oficial en el mostrador."
    },
    {
      nombre: "ARCA (ex AFIP)",
      url: "https://www.arca.gob.ar/",
      uso: "Impuestos y percepciones aplicables a compras en el exterior."
    }
  ],

  // Explicación en lenguaje simple de cada línea del desglose.
  conceptos: {
    base: "Es el precio en dólares multiplicado por la cotización usada.",
    categoria: "Recargo propio del tipo de compra, por ejemplo el IVA en servicios digitales.",
    pais: "Impuesto PAIS. En esta simulación vale 0%.",
    percepcion: "Adelanto de impuestos que se cobra al pagar en el exterior con tarjeta o billetera. Si tenés exención, se reduce a 0%.",
    comision: "Costo propio del medio de pago, si lo tiene."
  }
};
