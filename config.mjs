// config.mjs
import dotenv from "dotenv";

// Carregue as variáveis de ambiente do arquivo .env
dotenv.config();

// Exporte as variáveis de ambiente
export const {
  PORT,
  VERIFY_TOKEN,

  PORTAAPP,

  PORTAAPPANT,

  IDUSUARIO,

  LOCAL,

  USAAGENDAWEBSTATUS,

  CHAVE_JWT,

  USERBD,

  IDBD,

  LINKBD,

  LINK,

  SENHAJWT,
  // Adicione outras variáveis de ambiente conforme necessário
} = process.env;
