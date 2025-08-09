
'use client'
import { useEffect, useState } from 'react'

export default function MapmyIndiaMap() {
  const [geoAllowed, setGeoAllowed] = useState(true)

  useEffect(() => {
    // Load MapmyIndia SDK
    const script = document.createElement('script')
    script.src = 'https://apis.mappls.com/advancedmaps/v1/12ff7dbc2316b483c24ce71bc7068a56/map_load?v=1.5'
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      // Ask for geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude
            const lng = position.coords.longitude

            // Initialize map with user's location
            const map = new window['MapmyIndia'].Map('map', {
              center: [lat, lng],
              zoom: 14,
            })

            new window['MapmyIndia'].Marker({
              map,
              position: { lat, lng },
              title: 'You are here',
            })
          },
          (error) => {
            // Permission denied or error
            setGeoAllowed(false)
          }
        )
      } else {
        setGeoAllowed(false)
      }
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <>
      {!geoAllowed && (
        <div style={{ padding: '1rem', color: 'red', textAlign: 'center' }}>
          🚫 Sorry, we can't access your location. Please enable location services to view the map.
        </div>
      )}

      <div
        id="map"
        style={{
          height: '500px',
          width: '100%',
          opacity: geoAllowed ? 1 : 0.3,
          filter: geoAllowed ? 'none' : 'blur(2px)',
          pointerEvents: geoAllowed ? 'auto' : 'none',
        }}
      />
    </>
  )
}

