# Little Contraptions

A small hub of self-contained web toys. Zero dependencies — one Node
static file server, one HTML page per toy.

## Run locally

    node server.js

Opens on http://localhost:3000.

## Structure

    server.js            static file server, respects $PORT
    public/index.html    the hub / card grid
    public/404.html      served for any unknown path
    public/weather/      "The Elsewhere Almanac"
    public/inventions/   "The Inventions of Humanity"

## Adding a new toy

1. Drop a self-contained folder under `public/your-toy/index.html`.
2. Add a card to the grid in `public/index.html` — copy an existing
   `.card-slot` block, bump the `No. 0N`, update the title, blurb, tag,
   and `href`.
3. Remove the "still being built" ghost card if it's no longer the last
   free slot, or leave it if there's still room.

## Deploy

Push to GitHub, then point Railway's create-deployment (or
connect-service-source) at the repo. Railway detects the Node app via
`package.json` and runs `npm start` automatically — no build config
needed.
