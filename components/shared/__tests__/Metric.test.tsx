import {render, screen, waitFor} from "@testing-library/react"
import Metric from "../Metric"
import { useRouter } from "next/navigation"
import { userEvent } from "@testing-library/user-event"

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}))

const mockProp = {
  imgUrl: "/assets/icons/like.svg",
  alt: "test",
  value: 30,
  title: "metric",
  href: "/profile/123",
  textStyles: "",
  isAuthor: true,
}

describe("Metric", () => {
  const user = userEvent.setup()
  it("Should render correct image", () => {
    const { imgUrl, alt, value, title} = mockProp
    render(<Metric imgUrl={imgUrl} alt={alt} value={value} title={title} />)

    expect(screen.getByAltText('test')).toBeInTheDocument()
    expect(screen.getByAltText("test")).not.toHaveClass("rounded-full")
    expect(screen.getByText('metric')).toBeInTheDocument()
  })

  it("Should navigate to correct URL after click", async () => {
    const { imgUrl, alt, value, title, href, isAuthor} = mockProp
    render(<Metric imgUrl={imgUrl} alt={alt} value={value} title={title} href={href} isAuthor={isAuthor}/>)

    await user.click(screen.getByAltText('test'))

    waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith(href)
    })
  })
})