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
    CreditCard
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
// pdfjs-dist will be imported dynamically to avoid SSR issues
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    rectSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Configure PDF.js worker
const PDFJS_VERSION = '4.4.168';
// We'll set this inside the component to avoid issues during module evaluation

interface PDFPage {
    id: string; // Unique ID for DnD
    fileId: string;
    originalIndex: number; // 0-based index in the original file
    thumbnail: string; // Data URL
    fileName: string;
    fileSize: number;
}

interface UploadedFile {
    id: string;
    file: File;
    name: string;
    size: number;
    pageCount: number;
}

export default function PdfMergePage() {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [pages, setPages] = useState<PDFPage[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isMerging, setIsMerging] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [pdfjsLib, setPdfjsLib] = useState<any>(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadPdfjs = async () => {
            try {
                // @ts-ignore - dynamic import of minified build for better bundler compatibility
                const mod = await import('pdfjs-dist/build/pdf.min.mjs');
                mod.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.mjs`;
                setPdfjsLib(mod);
            } catch (error) {
                console.error("Failed to load PDF.js:", error);
            }
        };
        loadPdfjs();
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            await processFiles(Array.from(e.target.files));
        }
    };

    const onDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(false);
        if (e.dataTransfer.files) {
            await processFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    };

    const processFiles = async (newFiles: File[]) => {
        setError(null);
        const pdfFiles = newFiles.filter(f => f.type === 'application/pdf');

        if (pdfFiles.length === 0) {
            setError("Please upload PDF files only.");
            return;
        }

        if (!pdfjsLib) {
            setError("PDF engine is still loading. Please wait a moment.");
            return;
        }

        setIsProcessing(true);
        const newUploadedFiles: UploadedFile[] = [];
        const newPages: PDFPage[] = [];

        for (const file of pdfFiles) {
            const fileId = Math.random().toString(36).substring(7);
            const arrayBuffer = await file.arrayBuffer();

            try {
                // Get page count using pdfjs
                const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                const pdf = await loadingTask.promise;
                const pageCount = pdf.numPages;

                newUploadedFiles.push({
                    id: fileId,
                    file,
                    name: file.name,
                    size: file.size,
                    pageCount
                });

                // Generate thumbnails for each page
                for (let i = 1; i <= pageCount; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 0.3 }); // Small thumbnail
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    if (context) {
                        await page.render({ canvasContext: context, viewport }).promise;
                        const thumbnail = canvas.toDataURL();
                        newPages.push({
                            id: `${fileId}-${i}-${Math.random().toString(36).substring(2, 5)}`,
                            fileId,
                            originalIndex: i - 1,
                            thumbnail,
                            fileName: file.name,
                            fileSize: file.size
                        });
                    }
                }
            } catch (error) {
                console.error("Error processing PDF:", error);
            }
        }

        setFiles(prev => [...prev, ...newUploadedFiles]);
        setPages(prev => [...prev, ...newPages]);
        setIsProcessing(false);
    };

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setPages((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
        setActiveId(null);
    };

    const deletePage = (id: string) => {
        setPages(prev => prev.filter(p => p.id !== id));
    };

    const reset = () => {
        setFiles([]);
        setPages([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const mergePDfs = async () => {
        if (pages.length === 0) return;
        setIsMerging(true);

        try {
            const mergedPdf = await PDFDocument.create();

            // Group pages by fileId to minimize arrayBuffer calls if needed, 
            // but for simplicity and correct order, we'll map them 1-to-1

            // Cache for loaded PDFDocuments
            const fileDocCache: Record<string, PDFDocument> = {};

            for (const page of pages) {
                if (!fileDocCache[page.fileId]) {
                    const uploadedFile = files.find(f => f.id === page.fileId);
                    if (uploadedFile) {
                        const buffer = await uploadedFile.file.arrayBuffer();
                        fileDocCache[page.fileId] = await PDFDocument.load(buffer);
                    }
                }

                const srcDoc = fileDocCache[page.fileId];
                const [copiedPage] = await mergedPdf.copyPages(srcDoc, [page.originalIndex]);
                mergedPdf.addPage(copiedPage);
            }

            const mergedPdfBytes = await mergedPdf.save();
            // Cast to any to avoid TypeScript ArrayBufferLike vs ArrayBuffer incompatibility
            const blob = new Blob([mergedPdfBytes as any], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'merged_document.pdf';
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Merge failed:", error);
        } finally {
            setIsMerging(false);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
                            PDF Merger<br />Engine.
                        </h1>
                    </div>

                    <div className="col-span-12 lg:col-span-3 flex flex-col justify-end lg:items-end text-left lg:text-right mt-6 lg:mt-0">
                        <div className="max-w-xs space-y-6">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] font-mono">
                                [ System Status: Active ]<br />
                                High-performance document orchestration module.
                            </p>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
                                Combine multiple PDF assets into a singular, optimized structure with zero data retention.
                            </p>
                        </div>
                    </div>
                </div>

                {pages.length === 0 ? (
                    /* Initial Upload Zone */
                    <div className="max-w-4xl mx-auto">
                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDrop={onDrop}
                            className={`border border-black rounded-none p-16 md:p-32 text-center group transition-all duration-500 cursor-pointer relative overflow-hidden ${isDragActive
                                ? "bg-slate-50"
                                : "bg-white hover:bg-slate-50"
                                }`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {/* Vertical Accent Line */}
                            <div className="absolute left-[-1px] top-0 w-[1px] h-0 bg-black group-hover:h-full transition-all duration-700 ease-in-out"></div>

                            {isProcessing && (
                                <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center animate-fadeIn">
                                    <div className="w-16 h-16 border-2 border-black border-t-transparent rounded-full animate-spin mb-6"></div>
                                    <p className="text-xs font-bold uppercase tracking-[0.3em] font-mono">Analyzing Bitstream...</p>
                                    <p className="text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">{files.length} Files Queued</p>
                                </div>
                            )}

                            <input
                                type="file"
                                multiple
                                accept=".pdf"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />

                            <div className="flex flex-col items-center gap-6">
                                <div className={`w-16 h-16 rounded-full border border-black flex items-center justify-center transition-all duration-700 ${isDragActive ? 'bg-black text-white rotate-180 scale-125' : 'group-hover:rotate-45 group-hover:bg-slate-100'}`}>
                                    <CloudUpload className="w-6 h-6" />
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold tracking-tighter uppercase italic">
                                        {isDragActive ? "Initialize Transfer" : "Source PDF Upload"}
                                    </h2>
                                    <div className="flex items-center justify-center gap-3">
                                        <span className="h-[1px] w-4 bg-slate-300"></span>
                                        <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Drag + Drop assets here</p>
                                        <span className="h-[1px] w-4 bg-slate-300"></span>
                                    </div>
                                </div>

                                <button
                                    disabled={isProcessing}
                                    className="bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] py-5 px-10 rounded-full hover:scale-105 transition-all shadow-xl disabled:opacity-50 mt-4 group/btn flex items-center gap-3"
                                >
                                    {isProcessing ? "Processing..." : "Open Explorer"}
                                    {!isProcessing && <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />}
                                </button>
                            </div>

                            {error && (
                                <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium animate-fadeIn">
                                    {error}
                                </div>
                            )}
                        </div>

                        <div className="text-center mt-6 text-slate-400 text-sm flex items-center justify-center gap-2">
                            We do not store the files once the user's session expires <HelpCircle className="w-4 h-4" />
                        </div>
                    </div>
                ) : (
                    /* Editor Zone */
                    <div className="space-y-8 animate-fadeIn">
                        {/* Module Control Center (Toolbar) */}
                        <div className="flex flex-col md:flex-row flex-wrap items-center justify-between gap-6 bg-white p-6 md:p-8 border-b border-t border-black sticky top-16 md:top-24 z-30 mb-20 animate-slideUp">
                            <div className="flex flex-row items-center justify-between w-full md:w-auto gap-4 md:gap-10">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black text-white flex items-center justify-center font-mono text-[10px] md:text-xs font-bold ring-4 ring-slate-100 flex-shrink-0">
                                        {pages.length}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono italic whitespace-nowrap">Compiled Assets</span>
                                        <span className="text-xs md:text-sm font-bold uppercase tracking-tighter">Pages Ready</span>
                                    </div>
                                </div>
                                <div className="h-8 md:h-10 w-[1px] bg-slate-200"></div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono italic whitespace-nowrap">Payload Weight</span>
                                    <span className="text-xs md:text-sm font-mono font-bold tracking-tighter">{formatSize(files.reduce((acc, f) => acc + f.size, 0))}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-center md:justify-end gap-2 md:gap-3 w-full md:w-auto">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="group flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] font-mono border border-slate-200 rounded-full hover:border-black transition-all bg-white"
                                >
                                    <Plus className="w-3 h-3 group-hover:rotate-90 transition-transform duration-500" /> <span className="hidden sm:inline">Add Source</span><span className="inline sm:hidden">Add</span>
                                </button>
                                <button
                                    onClick={reset}
                                    className="px-4 md:px-6 py-2.5 md:py-3 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] font-mono border border-slate-200 rounded-full hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all text-slate-500 bg-white"
                                >
                                    Clear
                                </button>
                                <button
                                    onClick={mergePDfs}
                                    disabled={isMerging}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-3 md:gap-4 px-6 md:px-10 py-2.5 md:py-3 bg-black text-white rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] font-mono hover:scale-105 transition-all shadow-xl disabled:opacity-50 group/merge"
                                >
                                    {isMerging ? (
                                        <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Zap className="w-3 h-3 md:w-4 md:h-4 group-hover/merge:text-[#D2FF00] transition-colors" />
                                    )}
                                    {isMerging ? "Merging..." : <><span className="hidden sm:inline">Execute Merge</span><span className="inline sm:hidden">Merge</span></>}
                                </button>
                            </div>
                        </div>

                        {/* Sorting Grid */}
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext items={pages.map(p => p.id)} strategy={rectSortingStrategy}>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-12 gap-y-24">
                                    {pages.map((page, idx) => (
                                        <SortablePage
                                            key={page.id}
                                            page={page}
                                            index={idx}
                                            onDelete={deletePage}
                                            formatSize={formatSize}
                                        />
                                    ))}
                                </div>
                            </SortableContext>

                            <DragOverlay adjustScale={true}>
                                {activeId ? (
                                    <div className="w-[180px] h-[240px] bg-white rounded-none shadow-2xl border border-black overflow-hidden opacity-90 cursor-grabbing rotate-3">
                                        <img src={pages.find(p => p.id === activeId)?.thumbnail} className="w-full h-full object-cover" alt="Preview" />
                                        <div className="absolute inset-x-0 bottom-0 bg-black py-1 px-2">
                                            <span className="text-[8px] font-mono text-white uppercase tracking-tighter">Moving Asset_ID: {activeId.substring(0, 8)}</span>
                                        </div>
                                    </div>
                                ) : null}
                            </DragOverlay>
                        </DndContext>

                        <input
                            type="file"
                            multiple
                            accept=".pdf"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </div>
                )}

                <div className="mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                    <FeatureCard
                        icon={<Files className="w-6 h-6 text-black" />}
                        title="Asset Synchronization"
                        description="Orchestrate multiple PDF data streams into a singular, unified document structure with zero latency."
                    />
                    <FeatureCard
                        icon={<RotateCcw className="w-6 h-6 text-black" />}
                        title="Rapid Processing"
                        description="Engineered for high-volume document environments. Instant extraction and preview generation."
                    />
                    <FeatureCard
                        icon={<Shield className="w-6 h-6 text-black" />}
                        title="Vault Privacy"
                        description="End-to-end local processing. Your data never leaves the client-side execution environment."
                    />
                    <FeatureCard
                        icon={<CreditCard className="w-6 h-6 text-black" />}
                        title="Zero Cost Tier"
                        description="Full access to the Bitviron merging engine with no subscription requirement or usage caps."
                    />
                    <FeatureCard
                        icon={<Layout className="w-6 h-6 text-black" />}
                        title="System Agnostic"
                        description="Optimized for all browser environments. No native installation or driver dependencies required."
                    />
                    <FeatureCard
                        icon={<FileText className="w-6 h-6 text-black" />}
                        title="Output Verification"
                        description="Automated integrity checks on all merged output to ensure standard-compliant PDF structures."
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
                            <Step num={1} text="Initialize Data" description="Inject source PDF files into the local processing queue." />
                            <Step num={2} text="Orchestrate" description="Reconfigure page order and prune unnecessary assets via the visual editor." />
                            <Step num={3} text="Execute & Export" description="Compile the final document and initiate bitstream download." />
                        </div>
                        <div className="bg-slate-50 rounded-none p-12 border border-slate-200 flex items-center justify-center min-h-[500px] relative group overflow-hidden">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-black/5 blur-[80px] rounded-full -mr-16 -mt-16"></div>
                            <div className="relative z-10">
                                <div className="w-56 h-72 bg-white border border-slate-200 rounded-none shadow-xl flex items-center justify-center transform -rotate-6 group-hover:-rotate-12 transition-all duration-700">
                                    <FileText className="w-12 h-12 text-slate-100" />
                                </div>
                                <div className="absolute top-8 left-12 w-56 h-72 bg-white border border-black rounded-none shadow-2xl flex items-center justify-center z-10 group-hover:translate-x-4 group-hover:-translate-y-4 transition-all duration-700">
                                    <div className="flex flex-col items-center gap-4">
                                        <Zap className="w-10 h-10 text-black fill-black" />
                                        <span className="text-[10px] font-mono font-bold tracking-[0.4em] uppercase text-black">Output.pdf</span>
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
                                question="What is the PDF combiner used for?"
                                answer="The PDF combiner is used to merge multiple PDF documents into a single file. This is useful for organizing reports, combining scanned documents, or merging several pieces of a project into one final presentation."
                            />
                            <FAQItem
                                question="What functions does the PDF combiner have?"
                                answer="Our tool allows you to upload multiple files, preview every individual page, rearrange pages using drag-and-drop, and delete specific pages before performing the final merge."
                            />
                            <FAQItem
                                question="Does combining documents save space?"
                                answer="While the final merged file's size is generally the sum of the individual parts, having one document instead of several can make file management much easier and can sometimes reduce total metadata overhead."
                            />
                            <FAQItem
                                question="Can you combine PDF files for free?"
                                answer="Yes! Simply visit our online PDF Combiner to combine PDF files for free! We don't charge any fees or require accounts for basic document merging."
                            />
                        </div>
                    </div>
                </div>

                {/* Technical Footer Decoration */}
                <div className="mt-40 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30 select-none pointer-events-none font-mono text-[10px] uppercase tracking-widest">
                    <div className="flex gap-12">
                        <span className="flex items-center gap-2"><Cpu className="w-3 h-3" /> System: Stable</span>
                        <span className="flex items-center gap-2"><Terminal className="w-3 h-3" /> Encryption: AES-256</span>
                    </div>
                    <span>Bitviron Engine © {new Date().getFullYear()}</span>
                    <div className="flex gap-12">
                        <span>Latency: 2ms</span>
                        <span>Node: Edge_01</span>
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

function SortablePage({ page, index, onDelete, formatSize }: { page: PDFPage, index: number, onDelete: (id: string) => void, formatSize: (b: number) => string }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: page.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 0,
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            className="group relative flex flex-col gap-4 animate-fadeIn"
            style={{ ...style, animationDelay: `${index * 50}ms` }}
        >
            <div
                className={`relative bg-white rounded-none border border-slate-100 overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-500 hover:border-black shadow-sm group-hover:shadow-xl ${isDragging ? 'ring-1 ring-black bg-slate-50' : ''}`}
            >
                {/* Vertical Accent Line */}
                <div className="absolute left-0 top-0 w-[1px] h-0 bg-black group-hover:h-full transition-all duration-700 ease-in-out"></div>

                <div {...attributes} {...listeners} className="aspect-[3/4] w-full bg-slate-50 relative group/preview overflow-hidden">
                    <img
                        src={page.thumbnail}
                        alt={`Page preview`}
                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Progress Indicator Shimmer when dragging */}
                    {isDragging && (
                        <div className="absolute inset-0 bg-black/5 animate-pulse"></div>
                    )}

                    {/* Technical Index Overlay */}
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-white/90 border border-slate-100 font-mono text-[8px] font-bold uppercase tracking-widest text-slate-400">
                        IDX_{index + 1}
                    </div>
                </div>

                {/* Delete Button - Premium Monochrome */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(page.id);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:text-white hover:bg-black hover:border-black transition-all opacity-0 group-hover:opacity-100 z-10"
                >
                    <X className="w-3 h-3" />
                </button>
            </div>

            <div className="px-1 space-y-2 border-l border-slate-100 pl-4 group-hover:border-black transition-colors duration-500">
                <div className="flex justify-between items-start">
                    <p className="text-[10px] font-bold text-black uppercase tracking-widest font-mono truncate max-w-[120px]">
                        {page.fileName}
                    </p>
                    <span className="text-[8px] font-mono text-slate-300 uppercase">SYS_OK</span>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-[9px] text-slate-400 font-mono uppercase tracking-tighter">Weight</span>
                        <span className="text-[10px] text-black font-mono font-bold leading-none">{formatSize(page.fileSize)}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] text-slate-400 font-mono uppercase tracking-tighter">Origin</span>
                        <span className="text-[10px] font-bold text-black bg-slate-100 px-1.5 py-0.5 font-mono">P.{page.originalIndex + 1}</span>
                    </div>
                </div>
            </div>
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
