import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, MessageSquare, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ApprovalsPage: React.FC = () => {
  const { approvals, handleApproval, addApprovalComment } = useApp();
  const [selectedApprovalId, setSelectedApprovalId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const selectedApproval = approvals.find((a) => a.id === selectedApprovalId);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApprovalId || !commentText.trim()) return;
    addApprovalComment(selectedApprovalId, commentText);
    setCommentText('');
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2D1B69]">Design Approvals & Review</h1>
        <p className="text-xs text-[#6B7280]">
          Review creator design submissions, leave feedback, and grant final campaign publishing sign-off.
        </p>
      </div>

      {/* Approvals Cards Grid */}
      {approvals.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-[#E9D5FF] text-center space-y-4 max-w-md mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-[#F3F0FF] text-[#8B5CF6] flex items-center justify-center mx-auto border border-[#E9D5FF]">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#2D1B69]">No Pending Approvals</h3>
          <p className="text-xs text-[#6B7280]">
            There are currently no design submissions awaiting review. Submissions from creators will appear here for feedback and approval.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvals.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl border border-[#E9D5FF] shadow-lavender-sm hover:shadow-lavender-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                
                {/* Asset Preview Frame */}
                <div className="relative aspect-video bg-[#F3F0FF] overflow-hidden group">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  <span
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md ${
                      item.status === 'approved'
                        ? 'bg-emerald-500 text-white'
                        : item.status === 'rejected'
                        ? 'bg-red-500 text-white'
                        : 'bg-[#8B5CF6] text-white'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Card Details */}
                <div className="p-5 space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B5CF6] bg-[#F3F0FF] px-2.5 py-0.5 rounded-md">
                    {item.campaignName}
                  </span>
                  <h3 className="font-bold text-sm text-[#2D1B69]">{item.title}</h3>

                  {/* Creator info */}
                  <div className="flex items-center justify-between pt-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <img src={item.creatorAvatar} alt="" className="w-6 h-6 rounded-full object-cover border border-[#C4B5FD]" />
                      <span className="font-bold text-[#2D1B69] text-[11px]">{item.creatorName}</span>
                    </div>
                    <span className="text-[10px] text-[#6B7280]">{item.submissionDate}</span>
                  </div>
                </div>

              </div>

              {/* Actions Bar */}
              <div className="p-4 bg-[#F8F7FF] border-t border-[#F3F0FF] flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedApprovalId(item.id)}
                  className="flex-1 py-2 bg-white text-[#8B5CF6] border border-[#E9D5FF] font-bold text-xs rounded-xl hover:bg-[#F3F0FF] transition-colors flex items-center justify-center space-x-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Comments ({item.comments.length})</span>
                </button>

                {item.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApproval(item.id, 'rejected')}
                      className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                      title="Reject / Request Revision"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleApproval(item.id, 'approved')}
                      className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-colors"
                      title="Approve Asset"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

            </motion.div>
          ))}
        </div>
      )}

      {/* Modal View for Comments & Feedback */}
      <AnimatePresence>
        {selectedApproval && (
          <div className="fixed inset-0 z-50 bg-[#2D1B69]/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-[#E9D5FF] shadow-2xl max-w-2xl w-full p-6 space-y-5 overflow-hidden"
            >
              
              <div className="flex items-center justify-between pb-3 border-b border-[#F3F0FF]">
                <div>
                  <h3 className="font-bold text-base text-[#2D1B69]">{selectedApproval.title}</h3>
                  <p className="text-xs text-[#6B7280]">Campaign: {selectedApproval.campaignName}</p>
                </div>
                <button
                  onClick={() => setSelectedApprovalId(null)}
                  className="text-xs font-bold text-[#6B7280] hover:text-[#2D1B69] p-1"
                >
                  ✕ Close
                </button>
              </div>

              {/* Modal Body */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden border border-[#E9D5FF] bg-[#F8F7FF] aspect-video">
                  <img src={selectedApproval.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>

                {/* Comments List */}
                <div className="flex flex-col justify-between space-y-3">
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    <p className="text-xs font-bold text-[#2D1B69]">Feedback Thread</p>
                    {selectedApproval.comments.map((c) => (
                      <div key={c.id} className="p-2.5 rounded-xl bg-[#F8F7FF] border border-[#E9D5FF] text-xs space-y-1">
                        <div className="flex justify-between items-center text-[10px] text-[#6B7280]">
                          <span className="font-bold text-[#2D1B69]">{c.author}</span>
                          <span>{c.time}</span>
                        </div>
                        <p className="text-[#6B7280] leading-snug">{c.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment Form */}
                  <form onSubmit={handlePostComment} className="flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write feedback..."
                      className="flex-1 px-3 py-2 rounded-xl border border-[#E9D5FF] text-xs bg-[#F8F7FF] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]"
                    />
                    <button
                      type="submit"
                      className="p-2 bg-[#8B5CF6] text-white rounded-xl hover:bg-[#7C3AED]"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div className="pt-3 border-t border-[#F3F0FF] flex justify-end space-x-3">
                <button
                  onClick={() => {
                    handleApproval(selectedApproval.id, 'rejected');
                    setSelectedApprovalId(null);
                  }}
                  className="px-4 py-2 bg-red-50 text-red-600 font-bold text-xs rounded-xl hover:bg-red-100"
                >
                  Request Revision
                </button>
                <button
                  onClick={() => {
                    handleApproval(selectedApproval.id, 'approved');
                    setSelectedApprovalId(null);
                  }}
                  className="px-6 py-2 bg-[#8B5CF6] text-white font-bold text-xs rounded-xl hover:bg-[#7C3AED] shadow-md"
                >
                  Approve Design
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
