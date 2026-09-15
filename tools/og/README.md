# The OG card

`og-card.html` renders `public/og.png` — the 1200x630 preview image that
Twitter, Slack, Discord, iMessage and Hacker News show when the site is
linked. `desktop-backdrop.png` is the screenshot it sits on, captured from
the live desktop view.

Regenerate after a redesign (or when the toy count changes):

    node server.js &                 # so the desktop can be re-captured
    CHROME=~/Library/Caches/ms-playwright/chromium_headless_shell-1243/\
    chrome-headless-shell-mac-arm64/chrome-headless-shell

    # 1. re-capture the backdrop
    $CHROME --headless --hide-scrollbars --window-size=1200,630 \
      --virtual-time-budget=3500 \
      --screenshot=tools/og/desktop-backdrop.png http://localhost:3000/

    # 2. re-render the card (edit the toy count in og-card.html first)
    $CHROME --headless --hide-scrollbars --force-device-scale-factor=1 \
      --window-size=1200,630 \
      --screenshot=public/og.png "file://$PWD/tools/og/og-card.html"

The card's background points at `desktop-backdrop.png` by absolute
file:// path — fix that path if you move this folder.
