import type { Coupon } from '@/types/Coupon'
import { DiscountType } from '@/types/Coupon'

export interface PriceDetails {
  subtotal: number
  discount: number
  total: number
}

/**
 * Calculate discount amount based on coupon
 * @param subtotal - The subtotal price before discount
 * @param coupon - The coupon to apply
 * @returns The discount amount
 */
export function calculateDiscountAmount(subtotal: number, coupon: Coupon): number {
  if (coupon.discount_type === DiscountType.PERCENT) {
    const discount = (subtotal * coupon.discount_value) / 100
    // Respect max_discount limit if set
    if (coupon.max_discount && discount > coupon.max_discount) {
      return coupon.max_discount
    }
    return discount
  } else if (coupon.discount_type === DiscountType.FIXED) {
    return coupon.discount_value
  }
  return 0
}

/**
 * Calculate final price details
 * @param subtotal - The subtotal price
 * @param coupon - Optional coupon to apply
 * @returns Price details object with subtotal, discount, and total
 */
export function calculatePrice(subtotal: number, coupon?: Coupon): PriceDetails {
  let discount = 0

  if (coupon) {
    discount = calculateDiscountAmount(subtotal, coupon)
  }

  const total = subtotal - discount

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    total: Number(Math.max(0, total).toFixed(2)), // Ensure total is not negative
  }
}

/**
 * Format price to Thai Baht currency
 * @param price - The price to format
 * @returns Formatted price string
 */
export function formatPrice(price: number): string {
  return `฿${Number(price).toFixed(2)}`
}

/**
 * Calculate cart details
 * @param items - Array of cart items with price and quantity
 * @param coupon - Optional coupon to apply
 * @returns Price details with calculated totals
 */
export function calculateCartTotal(
  items: Array<{ price: number; quantity: number }>,
  coupon?: Coupon,
): PriceDetails {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return calculatePrice(subtotal, coupon)
}
