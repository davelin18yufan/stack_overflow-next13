import Profile from "../Profile";
import { render, screen } from "@testing-library/react";

const mockProp = {
  clerkId: "123",
  user: JSON.stringify({
    name: "test",
    username: "test",
    portfolioWebsite: "",
    location: "Taiwan",
    bio: "test user"
  })
}

describe("Render", () => {
  it("Should render 5 input fields and submit button", () => {
    render(<Profile clerkId={mockProp.clerkId} user={mockProp.user} />)
  })

  
})