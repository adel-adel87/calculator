# Utility Calculator Web App

Responsive web application for calculating monthly electricity and water costs.

## Fixed tariffs

- T1: 11.43 ₽/кВт·ч
- T2: 4.15 ₽/кВт·ч
- T3: 8.00 ₽/кВт·ч
- Cold water: 67.77 ₽/м³
- Hot water: 317.71 ₽/м³

## Run locally

Open `index.html` directly in a browser, or use a local static server.

Example with Python:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## GitHub Pages

1. Push all files to the root of a GitHub repository.
2. Open repository **Settings**.
3. Go to **Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`.
6. Save.

The site will be published at a GitHub Pages URL.
