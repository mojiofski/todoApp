interface IContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: IContainerProps) => {
  return <div className="container mx-auto bg-white p-4 md:shadow-lg md:rounded-lg md:max-w-lg lg:max-w-xl">{children}</div>;
};

export default Container;
