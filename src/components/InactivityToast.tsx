import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { useLangStore } from '../stores/langStore'

interface InactivityToastProps {
  timeoutSeconds?: number
}

export const InactivityToast: React.FC<InactivityToastProps> = ({ timeoutSeconds = 30 }) => {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const { lang } = useLangStore()
  const isEN = lang === 'en'

  useEffect(() => {
    if (dismissed) return

    let timeout: NodeJS.Timeout

    const resetTimer = () => {
      clearTimeout(timeout)
      setShow(false)
      timeout = setTimeout(() => {
        setShow(true)
      }, timeoutSeconds * 1000)
    }

    // Initial timer
    timeout = setTimeout(() => {
      setShow(true)
    }, timeoutSeconds * 1000)

    // Reset on user activity
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click']
    events.forEach(event => {
      document.addEventListener(event, resetTimer, { passive: true })
    })

    return () => {
      clearTimeout(timeout)
      events.forEach(event => {
        document.removeEventListener(event, resetTimer)
      })
    }
  }, [timeoutSeconds, dismissed])

  const handleDismiss = () => {
    setShow(false)
    setDismissed(true)
  }

  const handleConfirm = () => {
    setShow(false)
    // Scroll to draw button or trigger draw
    const drawBtn = document.querySelector('.glitch-btn')
    if (drawBtn) {
      drawBtn.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Flash effect
      drawBtn.classList.add('animate-pulse')
      setTimeout(() => drawBtn.classList.remove('animate-pulse'), 2000)
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm"
        >
          {/* Windows-style Error Box */}
          <div className="bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] shadow-lg">
            {/* Title Bar */}
            <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] px-2 py-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-300" />
                <span className="text-white text-sm font-bold">
                  {isEN ? 'System Error 404' : '系统错误 404'}
                </span>
              </div>
              <button 
                onClick={handleDismiss}
                className="bg-[#c0c0c0] border border-t-white border-l-white border-r-[#808080] border-b-[#808080] w-5 h-5 flex items-center justify-center text-black font-bold text-xs hover:bg-[#dfdfdf] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4 bg-[#c0c0c0]">
              <div className="flex gap-3">
                <div className="text-4xl">⚠️</div>
                <div className="text-sm text-black">
                  <p className="font-bold mb-2">
                    {isEN ? 'User hesitation detected.' : '检测到用户犹豫不决。'}
                  </p>
                  <p className="text-xs mb-3">
                    {isEN 
                      ? 'Suggestion: Either go all-in or go deliver food.' 
                      : '建议：要么梭哈，要么去送外卖。'
                    }
                  </p>
                </div>
              </div>
              
              {/* Buttons */}
              <div className="flex justify-center gap-2 mt-2">
                <button
                  onClick={handleConfirm}
                  className="px-6 py-1 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-sm font-bold text-black hover:bg-[#dfdfdf] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white"
                >
                  {isEN ? 'YOLO' : '梭哈'}
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-6 py-1 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-sm text-black hover:bg-[#dfdfdf] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white"
                >
                  {isEN ? 'Cancel' : '取消'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default InactivityToast
