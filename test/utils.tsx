import React, { ReactElement } from "react"
import { render, RenderOptions } from "@testing-library/react"
import { ThemeProvider } from "@/context/ThemeProvider"

interface Children {
  children: React.ReactNode
}
const AllTheProviders = ({ children }: Children) => {
  return (
    <ThemeProvider >
        {children}
    </ThemeProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from "@testing-library/react"

// override render method
export { customRender as render }
