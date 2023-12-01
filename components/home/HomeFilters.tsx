"use client"
import { HomePageFilters } from "@/constants/filters"
import React, { useState } from "react"
import { Button } from "../ui/button"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const HomeFilters = () => {
  const searchParams = useSearchParams()
  const pathname= usePathname()
  const router = useRouter()
  const [active, setActive] = useState("")

  function handleClick(value: string) {
    const currentParams = new URLSearchParams(searchParams)
    if (active === value) {
      // no filter
      setActive("")

      currentParams.delete("filter")
    } else {
      setActive(value)

      currentParams.set("filter", value.toLowerCase())
    }
    router.replace(`${pathname}?${currentParams.toString()}`)
  }

  return (
    <div className="mt-10 flex-wrap gap-3 max-lg:hidden md:flex ">
      {HomePageFilters.map((item) => (
        <Button
          key={item.value}
          onClick={() => {}}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
            active === item.value
              ? 'dark:hover:bg-dark400 bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500' 
          : 'bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300'
          }`}
          onClickCapture={() => handleClick(item.value)} // fire before target element being reached, used to put in parent element
        >
          {item.name}
        </Button>
      ))}
    </div>
  )
}

export default HomeFilters
