import React, { useEffect, useState } from "react";
import countries from "./data.js";

const Translate = () => {
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");
  const [filteredCountriesFrom, setFilteredCountriesFrom] = useState(countries);
  const [filteredCountriesTo, setFilteredCountriesTo] = useState(countries);

  useEffect(() => {
    const fromText = document.querySelector(".from-text");
    const toText = document.querySelector(".to-text");
    const exchangeIcon = document.querySelector(".exchange");
    const selectTags = document.querySelectorAll("select");
    const icons = document.querySelectorAll(".row i");
    const translateBtn = document.querySelector("button.translate-btn");
    const speakBtn = document.querySelector("button.speak-btn");
    const clearBtn = document.querySelector("button.clear-btn");

    const speak = (text, lang) => {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = speechSynthesis.getVoices();
      const voice = voices.find((voice) => voice.lang === lang);
      if (voice) {
        utterance.voice = voice;
      }
      speechSynthesis.speak(utterance);
    };

    const handleSpeak = () => {
      const selectedLang = selectTags[1].value;
      speak(toText.value, selectedLang);
    };

    speakBtn.addEventListener("click", handleSpeak);

    exchangeIcon.addEventListener("click", () => {
      let tempText = fromText.value;
      let tempLang = selectTags[0].value;
      fromText.value = toText.value;
      toText.value = tempText;
      selectTags[0].value = selectTags[1].value;
      selectTags[1].value = tempLang;
    });

    fromText.addEventListener("keyup", () => {
      if (!fromText.value) {
        toText.value = "";
      }
    });

    const handleTranslate = async () => {
      let text = fromText.value.trim();
      let translateFrom = selectTags[0].value;
      let translateTo = selectTags[1].value;
      if (!text) return;
      toText.setAttribute("placeholder", "Translating...");
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://lai24a-k6.tekomits.my.id/api/?text=${text}&source=${translateFrom}&target=${translateTo}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const translatedText = await response.text();
        toText.value = translatedText;
        toText.setAttribute("placeholder", "Translation");

        saveTranslation(text, translatedText, translateFrom, translateTo);
      } catch (error) {
        console.error("Fetch error:", error);
        toText.setAttribute("placeholder", "Error in translation");
      }
    };

    translateBtn.addEventListener("click", handleTranslate);

    icons.forEach((icon) => {
      icon.addEventListener("click", ({ target }) => {
        if (!fromText.value || !toText.value) return;
        if (target.classList.contains("fa-copy")) {
          if (target.id === "from") {
            navigator.clipboard.writeText(fromText.value);
          } else {
            navigator.clipboard.writeText(toText.value);
          }
        } else {
          let utterance;
          if (target.id === "from") {
            utterance = new SpeechSynthesisUtterance(fromText.value);
            utterance.lang = selectTags[0].value;
          } else {
            utterance = new SpeechSynthesisUtterance(toText.value);
            utterance.lang = selectTags[1].value;
          }
          speechSynthesis.speak(utterance);
        }
      });
    });

    const handleVoicesChanged = () => {
      const voices = speechSynthesis.getVoices();
      // Example: Log the list of available voices
      console.log("Available voices:", voices);
    };

    speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);

    const handleClear = () => {
      fromText.value = "";
      toText.value = "";
    };

    clearBtn.addEventListener("click", handleClear);

    return () => {
      speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
      translateBtn.removeEventListener("click", handleTranslate);
      speakBtn.removeEventListener("click", handleSpeak);
      clearBtn.removeEventListener("click", handleClear);
    };
  }, []);

  const saveTranslation = async (originalText, translatedText, sourceLanguage, targetLanguage) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://lai24a-k6.tekomits.my.id/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ originalText, translatedText, sourceLanguage, targetLanguage }),
      });
      if (!response.ok) {
        throw new Error("Error saving translation");
      }
      console.log("Translation saved successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    setFilteredCountriesFrom(Object.fromEntries(Object.entries(countries).filter(([key, value]) => value.toLowerCase().includes(fromSearch.toLowerCase()))));
  }, [fromSearch]);

  useEffect(() => {
    setFilteredCountriesTo(Object.fromEntries(Object.entries(countries).filter(([key, value]) => value.toLowerCase().includes(toSearch.toLowerCase()))));
  }, [toSearch]);

  return (
    <>
      <div className="above-container">
        <h1 className="above-container-content">
          <span>Go</span> Translate
        </h1>
      </div>
      <div className="container">
        <ul className="controls">
          <li className="row to">
            <input type="text" value={toSearch} onChange={(e) => setToSearch(e.target.value)} placeholder="Search language" className="search-input" />
            <select className="language-select">
              {Object.entries(filteredCountriesTo).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
            <div className="icons">
              <i id="to" className="fas fa-volume-up"></i>
              <i id="to" className="fas fa-copy"></i>
            </div>
          </li>
          <li className="exchange">
            <i className="fas fa-exchange-alt"></i>
          </li>
          <li className="row from">
            <input type="text" value={fromSearch} onChange={(e) => setFromSearch(e.target.value)} placeholder="Search language" className="search-input" />
            <select className="language-select">
              {Object.entries(filteredCountriesFrom).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
            <div className="icons">
              <i id="from" className="fas fa-volume-up"></i>
              <i id="from" className="fas fa-copy"></i>
            </div>
          </li>
        </ul>
        <div className="wrapper">
          <div className="text-input">
            <textarea spellCheck="false" className="from-text" placeholder="Enter text"></textarea>
            <textarea spellCheck="false" readOnly disabled className="to-text" placeholder="Translation"></textarea>
          </div>
        </div>
        <button className="translate-btn">Translate</button>
        <button className="speak-btn">Speak</button>
        <button className="clear-btn">Clear</button>
      </div>
    </>
  );
};

export default Translate;
