import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const Loading = () => {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <h1 className="h1-bold text-dark100-light900">Ask a Question</h1>

      <div className="mt-5">
        <div className="flex w-full flex-col gap-10">
          <Skeleton className="w-full " />

          <div className="flex w-full flex-col gap-3">
            <Skeleton className="w-full h-24" />
            <Skeleton className="w-full h-[350px]" />
            <Skeleton className="w-full h-24" />
          </div>

          <Skeleton className="w-full h-24" />
        </div>

        <Button
          type="submit"
          className="mt-4 primary-gradient w-fit !text-light-900 ml-auto"
        >
          Submit
        </Button>
      </div>
    </section>
  )
}

export default Loading
