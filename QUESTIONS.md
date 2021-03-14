# Technical Questions

## What would you add to your solution if you had more time?

- Calculate totals and add background colors to rows
- Improved error handling
- Unit tests for the service
- E2E tests for the component using Cypress
- Show some love to the CSS, make it look nice and make it responsive
- Allow the user to change the grouping
- Calculate the spread between buy and sell orders
- Set up CI

## What would you have done differently if you knew this page was going to get thousands of views per second vs per week?

- Added throttling (only update the table 10 times per second), even if the data updates faster
- Think of a way to update one group at a time instead of the whole array of orders

## What was the most useful feature that was added to the latest version of your chosen language?

In ES2019 `Array.flat()`, `Array.flatMap()` and the `Object.fromEntries()`. The later might be useful in this
application to create an Object from the orders:

```typescript
type price = number;
type size = number;

const orders: [price, size][] = [
  [123, 456],
  [456, 789],
];

const orderObject: Record<price, size> = Object.fromEntries(order);
// { "123": 456, "456": 789 }
```

Previously, ES2018 brought us awesome spread operator `...`, `Promise.finally()` and a long awaited (no pun intended)
way to loop over asyc promises `for await (foo of promiseArray)`. I use all of these regularly, although the promise
stuff mostly in the node.js backend.

Typescript 4.1 brought some neat things, including string literal types, that I could have used instead of enums in
this project

```typescript
export type BookSubscriptionEvent = 'subscribe' | 'unsubscribe';
```

I prefer to use enums though, because they are easier to refactor and extend.

## How would you track down a performance issue in production? Have you ever had to do this?

I had to deal with memory leaks in Angular and especially AngularJS applications in the past. Google Chrome's developer
tools offer the extremely helpful memory profiles. Take a snapshot and see what's most expensive. In AngularJS it
was usually 2-way-binding, in Angular the biggest issue is the default `ChangeDetectionStrategy` that checks for
changes for all values instead of only the ones that changed.

## Can you describe common security concerns to consider for a frontend developer?

By far the biggest concern is Cross Site Scripting. Some common tips to prevent it:

- Sanitize every input and parameter
- Use [trusted types](https://web.dev/trusted-types)
- Add an extremely strict CSP
- Never use `innerHTML`

Another huge problem (not just in the front end) are dependencies with an immense risk of
[supply chain attacks](https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610). There's no bullet proof
solution, but you can

- Don't use 3rd party packages for things that you can easily code yourself. Don't be lazy.
- Fix dependency versions in the package.json
- Review dependencies (and their dependencies)
- Use a repository manager like artifactory to only allow approved packages

More generally, security is also a mindset that needs to be at the core of an organization, especially in the crypto
world. Certain things should be self-evident, like commit signing, peer code reviews, dependency reviews, keeping your signing key
in cold storage, using a password manager etc.

## How would you improve the API that you just used?

- Add better documentation about grouping
- Add throttling (maybe a parameter that defines the debounce time between updates)
- Provide typescript types in a public package
