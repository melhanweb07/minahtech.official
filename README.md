# MINAH TECH

A static, single-page React portfolio. Built with Vite, Tailwind CSS v4, Framer Motion, and Lucide. No backend, database, authentication, analytics, or runtime content API calls.

## Run And Build

```sh
npm install
npm run dev
npx tsc --noEmit
npm run build
npm run preview
```

The complete deployable site is in `dist/`. The existing Vite configuration bundles application code into the HTML; images and fonts remain optimized, locally served static files.

## Edit Content

| File                       | Content                                                                                  |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| `src/data/company.js`      | Company details, external logo, contact endpoint, WhatsApp URL, and social URLs          |
| `src/data/projects.js`     | Completed projects, categories, copy, image paths, supplied technologies, and live links |
| `src/data/services.js`     | Six services, descriptions, expandable details, and deliverables                         |
| `src/data/testimonials.js` | Client-approved reviews and optional video testimonials                                  |
| `src/data/types.ts`        | Content schema and video format definitions                                              |

Only projects with `completed: true` appear. Technology lists are intentionally empty where the company did not supply them. Missing live URLs are never fabricated: project details open instead. Optional `caseStudyUrl` displays a real case study link when supplied.

Set `company.logo` to `/logo/your-logo.svg` or an external image URL to replace the built-in mark. If the external image fails, the built-in mark is restored.

Social profiles were not supplied. The footer identifies them as forthcoming, without fake or dead links. Add each real URL in `company.socials` to make it a live external link.

## Project Imagery

The Swag Shopping Mall, Sahara Enterprises, and AIRONIX images are authentic captures of the exact supplied public URLs. The billing project capture shows its public sign-in page only; no client data or credentials are used.

Al-Wafa Interiors, NMF Global Services, and Growmore Edtechnologies use labeled illustrative photography, not fabricated project screenshots or claims about client premises. Both image alt text and the details dialog explain this. Replace the image path, alt text, and `imageType: 'screenshot'` when actual screenshots are approved. Optional `imageSmall` supplies a 700-pixel responsive variant. Source captures and photos are preserved outside the published image directory in `assets/source-images/`.

Photography credits (Pexels):

- Al-Wafa illustrative cover: Hello Pipcke, photo 20285350, https://www.pexels.com/photo/interior-design-of-living-room-20285350/
- NMF illustrative cover: Zulfugar Karimov, photo 33719779, https://www.pexels.com/photo/modern-building-with-green-foliage-contrast-33719779/
- Growmore illustrative cover: Marcus Lenk, photo 18587779, https://www.pexels.com/photo/modern-library-interior-18587779/

`scripts/capture-projects.mjs` can refresh public captures. `scripts/optimize-images.mjs` produces WebP images and smaller variants from the sources. Do not use generated mockups in place of real screenshots.

## Publish Genuine Testimonials

The review array is empty by design. A professional empty state appears until real reviews are added. Only reviews marked `approved: true`, with a client name and review text, are published. The following is a schema, not a testimonial:

```js
export const testimonials = [
  {
    id: "UNIQUE_ID",
    name: "CLIENT_APPROVED_NAME",
    company: "CLIENT_COMPANY",
    review: "EXACT_CLIENT_APPROVED_REVIEW",
    image: "/images/APPROVED_CLIENT_PHOTO.webp", // Optional.
    approved: false, // Change only after permission to publish.
    video: {
      // Omit the whole object for a text-only review.
      type: "mp4", // Or 'youtube' or 'vimeo'.
      url: "/videos/APPROVED_TESTIMONIAL.mp4",
      thumbnail: "/images/APPROVED_VIDEO_THUMBNAIL.webp",
      captions: "/videos/APPROVED_CAPTIONS.vtt", // Optional MP4 captions.
    },
  },
];
```

YouTube watch, short, and embed URLs and Vimeo video URLs are normalized to their official embeds. Videos load only when selected. MP4 supports native controls and WebVTT captions. Review text is available alongside the player. Dialogs have keyboard focus management, Escape dismissal, and scroll locking. Only use media you have permission to publish.

## Contact Form

By default, `company.formEndpoint` is empty. The form validates locally and opens an email draft containing the enquiry. The visitor must send it in their mail client. The page explicitly says the enquiry has not been sent, and provides an alternate mail link and a copy-details button. Nothing is stored locally or on a server by this site.

For direct submission, create a form in your own Formspree account, authorize your destination email, and set:

```js
formEndpoint: "https://formspree.io/f/YOUR_REAL_FORM_ID";
```

Submission uses `POST` with `FormData` and `Accept: application/json`. There is a 20-second timeout, loading state, validation, failure recovery, and success only after a successful HTTP response. Data goes to your chosen third-party provider, not a custom database. A compatible static form service can be substituted if it supports cross-origin multipart POST and successful 2xx responses. No API secret belongs in this public static site.

An actual provider account was not supplied, so live email delivery through Formspree must be verified after configuration. Automated tests use a stubbed endpoint; they do not submit real enquiries.

## Deployment

- Vercel: import the repository. `vercel.json` defines the build and output directory.
- Netlify: import the repository or deploy `dist/`. Build settings and cache headers are in `netlify.toml`.
- Firebase Hosting: run `npm run build`, select your Firebase project with the Firebase CLI, then run `firebase deploy --only hosting`. `firebase.json` serves only static files.

No client router or rewrite is needed: every navigation destination is a same-page anchor. Do not deploy source assets or the whole repository in place of `dist/`.

## SEO And Accessibility

The site includes self-hosted fonts, WebP project imagery, responsive image variants, semantic sections, accessible labels, form errors, reduced-motion support, focus-visible styles, a skip link, SVG and PNG favicons, an Open Graph image, Organization JSON-LD, `robots.txt`, and `sitemap.xml`.

If the domain or company details change, update `index.html`, `public/robots.txt`, `public/sitemap.xml`, and `src/data/company.js` together. Replace the OG image when changing the brand.

## Browser Checks

```sh
npx playwright install --with-deps chromium
npx playwright test
```

Tests cover project filters, dialogs, navigation, mobile overflow, service selection, required fields, email and phone validation, the honest email fallback, provider success/failure states, video/carousel fixtures, and automated axe accessibility checks. Test-only reviews are intercepted in the browser; they are never included in production data.
