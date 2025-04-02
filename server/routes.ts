import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertFavoriteSchema, 
  insertOrderSchema,
  insertOrderItemSchema,
  insertAddressSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes under /api prefix
  const apiRouter = express.Router();
  
  // === Users ===
  
  // Register new user
  apiRouter.post("/users/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      
      // Don't return password in response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Error registering user" });
    }
  });
  
  // Login user
  apiRouter.post("/users/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Don't return password in response
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error logging in" });
    }
  });
  
  // === Products ===
  
  // Get all products
  apiRouter.get("/products", async (_req: Request, res: Response) => {
    try {
      const products = await storage.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving products" });
    }
  });
  
  // Get products by category
  apiRouter.get("/products/category/:category", async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const products = await storage.getProductsByCategory(category);
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving products by category" });
    }
  });
  
  // Get product by ID
  apiRouter.get("/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving product" });
    }
  });
  
  // === Menus ===
  
  // Get all menus
  apiRouter.get("/menus", async (_req: Request, res: Response) => {
    try {
      const menus = await storage.getAllMenus();
      res.status(200).json(menus);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving menus" });
    }
  });
  
  // Get menu by ID
  apiRouter.get("/menus/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid menu ID" });
      }
      
      const menu = await storage.getMenu(id);
      
      if (!menu) {
        return res.status(404).json({ message: "Menu not found" });
      }
      
      res.status(200).json(menu);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving menu" });
    }
  });
  
  // Get products by menu ID
  apiRouter.get("/menus/:id/products", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid menu ID" });
      }
      
      const menu = await storage.getMenu(id);
      
      if (!menu) {
        return res.status(404).json({ message: "Menu not found" });
      }
      
      const products = await storage.getProductsByMenuId(id);
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving menu products" });
    }
  });
  
  // === Favorites ===
  
  // Get user favorites
  apiRouter.get("/users/:userId/favorites", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const favorites = await storage.getFavoritesByUserId(userId);
      res.status(200).json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving favorites" });
    }
  });
  
  // Add to favorites
  apiRouter.post("/users/:userId/favorites", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const { productId } = req.body;
      
      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }
      
      const favoriteData = insertFavoriteSchema.parse({ userId, productId });
      
      // Check if already favorited
      const isAlreadyFavorite = await storage.isFavorite(userId, productId);
      
      if (isAlreadyFavorite) {
        return res.status(400).json({ message: "Product already in favorites" });
      }
      
      const favorite = await storage.addFavorite(favoriteData);
      res.status(201).json(favorite);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Error adding to favorites" });
    }
  });
  
  // Remove from favorites
  apiRouter.delete("/users/:userId/favorites/:productId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const productId = parseInt(req.params.productId);
      
      if (isNaN(userId) || isNaN(productId)) {
        return res.status(400).json({ message: "Invalid user or product ID" });
      }
      
      // Check if favorite exists
      const isFavorite = await storage.isFavorite(userId, productId);
      
      if (!isFavorite) {
        return res.status(404).json({ message: "Favorite not found" });
      }
      
      await storage.removeFavorite(userId, productId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error removing from favorites" });
    }
  });
  
  // Check if product is favorited
  apiRouter.get("/users/:userId/favorites/:productId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const productId = parseInt(req.params.productId);
      
      if (isNaN(userId) || isNaN(productId)) {
        return res.status(400).json({ message: "Invalid user or product ID" });
      }
      
      const isFavorite = await storage.isFavorite(userId, productId);
      res.status(200).json({ isFavorite });
    } catch (error) {
      res.status(500).json({ message: "Error checking favorite status" });
    }
  });
  
  // === Orders ===
  
  // Create order
  apiRouter.post("/orders", async (req: Request, res: Response) => {
    try {
      const { userId, totalAmount, deliveryDate, notes, items } = req.body;
      
      if (!userId || !totalAmount || !deliveryDate || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Missing required order data" });
      }
      
      const orderData = insertOrderSchema.parse({ 
        userId, 
        totalAmount, 
        deliveryDate, 
        notes 
      });
      
      const order = await storage.createOrder(orderData);
      
      // Add order items
      for (const item of items) {
        const itemData = insertOrderItemSchema.parse({
          ...item,
          orderId: order.id
        });
        
        await storage.addItemToOrder(itemData);
      }
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating order" });
    }
  });
  
  // Get user orders
  apiRouter.get("/users/:userId/orders", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const orders = await storage.getOrdersByUserId(userId);
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving orders" });
    }
  });
  
  // Get order details
  apiRouter.get("/orders/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      
      const order = await storage.getOrder(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const items = await storage.getItemsByOrderId(id);
      
      // Gather products from order items
      const products = [];
      for (const item of items) {
        const product = await storage.getProduct(item.productId);
        if (product) {
          products.push({
            ...product,
            quantity: item.quantity,
            size: item.size,
            notes: item.notes
          });
        }
      }
      
      res.status(200).json({
        order,
        items,
        products
      });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving order details" });
    }
  });
  
  // === Addresses ===
  
  // Get user addresses
  apiRouter.get("/users/:userId/addresses", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const addresses = await storage.getAddressesByUserId(userId);
      res.status(200).json(addresses);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving addresses" });
    }
  });
  
  // Get address by ID
  apiRouter.get("/addresses/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid address ID" });
      }
      
      const address = await storage.getAddress(id);
      
      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }
      
      res.status(200).json(address);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving address" });
    }
  });
  
  // Create address
  apiRouter.post("/addresses", async (req: Request, res: Response) => {
    try {
      const addressData = insertAddressSchema.parse(req.body);
      const address = await storage.createAddress(addressData);
      res.status(201).json(address);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating address" });
    }
  });
  
  // Update address
  apiRouter.patch("/addresses/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid address ID" });
      }
      
      const address = await storage.getAddress(id);
      
      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }
      
      const addressData = req.body;
      const updatedAddress = await storage.updateAddress(id, addressData);
      res.status(200).json(updatedAddress);
    } catch (error) {
      res.status(500).json({ message: "Error updating address" });
    }
  });
  
  // Delete address
  apiRouter.delete("/addresses/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid address ID" });
      }
      
      const address = await storage.getAddress(id);
      
      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }
      
      await storage.deleteAddress(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting address" });
    }
  });
  
  // Register all API routes with prefix
  app.use("/api", apiRouter);
  
  // Create HTTP server
  const httpServer = createServer(app);
  
  return httpServer;
}
