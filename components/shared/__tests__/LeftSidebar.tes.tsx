import { render, screen } from "@testing-library/react";
import LeftSidebar from "../LeftSidebar";

jest.mock("@clerk/nextjs")
jest.mock("next/navigation", () => ({
  usePathname: () => "/mocked-path"
}))

describe("LeftSideBar", () => {
  it("Should render correct navigation", () => {
    
  })
})