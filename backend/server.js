const express = require('express')
require('dotenv').config();
require('./db/conn')

const app = express();
app.use(express.json())

const authRoutes = (require('./routes/auth'))
const blogRoutes = (require('./routes/blog'))
const userRoutes = (require('./routes/user'))

const port = process.env.PORT || 8000;


app.use("/api",authRoutes)
app.use("/api",blogRoutes)
app.use("/api",userRoutes)

app.listen(port, () => {
    console.log(`App is running on port ${port}`)
})

