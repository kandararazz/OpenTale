import React, { useState, useRef } from 'react';
import { useReading } from '../context/ReadingContext';
import { parseUploadedFile } from '../utils/fileParser';
import { Download, Upload, FileText, Check, X, Sparkles, Database, Loader2 } from 'lucide-react';

export const LibraryImportModal = ({ isOpen, onClose }) => {
  const { bookmarks, vocabVault, showToast, addCustomBook } = useReading();
  const [dragActive, setDragActive] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [exportedFormat, setExportedFormat] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleProcessFile = async (file) => {
    if (!file) return;
    setIsParsing(true);
    try {
      const parsedBook = await parseUploadedFile(file);
      addCustomBook(parsedBook);
      onClose();
    } catch (e) {
      console.error(e);
      showToast('Failed to parse file. Please try another text, epub, or pdf document.', '⚠️');
    } finally {
      setIsParsing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleExportMarkdown = (formatName) => {
    let markdownContent = `# OpenTale Knowledge Base Export (${formatName})\n\n`;
    markdownContent += `## 📚 Book Highlights & Saved Bookmarks\n`;
    bookmarks.forEach(b => {
      markdownContent += `- **${b.bookTitle}**: ${b.title} (Page ${b.pageIndex + 1})\n`;
    });

    markdownContent += `\n## 🧠 Vocab Vault Saved Words\n`;
    vocabVault.forEach(v => {
      markdownContent += `### ${v.word} [${v.phonetic}]\n- **Definition**: ${v.definition}\n- **Example**: "${v.sentence}"\n\n`;
    });

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `opentale_export_${formatName.toLowerCase()}_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportedFormat(formatName);
    showToast(`Notes exported successfully for ${formatName}!`, '📥');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-confetti-bounce">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 shadow-2xl p-6 sm:p-8 max-w-xl w-full relative space-y-6 text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cozy-border pb-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-peach-500" />
            <h3 className="font-playful text-xl font-bold">Import Library & Knowledge Export</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-cozy-bg dark:bg-slate-800 text-cozy-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* EPUB/PDF Import Section */}
        <div className="space-y-2">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Upload className="w-4 h-4 text-peach-500" /> Direct EPUB, PDF & Text Import
          </h4>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".epub,.pdf,.txt,.md"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleProcessFile(e.target.files[0]);
              }
            }}
          />

          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-8 rounded-2xl border-2 border-dashed transition-all text-center space-y-2 cursor-pointer ${
              dragActive 
                ? 'border-peach-500 bg-peach-100/60 dark:bg-peach-900/40 scale-[1.02]' 
                : 'border-peach-300 bg-peach-50/50 dark:bg-peach-950/20 hover:border-peach-500 hover:bg-peach-100/30'
            }`}
          >
            {isParsing ? (
              <div className="py-2 space-y-2">
                <Loader2 className="w-8 h-8 text-peach-500 mx-auto animate-spin" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Parsing book into OpenTale chapters...</p>
              </div>
            ) : (
              <>
                <FileText className="w-8 h-8 text-peach-500 mx-auto animate-bounce" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Drag & drop EPUB, PDF, TXT, or .md files here, or click to browse
                </p>
                <p className="text-[11px] text-cozy-muted">Instant in-browser parsing with automatic local position cache</p>
              </>
            )}
          </div>
        </div>

        {/* Notion / Obsidian Export Section */}
        <div className="space-y-3 pt-2 border-t border-cozy-border dark:border-slate-800">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-500" /> One-Click Knowledge Base Export
          </h4>
          <p className="text-xs text-cozy-muted">
            Sync your {bookmarks.length} bookmarks and {vocabVault.length} saved vocabulary words directly into your PKM system:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleExportMarkdown('Notion')}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-peach-100 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all flex items-center justify-center gap-2"
            >
              📝 Export to Notion
            </button>

            <button
              onClick={() => handleExportMarkdown('Obsidian')}
              className="p-3 rounded-2xl border border-purple-200 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-xs font-bold text-purple-900 dark:text-purple-300 transition-all flex items-center justify-center gap-2"
            >
              💎 Export to Obsidian
            </button>

            <button
              onClick={() => handleExportMarkdown('Markdown')}
              className="p-3 rounded-2xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-xs font-bold text-emerald-900 dark:text-emerald-300 transition-all flex items-center justify-center gap-2"
            >
              📄 Download Markdown
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
