"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

interface CustomInputProps {
  route: string
  iconPosition: string
  imgSrc: string
  placeholder: string
  otherClasses?: string
}

// though similar to GlobalSearchbar but possess different interactivity
const LocalSearchbar = ({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}: CustomInputProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const query = searchParams.get("q")
  const [search, setSearch] = useState(query || "")

  useEffect(() => {
    // Do not send request on every change event happened
    // fire request after specific delay => debounce
    const delayDebounceFn = setTimeout(() => {
      const currentParams = new URLSearchParams(searchParams)
      if (search) {
        currentParams.set("q", search)
      } else {
        // if input is cleared
        if (pathname === route) {
          // delete query
          currentParams.delete("q")
        }
      }

      router.replace(`${pathname}?${currentParams.toString()}`)
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [search, route, pathname, searchParams, query])

  return (
    <div
      className={`background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}

      <Input
        type="text"
        placeholder={placeholder}
        defaultValue={searchParams.get("q")?.toString()}
        onChange={(e) => setSearch(e.target.value)}
        className="paragraph-regular no-focus placeholder text-dark400_light700 bg-transparent border-none shadow-none outline-none"
      />

      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
    </div>
  )
}

export default LocalSearchbar
