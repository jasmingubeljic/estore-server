const express = require('express')
const cors = require('cors')
const shopRoutes = require('./routes/shop')

const app = express()
const port = process.env.PORT || 3001

app.use(cors());
app.use(express.json())

app.use(shopRoutes)


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})