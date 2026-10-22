# Static reports in iframes (CloudFront)

Some of the reports under `/reports` are static HTML files hosted in S3 and served through AWS CloudFront. NVA shows them inside an iframe, so they look like part of the app.

## Reports

The report names in the URL are in English, while the file names on CloudFront are in Norwegian. The mapping is defined in `staticReportFileNames` in `src/utils/urlPaths.ts`.

| Route                      | File on CloudFront      | Translation key (menu and page title)     |
| -------------------------- | ----------------------- | ----------------------------------------- |
| `/reports/nvi-reporting`   | `nvi-rapportering.html` | `search.reports.nvi_reporting`            |
| `/reports/gender-and-age`  | `kjonnsbalanse.html`    | `search.reports.gender_and_age`           |
| `/reports/ten-year-series` | `tiaarsserien.html`     | `search.reports.ten_year_series`          |
| `/reports/nvi-categories`  | `nvi-kategoriar.html`   | `search.reports.nvi_categories_over_time` |

Only names listed in `staticReportFileNames` can be loaded. This means the iframe can never be pointed at an arbitrary URL or file by changing the address in the browser.

### Route precedence

The route `/reports/:reportName` sits next to the fixed report routes (`/reports/nvi`, `/reports/clinical-treatment-studies`). React Router always prefers fixed paths over dynamic ones, so those pages are not affected. A static report must therefore never be given the same name as an existing fixed route.

## Language

The app's current language is sent to the report as the `lang` URL parameter, as a two-letter ISO 639-1 code (`nb`, `nn` or `en`). It is read with `useAppLanguageInIso6391Format()`.

When the user switches language in the header, the iframe URL changes and the report is reloaded in the new language. Any state inside the report (filters, scroll position) is reset.

## Hosting

Each environment has its own S3 bucket and CloudFront distribution, located in that environment's AWS account. The S3 bucket is the origin of the CloudFront distribution.

Each release of the static reports is uploaded to a new folder in the S3 bucket, named after the release date (`yyyy-mm-dd`):

```
<S3 bucket>
├── 2026-10-22/
│   ├── nvi-rapportering.html
│   ├── kjonnsbalanse.html
│   ├── tiaarsserien.html
│   └── nvi-kategoriar.html
└── <next release>/
    └── ...
```

This is why `VITE_STATIC_REPORTS_URL` includes the release folder in addition to the CloudFront domain (see below). Older releases stay in the bucket, which makes it possible to switch back to a previous release by changing the environment variable.

## Configuration

### Environment variable

The base URL for the files is set with `VITE_STATIC_REPORTS_URL` and read as `STATIC_REPORTS_URL` in `src/utils/constants.ts`. It consists of the CloudFront domain followed by the release folder:

```
VITE_STATIC_REPORTS_URL=https://<distribution>.cloudfront.net/<yyyy-mm-dd>
```

- It must include the protocol and host. Without `https://` the browser treats the value as a path on NVA's own domain.
- It must not end with a slash.
- It must be set for each environment in AWS Amplify. If it is missing, all static reports show the _Not found_ page.
- Vite inserts environment variables into the code at build time. After changing the variable in Amplify, the app must be rebuilt and redeployed before the change takes effect.

### Publishing a new release

1. Upload the files to a new `yyyy-mm-dd` folder in the S3 bucket of the environment.
2. Update `VITE_STATIC_REPORTS_URL` in Amplify for that environment to point to the new folder.
3. Redeploy the app in Amplify.

### Content Security Policy

The browser only allows iframes from domains listed in `frame-src` in the `Content-Security-Policy` header, which is defined in `customHttp.yml`. The CloudFront domains are listed explicitly (e.g. `1234abcd.cloudfront.net`) rather than with the wildcard `*.cloudfront.net`, since anyone can create a CloudFront distribution.

`customHttp.yml` is shared by all environments and does not support environment variables, so the domains of all environments must be listed. The domain for each environment can be looked up in CloudFront in that environment's AWS account. Only the domain is needed here, not the release folder. If a custom domain is put in front of CloudFront, that domain must be added to `frame-src` as well.

The CloudFront distribution must also allow being framed by NVA. If it sends an `X-Frame-Options` header or a CSP `frame-ancestors` directive, these must allow the NVA domains.

## Adding a new report

1. Upload the HTML file to the S3 bucket in every environment, as part of a release folder (see [Publishing a new release](#publishing-a-new-release)).
2. Add the report to `staticReportFileNames` in `src/utils/urlPaths.ts`: `'english-route-name': 'file-name-without-html'`.
3. Add the page title to `titles` in `src/pages/reports/StaticReport.tsx`. TypeScript reports an error until this is done.
4. Add a `SelectableButton` to the _Reports_ menu in `src/pages/dashboard/HomePage.tsx`, using `getStaticReportPath('english-route-name')`.
5. Add a data test id in `src/utils/dataTestIds.ts`.
6. Add the translation key in `nb`, `nn` and `en`.

## Local development

To test the iframe locally, the HTML files can be served from a local server instead of CloudFront:

1. Download the HTML files from a release folder in the S3 bucket (see [Hosting](#hosting)) to a folder on your computer.
2. Serve the folder on a local port. Any static file server will do, for example the [serve](https://www.npmjs.com/package/serve) package:

   ```sh
   npx serve <folder with the HTML files> -p 4000
   ```

3. Add the environment variable to your own `.env` file, pointing to the local server:

   ```
   VITE_STATIC_REPORTS_URL=http://localhost:4000
   ```

4. Restart `npm start`, since Vite only reads `.env` at startup.

The CSP in `customHttp.yml` is only applied by Amplify, so it does not affect local development.

Language selection does not currently work locally, but it works in the deployed environments.
