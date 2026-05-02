const SUPPORTED_METHODS = Object.freeze(["GET", "HEAD"]);

export default {
  /**
   * Handle incoming HTTP requests
   * @param {Request} request - The incoming request object
   * @see https://developers.cloudflare.com/workers/
   */
  async fetch(request, env, ctx) {
    try {
      if (!SUPPORTED_METHODS.includes(request.method))
        return Response.json(
          {
            error:
              "This API currently only supports the following HTTP methods: " +
              SUPPORTED_METHODS.join(", "),
          },
          { status: 501 },
        );

      const { pathname } = new URL(request.url);

      let response;
      if (pathname === "/")
        response = Response.json({
          message: "Welcome to Cloudflare Workers!",
          clientIp: request.headers.get("CF-Connecting-IP") ?? "Unknown",
          timestamp: new Date(),
        });
      else response = new Response(null, { status: 404 });

      if (request.method === "HEAD")
        return new Response(null, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        });

      return response;
    } catch (error) {
      console.error("Unexpected error:", error);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  },
};
