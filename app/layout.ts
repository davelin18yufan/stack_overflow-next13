/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"

// Unit of Work： 你的工作單位，像是 function, class, component 等
// Scenario： 我們要測試的情境，通常會以 when 開頭，若沒有特殊條件，可以用 by default, always 表示預設情境
// Expected result： 我們期待的結果，通常可以用 should 開頭

// Arrange：建立你測試需要的變數、物件等
// Act：執行測試
// Assert：斷定測試結果是否符合預期


