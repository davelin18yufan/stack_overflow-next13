import { Job } from "@/types"
import { JobFilterParams } from "@/types/shared"

export const fetchCountries = async () => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all")
    const result = await response.json()
    return result
  } catch (error) {
    console.log(error)
  }
}

export const fetchLocation = async () => {
  const response = await fetch("http://ip-api.com/json/?fields=country")
  const location = await response.json()
  return location.country
}

export const fetchJobs = async (filters: JobFilterParams) => {
  const { query, page, location } = filters

  const headers = {
    "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY ?? "",
    "X-RapidAPI-Host": "job-search-api1.p.rapidapi.com",
  }

  const response = await fetch(
    `https://job-search-api1.p.rapidapi.com/v1/job-description-search?q=${query || 'software%20engineer'}&country=${location}&page=${page}`,
    {
      headers,
    }
  )

  const result = await response.json()

  return result.jobs
}
