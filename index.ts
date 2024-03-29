import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors());
app.use(express.json());

app.get('/api/ping', (_req, res) => {
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
