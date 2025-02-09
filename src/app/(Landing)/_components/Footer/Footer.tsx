import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <>
      <div className="flex w-full items-center justify-between dark:bg-dark px-4">
        <div className="flex items-center justify-start">
          <div>I</div>
          <p className="font-semibold text-xl text-center">Nest</p>
        </div>
        <div className="flex items-center justify-center">
          <Button variant={"link"}>Privacy Policy</Button>
          <Button variant={"link"}>T&C</Button>
        </div>
      </div>
    </>
  );
};

export default Footer;
