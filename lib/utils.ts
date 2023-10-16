import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTimestamp = (createdAt:Date) : string => {
  const now = new Date()
  const diffMilliseconds = now.getTime() - createdAt.getTime()

  const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60))
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffMonths = Math.floor(diffDays / 30) // Approximate months
  const diffYears = Math.floor(diffDays / 365) // Approximate years

  let result = ""

  if (diffYears > 0) {
    result += `${diffYears} year${diffYears > 1 ? "s" : ""} ago`
  } else if (diffMonths > 0) {
    result += `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`
  } else if (diffDays > 0) {
    result += `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
  } else if (diffHours > 0) {
    result += `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
  } else if (diffMinutes > 0) {
    result += `${diffMinutes} min${diffMinutes > 1 ? "s" : ""} ago`
  } else {
    result += "just now"
  }

  return result
}