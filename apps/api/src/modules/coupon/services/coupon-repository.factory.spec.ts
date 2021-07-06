import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { DiscountType } from '../constants/discount-type.constants';
import { AmountDiscountCoupon } from '../entities/amount-discount-coupon.entity';
import { PercentDiscountCoupon } from '../entities/percent-discount-coupon.entity';
import { CouponRepositoryFactory } from './coupon-repository.factory';

function createTestingModule() {
  return Test.createTestingModule({
    providers: [
      CouponRepositoryFactory,
      {
        provide: getRepositoryToken(AmountDiscountCoupon),
        useValue: { name: AmountDiscountCoupon.name },
      },
      {
        provide: getRepositoryToken(PercentDiscountCoupon),
        useValue: { name: PercentDiscountCoupon.name },
      },
    ],
  }).compile();
}

describe('CouponRepositoryFactory', () => {
  it.each(Object.values(DiscountType))(
    'support %s from .getRepository',
    async discountType => {
      const app: TestingModule = await createTestingModule();
      const factory = app.get(CouponRepositoryFactory);
      expect(() => factory.getRepository({ discountType })).not.toThrow();
    },
  );

  it('Unsupported discount type will throw error', async () => {
    const app: TestingModule = await createTestingModule();
    const factory = app.get(CouponRepositoryFactory);
    expect(() =>
      factory.getRepository({ discountType: 'unknown' as any }),
    ).toThrow('Unknown Discount Type Exception');
  });
});