# Reglas del proyecto

- El proyecto es un e-commerce de accesorios importados.
- La primera version sera web responsive.
- La arquitectura debe quedar preparada para futura app movil.
- La logica critica debe vivir en services, no en componentes.
- Los componentes solo deben manejar UI.
- Los repositories deben manejar acceso a base de datos.
- Los validators deben manejar validaciones con Zod.
- No confiar en datos del frontend.
- Precios, descuentos, stock, checkout y ordenes deben validarse en backend.
- No guardar tarjetas en la base de datos.
- No borrar pedidos fisicamente.
- Usar archivado o estados.
- SEO debe estar contemplado desde productos, categorias y colecciones.
- La BD sera MySQL/MariaDB con Prisma.
- Las migraciones se haran con Prisma Migrate.