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

import { Compass, Download, X, ChevronLeft, ChevronRight, ZoomIn, RefreshCcw, MousePointerClick, Settings2, MoveHorizontal, MoveVertical, Shield, ArrowLeft } from "lucide-react";

const PublicMemory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  const [currentUser, setCurrentUser] = useState(null);
  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAdminViewer = currentUser?.role === "admin";

  const isPreviewMode = searchParams.get("preview") === "true";
  const layoutIndex = searchParams.has("layout") ? Number(searchParams.get("layout")) : 0;

  const [mapCoords, setMapCoords] = useState([20.5937, 78.9629]);
  const [previewScale, setPreviewScale] = useState(1);
  const previewContainerRef = useRef(null);

  const imageParam = searchParams.get("image");
  const [isOpen, setIsOpen] = useState(imageParam !== null);
  const [selectedIndex, setSelectedIndex] = useState(imageParam ? Number(imageParam) : 0);

  const [mediaConfig, setMediaConfig] = useState(null);
  const [activeSlot, setActiveSlot] = useState(null);

  const allImages = Array.from(new Set([
      memory?.coverImage,
      ...(memory?.media?.filter(m => m.type === 'image').map(m => m.url) || [])
  ].filter(Boolean))).map(url => ({ url }));

  // ==========================================
  // INJECT PRINT STYLES DIRECTLY TO <HEAD>
  // ==========================================
  useEffect(() => {
    if (!isPreviewMode) return;
    
    const styleId = "avora-print-styles";
    if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.innerHTML = `
          @media print {
            @page { 
              size: 800px 1131px !important; 
              margin: 0 !important; 
            }
            html, body { 
              margin: 0 !important; 
              padding: 0 !important; 
              width: 800px !important;
              height: 1131px !important;
              background-color: white !important; 
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            *, *::before, *::after {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        `;
        document.head.appendChild(style);
    }

    return () => {
        const style = document.getElementById(styleId);
        if (style) document.head.removeChild(style);
    };
  }, [isPreviewMode]);

  const handleNativePrint = () => {
    setActiveSlot(null); 
    const prevTitle = document.title;
    document.title = `${memory?.slug || 'memory'}-diary`;

    setTimeout(() => {
      window.print();
      document.title = prevTitle;
    }, 200);
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
    if (!isPreviewMode) return;
    
    const container = previewContainerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        const availableWidth = width - 32; 
        const availableHeight = height - 90;

        if (availableWidth > 0 && availableHeight > 0) {
          const scaleX = availableWidth / 800;
          const scaleY = availableHeight / 1131;
          setPreviewScale(Math.min(scaleX, scaleY, 1));
        }
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [isPreviewMode, layoutIndex, activeSlot]);

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

  useEffect(() => {
    if (!isPreviewMode) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") prevLayout();
      else if (e.key === "ArrowRight") nextLayout();
      else if (e.key === "Escape") exitPreviewMode();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPreviewMode, layoutIndex]);

  const openGallery = (index) => { setSelectedIndex(index); setIsOpen(true); setSearchParams({ image: index.toString() }, { replace: false }); };
  const goToImage = (index) => { setSelectedIndex(index); setSearchParams({ image: index.toString() }, { replace: false }); };
  const nextImage = () => { setSelectedIndex((prev) => { const next = prev + 1; setSearchParams({ image: next.toString() }, { replace: false }); return next; }); };
  const previousImage = () => { setSelectedIndex((prev) => { const previous = prev - 1; setSearchParams({ image: previous.toString() }, { replace: false }); return previous; }); };

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
        if (error.response?.status === 403) navigate(`/${username}`, { replace: true });
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

  if (isPreviewMode) {
    return (
      <>
        <div 
          className="fixed top-[-20000px] left-[-20000px] print:top-0 print:left-0 z-[999999] m-0 p-0 overflow-hidden bg-white" 
          style={{ width: "800px", height: "1131px" }}
        >
            <PrintableView
                memory={memory}
                layoutIndex={layoutIndex}
                mediaConfig={mediaConfig}
                isEditing={false} 
                activeSlot={null}
                onSlotClick={() => {}}
                onUpdateConfig={() => {}}
            />
        </div>

        <div className="print:hidden min-h-[100dvh] h-screen bg-slate-900 flex flex-col overflow-hidden fixed inset-0 z-[100]">
            <div className="flex-none flex items-center justify-between bg-slate-950/90 backdrop-blur-md px-4 sm:px-8 py-3.5 border-b border-slate-800 shadow-xl z-50">
                <button onClick={exitPreviewMode} className="flex items-center gap-1 sm:gap-2 text-white/80 hover:text-white font-medium cursor-pointer">
                    <X size={20} /> <span className="hidden sm:inline">Back</span>
                </button>

                <div className="flex items-center justify-center text-center">
                    <span className="text-white/70 text-[9px] sm:text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5">
                        <MousePointerClick size={14} className="text-[#3559D4] shrink-0"/> 
                        <span>Drag & Pinch Photo</span>
                    </span>
                </div>

                <button
                    onClick={handleNativePrint}
                    className="flex items-center gap-2 bg-[#3559D4] text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-lg hover:bg-blue-500 transition cursor-pointer"
                >
                    <Download size={16} /> <span className="hidden sm:inline">Save PDF / Print</span>
                </button>
            </div>

            <div className="flex-1 w-full flex flex-col md:flex-row overflow-hidden relative pb-16" onClick={() => setActiveSlot(null)}>
                <div ref={previewContainerRef} className="flex-1 overflow-hidden flex flex-col justify-center items-center bg-slate-900 relative p-2">
                    <div
                      style={{ 
                        transform: `scale(${previewScale})`, 
                        transformOrigin: 'center center', 
                        width: '800px', 
                        height: '1131px', 
                        transition: 'transform 0.1s ease-out' 
                      }}
                      className="shadow-[0_20px_25px_rgba(0,0,0,0.5)] ring-1 ring-white/10 flex-shrink-0 bg-white"
                    >
                        <PrintableView
                            memory={memory}
                            layoutIndex={layoutIndex}
                            mediaConfig={mediaConfig}
                            isEditing={true}
                            activeSlot={activeSlot}
                            onSlotClick={(id) => setActiveSlot(id)}
                            onUpdateConfig={handleConfigChange}
                        />
                    </div>
                </div>

                <div className="fixed bottom-3 inset-x-0 flex items-center justify-center gap-3 z-40 pointer-events-auto px-4">
                    <button onClick={prevLayout} className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white shadow-xl border border-slate-700 transition cursor-pointer active:scale-95">
                        <ChevronLeft size={18} />
                    </button>
                    <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800 text-white px-4 py-2 rounded-full text-xs font-bold shadow-2xl tracking-wider uppercase">
                        Template {layoutIndex + 1} / 20
                    </div>
                    <button onClick={nextLayout} className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white shadow-xl border border-slate-700 transition cursor-pointer active:scale-95">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
      </>
    );
  }

  // STANDARD PUBLIC MEMORY VIEW
  return (
    <main className="print:hidden min-h-screen bg-slate-50 pb-16 relative z-10">
      <PageTitle title={memory.title} />
      
      {/* Professional Header Management */}
      {isAdminViewer ? (
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-6 py-3.5 backdrop-blur-md shadow-xs">
          <button
            type="button"
            onClick={() => navigate("/admin", { replace: true })}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 cursor-pointer active:scale-95"
          >
            <ArrowLeft size={15} />
            <span>Back to Admin Panel</span>
          </button>

          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 shadow-xs">
            <Shield size={13} />
            <span>Admin Inspection Mode</span>
          </div>
        </header>
      ) : isOwner ? (
        <Navbar />
      ) : (
        <AppHeader isOwner={false} isLoggedIn={!!currentUser} />
      )}

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-x-0 top-0 h-[380px] bg-gradient-to-b from-sky-100/60 via-blue-50/30 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-10 xl:px-14 pt-8 lg:pt-12 pb-12">
          <MemoryHero memory={memory} username={username} openGallery={openGallery} isOwner={isOwner} locationState={location.state} onDownloadClick={enterPreviewMode} />
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
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-900">Location Map</h3>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(memory.location || `${mapCoords[0]},${mapCoords[1]}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#3559D4] hover:underline flex items-center gap-1"
                >
                  Open in Google Maps ↗
                </a>
              </div>
              <div className="flex items-center justify-center w-full">
                <div className="w-full max-w-4xl aspect-[16/9] sm:h-[400px] rounded-3xl overflow-hidden shadow-md border border-slate-200 z-0 relative group bg-slate-100 mx-auto">
                  <iframe
                    title="Google Map Location"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(memory.location || `${mapCoords[0]},${mapCoords[1]}`)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  />
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(memory.location || `${mapCoords[0]},${mapCoords[1]}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-transparent cursor-pointer"
                    title="Click to open full Google Maps"
                  />
                  <div className="absolute bottom-4 right-4 pointer-events-none">
                    <span className="bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-3.5 py-2 rounded-full shadow-lg border border-slate-200 flex items-center gap-1.5">
                      View on Google Maps 🧭
                    </span>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </section>

      {isOpen && (
        <Lightbox media={memory.media} selectedIndex={selectedIndex} nextImage={nextImage} previousImage={previousImage} goToImage={goToImage} canDownload={isOwner} memoryTitle={memory.title} onClose={() => { setIsOpen(false); setSearchParams({}, { replace: false }); }} />
      )}
    </main>
  );
};

export default PublicMemory;