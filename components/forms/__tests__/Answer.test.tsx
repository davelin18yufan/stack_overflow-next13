import { render, screen } from "@testing-library/react"
import Answer from "../Answer"
import { ThemeProvider } from "@/context/ThemeProvider"
import userEvent from "@testing-library/user-event"
import { createAnswer } from "@/lib/actions/answer.action"
import { usePathname } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

jest.mock("@/lib/actions/answer.action")
jest.mock("next/navigation")
jest.mock("@/components/ui/use-toast")

// mocking matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// mock fetch
global.fetch = jest
  .fn()
  .mockResolvedValue({ json: () => ({ reply: "Mocked AI answer" }) })

const mockProp = {
  question: "testing",
  questionId: "123",
  authorId: "123",
}

describe("Render", () => {
  // clear Mocks
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should render editor, submit button and generate AI button", () => {
    render(
      <ThemeProvider>
        <Answer
          question={mockProp.question}
          questionId={mockProp.questionId}
          authorId={mockProp.authorId}
        />
      </ThemeProvider>
    )

    const form = screen.getByTestId("form")
    const btn = screen.getByRole("button", { name: "Submit" })
    const AIBtn = screen.getByTestId("AIBtn")

    expect(form).toBeInTheDocument()
    expect(btn).toBeInTheDocument()
    expect(AIBtn).toBeInTheDocument()
  })
})

describe("Interaction", () => {
  const user = userEvent.setup()

  it("Should alert if input not valid", async () => {
    render(
      <ThemeProvider>
        <Answer
          question={mockProp.question}
          questionId={mockProp.questionId}
          authorId={mockProp.authorId}
        />
      </ThemeProvider>
    )

    const btn = screen.getByRole("button", { name: "Submit" })
    await user.click(btn)
    const msg = screen.getByTestId("errorMsg")

    expect(msg).toBeInTheDocument()
  })

  it("Should call openAi API and generate answer", async () => {
    render(
      <ThemeProvider>
        <Answer
          question={mockProp.question}
          questionId={mockProp.questionId}
          authorId={mockProp.authorId}
        />
      </ThemeProvider>
    )

    const aiBtn = screen.getByTestId("AIBtn")
    await user.click(aiBtn)

    expect(fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`,
      {
        method: "POST",
        body: JSON.stringify({ question: mockProp.question }),
      }
    )
  })

  it("Should generate answer after calling createAnswer function", async () => {
    render(
      <ThemeProvider>
        <Answer
          question={mockProp.question}
          questionId={mockProp.questionId}
          authorId={mockProp.authorId}
        />
      </ThemeProvider>
    )

      
  })
})
