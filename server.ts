import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.203.0/http/file_server.ts";

const port = 8080; // 任意のポート番号を指定
const handler = (request: Request): Promise<Response> => {
  return serveDir(request, { fsRoot: "./public", showDirListing: true });
};

console.log(`Server running on http://localhost:${port}/`);
await serve(handler, { port });
