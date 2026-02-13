"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

// 18 images
const imageList = [
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
];

// Create 18 pairs of images (36 images in total)
const imagePairs = imageList.flatMap((image) => [image, image]);

const shuffleArray = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const heartLayout = [
  [null, null, 0, 1, null, 2, 3, null, null],
  [null, 4, 5, 6, 7, 8, 9, 10, null],
  [11, 12, 13, 14, 15, 16, 17, 18, 19],
  [null, 20, 21, 22, 23, 24, 25, 26, null],
  [null, null, 27, 28, 29, 30, 31, null, null],
  [null, null, null, 32, 33, 34, null, null, null],
  [null, null, null, null, 35, null, null, null, null],
];

type ValentinesProposalProps = {
  handleShowProposal: () => void;
};

export default function PhotoPairGame({
  handleShowProposal,
}: ValentinesProposalProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [incorrect, setIncorrect] = useState<number[]>([]);
  const [images, setImages] = useState<string[]>(imagePairs);
  const [isMounted, setIsMounted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Shuffle images only on client side after mount to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    setImages(shuffleArray([...imagePairs]));
  }, []);

  const handleClick = async (index: number) => {
    if (selected.length === 2 || matched.includes(index) || selected.includes(index)) return;

    if (selected.length === 1) {
      const firstIndex = selected[0];
      setSelected((prev) => [...prev, index]);

      if (images[firstIndex] === images[index]) {
        setMatched((prev) => [...prev, firstIndex, index]);
        setSelected([]);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second

        setIncorrect([firstIndex, index]);
        setTimeout(() => setIncorrect([]), 1000); // Clear incorrect after 1 second
        setTimeout(() => setSelected([]), 1000);
      }
    } else {
      setSelected([index]);
    }
  };

  // Check if game is won
  useEffect(() => {
    // All 36 cards (18 pairs × 2) need to be matched
    const totalCards = imagePairs.length; // Should be 36
    const uniqueMatched = [...new Set(matched)]; // Remove duplicates if any
    console.log('Checking game completion - Matched:', matched.length, 'Unique:', uniqueMatched.length, 'Total:', totalCards);
    
    if (matched.length === totalCards && matched.length > 0 && !gameCompleted) {
      console.log('🎉 Game completed! Calling handleShowProposal');
      setGameCompleted(true);
      // Small delay to ensure state is fully updated
      setTimeout(() => {
        handleShowProposal();
      }, 100);
    }
  }, [matched, handleShowProposal, gameCompleted]);

  return (
    <div className="grid grid-cols-9 gap-1 lg:gap-2 max-w-[95vw] mx-auto place-items-center">
      {/* Image preload */}
      {isMounted && (
        <div className="hidden">
          {images.map((image, i) => (
            <Image
              key={i}
              src={image}
              alt={`Image ${i + 1}`}
              fill
              className="object-cover"
              priority
            />
          ))}
        </div>
      )}

      {heartLayout.flat().map((index, i) =>
        index !== null ? (
          <motion.div
            key={i}
            className="w-[11vh] h-[11vh] lg:w-20 lg:h-20 relative cursor-pointer"
            whileHover={{ scale: 1.1 }}
            onClick={() => handleClick(index)}
            style={{ perspective: "1000px" }} // Add perspective for 3D effect
          >
            {/* Back of the card */}
            {!selected.includes(index) && !matched.includes(index) && (
              <motion.div
                className="w-full h-full bg-gray-300 rounded-sm lg:rounded-md absolute z-10"
                initial={{ rotateY: 0 }}
                animate={{
                  rotateY:
                    selected.includes(index) || matched.includes(index)
                      ? 180
                      : 0,
                }}
                transition={{ duration: 0.5 }}
                style={{ backfaceVisibility: "hidden" }}
              />
            )}

            {/* Front of the card (image) */}
            {(selected.includes(index) || matched.includes(index)) && (
              <motion.div
                className="w-full h-full absolute"
                initial={{ rotateY: -180 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.5 }}
                style={{ backfaceVisibility: "hidden" }}
              >
                <Image
                  src={images[index]}
                  alt={`Imagen ${index + 1}`}
                  fill
                  className="rounded-sm lg:rounded-md object-cover"
                />
              </motion.div>
            )}

            {/* Incorrect animation */}
            {incorrect.includes(index) && (
              <motion.div
                className="absolute inset-0"
                animate={{ scale: [1, 1.1, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-full h-full bg-red-500 rounded-sm lg:rounded-md"></div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <div key={i} className="w-[11vh] h-[11vh] lg:w-20 lg:h-20" />
        ),
      )}
    </div>
  );
}
