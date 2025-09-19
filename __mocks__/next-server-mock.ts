import { NextResponse } from "next/server"

jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: any, init?: ResponseInit) => {
      return {
        status: init?.status || 200,
        headers: init?.headers || {},
        json: async () => body,
      }
    },
  },
}))

export const MockNextResponse = NextResponse