const CompetitionModel = require('../models/CompetitionModel')
const NoteModel = require('../models/NoteModel')
const COMPETITION_STATUSES = require('../types/competitionStatuses')

const router = require('express').Router()

router.get('/', async (req, res) => {
    try {
        const formatter = Intl.DateTimeFormat('en', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })

        const competitions = await CompetitionModel.find({ status: COMPETITION_STATUSES.published }).sort([['competitionDate.to', -1]])
            .then(doc => doc.map(({ _id, competitionName, competitionPlace, competitionDate }) => {
                const from = formatter.format(new Date(competitionDate.from))
                const to = formatter.format(new Date(competitionDate.to))
                return { competitionName, competitionPlace, id: _id.toString(), from, to }
            }))
        return res.render('home', { competitions, title: 'Название' })
    }
    catch (e) {
        console.log(e)
        return res.status(500).end()
    }
})

router.get('/:key/:id', async (req, res) => {
    try {
        const {id, key} = req.params
        const competition = await CompetitionModel.findById(id)
        const notes = await NoteModel.find({ competitionId: id, completed: true, category: key }).populate([
            { path: 'master' },
            { path: 'scores', populate: { path: 'refereeId' } }
        ])
        const result = notes.filter(({ master }) => !!master?.name).map(note => {
            const name = note.master.name
            const referees = note.scores.map((item) => {
                const name = item.refereeId?.name || 'Судья'
                const total = item.refereeScores.reduce((total, {value}) => total + value, 0)
                return { name, total }
            })
            const total = referees.reduce((sum, {total}) => sum + total, 0)
            const id = note._id.toString()
            return { id, name, total, referees }
        }).sort((a, b) => b.total - a.total)
        let categoryTitle = 'Microblading'
        if ( key === 'feathering' ) categoryTitle = 'Feathering'
        if ( key === 'lips' ) categoryTitle = 'Lipstick effect'
        if ( key === 'arrow' ) categoryTitle = 'An arrow with a procrastination of the interstitial space'
        if ( key === 'hairTechnology' ) categoryTitle = 'Hair technology'

        return res.render('result', { title: `${competition.competitionName} ${categoryTitle}`, result  })
    }
    catch (e) {
        console.log(e)
        return res.status(500).end()
    }
})

module.exports = router