import type { VerifyingOrderItemRequest } from '@api/modules/coupon/dto/requests/verify-coupon.dto';
import type { RedemptionOrderItemRequest } from '@api/modules/redemption/dto/requests/create-redemption.dto';

export function productBuilder(
  override?: Partial<VerifyingOrderItemRequest | RedemptionOrderItemRequest>,
): any {
  const result = {
    price: 0,
    productId: 'fake-product-id',
    quantity: 1,
    ...override,
  };
  return result;
}
