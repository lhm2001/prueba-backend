import express from 'express';

import bodyParser from 'body-parser';
import cardTokenRoutes from './routes/cardTokenRoutes';

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/cardTokens', cardTokenRoutes);

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

export default app;