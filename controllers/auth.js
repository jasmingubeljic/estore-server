const { query, validationResult } = require('express-validator')

module.exports.login = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({"messages": errors})
    }
    res.status(200).json({"message": "admin login controller"}) 
}