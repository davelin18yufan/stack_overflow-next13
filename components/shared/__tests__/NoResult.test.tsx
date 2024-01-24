import { screen, waitFor } from "@testing-library/react"
import { render } from "@/test/utils"
import NoResult from "../NoResult"
import { useAuth } from "@clerk/nextjs"
import { toast } from "@/components/ui/use-toast"
import { userEvent } from "@testing-library/user-event"
import { useRouter } from "next/navigation"

jest.mock("@clerk/nextjs", () => ({
  useAuth: jest.fn(),
}))
jest.mock("@/components/ui/use-toast")
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn()
  })
})
)
const mockProp = {
  title: "No results found",
  description: "testing no results",
  link: "/",
  linkTitle: "Back",
}

afterEach(() => {
  jest.clearAllMocks()
})

describe("NoResult", () => {
  const user = userEvent.setup()
  const { title, description, link, linkTitle } = mockProp
  it("Should render no result text and button if login", () => {
    (useAuth as jest.Mock).mockReturnValue({userId: '123'})
    render(
      <NoResult
        title={title}
        description={description}
        link={link}
        linkTitle={linkTitle}
      />
    )

    // dark mode not specified
    expect(screen.getAllByAltText("no result illustration")).toHaveLength(2)
    expect(screen.getByText(description)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: linkTitle })).toBeInTheDocument()
  })

  it("Should render login request text if not login", () => {
    ;(useAuth as jest.Mock).mockReturnValue({ userId: "" })
    const { title, description, link, linkTitle } = mockProp
    render(
      <NoResult
        title={title}
        description={description}
        link={link}
        linkTitle={linkTitle}
      />
    )

    expect(toast).toHaveBeenCalledWith({
      title: "You have to login first!",
      variant: "destructive",
    })
  })

  it("Should navigate to correct url", async () => {
    ;(useAuth as jest.Mock).mockReturnValue({ userId: "123" })
    const { title, description, link, linkTitle } = mockProp
    render(
      <NoResult
        title={title}
        description={description}
        link={link}
        linkTitle={linkTitle}
      />
    )

    await user.click(screen.getByRole('button', {name: linkTitle}))
      screen.debug()
    waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith(linkTitle)
    })
  })
})
