'use client';

// Shared, in-memory prototype plan. Survives client-side route navigation, resets on refresh.
import { useSyncExternalStore, type SetStateAction } from 'react';
import { initialActions, TODAY, type Action } from './mock-data';

let actions: Action[] = initialActions;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};

function setActions(update: SetStateAction<Action[]>) {
  actions = typeof update === 'function' ? update(actions) : update;
  listeners.forEach((listener) => listener());
}

export function addCareerAction(action: { id: string; title: string; due: string; competencyId: string; roleId: string; outcome?: string }) {
  setActions((list) => [...list, { ...action, status: 'todo', outcome: action.outcome ?? '', source: 'you', added: TODAY }]);
}

export function useActionPlan() {
  const snapshot = useSyncExternalStore(subscribe, () => actions, () => initialActions);
  return [snapshot, setActions] as const;
}
