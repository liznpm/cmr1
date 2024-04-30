import React, { useState, useEffect } from 'react';
import './Home.css';

interface FormData {
  id: string;
  phone: string; // Cambiado de number a string
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    id: '',
    phone: '', // Cambiado de 0 a ''
  });
  const [editFormData, setEditFormData] = useState<FormData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<FormData[]>([]);

  useEffect(() => {
    readGoogleSheet();
  }, []);

  const readGoogleSheet = () => {
    fetch("https://sheetdb.io/api/v1/njckq9betnh15")
      .then((response) => response.json())
      .then((data) => setData(data));
  };

  const updateGoogleSheet = (id: string) => {
    const { id: editId, phone: editPhone } = editFormData || {};

    if (!editId || !editPhone) {
      console.error('Incomplete editing data. Cannot proceed.');
      return;
    }

    if (!id) {
      console.error('Missing ID. Cannot proceed with the update.');
      return;
    }

    const updatedData = {
      id: editId,
      phone: editPhone,
    };

    const apiUrl = `https://sheetdb.io/api/v1/njckq9betnh15/id/${id}`;

    console.log('Updating data with ID:', id);
    console.log('Updated data:', updatedData);

    fetch(apiUrl, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: updatedData,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to update data. Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Data updated successfully:', data);
        closeEditModal();
        readGoogleSheet();
      })
      .catch((error) => {
        console.error(`Error during the request to ${apiUrl}:`, error.message);
      });
  };

  const deleteGoogleSheet = (id: string) => {
    fetch(`https://sheetdb.io/api/v1/njckq9betnh15/id/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(() => readGoogleSheet());
  };

  const createGoogleSheet = () => {
    fetch("https://sheetdb.io/api/v1/njckq9betnh15", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [formData],
      }),
    })
      .then((response) => response.json())
      .then(() => {
        setFormData({ id: '', phone: '' }); // Cambiado de 0 a ''
        readGoogleSheet();
      });
  };

  const openEditModal = (item: FormData) => {
    setEditFormData(item);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setEditFormData(null);
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...(prevData as FormData),
      [name]: value,
    }));
  };

  return (
    <div className="App">
      <h1>Informacion de api</h1>

      {/* Formulario para crear datos */}
      <form>
        <label>ID:
          <input type="text" name="id" value={formData.id} onChange={handleInputChange} />
        </label>
        <label>Phone:
          <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} /> {/* Cambiado de number a text */}
        </label>
        <button type="button" onClick={createGoogleSheet}>Crear Datos</button>
      </form>

      {/* Tabla para mostrar información */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Phone</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.phone}</td>
              <td>
                <button type="button" onClick={() => openEditModal(item)}>Editar</button>
                <button type="button" onClick={() => deleteGoogleSheet(item.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para editar datos */}
      {isModalOpen && (
        <div className="modal" style={{ display: 'block' }}>
          <h2>Editar Datos</h2>
          <form>
            <label>ID:
              <input type="text" name="id" value={editFormData?.id} onChange={handleEditInputChange} />
            </label>
            <label>Phone:
              <input type="text" name="phone" value={editFormData?.phone} onChange={handleEditInputChange} /> {/* Cambiado de number a text */}
            </label>
            <button
  type="button"
  onClick={() => {
    updateGoogleSheet(editFormData?.id || '');
    closeEditModal();  // Cierra el modal después de intentar guardar los cambios
  }}
>
  Guardar Cambios
</button>
            <button type="button" onClick={closeEditModal}>Cancelar</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
