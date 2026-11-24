import { useEffect, useMemo, useRef, useState } from 'react'
import 'pannellum'
import 'pannellum/build/pannellum.css'
import { destinations, panoScenes, questions, sceneSpots, scenes, storyScenes, visitorInfo, type Pano, type Photo, type Scene, type Spot } from './data'

type Tab = 'home' | 'map' | 'tour' | 'quiz' | 'progress'
type Progress = { explored: string[]; tourFinished: boolean; quizHistory: { score: number; date: string }[] }

const initialProgress: Progress = { explored: [], tourFinished: false, quizHistory: [] }

function Icon({ name, size = 21 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z"/><path d="M9 3v15M15 6v15"/></>,
    compass: <><circle cx="12" cy="12" r="9"/><path d="m15.4 8.6-2 4.8-4.8 2 2-4.8Z"/></>,
    quiz: <><path d="M9 4h6M9 8h6M8 3H5v3h3ZM8 11H5v3h3ZM8 19H5v-3h3ZM11 12h6M11 17h6"/></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,
    arrow: <path d="m15 18-6-6 6-6"/>,
    volume: <><path d="M11 5 6 9H3v6h3l5 4Z"/><path d="M15 9a5 5 0 0 1 0 6M18 6a9 9 0 0 1 0 12"/></>,
    mute: <><path d="M11 5 6 9H3v6h3l5 4Z"/><path d="m16 10 5 5m0-5-5 5"/></>,
    rotate: <><path d="M20 7h-5V2"/><path d="M20 7a9 9 0 1 0 1 8"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></>,
    lock: <><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    reset: <><path d="M4 7h5V2"/><path d="M4 7a9 9 0 1 1-1 8"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    minus: <path d="M5 12h14"/>,
    expand: <><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/></>,
    collapse: <><path d="M3 8h5V3M21 8h-5V3M3 16h5v5M21 16h-5v5"/></>,
    external: <><path d="M14 4h6v6"/><path d="m20 4-9 9"/><path d="M18 13v6H5V6h6"/></>,
    book: <><path d="M4 5a2 2 0 0 1 2-2h5v17H6a2 2 0 0 0-2 2Z"/><path d="M20 5a2 2 0 0 0-2-2h-5v17h5a2 2 0 0 1 2 2Z"/></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function Ring({ value, size = 72 }: { value: number; size?: number }) {
  return <div className="ring" style={{ width: size, height: size, background: `conic-gradient(#C9A227 ${value * 3.6}deg, #eadfca 0)` }}>
    <div><strong>{value}%</strong><span>complete</span></div>
  </div>
}

function Header({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return <header className="page-header"><div><p>{eyebrow}</p><h1>{title}</h1></div>{action}</header>
}

function Home({ setTab, progress, notify }: { setTab: (tab: Tab) => void; progress: Progress; notify: (message: string) => void }) {
  const completion = Math.round((progress.explored.filter(id => panoScenes.some(s => s.id === id)).length / panoScenes.length) * 100)
  return <main className="page home-page">
    <div className="home-top"><div className="brand-mark">RV</div><div><p className="kicker">Cultural Mapping • Phase 2</p><h1>Rizal Virtual Tour</h1></div><button className="avatar" aria-label="Student profile">JR</button></div>
    <section className="hero-card">
      <img src="/assets/tour/exterior-front-2023.jpg" alt="Green facade of the Rizal Shrine in Calamba" />
      <div className="hero-shade" />
      <div className="hero-copy"><span className="location-pill">Calamba, Laguna</span><h2>Walk through the<br />home that shaped a hero.</h2><p>Explore the gardens, sala, and dining room in real 360°—anytime, anywhere.</p><button className="primary light" onClick={() => setTab('tour')}><Icon name="compass" /> Start 360° Tour</button></div>
    </section>
    <section className="intro-row"><div><p className="section-label">Your journey</p><h2>Explore Rizal Shrine</h2><p className="muted">The birthplace of José Rizal.</p></div><Ring value={completion} /></section>
    <div className="destination-list">
      {destinations.map((d, i) => <button key={d.province} className={`destination-card ${d.status}`} onClick={() => d.status === 'unlocked' ? setTab('map') : notify(`${d.place} is coming soon in the next phase.`)}>
        <div className={`destination-thumb thumb-${i}`}>{i === 0 ? <img src="/assets/tour/exterior-front-2023.jpg" alt="" /> : <span>{d.code}</span>}</div>
        <div className="destination-copy"><span>{d.province}</span><h3>{d.place}</h3><p>{i === 0 ? `${progress.explored.filter(id => panoScenes.some(s => s.id === id)).length} of ${panoScenes.length} 360° stops explored` : 'More cultural stories are on the way'}</p></div>
        <div className="status-icon">{i === 0 ? <Icon name="arrow" /> : <Icon name="lock" size={17} />}</div>
      </button>)}
    </div>
  </main>
}

function CulturalMap({ setTab }: { setTab: (tab: Tab) => void }) {
  return <main className="page map-page">
    <Header eyebrow="Find your way" title="Shrine Map" action={<span className="phase-badge">Calamba</span>} />
    <p className="map-intro">Real map of the Rizal Shrine in Poblacion, Calamba City. Drag or zoom to explore the area.</p>
    <section className="map-canvas real-map" aria-label="Real map of the Rizal Shrine in Calamba, Laguna">
      <iframe className="map-frame" src={visitorInfo.mapUrl} title="Map showing the Rizal Shrine in Calamba, Laguna" loading="lazy" />
      <div className="map-floating-label"><span className="location-pill gold">Exact location</span><strong>Rizal Shrine</strong><small>{visitorInfo.lat}° N, {visitorInfo.lng}° E</small></div>
    </section>
    <section className="map-detail">
      <img src="/assets/tour/exterior-front-2023.jpg" alt="Facade of the Rizal Shrine" />
      <div><span className="location-pill gold">Featured destination</span><h2>Rizal Shrine</h2><p className="map-place">Calamba City, Laguna</p><p>Step inside the reconstructed ancestral home where José Rizal spent his childhood.</p>
        <div className="button-row"><button className="primary" onClick={() => setTab('tour')}>Enter 360° Tour</button><button className="secondary" onClick={() => setTab('quiz')}>Take Quiz</button><a className="secondary" href={visitorInfo.directionsUrl} target="_blank" rel="noreferrer"><Icon name="external" size={16} /> Directions</a></div>
      </div>
    </section>
  </main>
}

function MiniMap({ current, onSelect, close }: { current: number; onSelect: (i: number) => void; close: () => void }) {
  return <div className="modal-backdrop" onClick={close}><section className="mini-map" onClick={e => e.stopPropagation()}>
    <div className="sheet-handle" /><div className="sheet-title"><div><p>Rizal Shrine</p><h2>360° stops</h2></div><button className="icon-button" onClick={close}><Icon name="close" /></button></div>
    <div className="floor-plan">{panoScenes.map((s, i) => <button className={i === current ? 'current' : ''} key={s.id} onClick={() => { onSelect(i); close() }}><span>{i + 1}</span>{s.shortTitle}</button>)}</div>
    <p className="floor-legend"><span /> You are here · drag inside each stop to look around</p>
  </section></div>
}

function PhotoViewer({ photos, compact = false }: { photos: Photo[]; compact?: boolean }) {
  const [active, setActive] = useState(0)
  const photo = photos[active]
  const shift = (step: number) => setActive((active + step + photos.length) % photos.length)
  return <div className={`photo-viewer ${compact ? 'compact' : ''}`}>
    <div className="photo-stage">
      <img src={photo.src} alt={photo.caption} />
      {photos.length > 1 && <>
        <button className="photo-arrow left" onClick={() => shift(-1)} aria-label="Previous photo"><Icon name="arrow" size={18} /></button>
        <button className="photo-arrow right" onClick={() => shift(1)} aria-label="Next photo"><Icon name="arrow" size={18} /></button>
        <span className="photo-count">{active + 1} / {photos.length}</span>
      </>}
    </div>
    <p className="photo-caption">{photo.caption}</p>
    <small className="photo-credit">{photo.credit}</small>
    {photos.length > 1 && <div className="photo-thumbs">{photos.map((p, i) => <button key={`${p.src}-${i}`} className={i === active ? 'active' : ''} onClick={() => setActive(i)} aria-label={`Show photo ${i + 1}`}><img src={p.src} alt="" /></button>)}</div>}
  </div>
}

function InfoSheet({ scene, spot, close }: { scene: Scene; spot?: Spot; close: () => void }) {
  const matched = scene.photos.find(p => p.src === spot?.photo)
  const photos: Photo[] = spot?.photo ? [matched ?? { src: spot.photo, caption: spot.title ?? scene.title, credit: 'Wikimedia Commons' }] : scene.photos
  return <div className="modal-backdrop dark" onClick={close}><section className="info-sheet" onClick={e => e.stopPropagation()}>
    <div className="sheet-handle" /><button className="sheet-close" onClick={close}><Icon name="close" /></button>
    <PhotoViewer photos={photos} compact />
    <div className="sheet-content"><span className="location-pill gold">{spot ? 'Zoomed-in detail' : 'Cultural note'}</span><h2>{spot?.title ?? scene.title}</h2><p>{spot?.body ?? scene.description}</p>
      <div className="detail-list"><strong>What you’ll see here</strong><ul>{scene.details.map(d => <li key={d}>{d}</li>)}</ul></div>
      <div className="significance"><Icon name="info" /><div><strong>Why it matters</strong><p>{spot?.body ?? scene.significance}</p></div></div>
      {scene.pano && <small className="photo-credit">360° panorama: {scene.pano.credit} · captured {scene.pano.captured}</small>}
      <button className="primary full" onClick={close}>Continue exploring</button></div>
  </section></div>
}

function GallerySheet({ scene, close }: { scene: Scene; close: () => void }) {
  return <div className="modal-backdrop dark" onClick={close}><section className="info-sheet gallery-sheet" onClick={e => e.stopPropagation()}>
    <div className="sheet-handle" /><button className="sheet-close" onClick={close}><Icon name="close" /></button>
    <div className="sheet-content"><span className="location-pill gold">Photo gallery</span><h2>{scene.title}</h2><p>{scene.photos.length} photos from this stop. Tap a thumbnail or use the arrows to look around.</p></div>
    <PhotoViewer photos={scene.photos} />
    <div className="sheet-content">
      {scene.pano && <a className="secondary full source-link" href={scene.pano.sourceUrl} target="_blank" rel="noreferrer"><Icon name="external" size={17} /> Open original 360°</a>}
      <button className="primary full" onClick={close}>Back to tour</button>
    </div>
  </section></div>
}

function ChaptersSheet({ close, onSelect }: { close: () => void; onSelect: (scene: Scene) => void }) {
  return <div className="modal-backdrop dark" onClick={close}><section className="info-sheet chapters-sheet" onClick={e => e.stopPropagation()}>
    <div className="sheet-handle" /><button className="sheet-close" onClick={close}><Icon name="close" /></button>
    <div className="sheet-content"><span className="location-pill gold">More of the shrine</span><h2>Stories & photo stops</h2><p>These areas do not have public 360° panoramas, so they are presented as guided photo stories with notes and credits.</p></div>
    <div className="chapter-grid">{storyScenes.map(scene => <button key={scene.id} onClick={() => onSelect(scene)}>
      <img src={scene.coverUrl} alt="" />
      <div><small>{scene.shortTitle}</small><strong>{scene.title}</strong><span>{scene.photos.length} photos · {scene.details.length} notes</span></div>
    </button>)}</div>
    <div className="sheet-content"><button className="primary full" onClick={close}>Back to 360° tour</button></div>
  </section></div>
}

function VisitorSheet({ close }: { close: () => void }) {
  return <div className="modal-backdrop dark" onClick={close}><section className="info-sheet" onClick={e => e.stopPropagation()}>
    <div className="sheet-handle" /><button className="sheet-close" onClick={close}><Icon name="close" /></button>
    <div className="sheet-content"><span className="location-pill gold">Plan your visit</span><h2>Museo ni José Rizal Calamba</h2>
      <div className="visit-list">
        <div><strong>Address</strong><p>{visitorInfo.address}</p></div>
        <div><strong>Open</strong><p>{visitorInfo.hours}</p></div>
        <div><strong>Contact</strong><p>{visitorInfo.contact}</p></div>
      </div>
      <div className="significance"><Icon name="info" /><div><strong>Good to know</strong><p>{visitorInfo.note}</p></div></div>
      <small className="photo-credit">Source: {visitorInfo.source}</small>
      <button className="primary full" onClick={close}>Back to tour</button>
    </div>
  </section></div>
}

function PanoramaViewer({ pano, title, preview }: { pano: Pano; title: string; preview: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    setFailed(false)
    const container = containerRef.current
    if (!container) return
    const viewer = window.pannellum.viewer(container, {
      type: 'cubemap',
      cubeMap: pano.faces,
      preview,
      autoLoad: true,
      showControls: false,
      showZoomCtrl: false,
      showFullscreenCtrl: false,
      mouseZoom: true,
      draggable: true,
      hfov: 100,
      minHfov: 45,
      maxHfov: 110,
      escapeHTML: true,
      strings: { loadingLabel: 'Loading 360° view...', genericWebGLError: 'This device cannot display the 360° view.' },
    })
    viewer.on('error', () => setFailed(true))
    viewer.on('load', () => setFailed(false))
    return () => { viewer.off(); viewer.destroy() }
  }, [pano, preview, retry])

  return <div className="pano-view" role="application" aria-label={`Interactive 360° view of ${title}. Drag to look around.`}>
    <div className="pano-canvas" ref={containerRef} />
    {failed && <div className="pano-error"><strong>360° view failed to load.</strong><button className="secondary full" onClick={() => setRetry(value => value + 1)}>Retry 360°</button><a href={pano.sourceUrl} target="_blank" rel="noreferrer">Open original on 360Cities</a></div>}
  </div>
}

function Tour({ setTab, progress, updateProgress }: { setTab: (tab: Tab) => void; progress: Progress; updateProgress: (p: Progress) => void }) {
  const [index, setIndex] = useState(0)
  const [muted, setMuted] = useState(true)
  const [spot, setSpot] = useState<Spot | null>(null)
  const [miniMap, setMiniMap] = useState(false)
  const [gallery, setGallery] = useState(false)
  const [visitor, setVisitor] = useState(false)
  const [chapters, setChapters] = useState(false)
  const [chapterScene, setChapterScene] = useState<Scene | null>(null)
  const [fullScreen, setFullScreen] = useState(false)
  const tourRef = useRef<HTMLElement>(null)
  const scene = panoScenes[index]
  const pano = scene.pano!
  const spots = sceneSpots[scene.id] ?? []
  const moveSpots = spots.filter(s => s.kind === 'move')
  const infoSpots = spots.filter(s => s.kind === 'info')
  const exploredPano = panoScenes.filter(s => progress.explored.includes(s.id)).length

  const go = (next: number) => {
    setIndex((next + panoScenes.length) % panoScenes.length)
    setSpot(null)
    setGallery(false)
    setChapters(false)
  }
  const goTarget = (target: Spot) => {
    const next = panoScenes.findIndex(s => s.id === target.target)
    if (next >= 0) go(next)
  }
  const finish = () => { updateProgress({ ...progress, tourFinished: true, explored: panoScenes.map(s => s.id) }); setTab('quiz') }
  const toggleFull = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else if (tourRef.current) void tourRef.current.requestFullscreen().catch(() => setFullScreen(false))
  }

  useEffect(() => {
    if (!progress.explored.includes(scene.id)) updateProgress({ ...progress, explored: [...progress.explored, scene.id] })
  }, [scene.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (muted) return
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let last = 0
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1
      last = (last + 0.02 * white) / 1.02
      data[i] = last * 0.25
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 420
    const gain = ctx.createGain()
    gain.gain.value = 0.08
    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    source.start()
    return () => { source.stop(); void ctx.close() }
  }, [muted])

  useEffect(() => {
    const sync = () => setFullScreen(Boolean(document.fullscreenElement))
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSpot(null); setGallery(false); setMiniMap(false); setVisitor(false); setChapters(false); setChapterScene(null) }
    }
    document.addEventListener('fullscreenchange', sync)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('fullscreenchange', sync); document.removeEventListener('keydown', onKey) }
  }, [])

  return <main className="tour-screen" ref={tourRef}>
    <div className="panorama">
      <PanoramaViewer key={scene.id} pano={pano} title={scene.title} preview={scene.coverUrl} />
      <div className="tour-top">
        <button className="glass-button" onClick={() => setTab('home')} aria-label="Back to home"><Icon name="arrow" /></button>
        <div className="room-title"><span>360° walkthrough · stop {index + 1} of {panoScenes.length}</span><h1>{scene.title}</h1></div>
        <button className="glass-button" onClick={() => setMuted(!muted)} aria-label={muted ? 'Turn on ambient sound' : 'Mute ambient sound'}><Icon name={muted ? 'mute' : 'volume'} /></button>
      </div>
      <div className="tour-actions">
        <button className="glass-pill" onClick={() => setGallery(true)}><Icon name="info" size={17} /> Photos</button>
        <button className="glass-pill" onClick={() => setChapters(true)}><Icon name="book" size={17} /> Stories</button>
        <button className="glass-pill" onClick={() => setMiniMap(true)}><Icon name="map" size={17} /> Stops</button>
        <button className="glass-pill" onClick={() => setVisitor(true)}><Icon name="info" size={17} /> Visit info</button>
        <a className="glass-pill" href={pano.sourceUrl} target="_blank" rel="noreferrer"><Icon name="external" size={16} /> Source</a>
        <button className="glass-pill icon-only" onClick={toggleFull} aria-label={fullScreen ? 'Exit fullscreen' : 'Enter fullscreen'}><Icon name={fullScreen ? 'collapse' : 'expand'} size={17} /></button>
      </div>
      {moveSpots.map(s => <button key={s.id} className="pov-spot" style={{ left: `${s.x}%`, top: `${s.y}%` }} onClick={() => goTarget(s)} aria-label={`Move to ${s.label}`}>
        <span className="pov-arrow"><Icon name="arrow" size={19} /></span><small>{s.label}</small>
      </button>)}
      {infoSpots.map(s => <button key={s.id} className="info-hotspot spot-info" style={{ left: `${s.x}%`, top: `${s.y}%` }} onClick={() => setSpot(s)} aria-label={s.title ?? scene.hotspotLabel}>
        <span><Icon name="info" size={21} /></span><small>{s.label}</small>
      </button>)}
      <button className="nav-hotspot prev" onClick={() => go(index - 1)}><Icon name="arrow" /><span>{panoScenes[(index - 1 + panoScenes.length) % panoScenes.length].shortTitle}</span></button>
      <button className="nav-hotspot next" onClick={() => go(index + 1)}><span>{panoScenes[(index + 1) % panoScenes.length].shortTitle}</span><Icon name="arrow" /></button>
      <div className="drag-hint"><span>↔</span> Drag inside the 360° view · scroll to zoom</div>
      <div className="tour-bottom">
        <small className="pano-credit">360° by {pano.credit} · captured {pano.captured}</small>
        <div className="tour-progress"><div><strong>{exploredPano} of {panoScenes.length}</strong><span>360° stops explored</span></div><div className="dots">{panoScenes.map((s, i) => <button key={s.id} className={progress.explored.includes(s.id) ? `seen ${i === index ? 'current' : ''}` : ''} onClick={() => go(i)} aria-label={`Go to ${s.title}`} />)}</div></div>
        {exploredPano === panoScenes.length && <button className="finish-button" onClick={finish}>Finish Tour <Icon name="check" /></button>}
      </div>
    </div>
    {spot && <InfoSheet scene={scene} spot={spot} close={() => setSpot(null)} />}
    {gallery && <GallerySheet scene={scene} close={() => setGallery(false)} />}
    {miniMap && <MiniMap current={index} onSelect={go} close={() => setMiniMap(false)} />}
    {visitor && <VisitorSheet close={() => setVisitor(false)} />}
    {chapters && <ChaptersSheet close={() => setChapters(false)} onSelect={s => { setChapters(false); setChapterScene(s) }} />}
    {chapterScene && <InfoSheet scene={chapterScene} close={() => setChapterScene(null)} />}
  </main>
}

