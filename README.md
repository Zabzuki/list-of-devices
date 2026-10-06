# list-of-devices

My TypeScript solution to a coding challenge: build a single, de-duplicated list
of device names by combining two independent async data sources.

## The problem

A UI wants a short list of devices for quick access: the user's **favorited**
devices first, topped up with their **recently accessed** devices. Two data
functions each return a `Promise<Device[]>` and must be called **in parallel**.

Implement `getMostRecentDevices()` so it returns a function
`(user, n) => Promise<string[]>` that:

- starts with favorited device names, then fills up with last-accessed names;
- preserves the order returned by the data functions;
- never repeats a device name;
- resolves as long as either source succeeds; and
- rejects with an `UnprocessableError` if fewer than `n` names are available, or
  if both sources fail.

```ts
getMostRecentDevices({ getFavoritedDevices, getLastAccessDevices })(user, n): Promise<string[]>
```

## My approach

- Call both sources with a single `Promise.allSettled`, so each is invoked
  exactly once and a failure in one does not abort the other.
- If **both** settle as `rejected`, throw.
- Take the `fulfilled` results (treating a rejected source as an empty list),
  map each device to its `name`, and concatenate favorited-then-last-accessed.
- De-duplicate while preserving order with `new Set(...)`.
- If the unique list has fewer than `n` names, throw; otherwise return the first
  `n`.
- All failure paths surface as a single `UnprocessableError("Not enough data")`.

The implementation lives in
[`getMostRecentDevices.ts`](./getMostRecentDevices.ts); the behaviour is pinned by
[`getMostRecentDevices.spec.ts`](./getMostRecentDevices.spec.ts), which also
asserts each source is called only once.

## Run the tests

```bash
npm install
npm test
```

**Built with:** TypeScript, Jest and ts-jest.

## About

My solution to a take-home coding challenge.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file.
