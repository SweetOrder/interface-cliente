import { 
  type User, type InsertUser, 
  type Product, type InsertProduct,
  type Menu, type InsertMenu,
  type MenuProduct,
  type Favorite, type InsertFavorite,
  type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getProduct(id: number): Promise<Product | undefined>;
  getAllProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Menu methods
  getMenu(id: number): Promise<Menu | undefined>;
  getAllMenus(): Promise<Menu[]>;
  createMenu(menu: InsertMenu): Promise<Menu>;
  
  // Menu products methods
  addProductToMenu(menuId: number, productId: number): Promise<MenuProduct>;
  getProductsByMenuId(menuId: number): Promise<Product[]>;
  
  // Favorites methods
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, productId: number): Promise<void>;
  getFavoritesByUserId(userId: number): Promise<Product[]>;
  isFavorite(userId: number, productId: number): Promise<boolean>;
  
  // Order methods
  createOrder(order: InsertOrder): Promise<Order>;
  getOrdersByUserId(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  
  // Order items methods
  addItemToOrder(item: InsertOrderItem): Promise<OrderItem>;
  getItemsByOrderId(orderId: number): Promise<OrderItem[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private menus: Map<number, Menu>;
  private menuProducts: Map<number, MenuProduct[]>;
  private favorites: Map<number, Favorite[]>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem[]>;
  private currentUserId: number;
  private currentProductId: number;
  private currentMenuId: number;
  private currentMenuProductId: number;
  private currentFavoriteId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.menus = new Map();
    this.menuProducts = new Map();
    this.favorites = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentMenuId = 1;
    this.currentMenuProductId = 1;
    this.currentFavoriteId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    
    // Initialize with sample data
    this.initializeSampleData().catch(err => {
      console.error("Error initializing sample data:", err);
    });
  }
  
  private async initializeSampleData() {
    // Sample users
    const users: InsertUser[] = [
      {
        username: "cliente1",
        password: "password123",
        name: "Maria Silva",
        email: "maria@example.com",
        whatsapp: "11999998888"
      },
      {
        username: "cliente2",
        password: "password123",
        name: "João Santos",
        email: "joao@example.com",
        whatsapp: "11977776666"
      }
    ];
    
    // Create users
    for (const user of users) {
      await this.createUser(user);
    }
    
    // Sample products
    const products: InsertProduct[] = [
      {
        name: "Bolo de Chocolate",
        description: "Delicioso bolo de chocolate com cobertura especial e decoração com morangos frescos. Ideal para aniversários e comemorações especiais.",
        price: 6500, // R$ 65,00
        category: "Bolos",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        hasSizeOptions: true,
        sizeOptions: [
          { name: "Pequeno", description: "Serve 10", price: 6500 },
          { name: "Médio", description: "Serve 15", price: 8500 },
          { name: "Grande", description: "Serve 25", price: 12000 }
        ]
      },
      {
        name: "Bolo Red Velvet",
        description: "Delicado bolo vermelho com cobertura de cream cheese",
        price: 7200, // R$ 72,00
        category: "Bolos",
        imageUrl: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        hasSizeOptions: true,
        sizeOptions: [
          { name: "Pequeno", description: "Serve 10", price: 7200 },
          { name: "Médio", description: "Serve 15", price: 9500 },
          { name: "Grande", description: "Serve 25", price: 13500 }
        ]
      },
      {
        name: "Cupcakes Diversos",
        description: "Kit com 6 cupcakes de sabores variados",
        price: 4800, // R$ 48,00
        category: "Doces",
        imageUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        hasSizeOptions: false,
        sizeOptions: []
      },
      {
        name: "Brigadeiros Gourmet",
        description: "Caixa com 10 unidades de sabores variados",
        price: 3500, // R$ 35,00
        category: "Doces",
        imageUrl: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        hasSizeOptions: false,
        sizeOptions: []
      },
      {
        name: "Torta de Limão",
        description: "Clássica torta de limão com merengue",
        price: 5500, // R$ 55,00
        category: "Tortas",
        imageUrl: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        hasSizeOptions: false,
        sizeOptions: []
      },
      {
        name: "Coxinhas",
        description: "Bandeja com 20 mini coxinhas de frango",
        price: 4500, // R$ 45,00
        category: "Salgados",
        imageUrl: "https://images.unsplash.com/photo-1519676867240-f03562e64548?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        hasSizeOptions: false,
        sizeOptions: []
      }
    ];
    
    // Create products
    for (const product of products) {
      await this.createProduct(product);
    }
    
    // Sample menus
    const menus: InsertMenu[] = [
      {
        name: "Festas e Aniversários",
        description: "Bolos, doces e salgados para sua celebração",
        imageUrl: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
      },
      {
        name: "Dia a Dia",
        description: "Salgados e doces para o seu cotidiano",
        imageUrl: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
      },
      {
        name: "Ocasiões Especiais",
        description: "Delícias premium para momentos marcantes",
        imageUrl: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
      }
    ];
    
    // Create menus
    for (let i = 0; i < menus.length; i++) {
      const menu = menus[i];
      const createdMenu = await this.createMenu(menu);
      
      // Add products to menus
      if (i === 0) { // Festas e Aniversários
        await this.addProductToMenu(createdMenu.id, 1); // Bolo de Chocolate
        await this.addProductToMenu(createdMenu.id, 2); // Bolo Red Velvet
        await this.addProductToMenu(createdMenu.id, 3); // Cupcakes
        await this.addProductToMenu(createdMenu.id, 4); // Brigadeiros
      } else if (i === 1) { // Dia a Dia
        await this.addProductToMenu(createdMenu.id, 5); // Torta de Limão
        await this.addProductToMenu(createdMenu.id, 6); // Coxinhas
      } else if (i === 2) { // Ocasiões Especiais
        await this.addProductToMenu(createdMenu.id, 1); // Bolo de Chocolate
        await this.addProductToMenu(createdMenu.id, 2); // Bolo Red Velvet
        await this.addProductToMenu(createdMenu.id, 5); // Torta de Limão
      }
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Product methods
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category
    );
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    // Make sure hasSizeOptions is not undefined
    const product: Product = { 
      ...insertProduct, 
      id,
      hasSizeOptions: insertProduct.hasSizeOptions || false,
      sizeOptions: insertProduct.sizeOptions || []
    };
    this.products.set(id, product);
    return product;
  }
  
  // Menu methods
  async getMenu(id: number): Promise<Menu | undefined> {
    return this.menus.get(id);
  }
  
  async getAllMenus(): Promise<Menu[]> {
    return Array.from(this.menus.values());
  }
  
  async createMenu(insertMenu: InsertMenu): Promise<Menu> {
    const id = this.currentMenuId++;
    const menu: Menu = { ...insertMenu, id };
    this.menus.set(id, menu);
    return menu;
  }
  
  // Menu products methods
  async addProductToMenu(menuId: number, productId: number): Promise<MenuProduct> {
    const id = this.currentMenuProductId++;
    const menuProduct: MenuProduct = { id, menuId, productId };
    
    if (!this.menuProducts.has(menuId)) {
      this.menuProducts.set(menuId, []);
    }
    
    this.menuProducts.get(menuId)?.push(menuProduct);
    return menuProduct;
  }
  
  async getProductsByMenuId(menuId: number): Promise<Product[]> {
    const menuProductsList = this.menuProducts.get(menuId) || [];
    
    return menuProductsList.map((mp) => {
      const product = this.products.get(mp.productId);
      if (!product) throw new Error(`Product with ID ${mp.productId} not found`);
      return product;
    });
  }
  
  // Favorites methods
  async addFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const id = this.currentFavoriteId++;
    const favorite: Favorite = { ...insertFavorite, id };
    
    if (!this.favorites.has(insertFavorite.userId)) {
      this.favorites.set(insertFavorite.userId, []);
    }
    
    this.favorites.get(insertFavorite.userId)?.push(favorite);
    return favorite;
  }
  
  async removeFavorite(userId: number, productId: number): Promise<void> {
    const userFavorites = this.favorites.get(userId) || [];
    
    const updatedFavorites = userFavorites.filter(
      (favorite) => favorite.productId !== productId
    );
    
    this.favorites.set(userId, updatedFavorites);
  }
  
  async getFavoritesByUserId(userId: number): Promise<Product[]> {
    const userFavorites = this.favorites.get(userId) || [];
    
    return userFavorites.map((favorite) => {
      const product = this.products.get(favorite.productId);
      if (!product) throw new Error(`Product with ID ${favorite.productId} not found`);
      return product;
    });
  }
  
  async isFavorite(userId: number, productId: number): Promise<boolean> {
    const userFavorites = this.favorites.get(userId) || [];
    return userFavorites.some((favorite) => favorite.productId === productId);
  }
  
  // Order methods
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { 
      ...insertOrder, 
      id, 
      status: "pending", 
      createdAt: new Date(),
      notes: insertOrder.notes || null
    };
    
    this.orders.set(id, order);
    return order;
  }
  
  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  // Order items methods
  async addItemToOrder(insertItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemId++;
    const item: OrderItem = { 
      ...insertItem, 
      id,
      notes: insertItem.notes || null,
      size: insertItem.size || null
    };
    
    if (!this.orderItems.has(insertItem.orderId)) {
      this.orderItems.set(insertItem.orderId, []);
    }
    
    this.orderItems.get(insertItem.orderId)?.push(item);
    return item;
  }
  
  async getItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    return this.orderItems.get(orderId) || [];
  }
}

export const storage = new MemStorage();
