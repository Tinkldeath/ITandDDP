const express = require('express');
const router = express.Router();
const path = require('path');

//GET: http://localhost:port/api/images/:id
router.get('/images/:id', (req, res) => {
    const id = req.params.id;
    const filePath = path.resolve(`src/uploads/${id}`);
    res.sendFile(filePath);
});

module.exports = router;