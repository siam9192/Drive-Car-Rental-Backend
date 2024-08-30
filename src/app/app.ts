import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import router from './Routes';
import { GlobalErrorHandler } from './Errors/globalErrorHandler';
const app = express();

app.use(cors({origin:['https://drive-flax.vercel.app','http://localhost:5173'],credentials:true}));
app.use(express.json());

app.use('/api/v1', router);

app.use(GlobalErrorHandler);

app.use((req, res) => {
  if (req.url === '/') {
    res.status(200).json({
      message: 'Hey welcome to  server',
    });
  }
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'Not Found',
  });
});

export default app;