"use client"

import Image from "next/image"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import GlobalFilter from "./GlobalFilter"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useSearchParams } from "next/navigation"
import { globalSearch } from "@/lib/actions/general.action"

const GlobalResult = () => {
  const searchParams = useSearchParams()

  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState([
    { type: "question", id: 1, title: "Next.js question" },
    { type: "tag", id: 1, title: "Nextjs" },
    { type: "user", id: 1, title: "jsm" },
  ])

  const global = searchParams.get("global")
  const type = searchParams.get("type")

  useEffect(() => {
    const fetchResult = async () => {
      setResult([])
      setIsLoading(true)

      try {
        // EVERYTHING EVERYWHERE ALL AT ONCE...
        const res = await globalSearch({ query: global, type })
        setResult(JSON.parse(res))
      } catch (error) {
        console.log(error)
        throw error
      } finally {
        setIsLoading(false)
      }
    }

    if (global) fetchResult()
  }, [global, type])

  // how to render specific link
  function renderLink(type: string, id: string) {
    switch (type) {
      case "question":
        return `/question/${id}`
      case "answer":
        return `/question/${id}`
      case "tag":
        return `/tags/${id}`
      case "user":
        return `/profile/${id}`
      default:
        return "/"
    }
  }

  return (
    <div className="mt-3 bg-light-800 dark:bg-dark-400 w-full absolute top-full z-10 rounded-xl py-5 shadow-sm">
      <GlobalFilter />

      {/* divider */}
      <div className="my-5 h-[1px] bg-light-700/50 dark:bg-dark-500/50" />

      <div className="space-y-5">
        <p className="base-bold text-dark400_light800 px-5">Top Match</p>
        {isLoading ? (
          <div className="flex-center flex-col px-5">
            <ReloadIcon className="my-2 h-10 w-10 text-primary-500 animate-spin" />
            <p className="text-dark200_light800 body-regular">
              Browsing the entire database
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {result.length > 0 ? (
              result.map((item: any, index) => (
                <Link
                  href={renderLink(item.type, item.id)}
                  key={item.id + item.type + index}
                  className="flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:bg-light-700/50 dark:bg-dark-500/50"
                >
                  <Image
                    src="/assets/icons/tag.svg"
                    alt="tag"
                    width={18}
                    height={18}
                    className="invert-colors mt-1 object-contain"
                  />
                  <div className="flex flex-col">
                    <p className="body-medium text-dark200_light800 line-clamp-1">
                      {item.title}
                    </p>
                    <p className="mt-1 small-medium font-bold text-light400_light500 capitalize">
                      {item.type}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex-center flex-col px-5">
                <p className="text-dark200_light800 body-regular px-5 py-2.5">
                  Oops, No results found...
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default GlobalResult
