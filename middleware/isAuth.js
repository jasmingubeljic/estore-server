const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    if (!req.get('Authorization')) {
       res.status(401).json({messages: "Not authenticated!"})
    }
    const token = req.get('Authorization').split(' ')[1]
    let decodedToken


    try {
        decodedToken = jwt.verify(token, 'secretklsajdfalskjdf')
    } catch (err) {
        res.status(500).json({err})
    }

    if (!decodedToken) {
        res.status(401).json({messages: ["Not authenticated!"]})
    }
    
    next()
 }