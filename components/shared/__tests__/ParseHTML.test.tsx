import { render, screen} from "@testing-library/react"
import ParseHTML from "../ParseHTML"

describe("ParseHTML", () => {
  it("Should render correct data", () => {
    render(<ParseHTML data="<h1>Testing</h1>"/>)

    expect(screen.getByText('Testing').tagName).toBe('H1')
  })
})