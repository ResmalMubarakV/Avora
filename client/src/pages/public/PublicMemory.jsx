import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams, useSearchParams, useLocation } from "react-router-dom";
import api from "../../api/axios";
import { getMyProfile } from "../../api/userApi";

import Navbar from "../../components/dashboard/Navbar";
import AppHeader from "../../components/navigation/AppHeader";
import MemoryHero from "../../components/memory/MemoryHero";
import Lightbox from "../../components/memory/Lightbox";
import PageTitle from "../../components/common/PageTitle";
import PrintableView from "../../components/memory/PrintableView";

import { Compass, Download, X, ChevronLeft, ChevronRight, ZoomIn, RefreshCcw, MousePointerClick, Settings2, MoveHorizontal, MoveVertical } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// ==========================================
// FIX LEAFLET MARKER BUG IN PRODUCTION
// ==========================================
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});
// ==========================================

const MapInvalidator = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => { map.invalidateSize(); }, 250);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

// ==========================================
// MOBILE DETECTION — layered, not just UA sniffing.
// UA sniffing alone breaks under "Request Desktop Site" mode, in-app
// WebViews, and unusual UA strings. Combining UA + touch capability +
// viewport width ensures a false negative (treating a phone as
// "desktop") can't happen — a false negative is what sends a device
// down the fragile window.print() path instead of the canvas-PDF path.
// ==========================================
const isMobileOrTabletDevice = () => {
  if (typeof navigator === "undefined" || typeof window === "undefined") return false;

  const ua = navigator.userAgent || navigator.vendor || window.opera || "";

  const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  // iPadOS 13+ reports its UA as "Macintosh" but exposes multi-touch —
  // this catches iPads that would otherwise be misdetected as desktop Mac.
  const isIPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  const isAndroid = /Android/i.test(ua);
  const isUAMobile = isIOS || isIPadOS || isAndroid;

  // Capability-based fallback: primary input is touch/coarse pointer AND
  // no hover capability AND a phone/tablet-sized viewport. Catches
  // devices where UA sniffing lies but the hardware is still a touch
  // device.
  const isCoarsePointer =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches &&
    window.matchMedia("(hover: none)").matches;

  const isSmallViewport = window.innerWidth <= 1024;

  return isUAMobile || (isCoarsePointer && isSmallViewport);
};

