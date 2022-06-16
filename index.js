const express = require('express')
require('dotenv').config()
const { Deta } = require('deta')

const app = express()
const port = 3000
const deta = Deta(process.env.PROJECT_KEY)
const db = deta.Base('jugi')

app.use(express.json())

app.get('/', async (req, res) => {
    const link = await db.get('link')
    res.redirect('http://' + link.link)
})

app.patch('/set', async (req, res) => {
    const auth = req.headers.authorization
    if (auth !== process.env.KEY) {
        res.status(401).send('Unauthorized')
    } else {
        if (req.body.link === undefined) {
            res.status(400).send('Bad request')
        } else {
        const link = req.body.link
        await db.put({ link: link }, 'link')
        res.send('Link set to ' + link)
    }
}
})

app.get('/get', async (req, res) => {
    const link = await db.get('link')
    await res.status(200).send({ link: link.link })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = app;