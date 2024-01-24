import { screen, waitFor } from "@testing-library/react";
import { render } from "@/test/utils";
import { userEvent } from "@testing-library/user-event";
import MobileNav from "../MobileNav";
import Navbar from "../Navbar";
import Theme from "../Theme";
import { useRouter } from "next/navigation"

const pushMock = jest.fn()
const searchParamsMock = new URLSearchParams('')
jest.mock("next/navigation", () => ({
  usePathname: () => '/mocked-path',
  useRouter: () => ({
    push: pushMock
  }),
  useSearchParams: () => searchParamsMock
}))
jest.mock('@clerk/nextjs')


describe("MobileNav", () => {
  const user = userEvent.setup()
  it("Should render correct data after menu clicked", async () => {
    render(<MobileNav/>)
    await user.click(screen.getByAltText('menu'))

    expect(screen.getByAltText("DevFlow")).toBeInTheDocument()
    expect(screen.getByText(/Overflow/i)).toBeInTheDocument()
    expect(screen.getByText("Home")).toBeInTheDocument()
    expect(screen.getByAltText("Home")).toBeInTheDocument()
  })

  it("Should navigate to correct path after click", async () => {
    render(<MobileNav />)
    await user.click(screen.getByAltText("menu"))

    await user.click(screen.getByText('Home'))

    waitFor(() => {
      expect(screen.getByText('Home')).toHaveClass('base-bold')
      expect(useRouter().push).toHaveBeenCalledWith('/')
    })

    jest.clearAllMocks()
  })
})

describe('Navbar', () => {
  const user = userEvent.setup()
  it("Should render correct data", () => {
    render(<Navbar />)

    expect(screen.getByAltText("DevFlow")).toBeInTheDocument()
    expect(screen.getByText(/Overflow/i)).toBeInTheDocument()
  })

  it("Should navigate to home page after clicked logo", async () => {
    render(<Navbar/>)

    await user.click(screen.getByText(/Overflow/i))

    waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith('/')
    })
    jest.clearAllMocks()
  })
})

describe("Theme", () => {
  const user = userEvent.setup()
  it("Should render 3 icon after clicked", async () => {
    render(<Theme />)
    
    expect(screen.getByAltText('sun')).toBeInTheDocument()
    await userEvent.click(screen.getByAltText("sun"))

    expect(screen.getByAltText("light")).toBeInTheDocument()
    expect(screen.getByAltText("dark")).toBeInTheDocument()
    expect(screen.getByAltText("system")).toBeInTheDocument()
  })

  it("Should switch mode after clicked", async () => {
    render(<Theme/>)

    // initial
    expect(screen.getByAltText("sun")).toBeInTheDocument()

    // activate
    await user.click(screen.getByAltText("sun"))
    await user.click(screen.getByAltText("dark"))
    expect(screen.getByAltText("moon")).toBeInTheDocument()
    await user.click(screen.getByAltText("moon"))
    expect(screen.getByAltText("dark")).toHaveClass('active-theme')
    expect(localStorage.getItem('theme')).toBe('dark')
    expect(document.documentElement.classList[0]).toBe('dark')
  })
})