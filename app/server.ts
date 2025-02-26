import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import routes from './routes'

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/', routes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`)
});
