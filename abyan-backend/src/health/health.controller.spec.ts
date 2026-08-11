import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;
  let healthCheckService: { check: jest.Mock };
  let mongooseIndicator: { pingCheck: jest.Mock };

  beforeEach(async () => {
    // HealthCheckService و MongooseHealthIndicator يوفّرهما TerminusModule،
    // وهو غير مستورد هنا عمداً — نريد اختبار المتحكم وحده لا الوحدة كاملة.
    healthCheckService = {
      check: jest.fn().mockResolvedValue({ status: 'ok' }),
    };
    mongooseIndicator = {
      pingCheck: jest.fn().mockResolvedValue({ mongodb: { status: 'up' } }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthCheckService, useValue: healthCheckService },
        { provide: MongooseHealthIndicator, useValue: mongooseIndicator },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('يفحص اتصال قاعدة البيانات ضمن فحص الصحة', async () => {
    await controller.check();

    expect(healthCheckService.check).toHaveBeenCalledTimes(1);

    // الفائدة الحقيقية من /health هي كشف انقطاع قاعدة البيانات، لا الرد بـ 200
    // فحسب — لذا نتحقق أن الفحص الممرَّر يستدعي ping على mongodb فعلاً.
    const [indicators] = healthCheckService.check.mock.calls[0];
    await indicators[0]();
    expect(mongooseIndicator.pingCheck).toHaveBeenCalledWith('mongodb');
  });
});
