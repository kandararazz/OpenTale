import React from 'react';
import { useReading } from '../context/ReadingContext';
import { exportToEPUB, exportToPDF, exportToMarkdown, exportToJSON } from '../utils/exporter';
import { X, Download, FileText, Printer, Code, BookOpen } from 'lucide-react';

export const ExportModal = () => {
  const { isExportModalOpen, setIsExportModalOpen, targetBookForExport, currentBook } = useReading();

  if (!isExportModalOpen) return null;

  const bookToExport = targetBookForExport || currentBook;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl border border-cozy-border shadow-2xl overflow-hidden space-y-6 p-6 md:p-8 animate-scale-up">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cozy-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-playful font-extrabold text-lg text-slate-800">
                Export & Download Story
              </h3>
              <p className="text-xs text-cozy-muted">Package story into standard formats</p>
            </div>
          </div>
          <button 
            onClick={() => setIsExportModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Book Banner */}
        <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 text-sky-900">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600 block">Exporting</span>
          <h4 className="font-serif font-bold text-base text-slate-900 line-clamp-1">{bookToExport?.title}</h4>
        </div>

        {/* Export Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          <button
            onClick={() => { exportToEPUB(bookToExport); setIsExportModalOpen(false); }}
            className="p-4 rounded-2xl border border-cozy-border bg-cozy-bg/40 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all text-left space-y-1 group"
          >
            <BookOpen className="w-5 h-5 text-sky-500 group-hover:text-white" />
            <h5 className="font-bold text-xs text-slate-800 group-hover:text-white">EPUB Reader</h5>
            <p className="text-[10px] text-cozy-muted group-hover:text-white/80">Standard e-reader format</p>
          </button>

          <button
            onClick={() => { exportToPDF(bookToExport); setIsExportModalOpen(false); }}
            className="p-4 rounded-2xl border border-cozy-border bg-cozy-bg/40 hover:bg-peach-500 hover:text-white hover:border-peach-500 transition-all text-left space-y-1 group"
          >
            <Printer className="w-5 h-5 text-peach-500 group-hover:text-white" />
            <h5 className="font-bold text-xs text-slate-800 group-hover:text-white">PDF / Print</h5>
            <p className="text-[10px] text-cozy-muted group-hover:text-white/80">Printable document layout</p>
          </button>

          <button
            onClick={() => { exportToMarkdown(bookToExport); setIsExportModalOpen(false); }}
            className="p-4 rounded-2xl border border-cozy-border bg-cozy-bg/40 hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-all text-left space-y-1 group"
          >
            <FileText className="w-5 h-5 text-purple-500 group-hover:text-white" />
            <h5 className="font-bold text-xs text-slate-800 group-hover:text-white">Markdown (.md)</h5>
            <p className="text-[10px] text-cozy-muted group-hover:text-white/80">Clean raw text markup</p>
          </button>

          <button
            onClick={() => { exportToJSON(bookToExport); setIsExportModalOpen(false); }}
            className="p-4 rounded-2xl border border-cozy-border bg-cozy-bg/40 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all text-left space-y-1 group"
          >
            <Code className="w-5 h-5 text-emerald-500 group-hover:text-white" />
            <h5 className="font-bold text-xs text-slate-800 group-hover:text-white">JSON Data</h5>
            <p className="text-[10px] text-cozy-muted group-hover:text-white/80">Structured raw data</p>
          </button>

        </div>

      </div>
    </div>
  );
};
