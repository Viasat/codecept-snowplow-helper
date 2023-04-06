# Codecept-snowplow-helper

This helper integrates [CodeceptJS](https://codecept.io/) and [Snowplow](https://snowplow.io). It includes steps to check correctness of your [Snowplow](https://snowplow.io) events, tested against a [Snowplow-micro](https://docs.snowplow.io/docs/understanding-your-pipeline/what-is-snowplow-micro/) instance running in the background.


## Installation

```
npm install --save-dev @viasat/codeceptjs-snowplow-helper
```

## How to use it

On the `helpers` section of your [CodeceptJS](https://codecept.io/) file, indicate:

```
Snowplow: {
      require: "codeceptjs-snowplow-helper",
      endpoint: "http://localhost:9090",
    },
```

### Options

- `require`: imports the plugin
- `endpoint`: Snowplow micro's base URL

## Usage example

On your test suite, use assertions like:

```
Feature("Testing Snowplow events")

Before(({I}) => {
    I.resetAllEvents()
})

Scenario("Records basic clicks", () => {
    I.click("on my fancy button")
    I.dontSeeBadEvents()
})
```

## Contributing

This project implements a few github workflows:

1. On PR updates: it runs unit tests and block merges if they don't pass.
2. On PR merges to main:
   - it calculates the new version from [conventional commits](https://www.npmjs.com/package/semantic-release)
   - it updates the repo tags
   - it creates a new release
   - it publishes the new version for public use.

We are glad to incorporate your ideas too, so if you want to contribute: open a PR. When it gets approved and tested, just press the green button
and see your code shipped!
