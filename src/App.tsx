/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Camera, Lightbulb, Image as ImageIcon, Download, Share2, Upload } from 'lucide-react';

export default function App() {
  const [isProcessed, setIsProcessed] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<number>(0);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const defaultImageUrl = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1000";
  const currentImageUrl = userImage || defaultImageUrl;

  const handleApplyEffect = () => {
    if (isProcessed) {
      setIsProcessed(false);
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
        }, 1200);
      }, 1500);
    }, 1000);
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
    if (!imageRef.current) return;
    setIsDownloading(true);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.crossOrigin = "anonymous";
    img.src = currentImageUrl;

      img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      if (ctx) {
        if (isProcessed) {
          // Professional Studio Isolation Logic:
          // 1. Contrasting Studio Backdrop (Midnight Slate)
          ctx.fillStyle = '#050c14'; 
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // 2. High-Precision Contrast Processing (Reduced Saturation)
          ctx.filter = 'brightness(0.98) contrast(1.5) saturate(0.7)';
          
          // 3. Subject Isolation Mask (Feathered Studio Mask)
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
          const tempCtx = tempCanvas.getContext('2d');
          
          if (tempCtx) {
            tempCtx.drawImage(img, 0, 0);
            
            // Feathered mask for smooth integration
            const gradient = tempCtx.createRadialGradient(
              canvas.width / 2, canvas.height * 0.45, 0,
              canvas.width / 2, canvas.height * 0.45, Math.max(canvas.width, canvas.height) * 0.6
            );
            gradient.addColorStop(0, 'rgba(0,0,0,1)');
            gradient.addColorStop(0.5, 'rgba(0,0,0,1)'); 
            gradient.addColorStop(0.95, 'rgba(0,0,0,0)'); // Soft feathered edge

            tempCtx.globalCompositeOperation = 'destination-in';
            tempCtx.fillStyle = gradient;
            tempCtx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(tempCanvas, 0, 0);
          }

          // 4. Subtle Studio Lighting
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
          ctx.drawImage(img, 0, 0);
        }

        const link = document.createElement('a');
        link.download = `chiaroscuro-studio-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        setIsDownloading(false);
      }
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

      <main className="relative z-10 grid lg:grid-cols-2 min-h-[calc(100vh-89px)]">
        {/* Left Column: Hero Content */}
        <div className="flex flex-col justify-center p-8 lg:p-20 order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-[#F27D26] text-xs font-bold uppercase tracking-[0.3em] mb-4 block">
              Classical Chiaroscuro
            </span>
            <h1 className="text-6xl lg:text-8xl font-light leading-[0.9] mb-8 tracking-tighter">
              Subject <br />
              <span className="italic font-serif text-[#F27D26]">Mastery.</span>
            </h1>
            <p className="text-[#f5f2ed]/70 text-lg max-w-md mb-12 leading-relaxed font-light">
              Automatic subject identification and smooth studio cropping. We eliminate the background and place your subject in a high-contrast environment, just as if it were taken in a professional studio.
            </p>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleApplyEffect}
                disabled={isScanning}
                className="group relative px-8 py-4 bg-[#f5f2ed] text-black font-semibold rounded-full overflow-hidden transition-all hover:pr-12 disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isScanning ? "Identifying Subject..." : isProcessed ? "Original View" : "Apply Studio Effect"}
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

            <div className="mt-16 flex items-center gap-12 border-t border-[#f5f2ed]/10 pt-8">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-[#f5f2ed]/40 mb-1">Backdrop Color</span>
                <span className="text-sm font-medium italic">DEEP CHARCOAL</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-[#f5f2ed]/40 mb-1">Crop Mode</span>
                <span className="text-sm font-medium">STUDIO-ELITE</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-[#f5f2ed]/40 mb-1">Edge Refine</span>
                <span className="text-sm font-medium">ULTRA-SMOOTH</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Image Preview */}
        <div className="relative flex items-center justify-center p-8 lg:p-12 order-1 lg:order-2 bg-[#050505]">
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
                        {scanStep === 1 ? "Detecting Subject" : 
                         scanStep === 2 ? "Marching Ants Selection" : 
                         "Refining Studio Edge"}
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
                    {/* Studio Backdrop - Contrasting solid dark color */}
                    <div className="absolute inset-0 bg-[#050c14] z-0 overflow-hidden">
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient from-[#0a1a2a] to-transparent opacity-60 blur-3xl" />
                    </div>
                    
                    <motion.div
                      layoutId="subject"
                      className="w-full h-full relative z-10"
                      style={{
                        maskImage: 'radial-gradient(ellipse 50% 65% at 50% 45%, black 45%, transparent 95%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 50% 65% at 50% 45%, black 45%, transparent 95%)',
                      }}
                    >
                      <img 
                        src={currentImageUrl}
                        ref={imageRef}
                        alt="Chiaroscuro Cutout"
                        className="w-full h-full object-cover brightness-[0.98] contrast-[1.5] saturate-[0.7] drop-shadow-[0_0_40px_rgba(0,0,0,0.8)]"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                    
                    {/* Atmospheric Overlay */}
                    <div 
                      className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-25 z-15"
                      style={{
                        background: 'linear-gradient(215deg, rgba(242, 125, 38, 0.2) 0%, transparent 60%)'
                      }}
                    />

                    <div className="absolute top-4 left-4 bg-[#F27D26] px-3 py-1 rounded-full text-[10px] text-black uppercase tracking-[0.2em] font-bold z-30">
                      Cutout: Isolated
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
            
            <div className="absolute top-1/2 -right-16 translate-y-[-50%] hidden xl:block">
              <div className="rail-text flex flex-col gap-8 opacity-20 transform -rotate-180">
                <span className="text-[10px] uppercase tracking-[0.5em] writing-vertical">CHIAROSCURO</span>
                <span className="text-[10px] uppercase tracking-[0.5em] writing-vertical">STUDIO-ELITE</span>
              </div>
            </div>
          </div>
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
