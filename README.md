# readthicket-com

readthicket.com's own pages: the landing page now; pricing, legal, about and
contact next. Everything a reader uses, including sign up, log in and every
public profile and collection, is the thicket app
([mocha/thicket](https://github.com/mocha/thicket)), which is open source and
self-hostable. This site is neither: it exists only on readthicket.com.

## How it fits together

One domain. The thicket app is the front door: with `SITE_URL` set, it hands
this site the paths it owns (`/` and `/_site/`; the list is `SITE_PATHS` in
thicket's `packages/api/src/index.ts`) and serves everything else itself.
Adding a page here means adding its path there too.

Because both share the domain, this site's pages call the app's API with plain
same-origin requests, use its fonts and icons, and see the visitor's sign-in
cookie. On the server, the header asks the app who's signed in, at
`THICKET_URL`.

## Design system

The buttons, fields, cards, colors and type come from thicket, copied by
`pnpm sync` (`scripts/sync-from-thicket.sh`, which reads `../thicket`). Don't
edit those copies here: change them in thicket, then sync. The script lists
which files they are. Everything else in `src/` belongs to this site.

## Develop

```sh
nix-shell          # node and pnpm
pnpm install
pnpm dev           # http://localhost:5174, beside thicket's dev server on :5173
pnpm check
```

Paths this site doesn't have (`/login`, `/@someone`) redirect to thicket's dev
server in dev.

## Deploy

A second service beside thicket, reachable only on the private network:

| Setting | Value |
|---|---|
| `THICKET_URL` | thicket's private address, e.g. `http://thicket.railway.internal:3000` |
| `ORIGIN` | `https://readthicket.com` |
| `PORT` | whatever the platform gives it |

Then set `SITE_URL` on thicket to this service's private address. Deploy this
site first: until `SITE_URL` is set, thicket's `/` goes to Everything or the
login screen.