const PublicMemory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // Scroll to top automatically when component mounts or path/redirect changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.pathname]);

  const [currentUser, setCurrentUser] = useState(null);
  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);

  const isPreviewMode = searchParams.get("preview") === "true";
  const layoutIndex = searchParams.has("layout") ? Number(searchParams.get("layout")) : 0;

  const [mapCoords, setMapCoords] = useState([20.5937, 78.9629]);

  const [previewScale, setPreviewScale] = useState(1);
  const previewContainerRef = useRef(null);
  const printComponentRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

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
  // DESKTOP PATH — native print. Unchanged, working behavior.
  // ==========================================
  const handleNativePrint = useCallback(async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setActiveSlot(null); // Clear editing handles

    const prevTitle = document.title;
    document.title = `${memory?.slug || 'memory'}-diary`;

    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      setTimeout(() => {
        window.print();

        setTimeout(() => {
          document.title = prevTitle;
          setIsDownloading(false);
        }, 500);
      }, 250);
    } catch (error) {
      console.error("Print generation failed:", error);
      document.title = prevTitle;
      setIsDownloading(false);
    }
  }, [isDownloading, memory]);

  // ==========================================
  // MOBILE PATH — canvas-captured PDF, delivered via the native Share
  // sheet where possible instead of a silent anchor-download. The
  // jsPDF .save() anchor-click trick is what caused the "flop" (silent,
  // no-feedback) behavior on mobile. navigator.share() with a File
  // object hands off to the OS's real share/save UI. If unavailable,
  // fall back to opening the PDF in a new tab so the user gets a real
  // visible preview with the browser's own save controls.
  // ==========================================
  const handleMobilePdfDownload = useCallback(async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setActiveSlot(null); // Clear editing overlay before capture

    try {
      // Wait for React to actually remove the overlay from the DOM.
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      );

      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      const node = printComponentRef.current;
      if (!node) throw new Error("Print target not found — try again after the template finishes loading.");

      const canvas = await html2canvas(node, {
        width: 800,
        height: 1131,
        windowWidth: 800,
        windowHeight: 1131,
        scale: 3,               // high-res output (~2400x3393px raster)
        useCORS: true,          // required for cross-origin memory images
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);

      const pdf = new jsPDF({
        unit: "px",
        format: [800, 1131],
        orientation: "portrait",
        compress: true,
      });

      pdf.addImage(imgData, "JPEG", 0, 0, 800, 1131, undefined, "FAST");

      const fileName = `${memory?.slug || "memory"}-diary.pdf`;
      const pdfBlob = pdf.output("blob");

      // --- Path 1: Web Share API with a real File object. Opens the
      // native OS share sheet (Save to Files, Drive, AirDrop, etc).
      // Requires HTTPS (secure context) and file-sharing support, not
      // just navigator.share existing.
      const file = new File([pdfBlob], fileName, { type: "application/pdf" });
      const canUseShareSheet =
        typeof navigator !== "undefined" &&
        navigator.canShare &&
        navigator.canShare({ files: [file] });

      if (canUseShareSheet) {
        await navigator.share({
          files: [file],
          title: fileName,
        });
        return; // user picked Save/Share/Cancel in the native sheet — done.
      }

      // --- Path 2: Fallback — open the PDF in a new tab so the
      // browser's own PDF viewer renders it with a visible preview and
      // its own save/share controls, instead of an invisible download.
      const blobUrl = URL.createObjectURL(pdfBlob);
      const opened = window.open(blobUrl, "_blank");

      if (!opened) {
        // Popup blocked — last resort: classic anchor-download trick.
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Give the new tab / download time to pick up the blob before revoking.
      setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
    } catch (error) {
      // AbortError fires when the user just cancels the native share
      // sheet — that's expected, not a real failure.
      if (error?.name === "AbortError") {
        console.log("User cancelled the share sheet.");
      } else {
        console.error("Mobile PDF generation failed:", error);
        window.alert(
          "Couldn't generate the PDF. Please check your connection and try again — avoid using your browser's own Print or Share button, as it will not produce a correct result."
        );
      }
    } finally {
      setIsDownloading(false);
    }
  }, [isDownloading, memory]);

  // ==========================================
  // SINGLE ENTRY POINT — routes to the right path per device.
  // ==========================================
  const handleDownloadClick = useCallback(() => {
    if (isMobileOrTabletDevice()) {
      handleMobilePdfDownload();
    } else {
      handleNativePrint();
    }
  }, [handleMobilePdfDownload, handleNativePrint]);

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
    if (isPreviewMode) {
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
        // If the profile is locked (403), redirect directly back to the locked profile page instead of an error view
        if (error.response?.status === 403) {
          navigate(`/u/${username}`, { replace: true });
          return;
        }
        if (error.response?.status === 404) {
          navigate("/404", { replace: true });
        }
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
        <div className="min-h-[100dvh] h-screen bg-slate-900 flex flex-col overflow-hidden fixed inset-0 z-[100]">
            <div className="flex-none flex items-center justify-between bg-slate-950/90 backdrop-blur-md px-4 sm:px-8 py-4 border-b border-slate-800 shadow-xl z-50">
                <button onClick={exitPreviewMode} className="flex items-center gap-1 sm:gap-2 text-white/80 hover:text-white font-medium cursor-pointer">
                    <X size={20} /> <span className="hidden sm:inline">Back</span>
                </button>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <span className="text-white/60 text-[10px] sm:text-xs font-semibold tracking-wider uppercase flex items-center gap-2">
                            <MousePointerClick size={14}/> Drag & Pinch Photo
                        </span>
                        <div className="hidden sm:block w-px h-4 bg-slate-800 mx-1"></div>
                        <span className="text-white/60 text-[10px] sm:text-xs font-semibold tracking-wider uppercase hidden md:block">Template {layoutIndex + 1}/20</span>
                        <div className="flex items-center bg-white/10 rounded-full border border-white/10 overflow-hidden">
                            <button onClick={prevLayout} className="p-2 hover:bg-white/20 text-white transition" title="Previous Template"><ChevronLeft size={16} /></button>
                            <div className="w-px h-4 bg-white/20"></div>
                            <button onClick={nextLayout} className="p-2 hover:bg-white/20 text-white transition" title="Next Template"><ChevronRight size={16} /></button>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleDownloadClick}
                    disabled={isDownloading}
                    className="flex items-center gap-2 bg-[#3559D4] text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-lg hover:bg-blue-500 transition cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                >
                    <Download size={16} /> <span className="hidden sm:inline">{isDownloading ? "Preparing..." : "Save PDF / Print"}</span>
                </button>
            </div>

            <div className="flex-1 w-full flex flex-col md:flex-row overflow-hidden relative" onClick={() => setActiveSlot(null)}>
                <div ref={previewContainerRef} className="flex-1 overflow-hidden flex justify-center items-center bg-slate-900 relative p-4">
                    <div
                      style={{ transform: `scale(${previewScale})`, transformOrigin: 'center center', width: '800px', height: '1131px', transition: 'transform 0s' }}
                      className="shadow-[0_20px_25px_rgba(0,0,0,0.5)] ring-1 ring-white/10 rounded-sm bg-[#ffffff] flex-shrink-0"
                    >
                        {/* INJECTED FONT STYLE TAG TO GUARANTEE PRINT & PREVIEW FONT MATCH */}
                        <div ref={printComponentRef} id="actual-print-container" style={{ width: '800px', height: '1131px', backgroundColor: '#ffffff', overflow: 'hidden', position: 'relative', boxSizing: 'border-box', fontFamily: '"Outfit", sans-serif' }}>
                            <style type="text/css" dangerouslySetInnerHTML={{ __html: `
                              @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
                              #actual-print-container, #actual-print-container * {
                                font-family: 'Outfit', sans-serif !important;
                              }
                            `}} />
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

  return (
    <main className="min-h-screen bg-slate-50 pb-16 relative">
      <PageTitle title={memory.title} />
      {isOwner ? <Navbar /> : <AppHeader isOwner={false} isLoggedIn={!!currentUser} />}
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
              <div className="w-full aspect-[16/9] sm:h-[400px] rounded-3xl overflow-hidden shadow-md border border-slate-200 z-0 relative group bg-slate-100">
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
      </section>
      {isOpen && (
        <Lightbox media={memory.media} selectedIndex={selectedIndex} nextImage={nextImage} previousImage={previousImage} goToImage={goToImage} canDownload={isOwner} memoryTitle={memory.title} onClose={() => { setIsOpen(false); setSearchParams({}, { replace: false }); }} />
      )}
    </main>
  );
};

export default PublicMemory;