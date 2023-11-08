"use client"

import { Button } from "../ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { formUrlQuery } from "@/lib/utils"

interface Props {
  pageNumber: number
  hasNextPage: boolean
}

const Paginator = ({ pageNumber, hasNextPage }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleNavigation(direction: string) {
    const nextPageNumber =
      direction === "prev" ? pageNumber - 1 : pageNumber + 1

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNumber.toString(),
    })

    router.push(newUrl, { scroll: false })
  }

  // not enough for one page 
  if(!hasNextPage && pageNumber === 1) return null
  
  return (
    <div className="flex w-full justify-center items-center gap-2">
      <Button
        className="btn light-border-2 min-h-[36px] border flex items-center justify-center"
        onClick={() => handleNavigation("prev")}
        disabled={pageNumber === 1}
      >
        <p className="text-dark200_light800 body-medium">Previous</p>
      </Button>
      <div className="flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2">
        <p className="body-semibold text-light-900 text-center">{pageNumber}</p>
      </div>
      <Button
        disabled={!hasNextPage}
        className="btn light-border-2 min-h-[36px] border flex items-center justify-center"
        onClick={() => handleNavigation("next")}
      >
        <p className="text-dark200_light800 body-medium">Next</p>
      </Button>
    </div>
  )
}

export default Paginator
