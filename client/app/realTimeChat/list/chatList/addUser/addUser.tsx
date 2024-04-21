import { IoIosSearch } from "react-icons/io";
import styles from "./addUser.module.css";
import { useEffect, useState } from "react";
import {
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "@/app/realTimeChat/lib/firebase";
import { useUserStore } from "@/app/realTimeChat/lib/userStore";

interface User {
    id: string;
    username: string;
    avatar?: string;
}

const AddUser = () => {
    const [user, setUser] = useState<User | null>(null);

    const { currentUser } = useUserStore();

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Searching for user...");

        const formData = new FormData(e.target as HTMLFormElement);
        const username = formData.get("username") as string;

        console.log(`Searching for user with username: ${username}`);

        try {
            const userRef = collection(db, "users");

            const q = query(userRef, where("username", "==", username));

            const querySnapShot = await getDocs(q);

            if (!querySnapShot.empty) {
                setUser(querySnapShot.docs[0].data() as User);
                console.log(`Set user state to:`, user);
            }
        } catch (err) {
            console.log(err);
        }
    };
      

      const handleAdd = async () => {
        const chatRef = collection(db, "chats");
        const userChatsRef = collection(db, "userchats");
    
        try {
          const newChatRef = doc(chatRef);
    
          await setDoc(newChatRef, {
            createdAt: serverTimestamp(),
            messages: [],
          });
    
          console.log('new chat Ref id is', newChatRef.id)
          await updateDoc(doc(userChatsRef, user!.id), {
            chats: arrayUnion({
              chatId: newChatRef.id,
              lastMessage: "",
              receiverId: currentUser.id,
              updatedAt: Date.now(),
            }),
          });
    
          await updateDoc(doc(userChatsRef, currentUser.id), {
            chats: arrayUnion({
              chatId: newChatRef.id,
              lastMessage: "",
              receiverId: user!.id,
              updatedAt: Date.now(),
            }),
          });
        } catch (err) {
          console.log(err);
        }
      };

    return (
        <div className={styles.addUser}>
            <form className={styles.userForm} onSubmit={handleSearch} >
                <div className={styles.searchBar}>
                    <IoIosSearch className={styles.img} />
                    <input className={styles.input} name="username" type='text' placeholder='Search' />
                </div>
                <button className={styles.userAddBtn}>Search</button>
            </form>
            
            {user && ( 
            <div className={styles.user}>
                <div className={styles.detail}>
                    <img className={styles.addUserImg} src={ user.avatar || "/Nesterenkov.jpg"} alt="" />
                    <span className={styles.addUserSpan}>
                        {user.username}
                    </span>
                </div>
                <button className={styles.userAddBtn} onClick={handleAdd}>Add User</button>
            </div>
             )} 
        </div>
    );
};

export default AddUser;