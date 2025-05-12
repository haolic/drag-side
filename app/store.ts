import { create } from "zustand";

interface Store {
  leftSideCompKey: string[];
  rightSideCompKey: string[];
  draggingCompKey: string;
}

const useStore = create<Store>(() => ({
  leftSideCompKey: [],
  rightSideCompKey: [],
  draggingCompKey: "",
}));

export default useStore;
