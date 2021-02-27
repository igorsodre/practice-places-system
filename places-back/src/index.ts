import express from 'express';
import { config } from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import placesRoutes from './routes/places/places';
import userRoutes from './routes/users/users';
import { allowOrigin } from './util/allow-origin-middleware';
import { defaultErrorRequestHandler, defaultNotFoundResponse } from './util/error-request-handler';

config();

const PORT: string | number = process.env.PORT || 5000;

const app = express();

app.use(allowOrigin);

app.use(bodyParser.json());

app.use('/api/places', placesRoutes);
app.use('/api/users', userRoutes);

app.use(defaultNotFoundResponse);

app.use(defaultErrorRequestHandler);

mongoose
    .connect(process.env.DB_CONNECTION_STRING || '')
    .then(() => {
        app.listen(PORT, () => {
            console.log(`[server]: Server is running at https://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
