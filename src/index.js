require('dotenv').config();
const express = require('express');
const errorHandler = require('./middleware/errorhandler');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
/*const errorHandler = require('./middleware/errorHandler'); // optional, we'll add small one*/

const app = express();

// middlewares
app.use(express.json());
//  Global rate limiter (all /api routes)
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 100, // Max 100 requests per IP
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', apiLimiter);


// routes
app.get('/', (req, res) => res.send('Lost & Found API is running'));
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

app.use(errorHandler);

// start
const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
});

