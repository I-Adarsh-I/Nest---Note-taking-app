export const useGreet = () => {
  let greet = "";
  const myDate = new Date();
  const hrs = myDate.getHours();
  console.log(hrs);
  if (hrs < 12) return (greet = "Good Morning");
  else if (hrs >= 12 && hrs <= 17) return (greet = "Good Afternoon");
  else if (hrs >= 17 && hrs <= 24) return (greet = "Good Evening");
};
