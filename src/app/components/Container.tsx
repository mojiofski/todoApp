interface IContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: IContainerProps) => {
  return (
    <div className="container mx-auto p-4 md:shadow-xl md:rounded-xl md:max-w-lg lg:max-w-xl  bg-backgroundContainer ">
      {children}
    </div>
  );
};

export default Container;
