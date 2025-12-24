# MangaPark Image Server Fix

A userscript that automatically fixes broken manga images on MangaPark by cycling through available image servers until a working one is found.

## Features

- **Auto-fix on page load** — Automatically redirects images to a preferred server (s04)
- **Smart server cycling** — If an image fails to load, automatically tries the next available server (s01-s10)
- **Dynamic image support** — Catches images that load as you scroll through chapters
- **Lightweight** — Uses efficient WeakMap tracking to avoid memory leaks
- **Multi-domain support** — Works across all known MangaPark mirror domains

## Supported Domains

| MangaPark | ComicPark | ReadPark | ParkManga | Other |
|-----------|-----------|----------|-----------|-------|
| mangapark.com | comicpark.org | readpark.org | parkmanga.com | mpark.to |
| mangapark.net | comicpark.to | readpark.net | parkmanga.net | |
| mangapark.org | | | parkmanga.org | |
| mangapark.me | | | | |
| mangapark.io | | | | |
| mangapark.to | | | | |

---

## Requirements

You need a **userscript manager** extension installed in your browser:

| Platform | Recommended Extension |
|----------|----------------------|
| Chrome / Edge / Brave | [Tampermonkey](https://www.tampermonkey.net/) |
| Firefox (Desktop) | [Tampermonkey](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) or [Violentmonkey](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/) |
| Safari | [Userscripts](https://apps.apple.com/us/app/userscripts/id1463298887) |
| Firefox (Android) | [Tampermonkey](https://addons.mozilla.org/en-US/android/addon/tampermonkey/) |
| Android (Chrome-like) | [Kiwi Browser](https://play.google.com/store/apps/details?id=com.kiwibrowser.browser) + Tampermonkey |
| iOS | [Orion Browser](https://apps.apple.com/us/app/orion-browser-by-kagi/id1484498200) or Safari + Userscripts app |

---

## Installation

### Desktop (Chrome, Firefox, Edge)

1. Install **Tampermonkey** from your browser's extension store
2. Click the Tampermonkey icon in your toolbar
3. Select **"Create a new script"**
4. Delete any template code in the editor
5. Copy and paste the entire script from [`MangaPark Image Server Fix-2.0.user.js`](https://github.com/verybad3/mangapark_image_fix/blob/main/MangaPark%20Image%20Server%20Fix-2.0.user.js)
6. Press `Ctrl + S` (Windows/Linux) or `Cmd + S` (Mac) to save
7. Visit any MangaPark domain — the script runs automatically

### Firefox for Android

1. Install **Firefox** from the Play Store
2. Tap the menu (three dots) → **Add-ons** → **Tampermonkey**
3. Tap **Add to Firefox** and confirm
4. Tap the Tampermonkey icon → **Create a new script**
5. Paste the script and save
6. Browse MangaPark as normal

### Kiwi Browser (Android)

1. Install **Kiwi Browser** from the Play Store
2. Navigate to the [Chrome Web Store](https://chrome.google.com/webstore)
3. Search for and install **Tampermonkey**
4. Follow the same steps as desktop installation

### iOS (Safari with Userscripts)

1. Install **Userscripts** from the App Store (free)
2. Open **Settings** → **Safari** → **Extensions**
3. Enable **Userscripts** and grant permissions
4. Open Safari and tap the **puzzle piece** icon in the address bar
5. Tap **Userscripts** → **Create new script**
6. Paste the script and save

### iOS (Orion Browser)

1. Install **Orion Browser** from the App Store
2. Go to Settings → Extensions
3. Install Tampermonkey from the extension gallery
4. Follow the same steps as desktop installation

---

## Manual Fallback (Bookmarklet)

If you can't install extensions, create a bookmarklet:

1. Create a new bookmark in your browser
2. Name it something like "Fix MangaPark"
3. Replace the URL with:

```javascript
javascript:(function(){const SERVERS=['s01','s02','s03','s04','s05','s06','s07','s08','s09','s10'];document.querySelectorAll('img').forEach(img=>{if(/https:\/\/s[0-9]{2}/.test(img.src)){img.onerror=function(){const current=img.src.match(/s([0-9]{2})/)[1];const next=String(Number(current)%10+1).padStart(2,'0');img.src=img.src.replace(/s[0-9]{2}/,'s'+next)};img.src=img.src.replace(/s[0-9]{2}/,'s04')}})})();
```

4. Tap/click the bookmark when images aren't loading

> ⚠️ **Note:** The bookmarklet requires manual activation on each page and won't auto-cycle on errors as effectively as the full script.

---

## Troubleshooting

### Script isn't running

- Click the Tampermonkey icon on a MangaPark page — the script should be listed as active
- ensure Allow User Scripts is enabled in tampermonkey extensions
- Check that the script is enabled in the Tampermonkey dashboard
- Try refreshing the page

### Images still not loading

- Open browser DevTools (`F12`) and check the Console tab for `[MangaPark Fix]` messages
- If you see "All servers exhausted," the image may be unavailable on all servers
- Try a different MangaPark mirror domain

### Console shows no output

- Verify the `@match` patterns include the domain you're visiting
- Make sure the script was saved correctly
- Try reinstalling the script

---

## How It Works

1. On page load, the script attaches error handlers to all manga images
2. Images are initially redirected to the preferred server (s04)
3. If an image fails to load, the `error` event fires
4. The script tries the next untried server from the list (s01-s10)
5. This continues until a working server is found or all servers are exhausted
6. A MutationObserver watches for dynamically loaded images as you scroll

---

## License

MIT License — feel free to modify and distribute.

---

## Contributing

Found a new mirror domain? Open an issue or PR to add it to the `@match` list.
