"use client"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Press_Start_2P } from "next/font/google"
import { NAVBAR_HEIGHT } from './navbar'
import absurdGif from '../assets/absurd.gif'

// Initialize the pixel-style font with specific configuration
const pixelFont = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin']
})

export default function NumberGrid() {
  // Track mouse position relative to the grid
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  // Store the array of numbers to display in the grid
  const [numbers, setNumbers] = useState<number[]>([])
  // Track the grid's dimensions (columns and rows)
  const [gridDimensions, setGridDimensions] = useState({ cols: 0, rows: 0 })
  // Reference to the grid container for measurements
  const gridRef = useRef<HTMLDivElement>(null)
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null)

  // Effect to calculate and update grid dimensions based on viewport size
  useEffect(() => {
    const calculateGrid = () => {
      if (!gridRef.current) return
      
      const minCellSize = 70
      const gap = 10
      
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight - parseInt(NAVBAR_HEIGHT)
      
      const cols = Math.max(4, Math.floor(viewportWidth / minCellSize) - 2)
      const rows = Math.max(4, Math.floor(viewportHeight / minCellSize) - 2)
      
      setGridDimensions({ cols, rows })
      
      if (numbers.length === 0) {
        const totalCells = cols * rows
        const baseNumbers = Array.from({ length: 100 }, (_, i) => i)
        const repeatedNumbers = Array.from({ length: totalCells }, (_, i) => baseNumbers[i % 100])
        const newNumbers = repeatedNumbers.sort(() => Math.random() - 0.5)
        setNumbers(newNumbers)
      }
    }

    calculateGrid()
    window.addEventListener('resize', calculateGrid)
    return () => window.removeEventListener('resize', calculateGrid)
  }, [])

  // Effect to track mouse movement relative to the grid container
  useEffect(() => {
    // Handler function to convert global mouse coordinates to grid-local coordinates
    const handleMouseMove = (e: MouseEvent) => {
      if (gridRef.current) {
        // Get the grid's position and dimensions relative to the viewport
        const rect = gridRef.current.getBoundingClientRect()
        
        // Calculate mouse position relative to the grid's top-left corner:
        // - e.clientX/Y gives us the mouse position in viewport coordinates
        // - rect.left/top gives us the grid's offset from viewport edge
        // - Subtracting them gives us local coordinates within the grid
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    // Cache the reference to the grid element to avoid multiple ref.current calls
    const grid = gridRef.current
    if (grid) {
      // Attach the mouse move listener to the grid element
      // Using the grid element instead of window ensures we only track
      // mouse movement when it's within the grid boundaries
      grid.addEventListener("mousemove", handleMouseMove)
    }

    // Cleanup function to prevent memory leaks
    // This runs when either:
    // 1. The component unmounts
    // 2. The effect needs to be re-run (though in this case, the dependency array is empty)
    return () => {
      if (grid) {
        grid.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, []) // Empty dependency array means this effect runs once on mount

  // Function to handle click on a number
  const handleNumberClick = (number: number) => {
    setSelectedNumber(number)
    setIsModalOpen(true)
  }

  // Function to get modal text based on selected number
const getModalText = (number: number) => {
  const statements = [
    "9/11 was the worst musical I've ever seen", // 0
    "Screw you J.P. Morgan", // 1
    "I'd kill for just a smidge of smegma right now", // 2
    "I was forced to do Kumon", // 3
    "360o missionary (on rust)", // 4
    "Troy Bolton loves anal", // 5
    "My Nonna is Bon Jovi", // 6
    "A kiss between cousins is cool", // 7
    "Normalise pissing yourself", // 8
    "Fascists for faeces", // 9
    "Trump has 2 urethras", // 10
    "I'm pro moms with dump truck asses", // 11
    "You're never fully dressed without a gun", // 12
    "Shy kids don't get candy", // 13
    "Are you paying by cash or cunt today?", // 14
    "Quit before you start", // 15
    "bocconcini tastes invisible", // 16
    "My son's name is Ballpoint Glen", // 17
    "Tomorrowland but it's in The Shire", // 18
    "Psychopaths For AHHHHHHHHHHHHHHHHH!!!", // 19
    "Greek yogurt doesn't cure cancer", // 20
    "But Greek yogurt cures thrush", // 21
    "Peter Dutton had an affair with the fredo frog", // 22
    "Allergic to Zooper Doopers (and proud)", // 23
    "Free Palpatine", // 24
    "Firebomb Bread Top", // 25
    "Electrocute your local pedophile", // 26
    "Andrew Tate looks like a snail who just showered", // 27
    "Mayo Enema", // 28
    "Never a coin too big to eat", // 29
    "My foreskin's cramping", // 30
    "The Pope but for the aquarium", // 31
    "Hinge, but it's a desktop app", // 32
    "Forcefully signing up your bladder to F45", // 33
    "KFC Twigs", // 34
    "Hozier is my dad's lover", // 35
    "People who drink cow's milk kiss their mums on the lips", // 36
    "Scat kink but it's the jazz kind", // 37
    "Nuke New York", // 38
    "Gays for Goulash", // 39
    "Dream small, fuck big", // 40
    "Nothing worse than a man with weed hat", // 41
    "Babe, is it in…? (Foot asking a sock)", // 42
    "I barely tolerate beetroot", // 43
    "Congratulations Macklemore (he's pregnant)", // 44
    "Tim Cook is Margaret Thatcher for people with Oppo's", // 45
    "Schnitz till I die", // 46
    "I crave affection from older women", // 47
    "Applications for Somalia's next top model are now open", // 48
    "Make burnt toast-smelling deodorant to trick people into having seizures", // 49
    "Worlds best jelqer", // 50
    "Stop being greedy and weird", // 51
    "Abolish iPhone 13s", // 52
    "An MMF with Zach and Cody", // 53
    "Make Snooki great again", // 54
    "Using a hamster like a Smiggle eraser", // 55
    "Black coffee with a side of Prozac", // 56
    "Pol Pots fucked", // 57
    "Shoot for the stars. If the stars are Nazis", // 58
    "Harry Potter was a feeder", // 59
    "Elon Musk looks like a voodoo doll", // 60
    "Stockholm syndrome but your captor is the Dalai Lama", // 61
    "Straight guys for string theory", // 62
    "Alvin and The Chipmunks singing clare de lune", // 63
    "All hail emperor Fran Lebowitz", // 64
    "Radicalise Peruvian toddlers with wiz fiz", // 65
    "Graphic design is fucking stupid", // 66
    "Aesop but for people with gastro", // 67
    "God save the Sheen", // 68
    "Nelson Mandela is a Mandala", // 69
    "(DRJ) Democratic Republic of Jenga", // 70
    "Don't @ me if you've never s@t on me", // 71
    "Ray Charles can see Stevie Wonder", // 72
    "Who the fuck even is Zoe Deschanel", // 73
    "Ah yes. The ol' cum and cry technique", // 74
    "Fertilise your friends", // 75
    "Hinduism, but it's just huffing computer cleaner", // 76
    "2016 was the best year of the century", // 77
    "Underfeed billionaires", // 78
    "Buddha b2b Allah", // 79
    "CNC fantasy (croissantt-non-croissantt)", // 80
    "Birkenstocks are tumors for the feet", // 81
    "Stanley Tucci was made out of Play-Doh", // 82
    "Trust me. If it ain't broke, you'll have to fix it.", // 83
    "Fuck you France", // 84
    "Cigarettes after HECs", // 85
    "Reality TV show idea: give changa to toddlers and watch them grow up for 10+ years", // 86
    "African militias catered my wedding", // 87
    "Enough with the Samsung Galaxies. Please", // 88
    "Don't hate anyone. Unless they're Boer", // 89
    "Robert Downey Syndrome", // 90
    "Michelle Obama is Johnny Depp in drag", // 91
    "People who work at Amex bleach their assholes", // 92
    "Laser tag, but 1 person on each team has a real gun", // 93
    "Playing gangsta rap to cattle, call that MooPac", // 94
    "More forests. Less bald men", // 95
    "1800-552-I-hate-my-wife", // 96
    "Simon Cowell does porn now", // 97
    'Okay, Sharks. I need $2 million to build Reya for fundamentalists.',
    "You're my 100th reason..." // 98
  ];

  return statements[number] || `Number ${number.toString().padStart(2, "0")} has no statement assigned yet.`;
};

  return (
    <div 
      className="fixed top-0 left-0 w-full border-b border-zinc-800"
      style={{ 
        height: '100vh',
        paddingTop: NAVBAR_HEIGHT,
        backgroundColor: '#050d1a'  // Darker navy color
      }}
    >
      {/* CRT Overlay */}
      <div 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.15) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.04))',
          backgroundSize: '100% 2px, 3px 100%',
          boxShadow: 'inset 0 0 100px rgba(0, 80, 255, 0.10)',
          animation: 'flicker 0.15s infinite',
          overflow: 'hidden',
        }}
      >
        {/* Subtle vignette effect */}
        <div 
          className="absolute top-0 left-0 w-full h-full"
          style={{
            boxShadow: 'inset 0 0 150px rgba(0, 0, 0, 0.7)',
            borderRadius: '10px',
          }}
        />
      </div>

      <div 
        ref={gridRef} 
        className="h-full w-full grid gap-4 p-4 relative"
        style={{
          gridTemplateColumns: `repeat(${gridDimensions.cols}, 1fr)`,
          gridTemplateRows: `repeat(${gridDimensions.rows}, 1fr)`
        }}
      >
        {numbers.map((number, index) => {
          // Calculate cell's position in the grid
          const col = index % gridDimensions.cols
          const row = Math.floor(index / gridDimensions.cols)

          // Calculate actual pixel positions for animation effects
          const rect = gridRef.current?.getBoundingClientRect() || { width: 0, height: 0 }
          const cellWidth = rect.width / gridDimensions.cols
          const cellHeight = rect.height / gridDimensions.rows
          const cellX = col * cellWidth + cellWidth / 2
          const cellY = row * cellHeight + cellHeight / 2
          
          return (
            <motion.div
              key={`${number}-${index}`}
              className="relative flex items-center justify-center cursor-pointer"
              onClick={() => handleNumberClick(number)}
              initial={{ 
                opacity: 0,
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 400,
                scale: Math.random() * 0.5 + 0.3
              }}
              animate={{
                opacity: 1,
                x: 0,
                y: 0,
                scale: mousePosition.x && mousePosition.y 
                  ? getScale(mousePosition.x, mousePosition.y, cellX, cellY) 
                  : 1,
              }}
              transition={{
                duration: 6.5,
                delay: Math.random() * 2.5 + index * 0.05,
                x: {
                  type: "spring",
                  stiffness: 20,
                  damping: 8
                },
                y: {
                  type: "spring",
                  stiffness: 20,
                  damping: 8
                },
                scale: {
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                },
                opacity: {
                  duration: 4.0
                }
              }}
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              {/* Add continuous wiggle effect as a child motion component */}
              <motion.div
                className="w-full h-full flex items-center justify-center"
                animate={{
                  x: [
                    -1.5 * (1 + (index % 3) * 0.2),
                    1.5 * (1 + (index % 2) * 0.15)
                  ],
                  y: [
                    1.5 * (1 + (index % 2) * 0.15),
                    -1.5 * (1 + (index % 4) * 0.2)
                  ]
                }}
                transition={{
                  x: {
                    delay: 0.1 + Math.random() * 0.2,  // Minimal delay - start almost immediately
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 2.2 + Math.sin(index * 0.3) * 0.4,
                    ease: "easeInOut",
                  },
                  y: {
                    delay: 0.1 + Math.random() * 0.2,  // Minimal delay - start almost immediately
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 2.5 + Math.cos(index * 0.3) * 0.4,
                    ease: "easeInOut",
                  }
                }}
              >
                <span className={`text-base ${pixelFont.className} select-none text-cyan-400`}>
                  {number.toString().padStart(2, "0")}
                </span>
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      {/* Number Modal with zoom-up animation */}
      <AnimatePresence>
        {isModalOpen && selectedNumber !== null && (
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
              <div className="text-cyan-400 text-sm mb-6"
                   style={{
                     textShadow: '0 0 5px rgba(103, 232, 249, 0.5)'
                   }}
              >
                <p>{getModalText(selectedNumber)}</p>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-cyan-400 text-sm hover:text-cyan-100"
                  style={{
                    textShadow: '0 0 5px rgba(103, 232, 249, 0.5)'
                  }}
                >
                  [CLOSE]
                </button>
                <img 
                  src={absurdGif.src} 
                  alt="Absurd GIF" 
                  className="h-8 w-8 object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Calculate scale factor based on mouse proximity using Gaussian falloff
function getScale(mouseX: number, mouseY: number, elementX: number, elementY: number) {
  const distance = Math.sqrt(Math.pow(mouseX - elementX, 2) + Math.pow(mouseY - elementY, 2))
  const maxDistance = 150 // Maximum distance for scale effect
  const sigma = maxDistance / 2.5 // Controls how quickly the effect falls off
  const gaussianFalloff = Math.exp(-(distance * distance) / (2 * sigma * sigma))
  return 1 + gaussianFalloff * 0.8 // Scale between 1 and 1.8
}
