const apiPort = parseInt(process.env.PORT) || 3000;
const jwtsecret = process.env.JWT_SECRET || 'secret';

const dbhost = process.env.DB_HOST || 'mongodb://127.0.0.1:27017/';
const dbdatabase = process.env.DB_NAME || 'conexa-api';

const transportServiceName =
  process.env.TRANSPORT_SERVICE_NAME || 'BUSINESS_SERVICE';
const transportHost = process.env.TRANSPORT_HOST || 'localhost';
const transportPort = parseInt(process.env.TRANSPORT_PORT) || 6379;

export default {
  apiPort,
  jwtsecret,
  dbhost,
  dbdatabase,
  transportServiceName,
  transportHost,
  transportPort,
};
