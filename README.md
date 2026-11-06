# QuantGuide Prep Tracker

A personal tracker for QuantGuide problems and Zetamac practice. The account-backed website is in `site/`. It uses ChatGPT Sites sign-in and a Cloudflare D1 database provisioned by Sites. Your problem history is private and is not included in this repository.

## Make your own tracker with ChatGPT or Codex

Give your assistant the link to this repository and ask:

> Set up my own private instance of this tracker using ChatGPT Sites. Follow the Sites skill, create a new Site and database for my account, deploy it privately, and help me set up Quick Save and the optional Zetamac extension. Do not reuse the project ID in the repository or import anyone else's data.

The assistant needs access to the Sites plugin and a ChatGPT account eligible for Sites. Hosting and usage limits depend on the account and current Sites terms. The website requires sign-in to its owner's account.

For the assistant: treat `site/` as a template, not an existing Site. Copy its source into a fresh project directory without Git metadata, credentials, or runtime data. Remove the original `project_id` from the copied `.openai/hosting.json`, retaining its `d1` binding (`DB`), before registering a **new** Site. Persist the newly returned project ID using the Sites workflow. Preserve the Drizzle schema and migrations, build and deploy the copy privately, and verify the database and sign-in before reporting success. Never deploy to or modify the Site identified by this repository's original project ID. Start with an empty database; do not copy or upload another person's local storage or backups.

Once deployed, bookmark your own Site in your browser. In the tracker, open **Set up Quick Save** and drag **Save problem** to your bookmarks bar. Open a QuantGuide problem and click it to record an attempt. Your assistant can guide you through the setup.

## Zetamac extension (optional)

1. In Chrome, open the extensions page, enable Developer mode, select **Load unpacked**, and choose this repository's `extension/` folder.
2. Open the extension's options, enter your own tracker URL, and grant access to that site. Reload the tracker.
3. Play a standard 120-second Zetamac game with all four operations enabled. Completed games sync when the tracker is open in the same Chrome profile.

Interrupted games and games played before the extension was installed are not imported. Each game has an ID to avoid duplicates. Keep a backup of your data; browser and extension storage can be cleared.

## Repository layout

- `site/`: source for the account-backed Site, including the database schema and migrations.
- `extension/`: optional Chrome extension for Zetamac.
- `app/`: older static implementation, kept for reference. It stores data in browser local storage and does not provide account-backed sync.
