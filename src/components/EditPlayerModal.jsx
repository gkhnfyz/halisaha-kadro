
import React, { useState, useEffect } from 'react';
import './EditPlayerModal.css';

const EditPlayerModal = ({ player, onSave, onClose }) => {
  const [formData, setFormData] = useState({ ...player });

  useEffect(() => {
    setFormData({ ...player });
  }, [player]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const shot = parseInt(formData.shot || 80);
    const pass = parseInt(formData.pass || 80);
    const speed = parseInt(formData.speed || 80);
    const stamina = parseInt(formData.stamina || 80);
    const rating = Math.round((shot + pass + speed + stamina) / 4);

    onSave({
      ...formData,
      rating
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Oyuncu Bilgileri</h2>
        <form onSubmit={handleSubmit}>
          <label>İsim:
            <input name="name" value={formData.name} onChange={handleChange} required />
          </label>

          <label>Forma No:
            <input name="number" value={formData.number} onChange={handleChange} required />
          </label>

          <label>Pozisyon:
            <select name="position" value={formData.position} onChange={handleChange} required>
              <option value="GK">Kaleci</option>
              <option value="CB1">Defans - Sol</option>
              <option value="CB2">Defans - Orta</option>
              <option value="CB3">Defans - Sağ</option>
              <option value="CM1">Orta Saha - Sol</option>
              <option value="CM2">Orta Saha - Sağ</option>
              <option value="ST">Forvet</option>
            </select>
          </label>

          <label>Şut:
            <input name="shot" type="number" value={formData.shot || ''} onChange={handleChange} required />
          </label>

          <label>Pas:
            <input name="pass" type="number" value={formData.pass || ''} onChange={handleChange} required />
          </label>

          <label>Hız:
            <input name="speed" type="number" value={formData.speed || ''} onChange={handleChange} required />
          </label>

          <label>Dayanıklılık:
            <input name="stamina" type="number" value={formData.stamina || ''} onChange={handleChange} required />
          </label>

         

          <div className="modal-buttons">
            <button type="submit">Kaydet</button>
            <button type="button" onClick={onClose}>İptal</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPlayerModal;
