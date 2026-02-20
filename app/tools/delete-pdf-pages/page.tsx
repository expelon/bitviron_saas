"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
    Files,
    Upload,
    Trash2,
    Download,
    X,
    FileText,
    Zap,
    Shield,
    RotateCcw,
    Layers,
    Plus,
    Clock,
    Layout,
    ArrowUpRight,
    Search,
    Cpu,
    Terminal,
    CreditCard,
    ChevronRight,
    AlertCircle
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

// Configure PDF.js worker
const PDFJS_VERSION = '4.4.168';

interface PDFPage {
    id: string;
    originalIndex: number;
    thumbnail: string;
    fileName: string;
    fileSize: number;
    isDeleted: boolean;
}

export default function DeletePdfPagesPage() {
    const [file, setFile] = useState<File | null>(null);
    const [pages, setPages] = useState<PDFPage[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [pdfjsLib, setPdfjsLib] = useState<any>(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadPdfjs = async () => {
            try {
                // @ts-ignore
                const mod = await import('pdfjs-dist/build/pdf.min.mjs');
                mod.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.mjs`;
                setPdfjsLib(mod);
            } catch (error) {
                console.error("Failed to load PDF.js:", error);
            }
        };
        loadPdfjs();
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            await processFile(e.target.files[0]);
        }
    };

    const onDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(false);
        if (e.dataTransfer.files?.[0]) {
            await processFile(e.dataTransfer.files[0]);
        }
    };

    const processFile = async (newFile: File) => {
        if (newFile.type !== 'application/pdf') {
            setError("Please upload a PDF file only.");
            return;
        }

        if (!pdfjsLib) {
            setError("PDF engine is still loading. Please wait a moment.");
            return;
        }

        setError(null);
        setIsProcessing(true);
        setFile(newFile);
        const newPages: PDFPage[] = [];

        try {
            const arrayBuffer = await newFile.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            const pageCount = pdf.numPages;

            for (let i = 1; i <= pageCount; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 0.3 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if (context) {
                    await page.render({ canvasContext: context, viewport }).promise;
                    newPages.push({
                        id: `page-${i}-${Math.random().toString(36).substring(7)}`,
                        originalIndex: i - 1,
                        thumbnail: canvas.toDataURL(),
                        fileName: newFile.name,
                        fileSize: newFile.size,
                        isDeleted: false
                    });
                }
            }
            setPages(newPages);
        } catch (error) {
            console.error("Error processing PDF:", error);
            setError("Failed to process PDF.");
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleDelete = (id: string) => {
        setPages(prev => prev.map(p =>
            p.id === id ? { ...p, isDeleted: !p.isDeleted } : p
        ));
    };

    const reset = () => {
        setFile(null);
        setPages([]);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const exportPdf = async () => {
        const activePages = pages.filter(p => !p.isDeleted);
        if (!file || activePages.length === 0) {
            if (activePages.length === 0 && pages.length > 0) {
                setError("Cannot export a PDF with zero pages. Please keep at least one page.");
            }
            return;
        }

        setIsExporting(true);
        setError(null);

        try {
            const buffer = await file.arrayBuffer();
            const srcDoc = await PDFDocument.load(buffer);
            const destinationDoc = await PDFDocument.create();

            const pageIndices = activePages.map(p => p.originalIndex);
            const copiedPages = await destinationDoc.copyPages(srcDoc, pageIndices);
            copiedPages.forEach(p => destinationDoc.addPage(p));

            const pdfBytes = await destinationDoc.save();
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `modified_${file.name}`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Export failed:", error);
            setError("Failed to generate modified PDF.");
        } finally {
            setIsExporting(false);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const deletedCount = pages.filter(p => p.isDeleted).length;

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-black selection:bg-black selection:text-white pt-32 pb-40 px-6 md:px-12 w-full overflow-x-hidden font-sans">
            <div className="max-w-[1600px] mx-auto">

                {/* Editorial Hero */}
                <div className="grid grid-cols-12 gap-6 md:gap-8 mb-16 md:mb-24 border-b border-black pb-8 md:pb-12 items-end">
                    <div className="col-span-12 lg:col-span-9">
                        <div className="flex items-center gap-3 mb-6 md:mb-8">
                            <span className="w-8 md:w-12 h-[1px] bg-black"></span>
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] font-mono">Precision Utilities // {new Date().getFullYear()}</span>
                        </div>
                        <h1 className="text-5xl md:text-[8vw] font-bold leading-[0.85] tracking-tighter uppercase text-black">
                            Delete PDF<br />Pages.
                        </h1>
                    </div>

                    <div className="col-span-12 lg:col-span-3 flex flex-col justify-end lg:items-end text-left lg:text-right mt-6 lg:mt-0">
                        <div className="max-w-xs space-y-6">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] font-mono">
                                [ Operation: Reduction ]<br />
                                High-precision page removal module.
                            </p>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
                                Suture your documents by removing unnecessary page structures. 100% locally executed.
                            </p>
                        </div>
                    </div>
                </div>

                {pages.length === 0 ? (
                    /* Initial Upload Zone */
                    <div className="max-w-4xl mx-auto">
                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnter={() => setIsDragActive(true)}
                            onDragLeave={() => setIsDragActive(false)}
                            onDrop={onDrop}
                            className={`border border-black rounded-none p-10 md:p-32 text-center group transition-all duration-500 cursor-pointer relative overflow-hidden ${isDragActive
                                ? "bg-slate-50"
                                : "bg-white hover:bg-slate-50"
                                }`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="absolute left-[-1px] top-0 w-[1px] h-0 bg-black group-hover:h-full transition-all duration-700 ease-in-out"></div>

                            {isProcessing && (
                                <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center animate-fadeIn">
                                    <div className="w-16 h-16 border-2 border-black border-t-transparent rounded-full animate-spin mb-6"></div>
                                    <p className="text-xs font-bold uppercase tracking-[0.3em] font-mono">Auditing Bytecode...</p>
                                </div>
                            )}

                            <input
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />

                            <div className="flex flex-col items-center gap-6">
                                <div className={`w-16 h-16 rounded-full border border-black flex items-center justify-center transition-all duration-700 ${isDragActive ? 'bg-black text-white rotate-180 scale-125' : 'group-hover:rotate-12 group-hover:bg-slate-100'}`}>
                                    <Trash2 className="w-6 h-6" />
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold tracking-tighter uppercase italic">
                                        {isDragActive ? "Confirm Transfer" : "Source PDF Input"}
                                    </h2>
                                    <div className="flex items-center justify-center gap-3">
                                        <span className="h-[1px] w-4 bg-slate-300"></span>
                                        <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Select asset for page removal</p>
                                        <span className="h-[1px] w-4 bg-slate-300"></span>
                                    </div>
                                </div>

                                <button
                                    disabled={isProcessing}
                                    className="bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] py-5 px-10 rounded-full hover:scale-105 transition-all shadow-xl disabled:opacity-50 mt-4 group/btn flex items-center gap-3"
                                >
                                    {isProcessing ? "Processing..." : "Select Document"}
                                    {!isProcessing && <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />}
                                </button>
                            </div>

                            {error && (
                                <div className="mt-6 p-4 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-[0.1em] font-mono animate-fadeIn flex items-center justify-center gap-3">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Editor Zone */
                    <div className="space-y-8 animate-fadeIn">
                        {/* Control Center */}
                        <div className="flex flex-col md:flex-row flex-wrap items-center justify-between gap-6 bg-white p-6 md:p-8 border-b border-t border-black sticky top-16 md:top-24 z-30 mb-20 animate-slideUp">
                            <div className="flex flex-row items-center justify-between w-full md:w-auto gap-4 md:gap-10">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-100 text-black flex items-center justify-center font-mono text-[10px] md:text-xs font-bold flex-shrink-0">
                                        {pages.length}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono italic whitespace-nowrap">Initial Volume</span>
                                        <span className="text-xs md:text-sm font-bold uppercase tracking-tighter">Total Pages</span>
                                    </div>
                                </div>
                                <div className="h-8 md:h-10 w-[1px] bg-slate-200"></div>
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${deletedCount > 0 ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-300'} flex items-center justify-center font-mono text-[10px] md:text-xs font-bold transition-all duration-500 flex-shrink-0`}>
                                        {deletedCount}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono italic whitespace-nowrap">Queued for Deletion</span>
                                        <span className={`text-xs md:text-sm font-bold uppercase tracking-tighter ${deletedCount > 0 ? 'text-red-500' : ''}`}>Removed</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center md:justify-end gap-2 md:gap-3 w-full md:w-auto">
                                <button
                                    onClick={reset}
                                    className="px-4 md:px-6 py-2.5 md:py-3 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] font-mono border border-slate-200 rounded-full hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all text-slate-500 bg-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={exportPdf}
                                    disabled={isExporting || pages.length === deletedCount}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-3 md:gap-4 px-6 md:px-10 py-2.5 md:py-3 bg-black text-white rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] font-mono hover:scale-105 transition-all shadow-xl disabled:opacity-50 group/export"
                                >
                                    {isExporting ? (
                                        <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Download className="w-3 h-3 md:w-4 md:h-4 group-hover/export:translate-y-0.5 transition-transform" />
                                    )}
                                    {isExporting ? "Processing..." : "Export Modified PDF"}
                                </button>
                            </div>

                            {error && (
                                <div className="w-full text-center text-red-500 text-[10px] font-bold font-mono uppercase tracking-widest animate-pulse mt-2">
                                    [ ERROR: {error} ]
                                </div>
                            )}
                        </div>

                        {/* Page Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-8 md:gap-x-12 gap-y-16 md:gap-y-24">
                            {pages.map((page, idx) => (
                                <div
                                    key={page.id}
                                    className={`group relative flex flex-col gap-4 animate-fadeIn transition-all duration-500 ${page.isDeleted ? 'opacity-40 grayscale scale-95' : ''}`}
                                    style={{ animationDelay: `${idx * 40}ms` }}
                                >
                                    <div
                                        className={`relative bg-white rounded-none border overscroll-none overflow-hidden transition-all duration-500 shadow-sm cursor-pointer ${page.isDeleted ? 'border-red-200 bg-red-50/30' : 'border-slate-100 hover:border-black group-hover:shadow-xl'}`}
                                        onClick={() => toggleDelete(page.id)}
                                    >
                                        <div className="aspect-[3/4] w-full bg-slate-50 relative group/preview overflow-hidden">
                                            <img
                                                src={page.thumbnail}
                                                alt={`Page ${idx + 1}`}
                                                className="w-full h-full object-contain p-4 transition-transform duration-700"
                                            />

                                            {/* Technical Index Overlay */}
                                            <div className={`absolute top-2 left-2 px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-widest transition-colors duration-500 ${page.isDeleted ? 'bg-red-500 text-white' : 'bg-white/90 border border-slate-100 text-slate-400'}`}>
                                                PAGE_{idx + 1}
                                            </div>

                                            {/* Status Overlay */}
                                            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${page.isDeleted ? 'bg-red-500/10 opacity-100' : 'opacity-0'}`}>
                                                <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center shadow-2xl">
                                                    <Trash2 className="w-5 h-5" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Interaction Bar */}
                                        <div className={`py-4 px-4 flex items-center justify-between border-t transition-colors duration-500 ${page.isDeleted ? 'border-red-100' : 'border-slate-50'}`}>
                                            <span className={`text-[10px] font-mono font-bold uppercase tracking-tighter ${page.isDeleted ? 'text-red-500' : 'text-slate-400'}`}>
                                                {page.isDeleted ? "DELETED" : "ACTIVE"}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${page.isDeleted ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-1 flex justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity">
                                        <p className="text-[9px] font-mono text-slate-400 uppercase tracking-tighter">STRUCT_P.{idx + 1}</p>
                                        {!page.isDeleted && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleDelete(page.id); }}
                                                className="text-[9px] font-bold text-slate-900 border-b border-transparent hover:border-black transition-all font-mono"
                                            >
                                                REMOVE
                                            </button>
                                        )}
                                        {page.isDeleted && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleDelete(page.id); }}
                                                className="text-[9px] font-bold text-red-500 border-b border-transparent hover:border-red-500 transition-all font-mono"
                                            >
                                                RESTORE
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Technical Specs / Features Grid */}
                <div className="mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                    <FeatureCard
                        icon={<Trash2 className="w-6 h-6 text-black" />}
                        title="Atomic Removal"
                        description="Surgically remove individual pages or ranges from any PDF document with instant visual feedback."
                    />
                    <FeatureCard
                        icon={<Shield className="w-6 h-6 text-black" />}
                        title="Zero Data Leaks"
                        description="Military-grade privacy. All page selection and document reconstruction occurs within your browser's runtime."
                    />
                    <FeatureCard
                        icon={<RotateCcw className="w-6 h-6 text-black" />}
                        title="Instant Recovery"
                        description="Accidentally deleted a page? Our non-destructive editor allows for immediate restoration before export."
                    />
                    <FeatureCard
                        icon={<Zap className="w-6 h-6 text-black" />}
                        title="Low Latency"
                        description="Proprietary client-side rendering engine ensures high-speed thumbnail generation even for massive docs."
                    />
                    <FeatureCard
                        icon={<Layers className="w-6 h-6 text-black" />}
                        title="Structural Integrity"
                        description="Engineered to preserve all internal metadata, links, and PDF structure after page extraction."
                    />
                    <FeatureCard
                        icon={<CreditCard className="w-6 h-6 text-black" />}
                        title="Unlimited Access"
                        description="Full utility access with zero usage throttles, account requirements, or watermark injections."
                    />
                </div>

                {/* FAQ / Support */}
                <div className="mt-40 pt-20 border-t border-black">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        <div>
                            <div className="text-xs font-bold uppercase tracking-[0.3em] font-mono text-slate-400 mb-4 inline-block border-l-2 border-black pl-4">Support</div>
                            <h2 className="text-5xl font-bold tracking-tighter uppercase mb-8">Frequently<br />Asked Questions</h2>
                            <p className="text-[10px] text-slate-500 mb-8 font-mono uppercase tracking-widest">[ Status: 100% Core Operational ]</p>
                        </div>

                        <div className="space-y-4">
                            <FAQItem
                                question="Does deleting pages reduce file size?"
                                answer="Yes. By removing pages, you are directly reducing the amount of data in the document, which often results in a significantly smaller file size."
                            />
                            <FAQItem
                                question="Is there a limit to how many pages I can delete?"
                                answer="Technically no, but a PDF must have at least one page to be valid. You can remove as many pages as you like as long as one remains for export."
                            />
                            <FAQItem
                                question="Are the deleted pages gone forever?"
                                answer="Only after you export and download the new PDF. Within the editor, you can restore any deleted page simply by clicking it again."
                            />
                            <FAQItem
                                question="Can I delete pages from password-protected PDFs?"
                                answer="The tool currently only supports PDFs without encryption. If your PDF is protected, you must unlock it before using the deletion utility."
                            />
                        </div>
                    </div>
                </div>

                {/* Technical Footer */}
                <div className="mt-40 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30 select-none pointer-events-none font-mono text-[10px] uppercase tracking-widest">
                    <div className="flex gap-12">
                        <span className="flex items-center gap-2"><Cpu className="w-3 h-3" /> System: Bitviron_Core_v4</span>
                        <span className="flex items-center gap-2"><Terminal className="w-3 h-3" /> Terminal: Node_Edge</span>
                    </div>
                    <span>Bitviron Professional Utilities © {new Date().getFullYear()}</span>
                    <div className="flex gap-12">
                        <span>Latency: 2ms</span>
                        <span>Region: Local_Runtime</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="space-y-6 group border-l border-slate-100 pl-8 hover:border-black transition-colors duration-500">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-slate-200 group-hover:-rotate-6 transition-all duration-500">
                {icon}
            </div>
            <div className="space-y-3">
                <h3 className="text-xl font-bold tracking-tight uppercase">{title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">{description}</p>
            </div>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-slate-100 rounded-none overflow-hidden bg-white hover:border-black transition-all duration-500 group">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left"
            >
                <div className="flex items-center gap-4 md:gap-6">
                    <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[8px] md:text-[10px] font-bold transition-all duration-500 ${isOpen ? 'bg-black text-white rotate-180' : 'bg-slate-100 text-slate-400 group-hover:bg-black group-hover:text-white'}`}>
                        {isOpen ? '↓' : '?'}
                    </div>
                    <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-slate-800">{question}</span>
                </div>
                <div className={`text-slate-300 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronRight className="w-4 h-4" />
                </div>
            </button>
            {isOpen && (
                <div className="px-10 pb-10 pt-0 text-slate-500 text-xs font-mono uppercase tracking-widest leading-loose animate-fadeIn">
                    <span className="text-black mr-2 font-black">//</span> {answer}
                </div>
            )}
        </div>
    );
}
