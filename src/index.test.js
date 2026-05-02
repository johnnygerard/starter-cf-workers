import { describe, expect, it } from "vitest";

const ORIGIN = "http://localhost:8787";
const ROOT_ENDPOINT = `${ORIGIN}/`;
const UNKNOWN_ENDPOINT = `${ORIGIN}/unknown`;

describe("The API root endpoint", () => {
  it("responds successfully with the expected JSON payload", async () => {
    const response = await fetch(ROOT_ENDPOINT);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toMatch(
      /^application\/json(?:;|$)/i,
    );
    expect(payload).toEqual({
      message: expect.any(String),
      clientIp: expect.any(String),
      timestamp: expect.any(String),
    });
  });

  it("handles HEAD requests correctly", async () => {
    const response = await fetch(ROOT_ENDPOINT, { method: "HEAD" });
    const payload = await response.text();

    expect(response.status).toBe(200);
    expect(payload).toBe("");
  });
});

describe("The API", () => {
  it("responds with a 404 status for unknown endpoints", async () => {
    const response = await fetch(UNKNOWN_ENDPOINT);
    expect(response.status).toBe(404);
  });

  it("responds with a 501 status for unsupported HTTP methods", async () => {
    for (const method of ["OPTIONS", "TRY"]) {
      const response = await fetch(UNKNOWN_ENDPOINT, { method });
      expect(response.status).toBe(501);
    }
  });
});
