const express = require('express')
const { createSection, getSections, editSection, deleteSections } = require('../controllers/sectionController')
const router = express.Router()


router.post('/create',createSection)
router.get('/get-sections',getSections)
router.put('/edit-section',editSection)
router.delete('/delete-section/:id',deleteSections)


module.exports = router