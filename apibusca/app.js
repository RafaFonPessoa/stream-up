    const express = require('express');
    const mongoose = require('mongoose');
    const Movie = require('./models/Movie'); // Importar o modelo de filme
    const app = express();
    const port = 3000;

    // Conectar ao banco de dados MongoDB
    mongoose.connect('mongodb+srv://rafael:140103@cluster0.kruvaze.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
    });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Erro de conexão com o banco de dados:'));
    db.once('open', () => {
    console.log('Conexão bem-sucedida com o banco de dados');
    });

    // Configurar o middleware para analisar o corpo das requisições como JSON
    app.use(express.json());

    // Rota para adicionar um novo filme
app.post('/movies', async (req, res) => {
    const { title, year, genre } = req.body;
  
    try {
      // Criar uma nova instância do modelo de filme com os dados recebidos
      const newMovie = new Movie({
        title,
        year,
        genre
      });
  
      // Salvar o novo filme no banco de dados
      const movie = await newMovie.save();
      res.status(201).json(movie);
    } catch (error) {
      console.error('Erro ao adicionar o filme:', error);
      res.status(500).json({ error: 'Erro ao adicionar o filme' });
    }
  });
  
  // Rota para obter todos os filmes
  app.get('/movies', (req, res) => {
    Movie.find({}).exec()
      .then(movies => {
        res.json(movies);
      })
      .catch(err => {
        console.error('Erro ao obter os filmes:', err);
        res.status(500).json({ error: 'Erro ao obter os filmes' });
      });
  });
  

    // Rota para obter um filme por ID
    app.get('/movies/:id', (req, res) => {
    const movieId = req.params.id;

    Movie.findById(movieId, (err, movie) => {
        if (err) {
        console.error('Erro ao obter o filme:', err);
        res.status(500).json({ error: 'Erro ao obter o filme' });
        } else {
        if (movie) {
            res.json(movie);
        } else {
            res.status(404).json({ error: 'Filme não encontrado' });
        }
        }
    });
    });

    // Rota para atualizar um filme por ID
    app.put('/movies/:id', (req, res) => {
    const movieId = req.params.id;
    const { title, year, genre } = req.body;

    Movie.findByIdAndUpdate(
        movieId,
        { title, year, genre },
        { new: true },
        (err, updatedMovie) => {
        if (err) {
            console.error('Erro ao atualizar o filme:', err);
            res.status(500).json({ error: 'Erro ao atualizar o filme' });
        } else {
            if (updatedMovie) {
            res.json(updatedMovie);
            } else {
            res.status(404).json({ error: 'Filme não encontrado' });
            }
        }
        }
    );
    });

    // Rota para excluir um filme por ID
    app.delete('/movies/:id', (req, res) => {
    const movieId = req.params.id;

    Movie.findByIdAndRemove(movieId, (err, removedMovie) => {
        if (err) {
        console.error('Erro ao excluir o filme:', err);
        res.status(500).json({ error: 'Erro ao excluir o filme' });
        } else {
        if (removedMovie) {
            res.json({ message: 'Filme excluído com sucesso' });
        } else {
            res.status(404).json({ error: 'Filme não encontrado' });
        }
        }
    });
    });

    // Inicializar o servidor
    app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    });
