
const setCookie = (res, key, value, expiration) => {
  res.cookie(key, value, {
    domain: process.env.COOKIE_DOMAIN,
    path: process.env.COOKIE_PATH,
    secure: true,
    httpOnly: true,
    expires: expiration,
    secret: process.env.COOKIE_SECRET
  })
}

module.exports = {
  setCookie
}