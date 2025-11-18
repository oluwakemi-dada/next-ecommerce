import { PrismaClient } from '@prisma/client';
import sampleData from './sample-data';

const prisma = new PrismaClient();

const main = async () => {
  console.log('Seeding database...');

  // Delete in correct order to handle foreign keys
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  // Seed users
  await prisma.user.createMany({ data: sampleData.users });

  // Seed products and variants
  for (const product of sampleData.products) {
    const { variants, ...productData } = product;

    const createdProduct = await prisma.product.create({
      data: productData,
    });

    if (variants && variants.length > 0) {
      await prisma.productVariant.createMany({
        data: variants.map((v) => ({
          ...v,
          productId: createdProduct.id,
          price: v.price ?? productData.price,
          stock: v.stock ?? 0,
        })),
      });
    }
  }

  console.log('Database seeded successfully ✅');
};

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