function Quiz({ setTab, progress, updateProgress }: { setTab: (tab: Tab) => void; progress: Progress; updateProgress: (p: Progress) => void }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const q = questions[current]
  const choose = (i: number) => { if (selected !== null) return; setSelected(i); if (i === q.answer) setScore(s => s + 1) }
  const next = () => {
    if (current === questions.length - 1) {
      updateProgress({ ...progress, quizHistory: [...progress.quizHistory, { score, date: new Date().toISOString() }] })
      setDone(true)
    } else { setCurrent(c => c + 1); setSelected(null) }
  }
  const restart = () => { setCurrent(0); setSelected(null); setScore(0); setDone(false) }
  if (done) {
    const pct = Math.round(score / questions.length * 100)
    const badge = score >= 9 ? 'Gold' : score >= 7 ? 'Silver' : 'Bronze'
    return <main className="page result-page"><div className={`badge-medal ${badge.toLowerCase()}`}><span>★</span><small>{badge}</small></div><p className="kicker">Tour quiz complete</p><h1>Mahusay!</h1><p className="result-message">{score >= 7 ? 'You know the Rizal Shrine well. Keep carrying our stories forward.' : 'A good start! Revisit the rooms and try again when you’re ready.'}</p><div className="score-card"><Ring value={pct} size={126} /><div><strong>{score}<span>/{questions.length}</span></strong><p>correct answers</p><small>Best: {Math.max(score, ...progress.quizHistory.map(h => h.score))}/{questions.length}</small></div></div><div className="result-actions"><button className="primary full" onClick={() => setTab('progress')}>View Progress</button><button className="secondary full" onClick={restart}>Retake Quiz</button><button className="text-button" onClick={() => setTab('tour')}>Back to Tour</button></div></main>
  }
  return <main className="page quiz-page">
    <div className="quiz-top"><button className="icon-button" onClick={() => setTab('home')}><Icon name="close" /></button><div><p>Rizal Shrine Quiz</p><strong>{current + 1} of {questions.length}</strong></div></div>
    <div className="quiz-progress"><span style={{ width: `${(current + 1) / questions.length * 100}%` }} /></div>
    <div className="quiz-label">Question {String(current + 1).padStart(2, '0')}</div><h1>{q.question}</h1>
    <div className="choices">{q.choices.map((c, i) => <button key={c} onClick={() => choose(i)} className={selected === null ? '' : i === q.answer ? 'correct' : i === selected ? 'wrong' : 'dim'}><span>{String.fromCharCode(65 + i)}</span>{c}{selected !== null && i === q.answer && <Icon name="check" />}{selected === i && i !== q.answer && <Icon name="close" />}</button>)}</div>
    {selected !== null && <div className={`feedback ${selected === q.answer ? 'right' : 'wrong'}`}><strong>{selected === q.answer ? 'Tama!' : 'Not quite.'}</strong><p>{q.explanation}</p></div>}
    <button className="primary full quiz-next" disabled={selected === null} onClick={next}>{current === questions.length - 1 ? 'See my results' : 'Next question'} <span>→</span></button>
  </main>
}

