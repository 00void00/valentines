import { useState, useEffect, useRef } from "react";
import { Playfair_Display } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import Fireworks from "@fireworks-js/react";
import Image from "next/image";

const playfairDisplay = Playfair_Display({
  display: "swap",
  subsets: ["latin"],
});

// 36 images
const images = [
  "/game-photos/1.jpeg",
  "/game-photos/2.jpeg",
  "/game-photos/3.jpeg",
  "/game-photos/4.jpeg",
  "/game-photos/5.jpeg",
  "/game-photos/6.jpeg",
  "/game-photos/7.jpeg",
  "/game-photos/8.jpeg",
  "/game-photos/9.jpeg",
  "/game-photos/10.jpeg",
  "/game-photos/11.jpeg",
  "/game-photos/12.jpeg",
  "/game-photos/13.jpeg",
  "/game-photos/14.jpeg",
  "/game-photos/15.jpeg",
  "/game-photos/16.jpeg",
  "/game-photos/17.jpeg",
  "/game-photos/18.jpeg",
  "/game-photos/19.jpeg",
  "/game-photos/20.jpeg",
  "/game-photos/21.jpeg",
  "/game-photos/22.jpeg",
  "/game-photos/23.jpeg",
  "/game-photos/24.jpeg",
  "/game-photos/25.jpeg",
  "/game-photos/26.jpeg",
  "/game-photos/27.jpeg",
  "/game-photos/28.jpeg",
  "/game-photos/29.jpeg",
  "/game-photos/30.jpeg",
  "/game-photos/31.jpeg",
  "/game-photos/32.jpeg",
  "/game-photos/33.jpeg",
  "/game-photos/34.jpeg",
  "/game-photos/35.jpeg",
  "/game-photos/36.jpeg",
];

