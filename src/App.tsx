import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Webview from './components/Webview';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <div className="flex items-center">
                <ShoppingBag className="h-8 w-8 text-orange-500" />
                <span className="ml-2 text-xl font-bold">Borcelle</span>
              </div>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/webview/:id" element={<Webview />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App