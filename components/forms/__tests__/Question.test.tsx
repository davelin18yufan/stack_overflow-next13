import { render, screen } from "@testing-library/react"
import Question from "../Question"
import { ThemeProvider } from "@/context/ThemeProvider"

jest.mock("next/navigation")

type propType = {
  type: "Edit" | "Create"
}

describe("Render", () => {
  it("Should render form correctly if creating a post", () => {
    render(
      <ThemeProvider>
        <Question type="Create" mongoUserId="test" />
      </ThemeProvider>
    )

    expect(screen.getByLabelText(/Question Title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Detail explanation of your question?/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Tags/i)).toBeInTheDocument()
  })
})
