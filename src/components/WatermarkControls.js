import { Move, RotateCw, Maximize, Trash2 } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import styles from './WatermarkControls.module.css'

export default function WatermarkControls({
    position, // { x, y } in image coordinates
    dimensions, // { width, height } in image coordinates (unscaled by textScale)
    rotation,
    scale, // textScale
    displayScale, // ratio of display_pixels / image_pixels
    onUpdate, // ({ x, y, rotation, scale }) => void
    onDelete,
    isActive
}) {
    const controlRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isRotating, setIsRotating] = useState(false)
    const [isResizing, setIsResizing] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [initials, setInitials] = useState({ x: 0, y: 0, rotation: 0, scale: 1, dist: 0 })

    // Convert image coordinates to display coordinates
    const displayX = position.x * displayScale
    const displayY = position.y * displayScale
    const displayWidth = dimensions.width * scale * displayScale
    const displayHeight = dimensions.height * scale * displayScale

    const handleMouseDown = (e, mode) => {
        e.preventDefault()
        e.stopPropagation()

        const clientX = e.touches ? e.touches[0].clientX : e.clientX
        const clientY = e.touches ? e.touches[0].clientY : e.clientY

        setDragStart({ x: clientX, y: clientY })

        // Calculate center relative to screen for rotation/scale
        const rect = controlRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        // Initial distance for scaling
        const dist = Math.sqrt(Math.pow(clientX - centerX, 2) + Math.pow(clientY - centerY, 2))

        setInitials({
            x: position.x,
            y: position.y,
            rotation: rotation,
            scale: scale,
            dist: dist,
            // For rotation
            startAngle: Math.atan2(clientY - centerY, clientX - centerX) * 180 / Math.PI
        })

        if (mode === 'drag') setIsDragging(true)
        if (mode === 'rotate') setIsRotating(true)
        if (mode === 'resize') setIsResizing(true)
    }

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging && !isRotating && !isResizing) return

            const clientX = e.touches ? e.touches[0].clientX : e.clientX
            const clientY = e.touches ? e.touches[0].clientY : e.clientY

            if (isDragging) {
                const dx = (clientX - dragStart.x) / displayScale
                const dy = (clientY - dragStart.y) / displayScale
                onUpdate({ x: initials.x + dx, y: initials.y + dy })
            } else if (isRotating) {
                const rect = controlRef.current.getBoundingClientRect()
                const centerX = rect.left + rect.width / 2
                const centerY = rect.top + rect.height / 2
                const currentAngle = Math.atan2(clientY - centerY, clientX - centerX) * 180 / Math.PI
                const angleDiff = currentAngle - initials.startAngle
                onUpdate({ rotation: initials.rotation + angleDiff })
            } else if (isResizing) {
                const rect = controlRef.current.getBoundingClientRect()
                const centerX = rect.left + rect.width / 2
                const centerY = rect.top + rect.height / 2
                const currentDist = Math.sqrt(Math.pow(clientX - centerX, 2) + Math.pow(clientY - centerY, 2))
                const newScale = Math.max(0.1, initials.scale * (currentDist / initials.dist))
                onUpdate({ scale: newScale })
            }
        }

        const handleMouseUp = () => {
            setIsDragging(false)
            setIsRotating(false)
            setIsResizing(false)
        }

        if (isDragging || isRotating || isResizing) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
            window.addEventListener('touchmove', handleMouseMove)
            window.addEventListener('touchend', handleMouseUp)
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
            window.removeEventListener('touchmove', handleMouseMove)
            window.removeEventListener('touchend', handleMouseUp)
        }
    }, [isDragging, isRotating, isResizing, dragStart, initials, displayScale, onUpdate, rotation])

    if (!isActive) return null

    return (
        <div
            ref={controlRef}
            className={styles.overlay}
            style={{
                left: displayX,
                top: displayY,
                width: displayWidth + 12 * displayScale, // Tighter padding
                height: displayHeight + 12 * displayScale,
                transform: `translate(-50%, -50%) rotate(${rotation}deg)`
            }}
            onMouseDown={(e) => handleMouseDown(e, 'drag')}
            onTouchStart={(e) => handleMouseDown(e, 'drag')}
        >
            {/* Outline */}
            <div className={styles.outline} />

            {/* Move Icon (Center) */}
            <div className={styles.moveHandle}>
                <Move size={16} />
            </div>

            {/* Rotate Handle (Top) */}
            <div
                className={styles.rotateHandle}
                onMouseDown={(e) => handleMouseDown(e, 'rotate')}
                onTouchStart={(e) => handleMouseDown(e, 'rotate')}
            >
                <RotateCw size={14} />
            </div>

            {/* Resize Handle (Bottom Right) */}
            <div
                className={styles.resizeHandle}
                onMouseDown={(e) => handleMouseDown(e, 'resize')}
                onTouchStart={(e) => handleMouseDown(e, 'resize')}
            >
                <Maximize size={14} />
            </div>

            {/* Delete Button (Corner) */}
            {onDelete && (
                <div className={styles.deleteHandle} onClick={(e) => { e.stopPropagation(); onDelete() }}>
                    <Trash2 size={14} />
                </div>
            )}
        </div>
    )
}
