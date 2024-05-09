import { IoIosSearch } from "react-icons/io";
import styles from "./searchBar.module.css";

interface SearchBarProps {
    onUpdate: (filter: string) => void;
}
export default function SearchBar({ onUpdate }: SearchBarProps) {
    return (
        <div className={styles.search}>
            <div className={styles.searchBar}>
                <IoIosSearch className={styles.img} />
                <input
                    onChange={(e) => onUpdate(e.target.value)}
                    className={styles.input}
                    type="text"
                    placeholder="Search"
                />
            </div>
        </div>
    );
}
