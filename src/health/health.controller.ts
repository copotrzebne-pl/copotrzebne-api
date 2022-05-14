import { HealthCheck, HealthCheckService, SequelizeHealthIndicator } from '@nestjs/terminus';
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  constructor(private healthCheckService: HealthCheckService, private db: SequelizeHealthIndicator) {}

  @Get()
  @HealthCheck()
  readiness() {
    return this.healthCheckService.check([() => this.db.pingCheck('sequelize')]);
  }
}
