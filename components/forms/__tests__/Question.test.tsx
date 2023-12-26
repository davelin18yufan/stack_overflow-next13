import { render, screen, waitFor } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import Question from "../Question"
import { ThemeProvider } from "@/context/ThemeProvider"
import { createQuestion } from "@/lib/actions/question.action"

const mockUsePathname = jest.fn()
jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
  useRouter() {
    return {
      push: () => jest.fn(),
      back: () => jest.fn(),
    }
  },
}))
jest.mock("@/lib/actions/question.action")


const mockQuestion = JSON.stringify({
  title: "render test",
  content: "This should be on the screen if edit a existed post",
  tags: [{name: 'render'}]
})

describe("Render", () => {
  it("Should render form correctly if creating a post", () => {
      render(
        <ThemeProvider>
        <Question type="Create" mongoUserId="test" />
      </ThemeProvider>
    )

    expect(screen.getByTestId('name')).toBeInTheDocument()
    expect(screen.getByTestId("description")).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Add tags.../i)).toBeInTheDocument()
    expect(screen.getByRole('button', {name: /Ask a Question/i}))
  })

  it("Should render form correctly if edit a post", () => {
    render(
      <ThemeProvider>
        <Question
          type="Edit"
          mongoUserId="test"
          questionDetails={mockQuestion}
        />
      </ThemeProvider>
    )

    expect(screen.getByDisplayValue(/render test/i)).toBeInTheDocument()
    expect(screen.getByText("render")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Edit Question/i }))
  })
})

describe("Interaction", () => {
  const user = userEvent.setup()
  mockUsePathname.mockImplementation(() => "/mocked-path")

  it("Should add tag after press enter and remove tag after click", async () => {
    render(
      <ThemeProvider>
        <Question type="Create" mongoUserId="test" />
      </ThemeProvider>
    )

    const tagInput = screen.getByPlaceholderText(/Add tags.../i)
    
    // add tag
    await user.click(tagInput)
    await user.type(tagInput,"render")
    await user.keyboard('[Enter]')

    expect(screen.getByText("render")).toBeInTheDocument()

    // remove tag
    await user.click(screen.getByText("render"))
    await waitFor(() => {
      expect(screen.queryByText("render")).not.toBeInTheDocument()
    })
  })

  it("Should create a new question after submit", async () => {
    const mockContent = JSON.stringify({title: "",content: "mock content for tiny MCU and fill the content for at least 100 words.., expect this will render on screen at first render, if there is approach to mock behavior of this third-party package, replace this with that.", tags: []})
    render(
      <ThemeProvider>
        <Question type="Create" mongoUserId="123" questionDetails={mockContent}/>
      </ThemeProvider>
    )

    const nameInput = screen.getByTestId("name")
    const tagInput = screen.getByPlaceholderText(/Add tags.../i)
    const btn = screen.getByRole("button", { name: /ASk a Question/i })

    await user.click(nameInput)
    await user.keyboard('test title')
    await user.click(tagInput)
    await user.type(tagInput, 'render')
    await user.keyboard('[Enter]')
    await user.click(btn)

    await waitFor(() => {

      expect(createQuestion).toHaveBeenCalledWith({
        title: "test title",
        content:
          "mock content for tiny MCU and fill the content for at least 100 words.., expect this will render on screen at first render, if there is approach to mock behavior of this third-party package, replace this with that.",
        tags: ["render"],
        author: JSON.parse('123'),
        path: "/mocked-path",
      })
    })
  })
})
