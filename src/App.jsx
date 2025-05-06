import React, { useState } from 'react';
import './App.css';
import EditPlayerModal from './components/EditPlayerModal';


function App() {
  const [players, setPlayers] = useState([]);
  
  
  const [benchPlayers, setBenchPlayers] = useState([]);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [isEditingBench, setIsEditingBench] = useState(false);
  const [isNewPlayer, setIsNewPlayer] = useState(false); // yeni oyuncu ekleme mi?
const saveToFile = () => {
  const data = {
    players,
    benchPlayers,
  };
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'halisaha_kadro.json';
  link.click();
  URL.revokeObjectURL(url);
};

const loadFromFile = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const data = JSON.parse(event.target.result);
    setPlayers(data.players || []);
    setBenchPlayers(data.benchPlayers || []);
  };
  reader.readAsText(file);
};

  const onDragStart = (player, isBench) => (e) => {
    e.dataTransfer.setData("player", JSON.stringify(player));
    e.dataTransfer.setData("from", isBench ? "bench" : "field");
  };

  const onDropToField = (e) => {
    e.preventDefault();
    const player = JSON.parse(e.dataTransfer.getData("player"));
    const from = e.dataTransfer.getData("from");
	const existing = players.find(
    (p) => p.position === player.position && p.name !== player.name
  );
  if (existing) {
    setPlayers((prev) => prev.filter((p) => p.name !== existing.name));
    setBenchPlayers((prev) => [...prev, { ...existing, isSub: true }]);
  }

    if (from === "bench") {
      setBenchPlayers((prev) => prev.filter(p => p.name !== player.name));
      setPlayers((prev) => [...prev, player]);
    }
  };

  const onDropToBench = (e) => {
    e.preventDefault();
    const player = JSON.parse(e.dataTransfer.getData("player"));
    const from = e.dataTransfer.getData("from");

    if (from === "field") {
      setPlayers((prev) => prev.filter(p => p.name !== player.name));
      setBenchPlayers((prev) => [...prev, player]);
    }
  };

  const addPlayer = () => {
    // Modalı boş bir oyuncuyla aç
    setEditingPlayer({
      name: '',
      number: '',
      position: 'GK',
      shot: 80,
      pass: 80,
      speed: 80,
      stamina: 80,
    });
    setIsEditingBench(false);
    setIsNewPlayer(true);
  };

  const editPlayer = (player, isBench) => (e) => {
    e.preventDefault();
    setEditingPlayer(player);
    setIsEditingBench(isBench);
    setIsNewPlayer(false);
  };
 const averageRating = players.length
    ? Math.round(players.reduce((sum, p) => sum + Number(p.rating || 0), 0) / players.length)
    : 0;

  const onSaveEdit = (updatedPlayer) => {
	  if (!updatedPlayer.isSub) {
    const existing = players.find(
      (p) => p.position === updatedPlayer.position && p.name !== updatedPlayer.name
    );
    if (existing) {
      setPlayers((prev) => prev.filter((p) => p.name !== existing.name));
      setBenchPlayers((prev) => [...prev, { ...existing, isSub: true }]);
    }
  }

  const rating = Math.round(
    (parseInt(updatedPlayer.shot) +
      parseInt(updatedPlayer.pass) +
      parseInt(updatedPlayer.speed) +
      parseInt(updatedPlayer.stamina)) / 4
  );
  updatedPlayer.rating = rating;
  if (!updatedPlayer.isSub) {
  const existing = players.find(
    (p) => p.position === updatedPlayer.position && p.name !== updatedPlayer.name
  );
  if (existing) {
    setPlayers((prev) => prev.filter((p) => p.name !== existing.name));
    setBenchPlayers((prev) => [...prev, { ...existing, isSub: true }]);
  }
}

  if (isNewPlayer) {
    if (updatedPlayer.isSub) {
      setBenchPlayers((prev) => [...prev, updatedPlayer]);
    } else {
      setPlayers((prev) => [...prev, updatedPlayer]);
    }
  } else {
    if (isEditingBench) {
      setBenchPlayers((prev) =>
        prev.map((p) =>
          p.name === editingPlayer.name ? updatedPlayer : p
        )
      );
    } else {
      setPlayers((prev) =>
        prev.map((p) =>
          p.name === editingPlayer.name ? updatedPlayer : p
        )
      );
    }
  }

  setEditingPlayer(null);
  setIsNewPlayer(false);
};


  return (
    <div className="container">
      <aside className="sidebar">
        <h1>Halı Saha Kadro Kurucu</h1>
        <button onClick={addPlayer}>Oyuncu Ekle</button>
		<button onClick={saveToFile}>Kaydet</button>
<label className="file-button">
  Yükle
  <input type="file" accept=".json" onChange={loadFromFile} hidden />
</label>


        <center><h2>Lineup</h2></center>
        <ul className="kadro-listesi">
          {[...players].sort((a, b) => a.number - b.number).map((p, i) => (
            <li key={i}>
              {p.number} {p.name} ({p.rating})
            </li>
          ))}
        </ul>
		<center><p><strong>Ortalama Reyting:</strong> {averageRating}</p></center>
      </aside>

      <main className="pitch-area">
        <div
          className="pitch"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDropToField}
        >
          {players.map((p, idx) => (
            <div
              className={`player ${p.position}`}
              key={idx}
              draggable
              onDragStart={onDragStart(p, false)}
              onContextMenu={editPlayer(p, false)}
              title={`${p.number} ${p.name} (${p.rating})`}
            >
              <img src={p.position === 'GK' ? '/jersey_gk.png' : '/jersey.png'} />
              <span>{p.number} {p.name}</span>
            </div>
          ))}

          {benchPlayers.slice(0, 4).map((p, idx) => (
            <div
              className={`player BENCH${idx + 1}`}
              key={`bench-${idx}`}
              draggable
              onDragStart={onDragStart(p, true)}
              onContextMenu={editPlayer(p, true)}
              title={`${p.number} ${p.name} (${p.rating})`}
            >
            <img
  src={p.position === 'GK' ? '/jersey_gk.png' : '/jersey.png'}
  alt="Forma"
  className="player-image"
/>



              <span>{p.number} {p.name}</span>
            </div>
          ))}
        </div>

        <div
          className="bench-dropzone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDropToBench}
        ></div>
      </main>

      {editingPlayer && (
        <EditPlayerModal
          player={editingPlayer}
          onSave={onSaveEdit}
          onClose={() => setEditingPlayer(null)}
        />
      )}
    </div>
  );
}

export default App;
