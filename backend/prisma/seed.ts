import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const user = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
      emailVerified: true,
    }
  });

  // Create portfolio
  const portfolio = await prisma.portfolio.create({
    data: {
      userId: user.id,
      name: 'Main Portfolio',
      balance: 10000,
      currency: 'USD',
      isDefault: true
    }
  });

  // Create some demo holdings
  await prisma.holding.createMany({
    data: [
      {
        portfolioId: portfolio.id,
        symbol: 'BTCUSDT',
        quantity: 0.5,
        avgPrice: 45000,
        totalCost: 22500
      },
      {
        portfolioId: portfolio.id,
        symbol: 'ETHUSDT',
        quantity: 2.0,
        avgPrice: 3000,
        totalCost: 6000
      }
    ]
  });

  console.log('✅ Seeding completed!');
  console.log(`👤 Demo user: demo@example.com / password123`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });