// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;
const cors = require('cors');
app.use(cors());


// Conexão com seu banco de dados (coloque o caminho correto do seu arquivo .db)
const db = new sqlite3.Database('./meubanco.db');

// Configurar para aceitar JSON
app.use(express.json());

// Rota GET para listar todos os filmes
app.get('/filmes', (req, res) => {
  db.all('SELECT * FROM filmes', [], (err, rows) => {
    if (err) {
      res.status(500).json({ erro: err.message });
    } else {
      res.json({ filmes: rows });
    }
  });
});

// Rota POST para adicionar um novo filme
app.post('/filmes', (req, res) => {
  const { titulo, ano_lancamento, genero } = req.body;

  if (!titulo || !ano_lancamento || !genero) {
    return res.status(400).json({ erro: 'Campos obrigatórios: titulo, ano_lancamento, genero' });
  }

  const sql = `INSERT INTO filmes (titulo, ano_lancamento, genero) VALUES (?, ?, ?)`;
  const params = [titulo, ano_lancamento, genero];

  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ erro: err.message });
    } else {
      res.status(201).json({ mensagem: 'Filme inserido com sucesso!', id: this.lastID });
    }
  });
});

// Rota para deletar um filme
app.delete('/filmes/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM filmes WHERE id = ?', [id], function (err) {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json({ message: 'Filme deletado com sucesso!' });
  });
});


// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});