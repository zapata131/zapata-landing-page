# zapata131.com

Source for [zapata131.com](https://zapata131.com), the personal page of José Luis Zapata: technical writer at
Google, former researcher in complex networks, board game person.

[![FTP Deploy](https://github.com/zapata131/zapata-landing-page/workflows/FTP%20Deploy/badge.svg)](https://github.com/zapata131/zapata-landing-page/actions/workflows/.deploy.yml)

![Screenshot of zapata131.com](assets/og.png)

## What's here

```text
index.html      English page
es/index.html   Spanish page (shares styles.css and script.js)
styles.css      Layout and the light/dark palette
script.js       Theme toggle and the random quote in the footer
assets/         Open Graph image and the Lorenz attractor drawing
desktop/        ZapataOS, a fake retro desktop linked from the footer
icons/          Favicon
```

Plain HTML, CSS, and JavaScript. No build step.

## Run it locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. Opening `index.html` straight from disk mostly works, but the CSS mask that draws
the attractor needs a server.

## Details worth knowing

- **Theme.** The page follows the system light/dark setting. The footer button overrides it and stores the
  choice in `localStorage` only when it differs from the system, so pressing it again goes back to following
  the system.
- **Languages.** Edit both `index.html` and `es/index.html` when content changes. They point to each other with
  `hreflang` links.
- **The drawing.** `assets/lorenz.svg` is the x–z projection of a Lorenz attractor (σ = 10, ρ = 28, β = 8/3),
  the system used in the 2013 negative-couplings paper. CSS uses it as a mask so it takes the accent color in
  both themes.
- **ZapataOS.** Draggable windows on desktop, stacked windows on phones. Try `help` in the terminal.

## Deploy

Every push to `master` runs [.github/workflows/.deploy.yml](.github/workflows/.deploy.yml), which uploads the
site over FTP. Work on a branch if you don't want changes to go live.

## License

MIT. Started as a fork of [madzadev/landing-page](https://github.com/madzadev/landing-page).
