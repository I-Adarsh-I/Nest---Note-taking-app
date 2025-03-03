export const useGreet = () => {
  const myDate = new Date();
  const hrs = myDate.getHours();

  if (hrs < 12) return "Good Morning";
  if (hrs >= 12 && hrs <= 17) return "Good Afternoon";
  return "Good Evening";
};