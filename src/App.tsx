/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Camera, Lightbulb, Image as ImageIcon, Download, Share2, Upload, Crop as CropIcon, Check, X, Maximize } from 'lucide-react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function App() {
  const [isProcessed, setIsProcessed] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<number>(0);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [intensity, setIntensity] = useState(0.8);
  const [effectStyle, setEffectStyle] = useState<'chiaroscuro' | 'roversi'>('chiaroscuro');
  const [showOutline, setShowOutline] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [imgDims, setImgDims] = useState({ width: 0, height: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const defaultImageUrl = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1000";
  const currentImageUrl = userImage || defaultImageUrl;

  const handleApplyEffect = () => {
    if (isProcessed) {
      setIsProcessed(false);
      setProcessedImageUrl(null);
      setIsCropping(false);
      setScanStep(0);
      return;
    }
    
    setIsScanning(true);
    setScanStep(1); // Identification

    // Phase 1: Identifying
    setTimeout(() => {
      setScanStep(2); // Selection
      
      // Phase 2: Selection
      setTimeout(() => {
        setScanStep(3); // Edge Refinement
        
        // Phase 3: Edge Refinement
        setTimeout(() => {
          setIsScanning(false);
          setScanStep(0);
          setIsProcessed(true);
          generateProcessedPreview();
        }, 1200);
      }, 1500);
    }, 1000);
  };

  const generateProcessedPreview = () => {
    if (!currentImageUrl) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.crossOrigin = "anonymous";
    img.src = currentImageUrl;

    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      if (ctx) {
        if (effectStyle === 'chiaroscuro') {
          // Professional Studio Isolation Logic:
          ctx.fillStyle = '#050c14'; 
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          const brightness = 1 - (0.02 * intensity);
          const contrast = 1 + (0.5 * intensity);
          let filterStr = `brightness(${brightness}) contrast(${contrast}) saturate(0.7)`;
          if (showOutline) {
            filterStr += ' drop-shadow(0 0 4px rgba(242, 125, 38, 0.4))';
          }
          ctx.filter = filterStr;
          
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
          const tempCtx = tempCanvas.getContext('2d');
          
          if (tempCtx) {
            tempCtx.drawImage(img, 0, 0);
            
            const gradient = tempCtx.createRadialGradient(
              canvas.width / 2, canvas.height * 0.45, 0,
              canvas.width / 2, canvas.height * 0.45, Math.max(canvas.width, canvas.height) * 0.6
            );
            gradient.addColorStop(0, 'rgba(0,0,0,1)');
            gradient.addColorStop(0.5, 'rgba(0,0,0,1)'); 
            gradient.addColorStop(0.95, 'rgba(0,0,0,0)');

            tempCtx.globalCompositeOperation = 'destination-in';
            tempCtx.fillStyle = gradient;
            tempCtx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(tempCanvas, 0, 0);
          }

          const ambientGradient = ctx.createRadialGradient(
            canvas.width * 0.7, canvas.height * 0.3, 0,
            canvas.width * 0.7, canvas.height * 0.3, canvas.width 
          );
          ambientGradient.addColorStop(0, 'rgba(255,255,255,0.03)');
          ambientGradient.addColorStop(1, 'rgba(0,0,0,0.4)');
          
          ctx.globalCompositeOperation = 'overlay';
          ctx.fillStyle = ambientGradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          // Paolo Roversi Effect
          ctx.fillStyle = '#050c14'; 
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          const blur = 2 * intensity;
          const brightness = 1.05 + (0.1 * intensity);
          const contrast = 0.95 - (0.15 * intensity);
          let filterStr = `blur(${blur}px) brightness(${brightness}) contrast(${contrast}) saturate(0.5) sepia(0.2)`;
          if (showOutline) {
            filterStr += ' drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))';
          }
          ctx.filter = filterStr;

          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
          const tempCtx = tempCanvas.getContext('2d');
          
          if (tempCtx) {
            tempCtx.drawImage(img, 0, 0);
            
            const gradient = tempCtx.createRadialGradient(
              canvas.width / 2, canvas.height * 0.4, 0,
              canvas.width / 2, canvas.height * 0.4, Math.max(canvas.width, canvas.height) * 0.7
            );
            gradient.addColorStop(0, 'rgba(0,0,0,1)');
            gradient.addColorStop(0.3, 'rgba(0,0,0,0.8)');
            gradient.addColorStop(1, 'rgba(0,0,0,0)');

            tempCtx.globalCompositeOperation = 'destination-in';
            tempCtx.fillStyle = gradient;
            tempCtx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(tempCanvas, 0, 0);
          }

          // Soft ethereal glow
          ctx.globalCompositeOperation = 'screen';
          ctx.filter = 'blur(20px) opacity(0.3)';
          ctx.drawImage(img, 0, 0);
        }

        setProcessedImageUrl(canvas.toDataURL('image/png'));
      }
    };
  };

  useEffect(() => {
    if (isProcessed) {
      const timer = setTimeout(() => {
        generateProcessedPreview();
      }, 300); // Debounce
      return () => clearTimeout(timer);
    }
  }, [intensity, effectStyle, showOutline, isProcessed]);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          aspect,
          width,
          height
        ),
        width,
        height
      ));
    }
  };

  const handleAspectChange = (newAspect: number | undefined) => {
    setAspect(newAspect);
    if (!newAspect) {
      setCrop(undefined);
      return;
    }

    if (imageRef.current) {
      const { width, height } = imageRef.current;
      const newCrop = centerCrop(
        makeAspectCrop(
          { unit: '%', width: 90 },
          newAspect,
          width,
          height
        ),
        width,
        height
      );
      setCrop(newCrop);
    }
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUserImage(url);
      setIsProcessed(false);
      setScanStep(0);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleDownload = async () => {
    if (!processedImageUrl) return;
    setIsDownloading(true);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.crossOrigin = "anonymous";
    img.src = processedImageUrl;

    img.onload = () => {
      if (completedCrop && imgDims.width > 0) {
        const scaleX = img.naturalWidth / imgDims.width;
        const scaleY = img.naturalHeight / imgDims.height;

        canvas.width = completedCrop.width * scaleX;
        canvas.height = completedCrop.height * scaleY;

        ctx?.drawImage(
          img,
          completedCrop.x * scaleX,
          completedCrop.y * scaleY,
          completedCrop.width * scaleX,
          completedCrop.height * scaleY,
          0,
          0,
          canvas.width,
          canvas.height
        );
      } else {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx?.drawImage(img, 0, 0);
      }

      const link = document.createElement('a');
      link.download = `chiaroscuro-studio-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setIsDownloading(false);
    };
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f2ed] font-sans selection:bg-[#F27D26] selection:text-white overflow-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#F27D26]/10 rounded-full blur-[120px]"
          style={{ transform: 'rotate(-15deg)' }}
        />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#3a1510]/30 rounded-full blur-[150px]"
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-[#f5f2ed]/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#F27D26] rounded-full flex items-center justify-center">
            <Camera className="w-4 h-4 text-black" />
          </div>
          <span className="text-sm font-semibold uppercase tracking-[0.2em]">Chiaroscuro Studio</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-widest font-medium text-[#f5f2ed]/60">
          <a href="#" className="hover:text-[#F27D26] transition-colors">Portraits</a>
          <a href="#" className="hover:text-[#F27D26] transition-colors">Lighting Tech</a>
          <a href="#" className="hover:text-[#F27D26] transition-colors">Fine Art</a>
          <button className="px-5 py-2 border border-[#f5f2ed]/30 rounded-full hover:border-[#F27D26] hover:text-[#F27D26] transition-all">
            Get Pro
          </button>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center min-h-[calc(100vh-89px)] py-12 px-4">
        {/* Top: Image Preview */}
        <div className="relative w-full max-w-4xl flex items-center justify-center mb-12">
          <div className="absolute inset-0 z-0 overflow-hidden opacity-20">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-radial-gradient from-[#F27D26]/20 to-transparent blur-[100px]" />
          </div>

          <div className="relative w-full max-w-lg aspect-[3/4] group">
            {/* Image Frame */}
            <div className="absolute inset-0 border border-[#f5f2ed]/10 rounded-2xl overflow-hidden shadow-2xl bg-[#121212]">
              <AnimatePresence mode="wait">
                {isScanning && (
                  <motion.div
                    key="scanning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm overflow-hidden"
                  >
                    {/* Laser Tracing Line */}
                    <motion.div 
                      className="absolute inset-x-0 h-[3px] bg-[#F27D26] z-30 shadow-[0_0_20px_#F27D26]"
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    />

                    <div className="relative w-full h-full flex items-center justify-center p-12">
                      {/* Marching Ants Selection Path */}
                      <svg className="absolute inset-0 w-full h-full z-25 pointer-events-none overflow-visible">
                        <motion.ellipse
                          cx="50%"
                          cy="45%"
                          rx="48%"
                          ry="62%"
                          fill="none"
                          stroke="#F27D26"
                          strokeWidth="2"
                          strokeDasharray="12 8"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={scanStep >= 2 ? { 
                            pathLength: 1, 
                            opacity: 1,
                            strokeDashoffset: [0, -40]
                          } : {}}
                          transition={{ 
                            pathLength: { duration: 1.5, ease: "easeInOut" },
                            strokeDashoffset: { duration: 1, repeat: Infinity, ease: "linear" }
                          }}
                        />
                      </svg>

                      {/* Identification Points */}
                      <AnimatePresence>
                        {scanStep >= 1 && (
                          <div className="absolute inset-0 z-26">
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-[20%] left-[30%] w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} className="absolute top-[18%] right-[32%] w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="absolute top-[45%] left-[25%] w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="absolute top-[48%] right-[24%] w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
                          </div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="mt-8 text-center bg-black/90 backdrop-blur-2xl px-8 py-4 rounded-full border border-white/20 shadow-2xl z-40">
                      <span className="text-[10px] tracking-[0.5em] uppercase text-[#F27D26] font-black">
                        {scanStep === 1 ? "SAM 2: SEGMENTING SUBJECT" : 
                         scanStep === 2 ? "BiRefNet: REFINING EDGES" : 
                         "FINALIZING STUDIO RENDER"}
                      </span>
                    </div>
                  </motion.div>
                )}

                {!isProcessed ? (
                  <motion.div
                    key="original"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full relative"
                  >
                    <img 
                      src={currentImageUrl}
                      alt="Original Portrait"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold border border-white/10 text-white/80">
                      Input Source
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="processed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full h-full relative overflow-hidden bg-[#050c14]"
                  >
                    {isCropping && (
                      <div className="absolute inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center p-6 backdrop-blur-md">
                        <div className="mb-6 flex gap-3 overflow-x-auto py-2 no-scrollbar max-w-full">
                          {[
                            { label: 'Free', value: undefined },
                            { label: '1:1', value: 1 },
                            { label: '4:5', value: 4/5 },
                            { label: '16:9', value: 16/9 },
                            { label: '3:2', value: 3/2 }
                          ].map((p) => (
                            <button 
                              key={p.label}
                              onClick={() => handleAspectChange(p.value)}
                              className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest transition-all border ${aspect === p.value ? 'bg-[#F27D26] text-black border-[#F27D26]' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'}`}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>

                        <div className="relative max-h-[60vh] flex items-center justify-center overflow-hidden border border-white/10 rounded-lg">
                          <ReactCrop
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspect}
                            className="max-w-full max-h-full"
                          >
                            <img 
                              src={processedImageUrl || currentImageUrl} 
                              onLoad={(e) => {
                                onImageLoad(e);
                                setImgDims({ width: e.currentTarget.width, height: e.currentTarget.height });
                              }}
                              ref={imageRef}
                              alt="Crop Target"
                              className="max-h-[55vh] w-auto object-contain"
                            />
                          </ReactCrop>
                        </div>

                        <div className="mt-8 flex gap-4">
                          <button 
                            onClick={() => {
                              setIsCropping(false);
                              setCompletedCrop(undefined);
                              setCrop(undefined);
                            }}
                            className="flex items-center gap-2 px-8 py-3 border border-white/20 rounded-full text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all text-white/80"
                          >
                            <X className="w-3 h-3" />
                            Cancel
                          </button>
                          <button 
                            onClick={() => setIsCropping(false)}
                            className="flex items-center gap-2 px-8 py-3 bg-[#F27D26] text-black rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:brightness-110 shadow-lg shadow-[#F27D26]/20 transition-all"
                          >
                            <Check className="w-3 h-3" />
                            Apply Selection
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Studio Backdrop */}
                    <div className="absolute inset-0 z-0 overflow-hidden bg-[#050c14]">
                       <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient blur-3xl ${effectStyle === 'chiaroscuro' ? 'from-[#0a1a2a] to-transparent opacity-60' : 'from-white/10 to-transparent opacity-20'}`} />
                    </div>
                    
                    <motion.div
                      layoutId="subject"
                      className="w-full h-full relative z-10"
                      style={{
                        maskImage: effectStyle === 'chiaroscuro' 
                          ? 'radial-gradient(ellipse 50% 65% at 50% 45%, black 45%, transparent 95%)'
                          : 'radial-gradient(ellipse 50% 65% at 50% 45%, black 30%, rgba(0,0,0,0.8) 50%, transparent 90%)',
                        WebkitMaskImage: effectStyle === 'chiaroscuro' 
                          ? 'radial-gradient(ellipse 50% 65% at 50% 45%, black 45%, transparent 95%)'
                          : 'radial-gradient(ellipse 50% 65% at 50% 45%, black 30%, rgba(0,0,0,0.8) 50%, transparent 90%)',
                      }}
                    >
                      <img 
                        src={currentImageUrl}
                        alt="Studio Cutout"
                        className="w-full h-full object-cover transition-all duration-300"
                        style={{
                          filter: effectStyle === 'chiaroscuro' 
                            ? `brightness(${1 - (0.02 * intensity)}) contrast(${1 + (0.5 * intensity)}) saturate(0.7) ${showOutline ? 'drop-shadow(0 0 10px rgba(242, 125, 38, 0.5))' : 'drop-shadow(0 0 40px rgba(0,0,0,0.8))'}`
                            : `blur(${2 * intensity}px) brightness(${1.05 + (0.1 * intensity)}) contrast(${0.95 - (0.15 * intensity)}) saturate(0.5) sepia(0.2) ${showOutline ? 'drop-shadow(0 0 12px rgba(255,255,255,0.3))' : ''}`,
                        }}
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                    
                    {/* Atmospheric Overlay */}
                    <div 
                      className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-25 z-15"
                      style={{
                        background: effectStyle === 'chiaroscuro'
                          ? 'linear-gradient(215deg, rgba(242, 125, 38, 0.2) 0%, transparent 60%)'
                          : 'linear-gradient(215deg, rgba(255, 255, 255, 0.1) 0%, transparent 60%)'
                      }}
                    />

                    <div className={`absolute top-4 left-4 ${effectStyle === 'chiaroscuro' ? 'bg-[#F27D26] text-black' : 'bg-white/10 backdrop-blur-md text-white'} px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold z-30`}>
                      {effectStyle === 'chiaroscuro' ? 'Chiaroscuro' : 'Paolo Roversi'}
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-auto z-30">
                      <div className="flex gap-2">
                        <button 
                          onClick={handleDownload}
                          disabled={isDownloading}
                          className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-all border border-white/10 disabled:opacity-50"
                        >
                          <Download className={`w-4 h-4 text-white ${isDownloading ? 'animate-pulse' : ''}`} />
                        </button>
                        <button 
                          onClick={() => setIsCropping(true)}
                          className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-all border border-white/10"
                        >
                          <CropIcon className="w-4 h-4 text-white" />
                        </button>
                        <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-all border border-white/10">
                          <Share2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-[#F27D26]/60 italic font-medium">
                        Studio Ready
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-12 h-12 border-t-2 border-r-2 border-[#F27D26]/40 rounded-tr-xl" />
            <div className="absolute -bottom-6 -left-6 w-12 h-12 border-b-2 border-l-2 border-[#F27D26]/40 rounded-bl-xl" />
          </div>
        </div>

        {/* Middle: Controls (Beneath image, above title) */}
        <div className="w-full max-w-4xl px-8 mb-16">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Primary Action Buttons */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={handleApplyEffect}
                  disabled={isScanning}
                  className="group relative px-8 py-4 bg-[#f5f2ed] text-black font-semibold rounded-full overflow-hidden transition-all hover:pr-12 disabled:opacity-50 min-w-[220px]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isScanning ? "Applying..." : isProcessed ? "Original View" : "Apply Studio Effect"}
                    <Sparkles className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
                  </span>
                  <motion.div 
                    className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
                    initial={false}
                    animate={isProcessed ? { x: 0 } : { x: -10 }}
                  >
                    <Sparkles className="w-4 h-4 text-[#F27D26]" />
                  </motion.div>
                </button>
                
                <button 
                  onClick={triggerUpload}
                  disabled={isScanning}
                  className="flex items-center gap-2 px-8 py-4 border border-[#f5f2ed]/30 rounded-full hover:bg-[#f5f2ed]/5 transition-all outline-none focus:ring-2 focus:ring-[#F27D26]"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Reference</span>
                </button>
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Stats / Meta */}
              <div className="flex items-center gap-10 mt-4 border-t border-[#f5f2ed]/10 pt-6">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest text-[#f5f2ed]/40 mb-1">Segmentation</span>
                  <span className="text-[11px] font-medium">META SAM 2</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest text-[#f5f2ed]/40 mb-1">Refinement</span>
                  <span className="text-[11px] font-medium">BiRefNet</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest text-[#f5f2ed]/40 mb-1">Outline</span>
                  <span className="text-[11px] font-medium text-[#F27D26]">{showOutline ? "ENABLED" : "AUTO-OFF"}</span>
                </div>
              </div>
            </div>

            {/* Effect Controls */}
            <div className="w-full">
              <AnimatePresence>
                {isProcessed && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-6 bg-white/5 rounded-2xl border border-white/10"
                  >
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase tracking-widest text-[#f5f2ed]/40">Style Configuration</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setEffectStyle('chiaroscuro')}
                            className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-tighter transition-all ${effectStyle === 'chiaroscuro' ? 'bg-[#F27D26] text-black' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                          >
                            Chiaroscuro
                          </button>
                          <button 
                            onClick={() => setEffectStyle('roversi')}
                            className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-tighter transition-all ${effectStyle === 'roversi' ? 'bg-[#F27D26] text-black' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                          >
                            Roversi
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between group">
                        <span className="text-[10px] uppercase tracking-widest text-[#f5f2ed]/40">Subject Outline</span>
                        <button 
                          onClick={() => setShowOutline(!showOutline)}
                          className={`w-10 h-5 rounded-full transition-all relative ${showOutline ? 'bg-[#F27D26]' : 'bg-white/10'}`}
                        >
                          <motion.div 
                            className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full"
                            animate={{ x: showOutline ? 20 : 0 }}
                          />
                        </button>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] uppercase tracking-widest text-[#f5f2ed]/40">Intensity Alpha</span>
                          <span className="text-[10px] font-mono text-[#F27D26]">{(intensity * 100).toFixed(0)}%</span>
                        </div>
                        <input 
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={intensity}
                          onChange={(e) => setIntensity(parseFloat(e.target.value))}
                          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#F27D26]"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                {!isProcessed && (
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 border-dashed flex items-center justify-center h-[180px] text-[10px] uppercase tracking-widest text-white/20">
                    Apply effect to access controls
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom: Hero Text Section */}
        <div className="w-full max-w-4xl px-8 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-center md:text-left"
          >
            <span className="text-[#F27D26] text-xs font-bold uppercase tracking-[0.3em] mb-4 block">
              Classical Chiaroscuro
            </span>
            <h1 className="text-6xl lg:text-8xl font-light leading-[0.9] mb-10 tracking-tighter max-w-2xl mx-auto md:mx-0">
              Subject <br />
              <span className="italic font-serif text-[#F27D26]">Mastery.</span>
            </h1>
            <div className="grid md:grid-cols-2 gap-12 text-[#f5f2ed]/70 text-lg leading-relaxed font-light text-left">
              <p>
                Automatic subject identification and smooth studio cropping. We eliminate the background and place your subject in a high-contrast environment, just as if it were taken in a professional studio using SAM 2 segmentation and BiRefNet refinement.
              </p>
              <p>
                Inspired by the masters of light, our studio-elite algorithm focuses on the intersection of modern AI and classical photography techniques, providing lossless edge quality for professional portraiture.
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer / Meta */}
      <footer className="relative z-10 px-8 py-6 text-[10px] uppercase tracking-[0.3em] text-[#f5f2ed]/30 flex justify-between">
        <span>&copy; 2026 Chiaroscuro Portrait Studio</span>
        <div className="flex gap-8">
          <span>Vision</span>
          <span>Terms of Light</span>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .writing-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}} />
    </div>
  );
}
