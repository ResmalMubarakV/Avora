import React, { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useParams, useSearchParams, useLocation } from "react-router-dom";
import api from "../../api/axios";
import { getMyProfile } from "../../api/userApi";

import Navbar from "../../components/dashboard/Navbar";
import AppHeader from "../../components/navigation/AppHeader";
import MemoryHero from "../../components/memory/MemoryHero";
import Lightbox from "../../components/memory/Lightbox";
import PageTitle from "../../components/common/PageTitle";

import { 
  MapPin, CalendarDays, Navigation, Plane, Car, Train, Ship, 
  Image as ImageIcon, ZoomOut, ZoomIn, MoveHorizontal, MoveVertical, 
  RefreshCcw, Check, X, Download, MousePointerClick, ChevronLeft, 
  ChevronRight, Shield, ArrowLeft, Sliders, Target, Compass 
} from "lucide-react";

// ==========================================
// 1. EXTRACTED WRAPPER (PREVENTS LAG)
// ==========================================
const Wrapper = ({ children, style, className = "" }) => (
  <div className={className} style={{ width: '800px', height: '1131px', minHeight: '1131px', minWidth: '800px', overflow: 'hidden', position: 'relative', boxSizing: 'border-box', backgroundColor: '#ffffff', ...style }}>
    {children}
  </div>
);

// ==========================================
// 2. AUTOFIT TEXT ENGINE
// Shrinks text gracefully to prevent overflow in print templates
// ==========================================
const AutoFitText = React.memo(({ children, style, className = "" }) => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const initialSize = parseFloat(style.fontSize) || 14;
    const minSize = 10.5; // Minimum readable font size for A4 printing
    
    el.style.fontSize = `${initialSize}px`;
    el.style.display = 'block';
    el.style.webkitLineClamp = 'unset';

    let currentSize = initialSize;

    // Shrink font size gradually until it fits
    while (el.scrollHeight > el.clientHeight && currentSize > minSize) {
      currentSize -= 0.5;
      el.style.fontSize = `${currentSize}px`;
    }

    // If it still overflows at minimum size, clamp it elegantly
    if (el.scrollHeight > el.clientHeight) {
      el.style.display = '-webkit-box';
      el.style.webkitBoxOrient = 'vertical';
      const lineHeight = parseFloat(window.getComputedStyle(el).lineHeight) || (currentSize * 1.5);
      const maxLines = Math.floor(el.clientHeight / lineHeight);
      el.style.webkitLineClamp = Math.max(1, maxLines).toString();
      el.style.overflow = 'hidden';
    }
  }, [children, style]);

  return (
    <div ref={containerRef} className={className} style={{ ...style, overflow: 'hidden' }}>
      {children}
    </div>
  );
});
AutoFitText.displayName = 'AutoFitText';

// ==========================================
// 3. SAFEIMAGE: TRUE NATIVE CROP & 60FPS PAN ENGINE
// Uses synchronous rendering to PREVENT 1-frame stretching bugs
// ==========================================
const SafeImage = React.memo((props) => {
  const { config, className = "", slotId, isEditing, activeSlot, onSlotClick, onUpdateConfig, onBoundsChange, onOpenPicker, style = {}, imgStyle = {} } = props;
  
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  
  const url = config?.url || null;
  const zoom = Math.max(1, config?.zoom || 1);
  const x = config?.x || 0; 
  const y = config?.y || 0; 

  // 1. Synchronously measure container size before paint to stop stretching
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    
    // Immediate read on mount
    setContainerSize({ w: el.offsetWidth, h: el.offsetHeight });
    
    // Observer for subsequent changes
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setContainerSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 2. Clear Natural Size on URL Change
  useEffect(() => {
    const timer = setTimeout(() => {
      setNaturalSize({ w: 0, h: 0 });
    }, 0);
    return () => clearTimeout(timer);
  }, [url]);

  const handleImgLoad = useCallback((e) => {
    setNaturalSize({ w: e.target.naturalWidth, h: e.target.naturalHeight });
  }, []);

  const ready = !!(url && naturalSize.w > 0 && containerSize.w > 0);

  // 3. Mathematical Bounding Box (No Stretching)
  let maxPxX = 0, maxPxY = 0;
  let currentW = '100%', currentH = '100%', currentTransform = 'translate(-50%, -50%)';
  
  const isDraggingRef = useRef(false);
  const panState = useRef({ x: 0, y: 0 });
  const [isActivelyDragging, setIsActivelyDragging] = useState(false);

  if (ready) {
    const baseScale = Math.max(containerSize.w / naturalSize.w, containerSize.h / naturalSize.h);
    const cW = naturalSize.w * baseScale * zoom;
    const cH = naturalSize.h * baseScale * zoom;
    maxPxX = Math.max(0, (cW - containerSize.w) / 2);
    maxPxY = Math.max(0, (cH - containerSize.h) / 2);

    const renderX = x;
    const renderY = y;

    const cX = Math.max(-100, Math.min(100, renderX));
    const cY = Math.max(-100, Math.min(100, renderY));

    const px = (cX / 100) * maxPxX;
    const py = (cY / 100) * maxPxY;

    currentW = `${cW}px`;
    currentH = `${cH}px`;
    currentTransform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px))`;
  }

  // 4. Report Limits to Parent Sliders safely
  useEffect(() => {
    if (!ready) return;
    if (typeof onBoundsChange === 'function') {
      onBoundsChange(slotId, { 
        maxX: maxPxX > 0.5 ? 100 : 0, 
        maxY: maxPxY > 0.5 ? 100 : 0 
      });
    }
  }, [maxPxX, maxPxY, ready, slotId, onBoundsChange]);

  // 5. Direct DOM Engine to bypass React Render Lag (60FPS)
  const applyTransform = useCallback((pctX, pctY, z) => {
    if (!imgRef.current || !ready) return;
    
    const baseScale = Math.max(containerSize.w / naturalSize.w, containerSize.h / naturalSize.h);
    const cW = naturalSize.w * baseScale * z;
    const cH = naturalSize.h * baseScale * z;
    const cMaxPxX = Math.max(0, (cW - containerSize.w) / 2);
    const cMaxPxY = Math.max(0, (cH - containerSize.h) / 2);
    
    const cX = Math.max(-100, Math.min(100, pctX));
    const cY = Math.max(-100, Math.min(100, pctY));
    
    const px = (cX / 100) * cMaxPxX;
    const py = (cY / 100) * cMaxPxY;
    
    imgRef.current.style.width = `${cW}px`;
    imgRef.current.style.height = `${cH}px`;
    imgRef.current.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px))`;
  }, [ready, containerSize, naturalSize]);

  // Sync incoming React state to local ref
  useEffect(() => {
    if (!isDraggingRef.current) {
      panState.current = { x, y };
    }
  }, [x, y]);

  const cW = containerSize.w;
  const cH = containerSize.h;
  const nW = naturalSize.w;
  const nH = naturalSize.h;

  // 6. Touch/Drag Interaction System
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isEditing || !ready) return;

    let startX = 0, startY = 0;
    let initialPinchDist = null;
    let initialZoom = 1;

    const triggerSelect = () => { if (typeof onSlotClick === 'function') onSlotClick(slotId); };

    const onPointerStart = (clientX, clientY) => {
      triggerSelect();
      isDraggingRef.current = true;
      setIsActivelyDragging(true);
      startX = clientX;
      startY = clientY;
    };

    const onPointerMove = (clientX, clientY, performPreventDefault) => {
      if (!isDraggingRef.current) return;
      const dx = clientX - startX;
      const dy = clientY - startY;

      if (maxPxY === 0 && Math.abs(dy) > Math.abs(dx) && maxPxX === 0) {
        isDraggingRef.current = false;
        setIsActivelyDragging(false);
        return;
      }
      
      if (performPreventDefault) performPreventDefault();

      const dPctX = maxPxX > 0 ? (dx / maxPxX) * 100 : 0;
      const dPctY = maxPxY > 0 ? (dy / maxPxY) * 100 : 0;

      panState.current.x = Math.max(-100, Math.min(100, panState.current.x + dPctX));
      panState.current.y = Math.max(-100, Math.min(100, panState.current.y + dPctY));
      
      startX = clientX;
      startY = clientY;
      applyTransform(panState.current.x, panState.current.y, zoom);
    };

    const onPointerUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsActivelyDragging(false);
        if (typeof onUpdateConfig === 'function') {
          onUpdateConfig(slotId, 'x', panState.current.x);
          onUpdateConfig(slotId, 'y', panState.current.y);
        }
      }
    };

    const handleWheel = (e) => {
      if (e.target.closest('button')) return;
      e.preventDefault();
      triggerSelect();
      if (typeof onUpdateConfig === 'function') {
        onUpdateConfig(slotId, 'zoom', Math.max(1, Math.min(6, zoom + (e.deltaY < 0 ? 0.15 : -0.15))));
      }
    };

    const handleMouseDown = (e) => {
      if (e.target.closest('button')) return;
      e.preventDefault();
      onPointerStart(e.clientX, e.clientY);
    };

    const handleGlobalMouseMove = (e) => onPointerMove(e.clientX, e.clientY, null);
    const handleGlobalMouseUp = () => onPointerUp();

    const handleTouchStart = (e) => {
      if (e.target.closest('button')) return;
      if (e.touches.length === 1) {
        onPointerStart(e.touches[0].clientX, e.touches[0].clientY);
      } else if (e.touches.length === 2) {
        isDraggingRef.current = false;
        setIsActivelyDragging(false);
        initialPinchDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        initialZoom = zoom;
      }
    };

    const handleTouchMove = (e) => {
      if (isDraggingRef.current && e.touches.length === 1) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY, () => e.preventDefault());
      } else if (initialPinchDist && e.touches.length === 2 && typeof onUpdateConfig === 'function') {
        if (e.cancelable) e.preventDefault();
        const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        const scale = dist / initialPinchDist;
        const newZ = Math.max(1, Math.min(6, initialZoom * scale));
        applyTransform(panState.current.x, panState.current.y, newZ);
      }
    };

    const handleTouchEnd = () => {
      if (initialPinchDist && typeof onUpdateConfig === 'function') {
        const distStr = imgRef.current.style.width; 
        const curScale = parseFloat(distStr) / (nW * Math.max(cW / nW, cH / nH));
        onUpdateConfig(slotId, 'zoom', Math.max(1, Math.min(6, curScale || zoom)));
      }
      onPointerUp();
      initialPinchDist = null;
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: false });
    el.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
      el.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isEditing, ready, zoom, maxPxX, maxPxY, slotId, onUpdateConfig, onSlotClick, applyTransform, cW, cH, nW, nH]);

  if (!url) return <div className={className} style={{ width: '100%', height: '100%', backgroundColor: '#e2e8f0', ...style }} />;

  const isActive = isEditing && activeSlot === slotId;

  return (
    <div
      ref={containerRef}
      className={`group relative overflow-hidden block isolation-auto ${className}`}
      style={{
        width: '100%', height: '100%',
        cursor: isEditing ? (isActivelyDragging ? 'grabbing' : 'grab') : 'default',
        touchAction: isEditing ? 'none' : 'auto', 
        backgroundColor: url ? 'transparent' : '#e2e8f0', 
        ...style
      }}
    >
      <img
        ref={imgRef}
        src={url}
        crossOrigin="anonymous"
        onLoad={handleImgLoad}
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          width: currentW, height: currentH,
          objectFit: 'cover', // CRITICAL: Fallback protection against stretching
          maxWidth: 'none', maxHeight: 'none', minWidth: 0, minHeight: 0,
          display: 'block',
          pointerEvents: 'none', 
          transform: currentTransform,
          transformOrigin: 'center center',
          transition: isActivelyDragging ? 'none' : 'transform 0.1s ease-out, width 0.1s ease-out, height 0.1s ease-out',
          filter: imgStyle.filter,
          WebkitFilter: imgStyle.filter,
          ...imgStyle
        }}
        alt="memory"
        draggable={false}
      />

      {isEditing && (
        <div className={`print:hidden absolute inset-0 pointer-events-none transition-all ${isActive ? 'border-4 border-[#3559D4]' : 'border border-transparent group-hover:border-[#3559D4]/60'}`}>
            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                if (typeof onSlotClick === 'function') onSlotClick(slotId);
                if (typeof onOpenPicker === 'function') onOpenPicker(slotId); 
              }}
              className="absolute top-2 right-2 pointer-events-auto bg-slate-950/90 hover:bg-blue-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-lg backdrop-blur-md uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer z-50 active:scale-95"
            >
              <ImageIcon size={13} /> Change Photo
            </button>
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  if (prevProps.slotId !== nextProps.slotId) return false;
  if (prevProps.isEditing !== nextProps.isEditing) return false;
  
  const prevActive = prevProps.isEditing && prevProps.activeSlot === prevProps.slotId;
  const nextActive = nextProps.isEditing && nextProps.activeSlot === nextProps.slotId;
  if (prevActive !== nextActive) return false;

  const p = prevProps.config || {};
  const n = nextProps.config || {};
  if (p.url !== n.url || p.zoom !== n.zoom || p.x !== n.x || p.y !== n.y) return false;
  
  return true;
});
SafeImage.displayName = 'SafeImage';

