import { PrismaClient } from '@prisma/client';
import { hash } from '@/lib/encrypt';
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

  // Hash password and seed users
  const users = [];
  for(let i=0; i < sampleData.users.length; i++) {
    users.push({
      ...sampleData.users[i],
      password: await hash(sampleData.users[i].password)
    })
  }
  await prisma.user.createMany({ data: users });

  // Seed products and variants
  for (const product of sampleData.products) {
    const { variants, ...productData } = product;

    const createdProduct = await prisma.product.create({
      data: productData,
    });

    if (variants && variants.length > 0) {
      await prisma.productVariant.createMany({
        data: variants.map((v, index) => {
          const namePart = productData.name
            .replace(/\s+/g, '')
            .substring(0, 3)
            .toUpperCase();
          const colorPart = v.color ? `${v.color.toUpperCase()}` : '';
          const sizePart = v.size ? `${v.size.toUpperCase()}` : '';

          return {
            ...v,
            productId: createdProduct.id,
            sku: `${namePart}-${colorPart}-${sizePart}-${createdProduct.id}-${index}`,
            price: v.price ?? productData.price,
            stock: v.stock ?? 0,
          };
        }),
      });
    }
  }

  console.log('Database seeded successfully');
};

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
