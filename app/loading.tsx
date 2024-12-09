import React from 'react';

interface LoadingProps {
  text?:string
}


const Loading: React.FC<LoadingProps> = ({text}) => {
  return (
    <div className="flex items-center flex-col justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-mainGreen"></div>
      <div className='text-lg mt-2'>{text}</div>
    </div>
  );
};

export default Loading;
