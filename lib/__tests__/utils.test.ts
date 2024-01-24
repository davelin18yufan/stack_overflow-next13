import { BADGE_CRITERIA } from "@/constants"
import {
  getTimestamp,
  formatNumber,
  assignBadges,
  formatISODate,
  getJoinedDate
} from "../utils"

describe("Utility function", () => {
  describe("getTimestamp", () => {
    it("returns correct timestamp string for recent date", () => {
      const now = new Date()
      const recentDate = new Date(now.getTime() - 1000 * 60 * 5) // 5 minutes ago
      const result = getTimestamp(recentDate)

      expect(result).toBe("5 mins ago")
    })

    it("returns correct timestamp string for past date", () => {
      const now = new Date()
      const pastDate = new Date(now.getTime() - 1000 * 60 * 60 * 24) // 1 day ago
      const result = getTimestamp(pastDate)

      expect(result).toBe("1 day ago")
    })
  })

  describe("formatNumber", () => {
    it("Should return correct formation of number", () => {
      expect(formatNumber(1234)).toBe('1.2K')
      expect(formatNumber(20495800)).toBe('20.5M')
    })
  })

  describe("getJoinedDate", () => {
    it("Should return correct formation 'Month Year'", () => {
      const result = getJoinedDate(new Date("2024-01-01T00:00:00Z"))
      expect(result).toBe('January 2024')
    })
  })
  
  describe('assignBadges', () => {
    it("should correctly assign badges based on QUESTION_COUNT criteria", () => {
      const criteria = [
        { type: "QUESTION_COUNT" as keyof typeof BADGE_CRITERIA, count: 60 },
      ] 
      const result = assignBadges({ criteria })
      expect(result).toEqual({ GOLD: 0, SILVER: 1, BRONZE: 1 })
    })

    it('should correctly assign badges based on ANSWER_COUNT criteria', () => {
      const criteria = [
        { type: "ANSWER_COUNT" as keyof typeof BADGE_CRITERIA, count: 110 },
      ]

      const result = assignBadges({ criteria })
      expect(result).toEqual({GOLD: 1, SILVER: 1, BRONZE:1})
    })
  })

  describe("formatISODate", () => {
    it("Should return correct formation of date", () => {
      const date = new Date("2024-01-01T00:00:00Z")
      const result = formatISODate(date)
      expect(result).toBe('2024年01月01日')
    })
  })
})
