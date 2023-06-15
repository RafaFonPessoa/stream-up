const Picture = require("../models/Picture");

const fs = require("fs");



exports.create = async (req, res) => {
    try {
      const { name } = req.body;
  
      const file = req.file;
      
      const picture = new Picture({
        name,
        src: file.path,
      });
  
      await picture.save();

      res.json(picture);

    } catch (err) {
      res.status(500).json({ message: "Erro ao salvar a imagem." });
    }
  };

  exports.findAll = async (req, res) => {
    try {
      const pictures = await Picture.find();
      res.json(pictures);
    } catch (err) {
      res.status(500).json({ message: "Erro ao buscar as imagens." });
    }
  };

  exports.remove = async (req, res) => {
    try {
      const picture = await Picture.findById(req.params.id);
  
      if (!picture) {
        return res.status(404).json({ message: "Imagem não encontrada" });
      }
  
      fs.unlinkSync(picture.src);
  
      await Picture.deleteOne({ _id: req.params.id });
  
      res.json({ message: "Imagem removida com sucesso" });
    } catch (err) {
      res.status(500).json({ message: "Erro ao remover a imagem" });
    }
  };

  exports.update = async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
  
      console.log('ID da imagem:', id);
      console.log('Novo nome da imagem:', name);
  
      const picture = await Picture.findById(id);
  
      console.log('Imagem encontrada:', picture);
  
      if (!picture) {
        console.log('Imagem não encontrada');
        return res.status(404).json({ message: "Imagem não encontrada" });
      }
  
      picture.name = name;
      await picture.save();
  
      console.log('Imagem atualizada:', picture);
  
      res.json(picture);
    } catch (err) {
      console.log('Erro ao atualizar a imagem:', err);
      res.status(500).json({ message: "Erro ao atualizar a imagem" });
    }
  };
  
  
