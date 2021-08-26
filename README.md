# Next.js Cron
Cron jobs with [Github Actions](https://github.com/features/actions) for Next.js applications on Vercel▲

## Motivation
Since the Vercel platform is event-driven, therefore not maintaining a running server, you can't really schedule calls on your [API routes](https://nextjs.org/docs/api-routes/introduction) or [Serverless functions](https://vercel.com/docs/serverless-functions/introduction) in your Next.js application.
Although there are many pre-existing services that provide scheduled cron jobs, I ultimately decided that [Github Actions](https://github.com/features/actions) suits my needs the best, since it integrates nicely with any project that already lives on Github, plus it's completely free.

## Get started
All Github Actions reside in the directory `.github/workflows/` of your repository and are written in [YAML](https://yaml.org/).

 [`.github/workflows/starter.yaml`](https://github.com/baulml/nextjs-cron/blob/master/.github/workflows/starter.yaml) is the most basic workflow to help you get started with Actions.
 
## Scheduled tasks
With [Scheduled events](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#scheduled-events) you can execute tasks at specified intervals. For instance, the provided workflow `.github/workflows/scheduled.yaml` executes a HTTP request with curl every 60 minutes.

```yaml
name: Hourly cron job
on:
  schedule:
    - cron: '*/60 * * * *'
jobs:
  cron:
    runs-on: ubuntu-latest
    steps:
      - name: Hourly cron job
        run: |
          curl --request POST \
          --url 'https://example.com/api/task' \
          --header 'Authorization: Bearer ${{ secrets.ACTION_KEY }}'
```
If you are having trouble writing cron schedule expressions, take a look at [crontab guru](https://crontab.guru/).

## Next.js API routes

[API routes](https://nextjs.org/docs/api-routes/introduction) and [Serverless functions](https://vercel.com/docs/serverless-functions/introduction) provide a straightforward solution to building your API with Next.js on Vercel.
Any file inside the folder `pages/api` is mapped to `/api/*` and will be treated as an API endpoint instead of a `page`.

If you are using serverless functions, regardless of the [Runtime](https://vercel.com/docs/runtimes), you would need to put the files into the `/api/` directory at your project's root.

### Authorization flow
To securely trigger API routes and serverless functions with Github Actions, you need to provide an authorization key in the header of your API call, which, when executed, gets compared to a corresponding key in your Next.js application.

You can achieve this by adding [Encrypted Secrets](https://docs.github.com/en/actions/reference/encrypted-secrets) to your Github repository and passing them in the header of your HTTP request, like shown in the previous code snippet.
Along with adding the key to your Github repository, you also need to access it within your Next.js application, preferably through [Environment Variables](https://nextjs.org/docs/basic-features/environment-variables).

The example `pages/api/example.js` implements this authorization flow.

```js
export default function handler(req, res) {

  const { APP_KEY } = process.env;
  const { ACTION_KEY } = req.headers.authorization.split(" ")[1];

  try {
    if (ACTION_KEY === APP_KEY) {
      // Process the POST request
      res.status(200).json({ success: 'true' })
    } else {
      res.status(401)
    }
  } catch(err) {
    res.status(500)
  }
}
```

Use `pages/api/example.ts` for Typescript.

```ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req:NextApiRequest, res:NextApiResponse) {

  const { APP_KEY } = process.env;
  const { ACTION_KEY } = req.headers.authorization.split(" ")[1];

  try {
    if (ACTION_KEY === APP_KEY) {
      // Process the POST request
      res.status(200).json({ success: 'true' })
    } else {
      res.status(401)
    }
  } catch(err) {
    res.status(500)
  }
}
```
