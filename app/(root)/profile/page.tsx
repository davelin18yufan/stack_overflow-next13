

import Metric from "@/components/shared/Metric"
import { Button } from "@/components/ui/button"
import { getUserById } from "@/lib/actions/user.action"
import { auth } from "@clerk/nextjs"
import Image from "next/image"
import React from "react"

const Page = async () => {
  const { userId } = auth()

  if (!userId) return
  const user = await getUserById({ userId })

  return (
    <main className="mx-auto w-full min-h-full">
      <div className="flex flex-col items-start gap-4 lg:flex-row">
        <div className='flex w-full justify-between items-center'>
          <Image
            src={user.picture}
            alt="profile"
            width={140}
            height={140}
            className="rounded-full"
          />
          <Button
            className="btn-secondary text-dark300_light900 min-h-[46px] min-x-[175px] px-4 py-3"
          >
            Edit Profile
          </Button>
        </div>

        <div className="">
          <div>
            <h1 className="h1-bold text-dark100_light900">{user.name}</h1>
            <p className="text-light800_dark200">@{user.username}</p>
          </div>

          <div className="flex flex-wrap gap-5 mt-5">
            <Metric
              imgUrl="/assets/icons/link.svg"
              alt="link"
              title=""
              value="jsmastery_pro"
              textStyles="paragraph-medium"
              href="/"
              isAuthor={true}
            />
            <Metric
              imgUrl="/assets/icons/location.svg"
              alt="location"
              title=""
              value="Mumbai, India"
              textStyles="paragraph-medium"
            />
            <Metric
              imgUrl="/assets/icons/calendar.svg"
              alt="link"
              title=""
              value={`Joined ${"May 2023"}`}
              textStyles="paragraph-medium"
            />
          </div>

          <div className="mt-6">
            <p className="paragraph-regular text-dark400_light800"></p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Page
