import React, { useState } from "react";
import "../styles/dashboard.css";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import MemoryDisplay from "../components/MemoryDisplay";
import "../styles/header.css";

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [triggeredSearchTerm, setTriggeredSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = (e) => {
    e.preventDefault();
    setTriggeredSearchTerm(searchTerm);
    setIsSearching(searchTerm.trim().length > 0); // Only search if not empty
    // This sends the final search term to SearchBar
  };
  const handleBack = () => {
    setIsSearching(false);
    setSearchTerm("");
  };

  return (
    <div className="dashboard-container">
      <Header />
      <div className="search-container">
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search memories..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              
            }}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <main className="dashboard-main">
        {isSearching ? (
          <SearchBar searchTerm={triggeredSearchTerm} onBack={handleBack} />
        ) : (
          <MemoryDisplay />
        )}
      </main>
    </div>
  );
}

export default Dashboard;
