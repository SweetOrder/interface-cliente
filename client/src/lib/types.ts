// Types that match the schema.ts but for client-side use
export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  whatsapp: string;
}

export interface SizeOption {
  name: string;
  description: string;
  price: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  hasSizeOptions: boolean;
  sizeOptions: SizeOption[];
}

export interface Menu {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  notes?: string;
  selectedSizeOption?: SizeOption;
}

export interface OrderSummary {
  userId: number;
  totalAmount: number;
  deliveryDate: string;
  notes?: string;
  items: {
    productId: number;
    quantity: number;
    size?: string;
    price: number;
    notes?: string;
  }[];
}

export interface Order {
  id: number;
  userId: number;
  status: string;
  totalAmount: number;
  createdAt: Date;
  deliveryDate: string;
  notes?: string;
}

export interface OrderWithDetails {
  order: Order;
  items: {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    size?: string;
    price: number;
    notes?: string;
  }[];
  products: (Product & {
    quantity: number;
    size?: string;
    notes?: string;
  })[];
}

// Category type for filtering products
export type Category = 'Todos' | 'Bolos' | 'Doces' | 'Tortas' | 'Salgados' | 'Bebidas';

// Form types
export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
  name: string;
  email: string;
  whatsapp: string;
}
