import "./leaderboard.css";
import { useLeaderBoard } from "../../hooks/useLeaderBoard";

export const LeaderBoard = () => {
  const { getLeaderBoard } = useLeaderBoard();
  const leaderboard = getLeaderBoard().slice(0, 5);

  if (leaderboard.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="leaderboard-title" className="leaderboard">
      <h2 id="leaderboard-title" className="leaderboard-title">
        Top 5 Players
      </h2>
      <ol aria-label="Leaderboard rankings from highest to lowest score">
        {leaderboard.map((player, index) => (
          <li
            key={`${player.name}-${player.score}`}
            className="leaderboard-item"
            aria-label={`Rank ${index + 1}: ${player.name} with ${
              player.score
            } points`}
          >
            <span className="rank" aria-hidden="true">
              {index + 1}.
            </span>
            <span className="player-name">{player.name}</span>
            <span
              className="player-score"
              aria-label={`${player.score} points`}
            >
              {player.score}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
};
