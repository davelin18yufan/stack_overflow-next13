import UserCard from "@/components/shared/Card/UserCard"
import Filter from "@/components/shared/Filter"
import NoResult from "@/components/shared/NoResult"
import LocalSearchbar from "@/components/shared/search/LocalSearchbar"
import { UserFilters } from "@/constants/filters"
import { getAllUsers } from "@/lib/actions/user.action"
import React from "react"

const userTag = [
  { _id: "123", name: "HTML" },
  { _id: "123", name: "HTML" },
  { _id: "123", name: "HTML" },
]

const page = async () => {
  const users = await getAllUsers({})

  return (
    <div className="mx-auto w-full max-w-5xl">
      <h1 className="h1-bold text-dark100-light900">All Users</h1>

      <div className="my-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search by Username..."
          route="/community"
          otherClasses="flex-1"
        />

        <Filter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px] "
        />
      </div>

      <div className="flex flex-wrap gap-4">
        {users.length > 0 ? (
          users.map((user) => {
            return (
              <UserCard
                name={user.name}
                username={user.username}
                imgUrl={user.picture}
                tags={userTag}
                key={user._id}
              />
            )
          })
        ) : (
          <NoResult
            title="No User Found"
            description=""
            link="/"
            linkTitle="Back to home page"
          />
        )}
      </div>
    </div>
  )
}

export default page
