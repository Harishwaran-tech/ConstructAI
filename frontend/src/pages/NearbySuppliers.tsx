import React, { useState, useEffect } from 'react';
import { marketplaceAPI } from '../services/api';
import type { MarketplaceSupplier } from '../types';
import { SupplierMapVisualizer } from '../components/marketplace/SupplierMapVisualizer';
import { RFQQuotationModal } from '../components/marketplace/RFQQuotationModal';
import { QuoteCompareModal } from '../components/marketplace/QuoteCompareModal';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Star, Building2, Search, ExternalLink, ShieldCheck, Clock, Truck, FileText, Heart, Award } from 'lucide-react';

export const NearbySuppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<MarketplaceSupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [maxDistance, setMaxDistance] = useState<number | undefined>(undefined);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('nearest');

  const [selectedSupplier, setSelectedSupplier] = useState<MarketplaceSupplier | null>(null);
  const [rfqModalOpen, setRfqModalOpen] = useState(false);

  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareIds, setCompareIds] = useState<number[]>([]);

  const navigate = useNavigate();

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const res = await marketplaceAPI.getSuppliers({
        category: category === 'All' ? undefined : category,
        max_distance: maxDistance,
        verified_only: verifiedOnly,
        q: search || undefined,
        sort_by: sortBy
      });
      setSuppliers(res);
      if (res.length > 0 && !selectedSupplier) {
        setSelectedSupplier(res[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, [search, category, maxDistance, verifiedOnly, sortBy]);

  const toggleFavorite = async (id: number) => {
    await marketplaceAPI.toggleFavorite(id);
    loadSuppliers();
  };

  const handleOpenCompare = () => {
    const ids = suppliers.slice(0, 2).map((s) => s.id);
    setCompareIds(ids);
    setCompareModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-600" /> Regional Supplier Marketplace & Geolocation Hub
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Discover verified stockists, ready-mix plants, request RFQs, check live inventory, and view distance routes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setRfqModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-4 h-4" /> Request Quotation (RFQ)
          </button>

          <button
            onClick={handleOpenCompare}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-100 flex items-center gap-1.5"
          >
            <Award className="w-4 h-4 text-amber-500" /> Compare Quotes
          </button>
        </div>
      </div>

      {/* Interactive Google Maps / Geolocation Route Visualizer */}
      <SupplierMapVisualizer suppliers={suppliers} selectedSupplier={selectedSupplier} />

      {/* Search & Multi-Filters Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search supplier, company, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {['All', 'Cement', 'Steel', 'Sand', 'AAC Blocks', 'Plumbing'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                category === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
          >
            <option value="nearest">Sort: Nearest</option>
            <option value="highest_rated">Sort: Highest Rated</option>
          </select>

          <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            Verified Only
          </label>
        </div>
      </div>

      {/* Supplier Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Scanning regional supplier databases...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((s) => {
            const isSelected = selectedSupplier?.id === s.id;
            return (
              <div
                key={s.id}
                onClick={() => setSelectedSupplier(s)}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/30 dark:bg-blue-950/20 border-blue-400 dark:border-blue-800 shadow-card'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 text-[10px] font-bold rounded bg-blue-50 dark:bg-blue-950 text-blue-600 uppercase">
                          {s.tier}
                        </span>
                        {s.is_verified && (
                          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 leading-snug">{s.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{s.company}</p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(s.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                      <span className="px-2 py-0.5 text-xs font-bold rounded-lg bg-amber-50 text-amber-700 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {s.rating}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{s.address} ({s.distance_miles} miles away)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{s.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>Delivery: {s.materials?.[0]?.delivery_time || '24 Hours'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/suppliers/${s.id}`);
                    }}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View Full Inventory Catalog &rarr;
                  </button>

                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(s.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    Google Maps <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RFQ Modal */}
      <RFQQuotationModal
        isOpen={rfqModalOpen}
        onClose={() => setRfqModalOpen(false)}
        suppliers={suppliers}
      />

      {/* Compare Modal */}
      <QuoteCompareModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        supplierIds={compareIds}
      />
    </div>
  );
};
