import { render, screen, waitFor, act } from "@testing-library/react"
import AllAnswers from "../AllAnswers"
import { getAnswers } from "@/lib/actions/answer.action"
import ReactDOMServer from "react-dom/server"

const mockProp = {
  questionId: "123",
  userId: "123",
  totalAnswers: "3",
  page: "1",
  filter: "",
}

const mockSearchParams = new URLSearchParams()
jest.mock("@/lib/actions/answer.action", () => ({
  getAnswers: jest.fn(),
}))
jest.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({
    replace: jest.fn(),
  }),
  usePathname: () => "/mocked-path",
}))
jest.mock("../Votes")

beforeEach(() => {
  ;(getAnswers as jest.Mock).mockResolvedValueOnce({
    answers: [
      {
        _id: "12",
        author: {
          clerkId: "333",
          picture: "https://www.google.com/search?q=%E7%91%9E%E5%A3%AB",
          name: "author",
        },
        createdAt: new Date(),
        upVotes: ["123", "2"],
        downVotes: [],
        content: "This is the test answer",
      },
    ],
    hasNextPage: false,
  })
})
describe("Render", () => {
  it("Should render correct data", async () => {
    const { questionId, userId, totalAnswers, page, filter } = mockProp

    try {
      const ui = await AllAnswers({
        questionId,
        userId,
        totalAnswers,
        page,
        filter,
      })
      render(ui)
    } catch (err) {
      console.log(err)
    }

    expect(screen.getByText(/3 Answers/i)).toBeInTheDocument()
    expect(screen.getByText("author")).toBeInTheDocument()
    expect(screen.getByText("This is the test answer")).toBeInTheDocument()
    expect(screen.getByAltText("profile")).toBeInTheDocument()
  })
})
