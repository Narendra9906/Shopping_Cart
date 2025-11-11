import React, { useState, createContext, useContext, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, X, Check } from 'lucide-react';

const CartContext = createContext();

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

const PRODUCTS = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    category: 'Electronics',
    stock: 15
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
    category: 'Electronics',
    stock: 10
  },
  {
    id: 3,
    name: 'Running Shoes',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
    category: 'Fashion',
    stock: 20
  },
  {
    id: 4,
    name: 'Coffee Maker',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=300&h=300&fit=crop',
    category: 'Home',
    stock: 8
  },
  {
    id: 5,
    name: 'Backpack',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    category: 'Fashion',
    stock: 25
  },
  {
    id: 6,
    name: 'Desk Lamp',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=300&fit=crop',
    category: 'Home',
    stock: 12
  }
];

const CartProvider = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("shoppingCart")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.min(newQuantity, item.stock) }
          : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalPrice,
        getTotalItems,
        clearCart,
        showCart,
        setShowCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const ProductCard = ({ product }) => {
  const { addToCart, cart } = useCart();
  const cartItem = cart.find(item => item.id === product.id);
  const inCart = !!cartItem;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 cursor-pointer bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
          {product.category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
          <span className="text-sm text-gray-500">Stock: {product.stock}</span>
        </div>
        <button
          onClick={() => addToCart(product)}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
            inCart
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {inCart ? (
            <>
              <Check size={18} />
              In Cart ({cartItem.quantity})
            </>
          ) : (
            <>
              <ShoppingCart size={18} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm mb-3">
      <div className="flex gap-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 object-cover rounded"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-gray-800">{item.name}</h4>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-2">${item.price.toFixed(2)} per unit</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded hover:bg-gray-200 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-semibold">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded hover:bg-gray-200 transition-colors"
                disabled={item.quantity >= item.stock}
              >
                <Plus size={16} />
              </button>
            </div>
            <span className="font-bold text-blue-600">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartSidebar = () => {
  const { cart, showCart, setShowCart, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const handleCheckout = () => {
    setShowCheckout(true);
    setTimeout(() => {
      clearCart();
      setShowCheckout(false);
      setShowCart(false);
    }, 3000);
  };

  return (
    <>
      {showCart && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowCart(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-50 shadow-2xl z-50 flex flex-col">
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart size={24} />
                <h2 className="text-xl font-bold">Shopping Cart</h2>
              </div>
              <button
                onClick={() => setShowCart(false)}
                className="hover:bg-blue-700 p-2 rounded transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            {showCheckout ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={40} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h3>
                  <p className="text-gray-600">Thank you for your purchase.</p>
                </div>
              </div>
            ) : cart.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">Your cart is empty</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4">
                  {cart.map(item => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
                <div className="border-t bg-white p-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Items ({getTotalItems()})</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-800">
                      <span>Total</span>
                      <span className="text-blue-600">${getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

const ProductList = () => {
  const [products] = useState(PRODUCTS);
  const [filter, setFilter] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 300]);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const categoryMatch = filter === 'All' || product.category === filter;
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    return categoryMatch && priceMatch;
  });

  return (
    <div className="mb-8">
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm cursor-pointer font-semibold text-gray-700 mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-lg cursor-pointer font-medium transition-colors ${
                    filter === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </label>
            <input
              type="range"
              min="0"
              max="300"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-full cursor-pointer"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found matching your filters.</p>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const { getTotalItems, setShowCart } = useCart();

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <header className="bg-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
            <p className="text-sm text-gray-600">Your one-stop shopping destination</p>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="relative bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <ShoppingCart size={20} />
            <span>Cart</span>
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Products</h2>
          <p className="text-gray-600">Discover our amazing collection</p>
        </div>
        <ProductList />
      </main>
      <CartSidebar />
    </div>
  );
};

export default function ShoppingCartApp() {
  return (
    <CartProvider>
      <App />
    </CartProvider>
  );
}
