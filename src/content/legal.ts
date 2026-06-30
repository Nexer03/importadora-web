export type LegalSection = {
  heading: string;
  body: string[];
};

export type LegalDoc = {
  slug: string;
  title: string;
  description: string;
  intro?: string;
  sections: LegalSection[];
};

export const legalDocs = {
  terminos: {
    slug: "terminos",
    title: "Terminos y condiciones",
    description:
      "Condiciones de uso de la tienda en linea de Importadora: compras, precios, pagos y responsabilidades.",
    intro:
      "Al usar este sitio y realizar una compra, aceptas los siguientes terminos y condiciones.",
    sections: [
      {
        heading: "Uso del sitio",
        body: [
          "Este sitio es una tienda en linea de accesorios importados con inventario propio. No es un marketplace ni vende a traves de terceros.",
          "El cliente se compromete a proporcionar informacion veraz al registrarse y al realizar una compra.",
        ],
      },
      {
        heading: "Precios y disponibilidad",
        body: [
          "Los precios se muestran en pesos mexicanos (MXN) e incluyen los impuestos aplicables salvo que se indique lo contrario.",
          "La disponibilidad depende del inventario. Si un producto se agota despues de tu compra, se te contactara para resolver o reembolsar.",
        ],
      },
      {
        heading: "Pagos",
        body: [
          "El pago se realiza en linea antes de preparar y enviar el pedido, a traves de las pasarelas de pago disponibles.",
          "La tienda no almacena datos de tarjetas. El procesamiento de pagos lo realizan proveedores externos seguros.",
        ],
      },
      {
        heading: "Responsabilidad",
        body: [
          "La tienda no se hace responsable por retrasos de paqueterias externas, aunque dara seguimiento para apoyar al cliente.",
        ],
      },
    ],
  },
  privacidad: {
    slug: "privacidad",
    title: "Aviso de privacidad",
    description:
      "Como Importadora recopila, usa y protege tus datos personales.",
    intro:
      "Tu privacidad es importante. Este aviso describe que datos recabamos y para que los usamos.",
    sections: [
      {
        heading: "Datos que recabamos",
        body: [
          "Recabamos nombre, correo, telefono y direccion de entrega para procesar tus pedidos.",
          "Si solicitas factura, recabamos tus datos fiscales unicamente para emitirla.",
        ],
      },
      {
        heading: "Uso de los datos",
        body: [
          "Usamos tus datos para procesar pedidos, gestionar envios, emitir facturas y darte soporte.",
          "No vendemos ni compartimos tus datos con terceros con fines de marketing.",
        ],
      },
      {
        heading: "Proteccion",
        body: [
          "Aplicamos medidas razonables de seguridad. Los pagos se procesan en entornos seguros y no almacenamos datos de tarjetas.",
        ],
      },
    ],
  },
  envios: {
    slug: "envios",
    title: "Politica de envios",
    description:
      "Metodos de entrega, tiempos y costos de envio nacional y entrega local.",
    sections: [
      {
        heading: "Metodos de entrega",
        body: [
          "Ofrecemos envio nacional por paqueteria, entrega local en zonas cercanas y recoleccion local sin costo.",
          "El costo de envio se calcula y muestra en el checkout antes de pagar.",
        ],
      },
      {
        heading: "Tiempos",
        body: [
          "Los pedidos se preparan despues de confirmar el pago. Los tiempos de entrega dependen del metodo elegido y la paqueteria.",
          "Recibiras actualizaciones del estado de tu pedido y, cuando aplique, un numero de rastreo.",
        ],
      },
      {
        heading: "Envio gratis",
        body: [
          "Cuando este disponible, el envio gratis aplica a partir de un monto minimo configurado, o mediante un cupon valido.",
        ],
      },
    ],
  },
  cambios: {
    slug: "cambios",
    title: "Politica de cambios",
    description:
      "Condiciones para cambios por producto incorrecto o danado.",
    intro:
      "Queremos que quedes satisfecho con tu compra. Esta es nuestra politica de cambios.",
    sections: [
      {
        heading: "Cuando aplica un cambio",
        body: [
          "Aceptamos cambios por producto incorrecto (distinto al pedido) o producto danado de fabrica.",
          "El reporte debe realizarse dentro del plazo definido al recibir el pedido, con evidencia fotografica.",
        ],
      },
      {
        heading: "Condiciones",
        body: [
          "El producto debe estar sin uso y en sus condiciones originales.",
          "El equipo revisara el caso y la evidencia antes de aceptar o rechazar el cambio.",
        ],
      },
      {
        heading: "Como solicitarlo",
        body: [
          "Escribenos desde la pagina de contacto indicando tu numero de pedido y adjuntando fotos del producto.",
        ],
      },
    ],
  },
  contacto: {
    slug: "contacto",
    title: "Contacto",
    description: "Como comunicarte con Importadora.",
    intro:
      "Estamos para ayudarte con tus pedidos, cambios y dudas generales.",
    sections: [
      {
        heading: "Atencion a clientes",
        body: [
          "Para dudas sobre un pedido, ten a la mano tu numero de pedido.",
          "Los datos de contacto (correo, WhatsApp y redes) se configuran desde el panel de la tienda.",
        ],
      },
      {
        heading: "Zona de operacion",
        body: [
          "Entrega local en Puerto Vallarta y zona cercana. Envio nacional por paqueteria.",
        ],
      },
    ],
  },
  "preguntas-frecuentes": {
    slug: "preguntas-frecuentes",
    title: "Preguntas frecuentes",
    description: "Respuestas a las dudas mas comunes.",
    sections: [
      {
        heading: "Como compro?",
        body: [
          "Agrega productos al carrito, ve al checkout, llena tus datos de entrega y paga en linea. El pedido se prepara tras confirmar el pago.",
        ],
      },
      {
        heading: "Puedo pagar con tarjeta?",
        body: [
          "Si. En el checkout puedes elegir entre las opciones de pago disponibles, incluyendo tarjeta.",
        ],
      },
      {
        heading: "Como uso un cupon?",
        body: [
          "En el carrito ingresa tu codigo de cupon en el campo correspondiente y presiona Aplicar.",
        ],
      },
    ],
  },
} satisfies Record<string, LegalDoc>;

export type LegalSlug = keyof typeof legalDocs;

export const legalNavLinks: Array<{ href: string; label: string }> = [
  { href: "/seguimiento", label: "Seguir mi pedido" },
  { href: "/envios", label: "Politica de envios" },
  { href: "/cambios", label: "Politica de cambios" },
  { href: "/terminos", label: "Terminos y condiciones" },
  { href: "/privacidad", label: "Aviso de privacidad" },
  { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
  { href: "/contacto", label: "Contacto" },
];
