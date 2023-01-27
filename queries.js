const { Pool } = require('pg')
const bcrypt = require('bcryptjs')
const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '0l4&nd4_ w3n0o5W',
    database: 'softjobs',
    allowExitOnIdle: true
})

const registerUser = async (user) => {
    let { email, password, rol, lenguage } = user
    const encriptedPassword = bcrypt.hashSync(password)
    password = encriptedPassword
    const values = [email, encriptedPassword, rol, lenguage]
    const query = "INSERT INTO usuarios VALUES (DEFAULT, $1, $2, $3, $4)"
    await pool.query(query, values)
}

const checkCredentials = async (email, password) => {
    const values = [email]
    const query = "SELECT * FROM usuarios WHERE email = $1"

    const { rows: [usuario], rowCount } = await pool.query(query, values)
    const { password: encriptedPassword } = usuario

    const correctPassword = bcrypt.compareSync(password, encriptedPassword)

    if (!correctPassword || !rowCount)
        throw { code: 401, message: "Email or Password Incorrect =)!!" }
}

const getUser = async (email) => {
    const values = [email]
    const query = "SELECT * FROM usuarios WHERE email = $1"
    const { rows: user } = await pool.query(query, values)
    return user
}

const prepareHATEOAS = async (user) => {
    const result = {
        email: user[0]["email"],
        rol: user[0]["rol"],
        lenguage: user[0]["lenguage"]
    }
    return result
}

const reportQuery = async (req, res, next) => {
    const par = req.params
    const url = req.url
    console.log(`
    Hoy ${new Date()}
    Hemos Recibido una Consulta en la Ruta ${url}
    con los Parámetros:
    `, par)
    next()
}
module.exports = { registerUser, checkCredentials, getUser, prepareHATEOAS, reportQuery }