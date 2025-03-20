"use client"
import { useState } from "react"
import { Press_Start_2P } from "next/font/google"
import { motion, AnimatePresence } from "framer-motion"
import absurdnav from "@/assets/absurdnav.gif"
import absurdGif from "@/assets/absurd.gif"

const pixelFont = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin']
})

// Export this constant so other components can use it
export const NAVBAR_HEIGHT = '3.5rem' // 56px in rem units

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <nav 
        className="fixed top-0 w-full z-20" 
        style={{ 
          height: NAVBAR_HEIGHT,
          backgroundColor: '#050d1a'  // Match the number grid's navy color
        }}
      >
        <div className="h-full px-4 flex items-center justify-between relative z-20">
          {/* Left-aligned title with GIF */}
          <div className="flex items-center gap-2">
          <div className="w-8 h-8">
              <img 
                src={absurdnav.src} 
                alt="99absurd" 
                className="w-full h-auto"
                style={{ 
                  pointerEvents: 'none',
                  animation: 'continuous-animation 0.01s infinite',
                }}
              />
            </div>
            <h1 className={`${pixelFont.className} text-cyan-400 text-base tracking-wider`}
               style={{
                 textShadow: '0 0 5px rgba(103, 232, 249, 0.6)'
               }}
            >
              99absurd
            </h1>
          </div>
          
          {/* Empty div to maintain the justify-between spacing */}
          <div className="w-10"></div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className={`${pixelFont.className} text-cyan-400 text-sm hover:text-cyan-100 transition-colors`}
            style={{
              textShadow: '0 0 5px rgba(103, 232, 249, 0.6)'
            }}
            aria-label="Information"
          >
            [?]
          </button>
        </div>
        
        {/* CRT Overlay matching number grid */}
        <div 
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.15) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.04))',
            backgroundSize: '100% 2px, 3px 100%',
            boxShadow: 'inset 0 0 100px rgba(0, 80, 255, 0.10)',
            animation: 'flicker 0.15s infinite',
            overflow: 'hidden',
          }}
        >
          {/* Vignette effect matching number grid */}
          <div 
            className="absolute top-0 left-0 w-full h-full"
            style={{
              boxShadow: 'inset 0 0 150px rgba(0, 0, 0, 0.7)',
              borderRadius: '10px',
            }}
          />
        </div>

        {/* Glowing bottom border with CRT effect */}
        <div 
          className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 z-10"
          style={{
            boxShadow: '0 0 5px rgba(103, 232, 249, 0.8), 0 0 10px rgba(103, 232, 249, 0.4)',
            backgroundImage: 'linear-gradient(90deg, rgba(6, 182, 212, 0.1), rgba(6, 182, 212, 0.9), rgba(6, 182, 212, 0.1))',
            animation: 'flicker 0.15s infinite'
          }}
        />
      </nav>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className="absolute inset-0 bg-black opacity-80"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              className={`${pixelFont.className} relative bg-black p-6 max-w-xl w-full mx-4`}
              style={{
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'rgb(6, 182, 212)',
                boxShadow: '0 0 5px rgba(103, 232, 249, 0.8), 0 0 10px rgba(103, 232, 249, 0.4)',
                animation: 'flicker 0.15s infinite'
              }}
              initial={{ scale: 0.5, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.5, y: 50, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.4
              }}
            >
              <div className="text-cyan-400 text-sm mb-6 space-y-4"
                   style={{
                     textShadow: '0 0 5px rgba(103, 232, 249, 0.5)'
                   }}
              >
                <p>Right now, it feels like the walls are closing in—every feed, every scroll, just another reminder that our world is spiraling. And somehow, through all this chaos, we're still expected to sit at our desks, and pretend any of it makes sense—like we're trapped in Severance's MDR department, sorting numbers that feel just as meaningless as everything else.</p>
                
                <p>It became the inspiration for 99absurd—a tiny, defiant corner of the internet that exists as an antidote to the dread of the world. A place where we laugh at the absurdity instead of letting it crush us. Where we embrace the chaos, crack jokes, and remind ourselves that sometimes, the best (or only) response to the madness is to be ridiculous.</p>
                
                <p>Happy exploring.</p>
                <p>Ilan & Ben x</p>
              </div>
              
              {/* Position the GIF in the bottom right corner */}
              <div className="absolute bottom-6 right-6 w-16">
                <img 
                  src={absurdGif.src} 
                  alt="99absurd" 
                  className="w-full h-auto"
                  style={{ 
                    animation: 'continuous-animation 0.01s infinite',
                  }}
                />
              </div>
              
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-cyan-400 text-sm hover:text-cyan-100"
                style={{
                  textShadow: '0 0 5px rgba(103, 232, 249, 0.5)'
                }}
              >
                [CLOSE]
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}