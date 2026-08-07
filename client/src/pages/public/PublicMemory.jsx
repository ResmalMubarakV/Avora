import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams, useLocation } from "react-router-dom";
import api from "../../api/axios";
import { getMyProfile } from "../../api/userApi";

import Navbar from "../../components/dashboard/Navbar";
import AppHeader from "../../components/navigation/AppHeader";
import MemoryHero from "../../components/memory/MemoryHero";
import Lightbox from "../../components/memory/Lightbox";
import PageTitle from "../../components/common/PageTitle";
import PrintableView from "../../components/memory/PrintableView";

import { Compass, Download, X, Loader2, AlertCircle, ChevronLeft, ChevronRight, ZoomIn, RefreshCcw, MousePointerClick, Settings2, MoveHorizontal, MoveVertical } from "lucide-react";
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import html2pdf from 'html2pdf.js';

// ==========================================
// PUBLIC MEMORY PAGE COMPONENT
// ==========================================
const PublicMemory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentUser, setCurrentUser] = useState(null);
  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);

  const isPreviewMode = searchParams.get("preview") === "true";
  const layoutIndex = searchParams.has("layout") ? Number(searchParams.get("layout")) : 0;

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [mapCoords, setMapCoords] = useState([20.5937, 78.9629]); 
  
  const [previewScale, setPreviewScale] = useState(1);
  const previewContainerRef = useRef(null);

  // --- Safe Initializer for Lightbox Index & Visibility ---
  const imageParam = searchParams.get("image");
  const videoParam = searchParams.get("video");
  const initialActiveParam = imageParam !== null ? imageParam : videoParam;

  const [isOpen, setIsOpen] = useState(initialActiveParam !== null);
  const [selectedIndex, setSelectedIndex] = useState(initialActiveParam ? Number(initialActiveParam) : 0);

  // --- Interactive Editor State ---
  const [mediaConfig, setMediaConfig] = useState(null);
  const [activeSlot, setActiveSlot] = useState(null);

  const allImages = Array.from(new Set([
      memory?.coverImage, 
      ...(memory?.media?.filter(m => m.type === 'image').map(m => m.url) || [])
  ].filter(Boolean))).map(url => ({ url }));

  // Helper function to detect media type at a specific index
  const getParamKey = (index) => {
    const item = memory?.media?.[index];
    const isVideo = item?.type === "video" || /\.(mp4|webm|ogg|ogv|mov|m4v)(\?.*)?$/i.test(item?.url || "");
    return isVideo ? "video" : "image";
  };

  useEffect(() => {
    if (memory?.latitude && memory?.longitude) {
        setMapCoords([memory.latitude, memory.longitude]);
    } else if (memory?.location) {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(memory.location)}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.length > 0) {
              setMapCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
            }
          }).catch(err => console.error("Geocoding failed:", err));
    }
  }, [memory]);

  useEffect(() => {
    if (isPreviewMode && memory && !mediaConfig) {
        const baseCover = memory.coverImage || (allImages.length > 0 ? allImages[0].url : "");
        const initialSlots = Array.from({ length: 9 }).map((_, i) => {
            const fallbackImg = allImages[i % allImages.length];
            return { url: fallbackImg?.url || '', zoom: 1, x: 0, y: 0 };
        });
        setMediaConfig({
            cover: { url: baseCover, zoom: 1, x: 0, y: 0 },
            slots: initialSlots
        });
    }
  }, [isPreviewMode, memory, mediaConfig, allImages]);

  useEffect(() => {
    if (isPreviewMode && !isDownloading) {
      setDownloadError(""); 
      const calculateScale = () => {
        if (previewContainerRef.current) {
          const availableWidth = previewContainerRef.current.offsetWidth - 32; 
          const availableHeight = previewContainerRef.current.offsetHeight - 32; 
          const scaleX = availableWidth / 800;
          const scaleY = availableHeight / 1131;
          setPreviewScale(Math.min(scaleX, scaleY, 1));
        }
      };
      calculateScale();
      window.addEventListener("resize", calculateScale);
      return () => window.removeEventListener("resize", calculateScale);
    }
  }, [isPreviewMode, layoutIndex, activeSlot, isDownloading]); 

  // --- FLAWLESS PDF GENERATION ENGINE ---
  const executeDownload = () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadError("");
    setActiveSlot(null); 

    const originalScale = previewScale;
    setPreviewScale(1);

    setTimeout(async () => {
      const element = document.getElementById('actual-print-container');
      if (!element) {
          setIsDownloading(false);
          setPreviewScale(originalScale);
          return;
      }

      const opt = { 
          margin: 0,
          filename: `${memory?.slug || 'memory'}-diary.pdf`,
          image: { type: 'jpeg', quality: 1.0 }, 
          html2canvas: { 
            scale: 3, 
            useCORS: true, 
            letterRendering: true,
            windowWidth: 800,
            backgroundColor: '#ffffff',
            onclone: (clonedDoc) => {
                const styles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
                styles.forEach(s => {
                    if (s.href && s.href.includes('fonts.googleapis')) return;
                    s.remove();
                });
            }
          },
          jsPDF: { 
            unit: 'px', 
            format: [800, 1131], 
            orientation: 'portrait',
            compress: false 
          } 
      };

      try {
          await html2pdf().from(element).set(opt).save();
      } catch (error) {
          console.error("PDF Export failed:", error);
          setDownloadError("PDF failed to generate. Please try again.");
      } finally {
          setPreviewScale(originalScale);
          setIsDownloading(false);
      }
    }, 600);
  };

  const handleConfigChange = (slotId, key, value) => {
      if (slotId === 'cover') {
          setMediaConfig(prev => ({ ...prev, cover: { ...prev.cover, [key]: value } }));
      } else {
          setMediaConfig(prev => {
              const newSlots = [...prev.slots];
              newSlots[slotId] = { ...newSlots[slotId], [key]: value };
              return { ...prev, slots: newSlots };
          });
      }
  };

  const currentEditorConfig = activeSlot === 'cover' ? mediaConfig?.cover : mediaConfig?.slots[activeSlot];
  const getMaxPan = (z) => (z > 1 ? ((z - 1) / z) * 50 : 0);
  const currentMaxPan = currentEditorConfig ? getMaxPan(currentEditorConfig.zoom) : 0;

  const enterPreviewMode = () => {
      const randomLayout = Math.floor(Math.random() * 20);
      setSearchParams({ preview: "true", layout: randomLayout.toString() }, { replace: true });
  };
  const exitPreviewMode = () => setSearchParams({}, { replace: true });
  const nextLayout = () => {
      setActiveSlot(null);
      setSearchParams({ preview: "true", layout: ((layoutIndex + 1) % 20).toString() }, { replace: true });
  };
  const prevLayout = () => {
      setActiveSlot(null);
      setSearchParams({ preview: "true", layout: ((layoutIndex - 1 + 20) % 20).toString() }, { replace: true });
  };

  // Lightbox Navigation Handlers (Protected against out-of-bounds indices)
  const openGallery = (index) => { 
    if (!memory?.media || !memory.media[index]) return;
    setSelectedIndex(index); 
    setIsOpen(true); 
    const paramKey = getParamKey(index);
    setSearchParams({ [paramKey]: index.toString() }, { replace: false }); 
  };
  
  const goToImage = (index) => { 
    if (!memory?.media || !memory.media[index]) return;
    setSelectedIndex(index); 
    const paramKey = getParamKey(index);
    setSearchParams({ [paramKey]: index.toString() }, { replace: false }); 
  };
  
  const nextImage = () => { 
    setSelectedIndex((prev) => { 
      const next = Math.min(prev + 1, (memory?.media?.length || 1) - 1);
      const paramKey = getParamKey(next);
      setSearchParams({ [paramKey]: next.toString() }, { replace: false }); 
      return next; 
    }); 
  };
  
  const previousImage = () => { 
    setSelectedIndex((prev) => { 
      const previous = Math.max(prev - 1, 0);
      const paramKey = getParamKey(previous);
      setSearchParams({ [paramKey]: previous.toString() }, { replace: false }); 
      return previous; 
    }); 
  };

  const handleCloseLightbox = () => {
    setIsOpen(false);
    searchParams.delete("image");
    searchParams.delete("video");
    setSearchParams(searchParams, { replace: false });
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try { const user = await getMyProfile(); setCurrentUser(user); } catch { setCurrentUser(null); }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!username || !slug) return;
    const fetchMemory = async () => {
      try {
        const response = await api.get(`/api/public/${username}/${slug}`);
        setMemory(response.data);
      } catch (error) {
        if (error.response?.status === 403) navigate("/403", { replace: true });
        if (error.response?.status === 404) navigate("/404", { replace: true });
      } finally { setLoading(false); }
    };
    fetchMemory();
  }, [username, slug, navigate]);

  const isOwner = Boolean(currentUser?._id && typeof memory?.user === "object" ? memory.user._id : memory?.user === currentUser?._id);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <PageTitle title="Loading Memory" />
        <p className="text-lg font-medium text-slate-500">Loading memory...</p>
      </div>
    );
  }
  if (!memory) return null;

  // ==========================================
  // RENDER: PRINT PREVIEW MODE (EDITOR)
  // ==========================================
  if (isPreviewMode) {
    return (
        <div className="min-h-[100dvh] h-screen bg-slate-900 flex flex-col overflow-hidden fixed inset-0 z-[100]">
            <div className="flex-none flex items-center justify-between bg-slate-950/90 backdrop-blur-md px-4 sm:px-8 py-4 border-b border-slate-800 shadow-xl z-50">
                <button onClick={exitPreviewMode} disabled={isDownloading} className="flex items-center gap-1 sm:gap-2 text-white/80 hover:text-white font-medium cursor-pointer disabled:opacity-50">
                    <X size={20} /> <span className="hidden sm:inline">Back</span>
                </button>
                
                <div className="flex items-center gap-3">
                    {downloadError ? (
                        <span className="text-red-400 text-xs sm:text-sm flex items-center gap-1"><AlertCircle size={14}/> {downloadError}</span>
                    ) : (
                        <div className="flex items-center gap-2 sm:gap-4">
                            <span className="text-white/60 text-[10px] sm:text-xs font-semibold tracking-wider uppercase flex items-center gap-2">
                                <MousePointerClick size={14}/> Drag & Pinch Photo
                            </span>
                            <div className="hidden sm:block w-px h-4 bg-slate-800 mx-1"></div>
                            <span className="text-white/60 text-[10px] sm:text-xs font-semibold tracking-wider uppercase hidden md:block">Template {layoutIndex + 1}/20</span>
                            <div className="flex items-center bg-white/10 rounded-full border border-white/10 overflow-hidden">
                                <button onClick={prevLayout} disabled={isDownloading} className="p-2 hover:bg-white/20 text-white transition disabled:opacity-50" title="Previous Template"><ChevronLeft size={16} /></button>
                                <div className="w-px h-4 bg-white/20"></div>
                                <button onClick={nextLayout} disabled={isDownloading} className="p-2 hover:bg-white/20 text-white transition disabled:opacity-50" title="Next Template"><ChevronRight size={16} /></button>
                            </div>
                        </div>
                    )}
                </div>
                
                <button onClick={executeDownload} disabled={isDownloading} className="flex items-center gap-2 bg-[#3559D4] text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-lg hover:bg-blue-500 transition cursor-pointer disabled:opacity-50">
                    {isDownloading ? <><Loader2 size={16} className="animate-spin"/> Capturing...</> : <><Download size={16} /> <span className="hidden sm:inline">Save PDF</span></>}
                </button>
            </div>
            
            <div className="flex-1 w-full flex flex-col md:flex-row overflow-hidden relative" onClick={() => setActiveSlot(null)}>
                <div ref={previewContainerRef} className="flex-1 overflow-hidden flex justify-center items-center bg-slate-900 relative p-4" style={{ opacity: isDownloading ? 0.4 : 1, transition: 'opacity 0.2s' }}>
                    <div 
                      style={{ transform: `scale(${previewScale})`, transformOrigin: 'center center', width: '800px', height: '1131px', transition: 'transform 0s' }}
                      className="shadow-[0_20px_25px_rgba(0,0,0,0.5)] ring-1 ring-white/10 rounded-sm bg-[#ffffff] flex-shrink-0"
                    >
                        <div id="actual-print-container" style={{ width: '800px', height: '1131px', backgroundColor: '#ffffff', overflow: 'hidden', position: 'relative' }}>
                            <PrintableView 
                                memory={memory} 
                                layoutIndex={layoutIndex} 
                                mediaConfig={mediaConfig} 
                                isEditing={!isDownloading} 
                                activeSlot={activeSlot} 
                                onSlotClick={(id) => setActiveSlot(id)} 
                                onUpdateConfig={handleConfigChange}
                            />
                        </div>
                    </div>
                </div>

                {activeSlot !== null && currentEditorConfig && (
                    <div 
                        className="w-full md:w-[350px] bg-slate-950 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col z-50 flex-shrink-0 h-[45vh] md:h-auto shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:shadow-none animate-in slide-in-from-bottom md:slide-in-from-right duration-200"
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                            <h3 className="text-white font-bold text-sm tracking-wide flex items-center gap-2">
                                <Settings2 size={16} className="text-[#3559D4]"/>
                                {activeSlot === 'cover' ? 'Editing Cover Photo' : `Editing Image Slot ${activeSlot + 1}`}
                            </h3>
                            <button onClick={() => setActiveSlot(null)} className="text-slate-400 hover:text-white bg-white/5 p-1.5 rounded-full transition"><X size={16}/></button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">1. Select Photo</label>
                                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-3 gap-2">
                                    {allImages.map((img, i) => (
                                        <div 
                                          key={i} 
                                          onClick={() => {
                                              handleConfigChange(activeSlot, 'url', img.url);
                                              handleConfigChange(activeSlot, 'zoom', 1);
                                              handleConfigChange(activeSlot, 'x', 0);
                                              handleConfigChange(activeSlot, 'y', 0);
                                          }}
                                          className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${currentEditorConfig.url === img.url ? 'border-[#3559D4] scale-95 opacity-100 shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'border-transparent hover:border-slate-600 opacity-50 hover:opacity-100'}`}
                                        >
                                            <img src={img.url} crossOrigin="anonymous" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6 bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex justify-between items-center">
                                        <span className="flex items-center gap-1.5"><ZoomIn size={12}/> Zoom Level</span>
                                        <span className="text-[#3559D4] bg-[#3559D4]/10 px-2 py-0.5 rounded font-mono">{currentEditorConfig.zoom.toFixed(1)}x</span>
                                    </label>
                                    <input 
                                      type="range" min="1" max="5" step="0.1" 
                                      value={currentEditorConfig.zoom} 
                                      onChange={(e) => {
                                          const newZoom = parseFloat(e.target.value);
                                          const newMaxPan = getMaxPan(newZoom);
                                          handleConfigChange(activeSlot, 'zoom', newZoom);
                                          handleConfigChange(activeSlot, 'x', Math.max(-newMaxPan, Math.min(newMaxPan, currentEditorConfig.x)));
                                          handleConfigChange(activeSlot, 'y', Math.max(-newMaxPan, Math.min(newMaxPan, currentEditorConfig.y)));
                                      }} 
                                      className="w-full accent-[#3559D4]" 
                                    />
                                </div>

                                <div className="pt-2 border-t border-slate-800">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex justify-between items-center">
                                        <span className="flex items-center gap-1.5"><MoveHorizontal size={12}/> Horizontal Pan</span>
                                        <span className="text-[#3559D4] bg-[#3559D4]/10 px-2 py-0.5 rounded font-mono">{currentEditorConfig.x.toFixed(0)}%</span>
                                    </label>
                                    <input type="range" min={-currentMaxPan} max={currentMaxPan} step="1" value={currentEditorConfig.x} onChange={(e) => handleConfigChange(activeSlot, 'x', parseFloat(e.target.value))} className="w-full accent-[#3559D4]" disabled={currentEditorConfig.zoom <= 1} />
                                </div>

                                <div className="pt-2 border-t border-slate-800">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex justify-between items-center">
                                        <span className="flex items-center gap-1.5"><MoveVertical size={12}/> Vertical Pan</span>
                                        <span className="text-[#3559D4] bg-[#3559D4]/10 px-2 py-0.5 rounded font-mono">{currentEditorConfig.y.toFixed(0)}%</span>
                                    </label>
                                    <input type="range" min={-currentMaxPan} max={currentMaxPan} step="1" value={currentEditorConfig.y} onChange={(e) => handleConfigChange(activeSlot, 'y', parseFloat(e.target.value))} className="w-full accent-[#3559D4]" disabled={currentEditorConfig.zoom <= 1} />
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => { handleConfigChange(activeSlot, 'zoom', 1); handleConfigChange(activeSlot, 'x', 0); handleConfigChange(activeSlot, 'y', 0); }} 
                                className="w-full flex items-center justify-center gap-2 text-xs font-bold bg-slate-800/50 hover:bg-slate-800 border border-slate-700 py-3 rounded-xl text-slate-300 hover:text-white transition"
                            >
                                <RefreshCcw size={14} /> Reset Position
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
  }

  // ==========================================
  // RENDER: STANDARD WEB VIEW
  // ==========================================
  return (
    <main className="min-h-screen bg-slate-50 pb-16 relative">
      <PageTitle title={memory.title} />
      {isOwner ? <Navbar /> : <AppHeader isOwner={false} isLoggedIn={!!currentUser} />}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-x-0 top-0 h-[380px] bg-gradient-to-b from-sky-100/60 via-blue-50/30 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-10 xl:px-14 pt-8 lg:pt-12 pb-12">
          <MemoryHero memory={memory} username={username} openGallery={openGallery} isOwner={isOwner} isLoggedIn={!!currentUser} locationState={location.state} onDownloadClick={enterPreviewMode} />
        </div>
      </section>
      <section className="relative z-10 mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-10 xl:px-14 pb-24">
        <div className="relative overflow-hidden rounded-[36px] border border-slate-200/80 bg-white shadow-xl shadow-sky-950/[0.03] p-6 sm:p-14">
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-[#1E3A8A] text-white shadow-lg shadow-blue-500/20 overflow-hidden group">
                <Compass size={24} className="transition-transform duration-700 animate-[spin_12s_linear_infinite]" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#3559D4]">Travel Journal</p>
                <h2 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Journey Story</h2>
              </div>
            </div>
            <div className="my-8 h-px bg-slate-100" />
            <div className="w-full text-base sm:text-[17px] leading-8 sm:leading-9 text-slate-600 whitespace-pre-line font-medium">
              {memory.description}
            </div>
            <div className="mt-14">
              <h3 className="text-xl font-black text-slate-900 mb-6">Location Map</h3>
              <div className="w-full aspect-[16/9] sm:h-[400px] rounded-3xl overflow-hidden shadow-md border border-slate-200 z-0 relative">
                <MapContainer key={mapCoords.join(',')} center={mapCoords} zoom={11} className="h-full w-full" scrollWheelZoom={false}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={mapCoords} />
                </MapContainer>
              </div>
            </div>
        </div>
      </section>
      {isOpen && (
        <Lightbox media={memory.media} selectedIndex={selectedIndex} nextImage={nextImage} previousImage={previousImage} goToImage={goToImage} canDownload={isOwner} memoryTitle={memory.title} onClose={handleCloseLightbox} />
      )}
    </main>
  );
};

export default PublicMemory;