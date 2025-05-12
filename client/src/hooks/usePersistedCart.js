import { useState, useEffect } from 'react';

export const usePersistedCart = (key, initialValue) => {
    const [state, setState] = useState(() => {
        try {
            const storedValue = window.localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) : initialValue;
        } catch {
            return initialValue;
        }
    });

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    const clearSelectedItems = (itemIdsToRemove) => {
        setState((prev) =>
            prev.filter((item) => !itemIdsToRemove.includes(item.itemId))
        );
    };

    return [state, setState, clearSelectedItems];
};
