require('dotenv').config();

const dns = require('node:dns').promises;
dns.setServers(['1.1.1.1']);


const app = require('./app');
const connectDB = require('./config/db');

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
