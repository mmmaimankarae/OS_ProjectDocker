let express = require('express') //require = เรียกใช้ = insert dependency (library)
let app = express(); // เรียกใช้express
let bodyParser = require('body-parser');
let mysql = require('mysql2/promise'); // ตรงนี้จะต่างกันแล้วแต่คนเลือกใช้แอปเขียน dbs
let dotenv = require('dotenv');
dotenv.config();

let port = process.env.PORT || 8000;
app.use(bodyParser.json()); // requestที่รับเข้ามาต้องเป็นไฟล์.jsonเท่านั้น
app.use(bodyParser.urlencoded({ extended: true })) // เซต url

/* homepage route = เซตตัวลิงค์*/
app.get('/', (req, res) => {
    return res.send({
        Text: 'Project: API & Container || Operation System (05506007)',
        message: 'Welcome to Our RESTful CRUD API with NodeJS, express and MySQL',
        written_by: 'Mine_Dear_Sand',
        message: 'if you want to know our name'
    })
})

/* connection to mysql database */
let dbcon = mysql.createPool({
    host: 'us-cdbr-east-06.cleardb.net',
    //port: '/tmp/mysql.sock',
    user: 'b8e55e2c3f8ffe',
    password: '7ae7b734',
    database: 'heroku_9ed6e2335f49705'
})

/* ดึงข้อมูลมาจากฐานข้อมูล */
app.get('/member/', async(req, res) => {
    let tran = await dbcon.getConnection()
    await tran.beginTransaction()
    let [row, field] = await tran.query('SELECT * FROM OURMEMBER')
    console.log(row)
    return res.send(row)
})

/* ดึงข้อมูลมาจากฐานข้อมูล */
app.get('/exchange/', async(req, res) => {
    let tran = await dbcon.getConnection()
    await tran.beginTransaction()
    let [row, field] = await tran.query('SELECT * FROM exchange')
    console.log(row)
    return res.send(row)
})

/* ดึงข้อมูลมาจากฐานข้อมูลแบบระบุ */
app.get('/member/:id', async(req, res) => {
    let tran = await dbcon.getConnection()
    await tran.beginTransaction()
    let id = req.params.id;
    
    if (!id){
        return res.status(400).send({ error: true, message: "Don't have information"})
    } else {
        // dbcon.query('SELECT * FROM OURMEMBER WHERE idMEMBER = ?', id, (error, results, fields) => {
        //     if (error) throw error;

        //     let message = "";
        //     if (results == undefined || results.length == 0){
        //         message = "ID not found";
        //     } else {
        //         message = "Successfully pull MEMBER data"
        //     }
        //     return res.send({data: results, message: message})
        // })
        let [row, field] = await tran.query('SELECT * FROM ourmember WHERE idMEMBER = ?', id)
        console.log(row)
        return res.send(row)
    }
})

/* add data in Member */
app.post('/member/newmember', async(req, res) => {
    let id = req.body.idMember;
    let sure = req.body.surename;
    let last = req.body.lastname;
    let call = req.body.callme;

    if(!id || !sure || !last || !call) {
        return res.status(400).send({ error: true, message: "Please add the new member"});
    } else {
        dbcon.query('INSERT INTO OURMEMBER (idMEMBER, surename, lastname, callme) VALUES(?, ?, ?, ?)', [id, sure, last, call], (error, results, fields) => {
            if (error) throw error;
            return res.send({data: results, message: "Welcome new Member"})
        })
    }
})

/* update data */
app.put('/exchange/update', (req, res) => {
    let date = req.params.DATE;
    let buyS = req.body.Average_Buying_Sight_Bill;
    let buyT = req.body.Average_Buying_Transfer;
    let sell = req.body.Average_Selling;

    if (!date || !buyS || !buyT || !sell){
        return res.status(400).send({error: true, message: "Try again"});
    } else {
        dbcon.query('UPDATE exchange SET Average_Buying_Sight_Bill = ?, Average_Buying_Transfer = ?, Average_Selling = ? WHERE DATE = ?', [buyS, buyT, sell, date], (error, results, fields) => {
            if (error) throw error;

            let message = "";
            if (results.changedRows === 0){
                message = "Date not found";
            } else {
                message: "Successfully update";
            }
            return res.send({data: results, message: message})
        })
    }
})

/* delete data */
app.delete('/member/delete', (req, res) => {
    let id = req.body.idMember;

    if(!id) {
        return res.status(400).send({error: true, message: "Please Enter again"});
    } else {
        dbcon.query('DELETE FROM OURMEMBER WHERE idMEMBER = ?', id, (error, results, fields) => {
            if (error) throw error;

            let message = "";
            if (results.affectedRow === 0) {
                message = "Member not found";
            } else {
                message = "Successfully delete";
            }
            return res.send({data: results, message: message})
        })
    }
})

app.listen(port, () => { // เซตport
    console.log('Node App is running on port 8000');
})

module.exports = app;
/* run เพื่อเปิดServer = npm run dev*/
/* npm i nodemon = watch จะได้ไม่ต้องเปิดปิดseverทุกครั้งที่มีการเปลี่ยนแปลง*/
