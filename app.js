const express = require('express')
const cors = require('cors')
const shopRoutes = require('./routes/shop')
const sequelize = require('./util/database')

const app = express()
const port = process.env.PORT || 3001

const User = require('./models/user')

app.use(cors());
app.use(express.json())

app.use(async (req, res, next) => {
    const user = await User.findByPk(1)
    if (user === null) {
        console.log('not found')
        User.create({
            name: "Edo",
            email: "edo@edo.com",
            password: "somepassword"
        })
    } else {
        console.log('user', user.dataValues)
    }
    next()
})

app.use(shopRoutes)

sequelize
    // .sync({ force: true })
    .sync()
    .then(
        app.listen(port, () => {
            console.log('Server is up on port ' + port)
        })
    )
    .catch(err => console.log(err))

