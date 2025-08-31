export type LeaderBoardEntry = {
  name: string;
  score: number;
};

export type UseLeaderBoardReturn = {
  getLeaderBoard: () => LeaderBoardEntry[];
  addScore: (name: string, score: number) => void;
  clearLeaderBoard: () => void;
};

export const parseLeaderBoard = (data: string | null): LeaderBoardEntry[] => {
  if (!data) return [];
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const sortLeaderBoard = (
  entries: LeaderBoardEntry[]
): LeaderBoardEntry[] => {
  return entries.sort((a, b) => b.score - a.score);
};

export const updatePlayerScore = (
  currentPlayers: LeaderBoardEntry[],
  name: string,
  score: number
): LeaderBoardEntry[] => {
  const existingPlayer = currentPlayers.find((entry) => entry.name === name);
  const shouldUpdate = !existingPlayer || score > existingPlayer.score;

  if (!shouldUpdate) {
    return currentPlayers;
  }

  const filteredEntries = currentPlayers.filter((entry) => entry.name !== name);
  return [...filteredEntries, { name, score }];
};

export const useLeaderBoard = (
  storageKey: string = "leaderBoard"
): UseLeaderBoardReturn => {
  const getLeaderBoard = (): LeaderBoardEntry[] => {
    const data = localStorage.getItem(storageKey);
    const parsed = parseLeaderBoard(data);
    return sortLeaderBoard(parsed);
  };

  const addScore = (name: string, score: number): void => {
    const currentEntries = parseLeaderBoard(localStorage.getItem(storageKey));
    const updatedEntries = updatePlayerScore(currentEntries, name, score);
    localStorage.setItem(storageKey, JSON.stringify(updatedEntries));
  };

  const clearLeaderBoard = (): void => {
    localStorage.removeItem(storageKey);
  };

  return {
    getLeaderBoard,
    addScore,
    clearLeaderBoard,
  };
};
