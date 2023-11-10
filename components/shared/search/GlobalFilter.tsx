"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { GlobalSearchFilters } from "@/constants/filters"
import { useRouter, useSearchParams } from "next/navigation"
import { formUrlQuery } from "@/lib/utils"

const GlobalFilter = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const typeParams = searchParams.get("type")
  const [active, setActive] = useState(typeParams || "")

  function handleTypeClick(type: string) {
    if (active === type) {
      // if tag being clicked === active tag => clear filter
      setActive("")

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: null,
      })

      router.push(newUrl, { scroll: false })
    } else {
      setActive(type)

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: type.toLowerCase(),
      })

      router.push(newUrl, { scroll: false })
    }
  }

  return (
    <div className="px-5 flex items-center gap-5">
      <p className="body-medium text-dark400_light900">Type: </p>
      <div className="flex gap-3">
        {GlobalSearchFilters.map((filter) => (
          <Button
            className={`light-border-2 rounded-2xl small-medium px-5 py-2 capitalize dark:hover:text-primary-500 dark:text-light-800 ${
              active === filter.value
                ? "bg-primary-500 text-light-900"
                : "bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500"
            }`}
            onClick={() => handleTypeClick(filter.value)}
            key={filter.value}
          >
            {filter.name}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default GlobalFilter
