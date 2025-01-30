import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct, getProducts } from '../lib/woocommerce';
import { Loader2, ChevronLeft, ZoomIn, Tag, ChevronDown } from 'lucide-react';
import ImageModal from './ImageModal';

interface Product {
  id: number;
  name: string;
  price: string;
  regular_price: string;
  images: { src: string }[];
  description: string;
  categories: { id: number; name: string }[];
  agents: { id: number; name: string }[];
  permalink: string;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [isTitleExpanded, setIsTitleExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await getProduct(Number(id));
        setProduct(productData);
        
        const allProducts = await getProducts();
        const related = allProducts
          .filter(p => 
            p.id !== productData.id &&
            p.categories.some(cat => 
              productData.categories.some(productCat => productCat.id === cat.id)
            )
          )
          .slice(0, 4);
        
        setRelatedProducts(related);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const discountedPrice = parseFloat(product.price);
  const originalPrice = parseFloat(product.regular_price);
  const discount = originalPrice > 0 ? Math.round((1 - discountedPrice / originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-4 md:py-8">
        <Link to="/" className="inline-flex items-center text-gray-600 mb-4 md:mb-6">
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-sm md:text-base">Back to products</span>
        </Link>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="relative">
            {/* Featured Image */}
            <div className="relative w-full pt-[100%] bg-white">
              <div 
                className="absolute inset-0 flex items-center justify-center p-4 cursor-zoom-in group"
                onClick={() => setZoomedImage(product.images[0]?.src)}
              >
                <img
                  src={product.images[0]?.src}
                  alt={product.name}
                  className="max-w-full max-h-full w-auto h-auto object-contain"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6 space-y-3 md:space-y-4">
            {/* Title and Price */}
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2 flex-1">
                <button 
                  onClick={() => setIsTitleExpanded(!isTitleExpanded)}
                  className="w-full text-left group"
                >
                  <div className="flex items-start gap-2">
                    <h1 className={`text-xl md:text-2xl font-bold transition-all duration-200 ${
                      isTitleExpanded ? '' : 'line-clamp-2'
                    }`}>
                      {product.name}
                    </h1>
                    <ChevronDown className={`w-5 h-5 mt-1.5 flex-shrink-0 text-gray-400 transition-transform duration-200 ${
                      isTitleExpanded ? 'rotate-180' : ''
                    }`} />
                  </div>
                  {!isTitleExpanded && product.name.length > 60 && (
                    <span className="text-sm text-orange-500 group-hover:underline">Show more</span>
                  )}
                </button>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-2xl md:text-3xl font-bold text-orange-500">${discountedPrice}</div>
                {discount > 0 && (
                  <div className="text-xs md:text-sm text-gray-500 line-through">${originalPrice}</div>
                )}
              </div>
            </div>

            {/* Categories and Agents */}
            <div className="flex flex-wrap gap-2">
              {product.categories?.map((category) => (
                <div
                  key={category.id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full text-xs md:text-sm text-gray-700"
                >
                  <Tag className="w-3 h-3 md:w-4 md:h-4" />
                  {category.name}
                </div>
              ))}
              {product.agents?.map((agent) => (
                <div
                  key={agent.id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 rounded-full text-xs md:text-sm text-orange-700"
                >
                  <Tag className="w-3 h-3 md:w-4 md:h-4" />
                  {agent.name}
                </div>
              ))}
            </div>

            <div className="prose prose-sm md:prose-base max-w-none" 
                 dangerouslySetInnerHTML={{ __html: product.description }} />

            <button
              onClick={() => window.open(product.permalink, '_blank')}
              className="block w-full bg-orange-500 text-white text-center py-3 md:py-4 rounded-xl text-sm md:text-base font-semibold hover:bg-orange-600 transition-colors"
            >
              Order Now
            </button>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-8 md:mt-12">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div className="relative w-full pt-[100%] bg-white">
                    <img
                      src={relatedProduct.images[0]?.src || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300'}
                      alt={relatedProduct.name}
                      className="absolute inset-0 w-full h-full object-contain p-2"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="font-medium text-xs md:text-sm line-clamp-2 min-h-[2.5em] md:min-h-[3em]">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-base md:text-lg font-bold mt-2 text-orange-500">
                      ${relatedProduct.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <ImageModal
          src={zoomedImage}
          alt={product.name}
          onClose={() => setZoomedImage(null)}
        />
      )}
    </div>
  );
}