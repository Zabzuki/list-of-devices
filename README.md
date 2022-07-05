## List of devices

This is a simplified example of combining data from multiple sources which each
require an API call.

The user of a web application wants to see a list of devices for quick access,
this list should be comprised of devices the user has marked as a favorite in
the past (available via the data function `getFavoritedDevices()` method), and
of those devices that they have recently visited (available via the data
function `getLastAccessDevices()` method).

Both methods return promises and must be called in parallel for UI performance
reasons.

More specifically, implement the
[`getMostRecentDevices()`](./getMostRecentDevices.ts) method so that it returns
a function that takes the user and the number of required device names as an
argument and returns a list of device names. Start with the user's favorited
devices and if there are not enough favorited devices, fill up the list with the
last access device names.

The order of the names must be the same as they are returned by calling the data
functions.

The same device name must not appear multiple times.

The list should only be returned if there are sufficient items to display
(otherwise it will not be shown on the UI to declutter it), otherwise throw and
`UnprocessableError` error.

## Architecture

Everything is wrapped from

```JavaScript
try {
    //functionality
} catch {
    //error
}
```

where in `try` I get all the devices at the same time even if there is something wrong in the process with the `allSettled` and returning results in an array of both favorite and last access devices. If any of the devices was rejected error returned, otherwise I am adding the `names` of both favorites and last access devices (that their status is `fulfilled`), in an array (`allDeviceNames`) with the usage of the spread operator. Then the double existing values are excluded with the usage of `Set()` method and returning it sliced from `(0,n)`. In case that the Set's length is smaller than n, we get an `Error`. Finally the `catch` throws the `UnprocessableError` that was given.
