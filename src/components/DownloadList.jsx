import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchDownloads from "./SearchDownloads";
import styles from "./DownloadList.module.css";

const distributors = {
  "https://hydralinks.cloud/sources/dodi.json": "DD",
  "https://hydralinks.cloud/sources/empress.json": "PRESS",
  "https://hydralinks.cloud/sources/fitgirl.json": "WDB",
  "https://hydralinks.cloud/sources/gog.json": "GOG",
  "https://hydralinks.cloud/sources/onlinefix.json": "Fix",
};

const DownloadList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchDownloads = async () => {
      const urls = Object.keys(distributors);
      try {
        const requests = urls.map((url) => axios.get(url));
        const responses = await Promise.all(requests);

        const downloadsBySource = responses.map((response, index) =>
          response.data.downloads.map((item) => ({
            ...item,
            distributor: distributors[urls[index]],
          }))
        );

        const interleavedDownloads = [];
        const maxLength = Math.max(
          ...downloadsBySource.map((arr) => arr.length)
        );

        for (let i = 0; i < maxLength; i++) {
          downloadsBySource.forEach((source) => {
            if (source[i]) {
              interleavedDownloads.push(source[i]);
            }
          });
        }

        setItems(interleavedDownloads);
      } catch (error) {
        console.error("Erro ao buscar downloads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();
  }, []);

  const filteredItems = items.filter(
    (item) =>
      item.title &&
      item.title.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    if (currentPage > 1) {
      pageNumbers.push(
        <button key="first" onClick={() => paginate(1)}>
          &lt;&lt;
        </button>
      );
      pageNumbers.push(
        <button key="prev" onClick={() => paginate(currentPage - 1)}>
          &lt;
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          style={{ fontWeight: i === currentPage ? "bold" : "normal" }}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages) {
      pageNumbers.push(
        <button key="next" onClick={() => paginate(currentPage + 1)}>
          &gt;
        </button>
      );
      pageNumbers.push(
        <button key="last" onClick={() => paginate(totalPages)}>
          &gt;&gt;
        </button>
      );
    }

    return pageNumbers;
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <img
          src="https://media.tenor.com/ZU_roo1-yLoAAAAi/wolf-rennt-run.gif"
          alt="Carregando..."
          style={{ width: "30%", transform: "scaleX(-1)" }}
        />
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <SearchDownloads onSearch={handleSearch} />
      <div className={styles.container}>
        {currentItems.map((item) => (
          <div key={item.time} className={styles.gameSingle}>
            <h4>{item.title.replace(/\./g, " ")}</h4>
            <p>Tamanho: {item.fileSize}</p>
            <p>Distribuído por: {item.distributor}</p>
            <a
              href={item.uris[0]}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.downloadBtn}
            >
              Acesso
            </a>
          </div>
        ))}
      </div>
      <div className={styles.pagination}>{renderPageNumbers()}</div>
    </div>
  );
};

export default DownloadList;
