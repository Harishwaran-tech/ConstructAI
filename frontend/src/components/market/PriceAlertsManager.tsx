import React, { useState, useEffect } from 'react';
import { marketAPI } from '../../services/api';
import type { PriceAlert } from '../../types';
import { Bell, Plus, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';

export const PriceAlertsManager: React.FC = () => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [materialName, setMaterialName] = useState('Tata Tiscon 550SD TMT');
  const [targetPrice, setTargetPrice] = useState<number>(0.88);
  const [condition, setCondition] = useState('below');

  const fetchAlerts = async () => {
    try {
      const data = await marketAPI.listAlerts();
      setAlerts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await marketAPI.createAlert({
        material_name: materialName,
        target_price: targetPrice,
        condition: condition
      });
      setIsModalOpen(false);
      fetchAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (id: number) => {
    await marketAPI.toggleAlert(id);
    fetchAlerts();
  };

  const handleDelete = async (id: number) => {
    await marketAPI.deleteAlert(id);
    fetchAlerts();
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" /> Automated Price Threshold Alerts
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Receive instant push notifications when market rates cross target triggers</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create Alert Trigger
        </button>
      </div>

      {loading ? (
        <div className="text-xs text-slate-400 py-4">Loading active alerts...</div>
      ) : alerts.length === 0 ? (
        <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          No automated price alerts configured yet. Click above to set up a trigger.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                alert.is_active
                  ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                  : 'bg-slate-100/50 dark:bg-slate-800/20 border-slate-200/50 opacity-60'
              }`}
            >
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Notify when {alert.condition}
                </span>
                <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{alert.material_name}</div>
                <div className="text-xs font-extrabold text-blue-600 dark:text-blue-400">${alert.target_price}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggle(alert.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                    alert.is_active
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border-emerald-200'
                      : 'bg-slate-200 text-slate-600 border-slate-300'
                  }`}
                >
                  {alert.is_active ? 'Active' : 'Disabled'}
                </button>
                <button
                  onClick={() => handleDelete(alert.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" /> Create Price Alert Trigger
            </h3>

            <form onSubmit={handleCreateAlert} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Material</label>
                <input
                  type="text"
                  required
                  value={materialName}
                  onChange={(e) => setMaterialName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="below">Price drops below</option>
                    <option value="above">Price exceeds above</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold"
                >
                  Set Alert Trigger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
