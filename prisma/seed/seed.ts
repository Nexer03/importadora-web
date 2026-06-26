import { PrismaClient, UserRole, HomeSectionType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  const passwordHash = await bcrypt.hash(
    process.env.SEED_ADMIN_PASSWORD ?? "Admin123!",
    10
  );

  await prisma.user.upsert({
    where: {
      email: process.env.SEED_ADMIN_EMAIL ?? "admin@importadora.local",
    },
    update: {},
    create: {
      name: "Admin",
      email: process.env.SEED_ADMIN_EMAIL ?? "admin@importadora.local",
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  const categories = [
    {
      name: "Bolsos",
      slug: "bolsos",
      description: "Bolsos y accesorios para uso diario.",
      sortOrder: 1,
    },
    {
      name: "Mochilas",
      slug: "mochilas",
      description: "Mochilas casuales, urbanas y practicas.",
      sortOrder: 2,
    },
    {
      name: "Relojes",
      slug: "relojes",
      description: "Relojes casuales y accesorios de uso diario.",
      sortOrder: 3,
    },
    {
      name: "Carteras",
      slug: "carteras",
      description: "Carteras y accesorios compactos.",
      sortOrder: 4,
    },
    {
      name: "Lentes",
      slug: "lentes",
      description: "Lentes y accesorios de estilo.",
      sortOrder: 5,
    },
    {
      name: "Accesorios",
      slug: "accesorios",
      description: "Accesorios variados importados.",
      sortOrder: 6,
    },
    {
      name: "Otros",
      slug: "otros",
      description: "Productos varios del catalogo.",
      sortOrder: 99,
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: {
        ...category,
        seoTitle: `${category.name} | Accesorios importados`,
        seoDescription: category.description,
      },
    });
  }

  const audiences = [
    {
      name: "Dama",
      slug: "dama",
      description: "Accesorios seleccionados para dama.",
      sortOrder: 1,
    },
    {
      name: "Caballero",
      slug: "caballero",
      description: "Accesorios seleccionados para caballero.",
      sortOrder: 2,
    },
    {
      name: "Unisex",
      slug: "unisex",
      description: "Accesorios de estilo unisex.",
      sortOrder: 3,
    },
  ];

  for (const audience of audiences) {
    await prisma.audience.upsert({
      where: { slug: audience.slug },
      update: audience,
      create: audience,
    });
  }

  const collections = [
    {
      name: "Novedades",
      slug: "novedades",
      description: "Productos recien agregados al catalogo.",
      sortOrder: 1,
    },
    {
      name: "Descuentos",
      slug: "descuentos",
      description: "Productos con precios especiales.",
      sortOrder: 2,
    },
    {
      name: "Ofertas de temporada",
      slug: "ofertas-de-temporada",
      description: "Promociones activas por temporada.",
      sortOrder: 3,
    },
    {
      name: "Ultimas piezas",
      slug: "ultimas-piezas",
      description: "Productos con pocas unidades disponibles.",
      sortOrder: 4,
    },
  ];

  for (const collection of collections) {
    await prisma.collection.upsert({
      where: { slug: collection.slug },
      update: collection,
      create: {
        ...collection,
        seoTitle: `${collection.name} | Accesorios importados`,
        seoDescription: collection.description,
      },
    });
  }

  const settings = [
    {
      key: "store_name",
      value: "Importadora",
    },
    {
      key: "free_shipping_min_amount",
      value: "1000",
    },
    {
      key: "national_shipping_cost",
      value: "129",
    },
    {
      key: "local_delivery_cost",
      value: "80",
    },
    {
      key: "announcement_bar",
      value: "Envio gratis a partir de $1000",
    },
  ];

  for (const setting of settings) {
    await prisma.storeSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  await prisma.homeSection.upsert({
    where: {
      id: "home-hero-main",
    },
    update: {},
    create: {
      id: "home-hero-main",
      type: HomeSectionType.HERO,
      title: "Accesorios importados para todos los dias",
      subtitle: "Novedades, descuentos y productos seleccionados.",
      buttonText: "Ver productos",
      buttonUrl: "/productos",
      sortOrder: 1,
      isActive: true,
    },
  });

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });