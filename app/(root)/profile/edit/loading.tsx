import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const Loading = () => {
  return (
    <section>
      <h1 className="h1-bold text-dark100-light900">Edit Profile</h1>

      <div className="flex w-full flex-col gap-9 mt-9">
        <Skeleton className="space-y-3.5 w-full h-24 " />
        <Skeleton className="space-y-3.5 w-full h-24 " />
        <Skeleton className="space-y-3.5 w-full h-24 " />
        <Skeleton className="space-y-3.5 w-full h-24 " />
        <Skeleton className="space-y-3.5 w-full h-36 " />
      </div>

      <Button className="mt-7 primary-gradient w-fit !text-light-900 ml-auto">
        Save
      </Button>
    </section>
  )
}

export default Loading
