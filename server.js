require('dotenv').config();

const dns = require('node:dns').promises;
dns.setServers(['1.1.1.1']);


const app = require('./src/app');
const connectDB = require('./src/config/db');

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
