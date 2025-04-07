import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.loyaltyPoint.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.flight.deleteMany();
  await prisma.user.deleteMany();
  // USERS
  const users = [];
  for (let i = 0; i < 9; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        phone: `+7900123456${i}`,
        passwordHash: `hashed_password_${i}`,
        fullName: `User ${i}`,
        passportData: `AB12345${i}`,
        role: i === 0 ? "ADMIN" : "USER",
      },
    });
    users.push(user);
  }
  const userWithKnownHash = await prisma.user.create({
    data: {
      email: "user11@example.com",
      phone: "+790012345611",
      passwordHash:
        "$2b$10$NKUdkXzKSsmDgDP20yKtluy89sYwy7WP63voP8KrolTu8rzZCe7Uy", // Хешированный пароль
      fullName: "User  10",
      passportData: "AB1234511",
      role: "USER",
    },
  });
  users.push(userWithKnownHash);

  // FLIGHTS
  const flights = [];
  for (let i = 0; i < 10; i++) {
    const flight = await prisma.flight.create({
      data: {
        flightNumber: `FL${1000 + i}`,
        departureCity: `City A${i}`,
        arrivalCity: `City B${i}`,
        departureTime: new Date(Date.now() + (i + 1) * 3600000), // +i часов
        arrivalTime: new Date(Date.now() + (i + 2) * 3600000),
        economySeats: 100,
        vipSeats: 20,
        economyPrice: 199.99,
        vipPrice: 899.99,
        status: "SCHEDULED",
      },
    });
    flights.push(flight);
  }

  // BOOKINGS
  for (let i = 0; i < 10; i++) {
    const user = users[i % users.length];
    const flight = flights[i % flights.length];
    const seatClass = i % 2 === 0 ? "ECONOMY" : "VIP";
    const seatCount = (i % 3) + 1;
    const price =
      seatClass === "ECONOMY" ? flight.economyPrice : flight.vipPrice;

    await prisma.booking.create({
      data: {
        userId: user.userId,
        flightId: flight.flightId,
        class: seatClass,
        seatCount,
        totalPrice: price * seatCount,
        pointsUsed: i * 5,
        status: "ACTIVE",
      },
    });
  }

  // LOYALTY POINTS
  for (let i = 0; i < 10; i++) {
    await prisma.loyaltyPoint.create({
      data: {
        userId: users[i].userId,
        points: (i + 1) * 11,
        description: `Бонус за бронирование #${i + 1}`,
      },
    });
  }

  console.log("✅ Seed completed without faker");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
