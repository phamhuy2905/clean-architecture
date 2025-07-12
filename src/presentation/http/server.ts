import 'reflect-metadata'; // Must be imported first for Inversify
import express from "express";
import cors from "cors";
import appRouter from '../router/appRouter';
import { applyRouter } from '../../shared/helper/base';
import { routerNotFoundMiddleware, throwErrorMiddleware } from '../middleware/base';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
applyRouter(app, appRouter);

app.get('/health-check', (req, res, next) => {
    res.json({
        status: 'OK',
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});

app.use(throwErrorMiddleware);
app.use(routerNotFoundMiddleware);
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

export default app;
