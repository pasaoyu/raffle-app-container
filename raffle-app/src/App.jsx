import { useState, useEffect } from "react";

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
  const [isRolling, setIsRolling] = useState(false);
  const [justStarted, setJustStarted] = useState(false);
  const [hasSavedState, setHasSavedState] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("raffleState");
    if (saved) setHasSavedState(true);
  }, []);

  const handleRestore = () => {
    const saved = localStorage.getItem("raffleState");
    if (saved) {
      const state = JSON.parse(saved);
      setMaxNumber(state.maxNumber);
      setAvailableNumbers(state.availableNumbers);
      setDrawnNumbers(state.drawnNumbers);
      setCurrentNumber(state.currentNumber);
      setIsDrawing(true);
    }
    setHasSavedState(false);
  };

  const handleReset = () => {
    localStorage.removeItem("raffleState");
    setHasSavedState(false);
  };

  useEffect(() => {
    if (isDrawing) {
      const state = {
        maxNumber,
        availableNumbers,
        drawnNumbers,
        currentNumber,
      };
      localStorage.setItem("raffleState", JSON.stringify(state));
    }
  }, [maxNumber, availableNumbers, drawnNumbers, currentNumber, isDrawing]);

  const startDrawing = () => {
    const max = Number(maxNumber);
    if (max < 1) return;

    const shuffled = shuffle(Array.from({ length: max }, (_, i) => i + 1));
    setAvailableNumbers(shuffled);
    setDrawnNumbers([]);
    setCurrentNumber(null);
    setIsDrawing(true);
    setJustStarted(true);
    localStorage.removeItem("raffleState");

    setTimeout(() => setJustStarted(false), 300);
  };

  const drawNumber = () => {
    if (!isDrawing || availableNumbers.length === 0 || isRolling) return;

    const next = availableNumbers[0];
    const se = new Audio("sounds/se.mp3");

    setIsRolling(true);

    let count = 0;
    const interval = setInterval(() => {
      const fake = Math.floor(Math.random() * Number(maxNumber)) + 1;
      setCurrentNumber(fake);
      count++;

      if (count >= 20) {
        clearInterval(interval);
        setCurrentNumber(next);
        setDrawnNumbers((prev) => [...prev, next]);
        setAvailableNumbers((prev) => prev.slice(1));
        se.play();
        setIsRolling(false);
      }
    }, 30);
  };

  const handleEnterKey = (e) => {
    if (e.key !== "Enter") return;
    if (!isDrawing && /^[1-9]\d*$/.test(maxNumber)) {
      startDrawing();
    } else if (!justStarted && !isRolling && availableNumbers.length > 0) {
      drawNumber();
    }
  };

  // 再開確認時：Enter → 再開、Escape → いいえ
  useEffect(() => {
    if (!hasSavedState) return;

    const handleKey = (e) => {
      if (e.key === "Enter") {
        handleRestore();
      } else if (e.key === "Escape") {
        handleReset();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [hasSavedState]);

  useEffect(() => {
    window.addEventListener("keydown", handleEnterKey);
    return () => window.removeEventListener("keydown", handleEnterKey);
  }, [isDrawing, isRolling, availableNumbers, justStarted, maxNumber]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-white to-pink-50 flex flex-col items-center justify-center p-4 space-y-6">
      <h1 className="text-2xl font-extrabold text-pink-500">
        <span className="inline-block w-6 h-6 mr-1 align-middle">
          <img src="./icons/cherry_blossom_flat.svg" alt="sakura" className="w-full h-full" />
        </span>
        春祭り 抽選ツール
        <span className="inline-block w-6 h-6 ml-1 align-middle">
          <img src="./icons/cherry_blossom_flat.svg" alt="sakura" className="w-full h-full" />
        </span>
      </h1>

      <div className="relative bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm space-y-6 border border-pink-200">
        {hasSavedState ? (
          <div className="text-center space-y-3">
            <p className="text-pink-600 font-semibold">前回の抽選を再開しますか？</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleRestore}
                className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition"
              >
                はい
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 text-pink-600 rounded-full hover:bg-gray-300 transition"
              >
                いいえ
              </button>
            </div>
          </div>
        ) : !isDrawing ? (
          <input
            type="text"
            value={maxNumber}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^[1-9]\d*$/.test(value)) {
                setMaxNumber(value);
              }
            }}
            onBlur={() => /^[1-9]\d*$/.test(maxNumber) && startDrawing()}
            onKeyDown={handleEnterKey}
            className="w-full text-center text-lg text-pink-600 border border-pink-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-300"
            placeholder="最大番号を入力"
            inputMode="numeric"
            autoFocus
          />
        ) : (
          <>
            <div className="flex justify-center">
              <button
                onClick={drawNumber}
                disabled={availableNumbers.length === 0 || isRolling}
                className={`transition-transform duration-150 ${availableNumbers.length === 0 || isRolling ? "opacity-30 cursor-not-allowed" : "hover:scale-110"}`}
                aria-label="抽選"
              >
                <img src="./icons/party_popper_flat.svg" alt="draw" className="w-14 h-14" />
              </button>
            </div>

            <div className="h-20 flex items-center justify-center">
              {currentNumber !== null && (
                <div className="text-6xl font-bold text-pink-600 animate-pop">
                  {currentNumber}
                </div>
              )}
            </div>

            <div className="grid grid-cols-5 gap-2 text-sm">
              {drawnNumbers.map((num, index) => (
                <div key={index} className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-medium text-center shadow-sm">
                  {num}
                </div>
              ))}
            </div>

            <div className="absolute bottom-2 right-4 text-xs text-pink-400">
              {drawnNumbers.length} / {maxNumber}
            </div>
          </>
        )}
      </div>

      <style>{`
        .animate-pop {
          animation: pop 0.3s ease-out;
        }
        @keyframes pop {
          0% { transform: scale(0.6); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        input[type="number"].no-spinner::-webkit-inner-spin-button,
        input[type="number"].no-spinner::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"].no-spinner {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}
