import React, { useState } from 'react';
import { MapPin, CalendarDays, Navigation, Plane, Car, Train, Ship, Move } from "lucide-react";

// SafeImage: FLAWLESS BOUNDED PAN & MULTI-TOUCH ENGINE
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
      className={className}
      style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%', display: 'block', cursor: isEditing ? (isDragging ? 'grabbing' : 'pointer') : 'default', touchAction: isEditing ? 'none' : 'auto', ...style }}
      onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onWheel={handleWheel}
      onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onTouchCancel={handleTouchEnd}
    >
      <img 
        src={url} 
        crossOrigin="anonymous" 
        style={{ 
          width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none', 
          transform: `scale(${zoom}) translate(${x}%, ${y}%)`, transformOrigin: 'center center', 
          transition: isDragging || isPinching ? 'none' : 'transform 0.1s ease-out', 
          filter: filter, WebkitFilter: filter, ...restImgStyle 
        }} 
        alt="memory" draggable={false} 
      />
      
      {isActive && (
        <div style={{ position: 'absolute', inset: 0, border: '4px solid #3559D4', backgroundColor: 'rgba(53, 89, 212, 0.1)', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.5)', zIndex: 50, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {isDragging && <div style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#ffffff', padding: '12px', borderRadius: '9999px', backdropFilter: 'blur(12px)' }}><Move size={24} /></div>}
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

  const getScatteredStyles = (index) => {
    const rotations = ['rotate(3deg)', 'rotate(-6deg)', 'rotate(6deg)', 'rotate(-2deg)', 'rotate(12deg)', 'rotate(-12deg)'];
    const margins = ['0px', '-48px', '32px', '-64px', '48px', '-32px'];
    return { transform: rotations[index % rotations.length], marginTop: margins[index % margins.length] };
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
      <Wrapper style={{ backgroundColor: '#F4F1EB', padding: '48px', color: '#1e293b' }}>
        <h1 style={{ fontSize: '72px', fontFamily: 'serif', fontStyle: 'italic', textAlign: 'center', marginTop: '40px', marginBottom: '16px', lineHeight: '1.2', textShadow: '0 1px 1px rgba(0,0,0,0.05)', wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{title}</h1>
        <p style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '64px', color: '#64748b', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', margin: '0 0 64px 0' }}>
          {location} <span style={{ fontSize: '20px' }}>•</span> {dateStr}
        </p>
        <div style={{ maxWidth: '576px', margin: '0 auto', textAlign: 'justify', fontSize: '13px', lineHeight: '2.5', fontWeight: '500', marginBottom: '48px', height: '300px', overflow: 'hidden' }}>
             <span style={{ fontSize: '60px', float: 'left', fontFamily: 'serif', marginRight: '12px', marginTop: '8px', color: '#0f172a' }}>{story.charAt(0)}</span>
             {story.substring(1)}
        </div>
        <div style={{ position: 'relative', marginTop: '80px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px', padding: '0 32px' }}>
             {slotConfigs.slice(0, 4).map((cfg, i) => (
                 <div key={i} style={{ width: '288px', display: 'flex', flexDirection: 'column', zIndex: 10 + i, ...getScatteredStyles(i) }}>
                      <div style={{ backgroundColor: '#ffffff', padding: '16px', paddingBottom: '64px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0', position: 'relative' }}>
                          <div style={{ width: '256px', height: '224px', backgroundColor: '#f8fafc' }}>
                              <SafeImage config={cfg} slotId={i} imgStyle={{ filter: 'grayscale(15%)', WebkitFilter: 'grayscale(15%)' }} {...sharedImgProps} />
                          </div>
                          <div style={{ position: 'absolute', bottom: '16px', left: 0, width: '100%', textAlign: 'center', fontFamily: 'serif', fontSize: '14px', color: '#94a3b8', fontStyle: 'italic' }}>Memory {i+1}</div>
                      </div>
                 </div>
             ))}
        </div>
      </Wrapper>
    );
  }

  if (layoutIndex === 1) {
    return (
      <Wrapper style={{ padding: '64px', color: '#0f172a', border: '24px solid #f8fafc' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', borderBottom: '4px solid #0f172a', paddingBottom: '32px', flexShrink: 0 }}>
             <div style={{ maxWidth: '65%' }}>
                 <h1 style={{ fontSize: '60px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.05em', lineHeight: '1.1', margin: 0, paddingBottom: '8px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{title}</h1>
                 <p style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '24px', textTransform: 'uppercase', letterSpacing: '0.3em', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', margin: '24px 0 0 0' }}>
                    <MapPin size={16}/> {location}
                 </p>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                 <p style={{ fontSize: '14px', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase', backgroundColor: '#0f172a', color: '#ffffff', padding: '8px 16px', margin: 0 }}>{dateStr}</p>
                 <p style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                     {renderIcon(16)} {mode}
                 </p>
             </div>
         </div>
         <div style={{ display: 'flex', gap: '40px', flex: 1, height: '500px' }}>
             <div style={{ width: '41.6%', fontSize: '13px', lineHeight: '2.2', fontWeight: '500', textAlign: 'justify', color: '#334155', overflow: 'hidden', height: '100%' }}>
                  {story}
             </div>
             <div style={{ width: '58.3%', display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
                 {slotConfigs.slice(0,2).map((cfg, i) => (
                     <div key={i} style={{ flex: 1, width: '100%', backgroundColor: '#f1f5f9', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
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
      <Wrapper style={{ backgroundColor: '#E8E6E1', color: '#3A3A3A', padding: 0 }}>
        <div style={{ height: '550px', width: '100%', position: 'relative', backgroundColor: '#000000', boxShadow: '0 20px 25px rgba(0,0,0,0.1)', display: 'block', flexShrink: 0 }}>
            <SafeImage config={coverConfig} slotId="cover" {...sharedImgProps} />
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3), rgba(0,0,0,0))' }} />
            <div style={{ position: 'absolute', bottom: '48px', left: '48px', right: '48px', pointerEvents: 'none' }}>
                <h1 style={{ fontSize: '60px', fontFamily: 'serif', fontStyle: 'italic', color: '#ffffff', letterSpacing: '0.05em', marginBottom: '16px', paddingBottom: '16px', textShadow: '0 10px 8px rgba(0,0,0,0.4)', margin: '0 0 16px 0', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{title}</h1>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', color: 'rgba(255,255,255,0.8)', fontSize: '14px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 'bold' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16}/> {location}</span>
                    <span>|</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CalendarDays size={16}/> {dateStr}</span>
                </div>
            </div>
        </div>
        <div style={{ padding: '64px', height: '581px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
            <div style={{ columnCount: 2, columnGap: '48px', fontSize: '14px', lineHeight: '2.2', fontFamily: 'serif', textAlign: 'justify', color: '#334155', overflow: 'hidden', height: '250px' }}>
                {story}
            </div>
            <div style={{ display: 'flex', gap: '16px', position: 'relative', marginTop: '32px', height: '192px', backgroundColor: '#000000', padding: '16px' }}>
                 <div style={{ position: 'absolute', top: '8px', left: 0, width: '100%', borderTop: '3px dashed rgba(255,255,255,0.3)', pointerEvents: 'none', zIndex: 10 }} />
                 <div style={{ position: 'absolute', bottom: '8px', left: 0, width: '100%', borderBottom: '3px dashed rgba(255,255,255,0.3)', pointerEvents: 'none', zIndex: 10 }} />
                 {slotConfigs.slice(0, 4).map((cfg, i) => (
                     <div key={i} style={{ flex: 1, height: '100%', backgroundColor: '#1a1a1a', zIndex: 0, overflow: 'hidden' }}>
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
      <Wrapper style={{ backgroundColor: '#1a1f24', padding: '48px', color: '#f1f5f9' }}>
         <div style={{ border: '1px solid #334155', padding: '48px', position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
             <div style={{ position: 'absolute', top: '-12px', left: '48px', backgroundColor: '#1a1f24', padding: '0 24px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.5em', color: '#94a3b8', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {renderIcon(12)} {mode} Log • {dateStr}
             </div>
             <h1 style={{ fontSize: '60px', fontFamily: 'sans-serif', fontWeight: '300', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '64px', color: '#ffffff', marginTop: '16px', lineHeight: '1.2', margin: '16px 0 64px 0', paddingBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flexShrink: 0 }}>{title}</h1>
             <div style={{ display: 'flex', gap: '48px', flex: 1, overflow: 'hidden' }}>
                  <div style={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
                       <p style={{ marginBottom: '32px', borderBottom: '1px solid #334155', paddingBottom: '32px', fontSize: '14px', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '12px', color: '#94a3b8', margin: '0 0 32px 0' }}>
                           <MapPin size={18} /> {location}
                       </p>
                       <div style={{ fontSize: '14px', lineHeight: '2.2', color: '#cbd5e1', fontWeight: '300', textAlign: 'justify', overflow: 'hidden', height: '600px' }}>
                           {story}
                       </div>
                  </div>
                  <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', position: 'relative' }}>
                       {slotConfigs.slice(0,3).map((cfg, i) => (
                           <div key={i} style={{ flex: 1, width: '100%', backgroundColor: '#0f172a', border: '6px solid #1e293b', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', transform: i % 2 === 0 ? 'translateX(24px)' : 'translateX(-24px)', position: 'relative', overflow: 'hidden' }}>
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
      <Wrapper style={{ backgroundColor: '#000000', padding: 0 }}>
          <div style={{ height: '1131px', width: '100%', position: 'relative', backgroundColor: '#111111', display: 'block' }}>
              <SafeImage config={coverConfig} slotId="cover" imgStyle={{ opacity: 0.8 }} {...sharedImgProps} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.2), rgba(0,0,0,0.9))', pointerEvents: 'none' }} />
              
              <div style={{ position: 'absolute', top: '48px', left: 0, width: '100%', textAlign: 'center', zIndex: 10, padding: '0 32px', pointerEvents: 'none', boxSizing: 'border-box' }}>
                  <p style={{ color: 'rgba(255,255,255,0.8)', letterSpacing: '0.5em', textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.2)', display: 'inline-block', paddingBottom: '8px', margin: '0 0 16px 0' }}>{location}</p>
                  <h1 style={{ fontSize: '72px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '-0.05em', lineHeight: '1.2', textShadow: '0 25px 25px rgba(0,0,0,0.5)', margin: 0, paddingBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{title}</h1>
              </div>
              <div style={{ position: 'absolute', bottom: '48px', left: '48px', right: '48px', zIndex: 10, display: 'flex', gap: '48px', alignItems: 'flex-end' }}>
                  <div style={{ width: '66.666%', pointerEvents: 'none' }}>
                      <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', padding: '24px', borderRadius: '12px', color: '#ffffff' }}>
                          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '8px', margin: '0 0 12px 0' }}>The Story</h3>
                          <p style={{ fontSize: '14px', fontWeight: '500', lineHeight: '1.8', overflow: 'hidden', height: '130px', color: 'rgba(255,255,255,0.9)', margin: 0 }}>{story}</p>
                      </div>
                  </div>
                  <div style={{ width: '33.333%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {slotConfigs.slice(0, 2).map((cfg, i) => (
                          <div key={i} style={{ width: '100%', height: '128px', backgroundColor: '#222222', border: '4px solid #ffffff', boxShadow: '0 20px 25px rgba(0,0,0,0.5)', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                              <SafeImage config={cfg} slotId={i} {...sharedImgProps} />
                          </div>
                      ))}
                      <div style={{ backgroundColor: '#ffffff', color: '#000000', padding: '16px', textAlign: 'center', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '8px', borderRadius: '8px', pointerEvents: 'none' }}>
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
      <Wrapper style={{ backgroundColor: '#ffffff', padding: '80px', color: '#000000' }}>
          <div style={{ border: '1px solid #000000', height: '100%', padding: '40px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #000000', paddingBottom: '24px', marginBottom: '40px', flexShrink: 0 }}>
                  <div style={{ maxWidth: '70%' }}>
                      <h4 style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.4em', color: '#6b7280', margin: 0, marginBottom: '8px' }}>Exhibit A.</h4>
                      <h1 style={{ fontSize: '36px', fontFamily: 'serif', color: '#000000', lineHeight: '1.2', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{title}</h1>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'monospace', margin: 0 }}>{location}</p>
                      <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'monospace', color: '#6b7280', marginTop: '4px', margin: 0 }}>{dateStr}</p>
                  </div>
              </div>
              <div style={{ flex: 1, display: 'flex', gap: '48px', overflow: 'hidden' }}>
                  <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '32px', height: '100%', overflow: 'hidden' }}>
                      <div style={{ width: '100%', height: '256px', flexShrink: 0, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                          <SafeImage config={coverConfig} slotId="cover" imgStyle={{ filter: 'grayscale(100%) contrast(125%)', WebkitFilter: 'grayscale(100%) contrast(125%)' }} {...sharedImgProps} />
                      </div>
                      <div style={{ fontSize: '12px', lineHeight: '2.2', fontFamily: 'serif', color: '#1f2937', textAlign: 'justify', overflow: 'hidden', flex: 1 }}>
                          {story}
                      </div>
                  </div>
                  <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '32px', height: '100%', overflow: 'hidden' }}>
                      {slotConfigs.slice(0, 2).map((cfg, i) => (
                          <div key={i} style={{ display: 'flex', flexDirection: 'column', width: '100%', flex: 1, overflow: 'hidden' }}>
                              <div style={{ flex: 1, minHeight: 0, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                                  <SafeImage config={cfg} slotId={i} imgStyle={{ filter: 'grayscale(100%) contrast(125%)', WebkitFilter: 'grayscale(100%) contrast(125%)' }} {...sharedImgProps} />
                              </div>
                              <p style={{ fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '8px', textAlign: 'right', color: '#9ca3af', fontFamily: 'monospace', margin: 0, paddingTop: '8px', flexShrink: 0 }}>Fig. {i+1}</p>
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
      <Wrapper style={{ backgroundColor: '#f4e3c5', padding: '48px', color: '#5c3a21' }}>
          <div style={{ border: '8px solid #d87c4a', borderRadius: '40px', height: '100%', padding: '40px', backgroundColor: '#fbf5eb', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)', position: 'relative', boxSizing: 'border-box' }}>
              <div style={{ position: 'absolute', top: 0, right: '64px', backgroundColor: '#d87c4a', color: '#fbf5eb', padding: '12px 24px', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', fontWeight: '900', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '14px' }}>
                  {dateStr}
              </div>
              <h1 style={{ fontSize: '60px', fontWeight: '900', color: '#d87c4a', textTransform: 'uppercase', letterSpacing: '-0.05em', marginTop: '48px', marginBottom: '8px', lineHeight: '1.2', margin: '48px 0 8px 0', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{title}</h1>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#5c3a21', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', margin: '0 0 40px 0', paddingBottom: '20px' }}>
                  <MapPin size={20}/> {location}
              </p>
              <div style={{ display: 'flex', gap: '32px', marginBottom: '40px' }}>
                  {slotConfigs.slice(0, 2).map((cfg, i) => (
                      <div key={i} style={{ flex: 1, height: '224px', backgroundColor: '#ffffff', borderRadius: '30px', border: '4px solid #d87c4a', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                          <SafeImage config={cfg} slotId={i} {...sharedImgProps} />
                      </div>
                  ))}
              </div>
              <div style={{ backgroundColor: '#e9c496', padding: '32px', borderRadius: '30px', border: '4px solid #d87c4a' }}>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', lineHeight: '2', color: '#5c3a21', overflow: 'hidden', height: '180px', margin: 0 }}>
                      {story}
                  </p>
              </div>
          </div>
      </Wrapper>
    );
  }

  if (layoutIndex === 7) {
    return (
      <Wrapper style={{ backgroundColor: '#f0f4f8', color: '#1e3a8a', padding: '48px', fontFamily: 'monospace', backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', border: '2px solid #1e3a8a', padding: '40px', height: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
              <header style={{ borderBottom: '2px solid #1e3a8a', paddingBottom: '24px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
                  <div style={{ maxWidth: '80%' }}>
                      <h1 style={{ fontSize: '36px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.025em', marginBottom: '16px', margin: '0 0 16px 0', paddingBottom: '8px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{title}</h1>
                      <div style={{ display: 'flex', gap: '48px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                          <p style={{ margin: 0 }}>LOC: {location}</p>
                          <p style={{ margin: 0 }}>DAT: {dateStr}</p>
                          <p style={{ margin: 0 }}>MOD: {mode}</p>
                      </div>
                  </div>
                  <div style={{ backgroundColor: '#1e3a8a', color: '#ffffff', padding: '16px' }}>
                      <Navigation size={40} />
                  </div>
              </header>
              <div style={{ display: 'flex', gap: '32px', flex: 1, overflow: 'hidden' }}>
                  <div style={{ width: '41.6%', borderRight: '2px solid #1e3a8a', paddingRight: '32px', display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '900', borderBottom: '2px solid #1e3a8a', display: 'inline-block', marginBottom: '16px', margin: '0 0 16px 0', paddingBottom: '4px' }}>OBSERVATIONS</h3>
                      <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#334155', textAlign: 'justify', overflow: 'hidden', flex: 1, marginTop: '16px' }}>
                          {story}
                      </div>
                  </div>
                  <div style={{ width: '58.3%', display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflow: 'hidden' }}>
                      {slotConfigs.slice(0, 3).map((cfg, i) => (
                          <div key={i} style={{ flex: 1, minHeight: 0, border: '2px solid #1e3a8a', padding: '8px', backgroundColor: '#ffffff', position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
      <Wrapper style={{ backgroundColor: '#faf7f2', padding: '64px', color: '#4a4a4a', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '384px', height: '384px', backgroundColor: '#fce7f3', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.6, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '384px', height: '384px', backgroundColor: '#ffedd5', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.6, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ textAlign: 'center', marginBottom: '48px', pointerEvents: 'none', flexShrink: 0 }}>
                  <p style={{ fontSize: '14px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(131,24,67,0.5)', marginBottom: '16px', margin: '0 0 16px 0' }}>{dateStr}</p>
                  <h1 style={{ fontSize: '60px', fontFamily: 'serif', fontStyle: 'italic', color: 'rgba(80,7,36,0.8)', marginBottom: '24px', margin: '0 0 24px 0', paddingBottom: '8px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{title}</h1>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', margin: 0 }}>{location}</p>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '100%', height: '400px', padding: '16px', backgroundColor: '#ffffff', boxShadow: '0 20px 25px rgba(0,0,0,0.1)', borderRadius: '4px', marginBottom: '48px', transform: 'rotate(1deg)', display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}>
                      <SafeImage config={coverConfig} slotId="cover" {...sharedImgProps} />
                  </div>
                  <div style={{ fontSize: '15px', lineHeight: '2.2', fontFamily: 'serif', color: '#475569', textAlign: 'center', padding: '0 40px', overflow: 'hidden', flex: 1, position: 'relative', pointerEvents: 'none' }}>
                      <span style={{ fontSize: '36px', color: '#fbcfe8', position: 'absolute', top: '-16px', left: '-8px' }}>"</span>
                      {story}
                      <span style={{ fontSize: '36px', color: '#fbcfe8', position: 'absolute', bottom: '-32px', right: '-8px' }}>"</span>
                  </div>
              </div>
          </div>
      </Wrapper>
    );
  }

  // FIXED LAYOUT 9: ABSOLUTE PIXEL POSITIONING FOR 3x3 GRID TO ELIMINATE WRAP BUGS
  if (layoutIndex === 9) {
    return (
      <Wrapper style={{ backgroundColor: '#f8fafc', padding: '40px', color: '#0f172a' }}>
          <header style={{ position: 'absolute', top: '40px', left: '40px', width: '720px', height: '110px', display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: '#ffffff', padding: '20px 24px', borderRadius: '24px', boxSizing: 'border-box', border: '1px solid #f1f5f9' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', flexShrink: 0, overflow: 'hidden', backgroundColor: '#f8fafc' }}>
                  <SafeImage config={coverConfig} slotId="cover" {...sharedImgProps} />
              </div>
              <div style={{ overflow: 'hidden', flex: 1 }}>
                  <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</h1>
                  <p style={{ color: '#64748b', fontWeight: '500', margin: '0 0 6px 0', fontSize: '13px' }}>{location}</p>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '11px', fontWeight: '600', color: '#334155' }}>
                      <span style={{ backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '9999px' }}>{mode}</span>
                      <span style={{ backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '9999px' }}>{dateStr}</span>
                  </div>
              </div>
          </header>

          <div style={{ position: 'absolute', top: '166px', left: '40px', width: '720px', height: '90px', backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '20px', boxSizing: 'border-box', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
              <p style={{ fontSize: '12px', lineHeight: '1.4', color: '#475569', fontWeight: '500', margin: 0, height: '100%', overflow: 'hidden' }}>{story}</p>
          </div>

          {slotConfigs.slice(0, 9).map((cfg, i) => {
              const cols = 3;
              const cellWidth = 224;
              const cellHeight = 224;
              const gap = 24;
              const startX = 40;
              const startY = 276;
              
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

  // ==========================================
  // TEMPLATES 10-19
  // ==========================================

  if (layoutIndex === 10) {
    return (
      <Wrapper style={{ backgroundColor: '#f4f4f0', padding: '48px', color: '#111111' }}>
          <div style={{ borderBottom: '4px double #111111', paddingBottom: '24px', marginBottom: '32px', textAlign: 'center', flexShrink: 0 }}>
              <h1 style={{ fontSize: '60px', fontFamily: 'serif', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.025em', marginBottom: '16px', margin: '0 0 16px 0', paddingBottom: '8px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{title}</h1>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'serif', borderTop: '1px solid #111111', borderBottom: '1px solid #111111', padding: '8px 48px' }}>
                  <span>Vol. 1</span>
                  <span>{location}</span>
                  <span>{dateStr}</span>
                  <span>{mode}</span>
              </div>
          </div>
          <div style={{ columnCount: 3, columnGap: '32px', fontSize: '12px', lineHeight: '1.8', fontFamily: 'serif', textAlign: 'justify', color: '#333333', marginBottom: '32px', overflow: 'hidden', height: '450px' }}>
              <span style={{ fontSize: '48px', float: 'left', marginRight: '8px', marginTop: '4px' }}>{story.charAt(0)}</span>
              {story.substring(1)}
          </div>
          <div style={{ display: 'flex', gap: '16px', height: '256px', flexShrink: 0 }}>
             {slotConfigs.slice(0,2).map((cfg, i) => (
                 <div key={i} style={{ flex: 1, height: '100%', border: '2px solid #111111', padding: '8px', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                     <SafeImage config={cfg} slotId={i} imgStyle={{ filter: 'grayscale(100%)', WebkitFilter: 'grayscale(100%)' }} {...sharedImgProps} />
                 </div>
             ))}
          </div>
      </Wrapper>
    );
  }

  if (layoutIndex === 11) {
    return (
      <Wrapper style={{ backgroundColor: '#050505', padding: '64px', color: '#00ff9d', fontFamily: 'monospace', border: '16px solid #1a1a1a' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #00ff9d', paddingBottom: '16px', marginBottom: '40px', flexShrink: 0 }}>
              <div style={{ maxWidth: '70%' }}>
                  <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ff00ff', marginBottom: '8px', margin: '0 0 8px 0' }}>SYS.LOG // {dateStr}</p>
                  <h1 style={{ fontSize: '48px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '-0.05em', margin: 0, paddingBottom: '16px', textShadow: '0 0 8px rgba(0,255,157,0.5)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{title}</h1>
              </div>
              <div style={{ textAlign: 'right', color: '#00e5ff', fontSize: '12px', marginLeft: 'auto' }}>
                  <p style={{ margin: 0 }}>COORD: {location}</p>
                  <p style={{ margin: 0 }}>VECTOR: {mode}</p>
              </div>
          </header>
          <div style={{ display: 'flex', gap: '48px', height: '700px', overflow: 'hidden' }}>
              <div style={{ width: '50%', fontSize: '12px', lineHeight: '2.5', color: '#b3b3b3', textAlign: 'justify', overflow: 'hidden', height: '100%' }}>
                  <span style={{ color: '#00ff9d' }}>&gt;_ </span>{story}
              </div>
              <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
                 {slotConfigs.slice(0, 2).map((cfg, i) => (
                     <div key={i} style={{ flex: 1, minHeight: 0, position: 'relative', width: '100%', border: '1px solid #00e5ff', backgroundColor: '#0a0a0a', boxShadow: '0 0 15px rgba(0,229,255,0.2)', padding: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                         <SafeImage config={cfg} slotId={i} imgStyle={{ opacity: 0.8, mixBlendMode: 'screen' }} {...sharedImgProps} />
                         <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,255,157,0.05)', pointerEvents: 'none' }} />
                     </div>
                 ))}
              </div>
          </div>
      </Wrapper>
    );
  }

  if (layoutIndex === 12) {
    return (
      <Wrapper style={{ backgroundColor: '#fffdfa', padding: '96px', color: '#2c2c2c' }}>
          <div style={{ border: '1px solid #c19a6b', height: '100%', padding: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', boxSizing: 'border-box' }}>
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fffdfa', padding: '0 32px', pointerEvents: 'none', color: '#c19a6b' }}>
                  {renderIcon(24)}
              </div>
              <p style={{ fontSize: '12px', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#c19a6b', marginBottom: '32px', marginTop: '16px', pointerEvents: 'none', margin: '16px 0 32px 0', flexShrink: 0 }}>{dateStr}</p>
              <h1 style={{ fontSize: '48px', fontFamily: 'serif', fontWeight: '300', letterSpacing: '0.05em', marginBottom: '48px', paddingBottom: '8px', overflow: 'hidden', wordBreak: 'break-word', width: '100%', pointerEvents: 'none', margin: '0 0 48px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', flexShrink: 0 }}>{title}</h1>
              
              <div style={{ width: '100%', height: '256px', marginBottom: '48px', backgroundColor: '#fdfbf7', padding: '8px', border: '1px solid #eaeaea', display: 'flex', flexDirection: 'column', boxShadow: '0 15px 30px rgba(0,0,0,0.05)', flexShrink: 0, overflow: 'hidden' }}>
                  <SafeImage config={coverConfig} slotId="cover" {...sharedImgProps} />
              </div>

              <div style={{ fontSize: '14px', lineHeight: '2', fontFamily: 'serif', color: '#555555', maxWidth: '400px', margin: '0 auto', overflow: 'hidden', flex: 1, pointerEvents: 'none' }}>
                  {story}
              </div>

              <p style={{ marginTop: 'auto', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c19a6b', borderTop: '1px solid #c19a6b', paddingTop: '24px', width: '100%', pointerEvents: 'none', margin: 'auto 0 0 0', flexShrink: 0 }}>
                  Recorded in {location}
              </p>
          </div>
      </Wrapper>
    );
  }

  if (layoutIndex === 13) {
    return (
      <Wrapper style={{ backgroundColor: '#f0f0f0', padding: 0, color: '#1d3557', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', height: '377px', flexShrink: 0 }}>
              <div style={{ width: '66.666%', backgroundColor: '#e63946', padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: '#ffffff' }}>
                  <h1 style={{ fontSize: '60px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.05em', lineHeight: '1.2', margin: 0, paddingBottom: '8px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{title}</h1>
                  <p style={{ marginTop: '16px', fontSize: '14px', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '16px 0 0 0' }}>{location}</p>
              </div>
              <div style={{ width: '33.333%', backgroundColor: '#ffb703', padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ backgroundColor: '#1d3557', borderRadius: '50%', width: '96px', height: '96px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                      {renderIcon(40)}
                  </div>
              </div>
          </div>
          <div style={{ display: 'flex', height: '754px', flex: 1 }}>
              <div style={{ width: '50%', padding: '48px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ backgroundColor: '#1d3557', color: '#ffffff', display: 'inline-block', padding: '8px 16px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '32px', alignSelf: 'flex-start', flexShrink: 0 }}>
                      {dateStr}
                  </div>
                  <div style={{ fontSize: '14px', lineHeight: '2', fontWeight: '500', textAlign: 'justify', overflow: 'hidden', flex: 1 }}>
                      {story}
                  </div>
              </div>
              <div style={{ width: '50%', backgroundColor: '#8ecae6', padding: '32px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <SafeImage config={coverConfig} slotId="cover" imgStyle={{ mixBlendMode: 'multiply' }} {...sharedImgProps} />
              </div>
          </div>
      </Wrapper>
    );
  }

  if (layoutIndex === 14) {
    return (
      <Wrapper style={{ backgroundColor: '#e9efe7', padding: '64px', color: '#2c4c3b' }}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', height: '400px', border: '8px solid #ffffff', boxShadow: '0 20px 40px rgba(44,76,59,0.1)', marginBottom: '40px', backgroundColor: '#dce5da', borderTopLeftRadius: '200px', borderTopRightRadius: '200px', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '8px', flexShrink: 0 }}>
                  <SafeImage config={coverConfig} slotId="cover" style={{ borderTopLeftRadius: '192px', borderTopRightRadius: '192px' }} imgStyle={{ borderTopLeftRadius: '192px', borderTopRightRadius: '192px' }} {...sharedImgProps} />
              </div>
              <h1 style={{ fontSize: '48px', fontFamily: 'serif', textAlign: 'center', marginBottom: '24px', paddingBottom: '8px', overflow: 'hidden', wordBreak: 'break-word', width: '100%', margin: '0 0 24px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', flexShrink: 0 }}>{title}</h1>
              <div style={{ display: 'flex', gap: '32px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#5a7d6a', marginBottom: '40px', borderTop: '1px solid #5a7d6a', borderBottom: '1px solid #5a7d6a', padding: '16px 0', margin: '0 0 40px 0', justifyContent: 'center', width: '100%', flexShrink: 0 }}>
                  <span>{location}</span>
                  <span>{dateStr}</span>
              </div>
              <div style={{ textAlign: 'center', fontSize: '14px', lineHeight: '2.2', fontFamily: 'serif', color: '#3e5f4d', padding: '0 48px', overflow: 'hidden', flex: 1 }}>
                  {story}
              </div>
          </div>
      </Wrapper>
    );
  }

  if (layoutIndex === 15) {
    return (
      <Wrapper style={{ backgroundColor: '#fce4ec', padding: '48px', color: '#880e4f' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '48px', height: '100%', padding: '48px', boxShadow: '0 10px 30px rgba(136,14,79,0.1)', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', overflow: 'hidden', flexShrink: 0 }}>
                  <h1 style={{ fontSize: '48px', fontWeight: 'bold', letterSpacing: '-0.025em', color: '#c2185b', paddingBottom: '8px', overflow: 'hidden', wordBreak: 'break-word', maxWidth: '70%', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{title}</h1>
                  <div style={{ backgroundColor: '#f8bbd0', color: '#880e4f', padding: '12px 24px', borderRadius: '9999px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {dateStr}
                  </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', height: '192px', flexShrink: 0 }}>
                  {slotConfigs.slice(0, 3).map((cfg, i) => (
                      <div key={i} style={{ flex: 1, height: '100%', borderRadius: '24px', backgroundColor: '#fef1f5', padding: '8px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                          <SafeImage config={cfg} slotId={i} style={{ borderRadius: '16px' }} imgStyle={{ borderRadius: '16px' }} {...sharedImgProps} />
                      </div>
                  ))}
              </div>
              <div style={{ backgroundColor: '#fce4ec', borderRadius: '24px', padding: '32px', flex: 1, overflow: 'hidden' }}>
                  <p style={{ fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px 0' }}><MapPin size={16}/> {location}</p>
                  <p style={{ fontSize: '14px', lineHeight: '2', color: '#880e4f', margin: 0 }}>{story}</p>
              </div>
          </div>
      </Wrapper>
    );
  }

  if (layoutIndex === 16) {
    return (
      <Wrapper style={{ backgroundColor: '#f5f5f5', padding: '64px', color: '#000000' }}>
          <div style={{ border: '4px solid #0a2342', height: '100%', padding: '40px', backgroundColor: '#ffffff', position: 'relative', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'absolute', top: '32px', right: '32px', width: '128px', height: '128px', borderRadius: '50%', border: '4px solid #c1121f', color: '#c1121f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: 'rotate(12deg)', opacity: 0.8, pointerEvents: 'none' }}>
                  <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>ARRIVED</span>
                  <span style={{ fontSize: '18px', fontWeight: '900' }}>{dateStr.split('-')[0] || dateStr}</span>
                  <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{mode}</span>
              </div>
              <h1 style={{ fontSize: '60px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#0a2342', marginBottom: '64px', paddingBottom: '8px', maxWidth: '65%', overflow: 'hidden', wordBreak: 'break-word', margin: '0 0 64px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', flexShrink: 0 }}>{title}</h1>
              
              <div style={{ display: 'flex', gap: '48px', flex: 1, overflow: 'hidden' }}>
                  <div style={{ width: '33.3%', display: 'flex', flexDirection: 'column', gap: '32px', height: '100%' }}>
                      {slotConfigs.slice(0, 2).map((cfg, i) => (
                          <div key={i} style={{ flex: 1, width: '100%', minHeight: 0, backgroundColor: '#f0f0f0', padding: '16px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                              <SafeImage config={cfg} slotId={i} {...sharedImgProps} />
                          </div>
                      ))}
                  </div>
                  <div style={{ width: '66.6%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden' }}>
                      <div style={{ borderBottom: '2px dashed #0a2342', paddingBottom: '8px', marginBottom: '24px', flexShrink: 0 }}>
                          <p style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666666', margin: 0 }}>Official Entry: <span style={{ color: '#0a2342' }}>{location}</span></p>
                      </div>
                      <div style={{ fontSize: '15px', lineHeight: '2', fontFamily: 'monospace', color: '#333333', textAlign: 'justify', overflow: 'hidden', flex: 1 }}>
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
          <div style={{ width: '100%', display: 'flex', height: '800px', border: '2px solid #2b2b2b', backgroundColor: '#ffffff', boxShadow: '20px 20px 0px rgba(43,43,43,1)' }}>
              <div style={{ width: '75%', padding: '48px', borderRight: '2px dashed #2b2b2b', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexShrink: 0 }}>
                          <h1 style={{ fontSize: '48px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.05em', paddingBottom: '8px', overflow: 'hidden', wordBreak: 'break-word', maxWidth: '80%', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{title}</h1>
                          {renderIcon(48)}
                      </div>
                      <div style={{ fontSize: '13px', lineHeight: '2', fontWeight: '500', textAlign: 'justify', overflow: 'hidden', flex: 1, marginBottom: '32px' }}>
                          {story}
                      </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #2b2b2b', paddingTop: '24px', flexShrink: 0 }}>
                      <div>
                          <p style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', color: '#888888', margin: 0 }}>DESTINATION</p>
                          <p style={{ fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', overflow: 'hidden', wordBreak: 'break-word', margin: 0 }}>{location}</p>
                      </div>
                      <div>
                          <p style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', color: '#888888', margin: 0 }}>DATE</p>
                          <p style={{ fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', overflow: 'hidden', wordBreak: 'break-word', margin: 0 }}>{dateStr}</p>
                      </div>
                      <div>
                          <p style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', color: '#888888', margin: 0 }}>CLASS</p>
                          <p style={{ fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', overflow: 'hidden', wordBreak: 'break-word', margin: 0 }}>{mode}</p>
                      </div>
                  </div>
              </div>
              <div style={{ width: '25%', padding: '24px', backgroundColor: '#f4f4f4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: '30px', fontWeight: '900', transform: 'rotate(-90deg)', transformOrigin: 'center', whiteSpace: 'nowrap', marginTop: '80px', color: '#cccccc', margin: '80px 0 0 0' }}>ADMIT ONE</p>
                  <div style={{ width: '96px', height: '96px', borderRadius: '50%', border: '4px solid #ffffff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff', padding: '4px', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                      <SafeImage config={coverConfig} slotId="cover" style={{ borderRadius: '50%' }} imgStyle={{ borderRadius: '50%' }} {...sharedImgProps} />
                  </div>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', height: '48px', flexShrink: 0 }}>
                      <div style={{ width: '4px', backgroundColor: '#2b2b2b', height: '100%' }}></div>
                      <div style={{ width: '8px', backgroundColor: '#2b2b2b', height: '100%' }}></div>
                      <div style={{ width: '4px', backgroundColor: '#2b2b2b', height: '100%' }}></div>
                      <div style={{ width: '12px', backgroundColor: '#2b2b2b', height: '100%' }}></div>
                      <div style={{ width: '4px', backgroundColor: '#2b2b2b', height: '100%' }}></div>
                      <div style={{ width: '8px', backgroundColor: '#2b2b2b', height: '100%' }}></div>
                  </div>
              </div>
          </div>
      </Wrapper>
    );
  }

  if (layoutIndex === 18) {
    return (
      <Wrapper style={{ backgroundColor: '#fefefe', padding: '80px', color: '#000000', fontFamily: 'monospace' }}>
          <div style={{ maxWidth: '576px', margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ fontSize: '12px', marginBottom: '32px', color: '#999999', margin: '0 0 32px 0', flexShrink: 0 }}>~/travels/{location.toLowerCase().replace(/\s+/g, '-')}.txt</p>
              <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '48px', paddingBottom: '8px', textDecoration: 'underline', textDecorationThickness: '4px', textUnderlineOffset: '8px', overflow: 'hidden', wordBreak: 'break-word', margin: '0 0 48px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', flexShrink: 0 }}>{title}</h1>
              
              <div style={{ fontSize: '14px', lineHeight: '2.5', color: '#333333', marginBottom: '64px', overflow: 'hidden', flex: 1 }}>
                  {story}
              </div>

              <div style={{ display: 'flex', gap: '32px', marginBottom: '48px', height: '192px', flexShrink: 0 }}>
                  {slotConfigs.slice(0, 2).map((cfg, i) => (
                      <div key={i} style={{ flex: 1, height: '100%', backgroundColor: '#eeeeee', padding: '8px', border: '1px solid #dddddd', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                          <SafeImage config={cfg} slotId={i} imgStyle={{ filter: 'grayscale(100%)', WebkitFilter: 'grayscale(100%)' }} {...sharedImgProps} />
                      </div>
                  ))}
              </div>

              <p style={{ fontSize: '12px', color: '#999999', borderTop: '1px solid #eeeeee', paddingTop: '16px', margin: 0, flexShrink: 0 }}>Logged on: {dateStr} via {mode}</p>
          </div>
      </Wrapper>
    );
  }

  if (layoutIndex === 19) {
    return (
      <Wrapper style={{ backgroundColor: '#000000', color: '#ffffff' }}>
          <div style={{ position: 'absolute', inset: 0, width: '100%', height: '1131px', display: 'flex', flexDirection: 'column', backgroundColor: '#111111' }}>
              <SafeImage config={coverConfig} slotId="cover" imgStyle={{ opacity: 0.6 }} {...sharedImgProps} />
          </div>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to top, #000000, rgba(0,0,0,0.5), rgba(0,0,0,0.1))' }} />
          
          <div style={{ position: 'absolute', bottom: '64px', left: 0, width: '100%', padding: '0 64px', textAlign: 'center', pointerEvents: 'none', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
              <h1 style={{ fontSize: '72px', fontFamily: 'serif', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '32px', paddingBottom: '16px', overflow: 'hidden', wordBreak: 'break-word', lineHeight: '1.1', textShadow: '0 10px 20px rgba(0,0,0,0.8)', margin: '0 0 32px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', flexShrink: 0 }}>{title}</h1>
              <p style={{ fontSize: '14px', fontWeight: '300', letterSpacing: '0.5em', color: '#cccccc', marginBottom: '32px', textTransform: 'uppercase', margin: '0 0 32px 0', flexShrink: 0 }}>A Journey to {location}</p>
              
              <div style={{ fontSize: '12px', fontFamily: 'monospace', lineHeight: '1.8', margin: '0 auto 32px auto', maxWidth: '672px', overflow: 'hidden', height: '100px', color: 'rgba(255,255,255,0.8)', flexShrink: 0 }}>
                  {story}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', letterSpacing: '0.1em', color: '#aaaaaa', borderTop: '1px solid #333333', paddingTop: '24px', textTransform: 'uppercase', flexShrink: 0 }}>
                  <span style={{ width: '40%', textAlign: 'right', paddingRight: '16px' }}>Date: {dateStr}</span>
                  <span style={{ width: '20%', textAlign: 'center' }}>•</span>
                  <span style={{ width: '40%', textAlign: 'left', paddingLeft: '16px' }}>Transport: {mode}</span>
              </div>
          </div>
      </Wrapper>
    );
  }

  return null;
};

export default PrintableView;