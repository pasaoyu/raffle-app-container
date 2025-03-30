import { useState } from "react";

function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function RaffleApp() {
  const [maxNumber, setMaxNumber] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [availableNumbers, setAvailableNumbers] = useState([]);
  const [drawnNumbers, setDrawnNumbers] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(null);

  const startDrawing = () => {
    const max = Number(maxNumber);
    if (max < 1) return;

    const shuffled = shuffle(Array.from({ length: max }, (_, i) => i + 1));
    setAvailableNumbers(shuffled);
    setDrawnNumbers([]);
    setCurrentNumber(null);
    setIsDrawing(true);
  };

  const drawNumber = () => {
    if (!isDrawing || availableNumbers.length === 0) return;

    const next = availableNumbers[0];
    setCurrentNumber(null);
    setTimeout(() => {
      setCurrentNumber(next);
      setDrawnNumbers((prev) => [...prev, next]);
      setAvailableNumbers((prev) => prev.slice(1));
    }, 10);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setCurrentNumber(null);
  };

  const reset = () => {
    setIsDrawing(false);
    setCurrentNumber(null);
    setDrawnNumbers([]);
    setAvailableNumbers([]);
    setMaxNumber("");
  };

  const isComplete = availableNumbers.length === 0 && isDrawing;

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center p-4 transition-all">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-pink-600">🎯 春祭り抽選</h1>

        {!isDrawing ? (
          <>
            <input
              type="number"
              value={maxNumber}
              min={1}
              onChange={(e) => setMaxNumber(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-3 text-lg shadow-sm focus:ring-2 focus:ring-pink-300"
              placeholder="最大番号を入力"
            />
            <button
              onClick={startDrawing}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white text-lg font-semibold py-3 rounded-xl transition"
            >
              🎬 開始
            </button>
          </>
        ) : (
          <>
            <div className="flex justify-between gap-4">
              <button
                onClick={drawNumber}
                disabled={availableNumbers.length === 0}
                className={`flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition ${
                  availableNumbers.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                🎲 抽選
              </button>
              <button
                onClick={stopDrawing}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 rounded-xl transition"
              >
                ⛔ 終了
              </button>
            </div>

            {/* 数字表示 */}
            <div className="h-24 text-center flex items-center justify-center">
              {currentNumber !== null && (
                <div
                  key={currentNumber}
                  className="text-6xl font-extrabold text-pink-600 animate-pop"
                >
                  {currentNumber}
                </div>
              )}
            </div>

            {/* 抽選完了メッセージ */}
            {isComplete && (
              <div className="text-center text-green-600 font-semibold">
                ✅ 全ての番号が抽選されました！
              </div>
            )}

            {/* 履歴 */}
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto text-sm">
              {drawnNumbers.map((num, index) => (
                <div
                  key={index}
                  className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-medium shadow"
                >
                  {num}
                </div>
              ))}
            </div>

            {isComplete && (
              <button
                onClick={reset}
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl transition"
              >
                🔁 リセット
              </button>
            )}
          </>
        )}
      </div>

      {/* アニメーション */}
      <style>{`
        .animate-pop {
          animation: pop 0.3s ease-out;
        }
        @keyframes pop {
          0% { transform: scale(0.6); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
