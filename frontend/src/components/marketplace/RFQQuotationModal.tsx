import React, { useState } from 'react';
import { marketplaceAPI } from '../../services/api';
import type { MarketplaceSupplier } from '../../types';
import { FileText, Send, X, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  suppliers: MarketplaceSupplier[];
  projectId?: number;
}

export const RFQQuotationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  suppliers,
  projectId
}) => {
  if (!isOpen) return null;

  const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>(
    suppliers.slice(0, 2).map((s) => s.id)
  );

  const [items, setItems] = useState([
    { material_name: 'UltraTech Super Cement', qty: 500, unit: '50kg Bags' },
    { material_name: 'Tata Tiscon 550SD TMT', qty: 3500, unit: 'kg' }
  ]);

  const [notes, setNotes] = useState('Please include flat delivery charges and volumetric batch certificates for foundation slab pour.');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleSupplier = (id: number) => {
    if (selectedSuppliers.includes(id)) {
      setSelectedSuppliers(selectedSuppliers.filter((s) => s !== id));
    } else {
      setSelectedSuppliers([...selectedSuppliers, id]);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { material_name: 'Manufactured M-Sand', qty: 450, unit: 'cu ft' }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSuppliers.length === 0) return;
    setSubmitting(true);

    try {
      await marketplaceAPI.requestQuotation({
        project_id: projectId,
        supplier_ids: selectedSuppliers,
        items,
        notes
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Request for Quotation (RFQ)</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <p className="font-bold text-sm text-slate-900 dark:text-white">RFQ Dispatched Successfully!</p>
            <p className="text-xs text-slate-500">Quotation request sent to {selectedSuppliers.length} suppliers.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Target Suppliers */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Suppliers</label>
              <div className="flex flex-wrap gap-2">
                {suppliers.map((s) => {
                  const isChecked = selectedSuppliers.includes(s.id);
                  return (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => toggleSupplier(s.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
                        isChecked
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 border-slate-200'
                      }`}
                    >
                      {s.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Requested Line Items */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Requested Takeoff Items</label>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-blue-600 font-bold text-[11px] flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Line Item
                </button>
              </div>

              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.material_name}
                    onChange={(e) => {
                      const updated = [...items];
                      updated[idx].material_name = e.target.value;
                      setItems(updated);
                    }}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) => {
                      const updated = [...items];
                      updated[idx].qty = Number(e.target.value);
                      setItems(updated);
                    }}
                    className="w-20 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                  <input
                    type="text"
                    value={item.unit}
                    onChange={(e) => {
                      const updated = [...items];
                      updated[idx].unit = e.target.value;
                      setItems(updated);
                    }}
                    className="w-24 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <button type="button" onClick={() => handleRemoveItem(idx)} className="p-1.5 text-slate-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Additional Project Specifications & Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || selectedSuppliers.length === 0}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> Send RFQ to Vendors
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
