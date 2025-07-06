import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";

const app = new Elysia()
    .use(staticPlugin())
    .get('/favicon.ico', () => Bun.file("favicon.ico"))
    .get('/', () => Bun.file("src/index.html"))
    .listen(3000);

console.log(`Server running at http://${app.server?.hostname}:${app.server?.port}`);