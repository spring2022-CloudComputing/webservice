import express from 'express';
import routes from './routes.js';

const app = express();
const port = 3000;

app.use('/', routes);

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});