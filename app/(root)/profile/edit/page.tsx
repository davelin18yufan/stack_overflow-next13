import Profile from "@/components/forms/Profile"
import { getUserById } from "@/lib/actions/user.action"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import React from "react"

const Page = async () => {
  const { userId } = auth()

  if (!userId) redirect("/sign-in")

  const mongoUser = await getUserById({ userId })

  return (
    <>
      <h1 className="h1-bold text-dark100-light900">Edit Profile</h1>

      <div className="mt-9">
        <Profile clerkId={userId} user={JSON.stringify(mongoUser)} />
      </div>
    </>
  )
}

export default Page
