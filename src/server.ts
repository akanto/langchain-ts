import express from 'express';

const app = express();
const port = 3003;

app.get('/', (req, res) => {
  res.send('Hello, TS Express!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
