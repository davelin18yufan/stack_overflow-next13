import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import useTheme, { ThemeProvider } from "../ThemeProvider"
import { userEvent } from "@testing-library/user-event"
import { act } from "react-test-renderer"

const mockGetItem = jest.fn()
const mockSetItem = jest.fn()
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: (...args: string[]) => mockGetItem(...args),
    setItem: (...args: string[]) => mockSetItem(...args),
    theme: 'dark'
  },
})

describe("ThemeProvider", () => {
  const user = userEvent.setup()
  it("Should render children with lightmode by default", () => {
    render(
      <ThemeProvider>
        <div data-testid="child">test child</div>
      </ThemeProvider>
    )

    expect(screen.getByTestId("child")).toBeInTheDocument()
    expect(screen.getByTestId("child").classList.contains("dark")).toBeFalsy()
  })

  it("switches to dark mode when prefers-color-scheme is dark", () => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === "(prefers-color-scheme: dark)",
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }))

    const { container } = render(
      <ThemeProvider>
        <div data-testid="child">Child Component</div>
      </ThemeProvider>
    )

    expect(screen.getByTestId("child")).toBeInTheDocument()
    expect(document.documentElement.classList.contains("dark")).toBeTruthy()
  })

  
  // it("changes theme when setMode is called", async () => {
  //   const TestComponent = () => {
  //     const { mode, setMode } = useTheme()
  //     return (
  //       <div>
  //         <div data-testid="mode">{mode}</div>
  //         <button onClick={() => setMode("light")} >
  //           Set light
  //         </button>
  //       </div>
  //     )
  //   }

    
  //   const { getByTestId } = render(
  //     <ThemeProvider>
  //       <TestComponent />
  //     </ThemeProvider>
  //   )
  //   expect(getByTestId("mode")).toHaveTextContent("dark")
  //   await act(async () => {
  //     fireEvent.click(screen.getByRole('button'))
      
  //   })
  //   await waitFor(() => {
  //     expect(getByTestId("mode")).toHaveTextContent("light")
  //   })
    
  // })
})

describe("useTheme", () => {
  it("throws an error if used outside of ThemeProvider", () => {
    const TestComponent = () => {
      const { mode } = useTheme()
      return (
          <div data-testid="mode">{mode}</div>
      )
    }

    expect(() => {
      render(<TestComponent />)
    }).toThrow(new Error("useTheme must be used within a ThemeProvider"))
  })
})
