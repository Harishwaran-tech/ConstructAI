import React, { useState, useEffect } from 'react';
import { marketAPI } from '../services/api';
import type { MaterialPriceItem, MarketAnalytics } from '../types';
import { MarketAnalyticsHeader } from '../components/market/MarketAnalyticsHeader';
import { PriceTrendCharts } from '../components/market/PriceTrendCharts';
import { BrandCompareMatrix } from '../components/market/BrandCompareMatrix';
import { PriceAlertsManager } from '../components/market/PriceAlertsManager';
import { LivePricesTable } from '../components/market/LivePricesTable';
import { TrendingUp, Download, Printer, Award, Activity } from 'lucide-react';

export const BrandComparison: React.FC = () => {
  const [prices, setPrices] = useState<MaterialPriceItem[]>([]);
  const [analytics, setAnalytics] = useState<MarketAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [pRes, aRes] = await Promise.all([
        marketAPI.getLivePrices(),
        marketAPI.getAnalytics()
      ]);
      setPrices(pRes);
      setAnalytics(aRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExportCSV = () => {
    let csv = "Material,Category,Brand,Grade,Current Price,Previous Price,Pct Change,Supplier,Location\n";
    prices.forEach((p) => {
      csv += `"${p.name}","${p.category}","${p.brand}","${p.grade || ''}",${p.current_price},${p.previous_price},${p.pct_change},"${p.supplier_name || ''}","${p.location || ''}"\n`;
    });
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ConstructAI_Live_Market_Prices_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" /> Live Material Market Intelligence Hub
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pluggable real-time price feeds, multi-brand procurement matrix, trends, and automated threshold alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-100 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-emerald-500" /> Export CSV
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-100 flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-blue-500" /> Print
          </button>
        </div>
      </div>

      {loading || !analytics ? (
        <div className="p-16 text-center text-sm text-slate-500">Loading market intelligence feeds...</div>
      ) : (
        <>
          {/* Analytics Header & AI Market Copilot Insights */}
          <MarketAnalyticsHeader analytics={analytics} />

          {/* Interactive Recharts 7D/30D/1Y Price Trend Line & Bar Charts */}
          <PriceTrendCharts analytics={analytics} />

          {/* Side-by-Side Brand Comparison Procurement Matrix */}
          <BrandCompareMatrix />

          {/* Price Alert Triggers Manager */}
          <PriceAlertsManager />

          {/* Live Regional Material Spot Rates Table */}
          <LivePricesTable prices={prices} />
        </>
      )}
    </div>
  );
};
