import { render, screen} from "@testing-library/react"
import EditDeleteAction from "../EditDeleteAction"
import { userEvent } from "@testing-library/user-event"
import { useRouter, usePathname } from "next/navigation"
import { deleteQuestion } from "@/lib/actions/question.action"
import { toast } from "@/components/ui/use-toast"
import { deleteAnswer } from "@/lib/actions/answer.action"

const pushMock = jest.fn()
jest.mock("@/lib/actions/question.action")
jest.mock("@/lib/actions/answer.action")
jest.mock("next/navigation", () => ({
  useRouter : () => ({
    push: pushMock
  }),
  usePathname: () => "/mocked-path"
}))
jest.mock("@/components/ui/use-toast", () => ({
  toast: jest.fn()
}))

describe("EditDeleteAction", () => {
  const user = userEvent.setup()
  it("Should render correct data", () => {
    render(<EditDeleteAction itemId="13" type="Question"/>)

    expect(screen.getByAltText("edit")).toBeInTheDocument()
    expect(screen.getByAltText("delete")).toBeInTheDocument()
    
  })

  it("Should perform right action when type is question", async () => {
    render(<EditDeleteAction itemId="13" type="Question" />)

    // edit
    await user.click(screen.getByAltText("edit"))
    expect(useRouter().push).toHaveBeenCalledWith("/question/edit/13")

    // delete
    await user.click(screen.getByAltText("delete"))
    expect(deleteQuestion).toHaveBeenCalledWith({questionId: JSON.parse('13'), path: usePathname()})
    expect(toast).toHaveBeenCalledWith({
      title: "Question Delete Successfully",
      variant: "default",
    })
  })

  it("Should perform correct action when type is answer", async () => {
    render(<EditDeleteAction itemId="13" type="Answer" />)

    await user.click(screen.getByAltText("delete"))

    expect(deleteAnswer).toHaveBeenCalledWith({
      answerId: JSON.parse('13'),
      path: usePathname()
    })
    expect(toast).toHaveBeenCalledWith({
      title: "Answer Delete Successfully",
      variant: "default",
    })

  })
})