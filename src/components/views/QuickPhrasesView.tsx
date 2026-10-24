import React, { useState } from 'react';
import { 
  Search, 
  Star, 
  Plus, 
  Play, 
  Trash2, 
  ArrowUpRight, 
  MessageSquare,
  Filter,
  Copy,
  Check
} from 'lucide-react';
import { QuickPhrase, Language, QuickPhraseCategory } from '../../types';

interface QuickPhrasesViewProps {
  phrases: QuickPhrase[];
  onToggleFavorite: (id: string) => void;
  onAddPhrase: (phrase: Omit<QuickPhrase, 'id' | 'usageCount'>) => void;
  onDeletePhrase: (id: string) => void;
  onUsePhraseInComposer: (phrase: QuickPhrase, autoSpeak?: boolean) => void;
}

export const QuickPhrasesView: React.FC<QuickPhrasesViewProps> = ({
  phrases,
  onToggleFavorite,
  onAddPhrase,
  onDeletePhrase,
  onUsePhraseInComposer
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New phrase form state
  const [newText, setNewText] = useState('');
  const [newLanguage, setNewLanguage] = useState<Language>('en');
  const [newCategory, setNewCategory] = useState<QuickPhraseCategory>('Greetings');
  const [formError, setFormError] = useState<string | null>(null);

  const categories = [
    'All', 
    'Favorites', 
    'Greetings', 
    'Daily Conversation', 
    'Work & Professional', 
    'Thank You', 
    'Reassurance'
  ];

  const filteredPhrases = phrases.filter((phrase) => {
    const matchesSearch = phrase.text.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Favorites') return phrase.isFavorite;
    return phrase.category === selectedCategory;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) {
      setFormError('Please enter the phrase text.');
      return;
    }

    onAddPhrase({
      text: newText.trim(),
      language: newLanguage,
      category: newCategory,
      isFavorite: true
    });

    setNewText('');
    setFormError(null);
    setIsModalOpen(false);
  };

  const handleCopyPhrase = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getLanguagePill = (lang: Language) => {
    switch (lang) {
      case 'hi':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">हिंदी</span>;
      case 'hinglish':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">Hinglish</span>;
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">English</span>;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Quick Phrases Studio
          </h2>
          <p className="text-sm text-navy-500 mt-1">
            Access, save, and trigger frequently spoken phrases in your personal voice and tone.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 self-start sm:self-auto transition-all shadow-glow hover:shadow-card-hover"
        >
          <Plus className="w-4 h-4" />
          <span>New Quick Phrase</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-surface-border p-4 sm:p-5 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search phrases in Hindi, Hinglish, or English..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-warm border border-surface-border text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>

          {/* Result counter */}
          <span className="text-xs font-semibold text-navy-500 flex-shrink-0">
            {filteredPhrases.length} {filteredPhrases.length === 1 ? 'phrase' : 'phrases'} found
          </span>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-navy-400 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-xs font-bold'
                  : 'bg-surface-warm hover:bg-navy-100 text-navy-600 border border-surface-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Phrases Grid */}
      {filteredPhrases.length === 0 ? (
        <div className="bg-white rounded-3xl border border-surface-border p-12 text-center shadow-card">
          <div className="w-12 h-12 rounded-2xl bg-surface-warm flex items-center justify-center text-navy-400 mx-auto mb-3">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-navy-800 text-base">No phrases match your criteria</h3>
          <p className="text-xs text-navy-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or create a new custom quick phrase using the button above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPhrases.map((phrase) => (
            <div
              key={phrase.id}
              className="bg-white rounded-3xl border border-surface-border p-5 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Top badges & star */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    {getLanguagePill(phrase.language)}
                    <span className="text-[10px] font-semibold text-navy-500 bg-navy-50 px-2 py-0.5 rounded-md">
                      {phrase.category}
                    </span>
                  </div>

                  <button
                    onClick={() => onToggleFavorite(phrase.id)}
                    className="p-1.5 rounded-lg hover:bg-surface-warm transition-colors"
                    title={phrase.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star
                      className={`w-4 h-4 transition-colors ${
                        phrase.isFavorite
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-navy-300 hover:text-navy-500'
                      }`}
                    />
                  </button>
                </div>

                {/* Phrase Text */}
                <p className="text-sm font-semibold text-navy-900 leading-relaxed mb-4">
                  &ldquo;{phrase.text}&rdquo;
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-surface-border flex items-center justify-between gap-2">
                <span className="text-[11px] text-navy-400">
                  Used {phrase.usageCount} times
                </span>

                <div className="flex items-center gap-1.5">
                  {/* Copy button */}
                  <button
                    onClick={() => handleCopyPhrase(phrase.id, phrase.text)}
                    className="p-1.5 rounded-xl text-navy-400 hover:text-navy-700 hover:bg-surface-warm transition-colors"
                    title="Copy phrase text"
                  >
                    {copiedId === phrase.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => onUsePhraseInComposer(phrase, true)}
                    className="px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white border border-brand-200 hover:border-transparent font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs"
                    title="Load into composer and speak"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Speak</span>
                  </button>

                  <button
                    onClick={() => onUsePhraseInComposer(phrase, false)}
                    className="p-1.5 rounded-xl text-navy-400 hover:text-brand-600 hover:bg-surface-warm transition-colors"
                    title="Insert to composer without auto-speaking"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeletePhrase(phrase.id)}
                    className="p-1.5 rounded-xl text-navy-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete phrase"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Phrase Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-navy-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-surface-border shadow-2xl w-full max-w-md p-6 relative">
            <h3 className="text-lg font-bold text-navy-900 mb-1">Add New Quick Phrase</h3>
            <p className="text-xs text-navy-500 mb-4">
              Saved phrases appear in your shortcut bar on the home composer.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1.5">Phrase Text</label>
                <textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="e.g. Please give me five minutes to get back to you..."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-surface-warm border border-surface-border text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
                {formError && (
                  <p className="text-rose-600 text-xs font-medium mt-1">{formError}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1.5">Language</label>
                  <select
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value as Language)}
                    className="w-full p-2.5 rounded-xl bg-surface-warm border border-surface-border text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi (हिंदी)</option>
                    <option value="hinglish">Hinglish</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1.5">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as QuickPhraseCategory)}
                    className="w-full p-2.5 rounded-xl bg-surface-warm border border-surface-border text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="Greetings">Greetings</option>
                    <option value="Daily Conversation">Daily Conversation</option>
                    <option value="Work & Professional">Work & Professional</option>
                    <option value="Thank You">Thank You</option>
                    <option value="Reassurance">Reassurance</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-navy-600 hover:bg-surface-warm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-sm"
                >
                  Save Phrase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
