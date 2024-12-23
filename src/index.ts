import { Elysia, t } from "elysia";
import { PrismaClient } from "@prisma/client";
import { swagger } from "@elysiajs/swagger";
import { createPost, getPost, getPosts, updatePost } from "./post_handlers";
import { createBook, getBook, getBooks, updateBook } from "./book_handlers";
import { getUsers } from "./users_handlers";

const setup = (app: Elysia) => app.decorate("db", new PrismaClient());

const port = process.env.PORT || 8000;

const app = new Elysia()

  // ð¬ Movie API routes ð¬
  .use(
    swagger({
      path: "/v1/swagger",
    })
  )

  .use(setup)

  // User
  .get("/users", () => getUsers())

  // Post
  .get("/posts", () => getPosts())
  .get("/posts/:id", ({ params: { id } }) => getPost(id), {
    params: t.Object({
      id: t.Numeric(),
    }),
  })
  .post("/post", ({ body }) => createPost(body), {
    body: t.Object({
      title: t.String({
        minLength: 3,
        maxLength: 50,
      }),
      content: t.String({
        minLength: 3,
        maxLength: 50,
      }),
    }),
  })
  .put("/post/:id", ({ params: { id }, body }) => updatePost(id, body), {
    params: t.Object({
      id: t.Numeric(),
    }),
    body: t.Object(
      {
        title: t.Optional(
          t.String({
            minLength: 3,
            maxLength: 50,
          })
        ),
        content: t.Optional(
          t.String({
            minLength: 3,
            maxLength: 50,
          })
        ),
      },
      {
        minProperties: 1,
      }
    ),
  })

  // Get all books
  .get("/books", () => getBooks())
  .get("/books/:id", ({ params: { id } }) => getBook(id), {
    params: t.Object({
      id: t.Numeric(),
    }),
  })
  .post("/book", ({ body }) => createBook(body), {
    body: t.Object({
      name: t.String({
        minLength: 3,
        maxLength: 50,
      }),
      author: t.String({
        minLength: 3,
        maxLength: 50,
      }),
      price: t.Number({
        minLength: 3,
        maxLength: 50,
      }),
    }),
  })
  .put("/book/:id", ({ params: { id }, body }) => updateBook(id, body), {
    params: t.Object({
      id: t.Numeric(),
    }),
    body: t.Object(
      {
        name: t.Optional(
          t.String({
            minLength: 3,
            maxLength: 50,
          })
        ),
        author: t.Optional(
          t.String({
            minLength: 3,
            maxLength: 50,
          })
        ),
        price: t.Optional(
          t.Number({
            minLength: 3,
            maxLength: 50,
          })
        ),
      },
      {
        minProperties: 1,
      }
    ),
  })

  .get("/", () => "Welcome to Elysia! Go to /search to start searching")
  .group("/search", (app) => {
    return app
      .get("/", async ({ query, db }) => db.movie.findMany())
      .guard(
        {
          schema: {
            query: t.Object({
              q: t.String(),
            }),
          },
        },
        (app) =>
          app
            .get("/movie", async ({ query, db }) => {
              return db.movie.findMany({
                where: {
                  title: {
                    contains: query.q,
                  },
                },
              });
            })
            .get("/tv", async ({ query, db }) => {
              return db.movie.findMany({
                where: {
                  title: {
                    contains: query.q,
                  },
                  type: "series",
                },
              });
            })
            .get("/person", async ({ query, db }) => {
              return db.person.findMany({
                where: {
                  name: {
                    contains: query.q,
                  },
                },
              });
            })
            // .get("/company", ({ query }) => `query: ${query.q}`)
            .get("/episode", async ({ query, db }) => {
              return db.episode.findMany({
                where: {
                  title: {
                    contains: query.q,
                  },
                },
              });
            })
            .get("/review", async ({ query, db }) => {
              return db.review.findMany({
                where: {
                  comment: {
                    contains: query.q,
                  },
                },
              });
            })
            .get("/award", async ({ query, db }) => {
              return db.award.findMany({
                where: {
                  name: {
                    contains: query.q,
                  },
                },
              });
            })
      );
  })
  .group("/title/:id", (app) => {
    return app.guard(
      {
        schema: {
          params: t.Object({
            id: t.String(),
          }),
        },
      },
      (app) =>
        app
          .get("/", async ({ params, db }) => {
            return db.movie.findUnique({
              where: {
                id: parseInt(params.id, 10),
              },
            });
          })
          .get("/episodes", async ({ params, db }) => {
            return db.episode.findMany({
              where: {
                movieId: parseInt(params.id, 10),
              },
            });
          })
          .get("/cast", async ({ params, db }) => {
            return db.person.findMany({
              where: {
                movies: {
                  some: {
                    id: parseInt(params.id, 10),
                  },
                },
              },
            });
          })
          .get("/reviews", async ({ params, db }) => {
            return db.review.findMany({
              where: {
                movieId: parseInt(params.id, 10),
              },
            });
          })
          .get("/awards", async ({ params, db }) => {
            return db.award.findMany({
              where: {
                movieId: parseInt(params.id, 10),
              },
            });
          })
    );
  })
  .listen(port);

console.log(
  `ð¦ Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
