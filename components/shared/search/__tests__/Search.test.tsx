import { act, render, screen, waitFor } from "@testing-library/react"
import GlobalSearch from "../GlobalSearch"
import LocalSearchbar from "../LocalSearchbar"
import { useSearchParams, useRouter } from "next/navigation"
import { userEvent } from "@testing-library/user-event"

jest.mock("next/navigation", () => ({
  usePathname: () => "/mocked-path",
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}))

describe("GlobalSearch", () => {
  const user = userEvent.setup()
  const mockSearchParams = new URLSearchParams()
  const mockRouter = {
    replace: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it("Renders with correct form", () => {
    render(<GlobalSearch />)

    expect(screen.getByPlaceholderText("Search globally")).toBeInTheDocument()
  })

  it("Updates search query and trigger global search", async () => {
    render(<GlobalSearch />)

    const input = screen.getByPlaceholderText("Search globally")

    await user.type(input, "test")

    await waitFor(() => {
      expect(input).toHaveValue("test")
      expect(useRouter().replace).toHaveBeenCalledWith(
        "/mocked-path?global=test"
      )
    })
  })

  it("Should close result when clicking outside", async () => {
    render(<GlobalSearch />)

    const input = screen.getByPlaceholderText("Search globally")

    await user.type(input, "test")
    await user.click(document.body)

    await waitFor(() => {
      expect(input).toHaveValue("")
      expect(useRouter().replace).toHaveBeenCalledWith("/mocked-path?")
    })
  })
})

describe("LocalSearchBar", () => {
  const user = userEvent.setup()
  const mockSearchParams = new URLSearchParams()
  const mockRouter = {
    replace: jest.fn(),
  }
  const mockProp = {
    route: "/mocked-path",
    iconPosition: "left",
    imgSrc: "/assets/icons/search.svg",
    placeholder: "test search",
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it("Renders with correct form", () => {
    const { route, iconPosition, imgSrc, placeholder } = mockProp
    render(
      <LocalSearchbar
        route={route}
        iconPosition={iconPosition}
        imgSrc={imgSrc}
        placeholder={placeholder}
      />
    )

    expect(screen.getByPlaceholderText("test search")).toBeInTheDocument()
    expect(screen.getByAltText("search icon")).toBeInTheDocument()
  })

  it("Updates search query and trigger local search", async () => {
    const { route, iconPosition, imgSrc, placeholder } = mockProp
    render(
      <LocalSearchbar
        route={route}
        iconPosition={iconPosition}
        imgSrc={imgSrc}
        placeholder={placeholder}
      />
    )

    const input = screen.getByPlaceholderText("test search")
    
    await user.type(input, "test")

    await waitFor(() => {
      expect(input).toHaveValue("test")
      expect(useRouter().replace).toHaveBeenCalledWith("/mocked-path?q=test")
    })
  })

  it("debounces search input", async () => {
    const { route, iconPosition, imgSrc, placeholder } = mockProp
    render(
      <LocalSearchbar
        route={route}
        iconPosition={iconPosition}
        imgSrc={imgSrc}
        placeholder={placeholder}
      />
    )
    const input = screen.getByPlaceholderText("test search")

    // Trigger multiple input events within a short timeframe
    userEvent.type(input, "t")
    userEvent.type(input, "e")
    userEvent.type(input, "s")
    userEvent.type(input, "t")

    // Wait for the debounce timeout
    await act(async () => { // act assure every async operations being wrapped inside finished
      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith("/mocked-path?q=test")
      })
    })
  })

  it("Clear input and delete search query", async () => {
    const { route, iconPosition, imgSrc, placeholder } = mockProp
    render(
      <LocalSearchbar
        route={route}
        iconPosition={iconPosition}
        imgSrc={imgSrc}
        placeholder={placeholder}
      />
    )

    const input = screen.getByPlaceholderText("test search")

    await user.type(input, "test")
    await user.clear(input)

    await waitFor(() => {
      expect(input).toHaveValue("")
      expect(useRouter().replace).toHaveBeenCalledWith("/mocked-path?")
    })
  })
})
