import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    // Maneja la solicitud POST para registrar un nuevo establecimiento
    const {
      id_omt,
      nombre_del_establecimiento,
      nombre_del_propietario,
      cc_del_propietario,
      nit_del_propietario,
      tel_del_propietario,
      email,
      direccion,
      barrio,
      nombre_del_administrador,
      tel_del_administrador,
      nombre_del_encargado,
      tel_del_encargado,
      fechas_de_pago,
      latitud,
      longitud,
    } = req.body;

    if (
      !id_omt ||
      !nombre_del_establecimiento ||
      !nombre_del_propietario ||
      !cc_del_propietario ||
      !nit_del_propietario ||
      !tel_del_propietario ||
      !email ||
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
      const result = await query(
        `INSERT INTO establecimientos (
          id_omt,
          nombre_del_establecimiento,
          nombre_del_propietario,
          cc_del_propietario,
          nit_del_propietario,
          tel_del_propietario,
          email,
          direccion,
          barrio,
          nombre_del_administrador,
          tel_del_administrador,
          nombre_del_encargado,
          tel_del_encargado,
          fechas_de_pago,
          latitud,
          longitud
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16 ) RETURNING id`,
        [
          id_omt,
          nombre_del_establecimiento,
          nombre_del_propietario,
          cc_del_propietario,
          nit_del_propietario,
          tel_del_propietario,
          email,
          direccion,
          barrio,
          nombre_del_administrador,
          tel_del_administrador,
          nombre_del_encargado,
          tel_del_encargado,
          fechas_de_pago,
          latitud,
          longitud,
        ]
      );

      return res.status(201).json({ success: true, id: result.rows[0].id });
    } catch (error) {
      console.error('Error al guardar el establecimiento:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  } else if (req.method === 'PUT') {
    // Maneja la solicitud PUT para actualizar un establecimiento existente
    const {
      id_omt,
      nombre_del_establecimiento,
      nombre_del_propietario,
      cc_del_propietario,
      nit_del_propietario,
      tel_del_propietario,
      email,
      direccion,
      barrio,
      nombre_del_administrador,
      tel_del_administrador,
      nombre_del_encargado,
      tel_del_encargado,
      fechas_de_pago,
      latitud,
      longitud,
    } = req.body;

    if (
      !id_omt ||
      !nombre_del_establecimiento ||
      !nombre_del_propietario ||
      !cc_del_propietario ||
      !nit_del_propietario ||
      !tel_del_propietario ||
      !email ||
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
      const result = await query(
        `UPDATE establecimientos SET
          nombre_del_establecimiento = $2,
          nombre_del_propietario = $3,
          cc_del_propietario = $4,
          nit_del_propietario = $5,
          tel_del_propietario = $6,
          email = $7,
          direccion = $8,
          barrio = $9,
          nombre_del_administrador = $10,
          tel_del_administrador = $11,
          nombre_del_encargado = $12,
          tel_del_encargado = $13,
          fechas_de_pago = $14,
          latitud = $15,
          longitud = $16
        WHERE id_omt = $1 RETURNING id`,
        [
          id_omt,
          nombre_del_establecimiento,
          nombre_del_propietario,
          cc_del_propietario,
          nit_del_propietario,
          tel_del_propietario,
          email,
          direccion,
          barrio,
          nombre_del_administrador,
          tel_del_administrador,
          nombre_del_encargado,
          tel_del_encargado,
          fechas_de_pago,
          latitud,
          longitud,
        ]
      );
      res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Error al actualizar el establecimiento:', error);
      res.status(500).json({ success: false, error: 'Error interno en el servidor. Por favor, intenta nuevamente.' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Método no permitido. Usa POST o PUT.' });
  }
}