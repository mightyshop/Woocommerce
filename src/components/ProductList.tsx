import React, { useEffect, useState } from 'react';
import { getProducts, getCategories, getAgents } from '../lib/woocommerce';
import { Loader2, ShoppingBag, Star, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  price: string;
  images: { src: string }[];
  description: string;
  categories: { id: number; name: string }[];
  agents: { id: number; name: string; image: { src: string } }[];
}

interface Category {
  id: number;
  name: string;
  count: number;
}

interface Agent {
  id: number;
  name: string;
  image: {
    src: string;
  };
  count: number;
}

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const fetchProducts = async (categoryId?: number, agentId?: number) => {
    try {
      setLoading(true);
      const productsData = await getProducts(undefined, categoryId, agentId);
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData, agentsData] = await Promise.all([
          getProducts(),
          getCategories(),
          getAgents()
        ]);

        setProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(categoriesData);
        setAgents(agentsData);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = async (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setSelectedAgent(null);
    await fetchProducts(categoryId, null);
  };

  const handleAgentClick = async (agentId: number | null) => {
    setSelectedAgent(agentId);
    setSelectedCategory(null);
    await fetchProducts(null, agentId);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const searchResults = await getProducts(searchQuery);
      setProducts(searchResults);
      setFilteredProducts(searchResults);
      setSelectedCategory(null);
      setSelectedAgent(null);
      setCurrentPage(1);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          {isSearching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
            </div>
          )}
        </div>
      </form>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-coral-100 to-coral-200 rounded-xl p-4 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
        <div className="space-y-2 md:space-y-4 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">Mega Sale Spectacular!</h2>
          <p className="text-sm md:text-base text-gray-700">Indulge in unbeatable deals across various products.</p>
        </div>
        <img 
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&h=300&fit=crop" 
          alt="Sale" 
          className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-lg" 
        />
      </div>

      {/* Agents Slider */}
      <div className="space-y-2">
        <h3 className="text-base md:text-lg font-semibold px-2">Popular Agents</h3>
        <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory">
          <div className="flex gap-3 md:gap-4 px-2 py-2">
            <button
              onClick={() => handleAgentClick(null)}
              className={`flex flex-col items-center min-w-[80px] md:min-w-[100px] transition-transform hover:scale-105 snap-start ${
                selectedAgent === null ? 'opacity-100' : 'opacity-70'
              }`}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-100 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 text-gray-500" />
              </div>
              <span className="mt-2 text-xs md:text-sm font-medium">All Agents</span>
            </button>
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => handleAgentClick(agent.id)}
                className={`flex flex-col items-center min-w-[80px] md:min-w-[100px] transition-transform hover:scale-105 snap-start ${
                  selectedAgent === agent.id ? 'opacity-100' : 'opacity-70'
                }`}
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden">
                  <img
                    src={agent.image?.src || `https://ui-avatars.com/api/?name=${agent.name}&background=random`}
                    alt={agent.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="mt-2 text-xs md:text-sm font-medium truncate max-w-[80px] md:max-w-[100px]">
                  {agent.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        <div className="flex gap-2 md:gap-3 px-2 py-2">
          <button
            onClick={() => handleCategoryClick(null)}
            className={`flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-sm md:text-base whitespace-nowrap transition-colors snap-start ${
              selectedCategory === null
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-sm md:text-base whitespace-nowrap transition-colors snap-start ${
                selectedCategory === category.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} 
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative w-full pt-[100%]">
                  <img
                    src={product.images[0]?.src || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300'}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-contain bg-white"
                    loading="lazy"
                  />
                  <button className="absolute top-2 right-2 bg-white/90 p-1.5 md:p-2 rounded-full">
                    <ShoppingBag className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="font-medium text-xs md:text-sm line-clamp-2 min-h-[2.5em] md:min-h-[3em]">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 md:w-4 md:h-4 fill-gray-200 text-gray-200"
                      />
                    ))}
                  </div>
                  <p className="text-base md:text-lg font-bold mt-2 text-orange-500">
                    ${product.price}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No products found
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredProducts.length > productsPerPage && (
          <div className="flex justify-center items-center gap-1 md:gap-2 pt-8">
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-sm md:text-base ${
                      currentPage === pageNumber
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return <span key={pageNumber} className="px-1 md:px-2">...</span>;
              }
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductList