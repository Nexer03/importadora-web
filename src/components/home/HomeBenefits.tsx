const benefits = [
  {
    title: "Pago seguro",
    description: "Preparado para integrar pagos en la siguiente fase.",
  },
  {
    title: "Envio nacional",
    description: "Cobertura para pedidos fuera de la zona local.",
  },
  {
    title: "Entrega local",
    description: "Opciones practicas para clientes cercanos.",
  },
  {
    title: "Facturacion disponible",
    description: "Listo para flujos comerciales formales.",
  },
];

export function HomeBenefits() {
  return (
    <section className="bg-zinc-50">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {benefits.map((benefit) => (
          <div key={benefit.title} className="rounded-lg bg-white p-5">
            <p className="text-sm font-black uppercase tracking-wide text-zinc-950">
              {benefit.title}
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
