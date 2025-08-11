import React, { useRef, useState, useEffect } from "react";
import { MDBBtn, MDBSelect } from "mdb-react-ui-kit";

const Start = ({ setName, setTimeOut }) => {
  const inputRef = useRef();
  const [savedNames, setSavedNames] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const [showNewNameInput, setShowNewNameInput] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    // Load saved names from localStorage
    const names = JSON.parse(localStorage.getItem('kbcPlayerNames') || '[]');
    setSavedNames(names);
  }, []);

  const handleClick = () => {
    setTimeOut(false);
    const nameToUse = showNewNameInput || savedNames.length === 0 ? newName : selectedName;
    if (nameToUse && nameToUse.trim() !== "") {
      setName(nameToUse.trim());
      // Save new name to localStorage if it's a new name
      if ((showNewNameInput || savedNames.length === 0) && !savedNames.includes(nameToUse.trim())) {
        const updatedNames = [...savedNames, nameToUse.trim()];
        localStorage.setItem('kbcPlayerNames', JSON.stringify(updatedNames));
        setSavedNames(updatedNames);
      }
      setNewName("");
      setSelectedName("");
    }
  };

  const handleNewNameClick = () => {
    setShowNewNameInput(true);
    setSelectedName("");
    setNewName("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSelectName = (name) => {
    setSelectedName(name);
    setShowNewNameInput(false);
    setNewName("");
  };
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        backgroundImage: "url('https://i.pinimg.com/originals/f1/17/23/f11723f9894882a76ce18a626cc5ad69.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center 0%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          margin: "auto",
          padding: "20px",
          maxWidth: "400px",
          width: "95vw",
          minWidth: 0,
          alignContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          borderRadius: "15px",
          backdropFilter: "blur(10px)",
          boxSizing: "border-box",
        }}
      >
        <h3 style={{ color: "white", textAlign: "center", marginBottom: "20px", fontSize: "2rem" }}>
          Welcome to KBC Quiz Game
        </h3>
        
        {savedNames.length > 0 && !showNewNameInput && (
          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: "white", marginBottom: "10px", display: "block" }}>
              Choose Previous Player:
            </label>
            <select 
              className="form-control mb-2"
              value={selectedName}
              onChange={(e) => handleSelectName(e.target.value)}
            >
              <option value="">Select a player...</option>
              {savedNames.map((name, index) => (
                <option key={index} value={name}>{name}</option>
              ))}
            </select>
            <MDBBtn 
              style={{ width: "100%" }} 
              color="info" 
              onClick={handleNewNameClick}
            >
              Enter New Name
            </MDBBtn>
          </div>
        )}

        {showNewNameInput && (
          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: "white", marginBottom: "10px", display: "block" }}>
              Enter New Player Name:
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              ref={inputRef}
              className="form-control mb-2"
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />
            <MDBBtn 
              style={{ width: "100%" }} 
              color="secondary" 
              onClick={() => {
                setShowNewNameInput(false);
                setSelectedName("");
                setNewName("");
              }}
            >
              Back to Previous Players
            </MDBBtn>
          </div>
        )}

        {savedNames.length === 0 && (
          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: "white", marginBottom: "10px", display: "block" }}>
              Enter Your Name:
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              ref={inputRef}
              className="form-control"
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />
          </div>
        )}

        <MDBBtn 
          style={{ width: "100%" }} 
          color="success" 
          onClick={handleClick}
          disabled={
            (showNewNameInput || savedNames.length === 0)
              ? newName.trim() === ""
              : selectedName.trim() === ""
          }
        >
          Start Game
        </MDBBtn>
      </div>
    </div>
  );
};

export default Start;
