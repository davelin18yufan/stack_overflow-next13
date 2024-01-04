import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
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
  const user = userEvent.setup()
  it("Should render correct data", async () => {
    render(<JobFilter countriesList={mockProp}/>)
    
    expect(screen.getByAltText('search icon')).toBeInTheDocument
    expect(screen.getByAltText("location")).toBeInTheDocument
  })

  it("Should call useRouter with correct params after selection", async () => {
    render(<JobFilter countriesList={mockProp} />)

    const select = screen.getByTestId('select')

    // await user.selectOptions(screen.getByText('Select Location'), 'Taiwan')

    // await waitFor(() => {
    //   expect(replaceMock).toHaveBeenCalledWith('/mocked-path?location=Taiwan')
    // })
  })
})