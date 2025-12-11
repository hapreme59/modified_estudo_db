// server.js
const express = require('express');
const app = express();
const PORT = 4000;
const cors = require('cors');
const mysql = require("mysql2");
app.use(cors());


// Conexão com seu banco de dados (coloque o caminho correto do seu arquivo .db)

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',      
  password: '1111',        
  database: 'films'  
});

app.get("/", (req, res) =>{
  res.sendFile(__dirname + "/index.html");
})

// Configurar para aceitar JSON
app.use(express.json());

// Rota GET para listar todos os filmes
app.get('/filmes', (req, res) => {
  conn.query("SELECT * FROM films", (err, results) =>{
    if (err){
      res.send(err);
    }
    else{
      res.json(results);
    }
  })
});

// Rota POST para adicionar um novo filme
app.post('/filmes', (req, res) => {
  const { title, year, genre } = req.body;

  if (!title || !year || !genre) {
    return res.status(400).json({ erro: 'Required fields: title, year, genre'});
  }

  const params = [title, year, genre];

  conn.query("INSERT INTO films (title, year, genre) VALUES (?, ?, ?)", params, (err, results) =>{
    if (err){
      res.send(err);
    }
    else{
      res.json(results);
    };
  })
});

// Rota para deletar um filme
app.delete('/filmes/:id', (req, res) => {
  const { id } = req.params;
  conn.query('DELETE FROM films WHERE id = ?', [id], (err, results) => {
      if (err) {
          res.send(err)
      }
      else{
              res.json({ message: 'Film deleted successfully!' });
      }

  });
});

app.post('/filmes/:id', (req, res) =>{
    const { id } = req.params;
    const { title, year, genre } = req.body;
    conn.query('UPDATE films SET title = ?, year = ?, genre = ? WHERE id = ?', [title, year, genre, id], (err, results) => {
              if (err) {
          res.send(err)
      }
      else{
              res.json({ message: 'Film editing successfully!' });
      }
    })
});


// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Сервер заработал http://localhost:${PORT}`);
});