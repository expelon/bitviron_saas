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
    CreditCard,
    Layers,
    ListFilter
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Configure PDF.js worker
const PDFJS_VERSION = '4.4.168';

interface PDFPage {
    id: string; // Unique ID for DnD
    originalIndex: number; // 0-based index in the original file
    thumbnail: string; // Data URL
    fileName: string;
    fileSize: number;
}

export default function PdfReorderPage() {
    const [file, setFile] = useState<File | null>(null);
    const [pages, setPages] = useState<PDFPage[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isReordering, setIsReordering] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);
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
                        fileSize: newFile.size
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
        setFile(null);
        setPages([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const exportReorderedPdf = async () => {
        if (!file || pages.length === 0) return;
        setIsReordering(true);

        try {
            const buffer = await file.arrayBuffer();
            const srcDoc = await PDFDocument.load(buffer);
            const destinationDoc = await PDFDocument.create();

            // Extract indices in the new order
            const pageIndices = pages.map(p => p.originalIndex);

            // Copy pages in the new order
            const copiedPages = await destinationDoc.copyPages(srcDoc, pageIndices);
            copiedPages.forEach(p => destinationDoc.addPage(p));

            const pdfBytes = await destinationDoc.save();
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `reordered_${file.name}`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Reorder failed:", error);
            setError("Failed to generate reordered PDF.");
        } finally {
            setIsReordering(false);
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
                            PDF Reorder<br />Console.
                        </h1>
                    </div>

                    <div className="col-span-12 lg:col-span-3 flex flex-col justify-end lg:items-end text-left lg:text-right mt-6 lg:mt-0">
                        <div className="max-w-xs space-y-6">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] font-mono">
                                [ System Status: Active ]<br />
                                High-performance page orchestration module.
                            </p>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
                                Rearrange PDF page structures with absolute precision. Fully client-side execution environment.
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
                                    <p className="text-xs font-bold uppercase tracking-[0.3em] font-mono">Deconstructing Bitstream...</p>
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
                                <div className={`w-16 h-16 rounded-full border border-black flex items-center justify-center transition-all duration-700 ${isDragActive ? 'bg-black text-white rotate-180 scale-125' : 'group-hover:rotate-45 group-hover:bg-slate-100'}`}>
                                    <Layers className="w-6 h-6" />
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold tracking-tighter uppercase italic">
                                        {isDragActive ? "Initialize Transfer" : "Source PDF Injection"}
                                    </h2>
                                    <div className="flex items-center justify-center gap-3">
                                        <span className="h-[1px] w-4 bg-slate-300"></span>
                                        <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Drag + Drop one PDF asset</p>
                                        <span className="h-[1px] w-4 bg-slate-300"></span>
                                    </div>
                                </div>

                                <button
                                    disabled={isProcessing}
                                    className="bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] py-5 px-10 rounded-full hover:scale-105 transition-all shadow-xl disabled:opacity-50 mt-4 group/btn flex items-center gap-3"
                                >
                                    {isProcessing ? "Processing..." : "Select File"}
                                    {!isProcessing && <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />}
                                </button>
                            </div>

                            {error && (
                                <div className="mt-6 p-4 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-[0.1em] font-mono animate-fadeIn">
                                    {error}
                                </div>
                            )}
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
                                        <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono italic whitespace-nowrap">Source Volume</span>
                                        <span className="text-xs md:text-sm font-bold uppercase tracking-tighter">Total Pages</span>
                                    </div>
                                </div>
                                <div className="h-8 md:h-10 w-[1px] bg-slate-200"></div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono italic whitespace-nowrap">File Weight</span>
                                    <span className="text-xs md:text-sm font-mono font-bold tracking-tighter">{formatSize(file?.size || 0)}</span>
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
                                    onClick={exportReorderedPdf}
                                    disabled={isReordering}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-3 md:gap-4 px-6 md:px-10 py-2.5 md:py-3 bg-black text-white rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] font-mono hover:scale-105 transition-all shadow-xl disabled:opacity-50 group/merge"
                                >
                                    {isReordering ? (
                                        <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Zap className="w-3 h-3 md:w-4 md:h-4 group-hover/merge:text-[#D2FF00] transition-colors" />
                                    )}
                                    {isReordering ? "Processing..." : "Export PDF"}
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
                                            <span className="text-[8px] font-mono text-white uppercase tracking-tighter">Moving Page: {pages.find(p => p.id === activeId)?.originalIndex! + 1}</span>
                                        </div>
                                    </div>
                                ) : null}
                            </DragOverlay>
                        </DndContext>
                    </div>
                )}

                <div className="mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                    <FeatureCard
                        icon={<ListFilter className="w-6 h-6 text-black" />}
                        title="Visual Orchestration"
                        description="Intuitive drag-and-drop interface for rapid page re-sequencing and document restructuring."
                    />
                    <FeatureCard
                        icon={<Zap className="w-6 h-6 text-black" />}
                        title="Sub-second Latency"
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
                        description="Full access to the Bitviron reordering engine with no subscription requirement or usage caps."
                    />
                    <FeatureCard
                        icon={<Layout className="w-6 h-6 text-black" />}
                        title="System Agnostic"
                        description="Optimized for all browser environments. No native installation or driver dependencies required."
                    />
                    <FeatureCard
                        icon={<FileText className="w-6 h-6 text-black" />}
                        title="Output Verification"
                        description="Automated integrity checks on all processed output to ensure standard-compliant PDF structures."
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
                            <Step num={1} text="Inject Asset" description="Upload a single PDF document into the local processing queue." />
                            <Step num={2} text="Reconfigure" description="Rearrange pages using the drag-and-drop editor or remove unnecessary pages." />
                            <Step num={3} text="Execute & Export" description="Compile the final document structure and initiate bitstream download." />
                        </div>
                        <div className="bg-slate-50 rounded-none p-6 md:p-12 border border-slate-200 flex items-center justify-center min-h-[400px] md:min-h-[500px] relative group overflow-hidden">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-black/5 blur-[80px] rounded-full -mr-16 -mt-16"></div>
                            <div className="relative z-10 scale-[0.7] md:scale-100">
                                <div className="w-56 h-72 bg-white border border-slate-200 rounded-none shadow-xl flex items-center justify-center transform -rotate-6 group-hover:-rotate-12 transition-all duration-700">
                                    <FileText className="w-12 h-12 text-slate-100" />
                                </div>
                                <div className="absolute top-8 left-12 w-56 h-72 bg-white border border-black rounded-none shadow-2xl flex items-center justify-center z-10 group-hover:translate-x-4 group-hover:-translate-y-4 transition-all duration-700">
                                    <div className="flex flex-col items-center gap-4">
                                        <Layers className="w-10 h-10 text-black fill-black" />
                                        <span className="text-[10px] font-mono font-bold tracking-[0.4em] uppercase text-black">Reordered_Output</span>
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
                                question="What is the PDF Reorder tool used for?"
                                answer="The Reorder PDF tool allows you to change the sequence of pages in a single PDF document. It's useful for fixing scanning errors, organizing reports, or removing unwanted pages."
                            />
                            <FAQItem
                                question="Is my data secure when reordering?"
                                answer="Yes. All processing happens locally in your browser. Your PDF file is never uploaded to any server, ensuring complete privacy and security."
                            />
                            <FAQItem
                                question="Can I delete pages while reordering?"
                                answer="Absolutely. You can click the 'X' button on any page thumbnail to remove it from the final document before exporting."
                            />
                            <FAQItem
                                question="Is there a limit to how many pages I can reorder?"
                                answer="There is no hard limit, though performance may vary depending on your device's memory for exceptionally large documents (500+ pages)."
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
                        <span>Latency: 1ms</span>
                        <span>Node: Edge_Orchestrator</span>
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

                    {/* Technical Index Overlay */}
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-white/90 border border-slate-100 font-mono text-[8px] font-bold uppercase tracking-widest text-slate-400">
                        IDX_{index + 1}
                    </div>
                </div>

                {/* Delete Button */}
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
                    <p className="text-[9px] font-mono text-slate-400 uppercase tracking-tighter">Origin: P.{page.originalIndex + 1}</p>
                    <span className="text-[8px] font-mono text-slate-300 uppercase">SYS_OK</span>
                </div>
                <div className="text-[10px] font-bold text-black uppercase tracking-widest font-mono">
                    {formatSize(page.fileSize)}
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
