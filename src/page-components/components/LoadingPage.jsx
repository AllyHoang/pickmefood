import React from 'react';


const LoadingPage = () => {
  return (
<div className="flex justify-center items-center h-screen" style={{ paddingLeft: 'calc(70vh)' }}>

      <div className="w-32 h-32 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};
export default LoadingPage;
