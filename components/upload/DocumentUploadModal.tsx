'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Student, StudentDocument } from '@/types';
import { parseUploadedDocument, ExtractedExtractionResult } from '@/lib/documentExtractor';
import { useKalvikkanStore } from '@/lib/store';
import { Upload, FileText, Image as ImageIcon, CheckCircle2, Sparkles, FileSpreadsheet, AlertCircle } from 'lucide-react';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: Student | null;
  isBatchFacultyMode?: boolean;
  onSuccessToast?: (msg: string) => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  student,
  isBatchFacultyMode = false,
  onSuccessToast,
}) => {
  const { uploadStudentDocument, batchUpdateStudents } = useKalvikkanStore();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState<ExtractedExtractionResult | null>(null);
  const [manualText, setManualText] = useState('');

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsExtracting(true);

    try {
      const result = await parseUploadedDocument(file);
      setExtractionResult(result);
    } catch (err) {
      console.error('Extraction error:', err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleManualTextExtract = async () => {
    if (!manualText.trim()) return;
    setIsExtracting(true);
    const mockFile = new File([manualText], 'manual_transcript.txt', { type: 'text/plain' });
    const result = await parseUploadedDocument(mockFile, manualText);
    setExtractionResult(result);
    setIsExtracting(false);
  };

  const handleSubmit = () => {
    if (!extractionResult) return;

    if (isBatchFacultyMode && extractionResult.parsedRows) {
      batchUpdateStudents(extractionResult.parsedRows);
      if (onSuccessToast) {
        onSuccessToast(`Batch updated ${extractionResult.parsedRows.length} student records from uploaded CSV!`);
      }
    } else if (student) {
      const doc: StudentDocument = {
        id: `DOC-${Date.now().toString().slice(-4)}`,
        studentId: student.id,
        title: extractionResult.title,
        category: extractionResult.category,
        fileType: extractionResult.fileType,
        uploadDate: new Date().toISOString().split('T')[0],
        extractedMetrics: extractionResult.extractedMetrics,
        status: 'Verified',
        fileName: selectedFile?.name || 'transcript.txt',
      };

      uploadStudentDocument(student.id, doc);
      if (onSuccessToast) {
        onSuccessToast(`Document "${extractionResult.title}" extracted & student prediction updated!`);
      }
    }

    onClose();
    setSelectedFile(null);
    setExtractionResult(null);
    setManualText('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isBatchFacultyMode ? 'Batch Class Dataset & Marksheet Extraction' : `Upload Student Document • ${student?.name || ''}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4 text-slate-800 dark:text-slate-100">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900 rounded-xl text-xs text-indigo-900 dark:text-indigo-300">
          <p className="font-bold flex items-center gap-1.5 mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" /> Multimodal Extraction &amp; Auto-Prediction Engine
          </p>
          Upload certificates, marksheets, attendance slips, or CSV rosters in <strong>Image (PNG/JPG)</strong>, <strong>CSV</strong>, or <strong>Text</strong> format. Metrics are extracted to instantly update predictions.
        </div>

        {/* File Dropzone */}
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50 dark:bg-slate-900/50">
          <input
            type="file"
            id="doc-file-upload"
            accept=".png,.jpg,.jpeg,.csv,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="doc-file-upload" className="cursor-pointer block">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center mb-2">
              <Upload className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm text-slate-900 dark:text-white block">
              {selectedFile ? selectedFile.name : 'Click to Browse File (Image, CSV, or Text)'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
              Supports PNG, JPG, CSV marksheets, or TXT transcripts
            </span>
          </label>
        </div>

        {/* Text Transcript Box Option */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Or Paste Text Transcript / Assessment Slip
          </label>
          <div className="flex gap-2">
            <textarea
              rows={2}
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="e.g. Attendance: 88%, Score: 84%, Mathematics Quiz: 78"
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <Button variant="outline" size="sm" onClick={handleManualTextExtract}>
              Extract
            </Button>
          </div>
        </div>

        {/* Extraction Results Preview Card */}
        {isExtracting && (
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold animate-pulse flex items-center gap-2">
            <Sparkles className="w-4 h-4 animate-spin" /> Processing document through OCR Vision &amp; Parser engine...
          </div>
        )}

        {extractionResult && !isExtracting && (
          <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> OCR Extraction Successful
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-900 text-blue-200 text-[10px] font-bold uppercase">
                {extractionResult.category}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              {extractionResult.summaryMessage}
            </p>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center text-xs">
              <div className="p-2 rounded bg-slate-950">
                <span className="text-slate-400 text-[10px] block uppercase">Extracted Att %</span>
                <span className="font-bold text-white block mt-0.5">{extractionResult.extractedMetrics.attendance || '--'}%</span>
              </div>
              <div className="p-2 rounded bg-slate-950">
                <span className="text-slate-400 text-[10px] block uppercase">Extracted Score</span>
                <span className="font-bold text-white block mt-0.5">{extractionResult.extractedMetrics.score || '--'}%</span>
              </div>
              <div className="p-2 rounded bg-slate-950">
                <span className="text-slate-400 text-[10px] block uppercase">Prediction Bonus</span>
                <span className="font-bold text-emerald-400 block mt-0.5">+{extractionResult.extractedMetrics.certificateBonus || 2}%</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" disabled={!extractionResult} onClick={handleSubmit}>
            Apply Metrics &amp; Recalculate AI Prediction
          </Button>
        </div>
      </div>
    </Modal>
  );
};
