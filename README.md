# To My Lovely Lady

A premium, phone-first pink lily love-letter website built with plain HTML5, CSS3, and vanilla JavaScript. It opens as a tactile stationery envelope, unfolds into a continuous readable letter, supports optional music and personal memories, and ends with a quiet pink lily finale.

## Files

```text
love-letter-website/
├── index.html
├── style.css
├── script.js
├── README.md
├── app.config.ts
├── TODO.md
├── manus-routes.json
├── public/
│   └── manus-routes.json
└── assets/
    ├── our-song.mp3                 # Included default instrumental; replace if desired
    ├── lily-hero.webp               # Add your own optional hero lily image
    ├── lily-ending.webp             # Add your own optional ending lily image
    └── photos/
        └── Add-my-own-photos-here.txt
```

The project includes a working default instrumental track. The lily image files and personal photos remain optional; until you add them, the interface uses the built-in botanical SVG artwork and keeps the photo section hidden.

## Add your own assets

The included `assets/our-song.mp3` is a gentle romantic instrumental. You can replace it with another MP3 using the same filename. The player loops the track, starts at a quiet volume of `0.25`, attempts autoplay once, and also starts from the envelope interaction when a browser blocks audible autoplay.

The hero now uses the layered SVG lily as its primary artwork, with animated petals, veins, and bloom motion; the local photo asset is retained as an optional fallback. The finale uses the real local lily photo at `assets/lily-ending.webp`. You can replace either local file with another asset using the same filename. If an image is missing, the botanical SVG composition remains intact. For the optional memories section, copy the commented `<figure>` example in `index.html`, update its image path to `assets/photos/your-file.jpg`, and write a personal caption. The gallery appears only when at least one valid memory exists.

### Lily photo attribution

The bundled lily crops are adapted from [Pink Lily.JPG](https://commons.wikimedia.org/wiki/File:Pink_Lily.JPG) by Khalid Mahmood and [Pink Lily Lilium sp Flower Closeup 2511px.jpg](https://commons.wikimedia.org/wiki/File:Pink_Lily_Lilium_sp_Flower_Closeup_2511px.jpg) by Derek Ramsey. Both source files are offered under CC BY-SA 3.0; the crops were converted to WebP for this site. The original source pages contain the full license and attribution details.

## Run locally

Because this is a static site, no package installation is needed. From the project folder, run one of these commands:

```bash
python3 -m http.server 3000
```

Then open `http://localhost:3000`.

## Publish with GitHub and Vercel

1. Create a new GitHub repository.
2. Upload the contents of this folder, including the root `manus-routes.json`, `public/manus-routes.json`, and any personal assets you want to include.
3. In Vercel, choose **Add New Project**, import the repository, and deploy it with the default static settings. No build command is required.
4. If you add or change files later, commit and push them to GitHub; Vercel will redeploy automatically when the repository is connected.

The site uses only relative paths, so it works from the deployed root URL and does not require a backend, database, API key, or paid service.
