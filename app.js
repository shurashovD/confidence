const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const path = require('path')

const log = require('./handlers/logger')
const auth = require('./middlewares/auth.middleware')
const dictionaryModel = require('./models/DictionaryModel')

const app = express()

const start = async () => {
    if ( process.env.LEVEL === 'develop' ) {
        log.setLevel('debug')
    }
    const PORT = config.get('PORT') || 5000
    try {
        await mongoose.connect(config.get('mongoURI'), {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        global.dictionary = await dictionaryModel.find()
        app.listen(PORT, () => {
            if ( process.env.LEVEL === 'develop' ) {
                log.debug(`Server is running on PORT ${PORT}...`)
            }
            else {
                log.info(`Server is running on PORT ${PORT}...`)
            }
        })
    }
    catch (e) {
        log.error(e)
    }
}

app.use('/api/auth', require('./routes/auth.routes'))

app.use('/api/dictionary', require('./routes/dictionary.router'))

app.use('/api/users', auth, require('./routes/user.routes'))

app.use('/api/competitions', auth, require('./routes/competition.routes'))

app.use('/api/masters', auth, require('./routes/master.routes'))

app.use('/api/notes', auth, require('./routes/note.routes'))

if ( process.env.LEVEL === 'production' ) {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))
}

start()