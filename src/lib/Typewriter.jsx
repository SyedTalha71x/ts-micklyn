import { Typography } from "@mui/material";
import { motion } from "framer-motion";

const sentenceVariants = {
  hidden: {},
  visible: { opacity: 1, transition: { staggerChildren: 0.01 } },
};

const letterVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { opacity: { duration: 0.01 } } },
};

export const Typewriter = ({ text = "", ...rest }) => {
  if (!text || typeof text !== "string") return null;

  const parseTextSegments = (text) => {
    const segments = [];
    let currentIndex = 0;
    
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    
    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > currentIndex) {
        const beforeText = text.slice(currentIndex, match.index);
        beforeText.split('').forEach(char => {
          segments.push({ char, isBold: false });
        });
      }
      
      // Add bold text
      match[1].split('').forEach(char => {
        segments.push({ char, isBold: true });
      });
      
      currentIndex = match.index + match[0].length;
    }
    
    if (currentIndex < text.length) {
      const remainingText = text.slice(currentIndex);
      remainingText.split('').forEach(char => {
        segments.push({ char, isBold: false });
      });
    }
    
    return segments;
  };

  const segments = parseTextSegments(text);

  return (
    <motion.div
      key={text}
      variants={sentenceVariants}
      initial="hidden"
      animate="visible"
      style={{ 
        fontFamily: 'inherit',
        lineHeight: 1.6
      }}
      {...rest}
    >
      {segments.map((segment, index) => {
        if (segment.char === '\n') {
          return <br key={`br-${index}`} />;
        }
        
        return (
          <motion.span
            key={`${segment.char}-${index}`}
            variants={letterVariants}
            style={{
              fontWeight: segment.isBold ? 600 : 'normal',
              fontSize: segment.isBold ? '1.1em' : '1em',
            }}
          >
            {segment.char}
          </motion.span>
        );
      })}
    </motion.div>
  );
};