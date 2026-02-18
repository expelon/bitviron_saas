"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
    Files,
    Upload,
    Trash2,
    GripVertical,
    Plus,
    Download,
    X,
    FileText,
    Clock,
    Shield,
    RotateCcw,
    Zap,
    Layout,
    ArrowRight,
    ArrowUpRight,
    Loader2,
    CloudUpload,
    HelpCircle,
    ChevronRight,
    Cpu,
    Terminal,
    Scissors,
    Layers,
    CreditCard
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

// Configure PDF.js worker
const PDFJS_VERSION = '4.4.168';

interface PDFPage {
    id: string;
    originalIndex: number; // 0-based
    thumbnail: string;
    fileName: string;
    fileSize: number;
    isSelected: boolean;
}

export default function PdfSplitPage() {
    const [file, setFile] = useState<File | null>(null);
    const [pages, setPages] = useState<PDFPage[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSplitting, setIsSplitting] = useState(false);
    const [pdfjsLib, setPdfjsLib] = useState<any>(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [splitRange, setSplitRange] = useState('');
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
        setFile(newFile);
        setIsProcessing(true);
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
                        isSelected: false
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            processFile(e.target.files[0]);
        }
    };

    const togglePageSelection = (id: string) => {
        setPages(prev => prev.map(p =>
            p.id === id ? { ...p, isSelected: !p.isSelected } : p
        ));
    };

    const reset = () => {
        setFile(null);
        setPages([]);
        setSplitRange('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const executeExtract = async (type: 'selected' | 'all' | 'range') => {
        if (!file || pages.length === 0) return;
        setIsSplitting(true);

        try {
            const originalBuffer = await file.arrayBuffer();
            const originalDoc = await PDFDocument.load(originalBuffer);

            let pagesToExtract: number[] = [];

            if (type === 'selected') {
                pagesToExtract = pages.filter(p => p.isSelected).map(p => p.originalIndex);
            } else if (type === 'all') {
                pagesToExtract = pages.map(p => p.originalIndex);
                // If "all", we might want individual files, but for now we'll do one combined extraction of all
            } else if (type === 'range') {
                // Parse range like 1-5, 8, 10-12
                const ranges = splitRange.split(',').map(r => r.trim());
                ranges.forEach(r => {
                    if (r.includes('-')) {
                        const [start, end] = r.split('-').map(Number);
                        for (let i = start; i <= end; i++) {
                            if (i > 0 && i <= pages.length) pagesToExtract.push(i - 1);
                        }
                    } else {
                        const num = Number(r);
                        if (num > 0 && num <= pages.length) pagesToExtract.push(num - 1);
                    }
                });
                // Uniquify
                pagesToExtract = Array.from(new Set(pagesToExtract)).sort((a, b) => a - b);
            }

            if (pagesToExtract.length === 0) {
                setError("No pages selected or invalid range.");
                setIsSplitting(false);
                return;
            }

            const newPdf = await PDFDocument.create();
            const copiedPages = await newPdf.copyPages(originalDoc, pagesToExtract);
            copiedPages.forEach(p => newPdf.addPage(p));

            const pdfBytes = await newPdf.save();
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `split_${file.name}`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Split failed:", error);
            setError("Failed to split PDF.");
        } finally {
            setIsSplitting(false);
        }
    };

    const executeSplitAll = async () => {
        if (!file || pages.length === 0) return;
        setIsSplitting(true);

        try {
            const originalBuffer = await file.arrayBuffer();
            const originalDoc = await PDFDocument.load(originalBuffer);

            for (let i = 0; i < pages.length; i++) {
                const newPdf = await PDFDocument.create();
                const [copiedPage] = await newPdf.copyPages(originalDoc, [i]);
                newPdf.addPage(copiedPage);

                const pdfBytes = await newPdf.save();
                const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `page_${i + 1}_${file.name}`;
                link.click();
                URL.revokeObjectURL(url);
                // Artificial delay to prevent browser download blocking
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        } catch (error) {
            console.error("Split all failed:", error);
            setError("Failed to split all pages.");
        } finally {
            setIsSplitting(false);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const selectedCount = pages.filter(p => p.isSelected).length;

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
                            PDF Splitter<br />Engine.
                        </h1>
                    </div>

                    <div className="col-span-12 lg:col-span-3 flex flex-col justify-end lg:items-end text-left lg:text-right mt-6 lg:mt-0">
                        <div className="max-w-xs space-y-6">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] font-mono">
                                [ System Status: Active ]<br />
                                High-performance extraction module.
                            </p>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
                                Deconstruct PDF assets into discrete page volumes with surgical precision.
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
                            onDrop={async (e) => {
                                e.preventDefault();
                                setIsDragActive(false);
                                if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
                            }}
                            className={`border border-black rounded-none p-10 md:p-32 text-center group transition-all duration-500 cursor-pointer relative overflow-hidden ${isDragActive ? "bg-slate-50" : "bg-white hover:bg-slate-50"}`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="absolute left-[-1px] top-0 w-[1px] h-0 bg-black group-hover:h-full transition-all duration-700 ease-in-out"></div>

                            {isProcessing && (
                                <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center animate-fadeIn">
                                    <div className="w-16 h-16 border-2 border-black border-t-transparent rounded-full animate-spin mb-6"></div>
                                    <p className="text-xs font-bold uppercase tracking-[0.3em] font-mono">Deconstructing Bitstream...</p>
                                </div>
                            )}

                            <input type="file" accept=".pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

                            <div className="flex flex-col items-center gap-6">
                                <div className={`w-16 h-16 rounded-full border border-black flex items-center justify-center transition-all duration-700 ${isDragActive ? 'bg-black text-white rotate-180 scale-125' : 'group-hover:rotate-45 group-hover:bg-slate-100'}`}>
                                    <Scissors className="w-6 h-6" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold tracking-tighter uppercase italic">Source PDF Injection</h2>
                                    <div className="flex items-center justify-center gap-3">
                                        <span className="h-[1px] w-4 bg-slate-300"></span>
                                        <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Target one PDF asset</p>
                                        <span className="h-[1px] w-4 bg-slate-300"></span>
                                    </div>
                                </div>

                                <button
                                    disabled={isProcessing}
                                    className="bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] py-5 px-10 rounded-full hover:scale-105 transition-all shadow-xl disabled:opacity-50 mt-4 group/btn flex items-center gap-3"
                                >
                                    {isProcessing ? "Processing..." : "Upload File"}
                                    {!isProcessing && <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />}
                                </button>
                            </div>
                            {error && <div className="mt-6 p-4 bg-red-50 text-red-600 text-sm font-medium animate-fadeIn">{error}</div>}
                        </div>
                    </div>
                ) : (
                    /* Split Editor */
                    <div className="space-y-8 animate-fadeIn">
                        {/* Control Center */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-5 md:p-8 border-b border-t border-black sticky top-16 md:top-24 z-30 mb-20 animate-slideUp">
                            <div className="flex flex-row items-center justify-center md:justify-start gap-6 md:gap-10 w-full md:w-auto">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-black text-white flex items-center justify-center font-mono text-[9px] md:text-xs font-bold ring-4 ring-slate-100">
                                        {pages.length}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[7px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono italic">Total Pages</span>
                                        <span className="text-[10px] md:text-sm font-bold uppercase tracking-tighter">Inventory</span>
                                    </div>
                                </div>
                                <div className="h-8 md:h-10 w-[1px] bg-slate-200"></div>
                                <div className="flex flex-col">
                                    <span className="text-[7px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono italic">Selected</span>
                                    <span className="text-[10px] md:text-sm font-bold uppercase tracking-tighter">{selectedCount} Items</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                                {/* Range Input Group */}
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <input
                                        type="text"
                                        placeholder="Range (e.g. 1-3)"
                                        className="flex-1 sm:w-36 bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-[10px] font-mono uppercase tracking-widest focus:border-black outline-none transition-all"
                                        value={splitRange}
                                        onChange={(e) => setSplitRange(e.target.value)}
                                    />
                                    <button
                                        onClick={() => executeExtract('range')}
                                        disabled={!splitRange || isSplitting}
                                        className="px-4 md:px-6 py-2.5 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-[0.3em] font-mono hover:scale-105 transition-all disabled:opacity-30 whitespace-nowrap"
                                    >
                                        Range
                                    </button>
                                </div>

                                {/* Action Buttons Group */}
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={() => executeExtract('selected')}
                                        disabled={selectedCount === 0 || isSplitting}
                                        className="flex-1 sm:flex-none px-4 md:px-6 py-2.5 border border-black text-black rounded-full text-[10px] font-bold uppercase tracking-[0.3em] font-mono hover:bg-black hover:text-white transition-all disabled:opacity-30 whitespace-nowrap"
                                    >
                                        Extract
                                    </button>
                                    <button
                                        onClick={executeSplitAll}
                                        disabled={isSplitting}
                                        className="flex-1 sm:flex-none px-4 md:px-6 py-2.5 border border-slate-200 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] font-mono hover:border-black hover:text-black transition-all disabled:opacity-30 whitespace-nowrap"
                                    >
                                        All
                                    </button>
                                    <button onClick={reset} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><RotateCcw className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>

                        {/* Page Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-12 gap-y-24">
                            {pages.map((page, idx) => (
                                <div
                                    key={page.id}
                                    onClick={() => togglePageSelection(page.id)}
                                    className="group relative flex flex-col gap-4 cursor-pointer animate-fadeIn"
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    <div className={`relative bg-white border transition-all duration-500 overflow-hidden ${page.isSelected ? 'border-black ring-1 ring-black shadow-2xl' : 'border-slate-100 shadow-sm'}`}>
                                        <div className={`absolute top-2 right-2 w-5 h-5 rounded-full border z-20 flex items-center justify-center transition-all ${page.isSelected ? 'bg-black border-black text-white' : 'bg-white/80 border-slate-200 text-transparent'}`}>
                                            <Zap className="w-3 h-3 fill-current" />
                                        </div>
                                        <div className="aspect-[3/4] bg-slate-50 relative overflow-hidden">
                                            <img src={page.thumbnail} className={`w-full h-full object-contain p-4 transition-transform duration-700 ${page.isSelected ? 'scale-110' : 'group-hover:scale-105'}`} />
                                            <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-white/90 border border-slate-100 font-mono text-[8px] font-bold text-slate-400 uppercase">IDX_{idx + 1}</div>
                                        </div>
                                    </div>
                                    <div className={`px-1 space-y-2 border-l pl-4 transition-colors duration-500 ${page.isSelected ? 'border-black' : 'border-slate-100 group-hover:border-slate-300'}`}>
                                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-tighter">Origin: P.{idx + 1}</span>
                                        <p className="text-[10px] font-bold uppercase tracking-widest font-mono truncate">{formatSize(page.fileSize)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Technical Features */}
                <div className="mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                    <FeatureCard
                        icon={<Scissors className="w-6 h-6 text-black" />}
                        title="Asset Fragmentation"
                        description="Deconstruct PDF data streams into discrete page volumes with zero latency."
                    />
                    <FeatureCard
                        icon={<RotateCcw className="w-6 h-6 text-black" />}
                        title="Rapid Extraction"
                        description="Engineered for high-speed page isolation. Instant preview generation for granular control."
                    />
                    <FeatureCard
                        icon={<Shield className="w-6 h-6 text-black" />}
                        title="Vault Privacy"
                        description="End-to-end local processing. Your data never leaves the client-side execution environment."
                    />
                    <FeatureCard
                        icon={<CreditCard className="w-6 h-6 text-black" />}
                        title="Zero Cost Tier"
                        description="Full access to the Bitviron splitting engine with no subscription requirement or usage caps."
                    />
                    <FeatureCard
                        icon={<Layout className="w-6 h-6 text-black" />}
                        title="System Agnostic"
                        description="Optimized for all browser environments. No native installation or driver dependencies required."
                    />
                    <FeatureCard
                        icon={<FileText className="w-6 h-6 text-black" />}
                        title="Structural Integrity"
                        description="Automated checks on all split output to ensure valid, standard-compliant PDF structures."
                    />
                </div>

                {/* How it works */}
                <div className="mt-40 pt-20 border-t border-black">
                    <div className="flex items-center gap-3 mb-12">
                        <span className="w-12 h-[1px] bg-black"></span>
                        <span className="text-xs font-bold uppercase tracking-[0.3em] font-mono text-slate-400">Documentation // Workflow</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
                        <div className="space-y-0">
                            <Step num={1} text="Inject Asset" description="Upload a single PDF document into the splitting environment." />
                            <Step num={2} text="Segment Logic" description="Select specific pages or define range parameters for extraction." />
                            <Step num={3} text="Export Volumes" description="Execute the split process and download your new document segments." />
                        </div>
                        <div className="bg-slate-50 rounded-none p-6 md:p-12 border border-slate-200 flex items-center justify-center min-h-[400px] md:min-h-[500px] relative group overflow-hidden">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-black/5 blur-[80px] rounded-full -mr-16 -mt-16"></div>
                            <div className="relative z-10 scale-[0.7] md:scale-100">
                                <div className="w-56 h-72 bg-white border border-slate-200 rounded-none shadow-xl flex items-center justify-center transform -rotate-6 group-hover:-rotate-12 transition-all duration-700">
                                    <div className="flex flex-col items-center gap-2">
                                        <FileText className="w-12 h-12 text-slate-100" />
                                        <div className="w-8 h-[1px] bg-slate-100"></div>
                                        <FileText className="w-12 h-12 text-slate-100" />
                                    </div>
                                </div>
                                <div className="absolute top-8 left-12 w-56 h-72 bg-white border border-black rounded-none shadow-2xl flex items-center justify-center z-10 group-hover:translate-x-4 group-hover:-translate-y-4 transition-all duration-700">
                                    <div className="flex flex-col items-center gap-4">
                                        <Scissors className="w-10 h-10 text-black" />
                                        <span className="text-[10px] font-mono font-bold tracking-[0.4em] uppercase text-black">Split_Output</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-40 pt-20 border-t border-black">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        <div>
                            <div className="text-xs font-bold uppercase tracking-[0.3em] font-mono text-slate-400 mb-4 inline-block border-l-2 border-black pl-4">Support</div>
                            <h2 className="text-5xl font-bold tracking-tighter uppercase mb-8">Frequently<br />Asked Questions</h2>
                            <p className="text-slate-500 mb-4 font-mono text-xs uppercase tracking-widest">[ System status: All systems operational ]</p>
                            <p className="text-sm text-slate-500 leading-relaxed uppercase font-mono">
                                Could not find what you were looking for?<br />
                                Write us at <a href="mailto:support@bitviron.com" className="text-black font-bold underline underline-offset-4">support@bitviron.com</a>
                            </p>
                        </div>

                        <div className="space-y-6">
                            <FAQItem
                                question="What is the PDF splitter used for?"
                                answer="The PDF splitter is designed to extract specific pages from a document or break a large PDF into smaller, more manageable files."
                            />
                            <FAQItem
                                question="What functions does the PDF splitter have?"
                                answer="Our tool supports selective page extraction, range-based splitting (e.g., 1-5), and 'Split All' which turns every page into its own separate PDF file."
                            />
                            <FAQItem
                                question="Does splitting affect document quality?"
                                answer="No. The splitting process is purely structural. Your text, high-resolution images, and complex formatting remain exactly as they were in the original master document."
                            />
                            <FAQItem
                                question="Can I split PDF files for free?"
                                answer="Yes! Bitviron provides full access to the PDF Splitter engine for free. We don't charge any fees or require account registration for basic document fragmentation."
                            />
                        </div>
                    </div>
                </div>

                {/* Technical Footer */}
                <div className="mt-40 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30 select-none pointer-events-none font-mono text-[10px] uppercase tracking-widest">
                    <div className="flex gap-12">
                        <span className="flex items-center gap-2"><Cpu className="w-3 h-3" /> Engine: Split_v1.0</span>
                        <span className="flex items-center gap-2"><Terminal className="w-3 h-3" /> Mode: Local_Only</span>
                    </div>
                    <span>Bitviron Split Engine © {new Date().getFullYear()}</span>
                    <div className="flex gap-12">
                        <span>Latency: 1ms</span>
                        <span>Node: Edge_System</span>
                    </div>
                </div>
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

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="space-y-6 group border-l border-slate-100 pl-8 hover:border-black transition-colors duration-500">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-slate-200 group-hover:rotate-12 transition-all duration-500">
                {icon}
            </div>
            <div className="space-y-3">
                <h3 className="text-xl font-bold tracking-tight uppercase">{title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">{description}</p>
            </div>
        </div>
    );
}

function Step({ num, text, description }: { num: number, text: string, description: string }) {
    return (
        <div className="flex gap-8 group">
            <div className="flex-shrink-0 w-12 h-12 rounded-full border border-black flex items-center justify-center font-mono font-bold text-sm bg-white group-hover:bg-black group-hover:text-white transition-all duration-500">
                0{num}
            </div>
            <div className="space-y-3 border-b border-slate-100 pb-8 w-full group-hover:border-black transition-colors duration-500">
                <h4 className="text-xl font-black uppercase tracking-tighter">{text}</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-medium uppercase font-mono tracking-wide">[ Process: {description} ]</p>
            </div>
        </div>
    );
}
