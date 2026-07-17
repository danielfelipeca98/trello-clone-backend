// src/components/AddMemberForm.jsx
import React, { useState } from 'react';

function AddMemberForm({ boardId }) {
  const [email, setEmail] = useState('');

  const handleAddMember = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/boards/${boardId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        alert('Usuario agregado como miembro');
        setEmail('');
      } else {
        const data = await response.json();
        alert(data.error || 'Error al agregar miembro');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  return (
    <form onSubmit={handleAddMember} className="add-member-form">
      <input
        type="email"
        placeholder="Email del usuario..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Agregar Miembro</button>
    </form>
  );
}

export default AddMemberForm;