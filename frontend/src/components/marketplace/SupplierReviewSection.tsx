import React, { useState } from 'react';
import type { SupplierReview } from '../../types';
import { marketplaceAPI } from '../../services/api';
import { Star, MessageSquare, Plus, Send } from 'lucide-react';

interface Props {
  supplierId: number;
  reviews: SupplierReview[];
  onReviewSubmitted: () => void;
}

export const SupplierReviewSection: React.FC<Props> = ({
  supplierId,
  reviews,
  onReviewSubmitted
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);

    try {
      await marketplaceAPI.submitReview(supplierId, {
        rating,
        comment
      });
      setComment('');
      setIsFormOpen(false);
      onReviewSubmitted();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" /> Contractor Reviews & Quality Ratings
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Verified site manager & structural engineer feedback</p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Review
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Rating:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <Star className={`w-4 h-4 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={2}
            placeholder="Share feedback regarding delivery lead time, batching quality, and customer service..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-1 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" /> Submit Review
            </button>
          </div>
        </form>
      )}

      {reviews.length === 0 ? (
        <div className="text-xs text-slate-400 py-3 italic">No reviews submitted yet for this supplier.</div>
      ) : (
        <div className="space-y-3">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 dark:text-white">{rev.user_name}</span>
                <span className="text-amber-500 font-bold flex items-center gap-1">
                  ★ {rev.rating} / 5.0
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{rev.comment}</p>
              <span className="text-[10px] text-slate-400 block">{new Date(rev.created_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
