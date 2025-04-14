import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Application CRUD", () => {
  let clientId: number;
  let employeeId: number;
  let applicationId: number;
  let clientRoleId: number;
  let employeeRoleId: number;

  beforeAll(async () => {
    // Очистка в правильном порядке с учетом зависимостей
    await prisma.creditCondition.deleteMany();
    await prisma.application.deleteMany();
    await prisma.client.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.role.deleteMany();

    // Создание ролей
    const clientRole = await prisma.role.create({
      data: { name: "CLIENT" },
    });
    clientRoleId = clientRole.id;

    const employeeRole = await prisma.role.create({
      data: { name: "EMPLOYEE" },
    });
    employeeRoleId = employeeRole.id;

    // Создание клиента
    const client = await prisma.client.create({
      data: {
        fullName: "Test Client",
        email: "test.client@example.com",
        phone: "1234567890",
        address: "Test Address",
        clientType: "INDIVIDUAL",
        passwordHash: "hashed_password",
        roleId: clientRoleId,
      },
    });
    clientId = client.id;

    // Создание сотрудника
    const employee = await prisma.employee.create({
      data: {
        fullName: "Test Employee",
        email: "employee@example.com",
        phone: "0987654321",
        passwordHash: "hashed_password",
        roleId: employeeRoleId,
      },
    });
    employeeId = employee.id;
  });

  afterAll(async () => {
    await prisma.creditCondition.deleteMany();
    await prisma.application.deleteMany();
    await prisma.client.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.role.deleteMany();
    await prisma.$disconnect();
  });

  describe("createApplication", () => {
    it("создает заявку с корректными данными", async () => {
      const application = await prisma.application.create({
        data: {
          clientId,
          amountRequested: 100000,
          term: 12,
          status: "PENDING",
          applicationDate: new Date(),
        },
      });

      applicationId = application.id; // Сохраняем ID для последующих тестов

      expect(application).toBeDefined();
      expect(application.amountRequested).toBe(100000);
      expect(application.term).toBe(12);
      expect(application.status).toBe("PENDING");
    });
  });

  describe("updateApplication", () => {
    it("обновляет заявку и создает кредитные условия", async () => {
      const updatedApplication = await prisma.application.update({
        where: { id: applicationId },
        data: {
          status: "APPROVED",
          amountRequested: 60000,
          term: 12,
          employeeId,
        },
      });

      expect(updatedApplication.status).toBe("APPROVED");
      expect(updatedApplication.amountRequested).toBe(60000);
      expect(updatedApplication.term).toBe(12);
      expect(updatedApplication.employeeId).toBe(employeeId);

      const monthlyPayment = calculateMonthlyPayment(60000, 10, 12);
      const condition = await prisma.creditCondition.create({
        data: {
          applicationId,
          interestRate: 10,
          term: 12,
          monthlyPayment,
        },
      });

      expect(condition).toBeDefined();
      expect(condition.monthlyPayment).toBeCloseTo(monthlyPayment, 2);
    });

    it("выбрасывает ошибку при попытке обновить несуществующую заявку", async () => {
      await expect(
        prisma.application.update({
          where: { id: 999999 },
          data: { status: "APPROVED" },
        })
      ).rejects.toThrow();
    });
  });
});

function calculateMonthlyPayment(
  amount: number,
  interestRate: number,
  term: number
): number {
  const monthlyRate = interestRate / 100 / 12;
  return (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
}
