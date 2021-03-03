# nextjs-cron
Cron jobs with [Github Actions](https://github.com/features/actions) for Next.js applications on Vercel▲

## Motivation
Since the Vercel platform is event-driven, therefore not maintaining a running server, you can't really trigger scheduled [API routes](https://nextjs.org/docs/api-routes/introduction) or [Serverless functions](https://vercel.com/docs/serverless-functions/introduction) in your Next.js application.
Although there are many pre-existing services that provide scheduled cron jobs, I ultimately decided that [Github Actions](https://github.com/features/actions) suits my needs the best, due to being completely free, plus it integrates nicely to any project that already lives on Github.

## Get started
All Github Actions reside in the directory `.github/workflows/` of your repository and are written in [YAML](https://yaml.org/).

 `.github/workflows/starter.yaml` is the most basic workflow to help you get started with Actions.
```yaml
name: Cron job

# Controls when the action will run. 
on:
  # Triggers the workflow on push or pull request events but only for the main branch
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains a single job called "build"
  build:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest

    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - uses: actions/checkout@v2

      # Runs a single command using the runners shell
      - name: Run a one-line script
        run: echo Hello, world!

      # Runs a set of commands using the runners shell
      - name: Run a multi-line script
        run: |
          echo Add other actions to build,
          echo test, and deploy your project.
```
## Scheduled tasks
With the schedule option in the workflow `.github/workflows/scheduled.yaml` you can execute tasks at specified intervals. For instance, this example executes a HTTP request with curl every 60 minutes.

```yaml
name: hourly-cron-job
on:
  schedule:
    - cron: '*/60 * * * *'
jobs:
  cron:
    runs-on: ubuntu-latest
    steps:
      - name: hourly-cron-job
        run: |
          curl --request POST \
          --url 'https://example.com/api/task' \
          --header 'Authorization: Bearer ${{ secrets.ACTION_KEY }}'
```
If you are having trouble writing cron schedule expressions, take a look at [crontab guru](https://crontab.guru/).

## Next.js API routes

[API routes](https://nextjs.org/docs/api-routes/introduction) and [Serverless functions](https://vercel.com/docs/serverless-functions/introduction) provide a straightforward solution to building your **API** with Next.js on Vercel.

Any file inside the folder `pages/api` is mapped to `/api/*` and will be treated as an API endpoint instead of a `page`. They are server-side only bundles and won't increase your client-side bundle size.

### Authorization flow
To securely trigger API routes and Serverless functions with Github Actions, you need to provide some sort of Authorization key in the header of your API call, which, when executed, gets compared to a corresponding key in your Next.js application.

You can achieve this by adding [Encrypted Secrets](https://docs.github.com/en/actions/reference/encrypted-secrets) to your Github repository and passing them in the header of your HTTP request, like shown in the previous section.
Along with adding the key to your Github repository, you also need to access it within your Next.js application, preferably through [Environment Variables](https://nextjs.org/docs/basic-features/environment-variables).

The example in `pages/api/example.js` implements this authorization flow.

```js
export default function handler(req, res) {

  const { APP_KEY } = process.env;
  const { ACTION_KEY } = req.headers.authorization.split(" ")[1];
  
  if (ACTION_KEY === APP_KEY) {
    // Process the POST request
    res.status(200).json({ success: 'true' })
  }
}
```

## Real-world applications
If you are aware of any open source Next.js projects that already utilize Github Actions to trigger scheduled API routes, please consider adding them to this subsection by creating a pull request.
