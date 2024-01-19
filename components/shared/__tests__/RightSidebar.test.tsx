import { render, screen } from "@testing-library/react"
import RightSidebar from "../RightSidebar"
import { getHotQuestions } from "@/lib/actions/question.action"
import { getTopPopularTags } from "@/lib/actions/tag.action"

jest.mock("@/lib/actions/question.action", () => ({
  getHotQuestions: jest.fn(),
}))
jest.mock("@/lib/actions/tag.action", () => ({
  getTopPopularTags: jest.fn(),
}))

beforeEach(() => {
  ;(getHotQuestions as jest.Mock).mockResolvedValue([
    { _id: "123", title: "test title" },
    { _id: "122", title: "test title2" },
  ])
  ;(getTopPopularTags as jest.Mock).mockResolvedValue([
    { _id: "12", name: "tag", numberOfQuestions: 2 },
  ])
})

describe("RightSidebar", () => {
  it("Should render two sections with correct data", async () => {
    const ui = await RightSidebar()
    render(ui)

    expect(screen.getAllByAltText('chevron right')).toHaveLength(2)
    expect(screen.getByText('test title')).toBeInTheDocument()
    expect(screen.getByText("tag")).toBeInTheDocument()
  })
})
