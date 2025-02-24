interface IContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: IContainerProps) => {
  return (
    <div className="container bg-background mx-auto p-4 mt-4 md:shadow-xl md:rounded-xl md:max-w-lg lg:max-w-xl  ">
      <div className="text-foreground flex justify-center w-full text-sm">
        {new Date().toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </div>
      {children}
    </div>
  );
};

export default Container;
