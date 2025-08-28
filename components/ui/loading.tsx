import { FunctionComponent } from "react";

const Loading: FunctionComponent = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-400"></div>
    </div>
  );
};

export default Loading;
