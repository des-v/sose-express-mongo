const express = require('express')
const User = require('../models/user')
const Photo = require('../models/photo')

const router = express.Router()

/* GET users listing. */
router.get('/', async (req, res) => {
	const query = {}
	res.send(await User.find(query).catch(error => console.log('Users not found, error: ', error)))
})

/* GET initialize */
router.get('/initialize', async (req, res) => {
	const mihri = await User.create({ name: 'mihri', age: 35 })
	const armagan = await User.create({ name: 'armagan', age: 36 })

	const steve = await User.create({ name: 'steve', age: 21 })
	steve.bio = 'An awesome hacker who has seen it all, and now sharing them all with you.'

	const berlinPhoto = await Photo.create({ filename: 'berlin.jpg' })
	const munichPhoto = await Photo.create({ filename: 'munich.jpg' })

	await steve.addPhoto(berlinPhoto)
	await steve.addPhoto(munichPhoto)

	await armagan.likePhoto(berlinPhoto)
	await mihri.likePhoto(berlinPhoto)

	console.log(steve)
	res.sendStatus(200)
})

/* GET user by ID */
router.get('/:userId', async (req, res) => {
	const user = await User.findById(req.params.userId).catch(error => console.log('User ID not found, error: ', error))

	if (user) res.render('User: ', { user })
	else res.sendStatus(404)
})

module.exports = router
