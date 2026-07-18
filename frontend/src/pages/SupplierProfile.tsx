import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { marketplaceAPI } from '../services/api';
import type { MarketplaceSupplier } from '../types';
import { SupplierInventoryCatalog } from '../components/marketplace/SupplierInventoryCatalog';
import { SupplierReviewSection } from '../components/marketplace/SupplierReviewSection';
import { MapPin, Phone, Star, Building2, ExternalLink, ShieldCheck, Clock, Truck, Mail, ArrowLeft, Award, CreditCard, Layers } from 'lucide-react';

export const SupplierProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [supplier, setSupplier] = useState<MarketplaceSupplier | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await marketplaceAPI.getSupplier(Number(id));
      setSupplier(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [id]);

  if (loading || !supplier) {
    return <div className="p-16 text-center text-xs text-slate-500">Loading supplier profile & inventory catalog...</div>;
  }

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Back Button & Header */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </button>

        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(supplier.address)}`}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
        >
          Google Maps Directions <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Supplier Overview Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded bg-blue-50 dark:bg-blue-950 text-blue-600 uppercase">
                {supplier.tier}
              </span>
              {supplier.is_verified && (
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center gap-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Business
                </span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{supplier.name}</h1>
            <p className="text-xs text-slate-500 font-medium">{supplier.company}</p>
          </div>

          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/60 px-4 py-2 rounded-2xl border border-amber-200 dark:border-amber-800">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white">{supplier.rating} / 5.0</div>
              <span className="text-[10px] text-slate-500">{supplier.review_count} Verified Reviews</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
          {supplier.description}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">GST Number</span>
            <span className="font-bold text-slate-900 dark:text-white">{supplier.gst_number || 'N/A'}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Registration</span>
            <span className="font-bold text-slate-900 dark:text-white">{supplier.business_registration || 'N/A'}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Working Hours</span>
            <span className="font-bold text-slate-900 dark:text-white">{supplier.opening_hours}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact</span>
            <span className="font-bold text-slate-900 dark:text-white">{supplier.phone}</span>
          </div>
        </div>
      </div>

      {/* Material & Inventory Catalog Table */}
      {supplier.materials && <SupplierInventoryCatalog materials={supplier.materials} />}

      {/* Reviews & Ratings Section */}
      <SupplierReviewSection
        supplierId={supplier.id}
        reviews={supplier.reviews || []}
        onReviewSubmitted={loadProfile}
      />
    </div>
  );
};
