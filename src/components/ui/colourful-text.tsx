"use client";
import React from "react";
import { motion } from "motion/react";

export default function ColourfulText({ text }: { text: string }) {
  // const colors = [
  //   "rgb(131, 179, 32)",
  //   "rgb(47, 195, 106)",
  //   "rgb(42, 169, 210)",
  //   "rgb(4, 112, 202)",
  //   "rgb(107, 10, 255)",
  //   "rgb(183, 0, 218)",
  //   "rgb(218, 0, 171)",
  //   "rgb(230, 64, 92)",
  //   "rgb(232, 98, 63)",
  //   "rgb(249, 129, 47)",
  // ];
  const colors = [
    "rgb(98, 121, 79)",  // Muted Olive Green
    "rgb(85, 140, 107)", // Soft Teal Green
    "rgb(94, 142, 166)", // Desaturated Blue-Grey
    "rgb(72, 112, 152)", // Muted Navy Blue
    "rgb(108, 90, 158)", // Soft Purple
    "rgb(134, 91, 146)", // Muted Mauve
    "rgb(158, 95, 128)", // Dusty Rose
    "rgb(173, 116, 116)", // Muted Coral
    "rgb(187, 132, 104)", // Warm Sand Brown
    "rgb(200, 145, 95)",  // Soft Terracotta
  ];

  const [currentColors, setCurrentColors] = React.useState(colors);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const shuffled = [...colors].sort(() => Math.random() - 0.5);
      setCurrentColors(shuffled);
      setCount((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return text.split("").map((char, index) => (
    <motion.span
      key={`${char}-${count}-${index}`}
      initial={{
        y: 0,
      }}
      animate={{
        color: currentColors[index % currentColors.length],
        y: [0, -3, 0],
        scale: [1, 1.01, 1],
        filter: ["blur(0px)", `blur(5px)`, "blur(0px)"],
        opacity: [1, 0.8, 1],
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
      }}
      className="inline-block whitespace-pre font-sans tracking-tight"
    >
      {char}
    </motion.span>
  ));
}
