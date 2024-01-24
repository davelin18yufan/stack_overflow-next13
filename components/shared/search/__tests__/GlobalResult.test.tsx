import { render, screen, waitFor } from "@testing-library/react"
import { useSearchParams } from "next/navigation"
import GlobalResult from "../GlobalResult"
import { globalSearch } from "@/lib/actions/general.action"

jest.mock("@/lib/actions/general.action", () => ({
  globalSearch: jest.fn(),
}))
const mockSearchParamsResult = new URLSearchParams("global=test&type=question")
const mockSearchParams = new URLSearchParams()

const mockReplace = jest.fn()
jest.mock("next/navigation", () => ({
  usePathname: () => "/mocked-path",
  useSearchParams: jest.fn(),
  useRouter: () => ({
    replace: mockReplace,
  }),
}))

describe("GlobalResult", () => {
  it("Should render default result", () => {
    ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
    render(<GlobalResult />)

    expect(screen.getByText("Nextjs")).toBeInTheDocument()
    expect(screen.getByText("jsm")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Tag" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "User" })).toBeInTheDocument()
  })

  it("Should render data when results are available", async () => {
    ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParamsResult)
    ;(globalSearch as jest.Mock).mockResolvedValueOnce(
      '[{"type":"question", "id": 1, "title": "Test Question"}]'
    )
    render(<GlobalResult />)

    // loading state
    expect(
      screen.getByText(/Browsing the entire database/i)
    ).toBeInTheDocument()

    // promise resolved
    await waitFor(() => {
      expect(screen.getByText("Test Question")).toBeInTheDocument()
    })
  })

  it("Should render no result message if no data available", async () => {
    ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParamsResult)
    ;(globalSearch as jest.Mock).mockResolvedValueOnce("[]")
    render(<GlobalResult />)

    // loading state
    expect(
      screen.getByText(/Browsing the entire database/i)
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText(/Oops, No results found.../i)).toBeInTheDocument()
    })
  })
})
