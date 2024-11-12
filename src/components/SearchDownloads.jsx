import React, { useState } from "react";
import styles from "./SearchDownload.module.css";

const SearchDownloads = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Pesquisar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.srcInput}
      />
      <button onClick={handleSearch} className={styles.srcBtn}>
        Pesquisar
      </button>
    </div>
  );
};

export default SearchDownloads;
