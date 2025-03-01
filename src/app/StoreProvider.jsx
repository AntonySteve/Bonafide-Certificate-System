"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "../lib/store";
import { initializeCount } from "../lib/userSlice"; 

export default function StoreProvider({ count = 0, children }) {
  const storeRef = useRef(null);
  
  if (!storeRef.current) {
    storeRef.current = makeStore();
    storeRef.current.dispatch(initializeCount(count)); // ✅ Dispatch action
  }

  return <Provider store={storeRef.current}>
    {children}
    </Provider>;
}