function ProgressPage({ setTab, progress, reset }: { setTab: (tab: Tab) => void; progress: Progress; reset: () => void }) {
  const [confirm, setConfirm] = useState(false)
  const panoExplored = progress.explored.filter(id => panoScenes.some(s => s.id === id)).length
  const overall = Math.round(((panoExplored / panoScenes.length) * 70) + (progress.quizHistory.length ? 30 : 0))
  const best = progress.quizHistory.length ? Math.max(...progress.quizHistory.map(h => h.score)) : 0
  const badge = best >= 9 ? 'Gold Heritage Scholar' : best >= 7 ? 'Silver Story Seeker' : best > 0 ? 'Bronze Explorer' : 'No badge yet'
  return <main className="page progress-page">
    <Header eyebrow="Your learning journey" title="My Progress" action={<button className="icon-button pale" onClick={() => setConfirm(true)} aria-label="Reset progress"><Icon name="reset" /></button>} />
    <section className="progress-hero"><Ring value={overall} size={118} /><div><span>Overall completion</span><h2>{overall === 100 ? 'Journey complete!' : 'Tuloy lang!'}</h2><p>{panoExplored} 360° stops explored • {progress.quizHistory.length} quiz attempt{progress.quizHistory.length === 1 ? '' : 's'}</p></div></section>
    <section className="stats-grid"><div><span>360° stops</span><strong>{panoExplored}<small>/{panoScenes.length}</small></strong></div><div><span>Best score</span><strong>{best}<small>/{questions.length}</small></strong></div><div><span>Destinations</span><strong>{progress.tourFinished ? 1 : 0}<small>/1</small></strong></div>
</section>
    <section><div className="section-heading"><h2>Destinations</h2><button onClick={() => setTab('map')}>View map</button></div><div className="progress-destination"><img src="/assets/tour/exterior-front-2023.jpg" alt="" /><div><span>Laguna</span><h3>Rizal Shrine</h3><div className="slim-progress"><i style={{ width: `${panoExplored / panoScenes.length * 100}%` }} /></div><p>{progress.tourFinished ? 'Completed' : panoExplored ? 'In progress' : 'Not started'} • {panoExplored}/{panoScenes.length} 360° stops</p></div><Icon name={progress.tourFinished ? 'check' : 'arrow'} /></div></section>
    <section><div className="section-heading"><h2>Earned badge</h2></div><div className="badge-card"><div className={`mini-medal ${best >= 9 ? 'gold' : best >= 7 ? 'silver' : 'bronze'}`}>★</div><div><h3>{badge}</h3><p>{best ? `Awarded for your ${best}/${questions.length} quiz score.` : 'Complete the quiz to earn your first badge.'}</p></div></div></section>
    <section><div className="section-heading"><h2>Quiz history</h2></div>{progress.quizHistory.length ? <div className="history-list">{[...progress.quizHistory].reverse().map((h, i) => <div key={i}><span>{new Date(h.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</span><strong>{h.score}/{questions.length}</strong></div>)}</div> : <div className="empty-state">Your quiz attempts will appear here.</div>}</section>
    {confirm && <div className="modal-backdrop"><div className="confirm-dialog"><div className="warning"><Icon name="reset" /></div><h2>Reset your journey?</h2><p>This will remove explored rooms, quiz scores, and badges from this device.</p><button className="danger full" onClick={() => { reset(); setConfirm(false) }}>Yes, reset progress</button><button className="text-button" onClick={() => setConfirm(false)}>Keep my progress</button></div></div>}
  </main>
}

function BottomNav({ active, setTab }: { active: Tab; setTab: (t: Tab) => void }) {
  const tabs: { id: Tab; label: string; icon: string }[] = [{ id: 'home', label: 'Home', icon: 'home' }, { id: 'map', label: 'Map', icon: 'map' }, { id: 'tour', label: 'Tour', icon: 'compass' }, { id: 'quiz', label: 'Quiz', icon: 'quiz' }, { id: 'progress', label: 'Progress', icon: 'chart' }]
  return <nav className="bottom-nav" aria-label="Main navigation">{tabs.map(t => <button key={t.id} className={active === t.id ? 'active' : ''} onClick={() => setTab(t.id)}><span className={t.id === 'tour' ? 'tour-nav-icon' : ''}><Icon name={t.icon} /></span><small>{t.label}</small></button>)}</nav>
}

function Onboarding({ close }: { close: () => void }) {
  return <div className="onboarding"><div className="onboarding-visual"><div className="hand">☝</div><span className="orbit orbit-1" /><span className="orbit orbit-2" /></div><p className="kicker">Welcome, explorer</p><h1>Your field trip<br />starts here.</h1><p>Drag inside the 360° view to look around. Tap glowing icons for stories, galleries, and the next stop.</p><div className="onboard-steps"><span className="active" /><span /><span /></div><button className="primary light full" onClick={close}>Got it, let’s explore <span>→</span></button></div>
}

export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const [progress, setProgress] = useState<Progress>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('rizal-tour-progress') || '') || initialProgress
      return { ...saved, explored: Array.isArray(saved.explored) ? saved.explored.filter((id: string) => scenes.some(s => s.id === id)) : [] }
    } catch { return initialProgress }
  })
  const [onboarding, setOnboarding] = useState(() => !localStorage.getItem('rizal-onboarded'))
  const [toast, setToast] = useState<string | null>(null)
  const updateProgress = (next: Progress) => { setProgress(next); localStorage.setItem('rizal-tour-progress', JSON.stringify(next)) }
  const closeOnboarding = () => { localStorage.setItem('rizal-onboarded', 'true'); setOnboarding(false) }
  const notify = (message: string) => setToast(message)
  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(null), 2600)
    return () => window.clearTimeout(id)
  }, [toast])
  const screen = useMemo(() => {
    if (tab === 'home') return <Home setTab={setTab} progress={progress} notify={notify} />
    if (tab === 'map') return <CulturalMap setTab={setTab} />
    if (tab === 'tour') return <Tour setTab={setTab} progress={progress} updateProgress={updateProgress} />
    if (tab === 'quiz') return <Quiz setTab={setTab} progress={progress} updateProgress={updateProgress} />
    return <ProgressPage setTab={setTab} progress={progress} reset={() => updateProgress(initialProgress)} />
  }, [tab, progress])
  return <div className="app-shell">{screen}{tab !== 'tour' && <BottomNav active={tab} setTab={setTab} />}{onboarding && <Onboarding close={closeOnboarding} />}{toast && <div className="toast" role="status">{toast}</div>}</div>
}
