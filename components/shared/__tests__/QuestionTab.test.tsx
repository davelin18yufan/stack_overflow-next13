import { render, screen } from "@testing-library/react"
import QuestionTab from "../QuestionTab"
import { getUserQuestions } from "@/lib/actions/user.action"

jest.mock("@/lib/actions/user.action", () => ({
  getUserQuestions: jest.fn(),
}))
jest.mock("@/components/shared/Metric")
jest.mock("@clerk/nextjs")
jest.mock("next/navigation")

const mockProp = {
  searchParams: { page: "1" },
  userId: "123",
  clerkId: "123",
}

beforeEach(() => {
  ;(getUserQuestions as jest.Mock).mockResolvedValue({
    questions: [
      {
        _id: "123",
        clerkId: "123",
        title: "title",
        tags: [
          {
            _id: "22",
            name: "tag",
          },
        ],
        author: {
          _id: "123",
          clerkId: "123",
          name: "author",
          picture: "https://www.google.com/search?q=%E7%91%9E%E5%A3%AB",
        },
        upVotes: ["1", "2"],
        views: 30,
        answers: [],
        createdAt: new Date(),
      },
    ],
    hasNextPage: false,
  })
})

describe("QuestionTab", () => {
  it("Should render correct questions and paginator", async () => {
    const { searchParams, userId, clerkId } = mockProp
    const ui = await QuestionTab({ searchParams, userId, clerkId })

    render(ui)
    
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText("tag")).toBeInTheDocument()
  })
})
