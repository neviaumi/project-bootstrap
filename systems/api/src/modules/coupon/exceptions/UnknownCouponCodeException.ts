import { HttpException, HttpStatus } from '@nestjs/common';

interface InputResponse {
  debugDetails?: Record<string, unknown>;
  errors: string[];
  meta?: Record<string, unknown>;
}

export class UnknownCouponCodeException extends HttpException {
  debugDetails?: Record<string, unknown> | undefined; // Only visible on access log

  constructor(response: InputResponse) {
    const { errors, meta, debugDetails } = response;
    super(
      {
        code: 'ERR_UNKNOWN_COUPON_CODE',
        errors,
        meta,
      },
      HttpStatus.BAD_REQUEST,
    );
    this.debugDetails = debugDetails;
  }
}