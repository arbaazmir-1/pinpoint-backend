const express = require('express')
const { createLink, deleteLink, editLink } = require('../controllers/linkController')
const router = express.Router()



router.post('/create-link',createLink)
router.delete('/delete-link/:sectionID/:id',deleteLink)
router.put('/edit-link',editLink)

module.exports = router