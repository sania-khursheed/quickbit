import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'quickbite_secret_key_123';

async function initDb() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    );
    CREATE TABLE IF NOT EXISTS food_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      price REAL,
      description TEXT,
      imageUrl TEXT,
      category TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create default admin if not exists
  const admin = await db.get('SELECT * FROM users WHERE email = ?', ['admin@quickbite.com']);
  if (!admin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.run('INSERT INTO users (email, password) VALUES (?, ?)', ['admin@quickbite.com', hashedPassword]);
    console.log('Default admin created: admin@quickbite.com / admin123');
  }

  // Seed initial food items if empty
  const foodCount = await db.get('SELECT COUNT(*) as count FROM food_items');
  if (foodCount.count === 0) {
    const initialFood = [
      {
        name: 'Gourmet Truffle Burger',
        price: 15.99,
        description: 'Black angus beef, truffle aioli, swiss cheese, and caramelized onions on a brioche bun.',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
        category: 'Burgers'
      },
      {
        name: 'Pepperoni Feast Pizza',
        price: 18.50,
        description: 'Double pepperoni, extra mozzarella, and our signature slow-cooked tomato sauce.',
        imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800',
        category: 'Pizza'
      },
      {
        name: 'Classic BBQ Wings',
        price: 12.00,
        description: '10 pieces of crispy wings tossed in our sweet and smoky house-made BBQ sauce.',
        imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc200f?auto=format&fit=crop&q=80&w=800',
        category: 'Sides'
      }
    ];

    for (const food of initialFood) {
      await db.run(
        'INSERT INTO food_items (name, price, description, imageUrl, category) VALUES (?, ?, ?, ?, ?)',
        [food.name, food.price, food.description, food.imageUrl, food.category]
      );
    }
    console.log('Seeded initial food items');
  }

  return db;
}

async function startServer() {
  const app = express();
  const db = await initDb();

  app.use(cors());
  app.use(express.json());

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
      req.user = user;
      next();
    });
  };

  // Auth Routes
  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);
    try {
      const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
      if (!user) {
        console.log(`Login failed: User ${email} not found`);
        return res.status(400).json({ message: 'User not found' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        console.log(`Login failed: Invalid password for ${email}`);
        return res.status(400).json({ message: 'Invalid password' });
      }

      console.log(`Login successful for: ${email}`);
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, user: { email: user.email } });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Food Routes
  app.get('/api/food', async (req, res) => {
    try {
      const items = await db.all('SELECT * FROM food_items ORDER BY createdAt DESC');
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching food items' });
    }
  });

  app.post('/api/food', authenticateToken, async (req, res) => {
    const { name, price, description, imageUrl, category } = req.body;
    try {
      const result = await db.run(
        'INSERT INTO food_items (name, price, description, imageUrl, category) VALUES (?, ?, ?, ?, ?)',
        [name, price, description, imageUrl, category]
      );
      const newItem = await db.get('SELECT * FROM food_items WHERE id = ?', [result.lastID]);
      res.status(201).json(newItem);
    } catch (error) {
      res.status(500).json({ message: 'Error adding food item' });
    }
  });

  app.put('/api/food/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, price, description, imageUrl, category } = req.body;
    try {
      await db.run(
        'UPDATE food_items SET name = ?, price = ?, description = ?, imageUrl = ?, category = ? WHERE id = ?',
        [name, price, description, imageUrl, category, id]
      );
      const updatedItem = await db.get('SELECT * FROM food_items WHERE id = ?', [id]);
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: 'Error updating food item' });
    }
  });

  app.delete('/api/food/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    console.log(`Server: Request to delete food item with id: ${id}`);
    try {
      const result = await db.run('DELETE FROM food_items WHERE id = ?', [id]);
      if (result.changes === 0) {
        console.log(`Server: No item found with id: ${id}`);
        return res.status(404).json({ message: 'Item not found' });
      }
      console.log(`Server: Successfully deleted item with id: ${id}`);
      res.json({ message: 'Food item deleted successfully' });
    } catch (error) {
      console.error('Server: Error deleting food item:', error);
      res.status(500).json({ message: 'Error deleting food item' });
    }
  });

  // Stats
  app.get('/api/stats', authenticateToken, async (req, res) => {
    try {
      const totalItems = await db.get('SELECT COUNT(*) as count FROM food_items');
      const totalCategories = await db.get('SELECT COUNT(DISTINCT category) as count FROM food_items');
      res.json({
        totalItems: totalItems.count,
        totalCategories: totalCategories.count
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching stats' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
