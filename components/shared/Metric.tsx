"use client"

import Image from "next/image"
import React from "react"
import { useRouter } from "next/navigation"

interface MetricProps {
  imgUrl: string
  alt: string
  title: string
  value: string | number
  href?: string
  textStyles?: string
  isAuthor?: boolean
}

// All composed with an image and paragraph
const Metric = ({
  imgUrl,
  alt,
  value,
  title,
  href,
  textStyles,
  isAuthor,
}: MetricProps) => {
  const metricContent = (
    <>
      <Image
        src={imgUrl}
        alt={alt}
        width={16}
        height={16}
        className={`object-contain ${href ? "rounded-full" : ""}`}
      />

      <p className={`${textStyles} flex items-center gap-1`}>
        {value}
        <span
          className={`small-regular line-clamp-1 ${
            isAuthor ? "max-sm:hidden" : ""
          }`}
        >
          {title}
        </span>
      </p>
    </>
  )
  const router = useRouter()

  if(href) {
    return (
      <div onClick={() => router.push(href)} className="flex-center gap-1">
        {metricContent}
      </div>
    )
  }

  return (
    <div className="flex-center flex-wrap gap-1">
      {metricContent}
    </div>
  )
}

export default Metric
