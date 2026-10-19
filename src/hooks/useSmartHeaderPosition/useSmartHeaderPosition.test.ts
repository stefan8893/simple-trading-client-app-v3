import { describe, expect, it } from 'vitest'
import type { SmartHeader } from './index'
import {
  getSmartHeader,
  getSmartHeaderForContentArea,
  getSmartHeaderForTopArea,
} from './index'

describe('SmartHeader Logic Unit Tests', () => {
  const headerHeight = 64
  const threshold = 15

  describe('getSmartHeaderForTopArea (0 - 64px)', () => {
    it('should return "fixed-top" when entering from below and header was hidden (sliding in)', () => {
      const previous: SmartHeader = {
        position: 'floating-hidden',
        isAtTop: false,
        scrollY: 200,
      }
      const result = getSmartHeaderForTopArea(previous, 30)

      expect(result.position).toBe('fixed-top')
      expect(result.isAtTop).toBe(true)
    })

    it('should remain "floating-visible" if it was already visible (persistence effect)', () => {
      const previous: SmartHeader = {
        position: 'floating-visible',
        isAtTop: false,
        scrollY: 200,
      }
      const result = getSmartHeaderForTopArea(previous, 30)

      expect(result.position).toBe('floating-visible')
    })

    it('should maintain state when moving within the top area', () => {
      const previous: SmartHeader = {
        position: 'fixed-top',
        isAtTop: true,
        scrollY: 10,
      }
      const result = getSmartHeaderForTopArea(previous, 15)

      expect(result.position).toBe('fixed-top')
    })
  })

  describe('Content Area Logic (> 64px)', () => {
    it('should hide the header when scrolling down fast (Delta > Threshold)', () => {
      const previous: SmartHeader = {
        position: 'floating-visible',
        isAtTop: false,
        scrollY: 300,
      }
      const delta = 20 // 20 > 15
      const result = getSmartHeaderForContentArea(
        previous,
        320,
        delta,
        threshold,
      )

      expect(result.position).toBe('floating-hidden')
    })

    it('should show the header when scrolling up fast', () => {
      const previous: SmartHeader = {
        position: 'floating-hidden',
        isAtTop: false,
        scrollY: 500,
      }
      const delta = -25 // |-25| > 15
      const result = getSmartHeaderForContentArea(
        previous,
        475,
        delta,
        threshold,
      )

      expect(result.position).toBe('floating-visible')
    })

    it('should maintain current state when scrolling too slow (Delta < Threshold)', () => {
      const previous: SmartHeader = {
        position: 'floating-visible',
        isAtTop: false,
        scrollY: 300,
      }
      const delta = 5 // 5 < 15
      const result = getSmartHeaderForContentArea(
        previous,
        305,
        delta,
        threshold,
      )

      expect(result.position).toBe('floating-visible')
    })
  })

  describe('Integration (getSmartHeader main function)', () => {
    it('should switch to "floating-hidden" immediately when leaving the top area downwards', () => {
      const previous: SmartHeader = {
        position: 'fixed-top',
        isAtTop: true,
        scrollY: 50,
      }
      const currentScrollY = 70 // over 64px
      const delta = 20

      const result = getSmartHeader(
        previous,
        currentScrollY,
        headerHeight,
        delta,
        threshold,
      )

      expect(result.position).toBe('floating-hidden')
      expect(result.isAtTop).toBe(false)
    })

    it('should handle negative scroll values (iOS elastic bounce)', () => {
      const previous: SmartHeader = {
        position: 'fixed-top',
        isAtTop: true,
        scrollY: 0,
      }
      // Even if delta is negative, if we are at 0, it should stay fixed-top
      const result = getSmartHeader(previous, 0, headerHeight, -10, threshold)

      expect(result.isAtTop).toBe(true)
      expect(result.position).toBe('fixed-top')
    })
  })
})
