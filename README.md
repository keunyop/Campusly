# Campusly

A static campus dashboard prototype with a feed, tasks, calendar, and sign-in screen.

## Run locally

From this folder, start a local server:

    python -m http.server 8765

Then open http://localhost:8765/index.html. No package installation or build step is needed.

## Prototype behavior

- Feed search, category filters, posting, likes, and comments work in the browser.
- Tasks can be added, completed, filtered, and deleted.
- Calendar month and week views show sample events, and new events can be added.
- Browser storage keeps posts, tasks, and events between visits. Sign-in has no backend yet and reports that clearly on the page.

The UI redesign follows the [unslop](https://github.com/heydamir/unslop) skill by Damir Sokolovsky, licensed under CC BY 4.0. Its audit and working screenshots are in [temp](./temp/).
