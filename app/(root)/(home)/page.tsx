import { Button } from "@/components/ui/button"
import Link from "next/link"
import LocalSearchbar from "@/components/shared/search/LocalSearchbar"
import Filter from "@/components/shared/Filter"
import { HomePageFilters } from "@/constants/filters"
import HomeFilters from "@/components/home/HomeFilters"
import QuestionCard from "@/components/shared/Card/QuestionCard"
import NoResult from "@/components/shared/NoResult"

const Questions = [
  {
    _id: "1",
    title:
      "The Lightning Component c:LWC_PizzaTracker generated invalid output for field status. Error How to solve this",
    tags: [
      { _id: "1", name: "python" },
      { _id: "2", name: "sql" },
    ],
    author: {
      _id: "author1",
      name: "John Doe",
      picture: "url/to/picture1.jpg",
    },
    upVotes: 1510649,
    views: 1600,
    answers: [],
    createdAt: new Date("2023-09-01T12:00:00.000Z"),
  },
  {
    _id: "2",
    title:
      "JavaScript validation for a form stops the form data from being submitted to mysql database",
    tags: [
      { _id: "4", name: "react" },
      { _id: "62", name: "javascript" },
      { _id: "92", name: "invalid fileds" },
    ],
    author: {
      _id: "author2",
      name: "Satheesh",
      picture: "url/to/picture2.jpg",
    },
    upVotes: 6,
    views: 10,
    answers: [],
    createdAt: new Date("2023-09-1T12:00:00.000Z"),
  },
  {
    _id: "3",
    title:
      "The Lightning Component c:LWC_PizzaTracker generated invalid output for field status. Error How to solve this",
    tags: [{ _id: "6", name: "C++" }],
    author: { _id: "author3", name: "Dave", picture: "url/to/picture3.jpg" },
    upVotes: 103,
    views: 1006,
    answers: [],
    createdAt: new Date("2021-09-01T12:00:00.000Z"),
  },
]

export default function Home() {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[40px] px-4 py-3 !text-light-900">
            Ask question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search Questions..."
          otherClasses="flex-1" // make sure searchbar width expanded and take place over filter
        />

        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilters />

      <div className="custom-scrollbar mt-10 flex w-full flex-col gap-6 overflow-y-auto">
        {/* looping through questions */}
        {Questions.length > 0 ? (
          Questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upVotes={question.upVotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There's no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
        discussion. our query could be the next big thing others learn from. Get
        involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  )
}
