import { config } from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';

import placesRoutes from './routes/places/places';
import userRoutes from './routes/users/users';
import { defaultErrorRequestHandler, defaultNotFoundResponse } from './util/error-request-handler';
config();

const PORT: string | number = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoutes);
app.use('/api/users', userRoutes);

app.use(defaultNotFoundResponse);

app.use(defaultErrorRequestHandler);

app.listen(PORT, () => {
    console.log(`[server]: Server is running at https://localhost:${PORT}`);
});
