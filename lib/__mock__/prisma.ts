import { vi } from "vitest";
import { PrismaClient } from "@prisma/client";

export const prismaMock = {
  booking: {
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  flight: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  user: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
} as unknown as PrismaClient;
