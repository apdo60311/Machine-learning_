import React, { useState } from 'react';
import AdvancedMLLoader from './components/LoadingScreen';
import MachineLearningDashboard from './components/MLDashboard';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <AdvancedMLLoader onLoadingComplete={handleLoadingComplete} />
      ) : (
        <MachineLearningDashboard />
      )}
    </>
  );
}

export default App;