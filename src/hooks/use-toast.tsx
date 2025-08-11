// ToastManager.tsx (React Native version)
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme/colors';

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 2500; // 2.5 seconds

type Toast = {
  id: string;
  title: string;
  description?: string;
  open: boolean;
};

type ToastState = {
  toasts: Toast[];
};

type ToastAction = 
  | { type: 'ADD_TOAST'; toast: Toast }
  | { type: 'UPDATE_TOAST'; toast: Partial<Toast> & { id: string } }
  | { type: 'DISMISS_TOAST'; toastId?: string }
  | { type: 'REMOVE_TOAST'; toastId: string };

let count = 0;
function genId(): string {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const toastTimeouts = new Map<string, NodeJS.Timeout>();
const listeners: Array<(state: ToastState) => void> = [];
let memoryState: ToastState = { toasts: [] };

function dispatch(action: ToastAction): void {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
};

const reducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };
    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };
    case 'DISMISS_TOAST': {
      const { toastId } = action;
      if (toastId) addToRemoveQueue(toastId);
      else state.toasts.forEach((t) => addToRemoveQueue(t.id));
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === toastId || !toastId ? { ...t, open: false } : t)),
      };
    }
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    default:
      return state;
  }
};

function addToRemoveQueue(toastId: string): void {
  if (toastTimeouts.has(toastId)) return;
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: 'REMOVE_TOAST', toastId });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
}

function toast({ title, description }: { title: string; description?: string }) {
  const id = genId();
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });
  const update = (props: Partial<Toast>) => dispatch({ type: 'UPDATE_TOAST', toast: { ...props, id } });

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      id,
      title,
      description,
      open: true,
    },
  });

  // Auto-dismiss toast after delay
  setTimeout(() => {
    dispatch({ type: 'DISMISS_TOAST', toastId: id });
  }, TOAST_REMOVE_DELAY);

  return { id, dismiss, update };
}

function useToast() {
  const [state, setState] = useState(memoryState);
  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  };
}

const ToastContainer = () => {
  const { toasts } = useToast();

  if (!toasts.length) return null;

  return (
    <View style={[styles.toastContainer, { pointerEvents: 'box-none' }]}>
      {toasts.map((toast) => (
        <View key={toast.id} style={styles.toast}>
          <Text style={styles.title}>{toast.title}</Text>
          {toast.description ? <Text style={styles.description}>{toast.description}</Text> : null}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: spacing['5xl'],
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 9999,
  },
  toast: {
    backgroundColor: colors.success[500],
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    // Use boxShadow for React Native Web compatibility
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    // Keep individual shadow properties for native platforms
    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: colors.success[300],
  },
  title: {
    color: colors.gray[50],
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.base,
  },
  description: {
    color: colors.success[100],
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.4,
  },
});

export { useToast, toast, ToastContainer };