import { render, screen, waitFor } from "@testing-library/react";
import LeftSidebar from "../LeftSidebar";
import { userEvent } from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { sidebarLinks } from "@/constants";

jest.mock("@clerk/nextjs", () => ({
  useAuth: () => ({userId: '123'}), 
  SignedOut: ({children} :{children:React.ReactNode}) => <>{children}</>
}))
const pushMock = jest.fn()
jest.mock("next/navigation", () => ({
  usePathname: () => "/mocked-path",
  useRouter: jest.fn(() => ({ push: pushMock}))
}))

describe("LeftSideBar", () => {
  const user = userEvent.setup()
  it("Should render link correctly", () => {
    render(<LeftSidebar />)

    sidebarLinks.forEach(item => {
      expect(screen.getByText(item.label)).toBeInTheDocument()
    })
  })

  it("Should navigate to right path after click", async () => {
    render(<LeftSidebar />)
    screen.debug()

    await user.click(screen.getByText('Profile'))

    waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith('/mocked-path/profile/123')
      expect(screen.getByAltText('profile')).not.toHaveClass('invert-colors')
    })
  })
})