import React, { useState, useRef } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Upload,
  FileText,
  Save,
  AlertCircle,
  ClipboardPaste,
  Database,
  ArrowRight,
} from 'lucide-react';
import { Direction, Employee } from '../types';
import { exportDataToJson, importDataFromJson } from '../utils/storage';

interface DataBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  directions: Direction[];
  onApplyImportedData: (employees: Employee[], directions: Direction[]) => void;
  onShowToast: (title: string, message: string, type: 'success' | 'warning' | 'info') => void;
}

export const DataBackupModal: React.FC<DataBackupModalProps> = ({
  isOpen,
  onClose,
  employees,
  directions,
  onApplyImportedData,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'copy' | 'paste'>('copy');
  const [copied, setCopied] = useState(false);
  const [pasteInput, setPasteInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentJsonString = exportDataToJson(employees, directions);

  // Copy to clipboard handler
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentJsonString);
      setCopied(true);
      onShowToast(
        'Данные скопированы!',
        'Полная структура данных скопирована в буфер обмена.',
        'success'
      );
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = currentJsonString;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      onShowToast(
        'Данные скопированы!',
        'Полная структура данных скопирована в буфер обмена.',
        'success'
      );
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Download JSON file
  const handleDownload = () => {
    const blob = new Blob([currentJsonString], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `construction_data_${timestamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowToast('Файл скачан', `Файл construction_data_${timestamp}.json успешно сохранен.`, 'info');
  };

  // Paste from clipboard button
  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setPasteInput(text);
        setErrorMessage(null);
        onShowToast('Текст вставлен', 'Данные из буфера обмена вставлены в поле.', 'info');
      }
    } catch {
      onShowToast(
        'Доступ к буферу ограничен',
        'Нажмите в текстовое поле и используйте сочетание клавиш Ctrl + V',
        'warning'
      );
    }
  };

  // File selection or drop
  const handleFile = (file: File) => {
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setErrorMessage('Пожалуйста, выберите файл с расширением .json');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setPasteInput(content);
      setErrorMessage(null);
      onShowToast('Файл прочитан', `Загружен файл «${file.name}». Нажмите «Применить и сохранить».`, 'info');
    };
    reader.onerror = () => {
      setErrorMessage('Не удалось прочитать выбранный файл.');
    };
    reader.readAsText(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  // Apply imported data and immediately save to LocalStorage
  const handleApply = () => {
    setErrorMessage(null);
    if (!pasteInput.trim()) {
      setErrorMessage('Вставьте JSON-данные или выберите файл перед сохранением.');
      return;
    }

    const result = importDataFromJson(pasteInput, directions);
    if (!result.success) {
      setErrorMessage(result.error || 'Ошибка при чтении данных.');
      return;
    }

    const newEmployees = result.employees || [];
    const newDirections = result.directions || directions;

    onApplyImportedData(newEmployees, newDirections);
    onShowToast(
      'Данные успешно импортированы!',
      `Сохранено в LocalStorage: сотрудников — ${newEmployees.length}, направлений — ${newDirections.length}.`,
      'success'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F27D26]/10 border border-[#F27D26]/30 flex items-center justify-center text-[#F27D26]">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-snug">
                Копирование и вставка данных (Backup / Import)
              </h2>
              <p className="text-xs text-white/50">
                Копируйте данные в буфер, скачивайте файл или вставляйте новые данные с сохранением в LocalStorage
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-white/10 bg-[#0a0a0a] px-6 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('copy')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'copy'
                ? 'border-[#F27D26] text-[#F27D26]'
                : 'border-transparent text-white/40 hover:text-white/70'
            }`}
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Скопировать / Скачать файл</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'paste'
                ? 'border-[#F27D26] text-[#F27D26]'
                : 'border-transparent text-white/40 hover:text-white/70'
            }`}
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span>Вставить / Загрузить файл</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'copy' ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-xs text-white/70">
                  <span className="font-semibold text-white">Текущие данные:</span>{' '}
                  <span className="text-[#F27D26] font-bold">{employees.length}</span> сотрудников,{' '}
                  <span className="text-[#F27D26] font-bold">{directions.length}</span> направлений.
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all active:scale-95 cursor-pointer ${
                      copied
                        ? 'bg-emerald-500 text-black shadow-md'
                        : 'bg-[#F27D26] hover:bg-[#ff8c3a] text-black shadow-md shadow-[#F27D26]/20'
                    }`}
                  >
                    {copied ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Скопировано в буфер!' : 'Скопировать JSON'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Скачать .json файл</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1.5">
                  Текст данных (JSON для ручного копирования):
                </label>
                <div className="relative">
                  <textarea
                    readOnly
                    value={currentJsonString}
                    rows={11}
                    className="w-full font-mono text-[11px] p-3 rounded-xl bg-[#080808] border border-white/10 text-emerald-400/90 leading-relaxed focus:outline-none focus:border-[#F27D26]/50 select-all scrollbar-thin resize-none"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] flex items-center gap-1 backdrop-blur-sm transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Скопировано' : 'Копировать'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                  dragOver
                    ? 'border-[#F27D26] bg-[#F27D26]/10'
                    : 'border-white/15 hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.04]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <Upload className="w-6 h-6 mx-auto mb-2 text-[#F27D26]" />
                <p className="text-xs font-semibold text-white">
                  Перетащите файл .json сюда или нажмите для выбора
                </p>
                <p className="text-[11px] text-white/40 mt-0.5">
                  Принимаются любые сохраненные ранее JSON-файлы с базой
                </p>
              </div>

              {/* Paste area */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-white/60">
                    Или вставьте скопированный JSON-текст:
                  </label>
                  <button
                    type="button"
                    onClick={handlePasteFromClipboard}
                    className="inline-flex items-center gap-1 text-[11px] text-[#F27D26] hover:underline cursor-pointer"
                  >
                    <ClipboardPaste className="w-3 h-3" />
                    <span>Вставить из буфера обмена</span>
                  </button>
                </div>
                <textarea
                  value={pasteInput}
                  onChange={(e) => {
                    setPasteInput(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder='Вставьте сюда JSON (например: {"employees": [...], "directions": [...]})'
                  rows={9}
                  className="w-full font-mono text-[11px] p-3 rounded-xl bg-[#080808] border border-white/10 text-white leading-relaxed focus:outline-none focus:border-[#F27D26] transition-colors scrollbar-thin resize-none"
                />
              </div>

              {errorMessage && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#0e0e0e] flex items-center justify-between">
          <div className="text-[11px] text-white/40 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-[#F27D26]" />
            <span>Данные автоматически синхронизируются с LocalStorage браузера</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Закрыть
            </button>
            {activeTab === 'paste' && (
              <button
                type="button"
                onClick={handleApply}
                disabled={!pasteInput.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F27D26] hover:bg-[#ff8c3a] disabled:opacity-40 disabled:pointer-events-none text-black font-bold text-xs transition-all shadow-md shadow-[#F27D26]/20 active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4 stroke-[2.2]" />
                <span>Применить и сохранить в LocalStorage</span>
              </button>
            )}
            {activeTab === 'copy' && (
              <button
                type="button"
                onClick={() => setActiveTab('paste')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs transition-all active:scale-95 cursor-pointer"
              >
                <span>Перейти к вставке</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
