import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function Webview() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link to={`/product/${id}`} className="inline-flex items-center text-gray-600 mb-6">
          <ChevronLeft className="w-5 h-5" />
          <span>Back to product</span>
        </Link>

        <div className="text-center space-y-8">
          <h1 className="text-4xl font-bold">Webview</h1>
          <p className="text-xl text-gray-600">Open product link in webview</p>
          <button className="w-full max-w-md bg-orange-500 text-white py-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors">
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
}