// ==========================================
// 4. PRINTABLE TEMPLATE ENGINE
// ==========================================
const PrintableView = React.memo(({ memory, layoutIndex = 0, mediaConfig = null, isEditing = false, activeSlot = null, onSlotClick = null, onUpdateConfig = null, onBoundsChange = null, onOpenPicker = null }) => {
  const defaultImages = useMemo(() => memory?.media?.filter(m => m.type === 'image') || [], [memory?.media]);
  const baseCover = memory?.coverImage || (defaultImages.length > 0 ? defaultImages[0].url : "");
  
  const coverConfig = mediaConfig?.cover?.url ? mediaConfig.cover : { url: baseCover, zoom: 1, x: 0, y: 0 };
  
  const slotConfigs = useMemo(() => {
    return Array.from({ length: 9 }).map((_, i) => mediaConfig?.slots?.[i]?.url ? mediaConfig.slots[i] : { url: defaultImages[i % defaultImages.length]?.url || "", zoom: 1, x: 0, y: 0 });
  }, [mediaConfig, defaultImages]);
  
  const title = memory?.title || "Untitled Journey";
  const location = memory?.location || "Unknown Location";
  const story = memory?.description || "A beautiful memory preserved in time.";
  const dateObj = memory?.startDate ? new Date(memory.startDate) : null;
  const dateStr = dateObj ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Date Unknown";
  const mode = memory?.travelMode?.toLowerCase() || "exploration";

  const renderIcon = (size = 24, color = "currentColor") => {
    if (mode.includes('plane') || mode.includes('flight')) return <Plane size={size} color={color} />;
    if (mode.includes('car') || mode.includes('drive')) return <Car size={size} color={color} />;
    if (mode.includes('train')) return <Train size={size} color={color} />;
    if (mode.includes('ship') || mode.includes('boat')) return <Ship size={size} color={color} />;
    return <Navigation size={size} color={color} />;
  };

  const sharedImgProps = { isEditing, activeSlot, onSlotClick, onUpdateConfig, onBoundsChange, onOpenPicker };

  if (layoutIndex === 0) {
    return (
      <Wrapper style={{ backgroundColor: '#F4F1EB', padding: '48px', color: '#1e293b', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
        <h1 style={{ fontSize: '56px', fontFamily: 'serif', fontStyle: 'italic', textAlign: 'center', marginTop: '16px', marginBottom: '8px', lineHeight: '1.2', wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{title}</h1>
        <p style={{ textAlign: 'center', fontSize: '11px', fontWeight: 'bold', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '28px', color: '#64748b' }}>{location} • {dateStr}</p>
        <AutoFitText style={{ maxWidth: '580px', margin: '0 auto', textAlign: 'justify', fontSize: '15px', lineHeight: '1.65', fontWeight: '500', marginBottom: '28px', maxHeight: '210px' }}>{story}</AutoFitText>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', padding: '0 32px', marginTop: 'auto', marginBottom: '24px' }}>
             {slotConfigs.slice(0, 4).map((cfg, i) => (
                 <div key={i} style={{ backgroundColor: '#ffffff', padding: '10px', paddingBottom: '36px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', position: 'relative', height: '180px', boxSizing: 'border-box' }}>
                      <div style={{ width: '100%', height: '120px', backgroundColor: '#f8fafc', overflow: 'hidden', position: 'relative' }}><SafeImage config={cfg} slotId={i} imgStyle={{ filter: 'grayscale(15%)' }} {...sharedImgProps} /></div>
                      <div style={{ position: 'absolute', bottom: '8px', left: 0, width: '100%', textAlign: 'center', fontFamily: 'serif', fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>Memory {i+1}</div>
                 </div>
             ))}
        </div>
      </Wrapper>
    );
  }

  if (layoutIndex === 1) {
    return (
      <Wrapper style={{ padding: '64px', color: '#0f172a', border: '24px solid #f8fafc', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', borderBottom: '4px solid #0f172a', paddingBottom: '24px', flexShrink: 0 }}>
             <div style={{ maxWidth: '65%' }}>
                 <h1 style={{ fontSize: '48px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.05em', lineHeight: '1.2', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{title}</h1>
                 <p style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '16px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', margin: '16px 0 0 0' }}><MapPin size={16}/> {location}</p>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                 <p style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase', backgroundColor: '#0f172a', color: '#ffffff', padding: '6px 12px', margin: 0 }}>{dateStr}</p>
                 <p style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>{renderIcon(14)} {mode}</p>
             </div>
         </div>
         <div style={{ display: 'flex', gap: '32px', flex: 1, overflow: 'hidden' }}>
             <AutoFitText style={{ width: '41.6%', fontSize: '14px', lineHeight: '1.65', fontWeight: '500', textAlign: 'justify', color: '#334155', maxHeight: '720px' }}>{story}</AutoFitText>
             <div style={{ width: '58.3%', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
                 {slotConfigs.slice(0,2).map((cfg, i) => (
                     <div key={i} style={{ flex: 1, width: '100%', backgroundColor: '#f1f5f9', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', overflow: 'hidden', position: 'relative' }}><SafeImage config={cfg} slotId={i} {...sharedImgProps} /></div>
                 ))}
             </div>
         </div>
      </Wrapper>
    );
  }
  
  if (layoutIndex === 2) {
    return (
      <Wrapper style={{ backgroundColor: '#E8E6E1', color: '#3A3A3A', padding: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: '450px', width: '100%', position: 'relative', backgroundColor: '#000000', display: 'block', flexShrink: 0, overflow: 'hidden' }}>
            <SafeImage config={coverConfig} slotId="cover" {...sharedImgProps} />
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3), rgba(0,0,0,0))' }} />
            <div style={{ position: 'absolute', bottom: '32px', left: '48px', right: '48px', pointerEvents: 'none' }}>
                <h1 style={{ fontSize: '48px', fontFamily: 'serif', fontStyle: 'italic', color: '#ffffff', letterSpacing: '0.05em', marginBottom: '12px', lineHeight: '1.2', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', margin: '0 0 12px 0' }}>{title}</h1>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', color: 'rgba(255,255,255,0.8)', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 'bold' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14}/> {location}</span><span>|</span><span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CalendarDays size={14}/> {dateStr}</span>
                </div>
            </div>
        </div>
        <div style={{ padding: '48px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box', overflow: 'hidden' }}>
            <AutoFitText style={{ columnCount: 2, columnGap: '32px', fontSize: '14px', lineHeight: '1.65', fontFamily: 'serif', textAlign: 'justify', color: '#334155', maxHeight: '250px' }}>{story}</AutoFitText>
            <div style={{ display: 'flex', gap: '12px', height: '160px', backgroundColor: '#000000', padding: '12px', boxSizing: 'border-box', flexShrink: 0, overflow: 'hidden' }}>
                 {slotConfigs.slice(0, 4).map((cfg, i) => (
                     <div key={i} style={{ flex: 1, height: '100%', backgroundColor: '#1a1a1a', overflow: 'hidden', position: 'relative' }}><SafeImage config={cfg} slotId={i} imgStyle={{ filter: 'sepia(20%)' }} {...sharedImgProps} /></div>
                 ))}
            </div>
        </div>
      </Wrapper>
    );
  }

  if (layoutIndex === 3) {
    return (
      <Wrapper style={{ backgroundColor: '#1a1f24', padding: '48px', color: '#f1f5f9', display: 'flex', flexDirection: 'column' }}>
         <div style={{ border: '1px solid #334155', padding: '36px', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden' }}>
             <p style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.4em', color: '#94a3b8', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px 0' }}>{renderIcon(12)} {mode} Log • {dateStr}</p>
             <h1 style={{ fontSize: '48px', fontWeight: '300', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '32px', color: '#ffffff', lineHeight: '1.2', margin: '0 0 32px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flexShrink: 0 }}>{title}</h1>
             <div style={{ display: 'flex', gap: '36px', flex: 1, overflow: 'hidden' }}>
                  <div style={{ width: '50%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                       <p style={{ marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '16px', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', margin: '0 0 20px 0' }}><MapPin size={16} /> {location}</p>
                       <AutoFitText style={{ fontSize: '14px', lineHeight: '1.65', color: '#cbd5e1', fontWeight: '300', textAlign: 'justify', maxHeight: '550px' }}>{story}</AutoFitText>
                  </div>
                  <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center', overflow: 'hidden' }}>
                       {slotConfigs.slice(0,3).map((cfg, i) => (
                           <div key={i} style={{ flex: 1, width: '100%', maxHeight: '160px', backgroundColor: '#0f172a', border: '4px solid #1e293b', boxShadow: '0 15px 30px rgba(0,0,0,0.25)', overflow: 'hidden', position: 'relative' }}><SafeImage config={cfg} slotId={i} {...sharedImgProps} /></div>
                       ))}
                  </div>
             </div>
         </div>
      </Wrapper>
    );
  }

  if (layoutIndex === 4) {
    return (
      <Wrapper style={{ backgroundColor: '#000000', padding: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: '1131px', width: '100%', position: 'relative', backgroundColor: '#111111', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px', boxSizing: 'border-box', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
                  <SafeImage config={coverConfig} slotId="cover" imgStyle={{ opacity: 0.5 }} {...sharedImgProps} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.4), rgba(0,0,0,0.95))', pointerEvents: 'none' }} />
              </div>
              <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
                  <p style={{ color: 'rgba(255,255,255,0.8)', letterSpacing: '0.4em', textTransform: 'uppercase', fontSize: '11px', fontWeight: 'bold', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.2)', display: 'inline-block', paddingBottom: '6px', margin: '0 0 12px 0' }}>{location}</p>
                  <h1 style={{ fontSize: '56px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '-0.05em', lineHeight: '1.2', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{title}</h1>
              </div>
              <div style={{ position: 'relative', zIndex: 10, display: 'flex', gap: '32px', alignItems: 'flex-end', marginTop: 'auto' }}>
                  <div style={{ width: '66.666%' }}>
                      <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', padding: '20px', borderRadius: '12px', color: '#ffffff', maxHeight: '190px', overflow: 'hidden' }}>
                          <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '6px', margin: '0 0 8px 0' }}>The Story</h3>
                          <AutoFitText style={{ fontSize: '13px', fontWeight: '500', lineHeight: '1.6', color: 'rgba(255,255,255,0.9)', margin: 0, maxHeight: '115px' }}>{story}</AutoFitText>
                      </div>
                  </div>
                  <div style={{ width: '33.333%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {slotConfigs.slice(0, 2).map((cfg, i) => (
                          <div key={i} style={{ width: '100%', height: '110px', backgroundColor: '#222222', border: '3px solid #ffffff', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}><SafeImage config={cfg} slotId={i} {...sharedImgProps} /></div>
                      ))}
                      <div style={{ backgroundColor: '#ffffff', color: '#000000', padding: '10px', textAlign: 'center', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '6px', fontSize: '11px' }}>{dateStr}</div>
                  </div>
              </div>
          </div>
      </Wrapper>
    );
  }

  if (layoutIndex === 5) {
    return (
      <Wrapper style={{ backgroundColor: '#ffffff', padding: '64px', color: '#000000', display: 'flex', flexDirection: 'column' }}>
          <div style={{ border: '1px solid #000000', height: '100%', padding: '36px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #000000', paddingBottom: '20px', marginBottom: '32px', flexShrink: 0 }}>
                  <div style={{ maxWidth: '70%' }}>
                      <h4 style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.4em', color: '#6b7280', margin: '0 0 6px 0' }}>Exhibit A.</h4>
                      <h1 style={{ fontSize: '32px', fontFamily: 'serif', color: '#000000', lineHeight: '1.2', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{title}</h1>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'monospace', margin: 0 }}>{location}</p>
                      <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'monospace', color: '#6b7280', marginTop: '4px', margin: 0 }}>{dateStr}</p>
                  </div>
              </div>
              <div style={{ flex: 1, display: 'flex', gap: '36px', overflow: 'hidden' }}>
                  <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflow: 'hidden' }}>
                      <div style={{ width: '100%', height: '220px', flexShrink: 0, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', overflow: 'hidden', position: 'relative' }}><SafeImage config={coverConfig} slotId="cover" imgStyle={{ filter: 'grayscale(100%)' }} {...sharedImgProps} /></div>
                      <AutoFitText style={{ fontSize: '13px', lineHeight: '1.65', fontFamily: 'serif', color: '#1f2937', textAlign: 'justify', maxHeight: '350px' }}>{story}</AutoFitText>
                  </div>
                  <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflow: 'hidden' }}>
                      {slotConfigs.slice(0, 2).map((cfg, i) => (
                          <div key={i} style={{ display: 'flex', flexDirection: 'column', width: '100%', flex: 1, overflow: 'hidden' }}>
                              <div style={{ flex: 1, minHeight: 0, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', overflow: 'hidden', position: 'relative' }}><SafeImage config={cfg} slotId={i} imgStyle={{ filter: 'grayscale(100%)' }} {...sharedImgProps} /></div>
                              <p style={{ fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '6px', textAlign: 'right', color: '#9ca3af', fontFamily: 'monospace', margin: 0 }}>Fig. {i+1}</p>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </Wrapper>
    );
  }

  if (layoutIndex === 6) {
    return (
      <Wrapper style={{ backgroundColor: '#f4e3c5', padding: '48px', color: '#5c3a21', display: 'flex', flexDirection: 'column' }}>
          <div style={{ border: '8px solid #d87c4a', borderRadius: '32px', height: '100%', padding: '36px', backgroundColor: '#fbf5eb', position: 'relative', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: '64px', backgroundColor: '#d87c4a', color: '#fbf5eb', padding: '10px 20px', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px', fontWeight: '900', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '12px' }}>{dateStr}</div>
              <h1 style={{ fontSize: '48px', fontWeight: '900', color: '#d87c4a', textTransform: 'uppercase', letterSpacing: '-0.05em', marginTop: '24px', marginBottom: '8px', lineHeight: '1.2', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{title}</h1>
              <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#5c3a21', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', margin: '0 0 24px 0' }}><MapPin size={16}/> {location}</p>
              <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', height: '180px', flexShrink: 0 }}>
                  {slotConfigs.slice(0, 2).map((cfg, i) => (
                      <div key={i} style={{ flex: 1, height: '100%', backgroundColor: '#ffffff', borderRadius: '20px', border: '3px solid #d87c4a', overflow: 'hidden', position: 'relative' }}><SafeImage config={cfg} slotId={i} {...sharedImgProps} /></div>
                  ))}
              </div>
              <div style={{ backgroundColor: '#e9c496', padding: '24px', borderRadius: '20px', border: '3px solid #d87c4a', maxHeight: '240px', overflow: 'hidden' }}>
                  <AutoFitText style={{ fontSize: '14px', fontWeight: 'bold', lineHeight: '1.6', color: '#5c3a21', maxHeight: '190px', margin: 0 }}>{story}</AutoFitText>
              </div>
          </div>
      </Wrapper>
    );
  }

  if (layoutIndex === 7) {
    return (
      <Wrapper style={{ backgroundColor: '#f0f4f8', color: '#1e3a8a', padding: '48px', fontFamily: 'monospace', backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '2px solid #1e3a8a', padding: '36px', height: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden' }}>
              <header style={{ borderBottom: '2px solid #1e3a8a', paddingBottom: '20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
                  <div style={{ maxWidth: '80%' }}>
                      <h1 style={{ fontSize: '32px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.025em', lineHeight: '1.2', marginBottom: '12px', margin: '0 0 12px 0', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{title}</h1>
                      <div style={{ display: 'flex', gap: '32px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                          <p style={{ margin: 0 }}>LOC: {location}</p><p style={{ margin: 0 }}>DAT: {dateStr}</p><p style={{ margin: 0 }}>MOD: {mode}</p>
                      </div>
                  </div>
                  <div style={{ backgroundColor: '#1e3a8a', color: '#ffffff', padding: '12px' }}><Navigation size={32} /></div>
              </header>
              <div style={{ display: 'flex', gap: '28px', flex: 1, overflow: 'hidden' }}>
                  <div style={{ width: '41.6%', borderRight: '2px solid #1e3a8a', paddingRight: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '900', borderBottom: '2px solid #1e3a8a', display: 'inline-block', marginBottom: '12px', margin: '0 0 12px 0', paddingBottom: '4px' }}>OBSERVATIONS</h3>
                      <AutoFitText style={{ fontSize: '14px', lineHeight: '1.65', color: '#334155', textAlign: 'justify', maxHeight: '600px' }}>{story}</AutoFitText>
                  </div>
                  <div style={{ width: '58.3%', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflow: 'hidden' }}>
                      {slotConfigs.slice(0, 3).map((cfg, i) => (
                          <div key={i} style={{ flex: 1, minHeight: 0, border: '2px solid #1e3a8a', padding: '6px', backgroundColor: '#ffffff', overflow: 'hidden', position: 'relative' }}><SafeImage config={cfg} slotId={i} {...sharedImgProps} /></div>
                      ))}
                  </div>
              </div>
          </div>
      </Wrapper>
    );
  }

  if (layoutIndex === 8) {
    return (
      <Wrapper style={{ backgroundColor: '#faf7f2', padding: '64px', color: '#4a4a4a', position: 'relative', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              <div style={{ textAlign: 'center', marginBottom: '32px', flexShrink: 0 }}>
                  <p style={{ fontSize: '12px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(131,24,67,0.5)', marginBottom: '12px', margin: '0 0 12px 0' }}>{dateStr}</p>
                  <h1 style={{ fontSize: '48px', fontFamily: 'serif', fontStyle: 'italic', color: 'rgba(80,7,36,0.8)', marginBottom: '16px', lineHeight: '1.2', margin: '0 0 16px 0', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{title}</h1>
                  <p style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', margin: 0 }}>{location}</p>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '320px', padding: '12px', backgroundColor: '#ffffff', boxShadow: '0 15px 30px rgba(0,0,0,0.1)', borderRadius: '4px', marginBottom: '32px', transform: 'rotate(1deg)', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                      <SafeImage config={coverConfig} slotId="cover" {...sharedImgProps} />
                  </div>
                  <AutoFitText style={{ fontSize: '15px', lineHeight: '1.65', fontFamily: 'serif', color: '#475569', textAlign: 'center', padding: '0 24px', maxHeight: '180px' }}>{story}</AutoFitText>
              </div>
          </div>
      </Wrapper>
    );
  }

  if (layoutIndex === 9) {
    return (
      <Wrapper style={{ backgroundColor: '#f8fafc', padding: '40px', color: '#0f172a', display: 'flex', flexDirection: 'column' }}>
          <header style={{ position: 'absolute', top: '40px', left: '40px', width: '720px', height: '100px', display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '20px', boxSizing: 'border-box', border: '1px solid #f1f5f9' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', flexShrink: 0, overflow: 'hidden', backgroundColor: '#f8fafc', position: 'relative' }}><SafeImage config={coverConfig} slotId="cover" {...sharedImgProps} /></div>
              <div style={{ overflow: 'hidden', flex: 1 }}>
                  <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</h1>
                  <p style={{ color: '#64748b', fontWeight: '500', margin: '0 0 4px 0', fontSize: '12px' }}>{location}</p>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '10px', fontWeight: '600', color: '#334155' }}>
                      <span style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '9999px' }}>{mode}</span>
                      <span style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '9999px' }}>{dateStr}</span>
                  </div>
              </div>
          </header>
          <div style={{ position: 'absolute', top: '156px', left: '40px', width: '720px', height: '80px', backgroundColor: '#ffffff', padding: '12px 16px', borderRadius: '16px', boxSizing: 'border-box', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
              <AutoFitText style={{ fontSize: '13px', lineHeight: '1.5', color: '#475569', fontWeight: '500', margin: 0, maxHeight: '56px' }}>{story}</AutoFitText>
          </div>
          {slotConfigs.slice(0, 9).map((cfg, i) => {
              const cols = 3, cellWidth = 224, cellHeight = 224, gap = 24, startX = 40, startY = 260;
              const left = startX + (i % cols) * (cellWidth + gap), top = startY + Math.floor(i / cols) * (cellHeight + gap);
              return <div key={i} style={{ position: 'absolute', left: `${left}px`, top: `${top}px`, width: `${cellWidth}px`, height: `${cellHeight}px`, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', boxSizing: 'border-box' }}><SafeImage config={cfg} slotId={i} {...sharedImgProps} /></div>;
          })}
      </Wrapper>
    );
  }

  if (layoutIndex === 10) {
    return (
      <Wrapper style={{ backgroundColor: '#f4f4f0', padding: '48px', color: '#111111', display: 'flex', flexDirection: 'column' }}>
          <div style={{ borderBottom: '4px double #111111', paddingBottom: '20px', marginBottom: '24px', textAlign: 'center', flexShrink: 0 }}>
              <h1 style={{ fontSize: '48px', fontFamily: 'serif', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.025em', lineHeight: '1.2', marginBottom: '12px', margin: '0 0 12px 0', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{title}</h1>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'serif', borderTop: '1px solid #111111', borderBottom: '1px solid #111111', padding: '6px 36px' }}>
                  <span>Vol. 1</span><span>{location}</span><span>{dateStr}</span><span>{mode}</span>
              </div>
          </div>
          <AutoFitText style={{ columnCount: 3, columnGap: '24px', fontSize: '13px', lineHeight: '1.6', fontFamily: 'serif', textAlign: 'justify', color: '#333333', marginBottom: '24px', maxHeight: '420px' }}>{story}</AutoFitText>
          <div style={{ display: 'flex', gap: '16px', height: '220px', flexShrink: 0, marginTop: 'auto' }}>
             {slotConfigs.slice(0,2).map((cfg, i) => (
                 <div key={i} style={{ flex: 1, height: '100%', border: '2px solid #111111', padding: '6px', backgroundColor: '#ffffff', overflow: 'hidden', position: 'relative' }}><SafeImage config={cfg} slotId={i} imgStyle={{ filter: 'grayscale(100%)' }} {...sharedImgProps} /></div>
             ))}
          </div>
      </Wrapper>
    );
  }

  if (layoutIndex === 11) {
    return (
      <Wrapper style={{ backgroundColor: '#050505', padding: '64px', color: '#00ff9d', fontFamily: 'monospace', border: '16px solid #1a1a1a', display: 'flex', flexDirection: 'column' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #00ff9d', paddingBottom: '16px', marginBottom: '32px', flexShrink: 0 }}>
              <div style={{ maxWidth: '70%' }}>
                  <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ff00ff', margin: '0 0 6px 0' }}>SYS.LOG // {dateStr}</p>
                  <h1 style={{ fontSize: '40px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '-0.05em', lineHeight: '1.2', margin: 0, textShadow: '0 0 8px rgba(0,255,157,0.5)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{title}</h1>
              </div>
              <div style={{ textAlign: 'right', color: '#00e5ff', fontSize: '11px' }}>
                  <p style={{ margin: 0 }}>COORD: {location}</p><p style={{ margin: 0 }}>VECTOR: {mode}</p>
              </div>
          </header>
          <div style={{ display: 'flex', gap: '36px', flex: 1, overflow: 'hidden' }}>
              <AutoFitText style={{ width: '50%', fontSize: '13px', lineHeight: '1.65', color: '#b3b3b3', textAlign: 'justify', maxHeight: '650px' }}><span style={{ color: '#00ff9d' }}>&gt;_ </span>{story}</AutoFitText>
              <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflow: 'hidden' }}>
                 {slotConfigs.slice(0, 2).map((cfg, i) => (
                     <div key={i} style={{ flex: 1, minHeight: 0, position: 'relative', width: '100%', border: '1px solid #00e5ff', backgroundColor: '#0a0a0a', boxShadow: '0 0 15px rgba(0,229,255,0.2)', padding: '6px', overflow: 'hidden' }}><SafeImage config={cfg} slotId={i} imgStyle={{ opacity: 0.8, mixBlendMode: 'screen' }} {...sharedImgProps} /></div>
                 ))}
              </div>
          </div>
      </Wrapper>
    );
  }

  if (layoutIndex === 12) {
    return (
      <Wrapper style={{ backgroundColor: '#fffdfa', padding: '64px', color: '#2c2c2c', display: 'flex', flexDirection: 'column' }}>
          <div style={{ border: '1px solid #c19a6b', height: '100%', padding: '36px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', boxSizing: 'border-box', overflow: 'hidden' }}>
              <p style={{ fontSize: '11px', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#c19a6b', marginBottom: '20px', marginTop: '12px', margin: '12px 0 20px 0', flexShrink: 0 }}>{dateStr}</p>
              <h1 style={{ fontSize: '38px', fontFamily: 'serif', fontWeight: '300', letterSpacing: '0.05em', marginBottom: '24px', lineHeight: '1.2', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', margin: '0 0 24px 0', flexShrink: 0 }}>{title}</h1>
              <div style={{ width: '100%', height: '220px', marginBottom: '24px', backgroundColor: '#fdfbf7', padding: '6px', border: '1px solid #eaeaea', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', flexShrink: 0, overflow: 'hidden', position: 'relative' }}><SafeImage config={coverConfig} slotId="cover" {...sharedImgProps} /></div>
              <AutoFitText style={{ fontSize: '14px', lineHeight: '1.65', fontFamily: 'serif', color: '#555555', maxWidth: '450px', maxHeight: '180px', margin: '0 auto' }}>{story}</AutoFitText>
              <p style={{ marginTop: 'auto', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c19a6b', borderTop: '1px solid #c19a6b', paddingTop: '16px', width: '100%', margin: 'auto 0 0 0', flexShrink: 0 }}>Recorded in {location}</p>
          </div>
      </Wrapper>
    );
  }

  if (layoutIndex === 13) {
    return (
      <Wrapper style={{ backgroundColor: '#f0f0f0', padding: 0, color: '#1d3557', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', height: '320px', flexShrink: 0 }}>
              <div style={{ width: '66.666%', backgroundColor: '#e63946', padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: '#ffffff', overflow: 'hidden' }}>
                  <h1 style={{ fontSize: '48px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.05em', lineHeight: '1.2', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{title}</h1>
                  <p style={{ marginTop: '12px', fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '12px 0 0 0' }}>{location}</p>
              </div>
              <div style={{ width: '33.333%', backgroundColor: '#ffb703', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ backgroundColor: '#1d3557', borderRadius: '50%', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>{renderIcon(32)}</div>
              </div>
          </div>
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              <div style={{ width: '50%', padding: '36px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ backgroundColor: '#1d3557', color: '#ffffff', display: 'inline-block', padding: '6px 12px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px', alignSelf: 'flex-start', flexShrink: 0 }}>{dateStr}</div>
                  <AutoFitText style={{ fontSize: '14px', lineHeight: '1.65', fontWeight: '500', textAlign: 'justify', maxHeight: '550px' }}>{story}</AutoFitText>
              </div>
              <div style={{ width: '50%', backgroundColor: '#8ecae6', padding: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
                  <SafeImage config={coverConfig} slotId="cover" imgStyle={{ mixBlendMode: 'multiply' }} {...sharedImgProps} />
              </div>
          </div>
      </Wrapper>
    );
  }

  if (layoutIndex === 14) {
    return (
      <Wrapper style={{ backgroundColor: '#e9efe7', padding: '48px', color: '#2c4c3b', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '340px', border: '6px solid #ffffff', boxShadow: '0 15px 30px rgba(44,76,59,0.1)', marginBottom: '24px', backgroundColor: '#dce5da', borderTopLeftRadius: '160px', borderTopRightRadius: '160px', overflow: 'hidden', padding: '6px', flexShrink: 0, position: 'relative' }}>
                  <SafeImage config={coverConfig} slotId="cover" style={{ borderTopLeftRadius: '154px', borderTopRightRadius: '154px' }} imgStyle={{ borderTopLeftRadius: '154px', borderTopRightRadius: '154px' }} {...sharedImgProps} />
              </div>
              <h1 style={{ fontSize: '38px', fontFamily: 'serif', textAlign: 'center', marginBottom: '16px', lineHeight: '1.2', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', margin: '0 0 16px 0', flexShrink: 0 }}>{title}</h1>
              <div style={{ display: 'flex', gap: '24px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#5a7d6a', marginBottom: '24px', borderTop: '1px solid #5a7d6a', borderBottom: '1px solid #5a7d6a', padding: '12px 0', justifyContent: 'center', width: '100%', flexShrink: 0 }}>
                  <span>{location}</span><span>{dateStr}</span>
              </div>
              <AutoFitText style={{ textAlign: 'center', fontSize: '14px', lineHeight: '1.65', fontFamily: 'serif', color: '#3e5f4d', padding: '0 32px', maxHeight: '280px' }}>{story}</AutoFitText>
          </div>
      </Wrapper>
    );
  }

  if (layoutIndex === 15) {
    return (
      <Wrapper style={{ backgroundColor: '#fce4ec', padding: '48px', color: '#880e4f', display: 'flex', flexDirection: 'column' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '36px', height: '100%', padding: '36px', boxShadow: '0 10px 25px rgba(136,14,79,0.1)', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexShrink: 0 }}>
                  <h1 style={{ fontSize: '38px', fontWeight: 'bold', color: '#c2185b', lineHeight: '1.2', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', maxWidth: '70%', margin: 0 }}>{title}</h1>
                  <div style={{ backgroundColor: '#f8bbd0', color: '#880e4f', padding: '8px 16px', borderRadius: '9999px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{dateStr}</div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', height: '160px', flexShrink: 0 }}>
                  {slotConfigs.slice(0, 3).map((cfg, i) => (
                      <div key={i} style={{ flex: 1, height: '100%', borderRadius: '16px', backgroundColor: '#fef1f5', padding: '6px', overflow: 'hidden', position: 'relative' }}><SafeImage config={cfg} slotId={i} style={{ borderRadius: '12px' }} imgStyle={{ borderRadius: '12px' }} {...sharedImgProps} /></div>
                  ))}
              </div>
              <div style={{ backgroundColor: '#fce4ec', borderRadius: '20px', padding: '24px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 12px 0', flexShrink: 0 }}><MapPin size={14}/> {location}</p>
                  <AutoFitText style={{ fontSize: '14px', lineHeight: '1.65', color: '#880e4f', flex: 1 }}>{story}</AutoFitText>
              </div>
          </div>
      </Wrapper>
    );
  }

  if (layoutIndex === 16) {
    return (
      <Wrapper style={{ backgroundColor: '#f5f5f5', padding: '48px', color: '#000000', display: 'flex', flexDirection: 'column' }}>
          <div style={{ border: '4px solid #0a2342', height: '100%', padding: '36px', backgroundColor: '#ffffff', position: 'relative', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '24px', right: '24px', width: '100px', height: '100px', borderRadius: '50%', border: '3px solid #c1121f', color: '#c1121f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: 'rotate(12deg)', opacity: 0.8, pointerEvents: 'none' }}>
                  <span style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase' }}>ARRIVED</span>
                  <span style={{ fontSize: '14px', fontWeight: '900' }}>{dateStr.split(',')[0]}</span>
                  <span style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase' }}>{mode}</span>
              </div>
              <h1 style={{ fontSize: '48px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.05em', color: '#0a2342', marginBottom: '32px', lineHeight: '1.2', maxWidth: '65%', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', margin: '0 0 32px 0', flexShrink: 0 }}>{title}</h1>
              
              <div style={{ display: 'flex', gap: '32px', flex: 1, overflow: 'hidden' }}>
                  <div style={{ width: '33.3%', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflow: 'hidden' }}>
                      {slotConfigs.slice(0, 2).map((cfg, i) => (
                          <div key={i} style={{ flex: 1, width: '100%', minHeight: 0, backgroundColor: '#f0f0f0', padding: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', overflow: 'hidden', position: 'relative' }}><SafeImage config={cfg} slotId={i} {...sharedImgProps} /></div>
                      ))}
                  </div>
                  <div style={{ width: '66.6%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', overflow: 'hidden' }}>
                      <div style={{ borderBottom: '2px dashed #0a2342', paddingBottom: '6px', marginBottom: '16px', flexShrink: 0 }}>
                          <p style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666666', margin: 0 }}>Official Entry: <span style={{ color: '#0a2342' }}>{location}</span></p>
                      </div>
                      <AutoFitText style={{ fontSize: '14px', lineHeight: '1.65', fontFamily: 'monospace', color: '#333333', textAlign: 'justify', maxHeight: '600px' }}>{story}</AutoFitText>
                  </div>
              </div>
          </div>
      </Wrapper>
    );
  }

  if (layoutIndex === 17) {
    return (
      <Wrapper style={{ backgroundColor: '#fffbed', padding: '40px', color: '#2b2b2b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', display: 'flex', height: '750px', border: '2px solid #2b2b2b', backgroundColor: '#ffffff', boxShadow: '16px 16px 0px rgba(43,43,43,1)', overflow: 'hidden' }}>
              <div style={{ width: '75%', padding: '36px', borderRight: '2px dashed #2b2b2b', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
                  <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexShrink: 0 }}>
                          <h1 style={{ fontSize: '36px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.05em', lineHeight: '1.2', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', maxWidth: '80%', margin: 0 }}>{title}</h1>
                          {renderIcon(36)}
                      </div>
                      <AutoFitText style={{ fontSize: '14px', lineHeight: '1.65', fontWeight: '500', textAlign: 'justify', maxHeight: '420px' }}>{story}</AutoFitText>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #2b2b2b', paddingTop: '16px', flexShrink: 0, marginTop: '20px' }}>
                      <div><p style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 'bold', color: '#888888', margin: 0 }}>DESTINATION</p><p style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', margin: 0 }}>{location}</p></div>
                      <div><p style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 'bold', color: '#888888', margin: 0 }}>DATE</p><p style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', margin: 0 }}>{dateStr}</p></div>
                      <div><p style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 'bold', color: '#888888', margin: 0 }}>CLASS</p><p style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', margin: 0 }}>{mode}</p></div>
                  </div>
              </div>
              <div style={{ width: '25%', padding: '20px', backgroundColor: '#f4f4f4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden' }}>
                  <p style={{ fontSize: '24px', fontWeight: '900', transform: 'rotate(-90deg)', transformOrigin: 'center', whiteSpace: 'nowrap', color: '#cccccc', margin: '60px 0 0 0' }}>ADMIT ONE</p>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #ffffff', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff', padding: '4px', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                      <SafeImage config={coverConfig} slotId="cover" style={{ borderRadius: '50%' }} imgStyle={{ borderRadius: '50%' }} {...sharedImgProps} />
                  </div>
                  <div style={{ display: 'flex', gap: '4px', height: '36px', flexShrink: 0 }}>
                      <div style={{ width: '4px', backgroundColor: '#2b2b2b', height: '100%' }}></div>
                      <div style={{ width: '8px', backgroundColor: '#2b2b2b', height: '100%' }}></div>
                      <div style={{ width: '4px', backgroundColor: '#2b2b2b', height: '100%' }}></div>
                      <div style={{ width: '10px', backgroundColor: '#2b2b2b', height: '100%' }}></div>
                  </div>
              </div>
          </div>
      </Wrapper>
    );
  }

  if (layoutIndex === 18) {
    return (
      <Wrapper style={{ backgroundColor: '#fefefe', padding: '64px', color: '#000000', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
          <div style={{ width: '100%', maxWidth: '672px', margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box', overflow: 'hidden' }}>
              <div style={{ overflow: 'hidden' }}>
                  <p style={{ fontSize: '12px', marginBottom: '20px', color: '#999999', margin: '0 0 20px 0' }}>~/travels/{location.toLowerCase().replace(/\s+/g, '-')}.txt</p>
                  <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', paddingBottom: '6px', textDecoration: 'underline', textDecorationThickness: '3px', textUnderlineOffset: '6px', lineHeight: '1.2', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', margin: '0 0 24px 0' }}>{title}</h1>
                  <AutoFitText style={{ fontSize: '14px', lineHeight: '1.65', color: '#333333', maxHeight: '300px', textAlign: 'justify' }}>{story}</AutoFitText>
              </div>
              <div style={{ overflow: 'hidden' }}>
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', height: '180px', width: '100%', flexShrink: 0 }}>
                      {slotConfigs.slice(0, 2).map((cfg, i) => (
                          <div key={i} style={{ flex: 1, height: '100%', backgroundColor: '#eeeeee', padding: '6px', border: '1px solid #dddddd', overflow: 'hidden', position: 'relative' }}><SafeImage config={cfg} slotId={i} imgStyle={{ filter: 'grayscale(100%)' }} {...sharedImgProps} /></div>
                      ))}
                  </div>
                  <p style={{ fontSize: '11px', color: '#999999', borderTop: '1px solid #eeeeee', paddingTop: '12px', margin: 0 }}>Logged on: {dateStr} via {mode}</p>
              </div>
          </div>
      </Wrapper>
    );
  }

  if (layoutIndex === 19) {
    return (
      <Wrapper style={{ backgroundColor: '#000000', color: '#ffffff', display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'absolute', inset: 0, width: '100%', height: '1131px', display: 'flex', flexDirection: 'column', backgroundColor: '#111111', overflow: 'hidden' }}>
              <SafeImage config={coverConfig} slotId="cover" imgStyle={{ opacity: 0.5 }} {...sharedImgProps} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #000000, rgba(0,0,0,0.6), rgba(0,0,0,0.2))', pointerEvents: 'none' }} />
          </div>
          
          <div style={{ position: 'absolute', bottom: '48px', left: 0, width: '100%', padding: '0 48px', textAlign: 'center', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <h1 style={{ fontSize: '56px', fontFamily: 'serif', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '20px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.2', textShadow: '0 10px 20px rgba(0,0,0,0.8)', margin: '0 0 20px 0' }}>{title}</h1>
              <p style={{ fontSize: '13px', fontWeight: '300', letterSpacing: '0.4em', color: '#cccccc', marginBottom: '20px', textTransform: 'uppercase', margin: '0 0 20px 0' }}>A Journey to {location}</p>
              
              <AutoFitText style={{ fontSize: '13px', fontFamily: 'monospace', lineHeight: '1.6', margin: '0 auto 24px auto', maxWidth: '600px', maxHeight: '90px', color: 'rgba(255,255,255,0.8)' }}>
                  {story}
              </AutoFitText>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', letterSpacing: '0.1em', color: '#aaaaaa', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '16px', textTransform: 'uppercase' }}>
                  <span style={{ width: '40%', textAlign: 'right', paddingRight: '12px' }}>Date: {dateStr}</span>
                  <span style={{ width: '20%', textAlign: 'center' }}>•</span>
                  <span style={{ width: '40%', textAlign: 'left', paddingLeft: '12px' }}>Transport: {mode}</span>
              </div>
          </div>
      </Wrapper>
    );
  }

  return null;
});

PrintableView.displayName = 'PrintableView';

// ==========================================
// 4. MAIN COMPONENT (App UI)
// ==========================================
export default function PublicMemory() {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); }, [location.pathname]);

  const [currentUser, setCurrentUser] = useState(null);
  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAdminViewer = currentUser?.role === "admin";
  const isPreviewMode = searchParams.get("preview") === "true";
  const layoutIndex = searchParams.has("layout") ? Number(searchParams.get("layout")) : 0;

  const [previewScale, setPreviewScale] = useState(1);
  const previewContainerRef = useRef(null);

  const imageParam = searchParams.get("image");
  const [isOpen, setIsOpen] = useState(imageParam !== null);
  const [selectedIndex, setSelectedIndex] = useState(imageParam ? Number(imageParam) : 0);

  const [mediaConfig, setMediaConfig] = useState(null);
  const [activeSlot, setActiveSlot] = useState('cover'); 
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);

  // Default values passed to child safeimages dynamically update this based on natural proportions
  const [slotBounds, setSlotBounds] = useState({});
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const mapEmbedUrl = useMemo(() => {
    if (!memory?.location) return "";
    return `https://maps.google.com/maps?q=${encodeURIComponent(memory.location)}&t=m&z=13&ie=UTF8&iwloc=&output=embed`;
  }, [memory?.location]);
  const handleBoundsChange = useCallback((slotId, bounds) => {
    setSlotBounds(prev => {
      const key = String(slotId);
      const existing = prev[key];
      if (existing && Math.abs(existing.maxX - bounds.maxX) < 0.1 && Math.abs(existing.maxY - bounds.maxY) < 0.1) return prev;
      return { ...prev, [key]: bounds };
    });
  }, []);

  const allImages = useMemo(() => Array.from(new Set([
      memory?.coverImage,
      ...(memory?.media?.filter(m => m.type === 'image').map(m => m.url) || [])
  ].filter(Boolean))).map(url => ({ url })), [memory]);

  // Handle CSS for High Quality PDF Printing
  useEffect(() => {
    if (!isPreviewMode) return;
    const styleId = "avora-print-styles";
    if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.innerHTML = `
          @media print {
            @page {
              size: portrait;
              margin: 0mm !important;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background-color: white !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body * {
              visibility: hidden !important;
            }
            .print-only-container,
            .print-only-container * {
              visibility: visible !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .print-only-container {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              width: 100% !important;
              height: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              background-color: white !important;
              z-index: 999999 !important;
            }
            .print-only-container > div {
              width: 100% !important;
              height: 100% !important;
              box-shadow: none !important;
            }
          }
          @media screen {
            .print-only-container {
              position: fixed;
              left: -9999px;
              top: -9999px;
              visibility: hidden;
              pointer-events: none;
            }
          }
        `;
        document.head.appendChild(style);
    }
    return () => { const style = document.getElementById(styleId); if (style) document.head.removeChild(style); };
  }, [isPreviewMode]);

  const handleNativePrint = () => {
    setShowImagePickerModal(false);
    const prevTitle = document.title;
    document.title = `${memory?.slug || 'memory'}-diary`;
    window.print();
    document.title = prevTitle;
  };


  // Set initial configs with 50% as the default center point
  useEffect(() => {
    if (memory && !mediaConfig) {
        const baseCover = memory.coverImage || (allImages.length > 0 ? allImages[0].url : "");
        const initialSlots = Array.from({ length: 9 }).map((_, i) => {
            const fallbackImg = allImages[i % allImages.length];
            return { url: fallbackImg?.url || '', zoom: 1, x: 50, y: 50 };
        });
        const timer = setTimeout(() => {
            setMediaConfig({ cover: { url: baseCover, zoom: 1, x: 50, y: 50 }, slots: initialSlots });
        }, 0);
        return () => clearTimeout(timer);
    }
  }, [memory, mediaConfig, allImages]);

  // Scale the preview wrapper dynamically
  useEffect(() => {
    if (!isPreviewMode) return;
    const container = previewContainerRef.current;
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        const availableWidth = width - (window.innerWidth >= 1024 ? 340 : 32); 
        const availableHeight = height - 20;
        if (availableWidth > 0 && availableHeight > 0) {
          setPreviewScale(Math.min(availableWidth / 800, availableHeight / 1131));
        }
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [isPreviewMode, layoutIndex]);

  const handleConfigChange = useCallback((slotId, key, value) => {
      if (slotId === 'cover') {
          setMediaConfig(prev => ({ ...prev, cover: { ...prev.cover, [key]: value } }));
      } else {
          setMediaConfig(prev => {
              const newSlots = [...prev.slots];
              newSlots[slotId] = { ...newSlots[slotId], [key]: value };
              return { ...prev, slots: newSlots };
          });
      }
  }, []);

  const handleSlotClick = useCallback((id) => setActiveSlot(id), []);
  const handleOpenPicker = useCallback((id) => { setActiveSlot(id); setShowImagePickerModal(true); }, []);

  const currentEditorConfig = activeSlot === 'cover' ? mediaConfig?.cover : (activeSlot !== null && activeSlot !== undefined ? mediaConfig?.slots[activeSlot] : null);
  const currentBounds = slotBounds[String(activeSlot)] || { maxX: 0, maxY: 0 };

  const enterPreviewMode = useCallback(() => setSearchParams({ preview: "true", layout: Math.floor(Math.random() * 20).toString() }, { replace: true, state: location.state }), [location.state, setSearchParams]);
  const exitPreviewMode = useCallback(() => setSearchParams({}, { replace: true, state: location.state }), [location.state, setSearchParams]);
  const nextLayout = useCallback(() => { setShowImagePickerModal(false); setSearchParams({ preview: "true", layout: ((layoutIndex + 1) % 20).toString() }, { replace: true, state: location.state }); }, [layoutIndex, location.state, setSearchParams]);
  const prevLayout = useCallback(() => { setShowImagePickerModal(false); setSearchParams({ preview: "true", layout: ((layoutIndex - 1 + 20) % 20).toString() }, { replace: true, state: location.state }); }, [layoutIndex, location.state, setSearchParams]);

  useEffect(() => {
    if (!isPreviewMode) return;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" && !showImagePickerModal) prevLayout();
      else if (e.key === "ArrowRight" && !showImagePickerModal) nextLayout();
      else if (e.key === "Escape") { if (showImagePickerModal) setShowImagePickerModal(false); else exitPreviewMode(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPreviewMode, showImagePickerModal, prevLayout, nextLayout, exitPreviewMode]);

  const openGallery = (index) => { setSelectedIndex(index); setIsOpen(true); setSearchParams({ image: index.toString() }, { replace: false, state: location.state }); };
  const goToImage = (index) => { setSelectedIndex(index); setSearchParams({ image: index.toString() }, { replace: false, state: location.state }); };
  const nextImage = () => { setSelectedIndex((prev) => { const next = prev + 1; setSearchParams({ image: next.toString() }, { replace: false, state: location.state }); return next; }); };
  const previousImage = () => { setSelectedIndex((prev) => { const previous = prev - 1; setSearchParams({ image: previous.toString() }, { replace: false, state: location.state }); return previous; }); };

  useEffect(() => {
    const fetchCurrentUser = async () => { try { const user = await getMyProfile(); setCurrentUser(user); } catch { setCurrentUser(null); } };
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

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-slate-50"><PageTitle title="Loading Memory" /><p className="text-lg font-medium text-slate-500">Loading memory...</p></div>;
  if (!memory) return null;

  if (isPreviewMode) {
    const isDesktop = window.innerWidth >= 1024;

    return (
      <>
        {/* Hidden Export Wrapper - ONLY FOR PRINTING */}
        <div className="print-only-container bg-white w-[800px] h-[1131px] print:w-full print:h-full print:max-w-none print:m-0 print:p-0">
            <PrintableView memory={memory} layoutIndex={layoutIndex} mediaConfig={mediaConfig} isEditing={false} />
        </div>

        <div className="print:hidden h-[100dvh] w-screen bg-slate-900 flex flex-col overflow-hidden fixed inset-0 z-[100]">
            <div className="flex-none flex items-center justify-between bg-slate-950/90 backdrop-blur-md px-4 sm:px-8 py-3 border-b border-slate-800 shadow-xl z-50">
                <button onClick={exitPreviewMode} className="flex items-center gap-1 sm:gap-2 text-white/80 hover:text-white font-medium cursor-pointer">
                    <X size={20} /> <span className="hidden sm:inline">Back</span>
                </button>
                <div className="flex items-center justify-center text-center">
                    <span className="text-white/70 text-[10px] sm:text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5">
                        <MousePointerClick size={14} className="text-[#3559D4] shrink-0"/> <span className="hidden sm:inline">Drag photo to pan • Use 'Change Photo' to swap</span>
                    </span>
                </div>
                <button onClick={handleNativePrint} className="flex items-center gap-2 bg-[#3559D4] text-white px-4 py-1.5 sm:px-6 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg hover:bg-blue-500 transition cursor-pointer">
                    <Download size={16} /> <span className="hidden sm:inline">Save PDF</span>
                </button>
            </div>

            <div className="flex-1 w-full flex flex-col lg:flex-row overflow-hidden relative select-none">
                <div ref={previewContainerRef} className="flex-1 overflow-hidden flex flex-col justify-center items-center bg-slate-900 relative p-2">
                    <div style={{ transform: `scale(${previewScale})`, transformOrigin: 'center center', width: '800px', height: '1131px', transition: 'transform 0.1s ease-out' }} className="shadow-[0_20px_25px_rgba(0,0,0,0.5)] ring-1 ring-white/10 flex-shrink-0 bg-white relative">
                        
                        <PrintableView memory={memory} layoutIndex={layoutIndex} mediaConfig={mediaConfig} isEditing={true} activeSlot={activeSlot} onSlotClick={handleSlotClick} onUpdateConfig={handleConfigChange} onBoundsChange={handleBoundsChange} onOpenPicker={handleOpenPicker} />

                        {showImagePickerModal && (
                          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-[1000] flex flex-col p-6 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                              <h3 className="text-white font-bold text-base flex items-center gap-2"><ImageIcon size={18} className="text-blue-400" /> Select Photo for {activeSlot === 'cover' ? 'Cover Photo' : `Slot #${typeof activeSlot === 'number' ? activeSlot + 1 : activeSlot}`}</h3>
                              <button onClick={() => setShowImagePickerModal(false)} className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"><X size={18} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto py-6 grid grid-cols-3 sm:grid-cols-4 gap-4">
                              {allImages.map((img, idx) => {
                                const isSelected = currentEditorConfig?.url === img.url;
                                return (
                                  <div key={idx} onClick={() => { handleConfigChange(activeSlot, 'url', img.url); handleConfigChange(activeSlot, 'zoom', 1); handleConfigChange(activeSlot, 'x', 50); handleConfigChange(activeSlot, 'y', 50); setShowImagePickerModal(false); }} className={`relative aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition group ${isSelected ? 'border-blue-500 ring-4 ring-blue-500/20' : 'border-white/10 hover:border-white/40'}`}>
                                    <img src={img.url} alt={`Option ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                    {isSelected && <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center"><div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg"><Check size={16} /></div></div>}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                    </div>
                </div>

                {/* SIDEBAR CONTROLS - Simplified as requested */}
                {isDesktop && currentEditorConfig && (
                    <div className="w-80 bg-slate-950 border-l border-slate-800 p-6 flex flex-col gap-6 z-30 shrink-0 shadow-2xl overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <div className="flex items-center gap-2"><Sliders size={18} className="text-blue-400" /><h3 className="text-white font-bold text-sm">Image Adjustments</h3></div>
                        </div>
                        <div className="space-y-6 text-xs text-slate-300">
                            <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
                                Click an image on the canvas to select it. Drag directly on the image to pan, or use the sliders below.
                            </p>

                            {/* Target Slot Selector */}
                            <div>
                                <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5"><Target size={12} /> Target Slot</label>
                                <select value={String(activeSlot)} onChange={(e) => setActiveSlot(e.target.value === 'cover' ? 'cover' : Number(e.target.value))} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="cover">Cover Photo</option>
                                    {Array.from({ length: 9 }).map((_, i) => (<option key={i} value={i}>Slot {i + 1}</option>))}
                                </select>
                            </div>

                            {/* Zoom Level Slider */}
                            <div>
                                <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-2">Zoom Level</label>
                                <div className="flex items-center gap-3">
                                    <ZoomOut size={16} className="text-slate-500" />
                                    <input type="range" min="1" max="6" step="0.05" value={currentEditorConfig.zoom} onChange={(e) => handleConfigChange(activeSlot, 'zoom', parseFloat(e.target.value))} className="flex-1 accent-blue-500 cursor-pointer" />
                                    <ZoomIn size={16} className="text-slate-500" />
                                    <span className="font-mono w-10 text-right">{Math.round(currentEditorConfig.zoom * 100)}%</span>
                                </div>
                            </div>

                            {/* X-Axis Position Slider (0 to 100) */}
                            <div>
                                <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                                    <span>Horizontal (X)</span><span className="font-mono text-[10px] text-blue-400">{Math.round(currentEditorConfig.x)}%</span>
                                </label>
                                <div className="flex items-center gap-3">
                                    <MoveHorizontal size={16} className="text-slate-500" />
                                    <input type="range" min={0} max={100} step="1" disabled={currentBounds.maxX === 0} value={currentEditorConfig.x} onChange={(e) => handleConfigChange(activeSlot, 'x', parseFloat(e.target.value))} className="flex-1 accent-blue-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed" />
                                </div>
                            </div>

                            {/* Y-Axis Position Slider (0 to 100) */}
                            <div>
                                <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                                    <span>Vertical (Y)</span><span className="font-mono text-[10px] text-blue-400">{Math.round(currentEditorConfig.y)}%</span>
                                </label>
                                <div className="flex items-center gap-3">
                                    <MoveVertical size={16} className="text-slate-500" />
                                    <input type="range" min={0} max={100} step="1" disabled={currentBounds.maxY === 0} value={currentEditorConfig.y} onChange={(e) => handleConfigChange(activeSlot, 'y', parseFloat(e.target.value))} className="flex-1 accent-blue-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed" />
                                </div>
                            </div>

                            <button type="button" onClick={() => setShowImagePickerModal(true)} className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-2"><ImageIcon size={16} /> Change Selected Photo</button>
                            <button type="button" onClick={() => { handleConfigChange(activeSlot, 'zoom', 1); handleConfigChange(activeSlot, 'x', 50); handleConfigChange(activeSlot, 'y', 50); }} className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition flex items-center justify-center gap-2 cursor-pointer mt-4"><RefreshCcw size={14} /> Reset Image</button>
                        </div>
                    </div>
                )}

                <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-3 z-40 pointer-events-auto px-4">
                    <button onClick={prevLayout} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white shadow-xl border border-slate-700 transition cursor-pointer active:scale-95"><ChevronLeft size={16} /></button>
                    <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800 text-white px-3.5 py-1.5 rounded-full text-[11px] font-bold shadow-2xl tracking-wider uppercase">Template {layoutIndex + 1} / 20</div>
                    <button onClick={nextLayout} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white shadow-xl border border-slate-700 transition cursor-pointer active:scale-95"><ChevronRight size={16} /></button>
                </div>
            </div>
        </div>
      </>
    );
  }

  // STANDARD PUBLIC MEMORY VIEW
  return (
    <main className="print:hidden min-h-screen bg-slate-50 dark:bg-slate-950 pb-16 relative z-10 transition-colors duration-300">
      <PageTitle title={memory.title} />
      {isAdminViewer ? (
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-3 sm:px-6 py-2.5 sm:py-3.5 backdrop-blur-md shadow-xs gap-2">
          <button type="button" onClick={() => navigate("/admin", { replace: true })} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs transition hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer active:scale-95 shrink-0"><ArrowLeft size={14} className="sm:w-[15px] sm:h-[15px]" /><span className="hidden xs:inline sm:inline">Back to Admin Panel</span><span className="inline xs:hidden sm:hidden">Back</span></button>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/60 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-purple-700 dark:text-purple-300 shadow-xs truncate"><Shield size={12} className="sm:w-[13px] sm:h-[13px] shrink-0" /><span className="truncate">Admin Inspection Mode</span></div>
        </header>
      ) : isOwner ? ( <Navbar /> ) : ( <AppHeader isOwner={false} isLoggedIn={!!currentUser} /> )}

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0"><div className="absolute inset-x-0 top-0 h-[380px] bg-gradient-to-b from-sky-100/60 via-blue-50/30 to-transparent dark:from-indigo-950/40 dark:via-blue-950/20 dark:to-transparent" /></div>
        <div className="relative z-10 mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-10 xl:px-14 pt-8 lg:pt-12 pb-12">
          <MemoryHero memory={memory} username={username} openGallery={openGallery} isOwner={isOwner} locationState={location.state} onDownloadClick={enterPreviewMode} />
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-10 xl:px-14 pb-24">
        <div className="relative overflow-hidden rounded-[36px] border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-white via-blue-50/15 to-indigo-50/25 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 shadow-xl shadow-sky-950/[0.03] dark:shadow-black/50 p-6 sm:p-14 transition-colors">
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-[#1E3A8A] dark:from-indigo-600 dark:to-blue-700 text-white shadow-lg shadow-blue-500/20 dark:shadow-indigo-900/40 overflow-hidden group"><Compass size={24} className="transition-transform duration-700 animate-[spin_12s_linear_infinite]" /></div>
              <div><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#3559D4] dark:text-indigo-400">Travel Journal</p><h2 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Journey Story</h2></div>
            </div>
            <div className="my-8 h-px bg-slate-100 dark:bg-slate-800" />
            <div className="w-full text-base sm:text-[17px] leading-8 sm:leading-9 text-slate-600 dark:text-slate-300 whitespace-pre-line font-medium">{memory.description}</div>
            <div className="mt-14">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Location Map</h3>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(memory.location || "")}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#3559D4] dark:text-indigo-400 hover:underline flex items-center gap-1">Open in Google Maps ↗</a>
              </div>
              <div className="flex items-center justify-center w-full">
                <div className="w-full max-w-4xl aspect-[16/9] sm:h-[400px] rounded-3xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800 z-0 relative group bg-slate-100 dark:bg-slate-800/80 mx-auto">
                  
                  {/* Smooth Map Skeleton Loading State */}
                  {!isMapLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800/90 text-slate-400 dark:text-slate-500 z-10 animate-pulse">
                      <MapPin size={32} className="text-[#3559D4] dark:text-indigo-400 animate-bounce mb-2" />
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading Google Map...</p>
                    </div>
                  )}

                  {mapEmbedUrl && (
                    <iframe
                      title="Google Map Location"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      onLoad={() => setIsMapLoaded(true)}
                      src={mapEmbedUrl}
                      className="w-full h-full rounded-3xl"
                    />
                  )}
                </div>
              </div>
            </div>
        </div>
      </section>

            {isOpen && <Lightbox 
            media={memory.media} 
            selectedIndex={selectedIndex} 
            nextImage={nextImage} 
            previousImage={previousImage} 
            goToImage={goToImage} 
            canDownload={isOwner} 
            memoryTitle={memory.title} 
            onClose={() => { 
                setIsOpen(false); 
                setSearchParams({}, { replace: false, state: location.state }); 
            }} 
        />}
    </main>
  );
}