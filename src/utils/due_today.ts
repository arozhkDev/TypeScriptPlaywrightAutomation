export const getDueToday = (sum: number) => {
  const now = new Date();
  const end = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  const dayCount = end.getDate();

  const dayCost = sum / dayCount;

  return (
    dayCost * Math.ceil((end.valueOf() - now.valueOf()) / 1000 / 60 / 60 / 24)
  );
};
