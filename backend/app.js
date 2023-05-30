// imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();

// Config JSON response
app.use(express.json());
app.use(cors());

// Middleware para analisar dados no formato x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Models
const User = require('./models/User');

// Open Route - Public Route
app.get('/', (req, res) => {
    res.status(200).json({ msg: 'Bem vindo a nossa API!' });
});

// Private Route
app.get("/user/:id", async (req, res) => {
    const id = req.params.id;

    // Check if user exists
    const user = await User.findById(id, "-password");

    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    res.status(200).json({ user });
});

// Register User
app.post('/auth/register', async (req, res) => {
    const { name, email, password, confirmpassword } = req.body;

    // Validations
    if (!name) {
        return res.status(422).json({ msg: 'O nome é obrigatório!' });
    }

    if (!email) {
        return res.status(422).json({ msg: 'O email é obrigatório!' });
    }

    if (!password) {
        return res.status(422).json({ msg: 'A senha é obrigatório!' });
    }

    if (password !== confirmpassword) {
        return res.status(422).json({ msg: 'As senhas não conferem!' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email: email });

    if (userExists) {
        return res.status(422).json({ msg: 'Email já cadastrado! por favor, utilize outro email!' });
    }

    // Create password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
        name,
        email,
        password: passwordHash,
    });

    try {
        await user.save();
        res.status(201).json({ msg: 'Usuário criado com sucesso!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Aconteceu um erro no servidor, tente mais tarde',
        });
    }
});

// Login User
app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    // Validations
    if (!email) {
        return res.status(422).json({ msg: 'O email é obrigatório!' });
    }

    if (!password) {
        return res.status(422).json({ msg: 'A senha é obrigatório!' });
    }

    // Check if user exists
    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado!' });
    }

    // Check if password match
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
        return res.status(404).json({ msg: 'Senha inválida!' });
    }

    try {
        res.status(200).json({ msg: "Autenticação realizada com sucesso!" });
    } catch (err) {
        console.log(error);
        res.status(500).json({
            msg: 'Aconteceu um erro no servidor, tente mais tarde',
        });
    }
});

// Delete User
app.delete('/user/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // Verify if user exists
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }

        // Delete User
        await user.remove();

        return res.status(200).json({ msg: 'Usuário excluído com sucesso' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Ocorreu um erro ao excluir o usuário' });
    }
});

// Credenciais 
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose
    .connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.kruvaze.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(3000);
        console.log('Conectado ao banco!');
    })
    .catch((err) => console.log(err));
