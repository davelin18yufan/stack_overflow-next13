import { render, screen } from "@testing-library/react"
import ProfileLink from "../ProfileLink"

describe("ProfileLink", () => {
  it("Should render correct link", () => {
    render(
      <ProfileLink
        imgUrl="https://www.google.com/search?q=%E7%91%9E%E5%A3%AB"
        href="/"
        title="testing title"
      />
    )

    expect(screen.getByAltText('icon')).toBeInTheDocument()
    expect(screen.getByText('testing title').tagName).toBe('A')
  })
})
