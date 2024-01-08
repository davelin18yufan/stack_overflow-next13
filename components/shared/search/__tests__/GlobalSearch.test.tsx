import { render, screen} from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { useRouter } from "next/navigation"
import GlobalFilter from "../GlobalFilter"
import GlobalResult from "../GlobalResult"
import GlobalSearch from "../GlobalSearch"

const mockSearchParams = new URLSearchParams()
const mockReplace = jest.fn()
jest.mock("next/navigation", () => ({
  usePathname: () => "/mocked-path",
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({
    replace: mockReplace
  })
}))

afterEach(() => {
  jest.clearAllMocks()
})

describe("GlobalFilter", () => {
  const user = userEvent.setup()
  it("Should render correct filters", async () => {
    render( <GlobalFilter/>)

    expect(screen.getByText('Question')).toBeInTheDocument()
    expect(screen.getByText("User")).toBeInTheDocument()
  })

  it("Should append correct style after clicked", async () => {
    render(<GlobalFilter/>)

    const btn = screen.getByRole("button", { name: "User" })

    // activate
    await user.click(btn)
    expect(btn).toHaveClass('bg-primary-500')

    // cancel
    await user.click(btn)
    expect(btn).not.toHaveClass('bg-primary-500')
    
  })

  it("Should add correct param to url after clicked", async () => {
    render(<GlobalFilter/>)

    const btn = screen.getByRole("button", { name: "Question" })
    
    await user.click(btn)

    expect(useRouter().replace).toHaveBeenCalledWith('/mocked-path?type=question')
  })
})