const log = require('../handlers/logger')

const auth = (req, res, next) => {
    try {
        const clientId = req.headers.authorization?.split(' ')[1]
        const acceptLanguage = req.headers['Accept-language']
        req.clientId = clientId
    }
    catch (e) {
        log.error(e)
    }
    return next()
}

module.exports = auth