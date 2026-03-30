import { Injectable } from '@nestjs/common'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from "../generated/prisma/client"

@Injectable()
export class PrismaService extends PrismaClient {
  private static instance: PrismaService

  constructor() {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set.")
    }

    const adapter = new PrismaBetterSqlite3({ url: connectionString })
    super({ adapter })
  }

  public static getInstance(): PrismaService {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaService()
    }
    return PrismaService.instance as PrismaService
  }

  async onModuleInit() {
    await this.$connect()
  }
}
