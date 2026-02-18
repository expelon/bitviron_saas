"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Image as ImageIcon,
    Download,
    ArrowUpRight,
    HelpCircle,
    Cpu,
    Terminal,
    ChevronRight,
    Shield,
    FileText,
    CreditCard,
    Layout,
    Zap,
    RotateCcw,
    Loader2,
    Package,
} from 'lucide-react';

const PDFJS_VERSION = '4.4.168';

type Quality = 'high' | 'medium' | 'low';
const QUALITY_PRESETS: Record<Quality, { label: string; description: string; scale: number; jpegQuality: number }> = {
    high: { label: 'High Quality', description: 'Best clarity. Larger file size.', scale: 2.0, jpegQuality: 0.95 },
    medium: { label: 'Balanced', description: 'Good quality, moderate file size.', scale: 1.5, jpegQuality: 0.80 },
    low: { label: 'Compressed', description: 'Smallest size, reduced clarity.', scale: 1.0, jpegQuality: 0.60 },
};

interface PageImage {
    pageNum: number;
    dataUrl: string;
    width: number;
    height: number;
}

export default function PdfToJpgPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [isConverting, setIsConverting] = useState(false);
    const [isZipping, setIsZipping] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pdfjsLib, setPdfjsLib] = useState<any>(null);
    const [quality, setQuality] = useState<Quality>('high');
    const [pages, setPages] = useState<PageImage[]>([]);
    const [progress, setProgress] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const load = async () => {
            try {
                // @ts-ignore
                const mod = await import('pdfjs-dist/build/pdf.min.mjs');
                mod.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.mjs`;
                setPdfjsLib(mod);
            } catch (e) { console.error('Failed to load PDF.js', e); }
        };
        load();
    }, []);

    const convertFile = useCallback(async (f: File, q: Quality) => {
        if (!pdfjsLib) { setError('PDF engine loading, please wait.'); return; }
        if (f.type !== 'application/pdf') { setError('Please upload a valid PDF file.'); return; }

        setError(null);
        setPages([]);
        setIsConverting(true);
        setProgress(0);

        const preset = QUALITY_PRESETS[q];

        try {
            const buf = await f.arrayBuffer();
            const pdfDoc = await pdfjsLib.getDocument({ data: buf }).promise;
            const numPages = pdfDoc.numPages;
            setTotalPages(numPages);

            const results: PageImage[] = [];

            for (let i = 1; i <= numPages; i++) {
                const page = await pdfDoc.getPage(i);
                const viewport = page.getViewport({ scale: preset.scale });

                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext('2d')!;

                // White background for JPEG (no transparency)
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                await page.render({ canvasContext: ctx, viewport }).promise;

                const dataUrl = canvas.toDataURL('image/jpeg', preset.jpegQuality);
                results.push({ pageNum: i, dataUrl, width: viewport.width, height: viewport.height });

                setProgress(Math.round((i / numPages) * 100));
            }

            setPages(results);
        } catch (e) {
            console.error('Conversion failed:', e);
            setError('Failed to convert PDF. Please try a different file.');
        } finally {
            setIsConverting(false);
        }
    }, [pdfjsLib]);

    const processFile = (f: File) => {
        setFile(f);
        convertFile(f, quality);
    };

    const handleQualityChange = (q: Quality) => {
        setQuality(q);
        if (file) convertFile(file, q);
    };

    const downloadSingle = (page: PageImage) => {
        const link = document.createElement('a');
        link.href = page.dataUrl;
        link.download = `page_${page.pageNum}.jpg`;
        link.click();
    };

    const downloadAll = async () => {
        if (pages.length === 0) return;

        // If only one page, just download directly
        if (pages.length === 1) {
            downloadSingle(pages[0]);
            return;
        }

        setIsZipping(true);
        try {
            // Dynamically import JSZip
            const JSZip = (await import('jszip')).default;
            const zip = new JSZip();
            const baseName = file?.name.replace('.pdf', '') || 'converted';

            for (const page of pages) {
                const base64 = page.dataUrl.split(',')[1];
                zip.file(`${baseName}_page_${page.pageNum}.jpg`, base64, { base64: true });
            }

            const blob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${baseName}_images.zip`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error('ZIP failed:', e);
            // Fallback: download individually
            for (const page of pages) {
                downloadSingle(page);
                await new Promise(r => setTimeout(r, 200));
            }
        } finally {
            setIsZipping(false);
        }
    };

    const reset = () => {
        setFile(null);
        setPages([]);
        setProgress(0);
        setTotalPages(0);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const formatBytes = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    // Estimate JPG size from base64 length
    const estimateSize = (dataUrl: string) => {
        const base64 = dataUrl.split(',')[1] || '';
        return Math.round((base64.length * 3) / 4);
    };

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
                            PDF to JPG<br />Converter.
                        </h1>
                    </div>
                    <div className="col-span-12 lg:col-span-3 flex flex-col justify-end lg:items-end text-left lg:text-right mt-6 lg:mt-0">
                        <div className="max-w-xs space-y-6">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] font-mono">
                                [ System Status: Active ]<br />
                                High-performance image extraction module.
                            </p>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
                                Convert every PDF page into a high-quality JPG image. Fully client-side, instant preview.
                            </p>
                        </div>
                    </div>
                </div>

                {pages.length === 0 ? (
                    /* Upload + Quality Selection */
                    <div className="max-w-4xl mx-auto space-y-8">

                        {/* Quality Presets */}
                        <div className="grid grid-cols-3 gap-4">
                            {(Object.entries(QUALITY_PRESETS) as [Quality, typeof QUALITY_PRESETS[Quality]][]).map(([key, preset]) => (
                                <button
                                    key={key}
                                    onClick={() => setQuality(key)}
                                    className={`group p-5 md:p-6 border text-left transition-all duration-300 relative overflow-hidden ${quality === key ? 'border-black bg-black text-white' : 'border-slate-200 bg-white hover:border-black'}`}
                                >
                                    <div className="absolute left-0 top-0 w-[2px] h-0 bg-white group-hover:h-full transition-all duration-500"></div>
                                    <div className={`text-[9px] font-mono font-bold uppercase tracking-[0.3em] mb-2 ${quality === key ? 'text-slate-300' : 'text-slate-400'}`}>
                                        {key === 'high' ? 'PRESET_01' : key === 'medium' ? 'PRESET_02' : 'PRESET_03'}
                                    </div>
                                    <div className={`text-sm font-bold uppercase tracking-tight mb-1 ${quality === key ? 'text-white' : 'text-black'}`}>
                                        {preset.label}
                                    </div>
                                    <div className={`text-xs leading-relaxed ${quality === key ? 'text-slate-300' : 'text-slate-500'}`}>
                                        {preset.description}
                                    </div>
                                    <div className={`mt-3 text-[9px] font-mono uppercase tracking-widest ${quality === key ? 'text-slate-400' : 'text-slate-300'}`}>
                                        Scale: {QUALITY_PRESETS[key].scale}x · Q: {Math.round(QUALITY_PRESETS[key].jpegQuality * 100)}%
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Drop Zone */}
                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnter={() => setIsDragActive(true)}
                            onDragLeave={() => setIsDragActive(false)}
                            onDrop={(e) => { e.preventDefault(); setIsDragActive(false); if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]); }}
                            className={`border border-black rounded-none p-10 md:p-24 text-center group transition-all duration-500 cursor-pointer relative overflow-hidden ${isDragActive ? 'bg-slate-50' : 'bg-white hover:bg-slate-50'}`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="absolute left-[-1px] top-0 w-[1px] h-0 bg-black group-hover:h-full transition-all duration-700 ease-in-out"></div>

                            {isConverting && (
                                <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center gap-6">
                                    <div className="w-16 h-16 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                    <div className="space-y-2 text-center">
                                        <p className="text-xs font-bold uppercase tracking-[0.3em] font-mono">Converting Pages...</p>
                                        <div className="w-48 h-[2px] bg-slate-100 mx-auto">
                                            <div className="h-full bg-black transition-all duration-300" style={{ width: `${progress}%` }}></div>
                                        </div>
                                        <p className="text-[10px] font-mono text-slate-400">{progress}% — {Math.ceil(progress * totalPages / 100)} / {totalPages} pages</p>
                                    </div>
                                </div>
                            )}

                            <input type="file" accept=".pdf" className="hidden" ref={fileInputRef} onChange={(e) => { if (e.target.files?.[0]) processFile(e.target.files[0]); }} />

                            <div className="flex flex-col items-center gap-6">
                                <div className={`w-16 h-16 rounded-full border border-black flex items-center justify-center transition-all duration-700 ${isDragActive ? 'bg-black text-white rotate-180 scale-125' : 'group-hover:rotate-45 group-hover:bg-slate-100'}`}>
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-xl md:text-2xl font-bold tracking-tighter uppercase italic">
                                        {isDragActive ? 'Initialize Transfer' : 'Source PDF Injection'}
                                    </h2>
                                    <div className="flex items-center justify-center gap-3">
                                        <span className="h-[1px] w-4 bg-slate-300"></span>
                                        <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Drag + Drop one PDF asset</p>
                                        <span className="h-[1px] w-4 bg-slate-300"></span>
                                    </div>
                                </div>
                                <button disabled={isConverting} className="bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] py-5 px-10 rounded-full hover:scale-105 transition-all shadow-xl disabled:opacity-50 mt-4 group/btn flex items-center gap-3">
                                    {isConverting ? 'Converting...' : 'Upload & Convert'}
                                    {!isConverting && <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />}
                                </button>
                            </div>
                            {error && <div className="mt-6 p-4 bg-red-50 text-red-600 text-sm font-medium">{error}</div>}
                        </div>

                        <div className="text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                            Files are never uploaded — converted entirely in your browser <HelpCircle className="w-3.5 h-3.5" />
                        </div>
                    </div>
                ) : (
                    /* Results Zone */
                    <div className="animate-fadeIn">

                        {/* Results Toolbar */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 md:p-8 border-b border-t border-black sticky top-16 md:top-24 z-30 mb-12">
                            <div className="flex items-center gap-6 md:gap-10">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black text-white flex items-center justify-center font-mono text-xs font-bold ring-4 ring-slate-100">
                                        {pages.length}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono italic">Images Ready</span>
                                        <span className="text-xs font-bold uppercase tracking-tighter">{QUALITY_PRESETS[quality].label}</span>
                                    </div>
                                </div>
                                <div className="h-8 w-[1px] bg-slate-200"></div>
                                {/* Quality switcher inline */}
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-mono uppercase text-slate-400 hidden md:block">Quality:</span>
                                    {(['high', 'medium', 'low'] as Quality[]).map(q => (
                                        <button key={q} onClick={() => handleQualityChange(q)}
                                            className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest font-mono border transition-all ${quality === q ? 'bg-black text-white border-black' : 'border-slate-200 text-slate-500 hover:border-black'}`}>
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button onClick={reset} className="px-4 py-2.5 border border-slate-200 rounded-full text-[9px] font-bold uppercase tracking-widest font-mono hover:border-black transition-all text-slate-500 hover:text-black flex items-center gap-1.5">
                                    <RotateCcw className="w-3 h-3" /> New File
                                </button>
                                <button
                                    onClick={downloadAll}
                                    disabled={isZipping}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-full text-[9px] font-bold uppercase tracking-[0.2em] font-mono hover:scale-105 transition-all shadow-lg disabled:opacity-50"
                                >
                                    {isZipping
                                        ? <><Loader2 className="w-3 h-3 animate-spin" /> Zipping...</>
                                        : <><Package className="w-3 h-3" /> Download All {pages.length > 1 ? '(ZIP)' : ''}</>
                                    }
                                </button>
                            </div>
                        </div>

                        {/* Image Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-16">
                            {pages.map((page, idx) => (
                                <div key={page.pageNum} className="group flex flex-col gap-4 animate-fadeIn" style={{ animationDelay: `${idx * 40}ms` }}>
                                    {/* Image Preview */}
                                    <div className="relative border border-slate-100 group-hover:border-black transition-all duration-500 overflow-hidden shadow-sm group-hover:shadow-xl">
                                        <img
                                            src={page.dataUrl}
                                            alt={`Page ${page.pageNum}`}
                                            className="w-full object-contain group-hover:scale-105 transition-transform duration-700"
                                        />
                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500 flex items-center justify-center">
                                            <button
                                                onClick={() => downloadSingle(page)}
                                                className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black text-white px-4 py-2 text-[9px] font-bold uppercase tracking-[0.3em] font-mono flex items-center gap-2 hover:scale-105"
                                            >
                                                <Download className="w-3 h-3" /> Download
                                            </button>
                                        </div>
                                        {/* Page badge */}
                                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 border border-slate-100 font-mono text-[8px] font-bold text-slate-400 uppercase">
                                            P.{page.pageNum}
                                        </div>
                                    </div>

                                    {/* Meta */}
                                    <div className="px-1 space-y-1 border-l border-slate-100 pl-4 group-hover:border-black transition-colors duration-500">
                                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-tighter">Page {page.pageNum} of {pages.length}</span>
                                        <p className="text-[10px] font-bold uppercase tracking-widest font-mono">{formatBytes(estimateSize(page.dataUrl))}</p>
                                        <p className="text-[9px] font-mono text-slate-400">{Math.round(page.width)} × {Math.round(page.height)} px</p>
                                    </div>

                                    {/* Download button */}
                                    <button
                                        onClick={() => downloadSingle(page)}
                                        className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] font-mono text-slate-400 hover:text-black transition-colors group/dl"
                                    >
                                        <Download className="w-3 h-3 group-hover/dl:translate-y-0.5 transition-transform" />
                                        Save JPG
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Feature Cards */}
                <div className="mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                    <FeatureCard icon={<ImageIcon className="w-6 h-6 text-black" />} title="Page-by-Page Extraction" description="Every PDF page is rendered and exported as a separate, full-resolution JPG image." />
                    <FeatureCard icon={<Zap className="w-6 h-6 text-black" />} title="Three Quality Presets" description="Choose High (2x scale, 95% quality), Balanced (1.5x, 80%), or Compressed (1x, 60%) to match your use case." />
                    <FeatureCard icon={<Package className="w-6 h-6 text-black" />} title="ZIP Download" description="Multi-page PDFs are bundled into a single ZIP archive for one-click download of all images." />
                    <FeatureCard icon={<Shield className="w-6 h-6 text-black" />} title="Vault Privacy" description="End-to-end local processing. Your PDF never leaves the client-side execution environment." />
                    <FeatureCard icon={<CreditCard className="w-6 h-6 text-black" />} title="Zero Cost Tier" description="Full access to the Bitviron conversion engine with no subscription requirement or usage caps." />
                    <FeatureCard icon={<Layout className="w-6 h-6 text-black" />} title="Instant Preview" description="See all converted images in a responsive grid before downloading. Inspect resolution and file size per page." />
                </div>

                {/* How it works */}
                <div className="mt-40 pt-20 border-t border-black">
                    <div className="flex items-center gap-3 mb-12">
                        <span className="w-12 h-[1px] bg-black"></span>
                        <span className="text-xs font-bold uppercase tracking-[0.3em] font-mono text-slate-400">Documentation // Workflow</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
                        <div className="space-y-0">
                            <Step num={1} text="Select Quality" description="Choose a conversion preset before uploading your PDF." />
                            <Step num={2} text="Inject Asset" description="Upload a PDF and watch each page render in real-time." />
                            <Step num={3} text="Export Images" description="Download individual JPGs or grab all pages as a ZIP archive." />
                        </div>
                        <div className="bg-slate-50 rounded-none p-6 md:p-12 border border-slate-200 flex items-center justify-center min-h-[400px] md:min-h-[500px] relative group overflow-hidden">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-black/5 blur-[80px] rounded-full -mr-16 -mt-16"></div>
                            <div className="relative z-10 scale-[0.7] md:scale-100">
                                <div className="w-56 h-72 bg-white border border-slate-200 rounded-none shadow-xl flex items-center justify-center transform -rotate-6 group-hover:-rotate-12 transition-all duration-700">
                                    <FileText className="w-12 h-12 text-slate-100" />
                                </div>
                                <div className="absolute top-8 left-12 w-56 h-72 bg-white border border-black rounded-none shadow-2xl flex items-center justify-center z-10 group-hover:translate-x-4 group-hover:-translate-y-4 transition-all duration-700">
                                    <div className="flex flex-col items-center gap-4">
                                        <ImageIcon className="w-10 h-10 text-black" />
                                        <span className="text-[10px] font-mono font-bold tracking-[0.4em] uppercase text-black">Page_01.jpg</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ */}
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
                            <FAQItem question="What quality should I choose?" answer="High Quality is best for printing or archiving. Balanced is ideal for web use. Compressed is best when file size matters more than clarity." />
                            <FAQItem question="How are multi-page PDFs handled?" answer="Each page is converted to its own JPG image. For multi-page PDFs, all images are bundled into a single ZIP file for easy download." />
                            <FAQItem question="Does conversion affect image quality?" answer="Quality depends on your chosen preset. High Quality renders at 2x scale with 95% JPEG quality, preserving fine detail and text sharpness." />
                            <FAQItem question="Is there a page limit?" answer="No hard limit. The converter processes all pages in your PDF. Very large documents may take longer depending on your device's processing power." />
                            <FAQItem question="Is the converter free?" answer="Yes! Bitviron provides full access to the PDF to JPG converter for free. No fees, no account registration, and no usage limits." />
                        </div>
                    </div>
                </div>

                {/* Technical Footer */}
                <div className="mt-40 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30 select-none pointer-events-none font-mono text-[10px] uppercase tracking-widest">
                    <div className="flex gap-12">
                        <span className="flex items-center gap-2"><Cpu className="w-3 h-3" /> Engine: Convert_v1.0</span>
                        <span className="flex items-center gap-2"><Terminal className="w-3 h-3" /> Mode: Local_Only</span>
                    </div>
                    <span>Bitviron Engine © {new Date().getFullYear()}</span>
                    <div className="flex gap-12">
                        <span>Latency: 1ms</span>
                        <span>Node: Edge_01</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-slate-100 rounded-none overflow-hidden bg-white hover:border-black transition-all duration-500 group">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-6 md:p-8 text-left">
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

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
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

function Step({ num, text, description }: { num: number; text: string; description: string }) {
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
