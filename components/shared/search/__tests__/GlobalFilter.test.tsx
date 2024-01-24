import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { useRouter, useSearchParams } from "next/navigation"
import GlobalFilter from "../GlobalFilter"

const mockSearchParams = new URLSearchParams()

const mockReplace = jest.fn()
jest.mock("next/navigation", () => ({
  usePathname: () => "/mocked-path",
  useSearchParams: jest.fn(),
  useRouter: () => ({
    replace: mockReplace,
  }),
}))

afterEach(() => {
  jest.clearAllMocks()
})

describe("GlobalFilter", () => {
  const user = userEvent.setup();

  (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
  
  it("Should render correct filters", async () => {
    render(<GlobalFilter />)

    expect(screen.getByText("Question")).toBeInTheDocument()
    expect(screen.getByText("User")).toBeInTheDocument()
  })

  it("Should append correct style after clicked", async () => {
    render(<GlobalFilter />)

    const btn = screen.getByRole("button", { name: "User" })

    // activate
    await user.click(btn)
    expect(btn).toHaveClass("bg-primary-500")

    // cancel
    await user.click(btn)
    expect(btn).not.toHaveClass("bg-primary-500")
  })

  it("Should add correct param to url after clicked", async () => {
    render(<GlobalFilter />)

    const btn = screen.getByRole("button", { name: "Question" })

    await user.click(btn)

    expect(useRouter().replace).toHaveBeenCalledWith(
      "/mocked-path?type=question"
    )
  })
})

