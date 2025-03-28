import { useState } from "react";

export default function RaffleApp() {
  const [maxNumber, setMaxNumber] = useState(10);
  const [result, setResult] = useState(null);

  const drawNumber = () => {
    if (maxNumber < 1) return;
    const random = Math.floor(Math.random() * maxNumber) + 1;
    setResult(random);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">抽選ツール</h1>

        <label className="block mb-4">
          <span className="text-sm font-medium">最大の番号 (N)</span>
          <input
            type="number"
            value={maxNumber}
            min={1}
            onChange={(e) => setMaxNumber(Number(e.target.value))}
            className="mt-1 block w-full rounded-xl border border-gray-300 p-2 text-lg"
          />
        </label>

        <button
          onClick={drawNumber}
          className="w-full bg-blue-500 text-white text-lg py-2 rounded-xl hover:bg-blue-600 transition"
        >
          抽選する
        </button>

        {result && (
          <div className="mt-6 text-center text-3xl font-bold text-green-600">
            抽選結果: {result}
          </div>
        )}
      </div>
    </div>
  );
}
