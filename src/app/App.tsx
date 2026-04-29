import { useState, useEffect, useRef } from "react";
import {
  Coffee,
  Plus,
  Trash2,
  Shuffle,
  RotateCcw,
  Play,
  Plane,
  UserCheck,
  RefreshCw,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Avatar } from "./components/Avatar";
import { coffeeApi } from "./utils/coffeeApi";

const COLORS = [
  "#f97316", // orange
  "#f59e0b", // amber
  "#84cc16", // lime
  "#22c55e", // green
  "#14b8a6", // teal
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#a855f7", // purple
  "#ec4899", // pink
];

interface TeamMember {
  id: number;
  name: string;
  onVacation: boolean;
  color: string;
}

interface DrawHistory {
  id: number;
  winner: string;
  date: string;
  participants: string[];
  color: string;
}

export default function App() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [newMemberName, setNewMemberName] = useState("");
  const [currentWinner, setCurrentWinner] = useState<
    string | null
  >(null);
  const [history, setHistory] = useState<DrawHistory[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showNewGameConfirm, setShowNewGameConfirm] =
    useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [drawnInRound, setDrawnInRound] = useState<number[]>(
    [],
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Try loading from Supabase
        const data = await coffeeApi.getData();

        if (data.members && data.members.length > 0) {
          const membersWithColors = data.members.map(
            (m: TeamMember, index: number) => ({
              ...m,
              color: m.color || COLORS[index % COLORS.length],
            }),
          );
          setMembers(membersWithColors);
        }

        if (data.history && data.history.length > 0) {
          const historyWithColors = data.history.map(
            (h: DrawHistory, index: number) => ({
              ...h,
              color: h.color || COLORS[index % COLORS.length],
            }),
          );
          setHistory(historyWithColors);
        }

        if (data.drawnInRound) {
          setDrawnInRound(data.drawnInRound);
        }
      } catch (error) {
        console.warn("Supabase not available, using localStorage fallback:", error);

        // Fallback to localStorage
        const savedMembers = localStorage.getItem("coffeeMembers");
        const savedHistory = localStorage.getItem("coffeeHistory");
        const savedDrawnInRound = localStorage.getItem("coffeeDrawnInRound");

        if (savedMembers) {
          const parsedMembers = JSON.parse(savedMembers);
          const membersWithColors = parsedMembers.map(
            (m: TeamMember, index: number) => ({
              ...m,
              color: m.color || COLORS[index % COLORS.length],
            }),
          );
          setMembers(membersWithColors);
        }

        if (savedHistory) {
          const parsedHistory = JSON.parse(savedHistory);
          const historyWithColors = parsedHistory.map(
            (h: DrawHistory, index: number) => ({
              ...h,
              color: h.color || COLORS[index % COLORS.length],
            }),
          );
          setHistory(historyWithColors);
        }

        if (savedDrawnInRound) {
          setDrawnInRound(JSON.parse(savedDrawnInRound));
        }
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      // Save to Supabase with localStorage fallback
      coffeeApi.saveMembers(members).catch((error) => {
        console.warn("Supabase not available, using localStorage:", error);
        localStorage.setItem("coffeeMembers", JSON.stringify(members));
      });
    }
  }, [members, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      // Save to Supabase with localStorage fallback
      coffeeApi.saveHistory(history).catch((error) => {
        console.warn("Supabase not available, using localStorage:", error);
        localStorage.setItem("coffeeHistory", JSON.stringify(history));
      });
    }
  }, [history, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      // Save to Supabase with localStorage fallback
      coffeeApi.saveDrawnInRound(drawnInRound).catch((error) => {
        console.warn("Supabase not available, using localStorage:", error);
        localStorage.setItem("coffeeDrawnInRound", JSON.stringify(drawnInRound));
      });
    }
  }, [drawnInRound, isLoaded]);

  const addMember = () => {
    if (newMemberName.trim()) {
      const newMember: TeamMember = {
        id: Date.now(),
        name: newMemberName.trim(),
        onVacation: false,
        color: COLORS[members.length % COLORS.length],
      };
      setMembers([...members, newMember]);
      setNewMemberName("");
    }
  };

  const removeMember = (id: number) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  const toggleVacation = (id: number) => {
    setMembers(
      members.map((member) =>
        member.id === id
          ? { ...member, onVacation: !member.onVacation }
          : member,
      ),
    );
  };

  const fireConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
    };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2,
        },
        colors: ["#0891b2", "#06b6d4", "#22d3ee", "#164e63"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2,
        },
        colors: ["#0891b2", "#06b6d4", "#22d3ee", "#164e63"],
      });
    }, 250);
  };

  const drawWinner = () => {
    const activeMembers = members.filter((m) => !m.onVacation);
    const availableMembers = activeMembers.filter(
      (m) => !drawnInRound.includes(m.id),
    );

    if (availableMembers.length === 0) return;

    setIsAnimating(true);
    setShowWinnerModal(false);

    let counter = 0;
    const maxCount = 20;

    const animate = () => {
      const randomIndex = Math.floor(
        Math.random() * availableMembers.length,
      );
      setCurrentWinner(availableMembers[randomIndex].name);
      counter++;

      if (counter >= maxCount) {
        const finalIndex = Math.floor(
          Math.random() * availableMembers.length,
        );
        const winnerMember = availableMembers[finalIndex];
        setCurrentWinner(winnerMember.name);

        const newHistoryEntry: DrawHistory = {
          id: Date.now(),
          winner: winnerMember.name,
          date: new Date().toISOString(),
          participants: activeMembers.map((m) => m.name),
          color: winnerMember.color,
        };
        setHistory([newHistoryEntry, ...history].slice(0, 6));

        const newDrawnInRound = [
          ...drawnInRound,
          winnerMember.id,
        ];

        if (newDrawnInRound.length >= activeMembers.length) {
          setDrawnInRound([]);
        } else {
          setDrawnInRound(newDrawnInRound);
        }

        setIsAnimating(false);
        setShowWinnerModal(true);
        fireConfetti();
      } else {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    const intervalSpeed = 100;
    const runAnimation = () => {
      animate();
      if (counter < maxCount) {
        setTimeout(runAnimation, intervalSpeed);
      }
    };

    runAnimation();
  };

  const resetCurrentDraw = () => {
    setCurrentWinner(null);
    setShowWinnerModal(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsAnimating(false);
  };

  const resetRound = () => {
    setDrawnInRound([]);
    setCurrentWinner(null);
    setShowWinnerModal(false);
  };

  const startNewGame = async () => {
    setShowNewGameConfirm(false);
    setMembers([]);
    setHistory([]);
    setCurrentWinner(null);
    setShowWinnerModal(false);
    setDrawnInRound([]);
    try {
      await coffeeApi.clearAllData();
    } catch (error) {
      console.warn("Supabase not available, clearing localStorage:", error);
      localStorage.removeItem("coffeeMembers");
      localStorage.removeItem("coffeeHistory");
      localStorage.removeItem("coffeeDrawnInRound");
    }
  };

  const clearHistory = async () => {
    setHistory([]);
    try {
      await coffeeApi.saveHistory([]);
    } catch (error) {
      console.warn("Supabase not available, using localStorage:", error);
      localStorage.removeItem("coffeeHistory");
    }
  };

  const activeMembers = members.filter((m) => !m.onVacation);
  const availableCount = activeMembers.filter(
    (m) => !drawnInRound.includes(m.id),
  ).length;
  const totalInRound = activeMembers.length;
  const drawnCount = activeMembers.filter((m) =>
    drawnInRound.includes(m.id),
  ).length;
  const currentWinnerMember = members.find(
    (m) => m.name === currentWinner,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Coffee className="w-12 h-12 text-cyan-700" />
            <h1 className="text-4xl text-cyan-900">
              Kawa prawem, nie towarem.
            </h1>
          </div>
          <p className="text-cyan-700">
            Kto kupuje kawę dla zespołu?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div
            className={`bg-white rounded-xl shadow-lg p-6 text-center transform transition-all ${
              isAnimating ? "scale-95 opacity-80" : "scale-100"
            }`}
          >
            {currentWinner &&
            !showWinnerModal &&
            currentWinnerMember ? (
              <>
                <p className="text-sm text-gray-600 mb-2">
                  Ostatnio wylosowana osoba:
                </p>
                <Avatar
                  name={currentWinner}
                  size="large"
                  className="mx-auto mb-2"
                />
                <p className="text-3xl text-cyan-900">
                  {currentWinner}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-400 mb-2">
                  Ostatnio wylosowana osoba:
                </p>
                <div className="w-24 h-24 rounded-full mx-auto mb-2 bg-gray-300" />
                <p className="text-xl text-gray-400">
                  Brak losowania
                </p>
              </>
            )}
          </div>

          {totalInRound > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-3">
                <p className="text-sm text-gray-600">
                  Postęp rundy
                </p>
                <p className="text-3xl text-cyan-900">
                  {drawnCount} / {totalInRound}
                </p>
              </div>
              <div className="flex gap-1 w-full">
                {Array.from({ length: totalInRound }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className={`flex-1 h-4 rounded-sm transition-all duration-500 ${
                        index < drawnCount
                          ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                          : "bg-gray-200"
                      }`}
                    />
                  ),
                )}
              </div>
              <p className="text-xs text-center text-gray-500 mt-3">
                {availableCount > 0
                  ? `Liczba osób w puli tego losowania: ${availableCount}`
                  : "Wszyscy wylosowani! Nowa runda zacznie się przy kolejnym losowaniu."}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 mb-6 justify-center flex-wrap">
          <button
            onClick={drawWinner}
            disabled={availableCount === 0 || isAnimating}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl px-6 py-3 flex items-center gap-2 transition-colors shadow-lg"
          >
            <Shuffle className="w-5 h-5" />
            Losuj {availableCount > 0 && `(${availableCount})`}
          </button>

          <button
            onClick={resetRound}
            disabled={drawnCount === 0}
            className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl px-6 py-3 flex items-center gap-2 transition-colors shadow-lg"
            title="Zresetuj rundę - wszyscy wracają do puli"
          >
            <RefreshCw className="w-5 h-5" />
            Reset Rundy
          </button>

          <button
            onClick={() => setShowNewGameConfirm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 flex items-center gap-2 transition-colors shadow-lg"
          >
            <Play className="w-5 h-5" />
            Nowa Gra
          </button>
        </div>

        {showWinnerModal &&
          currentWinner &&
          currentWinnerMember && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowWinnerModal(false)}
            >
              <div
                className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full transform scale-100 animate-bounce-in"
                onClick={(e) => e.stopPropagation()}
              >
                <Avatar
                  name={currentWinner}
                  size="xlarge"
                  className="mx-auto mb-4 animate-pulse"
                />
                <p className="text-2xl text-gray-600 mb-4">
                  Wylosowana osoba:
                </p>
                <p className="text-5xl text-cyan-900 mb-8">
                  {currentWinner}
                </p>
                <button
                  onClick={() => setShowWinnerModal(false)}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-8 py-3 transition-colors"
                >
                  OK
                </button>
              </div>
            </div>
          )}

        {showNewGameConfirm && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowNewGameConfirm(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl text-gray-800 mb-4">
                Nowa Gra
              </h3>
              <p className="text-gray-600 mb-6">
                Czy na pewno chcesz rozpocząć nową grę?
                Wszystkie dane zostaną usunięte.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={startNewGame}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 py-3 transition-colors"
                >
                  Tak, usuń wszystko
                </button>
                <button
                  onClick={() => setShowNewGameConfirm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-xl px-6 py-3 transition-colors"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl text-gray-800 mb-4">
              Kawosze ({members.length})
            </h2>

            <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
              {members.length === 0 ? (
                <p className="text-gray-400 text-center py-4">
                  Dodaj członków zespołu
                </p>
              ) : (
                members.map((member) => {
                  const isDrawn = drawnInRound.includes(
                    member.id,
                  );
                  return (
                    <div
                      key={member.id}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg ${
                        member.onVacation
                          ? "bg-gray-100 opacity-60"
                          : isDrawn
                            ? "bg-green-100 border-2 border-green-400"
                            : "bg-cyan-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar
                          name={member.name}
                          size="small"
                          className={
                            member.onVacation
                              ? "opacity-50"
                              : ""
                          }
                        />
                        <span className="text-gray-800">
                          {member.name}
                        </span>
                        {member.onVacation && (
                          <Plane className="w-4 h-4 text-blue-500" />
                        )}
                        {isDrawn && !member.onVacation && (
                          <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                            ✓ wylosowany
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            toggleVacation(member.id)
                          }
                          className={`${
                            member.onVacation
                              ? "text-blue-600"
                              : "text-gray-400"
                          } hover:text-blue-700 transition-colors`}
                          title={
                            member.onVacation
                              ? "Wróć z urlopu"
                              : "Idź na urlop"
                          }
                        >
                          {member.onVacation ? (
                            <UserCheck className="w-4 h-4" />
                          ) : (
                            <Plane className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() =>
                            removeMember(member.id)
                          }
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <input
                type="text"
                value={newMemberName}
                onChange={(e) =>
                  setNewMemberName(e.target.value)
                }
                onKeyPress={(e) =>
                  e.key === "Enter" && addMember()
                }
                placeholder="Dodaj kolejna osobę..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={addMember}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl text-gray-800">
                Historia losowań
              </h2>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Wyczyść historię
                </button>
              )}
            </div>
            <div className="space-y-3">
              {history.length === 0 ? (
                <p className="text-gray-400 text-center py-4">
                  Brak historii
                </p>
              ) : (
                history.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="bg-gradient-to-r from-cyan-50 to-blue-50 px-4 py-3 rounded-lg border-l-4 border-cyan-600"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={entry.winner}
                        size="small"
                      />
                      <div>
                        <p className="text-lg text-cyan-900">
                          #{history.length - index}.{" "}
                          {entry.winner}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(entry.date).toLocaleString(
                            "pl-PL",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Kawy możesz zamówić tu:
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="https://allegro.pl/uzytkownik/Blue_Orca_Coffee"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl px-6 py-3 transition-colors shadow-lg"
            >
              Blue Orca Coffee
            </a>
            <a
              href="https://allegro.pl/uzytkownik/YankeeCaffee"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl px-6 py-3 transition-colors shadow-lg"
            >
              Yankee Caffee
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}