const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001; // Puedes cambiar el puerto según tus necesidades

app.use(bodyParser.json());

app.patch('/api/update/:id', async (req, res) => {
  const id = req.params.id;
  const { data } = req.body;

  try {
    const response = await fetch(`https://sheetdb.io/api/v1/njckq9betnh15/id/${id}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });

    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.error('Error en la solicitud:', error);
    res.status(500).json({ error: 'Error en la solicitud' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
