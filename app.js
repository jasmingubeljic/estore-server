const express = require('express')
const cors = require('cors')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin')
const sequelize = require('./util/database')

const app = express()
const port = process.env.PORT || 3001

const User = require('./models/user')

app.use(cors());
app.use(express.json())

app.use(async (req, res, next) => {
    console.log('what is this')
    const user = await User.findByPk(1)
    if (user === null) {
        console.log('not found')
        User.create({
            name: "Edo",
            email: "edo@edo.com",
            password: "somepassword",
            role: 'admin'
        })
    } else {
        console.log('user', user.dataValues)
    }
    next()
})

app.use('/auth', authRoutes)
app.use(shopRoutes)
app.use('/admin', adminRoutes)

sequelize
    // .sync({ force: true })
    .sync()
    .then(
        app.listen(port, () => {
            console.log('Server is up on port ' + port)
        })
    )
    .catch(err => console.log(err))

