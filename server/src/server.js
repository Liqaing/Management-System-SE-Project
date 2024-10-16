import express from 'express';
import morgan from 'morgan';
import userRouter from './routes/userRouter.js';
import dotenv from 'dotenv';
import { specs, swaggerUi } from './config/swagger.config.js';

dotenv.config();

const app = express()
const port = 8000

// middlewares
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// routes
app.use('/api/user', userRouter);

app.get('/', (req, res) => {
    res.sendStatus(200)
})

app.listen(port, () => {console.log(`Server is listening on ${port}`)})