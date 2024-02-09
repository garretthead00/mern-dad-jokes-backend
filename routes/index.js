const express = require("express");
const router = express.Router();
const authRoutes = require('./authRoutes')
const jokesRoutes = require('./jokesRoutes')

router.use('/auth', authRoutes)
router.use('/jokes', jokesRoutes)

module.exports = router;
