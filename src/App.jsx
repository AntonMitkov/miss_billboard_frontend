import { useState, useEffect, useRef, useCallback } from 'react'
import { QRCodeSVG } from 'qrcode.react'

const API = 'https://miss-billboard-backend-production.up.railway.app/'
const INTERVAL = 15000

export default function App() {
  const [contestants, setContestants] = useState([])
  const [current, setCurrent] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    fetch(API)
      .then(r => r.json())
      .then(data => {
        setContestants(Object.entries(data).map(([name, info]) => ({ name, ...info })))
        setLoaded(true)
      })
      .catch(console.error)
  }, [])

  const goTo = useCallback((index) => {
    setCurrent(index)
    setTimerKey(k => k + 1)
  }, [])

  useEffect(() => {
    if (!loaded || contestants.length === 0) return
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setCurrent(c => (c + 1) % contestants.length)
      setTimerKey(k => k + 1)
    }, INTERVAL)
    return () => clearTimeout(timerRef.current)
  }, [timerKey, loaded, contestants.length])

  const qrSize = Math.min(Math.floor(window.innerHeight * 0.1), 80)
  const c = contestants[current]

  return (
    <>
      {/* Loading screen */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'var(--dark)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 200,
        opacity: loaded ? 0 : 1,
        pointerEvents: loaded ? 'none' : 'auto',
        transition: 'opacity 0.8s ease',
      }}>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          color: 'var(--gold)',
          fontSize: '1.5rem',
          letterSpacing: '0.3em',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}>
          Мисс Лицей 2026
        </span>
      </div>

      {/* Corner ornaments */}
      {[
        { top: 12, left: 12, borderWidth: '1px 0 0 1px' },
        { top: 12, right: 12, borderWidth: '1px 1px 0 0' },
        { bottom: 12, left: 12, borderWidth: '0 0 1px 1px' },
        { bottom: 12, right: 12, borderWidth: '0 1px 1px 0' },
      ].map((pos, i) => (
        <div key={i} style={{
          position: 'fixed',
          width: 40, height: 40,
          borderColor: 'rgba(201,168,76,0.25)',
          borderStyle: 'solid',
          borderWidth: pos.borderWidth,
          zIndex: 5,
          ...pos,
        }} />
      ))}

      {/* Billboard */}
      <div style={{
        width: '100vw', height: '100vh',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        position: 'relative',
        background: 'var(--dark)',
      }}>

        {/* HEADER */}
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '18px 40px 10px',
          position: 'relative', zIndex: 10,
        }}>
          <div style={{
            flex: 1, height: 1,
            background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
          }} />
          <div style={{ padding: '0 28px', textAlign: 'center' }}>
            
            <span style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              fontSize: 'clamp(1.4rem, 3.5vw, 2.8rem)',
              color: 'var(--cream)',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              display: 'block', lineHeight: 1.1,
            }}>
              Мисс Лицей
            </span>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: 'clamp(0.85rem, 1.8vw, 1.4rem)',
              color: 'var(--gold)',
              letterSpacing: '0.5em',
              display: 'block', marginTop: 2,
            }}>
              2 0 2 6
            </span>
          </div>
          <div style={{
            flex: 1, height: 1,
            background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
          }} />
        </header>

        {/* STAGE */}
        <main style={{
          position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
          padding: '10px 20px',
        }}>
          {/* Glow */}
          <div style={{
            position: 'absolute', inset: '-20%',
            background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Slides */}
          <div style={{ position: 'relative', height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {contestants.map((item, i) => (
              <div key={item.name} style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: i === current ? 1 : 0,
                transition: 'opacity 0.9s cubic-bezier(0.4,0,0.2,1)',
                pointerEvents: i === current ? 'auto' : 'none',
              }}>
                <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Frame */}
                  <div style={{
                    position: 'absolute', inset: -6,
                    border: '1px solid rgba(201,168,76,0.3)',
                    pointerEvents: 'none',
                  }}>
                    {['left', 'right'].map(side => (
                      <span key={side} style={{
                        position: 'absolute',
                        color: 'var(--gold)', fontSize: 10,
                        top: -7, [side]: -5,
                      }}>◆</span>
                    ))}
                  </div>

                  <img
                    src={item.src}
                    alt={item.name}
                    style={{
                      maxHeight: '100%', maxWidth: '100%',
                      objectFit: 'contain', display: 'block',
                      filter: 'brightness(0.92) contrast(1.05)',
                    }}
                  />

                  {/* Name tag */}
                  <div style={{
                    position: 'absolute', bottom: -1,
                    left: '50%', transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, rgba(10,6,8,0.95), rgba(19,13,16,0.9))',
                    borderTop: '1px solid var(--gold)',
                    padding: '8px 28px 10px',
                    textAlign: 'center', whiteSpace: 'nowrap', minWidth: 200,
                  }}>
                    <span style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontStyle: 'italic',
                      fontSize: 'clamp(1rem, 2.2vw, 1.7rem)',
                      color: 'var(--cream)',
                      letterSpacing: '0.05em',
                    }}>
                      {item.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Timer bar */}
          <div
            key={timerKey}
            style={{
              position: 'absolute', bottom: 0, left: 0,
              height: 2,
              background: 'linear-gradient(90deg, var(--gold), var(--gold-light))',
              boxShadow: '0 0 6px rgba(201,168,76,0.5)',
              transformOrigin: 'left',
              animation: `timerGrow ${INTERVAL}ms linear forwards`,
            }}
          />
        </main>

        {/* FOOTER */}
        <footer style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 40px 16px',
          position: 'relative', zIndex: 10,
          gap: 20,
        }}>
          {/* Dots */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flex: 1 }}>
            {contestants.map((_, i) => (
              <div
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: i === current ? 24 : 6,
                  height: 6,
                  borderRadius: i === current ? 3 : '50%',
                  background: i === current ? 'var(--gold)' : 'rgba(201,168,76,0.25)',
                  boxShadow: i === current ? '0 0 8px rgba(201,168,76,0.6)' : 'none',
                  transition: 'all 0.4s ease',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>

          {/* QR */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{
                fontSize: 'clamp(0.55rem, 1vw, 0.75rem)',
                color: 'rgba(245,239,230,0.4)',
                textTransform: 'uppercase', letterSpacing: '0.2em',
                display: 'block',
              }}>сканируй</span>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: 'clamp(0.9rem, 1.8vw, 1.35rem)',
                color: 'var(--gold-light)',
                display: 'block', lineHeight: 1,
              }}>Читать статью</span>
            </div>
            <div style={{
              background: 'white', padding: 5,
              border: '1px solid rgba(201,168,76,0.4)',
            }}>
              {c && (
                <QRCodeSVG
                  value={c.link || 'https://t.me/miss_lyceum_lbsu_bot?startapp'}
                  size={qrSize}
                  bgColor="#ffffff"
                  fgColor="#0a0608"
                  level="M"
                />
              )}
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
