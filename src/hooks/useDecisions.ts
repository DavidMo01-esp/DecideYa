import { useCallback, useEffect, useRef, useState } from 'react';
import { apiClient, getApiErrorMessage } from '../api/client';
import type { CreateDecisionDTO, Decision, NetworkState } from '../types/api';

export interface DecisionsStore {
  decisions: Decision[];
  networkState: NetworkState<Decision[]>;
  addDecision: (
    title: string,
    options: string[],
    selectedOption?: string | null,
  ) => Promise<void>;
  removeDecision: (id: string) => Promise<void>;
  setSelectedOption: (id: string, selectedOption: string | null) => Promise<void>;
  refresh: () => void;
}

export const useDecisions = (): DecisionsStore => {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [networkState, setNetworkState] = useState<NetworkState<Decision[]>>({
    status: 'loading',
  });
  const decisionsRef = useRef<Decision[]>([]);

  const syncDecisions = useCallback((nextDecisions: Decision[]) => {
    decisionsRef.current = nextDecisions;
    setDecisions(nextDecisions);
    setNetworkState({ status: 'success', data: nextDecisions });
  }, []);

  const fetchDecisions = useCallback(async () => {
    setNetworkState({ status: 'loading' });

    try {
      const data = await apiClient.getDecisions();
      syncDecisions(data);
    } catch (error) {
      setNetworkState({
        status: 'error',
        message: getApiErrorMessage(error, 'Error al cargar decisiones.'),
      });
    }
  }, [syncDecisions]);

  useEffect(() => {
    void fetchDecisions();
  }, [fetchDecisions]);

  const addDecision = useCallback(
    async (
      title: string,
      options: string[],
      selectedOption?: string | null,
    ) => {
      const payload: CreateDecisionDTO = { title, options, selectedOption };
      setNetworkState({ status: 'loading' });

      try {
        const createdDecision = await apiClient.createDecision(payload);
        syncDecisions([...decisionsRef.current, createdDecision]);
      } catch (error) {
        setNetworkState({
          status: 'error',
          message: getApiErrorMessage(error, 'Error al crear la decision.'),
        });
        throw error;
      }
    },
    [syncDecisions],
  );

  const removeDecision = useCallback(
    async (id: string) => {
      setNetworkState({ status: 'loading' });

      try {
        await apiClient.deleteDecision(id);
        syncDecisions(
          decisionsRef.current.filter((decision) => decision.id !== id),
        );
      } catch (error) {
        setNetworkState({
          status: 'error',
          message: getApiErrorMessage(error, 'Error al eliminar la decision.'),
        });
        throw error;
      }
    },
    [syncDecisions],
  );

  const setSelectedOption = useCallback(
    async (id: string, selectedOption: string | null) => {
      setNetworkState({ status: 'loading' });

      try {
        const updatedDecision = await apiClient.updateDecision(id, {
          selectedOption,
        });
        syncDecisions(
          decisionsRef.current.map((decision) =>
            decision.id === id ? updatedDecision : decision,
          ),
        );
      } catch (error) {
        setNetworkState({
          status: 'error',
          message: getApiErrorMessage(error, 'Error al guardar la seleccion.'),
        });
        throw error;
      }
    },
    [syncDecisions],
  );

  const refresh = useCallback(() => {
    void fetchDecisions();
  }, [fetchDecisions]);

  return {
    decisions,
    networkState,
    addDecision,
    removeDecision,
    setSelectedOption,
    refresh,
  };
};
