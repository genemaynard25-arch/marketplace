process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const http = require('http');
const fs = require('fs');

const replaceTemplate = require('./modules/replaceTemplate');

const expressApp = require('./app');

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log('DB connected successfully!');
});

const products = JSON.parse(
  fs.readFileSync(`${__dirname}/data/products.json`, 'utf-8')
);

const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const templateItem = fs.readFileSync(
  `${__dirname}/templates/template-item.html`,
  'utf-8'
);

const server = http.createServer((req, res) => {
  const { pathname, searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const query = Object.fromEntries(searchParams);

  if (pathname === '/overview') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const cardsHTML = products
      .map((product) => replaceTemplate(templateCard, product))
      .join('');
    const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHTML);
    res.end(output);

  } else if (pathname === '/item') {
    const id = Number(query.id);
    const product = products.find((p) => p.id === id);

    if (!product) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - Product Not Found</h1><a href="/overview">← Back</a>');
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    const output = replaceTemplate(templateItem, product);
    res.end(output);

  } else if (pathname === '/api') {
    const data = fs.readFileSync(`${__dirname}/data/products.json`, 'utf-8');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);

  } else {
    expressApp(req, res);
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`\nServer is running on port ${PORT}...\n`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
