const router = require('express').Router()
const md5 = require('md5')
const parser = require('body-parser')

const User = require('../models/UserModel')
const CompetitionModel = require('../models/CompetitionModel')
const log = require('../handlers/logger')

const COMP_STATUS = require('../types/competitionStatuses')

const refereeRoles = require('../types/refereeRoles')

router.use('/login', parser.json(), async (req, res) => {
    try {
        const acceptLanguage = (req.headers['accept-language'])
        const {login, pass} = req.body
        const user = await User.findOne({login, pass: md5(pass)}).exec()
        if (user) {
            if ( login === 'ADMIN' ) {
                return res.json(user)
            }
            const competition = await CompetitionModel.findOne({ status: COMP_STATUS.started })
            if ( competition ) {
                const role = competition.refereeSetting.find(({referees}) => referees.some(({refereeId}) => user._id.toString() === refereeId.toString()))
                    ?.referees.find(({refereeId}) => user._id.toString() === refereeId.toString()).role
                if ( role ) {
                    return res.json({...user._doc, role})
                }

                const screen = competition.screens.find(({screenId}) => screenId.toString() === user._id.toString())
                if ( screen ) {
                    return res.json({...user._doc, role: refereeRoles.screen})
                }

                const enMessage = global.dictionary.find(({lang, key}) => (lang === 'EN' && key === 'nonAccessCurrentCompetition')).phrase
                const message = global.dictionary.find(({lang, key}) => (lang === acceptLanguage && key === 'nonAccessCurrentCompetition'))?.phrase ?? enMessage
                return res.status(400).json({ message })
            }
            const enMessage = global.dictionary.find(({lang, key}) => (lang === 'EN' && key === 'nonStartedCompetition')).phrase
            const message = global.dictionary.find(({lang, key}) => (lang === acceptLanguage && key === 'nonStartedCompetition'))?.phrase ?? enMessage
            return res.status(400).json({ message })
        }
        else {
            const enMessage = global.dictionary.find(({lang, key}) => (lang === 'EN' && key === 'invalidCredentails')).phrase
            const message = global.dictionary.find(({lang, key}) => (lang === acceptLanguage && key === 'invalidCredentails'))?.phrase ?? enMessage
            return res.status(401).json({ message })
        }
    }
    catch (e) {
        log.error(e)
        return res.status(500).json({ message: 'SERVER ERROR' })
    }
})

module.exports = router