import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import JobFilter from "../JobFilter"

const replaceMock = jest.fn()
const searchParamsMock = new URLSearchParams()
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock
  }),
  usePathname: () => '/mocked-path',
  useSearchParams: () => searchParamsMock
}))

const mockProp = [
  {
    name: {
      common: "Taiwan",
    },
  },
  {
    name: {
      common: "United States",
    },
  },
]
describe("JobFilter", () => {
  it("Should render correct data", async () => {
    render(<JobFilter countriesList={mockProp}/>)
    
    expect(screen.getByAltText('search icon')).toBeInTheDocument
    expect(screen.getByAltText("location")).toBeInTheDocument
  })

  it("Should call useRouter with correct params after selection", async () => {
    render(<JobFilter countriesList={mockProp} />)

    fireEvent.click(screen.getByText("Select Location"))

    waitFor(async () => {
      fireEvent.click(screen.getByText("Taiwan"))
      expect(replaceMock).toHaveBeenCalledWith('/mocked-path?location=Taiwan')
    })

  })
})