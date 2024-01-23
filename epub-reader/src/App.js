import React, { useState, useEffect, useRef } from "react";
import FileUpload from "./FileUpload";
import EPUB from "epubjs";

import "./App.css";

const App = () => {
  const [book, setBook] = useState(null);
  const [file, setFile] = useState(null);
  const [toc, setToc] = useState([]);
  const [rendition, setRendition] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const bookAreaRef = useRef(null);

  const onFileSelect = async (selectedFile) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const bookData = event.target.result;
      const book = new EPUB(bookData);
      setBook(book);

      book.loaded.navigation.then((navigation) => {
        setToc(navigation.toc);
      });

      const newRendition = book.renderTo("book-area", {
        flow: "scrolled",
        width: "50vw",
      });
      setRendition(newRendition);

      setFile(selectedFile);
    };
    if (selectedFile) {
      reader.readAsArrayBuffer(selectedFile);
    } else {
      console.error("No file selected");
    }
  };

  const handleDownload = () => {
    if (file) {
      const url = window.URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name || "download.epub";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } else {
      console.error("No file to download");
    }
  };
  const handleChapter = (href) => {
    if (rendition) {
      rendition.display(href);
    }
  };

  const renderTOC = (toc) => {
    if (!toc || toc.length === 0) {
      return <p>No table of contents available.</p>;
    }
    console.log(toc);

    let spine_get = rendition.book.spine.get.bind(rendition.book.spine);
    rendition.book.spine.get = function (target) {
      let t = spine_get(target);
      console.log(t);
      while (t == null && target.startsWith("../")) {
        target = target.substring(3);
        t = spine_get(target);
      }
      return t;
    };

    console.log(toc);

    return (
      <div>
        {toc.map((item, index) =>
          selectedChapter == index ? (
            <div key={index} className="selected-toc-item">
              <p
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleChapter(item.href);
                  setSelectedChapter(index);
                }}
              >
                {item.label}
              </p>
            </div>
          ) : (
            <div key={index} className="toc-item">
              <p
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleChapter(item.href);
                  setSelectedChapter(index);
                }}
              >
                {item.label}
              </p>
            </div>
          )
        )}
      </div>
    );
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className={`app-container ${showSidebar ? "show-sidebar" : ""}`}>
      <button onClick={toggleSidebar} className="toggle-toc-button"></button>
      <div className="toc-button-content"></div>
      <div className="sidebar">
        <div className="container">
          <h1>Minis' EPUB Reader</h1>
          <FileUpload onFileSelect={onFileSelect} />
          <div className="button">
            <button onClick={handleDownload} disabled={!file}>
              Download Book
            </button>
          </div>
          <h2>Table of Contents</h2>
          {renderTOC(toc)}
        </div>
      </div>

      <div className="content">
        <div className="center-content">
          {selectedChapter != null && selectedChapter > 0 ? (
            <button
              className="prev-chapter-button"
              onClick={() => {
                handleChapter(toc[Math.max(0, selectedChapter - 1)].href);
                setSelectedChapter(Math.max(0, selectedChapter - 1));
              }}
            ></button>
          ) : null}
          <div className="prev-chapter-background"></div>

          <div id="book-area" ref={bookAreaRef}></div>
          {selectedChapter != null && selectedChapter < toc.length - 1 ? (
            <button
              className="next-chapter-button"
              onClick={() => {
                handleChapter(
                  toc[Math.min(toc.length - 1, selectedChapter + 1)].href
                );
                setSelectedChapter(
                  Math.min(toc.length - 1, selectedChapter + 1)
                );
              }}
            ></button>
          ) : null}
          <div className="next-chapter-background"></div>
        </div>
      </div>
    </div>
  );
};

export default App;
