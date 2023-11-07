"use client"

import React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {  useRouter, useSearchParams } from "next/navigation"
import { formUrlQuery } from "@/lib/utils"

interface FilterProps {
  filters: {
    name: string
    value: string
  }[]
  otherClasses?: string
  containerClasses?: string
}

const Filter = ({ filters, otherClasses, containerClasses }: FilterProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const paramFilter = searchParams.get("filter")

  // if the value changed, update query-string
  function handleUpdateParams(value: string){
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value
    })

    router.push(newUrl, { scroll: false })
  }
  return (
    <div className={`relative ${containerClasses}`}>
      <Select
        onValueChange={handleUpdateParams}
        defaultValue={paramFilter || undefined}
      >
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a Filter" />
          </div>
        </SelectTrigger>
        <SelectContent className="text-dark500_light700 ">
          <SelectGroup>
            {filters.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default Filter
