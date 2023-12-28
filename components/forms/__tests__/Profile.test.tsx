import Profile from "../Profile"
import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { updateUser } from "@/lib/actions/user.action"
import { toast } from "@/components/ui/use-toast"

const mockUsePathname = jest.fn()
jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
  useRouter() {
    return {
      push: () => jest.fn(),
      back: () => jest.fn(),
    }
  },
}))
jest.mock("@/lib/actions/user.action")
jest.mock("@/components/ui/use-toast")

const mockProp = {
  clerkId: "123",
  user: JSON.stringify({
    name: "test",
    username: "test",
    portfolioWebsite: "",
    location: "",
    bio: "",
  }),
}

describe("Render", () => {
  it("Should render 5 input fields and submit button", () => {
    render(<Profile clerkId={mockProp.clerkId} user={mockProp.user} />)

    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Portfolio Link/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Bio/i)).toBeInTheDocument()
    expect(screen.getByTestId("form")).toBeInTheDocument()
  })
})

describe("Interaction", () => {
  const user = userEvent.setup()
  it("Should submit form after press submit button and toast", async () => {
    mockUsePathname.mockImplementation(() => "/mocked-path")
    render(<Profile clerkId={mockProp.clerkId} user={mockProp.user} />)

    const nameInput = screen.getByPlaceholderText(/Your name/i)
    const userNameInput = screen.getByPlaceholderText(/Your username/i)
    const portfolioInput = screen.getByPlaceholderText(/Your portfolio URL/i)
    const locationInput = screen.getByPlaceholderText(/Where are you from/i)
    const bioInput = screen.getByPlaceholderText(/What's special about you?/i)

    await user.type(nameInput, "Update")
    await user.type(userNameInput, "Update")
    await user.type(portfolioInput, "https://example.com.tw")
    await user.type(locationInput, "Taiwan")
    await user.type(bioInput, "at least 10 words")

    await user.click(screen.getByRole("button", { name: "Save" }))
    expect(updateUser).toHaveBeenCalled()
    expect(updateUser).toHaveBeenCalledWith({
      clerkId: mockProp.clerkId,
      updateData: {
        name: "testUpdate",
        username: "testUpdate",
        portfolioWebsite: "https://example.com.tw",
        location: "Taiwan",
        bio: "at least 10 words",
      },
      path: "/mocked-path",
    })
    expect(toast).toHaveBeenCalledWith({ title: "Profile edit successfully" })
  })
})
