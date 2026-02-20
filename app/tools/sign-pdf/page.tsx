"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
    FileText,
    CloudUpload,
    RotateCcw,
    Download,
    CheckCircle2,
    ArrowUpRight,
    HelpCircle,
    Cpu,
    Terminal,
    ChevronRight,
    Trash2,
    Signature,
    Maximize2,
    Minimize2,
    Move,
    Plus,
    X
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

// --- Components ---

interface SignaturePadProps {
    onSave: (dataUrl: string) => void;
    onCancel: () => void;
}

const SIGNATURE_FONTS = [
    { name: 'Pinyon Script' },
    { name: 'Mrs Saint Delafield' },
    { name: 'Monsieur La Doulaise' },
    { name: 'Great Vibes' },
    { name: 'Alex Brush' },
    { name: 'Dancing Script' },
    { name: 'Sacramento' },
    { name: 'Allura' },
    { name: 'Cedarville Cursive' },
];

const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, onCancel }) => {
    const [activeTab, setActiveTab] = useState<'draw' | 'type'>('type');
    const [typedText, setTypedText] = useState('');
    const [selectedFont, setSelectedFont] = useState(SIGNATURE_FONTS[0]);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        if (activeTab === 'draw') {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
        }
    }, [activeTab]);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.beginPath();
        }
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        let x, y;

        if ('touches' in e) {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = (e as React.MouseEvent).clientX - rect.left;
            y = (e as React.MouseEvent).clientY - rect.top;
        }

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const clear = () => {
        if (activeTab === 'draw') {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
            setTypedText('');
        }
    };

    const save = () => {
        if (activeTab === 'draw') {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            const isEmpty = !pixelData.some(channel => channel !== 0);
            if (isEmpty) return;
            onSave(canvas.toDataURL('image/png'));
        } else {
            if (!typedText.trim()) return;

            // Render text to a hidden canvas to get PNG
            const canvas = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 300;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Clear background (transparent)
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Set font style
            ctx.fillStyle = '#000000';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Try to use the selected font
            ctx.font = `80px "${selectedFont.name}", cursive`;
            ctx.fillText(typedText, canvas.width / 2, canvas.height / 2);

            onSave(canvas.toDataURL('image/png'));
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-2xl border border-black shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-6 border-b border-black flex items-center justify-between bg-white shrink-0">
                    <div>
                        <h3 className="text-xl font-bold uppercase tracking-tighter">Capture Signature</h3>
                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">Select method and provide signature</p>
                    </div>
                    <button onClick={onCancel} className="p-2 hover:bg-slate-100 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 bg-slate-50/50 shrink-0">
                    <button
                        onClick={() => setActiveTab('type')}
                        className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-[0.2em] font-mono transition-all ${activeTab === 'type' ? 'bg-white border-b border-black text-black' : 'text-slate-400 hover:text-black'}`}
                    >
                        [ 01 ] Type Signature
                    </button>
                    <button
                        onClick={() => setActiveTab('draw')}
                        className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-[0.2em] font-mono transition-all ${activeTab === 'draw' ? 'bg-white border-b border-black text-black' : 'text-slate-400 hover:text-black'}`}
                    >
                        [ 02 ] Draw Signature
                    </button>
                </div>

                <div className="p-4 md:p-8 bg-slate-50 flex flex-col items-center overflow-y-auto flex-1 min-h-[250px]">
                    {activeTab === 'draw' ? (
                        <canvas
                            ref={canvasRef}
                            width={600}
                            height={300}
                            className="bg-white border border-slate-200 cursor-crosshair touch-none shadow-inner w-full h-auto"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseOut={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                        />
                    ) : (
                        <div className="w-full space-y-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold uppercase tracking-[0.3em] font-mono text-slate-400">Enter Name / Text</label>
                                <input
                                    type="text"
                                    value={typedText}
                                    onChange={(e) => setTypedText(e.target.value)}
                                    placeholder="Your Full Name"
                                    className="w-full bg-white border border-black p-6 text-2xl font-medium focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-200"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-bold uppercase tracking-[0.3em] font-mono text-slate-400">Select Signature Font</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-4">
                                    {SIGNATURE_FONTS.map((font) => (
                                        <button
                                            key={font.name}
                                            onClick={() => setSelectedFont(font)}
                                            className={`p-4 border text-left transition-all ${selectedFont.name === font.name ? 'border-black bg-black text-white' : 'border-slate-200 bg-white hover:border-black'}`}
                                        >
                                            <p className="text-lg truncate" style={{ fontFamily: font.name }}>{typedText || 'Signature'}</p>
                                            <p className="text-[8px] font-mono uppercase tracking-widest mt-1 opacity-50">{font.name}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 md:p-6 border-t border-black flex flex-col sm:flex-row gap-4 items-center justify-between bg-white shrink-0">
                    <button
                        onClick={clear}
                        className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono text-slate-400 hover:text-black transition-colors"
                    >
                        [ Clear Input ]
                    </button>
                    <div className="flex gap-4 w-full sm:w-auto">
                        <button
                            onClick={onCancel}
                            className="flex-1 sm:flex-none px-8 py-3 border border-slate-200 text-[10px] font-bold uppercase tracking-[0.2em] font-mono hover:border-black transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={save}
                            disabled={activeTab === 'type' && !typedText.trim()}
                            className="flex-1 sm:flex-none px-8 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] font-mono hover:scale-105 transition-all shadow-xl disabled:opacity-50"
                        >
                            Confirm Signature
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Page Component ---

export default function SignPdfPage() {
    const [file, setFile] = useState<File | null>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
    const [pdfInstance, setPdfInstance] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSigPad, setShowSigPad] = useState(false);
    const [signature, setSignature] = useState<string | null>(null);
    const [sigPosition, setSigPosition] = useState({ x: 50, y: 50 });
    const [sigSize, setSigSize] = useState({ width: 150, height: 75 });
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [signedUrl, setSignedUrl] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);

    // Render PDF Page
    useEffect(() => {
        if (!pdfInstance) return;

        const renderPage = async () => {
            try {
                const page = await pdfInstance.getPage(currentPage);
                const viewport = page.getViewport({ scale: 1.5 });

                const canvas = previewCanvasRef.current;
                if (!canvas) return;
                const context = canvas.getContext('2d');
                if (!context) return;

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };
                await page.render(renderContext).promise;
            } catch (err) {
                console.error('Error rendering PDF:', err);
                setError('Failed to render PDF page.');
            }
        };

        renderPage();
    }, [pdfInstance, currentPage]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;

        if (f.type !== 'application/pdf') {
            setError('Please upload a valid PDF file.');
            return;
        }

        setFile(f);
        setError(null);
        setIsProcessing(true);

        try {
            const buffer = await f.arrayBuffer();
            const data = new Uint8Array(buffer);
            setPdfData(data as any);

            // Initialize PDF.js instance once
            // @ts-ignore
            const pdfjsMod = await import('pdfjs-dist/build/pdf.min.mjs');
            pdfjsMod.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

            const loadingTask = pdfjsMod.getDocument({ data: data });
            const pdf = await loadingTask.promise;
            setPdfInstance(pdf);
            setNumPages(pdf.numPages);
        } catch (err) {
            setError('Failed to read PDF file.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSigSave = (dataUrl: string) => {
        setSignature(dataUrl);
        setShowSigPad(false);
    };

    const signAndDownload = async () => {
        if (!pdfData || !signature || !previewCanvasRef.current) return;
        setIsProcessing(true);
        setError(null);

        try {
            const pdfDoc = await PDFDocument.load(pdfData);
            const signatureImage = await pdfDoc.embedPng(signature);

            const pages = pdfDoc.getPages();
            const page = pages[currentPage - 1];
            const { width, height } = page.getSize();

            // Calculate scale between canvas and PDF coordinates
            const canvas = previewCanvasRef.current;
            const scaleX = width / canvas.width;
            const scaleY = height / canvas.height;

            // pdf-lib uses bottom-left origin
            const finalX = sigPosition.x * scaleX;
            const finalY = height - (sigPosition.y * scaleY) - (sigSize.height * scaleY);

            page.drawImage(signatureImage, {
                x: finalX,
                y: finalY,
                width: sigSize.width * scaleX,
                height: sigSize.height * scaleY,
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setSignedUrl(url);

            const link = document.createElement('a');
            link.href = url;
            link.download = `signed_${file?.name || 'document.pdf'}`;
            link.click();
        } catch (err) {
            console.error('Signing failed:', err);
            setError('Failed to sign and generate PDF.');
        } finally {
            setIsProcessing(false);
        }
    };

    const reset = () => {
        setFile(null);
        setPdfData(null);
        setPdfInstance(null);
        setSignature(null);
        setSignedUrl(null);
        setCurrentPage(1);
        setError(null);
    };

    // Interaction Logic
    const onMouseDown = (e: React.MouseEvent) => {
        if (!signature) return;
        setIsDragging(true);
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const handleResizeStart = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsResizing(true);
        setDragOffset({ x: e.clientX, y: e.clientY });
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!canvasContainerRef.current) return;
        const containerRect = canvasContainerRef.current.getBoundingClientRect();

        if (isDragging) {
            let newX = e.clientX - containerRect.left - dragOffset.x;
            let newY = e.clientY - containerRect.top - dragOffset.y;

            newX = Math.max(0, Math.min(newX, containerRect.width - sigSize.width));
            newY = Math.max(0, Math.min(newY, containerRect.height - sigSize.height));

            setSigPosition({ x: newX, y: newY });
        } else if (isResizing) {
            const dx = e.clientX - dragOffset.x;
            const dy = e.clientY - dragOffset.y;

            const newWidth = Math.max(50, Math.min(sigSize.width + dx, containerRect.width - sigPosition.x));
            const newHeight = Math.max(25, Math.min(sigSize.height + dy, containerRect.height - sigPosition.y));

            setSigSize({ width: newWidth, height: newHeight });
            setDragOffset({ x: e.clientX, y: e.clientY });
        }
    };

    const onMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-black selection:bg-black selection:text-white pt-32 pb-40 px-6 md:px-12 w-full overflow-x-hidden font-sans" onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
            <div className="max-w-[1600px] mx-auto">

                {/* Editorial Hero */}
                <div className="grid grid-cols-12 gap-6 md:gap-8 mb-16 md:mb-24 border-b border-black pb-8 md:pb-12 items-end">
                    <div className="col-span-12 lg:col-span-9">
                        <div className="flex items-center gap-3 mb-6 md:mb-8">
                            <span className="w-8 md:w-12 h-[1px] bg-black"></span>
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] font-mono">Precision Utilities // {new Date().getFullYear()}</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl md:text-[8vw] font-bold leading-[0.85] tracking-tight sm:tracking-tighter uppercase text-black">
                            PDF Signature<br />Console.
                        </h1>
                    </div>

                    <div className="col-span-12 lg:col-span-3 flex flex-col justify-end lg:items-end text-left lg:text-right mt-6 lg:mt-0">
                        <div className="max-w-xs space-y-6">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                                [ System Status: Active ]<br />
                                Cryptographic-grade signing module.
                            </p>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
                                Execute legally binding signatures with digital precision. Zero data retention, fully client-side.
                            </p>
                        </div>
                    </div>
                </div>

                {!file ? (
                    /* Upload Zone */
                    <div className="max-w-4xl mx-auto">
                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                if (e.dataTransfer.files?.[0]) {
                                    const mockEvent = { target: { files: e.dataTransfer.files } } as any;
                                    handleFileChange(mockEvent);
                                }
                            }}
                            className="border border-black rounded-none p-10 md:p-24 text-center group transition-all duration-500 cursor-pointer relative overflow-hidden bg-white hover:bg-slate-50"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="absolute left-[-1px] top-0 w-[1px] h-0 bg-black group-hover:h-full transition-all duration-700 ease-in-out"></div>
                            <input type="file" accept=".pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

                            <div className="flex flex-col items-center gap-6">
                                <div className="w-16 h-16 rounded-full border border-black flex items-center justify-center transition-all duration-700 group-hover:rotate-45 group-hover:bg-slate-100">
                                    <CloudUpload className="w-6 h-6" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold tracking-tighter uppercase italic">Source PDF Injection</h2>
                                    <div className="flex items-center justify-center gap-3">
                                        <span className="h-[1px] w-4 bg-slate-300"></span>
                                        <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Drag + Drop PDF asset</p>
                                        <span className="h-[1px] w-4 bg-slate-300"></span>
                                    </div>
                                </div>
                                <button className="bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] py-5 px-10 rounded-full hover:scale-105 transition-all shadow-xl mt-4 group/btn flex items-center gap-3">
                                    Select File
                                    <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                        {error && <div className="mt-6 p-4 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-[0.1em] font-mono animate-fadeIn">{error}</div>}
                    </div>
                ) : (
                    /* Editor Zone */
                    <div className="grid grid-cols-12 gap-8 lg:gap-16 items-start">

                        {/* Sidebar Controls */}
                        <div className="col-span-12 lg:col-span-4 space-y-8 sticky top-32">
                            <div className="border border-black p-8 bg-white space-y-8">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] font-mono text-slate-400">Control Interface</span>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] font-mono">[ ACTIVE ]</span>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono text-slate-400">Asset Info</label>
                                        <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100">
                                            <FileText className="w-5 h-5" />
                                            <div className="truncate">
                                                <p className="text-xs font-bold truncate uppercase tracking-tight">{file.name}</p>
                                                <p className="text-[9px] font-mono text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB // {numPages} PAGES</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-slate-100">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono text-slate-400">Signature Execution</p>

                                        {!signature ? (
                                            <button
                                                onClick={() => setShowSigPad(true)}
                                                className="w-full bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] py-4 rounded-none flex items-center justify-center gap-3 hover:bg-slate-800 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Initialize Signature
                                            </button>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="relative border border-black p-4 bg-slate-50 aspect-[2/1] flex items-center justify-center group">
                                                    <img src={signature} alt="Signature" className="max-h-full max-w-full object-contain" />
                                                    <button
                                                        onClick={() => setSignature(null)}
                                                        className="absolute top-2 right-2 p-1.5 bg-black text-white hover:bg-red-600 transition-colors"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest text-center italic">Drag signature on preview to position</p>
                                            </div>
                                        )}
                                    </div>

                                    {signature && (
                                        <div className="pt-8 border-t border-slate-100 space-y-4">
                                            <button
                                                onClick={signAndDownload}
                                                disabled={isProcessing}
                                                className="w-full bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] py-5 rounded-full flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl disabled:opacity-50"
                                            >
                                                {isProcessing ? 'Processing...' : 'Finalize & Download'}
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={reset}
                                                className="w-full border border-slate-200 text-[10px] font-bold uppercase tracking-[0.3em] py-5 rounded-full flex items-center justify-center gap-3 hover:border-black transition-all text-slate-400 hover:text-black"
                                            >
                                                <RotateCcw className="w-4 h-4" />
                                                Discard Tooling
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 border border-slate-200">
                                <div className="flex gap-4 items-start">
                                    <HelpCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold uppercase tracking-widest">Operator Note</p>
                                        <p className="text-xs text-slate-500 leading-relaxed uppercase font-mono tracking-tight">
                                            Signatures are embedded directly into the document stream using standard PDF-PNG mapping. Output is PDF 1.7 compliant.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PDF Preview Area */}
                        <div className="col-span-12 lg:col-span-8 space-y-6">
                            <div className="flex flex-row items-center justify-between border-b border-black pb-4 gap-2">
                                <div className="flex flex-row items-center justify-between w-full gap-4">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.3em] font-mono whitespace-nowrap">PDF PREVIEW</span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            disabled={currentPage <= 1}
                                            onClick={() => setCurrentPage(p => p - 1)}
                                            className="w-10 h-10 flex items-center justify-center border border-slate-200 disabled:opacity-30 hover:border-black transition-colors"
                                        >
                                            ←
                                        </button>
                                        <div className="flex flex-col items-center justify-center min-w-[80px]">
                                            <span className="text-[10px] font-mono uppercase tracking-widest whitespace-nowrap">PAGE {currentPage} / {numPages}</span>
                                        </div>
                                        <button
                                            disabled={currentPage >= numPages}
                                            onClick={() => setCurrentPage(p => p + 1)}
                                            className="w-10 h-10 flex items-center justify-center border border-slate-200 disabled:opacity-30 hover:border-black transition-colors"
                                        >
                                            →
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="relative bg-slate-100 p-4 md:p-12 flex justify-center overflow-hidden min-h-[500px] md:min-h-[800px] border border-slate-200 group">
                                <div
                                    ref={canvasContainerRef}
                                    className="relative bg-white shadow-2xl transition-transform duration-500"
                                >
                                    <canvas ref={previewCanvasRef} className="max-w-full h-auto" />

                                    {signature && (
                                        <div
                                            className={`absolute cursor-move border-2 border-dashed transition-colors ${isDragging ? 'border-black' : 'border-black/20 group-hover:border-black/50'}`}
                                            style={{
                                                left: `${sigPosition.x}px`,
                                                top: `${sigPosition.y}px`,
                                                width: `${sigSize.width}px`,
                                                height: `${sigSize.height}px`,
                                                backgroundImage: `url(${signature})`,
                                                backgroundSize: 'contain',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'center'
                                            }}
                                            onMouseDown={onMouseDown}
                                        >
                                            <div className="absolute -top-3 -right-3 w-6 h-6 bg-black text-white flex items-center justify-center rounded-none opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                <Move className="w-3 h-3" />
                                            </div>

                                            {/* Resize Handle */}
                                            <div
                                                className="absolute -bottom-2 -right-2 w-6 h-6 bg-black text-white cursor-nwse-resize z-20 hover:scale-110 transition-transform flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-lg"
                                                onMouseDown={handleResizeStart}
                                            >
                                                <Maximize2 className="w-3 h-3" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Feature Cards */}
                <div className="mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                    <FeatureCard
                        icon={<Signature className="w-6 h-6 text-black" />}
                        title="Digital Ink Core"
                        description="Sovereign signature engine capturing pressure-sensitive high-resolution digital ink data."
                    />
                    <FeatureCard
                        icon={<Maximize2 className="w-6 h-6 text-black" />}
                        title="Overlay Mapping"
                        description="Precision coordinate system to place signatures on any page with exact pixel alignment."
                    />
                    <FeatureCard
                        icon={<Terminal className="w-6 h-6 text-black" />}
                        title="Local Execution"
                        description="Maximum privacy protocol: document processing is contained within your local browser sandbox."
                    />
                    <FeatureCard
                        icon={<FileText className="w-6 h-6 text-black" />}
                        title="PDF 1.7 Compliant"
                        description="Standardized output compatible with all modern PDF readers, browsers, and enterprise systems."
                    />
                    <FeatureCard
                        icon={<CheckCircle2 className="w-6 h-6 text-black" />}
                        title="Visual Verification"
                        description="Instant preview of signature placement before final document generation for absolute accuracy."
                    />
                    <FeatureCard
                        icon={<Plus className="w-6 h-6 text-black" />}
                        title="Multi-Method Input"
                        description="Flexible signing options: draw with precision or type using premium typographic signature fonts."
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
                            <Step num={1} text="Inject Asset" description="Upload your PDF document into the secure signature console." />
                            <Step num={2} text="Execute Signature" description="Draw your signature or type it using our premium typographic options." />
                            <Step num={3} text="Position Overlay" description="Drag the signature overlay to the exact location on the document." />
                            <Step num={4} text="Export Output" description="Generate and download your signed PDF with embedded digital ink." />
                        </div>
                        <div className="bg-slate-50 rounded-none p-6 md:p-12 border border-slate-200 flex items-center justify-center min-h-[400px] md:min-h-[500px] relative group overflow-hidden">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-black/5 blur-[80px] rounded-full -mr-16 -mt-16"></div>
                            <div className="relative z-10 scale-[0.7] md:scale-100">
                                <div className="w-56 h-72 bg-white border border-slate-200 rounded-none shadow-xl flex items-center justify-center transform -rotate-6 group-hover:-rotate-12 transition-all duration-700">
                                    <FileText className="w-12 h-12 text-slate-100" />
                                </div>
                                <div className="absolute top-8 left-12 w-56 h-72 bg-white border border-black rounded-none shadow-2xl flex items-center justify-center z-10 group-hover:translate-x-4 group-hover:-translate-y-4 transition-all duration-700">
                                    <div className="flex flex-col items-center gap-4">
                                        <Signature className="w-10 h-10 text-black" />
                                        <span className="text-[10px] font-mono font-bold tracking-[0.4em] uppercase text-black">Signed_Doc.pdf</span>
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
                                question="Is my signature legally binding?"
                                answer="Yes, digital signatures are legally recognized in most jurisdictions. Bitviron uses standard PDF embedding to ensure your signature is part of the document's permanent record."
                            />
                            <FAQItem
                                question="Is my data secure?"
                                answer="Absolutely. Bitviron uses a local-first architecture. Your PDFs and signatures never leave your browser, providing 100% privacy and security."
                            />
                            <FAQItem
                                question="Can I sign multiple pages?"
                                answer="The current version allows you to place one signature on a specific page. You can download the signed document and re-upload it to add more signatures if needed."
                            />
                            <FAQItem
                                question="What font options are available for typing signatures?"
                                answer="We provide a curated selection of premium typographic fonts including Dancing Script, Great Vibes, and Sacramento, designed to mimic elegant hand-written signatures."
                            />
                        </div>
                    </div>
                </div>

                {/* Technical Footer */}
                <div className="mt-40 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30 select-none pointer-events-none font-mono text-[10px] uppercase tracking-widest">
                    <div className="flex gap-12">
                        <span className="flex items-center gap-2"><Cpu className="w-3 h-3" /> System: Stable</span>
                        <span className="flex items-center gap-2"><Terminal className="w-3 h-3" /> Processing: Local</span>
                    </div>
                    <span>Bitviron Engine © {new Date().getFullYear()}</span>
                    <div className="flex gap-12">
                        <span>Status: 200 OK</span>
                        <span>Node: Edge_01</span>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showSigPad && (
                <SignaturePad
                    onSave={handleSigSave}
                    onCancel={() => setShowSigPad(false)}
                />
            )}
        </div>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
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
