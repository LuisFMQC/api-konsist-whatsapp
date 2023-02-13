require("dotenv").config();
const jwt = require("jsonwebtoken");
const { base64decode, base64encode } = require("nodejs-base64");

const senha = base64decode(process.env.SENHAJWT);

const criaJwt = (id, schema, mensagem) => {
  const payload = {
    userId: id,
    username: schema,
  };

  // Cria e assina o token
  const secret = jwt.sign(payload, senha);
  return {
    resposta: mensagem,
    token: secret,
  };
};

// Função middleware para validar o token
const authenticate = (req, res, next) => {
  const authorization = req.headers["authorization"];
  if (!authorization) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authorization.slice(7, authorization.length);
  jwt.verify(token, senha, {}, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

module.exports = { criaJwt, authenticate };
