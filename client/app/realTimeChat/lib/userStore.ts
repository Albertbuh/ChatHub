import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

interface IUseUserStore {
  currentUser: any;
  isLoading: boolean;
  fetchUserInfo: (uid: string | null) => void;
}

export const useUserStore = create<IUseUserStore>((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid: string | null) => {
    console.log("initial is loading state:", useUserStore.getState().isLoading);    
    if (!uid) return set({ currentUser: null, isLoading: false });

    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        set({ currentUser: docSnap.data(), isLoading: false });
      } else {
        set({ currentUser: null, isLoading: false });
      }
    console.log("2 is loading state:", useUserStore.getState().isLoading);    
    } catch (err) {
      console.log(err);
      return set({ currentUser: null, isLoading: false });
      
    }
    console.log("3 is loading state:", useUserStore.getState().isLoading);    

  },
}));
