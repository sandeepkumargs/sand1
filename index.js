const express = require('express');
const app = express();
app.use(express.json());
 

app.get('/',
(req, res) => {
    res.send('Server running on 127.0.0.1 on port 3000');
});


app.get('/getexample',
(req, res) => {

    // Access the provided 'page' and 'limt' query parameters
    let studentName = req.query.name;
    
    console.log("param is ",studentName);

    const students = [
        { name: 'Hari', grade: 96 },
        { name: 'Bob', grade: 84 },
        { name: 'Alex', grade: 100 },
        { name: 'Sam', grade: 65 },
        { name: 'Bobo', grade: 90 }
    ];

    let found = null;
    students.forEach(element => {
        if (element.name==studentName)
        {
            found = element;
            console.log("Found param",studentName);
        }
   });

    res.send(found);
});

let rank = 1;

app.post('/postexample',
(req, res) => {
    const { username, password } = req.body;
    console.log("posted params", username,password);
    const { authorization } = req.headers;
    const dateTimeObject = new Date();
    rank++;
    res.send(
        {
            "username":"Hi There" + username,
            "rank" : rank,
        });
});
 
app.listen(3000,
    () => {
        console.log(
            'Our express server is up on port 3000'
        );
    });