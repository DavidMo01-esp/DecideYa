import { createContext, useContext, type ReactNode } from 'react';
import { useDecisions, type DecisionsStore } from '../hooks/useDecisions';

const DecisionContext = createContext<DecisionsStore | undefined>(undefined);

export const DecisionProvider = ({ children }: { children: ReactNode }) => {
  const decisionsStore = useDecisions();

  return (
    <DecisionContext.Provider value={decisionsStore}>
      {children}
    </DecisionContext.Provider>
  );
};

export const useDecisionContext = () => {
  const context = useContext(DecisionContext);

  if (!context) {
    throw new Error('useDecisionContext debe usarse dentro de un Provider');
  }

  return context;
};
