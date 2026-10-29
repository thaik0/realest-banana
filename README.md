# QuantGuide Prep Tracker

A personal tracker for QuantGuide attempts. The static app is in `app/`; serve that directory with any static web server. Attempts are stored in the browser's local storage.

## Zetamac automatic tracking

The existing QuantGuide Quick Save bookmarklet requires a click and cannot run automatically on Zetamac. The included Chromium extension watches the Zetamac game page and stores a completed game's score locally without interrupting play. It is intended for the standard 120-second game with all four operations; other settings are not supported. A game interrupted by closing or refreshing the tab before the results screen is not recorded.

1. Serve `app/` over HTTP or HTTPS (for example, run `python3 -m http.server 8000 --directory app` and open `http://localhost:8000/`). Use the same tracker address each time: browser local storage is tied to the origin.
2. In Chrome or another Chromium browser, open the extensions management page, enable Developer mode, choose **Load unpacked**, and select this project's `extension/` folder.
3. Open the extension's options, enter your tracker URL and grant access to that tracker site. Reload the tracker once.
4. Play Zetamac normally. Completed sessions are queued in extension storage and copied into the tracker whenever it is open. The extension and tracker must use the same browser profile. The extension stores scores locally; it does not send them to a server.

Each game has its own ID; repeated synchronization does not duplicate it. A refresh starts a new Zetamac game rather than reopening the old results. Sessions are grouped by the browser's local calendar date. The tracker and extension each retain a copy, so clearing browser or extension storage can remove data. Installing or reconnecting the extension does not import games played previously.
