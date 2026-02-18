"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
    Image as ImageIcon,
    Download,
    ArrowUpRight,
    HelpCircle,
    Cpu,
    Terminal,
    ChevronRight,
    Maximize,
    Trash2,
    Plus,
    FileText,
    ArrowRight,
    Move,
    GripVertical,
    Loader2
} from 'lucide-react';
import { PDFDocument, ImageAlignment } from 'pdf-lib';

interface ImageFile {
    id: string;
    file: File;
    preview: string;
    width: number;
    height: number;
    size: number;
}

export default function JpgToPdfPage() {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [isDragActive, setIsDragActive] = useState(false);
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Clean up object URLs on unmount
    useEffect(() => {
        return () => {
            images.forEach(img => URL.revokeObjectURL(img.preview));
        };
    }, []);

    const processFiles = (files: FileList | File[]) => {
        setError(null);
        const newImages: ImageFile[] = [];
        const supportedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

        Array.from(files).forEach(file => {
            if (supportedTypes.includes(file.type)) {
                const preview = URL.createObjectURL(file);
                // Create an image element to get dimensions
                const img = new Image();
                img.onload = () => {
                    setImages(prev => [...prev, {
                        id: Math.random().toString(36).substr(2, 9),
                        file,
                        preview,
                        width: img.width,
                        height: img.height,
                        size: file.size
                    }]);
                };
                img.src = preview;
            } else {
                setError('Some files were skipped. Only JPG and PNG images are supported.');
            }
        });
    };

    const removeImage = (id: string) => {
        setImages(prev => {
            const next = prev.filter(img => img.id !== id);
            // Revoke URL for removed image
            const removed = prev.find(img => img.id === id);
            if (removed) URL.revokeObjectURL(removed.preview);
            return next;
        });
    };

    const moveImage = (index: number, direction: 'left' | 'right') => {
        if (direction === 'left' && index > 0) {
            const newImages = [...images];
            [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
            setImages(newImages);
        } else if (direction === 'right' && index < images.length - 1) {
            const newImages = [...images];
            [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
            setImages(newImages);
        }
    };

    const convertToPdf = async () => {
        if (images.length === 0) return;
        setIsConverting(true);
        try {
            const pdfDoc = await PDFDocument.create();

            for (const img of images) {
                const imgBytes = await img.file.arrayBuffer();
                let pdfImage;

                if (img.file.type === 'image/jpeg' || img.file.type === 'image/jpg') {
                    pdfImage = await pdfDoc.embedJpg(imgBytes);
                } else {
                    pdfImage = await pdfDoc.embedPng(imgBytes);
                }

                // Create page matching image dimensions
                // Using image dimensions as points (1pt = 1/72 inch)
                // This preserves original resolution without scaling
                const page = pdfDoc.addPage([pdfImage.width, pdfImage.height]);

                page.drawImage(pdfImage, {
                    x: 0,
                    y: 0,
                    width: pdfImage.width,
                    height: pdfImage.height,
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `images_converted.pdf`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error('Conversion failed:', e);
            setError('Failed to create PDF. Please ensure all images are valid.');
        } finally {
            setIsConverting(false);
        }
    };

    const reset = () => {
        setImages([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
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
                <div className="grid grid-cols-12 gap-8 mb-16 md:mb-24 border-b border-black pb-12 items-end">
                    <div className="col-span-12 lg:col-span-9">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="w-12 h-[1px] bg-black"></span>
                            <span className="text-xs font-bold uppercase tracking-[0.3em] font-mono">Image Processing // {new Date().getFullYear()}</span>
                        </div>
                        <h1 className="text-5xl md:text-[8vw] font-bold leading-[0.85] tracking-tighter uppercase text-black">
                            JPG to PDF<br />Synthesis.
                        </h1>
                    </div>
                    <div className="col-span-12 lg:col-span-3 flex flex-col justify-end lg:items-end text-left lg:text-right mt-6 lg:mt-0">
                        <div className="max-w-xs space-y-6">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] font-mono">
                                [ System Status: Active ]<br />
                                High-fidelity compilation engine.
                            </p>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
                                Transform image collections into professional PDF documents. Original dimensions preserved.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Interface */}
                <div>
                    {/* Toolbar / Actions */}
                    {/* Toolbar / Actions */}
                    <div className="flex flex-col md:flex-row flex-wrap items-center justify-between gap-6 bg-white p-6 md:p-8 border-b border-t border-black sticky top-16 md:top-24 z-30 mb-20 animate-slideUp">
                        <div className="flex flex-row items-center justify-between w-full md:w-auto gap-4 md:gap-10">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black text-white flex items-center justify-center font-mono text-[10px] md:text-xs font-bold ring-4 ring-slate-100 flex-shrink-0">
                                    {images.length}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono italic whitespace-nowrap">Source Images</span>
                                    <span className="text-xs md:text-sm font-bold uppercase tracking-tighter">Ready to Convert</span>
                                </div>
                            </div>
                            <div className="h-8 md:h-10 w-[1px] bg-slate-200"></div>
                            <div className="flex flex-col">
                                <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono italic whitespace-nowrap">Payload Weight</span>
                                <span className="text-xs md:text-sm font-mono font-bold tracking-tighter">{formatSize(images.reduce((acc, img) => acc + img.size, 0))}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-center md:justify-end gap-2 md:gap-3 w-full md:w-auto">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="group flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] font-mono border border-slate-200 rounded-full hover:border-black transition-all bg-white"
                            >
                                <Plus className="w-3 h-3 group-hover:rotate-90 transition-transform duration-500" /> <span className="hidden sm:inline">Add Images</span><span className="inline sm:hidden">Add</span>
                            </button>
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                multiple
                                className="hidden"
                                ref={fileInputRef}
                                onChange={(e) => { if (e.target.files) processFiles(e.target.files); }}
                            />
                            <button
                                onClick={reset}
                                className="px-4 md:px-6 py-2.5 md:py-3 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] font-mono border border-slate-200 rounded-full hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all text-slate-500 bg-white"
                            >
                                Clear
                            </button>
                            <button
                                onClick={convertToPdf}
                                disabled={images.length === 0 || isConverting}
                                className="flex-1 md:flex-none flex items-center justify-center gap-3 md:gap-4 px-6 md:px-10 py-2.5 md:py-3 bg-black text-white rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] font-mono hover:scale-105 transition-all shadow-xl disabled:opacity-50 group/merge"
                            >
                                {isConverting ? (
                                    <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <FileText className="w-3 h-3 md:w-4 md:h-4 group-hover/merge:text-[#D2FF00] transition-colors" />
                                )}
                                {isConverting ? "Synthesizing..." : <><span className="hidden sm:inline">Generate PDF</span><span className="inline sm:hidden">Convert</span></>}
                            </button>
                        </div>
                    </div>

                    {/* Image Grid / Drop Zone */}
                    <div className="min-h-[400px]">
                        {images.length === 0 ? (
                            <div
                                onDragOver={(e) => e.preventDefault()}
                                onDragEnter={() => setIsDragActive(true)}
                                onDragLeave={() => setIsDragActive(false)}
                                onDrop={(e) => { e.preventDefault(); setIsDragActive(false); if (e.dataTransfer.files) processFiles(e.dataTransfer.files); }}
                                className={`border border-black border-dashed rounded-none h-[400px] flex flex-col items-center justify-center gap-6 cursor-pointer transition-all duration-500 group relative overflow-hidden ${isDragActive ? 'bg-slate-50 border-solid' : 'hover:bg-slate-50'}`}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className={`w-20 h-20 rounded-full border border-black flex items-center justify-center transition-all duration-700 ${isDragActive ? 'bg-black text-white scale-110' : 'group-hover:rotate-90 group-hover:bg-black group-hover:text-white'}`}>
                                    <ImageIcon className="w-8 h-8" />
                                </div>
                                <div className="text-center space-y-2">
                                    <h2 className="text-2xl font-bold uppercase tracking-tighter">Drop Images Here</h2>
                                    <p className="text-xs font-mono uppercase tracking-widest text-slate-400">JPG • PNG • WEBP</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {images.map((img, idx) => (
                                    <div key={img.id} className="group relative aspect-[3/4] bg-slate-50 border border-slate-200 hover:border-black transition-all duration-300">
                                        <div className="absolute top-2 left-2 z-10 bg-white/90 px-2 py-1 text-[8px] font-mono font-bold border border-slate-100 uppercase">
                                            {idx + 1}
                                        </div>
                                        <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {idx > 0 && (
                                                <button onClick={() => moveImage(idx, 'left')} className="p-1.5 bg-white border border-slate-200 hover:bg-black hover:text-white transition-colors">
                                                    <ArrowRight className="w-3 h-3 rotate-180" />
                                                </button>
                                            )}
                                            {idx < images.length - 1 && (
                                                <button onClick={() => moveImage(idx, 'right')} className="p-1.5 bg-white border border-slate-200 hover:bg-black hover:text-white transition-colors">
                                                    <ArrowRight className="w-3 h-3" />
                                                </button>
                                            )}
                                            <button onClick={() => removeImage(img.id)} className="p-1.5 bg-white border border-slate-200 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors">
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <img src={img.preview} alt="" className="w-full h-full object-contain p-4" />
                                        <div className="absolute bottom-0 left-0 right-0 bg-white/90 border-t border-slate-100 p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-[9px] font-mono text-slate-500 truncate">{img.file.name}</p>
                                            <p className="text-[8px] font-mono text-slate-400">{img.width} × {img.height}</p>
                                        </div>
                                    </div>
                                ))}
                                {/* Add More Card */}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-[3/4] border border-black border-dashed flex flex-col items-center justify-center gap-3 hover:bg-slate-50 transition-colors group"
                                >
                                    <div className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center group-hover:border-black group-hover:bg-black group-hover:text-white transition-all">
                                        <Plus className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-black">Add Image</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="mt-8 p-4 bg-red-50 border-l-2 border-red-500 text-red-600 text-xs font-mono flex items-center gap-3">
                            <span className="font-bold">ERROR:</span> {error}
                        </div>
                    )}
                </div>

                {/* Feature Cards */}
                <div className="mt-32 md:mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 md:gap-y-24">
                    <FeatureCard icon={<ImageIcon className="w-6 h-6 text-black" />} title="Original Quality" description="Images are embedded directly without re-compression, preserving 100% of the original visual fidelity." />
                    <FeatureCard icon={<Maximize className="w-6 h-6 text-black" />} title="Adaptive Sizing" description="PDF pages automatically resize to match exact image dimensions. No cropping, no white borders." />
                    <FeatureCard icon={<Move className="w-6 h-6 text-black" />} title="Sequence Control" description="Drag-and-drop or use directional controls to perfectly order your image sequence before synthesis." />
                    <FeatureCard icon={<Cpu className="w-6 h-6 text-black" />} title="Local Processing" description="Your images never leave your device. All PDF generation happens instantly in your browser." />
                </div>

                {/* FAQ */}
                <div className="mt-32 md:mt-40 pt-16 md:pt-20 border-t border-black">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
                        <div>
                            <div className="text-xs font-bold uppercase tracking-[0.3em] font-mono text-slate-400 mb-4 inline-block border-l-2 border-black pl-4">Support</div>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-8">Frequently<br />Asked Questions</h2>
                            <p className="text-slate-500 mb-4 font-mono text-xs uppercase tracking-widest">[ System status: All systems operational ]</p>
                        </div>
                        <div className="space-y-4 md:space-y-6">
                            <FAQItem question="What image formats are supported?" answer="We currently support high-fidelity JPG and PNG formats. Support for WEBP and TIFF is in development." />
                            <FAQItem question="Does this reduce image quality?" answer="No. The engine embeds the original image data stream directly into the PDF container without re-encoding." />
                            <FAQItem question="Is there a limit on the number of images?" answer="There is no hard limit imposed by the software, though browser memory constraints may apply for extremely large batches (100+ high-res images)." />
                        </div>
                    </div>
                </div>

                {/* Technical Footer */}
                <div className="mt-32 md:mt-40 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30 select-none pointer-events-none font-mono text-[10px] uppercase tracking-widest">
                    <div className="flex gap-8 md:gap-12">
                        <span className="flex items-center gap-2"><Cpu className="w-3 h-3" /> Engine: Img2PDF_v1.0</span>
                        <span className="flex items-center gap-2"><Terminal className="w-3 h-3" /> Mode: Client_Side</span>
                    </div>
                    <span>Bitviron Engine © {new Date().getFullYear()}</span>
                </div>
            </div>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-slate-100 rounded-none overflow-hidden bg-white hover:border-black transition-all duration-500 group">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-5 md:p-8 text-left">
                <div className="flex items-center gap-3 md:gap-6">
                    <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[8px] md:text-[10px] font-bold transition-all duration-500 flex-shrink-0 ${isOpen ? 'bg-black text-white rotate-180' : 'bg-slate-100 text-slate-400 group-hover:bg-black group-hover:text-white'}`}>
                        {isOpen ? '↓' : '?'}
                    </div>
                    <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-slate-800">{question}</span>
                </div>
                <div className={`text-slate-300 transition-transform duration-500 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronRight className="w-4 h-4" />
                </div>
            </button>
            {isOpen && (
                <div className="px-6 md:px-10 pb-6 md:pb-10 pt-0 text-slate-500 text-xs font-mono uppercase tracking-widest leading-loose animate-fadeIn">
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
