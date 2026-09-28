export const getRewards = () => {
  return JSON.parse(localStorage.getItem("rewards")) || {
    points: 0,
    history: []
  };
};

export const addRewards = (points, reason) => {
  const rewards = getRewards();

  rewards.points += points;
  rewards.history.push({
    points,
    reason,
    date: new Date().toLocaleString()
  });

  localStorage.setItem("rewards", JSON.stringify(rewards));
};

export const redeemRewards = (points) => {
  const rewards = getRewards();

  if (rewards.points < points) return false;

  rewards.points -= points;
  rewards.history.push({
    points: -points,
    reason: "Redeemed",
    date: new Date().toLocaleString()
  });

  localStorage.setItem("rewards", JSON.stringify(rewards));
  return true;
};
