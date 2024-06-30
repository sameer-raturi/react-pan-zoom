import React, { useState, useRef } from "react";
import "./ZoomableImage.css";

const ZoomableImage = ({
  src,
  alt,
  zoomFactor = 2,
  maxZoom = 4,
  minZoom = 1,
}) => {
  const [zoom, setZoom] = useState(1);
  const [xCoordinate, setXCoordinate] = useState(0);
  const [yCoordinate, setYCoordinate] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragXCoordinate, setDragXCoordinate] = useState(0);
  const [dragYCoordinate, setDragYCoordinate] = useState(0);
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  const handleDoubleClick = (event) => {
    if (!containerRef.current || !imgRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const imgRect = imgRef.current.getBoundingClientRect();
    const relClickX = (clickX - xCoordinate) / zoom;
    const relClickY = (clickY - yCoordinate) / zoom;

    let newZoom;
    let newXCoordinate, newYCoordinate;

    if (zoom === 1) {
      // Zoom in
      newZoom = zoomFactor;
      newXCoordinate = clickX - relClickX * newZoom;
      newYCoordinate = clickY - relClickY * newZoom;
    } else {
      // Zoom out
      newZoom = minZoom;
      newXCoordinate = 0;
      newYCoordinate = 0;
    }

    // Ensure zoom stays within limits
    newZoom = Math.min(Math.max(newZoom, minZoom), maxZoom);

    setZoom(newZoom);
    setXCoordinate(newXCoordinate);
    setYCoordinate(newYCoordinate);
  };

  const handleMouseDown = (event) => {
    if (zoom === 1) return;

    setIsDragging(true);
    setDragStartX(event.clientX);
    setDragStartY(event.clientY);
    setDragXCoordinate(xCoordinate);
    setDragYCoordinate(yCoordinate);
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;

    const imgRect = imgRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    // Calculate new offsets with panning constraints (as before)
    let newXCoordinate = dragXCoordinate + (event.clientX - dragStartX);
    let newYCoordinate = dragYCoordinate + (event.clientY - dragStartY);

    // Check if image is smaller than zoomed view
    const isImageSmaller = imgRect.right * zoom < containerRect.right;

    // Center image if it's smaller
    if (isImageSmaller) {
      newXCoordinate = Math.max(
        0,
        Math.min(containerRect.width - imgRect.width * zoom, newXCoordinate)
      );
      newYCoordinate = Math.max(
        0,
        Math.min(containerRect.height - imgRect.height * zoom, newYCoordinate)
      );
    }

    setXCoordinate(newXCoordinate);
    setYCoordinate(newYCoordinate);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className={`zoomable-image-container ${zoom > 1 ? "zoomed-in" : ""}`}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="zoomable-image"
        style={{
          transform: `translate(${xCoordinate}px, ${yCoordinate}px) scale(${zoom})`,
          transformOrigin: "0 0",
          cursor: isDragging ? "grabbing" : zoom > 1 ? "grab" : "zoom-in",
        }}
      />
    </div>
  );
};

export default ZoomableImage;
