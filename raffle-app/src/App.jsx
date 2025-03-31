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
  const [isFinalNumber, setIsFinalNumber] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [justStarted, setJustStarted] = useState(false);

  // 保存と復元処理
  useEffect(() => {
    const saved = localStorage.getItem("raffleState");
    if (saved) {
      const state = JSON.parse(saved);
      setMaxNumber(state.maxNumber);
      setAvailableNumbers(state.availableNumbers);
      setDrawnNumbers(state.drawnNumbers);
      setCurrentNumber(state.currentNumber);
      setIsDrawing(true);
    }
  }, []);

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

    // 保存状態をクリア
    localStorage.removeItem("raffleState");

    setTimeout(() => setJustStarted(false), 300);
  };

  const drawNumber = () => {
    if (!isDrawing || availableNumbers.length === 0 || isRolling) return;

    const next = availableNumbers[0];
    const se = new Audio("sounds/se.mp3");

    setIsFinalNumber(false);
    setIsRolling(true);

    let count = 0;
    const interval = setInterval(() => {
      const fake = Math.floor(Math.random() * Number(maxNumber)) + 1;
      setCurrentNumber(fake);
      count++;

      if (count >= 15) {
        clearInterval(interval);
        setCurrentNumber(next);
        setIsFinalNumber(true);
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

  useEffect(() => {
    window.addEventListener("keydown", handleEnterKey);
    return () => window.removeEventListener("keydown", handleEnterKey);
  }, [isDrawing, isRolling, availableNumbers, justStarted, maxNumber]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-white flex flex-col items-center justify-center p-4 space-y-4">
      <h1 className={`text-xl font-bold text-pink-500 transition-opacity duration-500 ${isDrawing ? "opacity-0" : "opacity-100"}`}>
        <span className="inline-block w-6 h-6 mr-1 align-middle">
          <img src="./icons/cherry_blossom_flat.svg" alt="sakura" className="w-full h-full" />
        </span>
        春祭り 抽選ツール
        <span className="inline-block w-6 h-6 ml-1 align-middle">
          <img src="./icons/cherry_blossom_flat.svg" alt="sakura" className="w-full h-full" />
        </span>
      </h1>

      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm space-y-4 border border-pink-200">
        {!isDrawing ? (
          <input
            type="text"
            value={maxNumber}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^[1-9]\d*$/.test(value)) {
                setMaxNumber(value);
              }
            }}
            onBlur={() => {
              if (!isDrawing && /^[1-9]\d*$/.test(maxNumber)) {
                startDrawing();
              }
            }}
            onKeyDown={handleEnterKey}
            className="w-full rounded-xl border border-pink-300 px-4 py-3 text-center text-lg text-pink-600 focus:ring-2 focus:ring-pink-300 outline-none no-spinner"
            placeholder=""
            inputMode="numeric"
            autoFocus
          />
        ) : (
          <>
            <div className="flex justify-center">
              <button
                onClick={drawNumber}
                disabled={availableNumbers.length === 0 || isRolling}
                className={`text-5xl transition-transform duration-150 ${
                  availableNumbers.length === 0 || isRolling
                    ? "opacity-20 cursor-not-allowed"
                    : "hover:scale-110"
                }`}
                aria-label="抽選"
              >
                <img src="./icons/party_popper_flat.svg" alt="draw" className="w-12 h-12" />
              </button>
            </div>

            <div className="h-20 flex items-center justify-center">
              {currentNumber !== null && (
                <div
                  className={`text-5xl font-bold text-pink-600 ${
                    isFinalNumber ? "animate-pop" : ""
                  }`}
                >
                  {currentNumber}
                </div>
              )}
            </div>

            <div className="grid grid-cols-5 gap-2 text-sm">
              {drawnNumbers.map((num, index) => (
                <div
                  key={index}
                  className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-medium text-center shadow-sm"
                >
                  {num}
                </div>
              ))}
            </div>

            <div className="absolute bottom-2 right-3 text-xs text-pink-400">
              {drawnNumbers.length} / {maxNumber}
            </div>
          </>
        )}
      </div>

      <style>{`
        .animate-pop {
          animation: pop 0.25s ease-out;
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
