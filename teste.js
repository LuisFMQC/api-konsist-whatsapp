const { Pool } = require("pg");

// Configurações da conexão com o banco de dados
const pool = new Pool({
  user: "postgres",
  host: "54.207.195.32",
  database: "konsistweb",
  password: "juizladrao_1994",
  port: 5432,
});

// Função para executar a consulta
async function executarConsulta() {
  try {
    // Estabelecer uma conexão com o banco de dados
    const client = await pool.connect();

    // Valores dos parâmetros
    const idCliente = "11";
    const dataLimite = "1 day"; // Intervalo de 1 dia
    const contato = "5561981297516";

    // Consulta com INTERVAL
    const query =
      "SELECT * FROM envioscobrados WHERE idcliente = $1 AND contato = $2 AND datainclusao >= NOW() - $3::INTERVAL";
    const values = [idCliente, contato, dataLimite];

    // Executar a consulta
    const result = await client.query(query, values);
    console.log(result.rows);

    // Liberar a conexão com o banco de dados
    client.release();
  } catch (error) {
    console.error("Erro ao executar a consulta:", error);
  } finally {
    // Encerrar a pool de conexões
    await pool.end();
  }
}

// Executar a função para testar a consulta
executarConsulta();
