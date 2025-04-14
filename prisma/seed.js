import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Очистка базы данных
  await prisma.creditCondition.deleteMany();
  await prisma.application.deleteMany();
  await prisma.device.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.client.deleteMany();
  await prisma.role.deleteMany();

  // 1. Создание ролей (4 штуки)
  const roles = await Promise.all([
    prisma.role.create({ data: { name: "CLIENT" } }),
    prisma.role.create({ data: { name: "EMPLOYEE" } }),
    prisma.role.create({ data: { name: "ADMIN" } }),
  ]);

  // 2. Создание 12 клиентов (для входа используйте client1@example.com...client10@example.com, пароль: password123)
  const clients = await Promise.all([
    // Физические лица
    ...Array.from({ length: 8 }, (_, i) =>
      prisma.client.create({
        data: {
          fullName: `Клиент ${i + 1} Иванов`,
          email: `client${i + 1}@example.com`,
          phone: `+7999000000${i + 1}`,
          address: `г. Москва, ул. Тестовая, д. ${i + 1}`,
          clientType: "INDIVIDUAL",
          passwordHash: bcrypt.hashSync("password123", 10),
          roleId: roles.find((r) => r.name === "CLIENT").id,
        },
      })
    ),
    // Юридические лица
    prisma.client.create({
      data: {
        fullName: "ООО Ромашка",
        email: "company1@example.com",
        phone: "+79991112233",
        address: "г. Москва, ул. Бизнесовая, д. 1",
        clientType: "LEGAL_ENTITY",
        passwordHash: bcrypt.hashSync("password123", 10),
        roleId: roles.find((r) => r.name === "CLIENT").id,
      },
    }),
    prisma.client.create({
      data: {
        fullName: "ИП Сидоров",
        email: "company2@example.com",
        phone: "+79994445566",
        address: "г. Казань, ул. Предпринимателей, д. 5",
        clientType: "LEGAL_ENTITY",
        passwordHash: bcrypt.hashSync("password123", 10),
        roleId: roles.find((r) => r.name === "CLIENT").id,
      },
    }),
  ]);

  // 3. Создание 12 сотрудников (для входа используйте employee1@example.com...employee10@example.com, пароль: password123)
  const employees = await Promise.all([
    // Админы
    prisma.employee.create({
      data: {
        fullName: "Главный Администратор",
        email: "admin1@example.com",
        phone: "+79998887766",
        passwordHash: bcrypt.hashSync("password123", 10),
        roleId: roles.find((r) => r.name === "ADMIN").id,
      },
    }),
    // Сотрудники
    ...Array.from({ length: 8 }, (_, i) =>
      prisma.employee.create({
        data: {
          fullName: `Сотрудник ${i + 1} Петров`,
          email: `employee${i + 1}@example.com`,
          phone: `+7999777000${i + 1}`,
          passwordHash: bcrypt.hashSync("password123", 10),
          roleId: roles.find((r) => r.name === "EMPLOYEE").id,
        },
      })
    ),
  ]);

  // 4. Создание 10 устройств (для тестирования)
  const devices = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.device.create({
        data: {
          position: i % 2 === 0 ? "Кредитный менеджер" : "Аналитик",
          phone: `+799955500${i}`,
          email: `device${i + 1}@example.com`,
        },
      })
    )
  );

  // 5. Создание 20 заявок
  const applications = await Promise.all(
    Array.from({ length: 20 }, (_, i) => {
      const statuses = ["PENDING", "APPROVED", "REJECTED"];
      return prisma.application.create({
        data: {
          clientId: clients[i % clients.length].id,
          deviceId: devices[i % devices.length].id,
          employeeId: employees[i % employees.length].id,
          applicationDate: new Date(Date.now() - i * 86400000), // На разные даты
          status: statuses[i % statuses.length],
          amountRequested: [100000, 300000, 500000, 1000000][i % 4],
          term: [6, 12, 24, 36][i % 4],
          monthlyPayment: [5000, 15000, 25000, 35000][i % 4],
        },
      });
    })
  );

  // 6. Создание условий кредита (15 записей)
  await Promise.all(
    Array.from({ length: 15 }, (_, i) =>
      prisma.creditCondition.create({
        data: {
          applicationId: applications[i].id,
          interestRate: [10, 12, 15, 8][i % 4],
          term: [12, 24, 36, 6][i % 4],
          monthlyPayment: [10000, 20000, 30000, 5000][i % 4],
        },
      })
    )
  );

  console.log("База заполнена тестовыми данными!");
  console.log("Доступные логины (пароль для всех: password123):");
  console.log("- Клиенты: client1@example.com ... client10@example.com");
  console.log("- Сотрудники: employee1@example.com ... employee10@example.com");
  console.log("- Админы: admin1@example.com");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
