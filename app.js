const path = require('path')
const express = require('express')
const cors = require('cors')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin')
const sequelize = require('./util/database')
const bcrypt = require('bcrypt')
const multer = require('multer')

const app = express()
const port = process.env.PORT || 3001

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const User = require('./models/user')

app.use(cors());
app.use(express.json())
app.use( multer({storage: fileStorage, fileFilter: fileFilter}).single('image') )

app.use('/images', express.static(path.join(__dirname, 'images')))

app.use(async (req, res, next) => {
    console.log('what is this')
    const user = await User.findByPk(1)
    if (user === null) {
        // User not found

        const hashedPassword = await bcrypt.hash('edopassword', 12)

        User.create({
            name: "Edo",
            email: "edo@edo.com",
            password: hashedPassword,
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

