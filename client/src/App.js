import React from 'react';
import './App.css';
import CompanyCampaignForm from './components/CompanyCampaignForm';

function App() {
  return (
    <div className="App" style={{ padding: "40px" }}>
      <h1 style={{ textAlign: "center", color: "#0000cc" }}>Campaign Post Generator</h1>
      <CompanyCampaignForm />
    </div>
  );
}

export default App;
