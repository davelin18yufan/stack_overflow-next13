import { render, screen } from "@testing-library/react"
import Stats from "../Stats"

describe("Stats", () => {
  it("Should render correct badges and reputation score", () => {
    render(
      <Stats
        totalAnswers={3}
        totalQuestions={10}
        badges={{ GOLD: 3, SILVER: 2, BRONZE: 6 }}
        reputation={23}
      />
    )

    expect(screen.getByText(/Stats - 23/i)).toBeInTheDocument()
    expect(screen.getByAltText('Gold Badges')).toBeInTheDocument()
  })
})
