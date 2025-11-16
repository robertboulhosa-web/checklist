
import React, { useState } from 'react';
import { Pendency, User, Comment } from '../types';
import { X, Send } from 'lucide-react';

interface PendencyModalProps {
  pendency: Pendency | null;
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (pendencyId: string, comment: Comment) => void;
}

const PendencyModal: React.FC<PendencyModalProps> = ({ pendency, user, isOpen, onClose, onAddComment }) => {
  const [newComment, setNewComment] = useState('');

  if (!isOpen || !pendency) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment: Comment = {
        id: `com-${Date.now()}`,
        author: user,
        text: newComment,
        timestamp: new Date(),
      };
      onAddComment(pendency.id, comment);
      setNewComment('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-2xl border border-border-light dark:border-border-dark w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-border-light dark:border-border-dark flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">Discussão da Pendência</h3>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{pendency.item}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-bkg-light dark:hover:bg-bkg-dark">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4 flex-grow overflow-y-auto space-y-4">
          {pendency.comments.map(comment => (
            <div key={comment.id} className="flex items-start space-x-3">
              <img src={comment.author.avatar} alt={comment.author.name} className="h-8 w-8 rounded-full" />
              <div className="flex-1 bg-bkg-light dark:bg-bkg-dark p-3 rounded-lg">
                <div className="flex justify-between items-baseline">
                  <p className="font-semibold text-sm">{comment.author.name}</p>
                  <time className="text-xs text-text-muted-light dark:text-text-muted-dark">{comment.timestamp.toLocaleString()}</time>
                </div>
                <p className="text-sm mt-1">{comment.text}</p>
              </div>
            </div>
          ))}
          {pendency.comments.length === 0 && <p className="text-center text-text-muted-light dark:text-text-muted-dark">Nenhum comentário ainda. Inicie a conversa!</p>}
        </div>

        <div className="p-4 border-t border-border-light dark:border-border-dark">
          <form onSubmit={handleSubmit} className="flex items-start space-x-3">
             <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Adicione um comentário..."
              className="w-full p-2 rounded-md border border-border-light dark:border-border-dark bg-bkg-light dark:bg-bkg-dark focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={2}
            />
            <button type="submit" className="p-2 rounded-lg bg-primary text-white hover:bg-primary-hover disabled:bg-gray-400" disabled={!newComment.trim()}>
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PendencyModal;
