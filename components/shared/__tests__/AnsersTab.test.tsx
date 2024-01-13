import { render, screen } from "@testing-library/react"
import AnswersTab from "../AnswersTab"
import { getUserAnswers } from "@/lib/actions/user.action"
// import { getUserAnswers } from "@/lib/actions/user.action"

jest.mock("@/lib/actions/user.action")
jest.mock("@clerk/nextjs")
jest.mock("next/navigation")

;;(getUserAnswers as jest.Mock).mockResolvedValue({
  answers: [
    {
      _id: "12",
      question: { _id: "22", title: "question title" },
      author: {
        _id: "213",
        clerkId: "321",
        name: "author",
        picture: "https://www.google.com/search?q=%E7%91%9E%E5%A3%AB",
      },
      upVotes: ["1", "2", "3"],
      createdAt: new Date()
    },
  ],
  hasNextPage : false
})

describe("AnswersTab", () => {
  it("Should render correct data", async () => {
    const ui = await AnswersTab({
      searchParams: { page: "1" },
      userId: "123",
      clerkId: "123",
    })

    render(ui)

    expect(screen.getByText("question title")).toBeInTheDocument()
    expect(screen.getByAltText("user avatar")).toBeInTheDocument()
  })
})
