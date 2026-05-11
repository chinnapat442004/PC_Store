import { describe, it, expect } from 'vitest'
import {
  calculateDiscountAmount,
  calculatePrice,
  formatPrice,
  calculateCartTotal,
} from './priceCalculation'
import { DiscountType, type Coupon } from '@/types/Coupon'

describe('priceCalculation', () => {
  describe('calculateDiscountAmount', () => {
    it('should calculate percent discount correctly', () => {
      const coupon: Coupon = {
        coupon_id: 1,
        code: 'PERCENT20',
        description: '20% discount',
        discount_type: DiscountType.PERCENT,
        discount_value: 20,
        start_date: new Date(),
        end_date: new Date(),
        used_count: 0,
        is_active: true,
      }
      const subtotal = 1000
      const discount = calculateDiscountAmount(subtotal, coupon)
      expect(discount).toBe(200)
    })

    it('should respect max_discount limit for percent coupon', () => {
      const coupon: Coupon = {
        coupon_id: 2,
        code: 'PERCENT50',
        description: '50% discount with max limit',
        discount_type: DiscountType.PERCENT,
        discount_value: 50,
        max_discount: 100,
        start_date: new Date(),
        end_date: new Date(),
        used_count: 0,
        is_active: true,
      }
      const subtotal = 500
      const discount = calculateDiscountAmount(subtotal, coupon)
      expect(discount).toBe(100) // 50% of 500 = 250, but limited to 100
    })

    it('should calculate fixed discount correctly', () => {
      const coupon: Coupon = {
        coupon_id: 3,
        code: 'FIXED100',
        description: '100 baht discount',
        discount_type: DiscountType.FIXED,
        discount_value: 100,
        start_date: new Date(),
        end_date: new Date(),
        used_count: 0,
        is_active: true,
      }
      const subtotal = 1000
      const discount = calculateDiscountAmount(subtotal, coupon)
      expect(discount).toBe(100)
    })

    it('should return 0 for invalid discount type', () => {
      const coupon: Coupon = {
        coupon_id: 4,
        code: 'INVALID',
        description: 'Invalid coupon',
        discount_type: 'invalid' as DiscountType,
        discount_value: 50,
        start_date: new Date(),
        end_date: new Date(),
        used_count: 0,
        is_active: true,
      }
      const subtotal = 1000
      const discount = calculateDiscountAmount(subtotal, coupon)
      expect(discount).toBe(0)
    })

    it('should handle zero subtotal', () => {
      const coupon: Coupon = {
        coupon_id: 5,
        code: 'ZERO',
        description: 'Coupon for zero subtotal',
        discount_type: DiscountType.PERCENT,
        discount_value: 50,
        start_date: new Date(),
        end_date: new Date(),
        used_count: 0,
        is_active: true,
      }
      const discount = calculateDiscountAmount(0, coupon)
      expect(discount).toBe(0)
    })

    it('should handle decimal subtotal values', () => {
      const coupon: Coupon = {
        coupon_id: 6,
        code: 'DECIMAL',
        description: 'Coupon for decimal values',
        discount_type: DiscountType.PERCENT,
        discount_value: 15,
        start_date: new Date(),
        end_date: new Date(),
        used_count: 0,
        is_active: true,
      }
      const subtotal = 999.99
      const discount = calculateDiscountAmount(subtotal, coupon)
      expect(discount).toBe(149.9985)
    })
  })

  describe('calculatePrice', () => {
    it('should calculate price without coupon correctly', () => {
      const subtotal = 1000
      const result = calculatePrice(subtotal)
      expect(result).toEqual({
        subtotal: 1000,
        discount: 0,
        total: 1000,
      })
    })

    it('should calculate price with percent coupon correctly', () => {
      const coupon: Coupon = {
        coupon_id: 1,
        code: 'PERCENT10',
        description: '10% discount',
        discount_type: DiscountType.PERCENT,
        discount_value: 10,
        start_date: new Date(),
        end_date: new Date(),
        used_count: 0,
        is_active: true,
      }
      const subtotal = 1000
      const result = calculatePrice(subtotal, coupon)
      expect(result).toEqual({
        subtotal: 1000,
        discount: 100,
        total: 900,
      })
    })

    it('should calculate price with fixed coupon correctly', () => {
      const coupon: Coupon = {
        coupon_id: 2,
        code: 'FIXED50',
        description: '50 baht discount',
        discount_type: DiscountType.FIXED,
        discount_value: 50,
        start_date: new Date(),
        end_date: new Date(),
        used_count: 0,
        is_active: true,
      }
      const subtotal = 500
      const result = calculatePrice(subtotal, coupon)
      expect(result).toEqual({
        subtotal: 500,
        discount: 50,
        total: 450,
      })
    })

    it('should ensure total is not negative', () => {
      const coupon: Coupon = {
        coupon_id: 3,
        code: 'LARGE',
        description: 'Large discount',
        discount_type: DiscountType.FIXED,
        discount_value: 1000,
        start_date: new Date(),
        end_date: new Date(),
        used_count: 0,
        is_active: true,
      }
      const subtotal = 100
      const result = calculatePrice(subtotal, coupon)
      expect(result.total).toBe(0)
    })

    it('should round to 2 decimal places', () => {
      const coupon: Coupon = {
        coupon_id: 4,
        code: 'DECIMAL',
        description: 'Decimal discount',
        discount_type: DiscountType.PERCENT,
        discount_value: 33,
        start_date: new Date(),
        end_date: new Date(),
        used_count: 0,
        is_active: true,
      }
      const subtotal = 100
      const result = calculatePrice(subtotal, coupon)
      expect(result.subtotal).toBe(100)
      expect(result.discount).toBe(33)
      expect(result.total).toBe(67)
    })

    it('should handle max_discount limit', () => {
      const coupon: Coupon = {
        coupon_id: 5,
        code: 'LIMITED',
        description: 'Limited discount',
        discount_type: DiscountType.PERCENT,
        discount_value: 50,
        max_discount: 200,
        start_date: new Date(),
        end_date: new Date(),
        used_count: 0,
        is_active: true,
      }
      const subtotal = 1000
      const result = calculatePrice(subtotal, coupon)
      expect(result.discount).toBe(200) // Limited to max_discount
      expect(result.total).toBe(800)
    })
  })

  describe('formatPrice', () => {
    it('should format price with baht symbol', () => {
      const result = formatPrice(100)
      expect(result).toBe('฿100.00')
    })

    it('should format decimal price correctly', () => {
      const result = formatPrice(99.99)
      expect(result).toBe('฿99.99')
    })

    it('should format zero price', () => {
      const result = formatPrice(0)
      expect(result).toBe('฿0.00')
    })

    it('should format large price', () => {
      const result = formatPrice(99999.99)
      expect(result).toBe('฿99999.99')
    })

    it('should round to 2 decimal places', () => {
      const result = formatPrice(100.556)
      expect(result).toBe('฿100.56')
    })
  })

  describe('calculateCartTotal', () => {
    it('should calculate cart total without coupon', () => {
      const items = [
        { price: 100, quantity: 2 },
        { price: 50, quantity: 1 },
      ]
      const result = calculateCartTotal(items)
      expect(result).toEqual({
        subtotal: 250,
        discount: 0,
        total: 250,
      })
    })

    it('should calculate cart total with percent coupon', () => {
      const coupon: Coupon = {
        coupon_id: 1,
        code: 'CART10',
        description: '10% cart discount',
        discount_type: DiscountType.PERCENT,
        discount_value: 10,
        start_date: new Date(),
        end_date: new Date(),
        used_count: 0,
        is_active: true,
      }
      const items = [
        { price: 100, quantity: 2 },
        { price: 50, quantity: 2 },
      ]
      const result = calculateCartTotal(items, coupon)
      expect(result).toEqual({
        subtotal: 300,
        discount: 30,
        total: 270,
      })
    })

    it('should calculate cart total with fixed coupon', () => {
      const coupon: Coupon = {
        coupon_id: 2,
        code: 'CART_FIXED',
        description: 'Fixed cart discount',
        discount_type: DiscountType.FIXED,
        discount_value: 100,
        start_date: new Date(),
        end_date: new Date(),
        used_count: 0,
        is_active: true,
      }
      const items = [{ price: 500, quantity: 1 }]
      const result = calculateCartTotal(items, coupon)
      expect(result).toEqual({
        subtotal: 500,
        discount: 100,
        total: 400,
      })
    })

    it('should handle empty cart', () => {
      const items: Array<{ price: number; quantity: number }> = []
      const result = calculateCartTotal(items)
      expect(result).toEqual({
        subtotal: 0,
        discount: 0,
        total: 0,
      })
    })

    it('should handle multiple items with different prices and quantities', () => {
      const items = [
        { price: 150, quantity: 3 },
        { price: 200, quantity: 2 },
        { price: 75, quantity: 4 },
      ]
      const result = calculateCartTotal(items)
      expect(result.subtotal).toBe(1150)
      expect(result.total).toBe(1150)
    })

    it('should apply coupon to cart total correctly', () => {
      const coupon: Coupon = {
        coupon_id: 3,
        code: 'MULTI',
        description: 'Multi-item discount',
        discount_type: DiscountType.PERCENT,
        discount_value: 20,
        start_date: new Date(),
        end_date: new Date(),
        used_count: 0,
        is_active: true,
      }
      const items = [
        { price: 100, quantity: 1 },
        { price: 200, quantity: 1 },
        { price: 300, quantity: 1 },
      ]
      const result = calculateCartTotal(items, coupon)
      expect(result.subtotal).toBe(600)
      expect(result.discount).toBe(120)
      expect(result.total).toBe(480)
    })
  })

  describe('Edge cases', () => {
    it('should handle very large numbers', () => {
      const coupon: Coupon = {
        coupon_id: 1,
        code: 'LARGE',
        description: 'Large numbers test',
        discount_type: DiscountType.PERCENT,
        discount_value: 10,
        start_date: new Date(),
        end_date: new Date(),
        used_count: 0,
        is_active: true,
      }
      const subtotal = 999999999.99
      const result = calculatePrice(subtotal, coupon)

      expect(result.subtotal).toBe(999999999.99)


      expect(result.discount).toBe(100000000)

      expect(result.total).toBe(899999999.99)
    })

    it('should handle negative quantity in items (defensive)', () => {
      const items = [{ price: 100, quantity: -1 }]
      const result = calculateCartTotal(items)
      expect(result.subtotal).toBe(-100)
      // Test shows the function returns what's calculated, validation should happen elsewhere
    })

    it('should handle percent coupon with 0 discount value', () => {
      const coupon: Coupon = {
        coupon_id: 1,
        code: 'ZERO',
        description: 'Zero discount',
        discount_type: DiscountType.PERCENT,
        discount_value: 0,
        start_date: new Date(),
        end_date: new Date(),
        used_count: 0,
        is_active: true,
      }
      const result = calculatePrice(1000, coupon)
      expect(result.discount).toBe(0)
      expect(result.total).toBe(1000)
    })

    it('should handle fixed coupon with max_discount lower than discount_value', () => {
      const coupon: Coupon = {
        coupon_id: 1,
        code: 'FIXED_LIMITED',
        description: 'Fixed with limit',
        discount_type: DiscountType.FIXED,
        discount_value: 500,
        max_discount: 200,
        start_date: new Date(),
        end_date: new Date(),
        used_count: 0,
        is_active: true,
      }
      const result = calculatePrice(1000, coupon)
      // Fixed discount doesn't use max_discount limit (only percent does)
      expect(result.discount).toBe(500)
      expect(result.total).toBe(500)
    })
  })
})
