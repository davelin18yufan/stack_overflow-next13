"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import GlobalResult from "./GlobalResult"

const GlobalSearch = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const query = searchParams.get("q")?.toString() // local search value

  const [search, setSearch] = useState(query || "")
  const [isOpen, setIsOpen] = useState(false)
  const searchContainerRef = useRef(null)

  useEffect(() => {
    // click outside global search -> close and rest
    const handleOutsideClick = (e: any) => {
      if (
        // @ts-ignore
        searchContainerRef.current && !searchContainerRef.current.contains(e.target)
      ) {
        setIsOpen(false)
        setSearch("")
      }
    }

    setIsOpen(false) // if path changes -> close

    document.addEventListener("click", handleOutsideClick)

    return () => document.removeEventListener("click", handleOutsideClick)
  }, [pathname])

  useEffect(() => {
    const delayDebouncedFn = setTimeout(() => {
      const currentParams = new URLSearchParams(searchParams)
      if (search) {
        currentParams.set("global", search)
      } else {
        // clear query of searchParams
        currentParams.delete("global")
        currentParams.delete("type")
      }
      router.replace(`${pathname}?${currentParams.toString()}`)
    }, 300)

    return () => clearTimeout(delayDebouncedFn)
  }, [search, router, pathname, query, searchParams])

  return (
    <div
      className="relative w-full max-w-[600px] max-lg:hidden"
      ref={searchContainerRef}
    >
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />

        <Input
          type="text"
          placeholder="Search globally"
          //defaultValue={query}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            if (!isOpen) setIsOpen(true)
            if (e.target.value === "" && isOpen) setIsOpen(false)
          }}
          className="paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none bg-transparent"
        />
      </div>

      {isOpen && <GlobalResult />}
    </div>
  )
}

export default GlobalSearch
