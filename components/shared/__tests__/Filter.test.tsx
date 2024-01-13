import { render, screen, fireEvent, waitFor} from "@testing-library/react"
import Filter from "../Filter"
import { userEvent } from "@testing-library/user-event"
import { useRouter } from "next/navigation"

const mockSearchParams = new URLSearchParams()
jest.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({
    replace: jest.fn(),
  }),
  usePathname: () => "/mocked-path",
}))

const mockProp = {
  filters: [{name: "Most Recent", value: 'most_recent'}]
}
describe("Filter", () => {
  const user = userEvent.setup()
  it("Should render select box", async () => {
    render(<Filter filters={mockProp.filters} />)

    expect(screen.getByText("Select a Filter")).toBeInTheDocument()
  })

  it("Should update URL after selection", async () => {
    render(<Filter filters={mockProp.filters} />)
    
    fireEvent.click(screen.getByText('Select a Filter'))

    waitFor(() => {
      fireEvent.click(screen.getByText("Most Recent"))
  
      expect(useRouter().replace).toHaveBeenCalledWith("/mocked-path?filter=most_recent")
    })
  })
})