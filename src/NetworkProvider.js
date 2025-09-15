import NetInfo from '@react-native-community/netinfo';
import React, { createContext, useContext, useEffect, useState } from 'react';
import OfflineBanner from './components/OfflineBanner';

const NetworkContext = createContext({ isConnected: true, isInternetReachable: true });
export const useNetwork = () => useContext(NetworkContext);

export default function NetworkProvider({ children }) {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(Boolean(state.isConnected));
      if (typeof state.isInternetReachable === 'boolean') {
        setIsInternetReachable(state.isInternetReachable);
      }
    });

    NetInfo.fetch().then(s => {
      setIsConnected(Boolean(s.isConnected));
      if (typeof s.isInternetReachable === 'boolean') setIsInternetReachable(s.isInternetReachable);
    });

    return () => unsubscribe();
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected, isInternetReachable }}>
      {children}
      {(!isConnected || isInternetReachable === false) && <OfflineBanner />}
    </NetworkContext.Provider>
  );
}
