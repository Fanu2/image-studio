import { useState, useRef } from 'react';
import { Rnd } from 'react-rnd'; // Import Rnd for draggable and resizable functionality
import Draggable from 'react-draggable'; // Ensure you have installed react-draggable
import Image from 'next/image'; // Import Image from next/image for optimized images
import styles from './Home.module.css'; // Correct import for CSS styles

export default function Home() {
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [overlayImage, setOverlayImage] = useState(null);
  const [opacity, setOpacity] = useState(1);
  const [text, setText] = useState('');
  const [textSize, setTextSize] = useState(20);
  const [fontColor, setFontColor] = useState('#000');
  
  const textRef = useRef(null); // Create a ref for the text div

  // Handler to set the background image
  const handleBackgroundChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackgroundImage(URL.createObjectURL(file));
    }
  };

  // Handler to set the overlay image
  const handleOverlayChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOverlayImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className={styles.container}>
      <h1>Image Overlay Tool</h1>
      <div className={styles.controls}>
        <input
          type="file"
          accept="image/*"
          onChange={handleBackgroundChange}
          className={styles.fileInput}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleOverlayChange}
          className={styles.fileInput}
        />
        
        <label>
          Background Opacity:
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={opacity}
            onChange={(e) => setOpacity(e.target.value)}
            className={styles.rangeInput}
          />
        </label>

        <input
          type="text"
          placeholder="Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={styles.textInput}
        />

        <label>
          Font Size:
          <input
            type="number"
            min="10"
            max="100"
            value={textSize}
            onChange={(e) => setTextSize(e.target.value)}
            className={styles.numberInput}
          />
        </label>

        <input
          type="color"
          value={fontColor}
          onChange={(e) => setFontColor(e.target.value)}
          className={styles.colorInput}
        />
      </div>

      <div
        className={styles.canvas}
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          opacity,
        }}
      >
        {overlayImage && (
          <Rnd
            bounds="parent"
            default={{
              x: 0,
              y: 0,
              width: 600,
              height: 600,
            }}
          >
            <Image
              src={overlayImage}
              alt="Overlay"
              layout="fill"
              objectFit="contain"
              className={styles.overlayImage}
            />
          </Rnd>
        )}

        <Draggable>
          <div
            ref={textRef}
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: fontColor,
              fontSize: `${textSize}px`,
              textAlign: 'center',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
              cursor: 'move',
            }}
          >
            {text}
            <div
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: '10px',
                height: '10px',
                backgroundColor: 'blue',
                cursor: 'nwse-resize',
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                const onMouseMove = (moveEvent) => {
                  const newSize = Math.max(10, textSize + (moveEvent.clientY - e.clientY));
                  setTextSize(newSize);
                };
                const onMouseUp = () => {
                  document.removeEventListener('mousemove', onMouseMove);
                  document.removeEventListener('mouseup', onMouseUp);
                };
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
              }}
            />
          </div>
        </Draggable>
      </div>
    </div>
  );
}
