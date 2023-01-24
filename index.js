const express = require('express')
const app = express()
const cors = require('cors')
const { registerUser, checkCredentials, getUsers, reportQuery } = require('./queries.js')
const jwt = require("jsonwebtoken")

app.listen(3000, console.log("SERVER ONNNNN =)!!!"))
app.use(cors())
app.use(express.json())

app.post("/usuarios", reportQuery, async (req, res) => {
    try {
        const user = req.body
        await registerUser(user)
        res.send("User Created =)!!!")
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        await checkCredentials(email, password)
        const token = jwt.sign({ email }, "az_AZ")
        res.send(token)
    } catch (error) {
        console.log(error)
        res.status(error.code || 500).send(error)
    }
})

app.get("/usuarios", reportQuery, async (req, res) => {
    try {
        const Authorization = req.header("Authorization")
        const token = Authorization.split("Bearer ")[1]
        jwt.verify(token, "az_AZ")
        const { email} = jwt.decode(token)
        const users = await getUsers()
        res.json(users)
        res.send(`El Usuario ${email} existe :DD!!`)
    } catch (error) {
        res.status(error.code || 500).send(error)
    }
})