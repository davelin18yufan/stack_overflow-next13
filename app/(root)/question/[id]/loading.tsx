import { Skeleton } from "@/components/ui/skeleton"

const Loading = () => {
  return (
    <section>
      <div className="flex-start w-full flex-col">

        <div className="w-full flex-col">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-[250px]" />
              <Skeleton className="h-6 w-[200px]" />
            </div>
          </div>
          <Skeleton className="mt-3.5 w-full h-10" />
        </div>

        <Skeleton className="w-full h-[500px] mt-3.5" />

        <div className="w-full my-10 flex-wrap gap-6 md:flex">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>

        <div className="w-full mt-5 mb-12 flex flex-wrap items-center justify-between gap-5">
          <Skeleton className="h-14 flex-1" />
          <Skeleton className="h-14 w-28" />
        </div>

        <Skeleton className="w-full h-[350px]" />
      </div>
    </section>
  )
}

export default Loading
