const express = require("express");
const app = express();
const cors = require("cors");
const axios = require('axios');

/*
axios.get("http://localhost:4000/pictures").then((res) => console.log(res.data)).catch(console.error);

app.use(express.static('uploads')); // colocando a imagem no navegador metodo public

axios.delete("http://localhost:4000/pictures/648a238d9ffc27c618527b76").then((res) => console.log(res.data)).catch(console.error);

axios.get("http://localhost:4000/pictures").then(function(resposta) {
  console.log(resposta.data);
}).catch(function(error) {
  if(error) {1
    console.log(error)
  }
}); */


require("dotenv").config();
require("./db");

const port = process.env.PORT || 3000;

const pictureRouter = require("./routes/picture");

app.use(express.json());

app.use(cors());
app.use("/pictures", pictureRouter);

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});