import { render, screen} from "@testing-library/react"
import Paginator from "../Paginator"
import { userEvent } from "@testing-library/user-event"
import { useRouter } from "next/navigation"

const mockSearchparams = new URLSearchParams()
const replaceMock = jest.fn()
jest.mock("next/navigation", () => ({
  useRouter: () => ({replace: replaceMock}),
  usePathname: () => '/mocked-path',
  useSearchParams: () => mockSearchparams
}))

describe("Paginator", () => {
  const user = userEvent.setup()
  it("Should display nothing if no pageNumber specify", () => {
    const { container} = render(<Paginator pageNumber={1} hasNextPage={false}/>)
   
    expect(container).toBeEmptyDOMElement()
  })

  it("Should render correct number and buttons", () => {
    render(<Paginator pageNumber={2} hasNextPage={true}/>)

    expect(screen.getByRole('button',{ name: 'Next'}))
    expect(screen.getByRole("button", { name: "Previous" }))
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it("Should navigate to correct URL after click", async () => {
    render(<Paginator pageNumber={3} hasNextPage={true} />)

    await user.click(screen.getByText('Previous'))
    expect(useRouter().replace).toHaveBeenCalledWith("/mocked-path?page=2")

    await user.click(screen.getByRole('button', {name: 'Next'}))
    expect(useRouter().replace).toHaveBeenCalledWith("/mocked-path?page=4")

  })
})