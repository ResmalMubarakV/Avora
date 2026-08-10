import React, { useState } from 'react';
import { MapPin, CalendarDays, Navigation, Plane, Car, Train, Ship, Move } from "lucide-react";

// SafeImage: Direct Hand-Pan & Zoom Engine for Any Aspect Ratio
const SafeImage = ({ config, className = "", imgClassName = "", slotId, isEditing, activeSlot, onSlotClick, onUpdateConfig, style = {}, imgStyle = {} }) => {
  if (!config || !config.url) return <div className={className} style={{ width: '100%', height: '100%', backgroundColor: '#e2e8f0', ...style }} />;
  const { url, zoom = 1, x = 0, y = 0 } = config;
  const isActive = isEditing && activeSlot === slotId;

  const [isDragging, setIsDragging] = useState(false);
  const [isPinching, setIsPinching] = useState(false);
  
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [initialPinchDist, setInitialPinchDist] = useState(null);
  const [initialZoom, setInitialZoom] = useState(1);

  const getMaxPan = (z) => (z > 1 ? ((z - 1) / z) * 50 : 0);

  const handleMouseDown = (e) => {
    if (!isEditing) return;
    e.stopPropagation();
    if (!isActive && onSlotClick) onSlotClick(slotId);
    if (onUpdateConfig) {
        setIsDragging(true);
        setStartPos({ x: e.clientX, y: e.clientY });
        setStartPan({ x, y });
    }
  };

  const handleMouseMove = (e) => {
    if (!isActive || !isDragging || !onUpdateConfig) return;
    const speed = 0.15 / zoom;
    const maxPan = getMaxPan(zoom);
    onUpdateConfig(slotId, 'x', Math.max(-maxPan, Math.min(maxPan, startPan.x + ((e.clientX - startPos.x) * speed))));
    onUpdateConfig(slotId, 'y', Math.max(-maxPan, Math.min(maxPan, startPan.y + ((e.clientY - startPos.y) * speed))));
  };

  const handleMouseUp = () => { setIsDragging(false); };
  
  const handleWheel = (e) => {
    if (!isActive || !onUpdateConfig) return;
    e.preventDefault();
    const newZoom = Math.max(1, Math.min(5, zoom + (e.deltaY < 0 ? 0.1 : -0.1)));
    const maxPan = getMaxPan(newZoom);
    onUpdateConfig(slotId, 'zoom', newZoom);
    onUpdateConfig(slotId, 'x', Math.max(-maxPan, Math.min(maxPan, x)));
    onUpdateConfig(slotId, 'y', Math.max(-maxPan, Math.min(maxPan, y)));
  };

  const handleTouchStart = (e) => {
    if (!isEditing) return;
    e.stopPropagation();
    if (!isActive && onSlotClick) onSlotClick(slotId);

    if (e.touches.length === 1 && onUpdateConfig) {
        setIsDragging(true);
        setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        setStartPan({ x, y });
    } else if (e.touches.length === 2 && onUpdateConfig) {
        setIsPinching(true);
        setIsDragging(false);
        const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        setInitialPinchDist(dist);
        setInitialZoom(zoom);
    }
  };

  const handleTouchMove = (e) => {
    if (!isActive || !onUpdateConfig) return;
    
    if (isDragging && e.touches.length === 1) {
        const speed = 0.2 / zoom;
        const maxPan = getMaxPan(zoom);
        onUpdateConfig(slotId, 'x', Math.max(-maxPan, Math.min(maxPan, startPan.x + ((e.touches[0].clientX - startPos.x) * speed))));
        onUpdateConfig(slotId, 'y', Math.max(-maxPan, Math.min(maxPan, startPan.y + ((e.touches[0].clientY - startPos.y) * speed))));
    } else if (isPinching && e.touches.length === 2 && initialPinchDist) {
        const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        const scale = dist / initialPinchDist;
        const newZoom = Math.max(1, Math.min(5, initialZoom * scale));
        const maxPan = getMaxPan(newZoom);
        onUpdateConfig(slotId, 'zoom', newZoom);
        onUpdateConfig(slotId, 'x', Math.max(-maxPan, Math.min(maxPan, x)));
        onUpdateConfig(slotId, 'y', Math.max(-maxPan, Math.min(maxPan, y)));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsPinching(false);
    setInitialPinchDist(null);
  };

  const { filter, ...restImgStyle } = imgStyle;

  return (
    <div
      className={`group relative overflow-hidden block isolation-auto ${className}`}
      style={{ 
        width: '100%', 
        height: '100%', 
        cursor: isEditing ? (isDragging ? 'grabbing' : 'grab') : 'default', 
        touchAction: isEditing ? 'none' : 'auto', 
        ...style 
      }}
      onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onWheel={handleWheel}
      onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onTouchCancel={handleTouchEnd}
    >
      <img 
        src={url} 
        crossOrigin="anonymous" 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%', 
          height: '100%', 
          maxWidth: 'none',
          maxHeight: 'none',
          objectFit: 'cover', 
          display: 'block', 
          pointerEvents: 'none', 
          transform: `scale(${zoom}) translate(${x}%, ${y}%)`, 
          transformOrigin: 'center center', 
          transition: isDragging || isPinching ? 'none' : 'transform 0.1s ease-out', 
          filter: filter, 
          WebkitFilter: filter, 
          ...restImgStyle 
        }} 
        alt="memory" 
        draggable={false} 
      />
      
      {/* Desktop hover badge hint and active edit frame */}
      {isEditing && (
        <div className={`absolute inset-0 pointer-events-none transition-all duration-200 ${isActive ? 'border-4 border-[#3559D4] bg-[#3559D4]/10 shadow-inner' : 'border border-transparent group-hover:border-[#3559D4]/60'}`}>
            {!isActive && (
              <span className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider flex items-center gap-1">
                Click to Edit
              </span>
            )}
            {isActive && isDragging && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-slate-950/80 text-white p-3 rounded-full backdrop-blur-md shadow-2xl">
                  <Move size={20} />
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

const PrintableView = ({ memory, layoutIndex = 0, mediaConfig = null, isEditing = false, activeSlot = null, onSlotClick = null, onUpdateConfig = null }) => {
  const defaultImages = memory?.media?.filter(m => m.type === 'image') || [];
  const baseCover = memory?.coverImage || (defaultImages.length > 0 ? defaultImages[0].url : "");
  
  const coverConfig = mediaConfig?.cover?.url ? mediaConfig.cover : { url: baseCover, zoom: 1, x: 0, y: 0 };
  const slotConfigs = Array.from({ length: 9 }).map((_, i) => mediaConfig?.slots?.[i]?.url ? mediaConfig.slots[i] : { url: defaultImages[i % defaultImages.length]?.url || "", zoom: 1, x: 0, y: 0 });
  
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

  const Wrapper = ({ children, style, className = "" }) => (
    <div className={className} style={{ width: '800px', height: '1131px', minHeight: '1131px', minWidth: '800px', overflow: 'hidden', position: 'relative', boxSizing: 'border-box', backgroundColor: '#ffffff', ...style }}>
      {children}
    </div>
  );

  const sharedImgProps = { isEditing, activeSlot, onSlotClick, onUpdateConfig };

  // ==========================================
  // TEMPLATES 0-19
  // ==========================================

  if (layoutIndex === 0) {
    return (
      <Wrapper style={{ backgroundColor: '#F4F1EB', padding: '48px', color: '#1e293b', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
        <h1 style={{ fontSize: '56px', fontFamily: 'serif', fontStyle: 'italic', textAlign: 'center', marginTop: '16px', marginBottom: '8px', lineHeight: '1.2', wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{title}</h1>
        <p style={{ textAlign: 'center', fontSize: '11px', fontWeight: 'bold', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '28px', color: '#64748b' }}>
          {location} • {dateStr}
        </p>
        <div style={{ maxWidth: '580px', margin: '0 auto', textAlign: 'justify', fontSize: '15px', lineHeight: '1.65', fontWeight: '500', marginBottom: '28px', maxHeight: '210px', overflow: 'hidden' }}>
             {story}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', padding: '0 32px', marginTop: 'auto', marginBottom: '24px' }}>
             {slotConfigs.slice(0, 4).map((cfg, i) => (
                 <div key={i} style={{ backgroundColor: '#ffffff', padding: '10px', paddingBottom: '36px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', position: 'relative', height: '180px', boxSizing: 'border-box' }}>
                      <div style={{ width: '100%', height: '120px', backgroundColor: '#f8fafc', overflow: 'hidden', position: 'relative' }}>
                          <SafeImage config={cfg} slotId={i} imgStyle={{ filter: 'grayscale(15%)', WebkitFilter: 'grayscale(15%)' }} {...sharedImgProps} />
                      </div>
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
                 <p style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '16px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', margin: '16px 0 0 0' }}>
                    <MapPin size={16}/> {location}
                 </p>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                 <p style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase', backgroundColor: '#0f172a', color: '#ffffff', padding: '6px 12px', margin: 0 }}>{dateStr}</p>
                 <p style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                     {renderIcon(14)} {mode}
                 </p>
             </div>
         </div>
         <div style={{ display: 'flex', gap: '32px', flex: 1, overflow: 'hidden' }}>
             <div style={{ width: '41.6%', fontSize: '14px', lineHeight: '1.65', fontWeight: '500', textAlign: 'justify', color: '#334155', maxHeight: '720px', overflow: 'hidden' }}>
                  {story}
             </div>
             <div style={{ width: '58.3%', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
                 {slotConfigs.slice(0,2).map((cfg, i) => (
                     <div key={i} style={{ flex: 1, width: '100%', backgroundColor: '#f1f5f9', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', overflow: 'hidden', position: 'relative' }}>
                         <SafeImage config={cfg} slotId={i} {...sharedImgProps} />
                     </div>
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
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14}/> {location}</span>
                    <span>|</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CalendarDays size={14}/> {dateStr}</span>
                </div>
            </div>
        </div>
        <div style={{ padding: '48px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box', overflow: 'hidden' }}>
            <div style={{ columnCount: 2, columnGap: '32px', fontSize: '14px', lineHeight: '1.65', fontFamily: 'serif', textAlign: 'justify', color: '#334155', maxHeight: '250px', overflow: 'hidden' }}>
                {story}
            </div>
            <div style={{ display: 'flex', gap: '12px', height: '160px', backgroundColor: '#000000', padding: '12px', boxSizing: 'border-box', flexShrink: 0, overflow: 'hidden' }}>
                 {slotConfigs.slice(0, 4).map((cfg, i) => (
                     <div key={i} style={{ flex: 1, height: '100%', backgroundColor: '#1a1a1a', overflow: 'hidden', position: 'relative' }}>
                         <SafeImage config={cfg} slotId={i} imgStyle={{ filter: 'sepia(20%)', WebkitFilter: 'sepia(20%)' }} {...sharedImgProps} />
                     </div>
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
             <p style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.4em', color: '#94a3b8', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px 0' }}>
                  {renderIcon(12)} {mode} Log • {dateStr}
             </p>
             <h1 style={{ fontSize: '48px', fontWeight: '300', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '32px', color: '#ffffff', lineHeight: '1.2', margin: '0 0 32px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flexShrink: 0 }}>{title}</h1>
             <div style={{ display: 'flex', gap: '36px', flex: 1, overflow: 'hidden' }}>
                  <div style={{ width: '50%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                       <p style={{ marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '16px', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', margin: '0 0 20px 0' }}>
                           <MapPin size={16} /> {location}
                       </p>
                       <div style={{ fontSize: '14px', lineHeight: '1.65', color: '#cbd5e1', fontWeight: '300', textAlign: 'justify', maxHeight: '550px', overflow: 'hidden' }}>
                           {story}
                       </div>
                  </div>
                  <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center', overflow: 'hidden' }}>
                       {slotConfigs.slice(0,3).map((cfg, i) => (
                           <div key={i} style={{ flex: 1, width: '100%', maxHeight: '160px', backgroundColor: '#0f172a', border: '4px solid #1e293b', boxShadow: '0 15px 30px rgba(0,0,0,0.25)', overflow: 'hidden', position: 'relative' }}>
                               <SafeImage config={cfg} slotId={i} {...sharedImgProps} />
                           </div>
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
                          <p style={{ fontSize: '13px', fontWeight: '500', lineHeight: '1.6', color: 'rgba(255,255,255,0.9)', margin: 0, overflow: 'hidden', maxHeight: '115px' }}>{story}</p>
                      </div>
                  </div>
                  <div style={{ width: '33.333%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {slotConfigs.slice(0, 2).map((cfg, i) => (
                          <div key={i} style={{ width: '100%', height: '110px', backgroundColor: '#222222', border: '3px solid #ffffff', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                              <SafeImage config={cfg} slotId={i} {...sharedImgProps} />
                          </div>
                      ))}
                      <div style={{ backgroundColor: '#ffffff', color: '#000000', padding: '10px', textAlign: 'center', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '6px', fontSize: '11px' }}>
                          {dateStr}
                      </div>
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
                      <div style={{ width: '100%', height: '220px', flexShrink: 0, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', overflow: 'hidden', position: 'relative' }}>
                          <SafeImage config={coverConfig} slotId="cover" imgStyle={{ filter: 'grayscale(100%) contrast(125%)', WebkitFilter: 'grayscale(100%) contrast(125%)' }} {...sharedImgProps} />
                      </div>
                      <div style={{ fontSize: '13px', lineHeight: '1.65', fontFamily: 'serif', color: '#1f2937', textAlign: 'justify', maxHeight: '350px', overflow: 'hidden' }}>
                          {story}
                      </div>
                  </div>
                  <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflow: 'hidden' }}>
                      {slotConfigs.slice(0, 2).map((cfg, i) => (
                          <div key={i} style={{ display: 'flex', flexDirection: 'column', width: '100%', flex: 1, overflow: 'hidden' }}>
                              <div style={{ flex: 1, minHeight: 0, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', overflow: 'hidden', position: 'relative' }}>
                                  <SafeImage config={cfg} slotId={i} imgStyle={{ filter: 'grayscale(100%) contrast(125%)', WebkitFilter: 'grayscale(100%) contrast(125%)' }} {...sharedImgProps} />
                              </div>
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
              <div style={{ position: 'absolute', top: 0, right: '64px', backgroundColor: '#d87c4a', color: '#fbf5eb', padding: '10px 20px', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px', fontWeight: '900', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '12px' }}>
                  {dateStr}
              </div>
              <h1 style={{ fontSize: '48px', fontWeight: '900', color: '#d87c4a', textTransform: 'uppercase', letterSpacing: '-0.05em', marginTop: '24px', marginBottom: '8px', lineHeight: '1.2', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{title}</h1>
              <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#5c3a21', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', margin: '0 0 24px 0' }}>
                  <MapPin size={16}/> {location}
              </p>
              <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', height: '180px', flexShrink: 0 }}>
                  {slotConfigs.slice(0, 2).map((cfg, i) => (
                      <div key={i} style={{ flex: 1, height: '100%', backgroundColor: '#ffffff', borderRadius: '20px', border: '3px solid #d87c4a', overflow: 'hidden', position: 'relative' }}>
                          <SafeImage config={cfg} slotId={i} {...sharedImgProps} />
                      </div>
                  ))}
              </div>
              <div style={{ backgroundColor: '#e9c496', padding: '24px', borderRadius: '20px', border: '3px solid #d87c4a', maxHeight: '240px', overflow: 'hidden' }}>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', lineHeight: '1.6', color: '#5c3a21', overflow: 'hidden', maxHeight: '190px', margin: 0 }}>
                      {story}
                  </p>
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
                          <p style={{ margin: 0 }}>LOC: {location}</p>
                          <p style={{ margin: 0 }}>DAT: {dateStr}</p>
                          <p style={{ margin: 0 }}>MOD: {mode}</p>
                      </div>
                  </div>
                  <div style={{ backgroundColor: '#1e3a8a', color: '#ffffff', padding: '12px' }}>
                      <Navigation size={32} />
                  </div>
              </header>
              <div style={{ display: 'flex', gap: '28px', flex: 1, overflow: 'hidden' }}>
                  <div style={{ width: '41.6%', borderRight: '2px solid #1e3a8a', paddingRight: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '900', borderBottom: '2px solid #1e3a8a', display: 'inline-block', marginBottom: '12px', margin: '0 0 12px 0', paddingBottom: '4px' }}>OBSERVATIONS</h3>
                      <div style={{ fontSize: '14px', lineHeight: '1.65', color: '#334155', textAlign: 'justify', maxHeight: '600px', overflow: 'hidden' }}>
                          {story}
                      </div>
                  </div>
                  <div style={{ width: '58.3%', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflow: 'hidden' }}>
                      {slotConfigs.slice(0, 3).map((cfg, i) => (
                          <div key={i} style={{ flex: 1, minHeight: 0, border: '2px solid #1e3a8a', padding: '6px', backgroundColor: '#ffffff', overflow: 'hidden', position: 'relative' }}>
                              <SafeImage config={cfg} slotId={i} {...sharedImgProps} />
                          </div>
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
                  <div style={{ fontSize: '15px', lineHeight: '1.65', fontFamily: 'serif', color: '#475569', textAlign: 'center', padding: '0 24px', maxHeight: '180px', overflow: 'hidden' }}>
                      {story}
                  </div>
              </div>
          </div>
      </Wrapper>
    );
  }

  if (layoutIndex === 9) {
    return (
      <Wrapper style={{ backgroundColor: '#f8fafc', padding: '40px', color: '#0f172a', display: 'flex', flexDirection: 'column' }}>
          <header style={{ position: 'absolute', top: '40px', left: '40px', width: '720px', height: '100px', display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '20px', boxSizing: 'border-box', border: '1px solid #f1f5f9' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', flexShrink: 0, overflow: 'hidden', backgroundColor: '#f8fafc', position: 'relative' }}>
                  <SafeImage config={coverConfig} slotId="cover" {...sharedImgProps} />
              </div>
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
              <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#475569', fontWeight: '500', margin: 0, maxHeight: '56px', overflow: 'hidden' }}>{story}</p>
          </div>

          {slotConfigs.slice(0, 9).map((cfg, i) => {
              const cols = 3;
              const cellWidth = 224;
              const cellHeight = 224;
              const gap = 24;
              const startX = 40;
              const startY = 260;
              
              const col = i % cols;
              const row = Math.floor(i / cols);
              const left = startX + col * (cellWidth + gap);
              const top = startY + row * (cellHeight + gap);

              return (
                  <div key={i} style={{ position: 'absolute', left: `${left}px`, top: `${top}px`, width: `${cellWidth}px`, height: `${cellHeight}px`, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', boxSizing: 'border-box' }}>
                      <SafeImage config={cfg} slotId={i} {...sharedImgProps} />
                  </div>
              );
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
                  <span>Vol. 1</span>
                  <span>{location}</span>
                  <span>{dateStr}</span>
                  <span>{mode}</span>
              </div>
          </div>
          <div style={{ columnCount: 3, columnGap: '24px', fontSize: '13px', lineHeight: '1.6', fontFamily: 'serif', textAlign: 'justify', color: '#333333', marginBottom: '24px', maxHeight: '420px', overflow: 'hidden' }}>
              {story}
          </div>
          <div style={{ display: 'flex', gap: '16px', height: '220px', flexShrink: 0, marginTop: 'auto' }}>
             {slotConfigs.slice(0,2).map((cfg, i) => (
                 <div key={i} style={{ flex: 1, height: '100%', border: '2px solid #111111', padding: '6px', backgroundColor: '#ffffff', overflow: 'hidden', position: 'relative' }}>
                     <SafeImage config={cfg} slotId={i} imgStyle={{ filter: 'grayscale(100%)', WebkitFilter: 'grayscale(100%)' }} {...sharedImgProps} />
                 </div>
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
                  <p style={{ margin: 0 }}>COORD: {location}</p>
                  <p style={{ margin: 0 }}>VECTOR: {mode}</p>
              </div>
          </header>
          <div style={{ display: 'flex', gap: '36px', flex: 1, overflow: 'hidden' }}>
              <div style={{ width: '50%', fontSize: '13px', lineHeight: '1.65', color: '#b3b3b3', textAlign: 'justify', maxHeight: '650px', overflow: 'hidden' }}>
                  <span style={{ color: '#00ff9d' }}>&gt;_ </span>{story}
              </div>
              <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflow: 'hidden' }}>
                 {slotConfigs.slice(0, 2).map((cfg, i) => (
                     <div key={i} style={{ flex: 1, minHeight: 0, position: 'relative', width: '100%', border: '1px solid #00e5ff', backgroundColor: '#0a0a0a', boxShadow: '0 0 15px rgba(0,229,255,0.2)', padding: '6px', overflow: 'hidden' }}>
                         <SafeImage config={cfg} slotId={i} imgStyle={{ opacity: 0.8, mixBlendMode: 'screen' }} {...sharedImgProps} />
                     </div>
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
              
              <div style={{ width: '100%', height: '220px', marginBottom: '24px', backgroundColor: '#fdfbf7', padding: '6px', border: '1px solid #eaeaea', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                  <SafeImage config={coverConfig} slotId="cover" {...sharedImgProps} />
              </div>

              <div style={{ fontSize: '14px', lineHeight: '1.65', fontFamily: 'serif', color: '#555555', maxWidth: '450px', maxHeight: '180px', overflow: 'hidden', margin: '0 auto' }}>
                  {story}
              </div>

              <p style={{ marginTop: 'auto', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c19a6b', borderTop: '1px solid #c19a6b', paddingTop: '16px', width: '100%', margin: 'auto 0 0 0', flexShrink: 0 }}>
                  Recorded in {location}
              </p>
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
                  <div style={{ backgroundColor: '#1d3557', borderRadius: '50%', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                      {renderIcon(32)}
                  </div>
              </div>
          </div>
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              <div style={{ width: '50%', padding: '36px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ backgroundColor: '#1d3557', color: '#ffffff', display: 'inline-block', padding: '6px 12px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px', alignSelf: 'flex-start', flexShrink: 0 }}>
                      {dateStr}
                  </div>
                  <div style={{ fontSize: '14px', lineHeight: '1.65', fontWeight: '500', textAlign: 'justify', maxHeight: '550px', overflow: 'hidden' }}>
                      {story}
                  </div>
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
                  <span>{location}</span>
                  <span>{dateStr}</span>
              </div>
              <div style={{ textAlign: 'center', fontSize: '14px', lineHeight: '1.65', fontFamily: 'serif', color: '#3e5f4d', padding: '0 32px', maxHeight: '280px', overflow: 'hidden' }}>
                  {story}
              </div>
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
                  <div style={{ backgroundColor: '#f8bbd0', color: '#880e4f', padding: '8px 16px', borderRadius: '9999px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {dateStr}
                  </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', height: '160px', flexShrink: 0 }}>
                  {slotConfigs.slice(0, 3).map((cfg, i) => (
                      <div key={i} style={{ flex: 1, height: '100%', borderRadius: '16px', backgroundColor: '#fef1f5', padding: '6px', overflow: 'hidden', position: 'relative' }}>
                          <SafeImage config={cfg} slotId={i} style={{ borderRadius: '12px' }} imgStyle={{ borderRadius: '12px' }} {...sharedImgProps} />
                      </div>
                  ))}
              </div>
              <div style={{ backgroundColor: '#fce4ec', borderRadius: '20px', padding: '24px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 12px 0', flexShrink: 0 }}><MapPin size={14}/> {location}</p>
                  <div style={{ fontSize: '14px', lineHeight: '1.65', color: '#880e4f', overflow: 'hidden', flex: 1 }}>
                      {story}
                  </div>
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
                          <div key={i} style={{ flex: 1, width: '100%', minHeight: 0, backgroundColor: '#f0f0f0', padding: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', overflow: 'hidden', position: 'relative' }}>
                              <SafeImage config={cfg} slotId={i} {...sharedImgProps} />
                          </div>
                      ))}
                  </div>
                  <div style={{ width: '66.6%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', overflow: 'hidden' }}>
                      <div style={{ borderBottom: '2px dashed #0a2342', paddingBottom: '6px', marginBottom: '16px', flexShrink: 0 }}>
                          <p style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666666', margin: 0 }}>Official Entry: <span style={{ color: '#0a2342' }}>{location}</span></p>
                      </div>
                      <div style={{ fontSize: '14px', lineHeight: '1.65', fontFamily: 'monospace', color: '#333333', textAlign: 'justify', maxHeight: '600px', overflow: 'hidden' }}>
                          {story}
                      </div>
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
                      <div style={{ fontSize: '14px', lineHeight: '1.65', fontWeight: '500', textAlign: 'justify', maxHeight: '420px', overflow: 'hidden' }}>
                          {story}
                      </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #2b2b2b', paddingTop: '16px', flexShrink: 0, marginTop: '20px' }}>
                      <div>
                          <p style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 'bold', color: '#888888', margin: 0 }}>DESTINATION</p>
                          <p style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', margin: 0 }}>{location}</p>
                      </div>
                      <div>
                          <p style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 'bold', color: '#888888', margin: 0 }}>DATE</p>
                          <p style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', margin: 0 }}>{dateStr}</p>
                      </div>
                      <div>
                          <p style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 'bold', color: '#888888', margin: 0 }}>CLASS</p>
                          <p style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', margin: 0 }}>{mode}</p>
                      </div>
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
                  
                  <div style={{ fontSize: '14px', lineHeight: '1.65', color: '#333333', maxHeight: '300px', overflow: 'hidden', textAlign: 'justify' }}>
                      {story}
                  </div>
              </div>

              <div style={{ overflow: 'hidden' }}>
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', height: '180px', width: '100%', flexShrink: 0 }}>
                      {slotConfigs.slice(0, 2).map((cfg, i) => (
                          <div key={i} style={{ flex: 1, height: '100%', backgroundColor: '#eeeeee', padding: '6px', border: '1px solid #dddddd', overflow: 'hidden', position: 'relative' }}>
                              <SafeImage config={cfg} slotId={i} imgStyle={{ filter: 'grayscale(100%)', WebkitFilter: 'grayscale(100%)' }} {...sharedImgProps} />
                          </div>
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
              
              <div style={{ fontSize: '13px', fontFamily: 'monospace', lineHeight: '1.6', margin: '0 auto 24px auto', maxWidth: '600px', maxHeight: '90px', overflow: 'hidden', color: 'rgba(255,255,255,0.8)' }}>
                  {story}
              </div>

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
};

export default PrintableView;