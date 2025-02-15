const PublicLayout = ({ children }: { children: React.ReactNode }) => {
    return <div className="h-full flex-1 overflow-y-auto dark:bg-dark">{children}</div>;
  };
  
  export default PublicLayout;  