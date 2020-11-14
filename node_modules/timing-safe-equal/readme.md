timing-safe-equal
===

provides a browserfiable [crypto.timingSafeEquals](https://nodejs.org/dist/latest-v6.x/docs/api/crypto.html#crypto_crypto_timingsafeequal_a_b) that, when used in the browser, gives a shim and when used in node, gives you the native one if available, and if not the shim.
