import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// Global, so other modules can use PrismaService without importing this one
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
