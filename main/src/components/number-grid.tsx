"use client"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Press_Start_2P } from "next/font/google"
import absurdGif from '../assets/absurd.gif'

// Adjust this if needed
export const NAVBAR_HEIGHT = "60px"

// Initialize the pixel-style font with specific configuration
const pixelFont = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin']
})

export default function NumberGrid() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  // We'll store our displayed cells (which might be >= 99 if the square grid is bigger)
  const [gridNumbers, setGridNumbers] = useState<number[]>([])
  const [gridDimensions, setGridDimensions] = useState({ cols: 0, rows: 0 })
  const gridRef = useRef<HTMLDivElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null)

  // We only have 99 total unique statements, indexed 0..98
  const totalStatements = 99

  useEffect(() => {
    const calculateGrid = () => {
      if (!gridRef.current) return
      
      const minCellSize = 70
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight - parseInt(NAVBAR_HEIGHT)
      
      // Check "mobile" breakpoint
      const isMobile = viewportWidth < 768
      if (isMobile) {
        // Use a small (fixed) number of columns; let rows scroll
        // so all 99 can appear
        const columns = Math.max(4, Math.floor(viewportWidth / minCellSize) - 1)
        const rows = Math.ceil(totalStatements / columns)
        setGridDimensions({ cols: columns, rows })

        // Just show exactly 99 in mobile
        //  -> 0..98 in random order if you like
        const baseArray = Array.from({ length: totalStatements }, (_, i) => i)
        const shuffled = shuffleArray(baseArray)
        setGridNumbers(shuffled)
      } else {
        // Desktop: Create a PERFECT SQUARE that can fit on the screen
        // each cell at least `minCellSize` wide & tall

        let side = Math.min(
          Math.floor(viewportWidth / minCellSize),
          Math.floor(viewportHeight / minCellSize)
        )

        // If side*side is smaller than 99, we bump side to fit at least 99
        if (side * side < totalStatements) {
          side = Math.ceil(Math.sqrt(totalStatements))
        }
        
        // We end up with side×side cells. Some might be duplicates if side*side > 99
        setGridDimensions({ cols: side, rows: side })

        // Build an array of length side^2
        // 1) put all 99 unique statements in it
        // 2) if side^2 > 99, fill the rest randomly from 0..98 again (duplicates)
        const baseArray = Array.from({ length: totalStatements }, (_, i) => i) // 0..98
        // shuffle so the first 99 aren't in order
        const shuffled99 = shuffleArray(baseArray)

        const totalCells = side * side
        if (totalCells === totalStatements) {
          // Perfectly 99 => just use the shuffled array
          setGridNumbers(shuffled99)
        } else {
          // side^2 > 99 => fill extras with random duplicates
          const extraNeeded = totalCells - totalStatements
          const duplicates = Array.from({ length: extraNeeded }, () => {
            // pick a random from 0..98
            return Math.floor(Math.random() * totalStatements)
          })
          const finalArray = [...shuffled99, ...duplicates]
          // shuffle the entire thing again
          const finalShuffled = shuffleArray(finalArray)
          setGridNumbers(finalShuffled)
        }
      }
    }

    calculateGrid()
    window.addEventListener('resize', calculateGrid)
    return () => window.removeEventListener('resize', calculateGrid)
  }, [])

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    const handleScroll = () => {
      // reset on scroll
      setMousePosition({ x: 0, y: 0 })
    }

    const handleClick = () => {
      setMousePosition({ x: 0, y: 0 })
      setTimeout(() => {
        if (gridRef.current) {
          setMousePosition({ x: 0, y: 0 })
        }
      }, 50)
    }

    const grid = gridRef.current
    if (grid) {
      grid.addEventListener("mousemove", handleMouseMove)
      grid.addEventListener("click", handleClick)
      document.addEventListener("scroll", handleScroll)
    }
    return () => {
      if (grid) {
        grid.removeEventListener("mousemove", handleMouseMove)
        grid.removeEventListener("click", handleClick)
        document.removeEventListener("scroll", handleScroll)
      }
    }
  }, [])

  const handleNumberClick = (number: number) => {
    setSelectedNumber(number)
    setIsModalOpen(true)
    setMousePosition({ x: 0, y: 0 })
  }

  // 99 statements, index = 0..98
  function getModalText(number: number) {
    const statements = [
      "9/11 was the worst musical I've ever seen", // 0
      "Screw you J.P. Morgan", // 1
      "I'd kill for just a smidge of smegma right now", // 2
      "I was forced to do Kumon", // 3
      "360º missionary (on rust)", // 4
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
      "Peter Dutton had an affair with the Freddo Frog", // 22
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
      "Nothing worse than a man with a weed hat", // 41
      "Babe, is it in…? (Foot asking a sock)", // 42
      "I barely tolerate beetroot", // 43
      "Congratulations Macklemore (he's pregnant)", // 44
      "Tim Cook is Margaret Thatcher for people with Oppos", // 45
      "Schnitz till I die", // 46
      "I crave affection from older women", // 47
      "Applications for Somalia's next top model are now open", // 48
      "Make burnt toast-smelling deodorant to trick people into having seizures", // 49
      "Worlds best jelqer", // 50
      "Stop being greedy and weird", // 51
      "Abolish iPhone 13s", // 52
      "An MMF with Zack and Cody", // 53
      "Make Snooki great again", // 54
      "Using a hamster like a Smiggle eraser", // 55
      "Black coffee with a side of Prozac", // 56
      "Pol Pot's fucked", // 57
      "Shoot for the stars. If the stars are Nazis", // 58
      "Harry Potter was a feeder", // 59
      "Elon Musk looks like a voodoo doll", // 60
      "Stockholm syndrome but your captor is the Dalai Lama", // 61
      "Straight guys for string theory", // 62
      "Alvin and The Chipmunks singing Clare de Lune", // 63
      "All hail emperor Fran Lebowitz", // 64
      "Radicalise Peruvian toddlers with WizFiz", // 65
      "Graphic design is fucking stupid", // 66
      "Aesop but for people with gastro", // 67
      "God save the Sheen", // 68
      "Nelson Mandela is a Mandala", // 69
      "(DRJ) Democratic Republic of Jenga", // 70
      "Don't @ me if you've never s@t on me", // 71
      "Ray Charles can see Stevie Wonder", // 72
      "Who the fuck even is Zooey Deschanel", // 73
      "Ah yes. The ol' cum and cry technique", // 74
      "Fertilise your friends", // 75
      "Hinduism, but it's just huffing computer cleaner", // 76
      "2016 was the best year of the century", // 77
      "Underfeed billionaires", // 78
      "Buddha b2b Allah", // 79
      "CNC fantasy (croissant-non-croissant)", // 80
      "Birkenstocks are tumors for the feet", // 81
      "Stanley Tucci was made out of Play-Doh", // 82
      "Trust me. If it ain't broke, you'll have to fix it.", // 83
      "Fuck you France", // 84
      "Cigarettes after HECS", // 85
      "Reality TV idea: give changa to toddlers and watch them grow up for 10+ years", // 86
      "African militias catered my wedding", // 87
      "Enough with the Samsung Galaxies. Please.", // 88
      "Don't hate anyone. Unless they're Boer", // 89
      "Robert Downey Syndrome", // 90
      "Michelle Obama is Johnny Depp in drag", // 91
      "People who work at Amex bleach their assholes", // 92
      "Laser tag, but 1 person on each team has a real gun", // 93
      "Playing gangsta rap to cattle, call that MooPac", // 94
      "More forests. Less bald men", // 95
      "1800-552-I-hate-my-wife", // 96
      "Simon Cowell does porn now", // 97
      "Okay, Sharks. I need $2 million to build Reya for fundamentalists." // 98
    ]

    // Fallback if some random out-of-range index occurs:
    if (number < 0 || number >= statements.length) {
      return `Number ${number.toString().padStart(2, "0")} has no statement assigned.`
    }
    return statements[number]
  }

  return (
    <div 
      className="fixed top-0 left-0 w-full border-b border-zinc-800"
      style={{ 
        height: '100vh',
        paddingTop: NAVBAR_HEIGHT,
        backgroundColor: '#050d1a',
        overflowY: 'auto'
      }}
    >
      {/* CRT Overlay */}
      <div 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.15) 50%), ' +
            'linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.04))',
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

      {/* The Grid */}
      <div
        ref={gridRef}
        className="h-full w-full grid gap-4 p-4 relative"
        // We dynamically create the grid with CSS variables or inline style:
        style={{
          gridTemplateColumns: `repeat(${gridDimensions.cols}, 1fr)`,
          gridTemplateRows: `repeat(${gridDimensions.rows}, 1fr)`,
        }}
      >
        {gridNumbers.map((number, index) => {
          // Column & row index
          const col = index % gridDimensions.cols
          const row = Math.floor(index / gridDimensions.cols)

          // For the "wobble" effect
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
                scale:
                  mousePosition.x && mousePosition.y
                    ? getScale(mousePosition.x, mousePosition.y, cellX, cellY)
                    : 1,
              }}
              transition={{
                duration: 6.5,
                delay: Math.random() * 2.5 + index * 0.05,
                x: { type: "spring", stiffness: 20, damping: 8 },
                y: { type: "spring", stiffness: 20, damping: 8 },
                scale: { type: "spring", stiffness: 100, damping: 15 },
                opacity: { duration: 4.0 },
              }}
              style={{ width: "100%", height: "100%" }}
            >
              {/* Wiggle effect */}
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
                    delay: 0.1 + Math.random() * 0.2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 2.2 + Math.sin(index * 0.3) * 0.4,
                    ease: "easeInOut",
                  },
                  y: {
                    delay: 0.1 + Math.random() * 0.2,
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

      {/* Modal */}
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
                animation: 'flicker 0.15s infinite',
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
              <div
                className="text-cyan-400 text-sm mb-6"
                style={{ textShadow: '0 0 5px rgba(103, 232, 249, 0.5)' }}
              >
                <p>{getModalText(selectedNumber)}</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-cyan-400 text-sm hover:text-cyan-100"
                  style={{ textShadow: '0 0 5px rgba(103, 232, 249, 0.5)' }}
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

function getScale(mouseX: number, mouseY: number, elementX: number, elementY: number) {
  const distance = Math.sqrt((mouseX - elementX) ** 2 + (mouseY - elementY) ** 2)
  const maxDistance = 150
  const sigma = maxDistance / 2.5
  const gaussianFalloff = Math.exp(- (distance * distance) / (2 * sigma * sigma))
  return 1 + gaussianFalloff * 0.8
}

// Simple helper to shuffle an array in-place
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
