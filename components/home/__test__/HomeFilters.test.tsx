import { render, screen, waitFor } from "@testing-library/react"
import HomeFilters from "../HomeFilters"
import { userEvent } from "@testing-library/user-event"
import { useRouter } from "next/navigation"

// initialize variables to track and spyOn
const replaceMock = jest.fn()
const searchParams = new URLSearchParams()
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ replace: replaceMock })), // if using jest.fn() here< it would be anonymous which can't be tracked
  usePathname: () => "/mocked-path",
  useSearchParams: () => searchParams,
}))

describe("HomeFilters", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const user = userEvent.setup()
  it("Should render data correctly", () => {
    render(<HomeFilters />)

    const btns = screen.getAllByRole('button')
    expect(btns).toHaveLength(4)
  })

  it("Should active style if click the filter", async () => {
    render(<HomeFilters />)
    const filterButton = screen.getByRole("button", { name: /newest/i })
    const unFilterButton = screen.getByRole("button", { name: /Frequent/i })

    await user.click(filterButton)

    // active style
    expect(filterButton).toHaveClass("text-primary-500")
    expect(unFilterButton).not.toHaveClass("text-primary-500")
  })

  it("Should push correct filter params to URL", async () => {
    const { getByText } = render(<HomeFilters />) 
    
    const btn = getByText(/newest/i)

    // add filter
    await user.click(btn)
    
    await waitFor(() => {
      expect(useRouter().replace).toHaveBeenCalledWith(
        "/mocked-path?filter=newest"
      )
    })

    // remove filter
    searchParams.set('filter', 'newest')
    await user.click(btn)
    await waitFor(() => {
      expect(useRouter().replace).toHaveBeenCalledWith(
        "/mocked-path?"
      )
    })

  })

})