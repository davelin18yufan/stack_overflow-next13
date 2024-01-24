import { render, screen, waitFor } from "@testing-library/react"
import Votes from "../Votes"
import { userEvent } from "@testing-library/user-event"
import {
  downVoteQuestion,
  toggleSaveQuestion,
  upVoteQuestion,
} from "@/lib/actions/question.action"
import { usePathname } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { downVoteAnswer, upVoteAnswer } from "@/lib/actions/answer.action"

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: () => "/mocked-path",
}))
jest.mock("@/components/ui/use-toast", () => ({ toast: jest.fn() }))
jest.mock("@/lib/actions/answer.action", () => ({
  upVoteAnswer: jest.fn(() => Promise.resolve({ message: "Success" })),
  downVoteAnswer: jest.fn(() => Promise.resolve({ message: "Success" })),
}))
jest.mock("@/lib/actions/question.action")
jest.mock("@/lib/actions/interaction.action", () => ({
  viewQuestion: () => Promise.resolve(),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

describe("Votes without login", () => {
  const mockProp = {
    itemId: "123",
    userId: "",
    type: "Question",
    upVotes: 13,
    downVotes: 2,
    hasUpVoted: true,
    hasDownVoted: false,
    hasSaved: false,
  }
  const user = userEvent.setup()
  it("Should notify with login request message", async () => {
    render(<Votes {...mockProp} />)

    // click save
    await user.click(screen.getByAltText("star icon"))
    expect(toast).toHaveBeenCalledWith({
      title: "Please log in",
      description: "You must log in to perform this operation",
    })

    // click vote
    await user.click(screen.getByAltText("upvote icon"))
    expect(toast).toHaveBeenCalledWith({
      title: "Please log in",
      description: "You must log in to perform this operation",
    })
  })
})

describe("Question Votes", () => {
  const mockProp = {
    itemId: "123",
    userId: "123",
    type: "Question",
    upVotes: 13,
    downVotes: 2,
    hasUpVoted: true,
    hasDownVoted: false,
    hasSaved: false,
  }

  const { itemId, userId, hasUpVoted, hasDownVoted, hasSaved } = mockProp
  const user = userEvent.setup()
  it("Should render correct voting number", async () => {
    render(<Votes {...mockProp} />)

    expect(screen.getByAltText("upvote icon")).toBeInTheDocument()
    expect(screen.getByAltText("upvote icon")).toHaveAttribute(
      "src",
      "/assets/icons/upvoted.svg"
    )

    expect(screen.getByText("13")).toBeInTheDocument()
    expect(screen.getByAltText("star icon")).toBeInTheDocument()
    expect(screen.getByAltText("star icon")).toHaveAttribute('src', '/assets/icons/star-red.svg')
  })

  it("Should perform upVote and downVote function", async () => {
    render(<Votes {...mockProp} />)

    // upvote
    await user.click(screen.getByAltText("upvote icon"))
    await waitFor(() => {
      expect(upVoteQuestion).toHaveBeenCalledWith({
        questionId: JSON.parse(itemId),
        userId: JSON.parse(userId),
        hasupVoted: hasUpVoted,
        hasdownVoted: hasDownVoted,
        path: usePathname(),
      })

      expect(toast).toHaveBeenCalledWith({
        title: `Upvote ${hasUpVoted ? "Removed" : "Successfully"}`,
        variant: `${hasUpVoted ? "destructive" : "default"}`,
      })
    })

    // downvote
    await user.click(screen.getByAltText("downvote icon"))
    await waitFor(() => {
      expect(downVoteQuestion).toHaveBeenCalledWith({
        questionId: JSON.parse(itemId),
        userId: JSON.parse(userId),
        hasupVoted: hasUpVoted,
        hasdownVoted: hasDownVoted,
        path: usePathname(),
      })
    })
    expect(toast).toHaveBeenCalledWith({
      title: `Downvote ${hasDownVoted ? "Removed" : "Successfully"}`,
      variant: `${hasDownVoted ? "destructive" : "default"}`,
    })
  })

  it("Should perform save question after click", async () => {
    render(<Votes {...mockProp} />)

    await user.click(screen.getByAltText("star icon"))
    await waitFor(() => {
      expect(toggleSaveQuestion).toHaveBeenCalledWith({
        userId: JSON.parse(userId),
        questionId: JSON.parse(itemId),
        path: usePathname(),
      })
    })
    expect(toast).toHaveBeenCalledWith({
      title: `Question ${
        hasSaved ? "Saved in" : "Removed from"
      } your collections`,
      variant: `${hasSaved ? "default" : "destructive"}`,
    })
  })
})

describe("Answer Votes", () => {
  const mockProp = {
    itemId: "123",
    userId: "123",
    type: "Answer",
    upVotes: 13,
    downVotes: 2,
    hasUpVoted: false,
    hasDownVoted: true,
  }

  const { itemId, userId, hasUpVoted, hasDownVoted } = mockProp
  const user = userEvent.setup()
  it("Should not render save icon", () => {
    render(<Votes {...mockProp}/>)
    // query => prevent throw error
    expect(screen.queryByAltText('star icon')).not.toBeInTheDocument()
  })

  it("Should call up-vote and down-vote answer", async () => {
    render(<Votes {...mockProp} />)

    // upvote
    await user.click(screen.getByAltText("upvote icon"))
    await waitFor(() => {
      expect(upVoteAnswer).toHaveBeenCalledWith({
        answerId: JSON.parse(itemId),
        userId: JSON.parse(userId),
        hasupVoted: hasUpVoted,
        hasdownVoted: hasDownVoted,
        path: usePathname(),
      })
    })
    expect(toast).toHaveBeenCalledWith({
      title: `Upvote ${hasUpVoted ? "Removed" : "Successfully"}`,
      variant: `${hasUpVoted ? "destructive" : "default"}`,
    })

    // downvote
    await user.click(screen.getByAltText("downvote icon"))
    await waitFor(() => {
      expect(downVoteAnswer).toHaveBeenCalledWith({
        answerId: JSON.parse(itemId),
        userId: JSON.parse(userId),
        hasupVoted: hasUpVoted,
        hasdownVoted: hasDownVoted,
        path: usePathname(),
      })
    })
    expect(toast).toHaveBeenCalledWith({
      title: `Downvote ${hasDownVoted ? "Removed" : "Successfully"}`,
      variant: `${hasDownVoted ? "destructive" : "default"}`,
    })
  })
})
