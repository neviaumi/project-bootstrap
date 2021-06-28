import { BaseAPIResponse } from '@api/dto/responses/base-api-response.dto';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class OrderItem {
  @Expose()
  price: number;

  @Expose()
  productId: string;

  @Expose()
  quantity: number;
}

@Exclude()
export class Order {
  @Expose()
  id: string;

  @Expose()
  amount: number;

  @Expose()
  totalAmount: number;

  @Expose()
  totalDiscountAmount: number;

  @Expose()
  items: OrderItem[];
}

@Exclude()
class VerifyCouponResponse {
  @Type(() => Order)
  @Expose()
  order: Order;

  @Expose()
  discountType: string;

  @Expose()
  code: string;

  @Expose()
  amountOff: number;

  @Expose()
  metadata: Record<string, unknown>;

  @Expose()
  percentOff: number;

  @Expose()
  trackingId: string;

  @Expose()
  valid: boolean;
}

@Exclude()
export class VerifyCouponResponseDto extends BaseAPIResponse<VerifyCouponResponse> {
  @Type(() => VerifyCouponResponse)
  @Expose()
  data: VerifyCouponResponse;

  @Expose()
  meta: Record<string, unknown>;

  constructor(coupon: VerifyCouponResponse) {
    super();
    this.data = coupon;
    this.meta = {};
  }
}
