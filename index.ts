import express from 'express';

const app = express();
const PORT = 3003;

app.use(express.json());

app.get('/api/ping', (_req, res) => {
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
