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
