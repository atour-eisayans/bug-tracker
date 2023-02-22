const { Router } = require('express');

module.exports = Router().get('/health-check', (req, res) =>
    res.sendStatus(200)
);
