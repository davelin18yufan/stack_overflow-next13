import { render, screen } from "@testing-library/react"
import RenderTag from "../RenderTag"

describe("RenderTag", () => {
  it("Should render correct badge", () => {
    render(<RenderTag _id="123" name="test" totalQuestions={2} showCount={true} />)

    expect(screen.getByText('test')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })
})