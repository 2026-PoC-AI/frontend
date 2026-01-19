import { useState } from 'react';
import { Trash2, Archive, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function GamifiedAction({ isDeepfake, confidence, fileName, onAction }) {
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredZone, setHoveredZone] = useState(null);
  const [actionCompleted, setActionCompleted] = useState(false);

  // 드래그 중 위치를 계산하여 어떤 영역 위에 있는지 확인하는 함수
  const handleDrag = (_, info) => {
    const x = info.point.x;
    const y = info.point.y;

    // 화면의 요소를 직접 찾아 위치 계산 (드롭 존의 영역 감지)
    const trashZone = document.getElementById('trash-zone')?.getBoundingClientRect();
    const safeZone = document.getElementById('safe-zone')?.getBoundingClientRect();

    if (trashZone && x >= trashZone.left && x <= trashZone.right && y >= trashZone.top && y <= trashZone.bottom) {
      setHoveredZone('trash');
    } else if (safeZone && x >= safeZone.left && x <= safeZone.right && y >= safeZone.top && y <= safeZone.bottom) {
      setHoveredZone('safe');
    } else {
      setHoveredZone(null);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    
    if (hoveredZone) {
      setActionCompleted(true);
      setTimeout(() => {
        onAction(hoveredZone === 'trash' ? 'delete' : 'archive');
      }, 1500);
    }
    // 드래그 종료 시 영역 상태 초기화는 하지 않음 (성공 애니메이션 표시를 위해)
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-dashed border-gray-300 relative overflow-hidden">
      <div className="text-center mb-6">
        <h3 className="text-xl sm:text-2xl mb-2 font-bold">이 영상을 어떻게 처리하시겠습니까?</h3>
        <p className="text-sm sm:text-base text-gray-600">
          {isDeepfake 
            ? '딥페이크로 판정된 영상을 쓰레기통으로 드래그하세요' 
            : '진짜 영상을 안전 금고로 드래그하여 보관하세요'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Trash Zone */}
        <div
          id="trash-zone"
          className={`relative h-48 rounded-2xl border-2 border-dashed transition-all duration-300 ${
            hoveredZone === 'trash'
              ? 'border-red-500 bg-red-50 scale-105'
              : 'border-gray-300 bg-white'
          }`}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.div
              animate={{
                scale: hoveredZone === 'trash' ? [1, 1.2, 1] : 1,
                rotate: hoveredZone === 'trash' ? [0, -10, 10, 0] : 0,
              }}
              transition={{ duration: 0.5, repeat: hoveredZone === 'trash' ? Infinity : 0 }}
            >
              <Trash2 className={`w-16 h-16 mb-3 ${hoveredZone === 'trash' ? 'text-red-500' : 'text-gray-400'}`} />
            </motion.div>
            <p className={`text-lg font-medium ${hoveredZone === 'trash' ? 'text-red-600' : 'text-gray-600'}`}>쓰레기통</p>
            <p className="text-sm text-gray-500 mt-1">딥페이크 삭제</p>
          </div>
        </div>

        {/* Safe Zone */}
        <div
          id="safe-zone"
          className={`relative h-48 rounded-2xl border-2 border-dashed transition-all duration-300 ${
            hoveredZone === 'safe'
              ? 'border-green-500 bg-green-50 scale-105'
              : 'border-gray-300 bg-white'
          }`}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.div
              animate={{
                scale: hoveredZone === 'safe' ? [1, 1.1, 1] : 1,
              }}
              transition={{ duration: 0.5, repeat: hoveredZone === 'safe' ? Infinity : 0 }}
            >
              <Archive className={`w-16 h-16 mb-3 ${hoveredZone === 'safe' ? 'text-green-500' : 'text-gray-400'}`} />
            </motion.div>
            <p className={`text-lg font-medium ${hoveredZone === 'safe' ? 'text-green-600' : 'text-gray-600'}`}>안전 금고</p>
            <p className="text-sm text-gray-500 mt-1">진짜 영상 보관</p>
          </div>
        </div>
      </div>

      {/* Draggable Item */}
      <div className="flex justify-center h-40">
        {!actionCompleted && (
          <motion.div
            drag
            dragSnapToOrigin // 드롭 실패 시 제자리로 돌아옴
            onDragStart={() => setIsDragging(true)}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`cursor-grab active:cursor-grabbing select-none z-10 ${isDragging ? 'opacity-50' : 'opacity-100'}`}
          >
            <div className={`bg-gradient-to-br ${
              isDeepfake ? 'from-red-500 to-pink-500' : 'from-green-500 to-emerald-500'
            } rounded-2xl p-6 shadow-lg text-white min-w-[300px]`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  {isDeepfake ? <Trash2 className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm">{fileName}</p>
                  <p className="text-xs opacity-90">
                    {isDeepfake ? '딥페이크 ' : '진짜 '} ({confidence}% 신뢰도)
                  </p>
                </div>
              </div>
              <div className="text-center mt-3 pt-3 border-t border-white/20">
                <p className="text-xs opacity-75">👆 드래그하여 위 영역으로 이동</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Success Animation Overlay */}
      <AnimatePresence>
        {actionCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 12 }}
              className={`p-8 text-center`}
            >
              {hoveredZone === 'trash' ? (
                <>
                  <Trash2 className="w-20 h-20 text-red-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-red-600 mb-2">삭제 완료!</h3>
                </>
              ) : (
                <>
                  <Archive className="w-20 h-20 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-green-600 mb-2">보관 완료!</h3>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}