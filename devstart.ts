import { $ } from "bun";

await Promise.all([
    $`bun run server:dev`,
    $`bun run client:dev`
]);