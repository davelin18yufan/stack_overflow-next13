import AnswerCard from "../AnswerCard"
import JobCard from "../JobCard"
import QuestionCard from "../QuestionCard"
import UserCard from "../UserCard"
import { screen, render } from "@testing-library/react"
import { getTimestamp } from "@/lib/utils"

jest.mock("@clerk/nextjs")
jest.mock("next/navigation")
jest.mock("@/lib/actions/tag.action", () => ({
  getTopInteractiveTags: jest.fn(() =>
    Promise.resolve([{ _id: "123", name: "render" }])
  ),
}))

const answerCardMockProp = {
  clerkId: "123",
  _id: "123",
  question: {
    _id: "01",
    title: "test title",
  },
  author: {
    _id: "111",
    clerkId: "111",
    name: "author",
    picture: "https://www.google.com/search?q=%E7%91%9E%E5%A3%AB",
  },
  upVotes: 30,
  createdAt: new Date(),
}

const jobCardMockProp = {
  id: "123",
  title: "Mock Job title",
  application_url: "",
  company_name: "dev-overflow",
  plain_text_description: "mock description",
  html_description: "",
  source: "taiwan job",
  location: "TW",
  salary: {
    currency: "TWD",
    min_salary: 50000,
    max_salary: 100000,
    salary_type: "monthly",
  },
  publication_time: new Date(),
}

const questionCardMockProp = {
  _id: "123",
  clerkId: "123",
  title: "question title",
  tags: [
    {
      _id: "tag1",
      name: "render",
    },
  ],
  author: {
    _id: "111",
    clerkId: "111",
    name: "author",
    picture: "https://www.google.com/search?q=%E7%91%9E%E5%A3%AB",
  },
  upVotes: ["1", "2"],
  views: 100,
  answers: [{ id: 1 }, { id: 2 }, { id: 3 }],
  createdAt: new Date(),
}

const userCardMockProp = {
  _id: "123",
  clerkId: "123",
  name: "testUser",
  username: "testUsername",
  picture: "https://www.google.com/search?q=%E7%91%9E%E5%A3%AB",
}

describe("AnswerCard", () => {
  const { clerkId, _id, question, author, upVotes, createdAt } =
    answerCardMockProp
  it("Should render data correctly", () => {
    render(
      <AnswerCard
        clerkId={clerkId}
        _id={_id}
        question={question}
        author={author}
        upVotes={upVotes}
        createdAt={createdAt}
      />
    )

    expect(screen.getByText("test title")).toBeInTheDocument()
    expect(screen.getByText("30")).toBeInTheDocument()
    expect(screen.getByText(getTimestamp(createdAt))).toBeInTheDocument()
  })
})

describe("JobCard", () => {
  it("Should Render data correctly", () => {
    render(<JobCard job={jobCardMockProp} />)

    const source = screen.getAllByText(/taiwan job/i)
    const country = screen.getAllByText("TW")

    source.forEach((item) => expect(item).toBeInTheDocument())
    country.forEach((item) => expect(item).toBeInTheDocument())
    expect(screen.getByText(/^Mock Job title$/i)).toBeInTheDocument()
    expect(screen.getByText("dev-overflow")).toBeInTheDocument()
    expect(screen.getByText(/^mock description$/i)).toBeInTheDocument()
    expect(screen.getByText(/^TWD$/i)).toBeInTheDocument()
    expect(screen.getByText(/50000/i)).toBeInTheDocument()
    expect(screen.getByText(/100000/i)).toBeInTheDocument()
    expect(screen.getByText(/^monthly$/i)).toBeInTheDocument()
  })
})

describe("QuestionCard", () => {
  const {
    _id,
    clerkId,
    title,
    tags,
    author,
    upVotes,
    views,
    answers,
    createdAt,
  } = questionCardMockProp
  it("Should render data correctly", () => {
    render(
      <QuestionCard
        _id={_id}
        clerkId={clerkId}
        title={title}
        tags={tags}
        author={author}
        upVotes={upVotes}
        views={views}
        answers={answers}
        createdAt={createdAt}
      />
    )

    expect(screen.getByText(getTimestamp(createdAt))).toBeInTheDocument()
    expect(screen.getByText(/^question title$/i)).toBeInTheDocument()
    expect(screen.getByText("2")).toBeInTheDocument() // upVotes
    expect(screen.getByText("100")).toBeInTheDocument() // views
    expect(screen.getByText("3")).toBeInTheDocument() // answers
  })
})

describe("UserCard", () => {
  it("Should render data correctly", async () => {
    render(await UserCard({ user: userCardMockProp }))

    expect(screen.getByAltText("user profile picture")).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "testUser" })
    ).toBeInTheDocument()
    expect(screen.getByText(/@testUsername/i)).toBeInTheDocument()
    expect(screen.getByText(/render/i)).toBeInTheDocument()
  })
})
