import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../lib/db';
import Cors from 'nextjs-cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  await Cors(req, res, {
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type'], // Cabeceras permitidas
    origin: '*', // Origen permitido, puede ser "*" para permitir todos
  });

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const {
      id_omt,
      nombre_del_establecimiento,
      nombre_del_propietario,
      cc_del_propietario,
      nit_del_propietario,
      tel_del_propietario,
      direccion,
      barrio,
      nombre_del_administrador,
      tel_del_administrador,
      nombre_del_encargado,
      tel_del_encargado,
      fechas_de_pago,
      latitud,
      longitud
    } = req.body;

    if (
      !id_omt ||
      !nombre_del_establecimiento ||
      !nombre_del_propietario ||
      !cc_del_propietario ||
      !nit_del_propietario ||
      !tel_del_propietario ||
      !direccion ||
      !barrio ||
      !nombre_del_administrador ||
      !tel_del_administrador ||
      !nombre_del_encargado ||
      !tel_del_encargado ||
      !fechas_de_pago ||
      latitud === undefined ||
      longitud === undefined
    ) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    try {
      const queryText = `
        INSERT INTO visitas (
          id_omt, nombre_del_establecimiento, nombre_del_propietario, cc_del_propietario, nit_del_propietario,
          tel_del_propietario, direccion, barrio, nombre_del_administrador, tel_del_administrador,
          nombre_del_encargado, tel_del_encargado, fechas_de_pago, latitud, longitud
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id
      `;
      const values = [
        id_omt, nombre_del_establecimiento, nombre_del_propietario, cc_del_propietario, nit_del_propietario,
        tel_del_propietario, direccion, barrio, nombre_del_administrador, tel_del_administrador,
        nombre_del_encargado, tel_del_encargado, fechas_de_pago, latitud, longitud
      ];
      const result = await query(queryText, values);

      return res.status(201).json({ success: true, id: result.rows[0].id });
    } catch (error) {
      console.error('Error al guardar la visita:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}