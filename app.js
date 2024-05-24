const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public', 'static', 'style')));
app.use(express.static(path.join(__dirname, 'public', 'static', 'scripts')));
app.use(express.static(path.join(__dirname, 'public', 'static', 'images')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/home', (req, res) => {
    res.redirect('/');
});

// app.get('/blog', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'blog.html'))
// });


app.listen(port, '0.0.0.0', () => {
    console.log("Server is running at http://localhost:" + port);
});