export default function ValentinesProposal() {
  const [step, setStep] = useState(0);
  const [position, setPosition] = useState<{
    top: string;
    left: string;
  } | null>(null);
  const [showFireworks, setShowFireworks] = useState(false);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const mousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Returns a position that avoids the center (sad hamster area). Picks from edges/corners.
  const getRandomPosition = () => {
    const hamsterZone = { leftMin: 35, leftMax: 65, topMin: 38, topMax: 62 };
    const safeZones = [
      { left: () => Math.random() * 25, top: () => Math.random() * 100 },           // left edge
      { left: () => 75 + Math.random() * 25, top: () => Math.random() * 100 },     // right edge
      { left: () => Math.random() * 100, top: () => Math.random() * 25 },          // top edge
      { left: () => Math.random() * 100, top: () => 75 + Math.random() * 25 },     // bottom edge
    ];
    const zone = safeZones[Math.floor(Math.random() * safeZones.length)];
    let left = zone.left();
    let top = zone.top();
    // If somehow in hamster zone, nudge to nearest edge
    if (left >= hamsterZone.leftMin && left <= hamsterZone.leftMax && top >= hamsterZone.topMin && top <= hamsterZone.topMax) {
      left = left < 50 ? hamsterZone.leftMin - 15 : hamsterZone.leftMax + 15;
      top = top < 50 ? hamsterZone.topMin - 15 : hamsterZone.topMax + 15;
    }
    return { top: `${Math.max(0, Math.min(90, top))}%`, left: `${Math.max(0, Math.min(90, left))}%` };
  };

  useEffect(() => {
    if (step < 2) {
      // Change step after 5 seconds
      const timer = setTimeout(() => {
        setStep((prevStep) => prevStep + 1);
      }, 5000);

      return () => clearTimeout(timer);
    }
    
    // Initialize button position when step 2 starts
    if (step === 2 && !position) {
      setPosition(getRandomPosition());
    }
  }, [step, position]);

  // Track mouse movement and move button away when cursor gets near
  useEffect(() => {
    if (step !== 2 || !position) return;

    let lastMoveTime = 0;
    const throttleDelay = 100; // Only check every 100ms

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMoveTime < throttleDelay) return;
      lastMoveTime = now;

      mousePositionRef.current = { x: e.clientX, y: e.clientY };

      if (!noButtonRef.current) return;

      // Get button position
      const buttonRect = noButtonRef.current.getBoundingClientRect();
      const buttonCenterX = buttonRect.left + buttonRect.width / 2;
      const buttonCenterY = buttonRect.top + buttonRect.height / 2;

      // Calculate distance between mouse and button center
      const distance = Math.sqrt(
        Math.pow(mousePositionRef.current.x - buttonCenterX, 2) +
        Math.pow(mousePositionRef.current.y - buttonCenterY, 2)
      );

      // If cursor is within 120px of button, move it away
      if (distance < 120) {
        setPosition(getRandomPosition());
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [step, position]);

  const handleYesClick = () => {
    setShowFireworks(true);
    setStep(3);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.h2
            key="step-0"
            className={`text-4xl font-semibold mb-4 ${playfairDisplay.className}`}
            transition={{ duration: 1 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Congratulations! You have completed the game.
          </motion.h2>
        )}
        {step === 1 && (
          <motion.h2
            key="step-1"
            className={`text-4xl font-semibold mb-4 ${playfairDisplay.className}`}
            transition={{ duration: 3 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            I gotta ask you a serious question, be ready!
          </motion.h2>
        )}
        {step === 2 && (
          <motion.div
            key="step-2"
            transition={{ duration: 3 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-20 flex flex-col items-center"
          >
            {/* Image Grid Background */}
            <div className="absolute inset-0 grid grid-cols-6 opacity-10">
              {images.slice(0, 36).map((src, index) => (
                <div key={index} className="relative h-full">
                  <Image
                    src={src}
                    alt={`Memory ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <h2
              className={`text-5xl font-semibold mb-8 ${playfairDisplay.className}`}
            >
              Will you be my Valentine?
            </h2>
            <div className="relative z-0" style={{ opacity: 1 }}>
              <Image
                src="/sad_hamster.png"
                alt="Sad Hamster"
                width={200}
                height={200}
                className="opacity-100"
              />
            </div>
            <div className="relative z-30 flex space-x-4 mt-10">
              <button
                className="px-6 py-2 text-lg font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl hover:from-pink-600 hover:to-rose-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl relative z-30"
                onClick={handleYesClick}
              >
                Yes, I will! 🥰
              </button>
              <button
                ref={noButtonRef}
                className="px-6 py-2 text-lg font-semibold text-white bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl transform transition-all duration-300 shadow-lg relative z-[100] select-none pointer-events-none"
                style={
                  position
                    ? {
                        position: "fixed",
                        top: position.top,
                        left: position.left,
                        zIndex: 100,
                        pointerEvents: "none",
                        cursor: "not-allowed",
                      }
                    : {
                        pointerEvents: "none",
                        cursor: "not-allowed",
                      }
                }
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                disabled
              >
                No, I won&apos;t 😢
              </button>
            </div>
          </motion.div>
        )}
        {step === 3 && (
          <motion.div
            key="step-3"
            className={`text-4xl font-semibold mb-4 flex flex-col justify-center items-center ${playfairDisplay.className}`}
            transition={{ duration: 1 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Thank you, I love you! 💕
            <div className="relative z-10" style={{ opacity: 1 }}>
              <Image
                src="/hamster_jumping.gif"
                alt="Hamster Feliz"
                width={200}
                height={200}
                className="opacity-100"
                unoptimized
              />
            </div>
            <p className="text-sm mt-4">How are you feeling? write me!!! 💌</p>
          </motion.div>
        )}
      </AnimatePresence>

      {showFireworks && (
        <div className="absolute w-full h-full">
          <Fireworks
            options={{
              autoresize: true,
            }}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        </div>
      )}
    </div>
  );
}
