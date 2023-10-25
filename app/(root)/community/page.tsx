import UserCard from "@/components/shared/Card/UserCard"
import Filter from "@/components/shared/Filter"
import LocalSearchbar from "@/components/shared/search/LocalSearchbar"
import { UserFilters } from "@/constants/filters"
import { getAllUsers } from "@/lib/actions/user.action"
import Link from "next/link"
import React from "react"

const page = async () => {
  const { users } = await getAllUsers({})

  return (
    <>
      <h1 className="h1-bold text-dark100-light900">All Users</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for amazing minds..."
          route="/community"
          otherClasses="flex-1"
        />

        <Filter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px] "
        />
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {users.length > 0 ? (
          users.map((user) => {
            return (
              <UserCard
                user={user}
                key={user._id}
              />
            )
          })
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p>No user yet</p>
            <Link href="/sign-up" className="mt-1 font-bold text-accent-blue">
              Join to be the first!
            </Link>
          </div>
        )}
      </section>
    </>
  )
}

export default page
