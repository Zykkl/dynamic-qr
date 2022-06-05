const express = require('express')
require('dotenv').config()
const { Deta } = require('deta')

const app = express()
const port = 3000
const deta = Deta(process.env.PROJECT_KEY)
const db = deta.Base('jugi')

app.get('/', async (req, res) => {
    res.send('Redirecting...')
    const link = await db.get('link')
    res.redirect('http://' + link.link)
})

app.get('/set', async (req, res) => {
    const { link } = req.query
    await db.put({ link: link }, 'link')
    await res.redirect('/ok')
})

app.get('/ok', async (req, res) => {
    const link = await db.get('link')
    await res.send('Set link to ' +  link.link)
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = app;