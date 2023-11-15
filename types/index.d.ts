import { BADGE_CRITERIA } from "@/constants"

export interface SidebarLink {
  imgURL: string
  route: string
  label: string
}

export interface Job {
  id: string
  application_url: string
  company_name: string
  plain_text_description: string
  html_description: string
  publication_time: Date
  source: string
  title: string
  location: string
  salary: {
    currency: string
    min_salary: number
    max_salary: number
    salary_type: string
  }
}

export interface Country {
  name: {
    common: string
  }
}

export interface ParamsProps {
  params: { id: string }
}

export interface SearchParamsProps {
  searchParams: { [key: string]: string | undefined }
}

export interface URLProps {
  params: { id: string }
  searchParams: { [key: string]: string | undefined }
}

export interface BadgeCounts {
  GOLD: number
  SILVER: number
  BRONZE: number
}

export type BadgeCriteriaType = keyof typeof BADGE_CRITERIA
