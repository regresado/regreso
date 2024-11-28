import { postRouter } from "~/server/api/routers/post";
import { destinationRouter } from "~/server/api/routers/destination";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
// TODO: Implement this package!
// import { generateOpenApiDocument } from "trpc-to-openapi";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  destination: destinationRouter,
});

/* 👇 */
// export const openApiDocument = generateOpenApiDocument(appRouter, {
//   title: "tRPC OpenAPI",
//   version: "1.0.0",
//   baseUrl: "http://localhost:3000/api",
// });

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
