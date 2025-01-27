/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../lib/db';
import multer from 'multer';
import * as XLSX from 'xlsx';
import { IncomingMessage, ServerResponse } from 'http';

// Configuración de multer para manejar la subida de archivos
const upload = multer({
  storage: multer.memoryStorage(), // Almacena el archivo en memoria
});

const uploadMiddleware = upload.single('file');

// Función para ejecutar middleware
const runMiddleware = (req: IncomingMessage, res: ServerResponse, fn: Function) => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

// Extiende la interfaz NextApiRequest para incluir el archivo subido
interface NextApiRequestWithFile extends NextApiRequest {
  file?: Express.Multer.File;
}

const handler = async (req: NextApiRequestWithFile, res: NextApiResponse) => {
  console.log('Request method:', req.method);

  // Verifica que el método sea POST
  if (req.method !== 'POST') {
    console.log('Método no permitido');
    return res.status(405).json({
      success: false,
      error: `Método ${req.method} no permitido.`,
    });
  }

  try {
    // Ejecuta el middleware para procesar el archivo
    console.log('Ejecutando middleware para procesar el archivo');
    await runMiddleware(req, res, uploadMiddleware);

    // Verifica que se haya subido un archivo
    if (!req.file) {
      console.log('No se ha proporcionado ningún archivo');
      return res.status(400).json({
        success: false,
        error: 'No se ha proporcionado ningún archivo.',
      });
    }

    console.log('Archivo subido:', req.file.originalname);

    // Convierte el archivo buffer en un workbook de Excel
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0]; // Asume que los datos están en la primera hoja
    const sheet = workbook.Sheets[sheetName];

    console.log('Nombre de la hoja:', sheetName);

    // Convierte los datos de la hoja a JSON
    interface RowData {
      'ID_OMT': string;
      'NOMBRE_DEL_ESTABLECIMIENTO': string;
      'NOMBRE_DEL_PROPIETARIO': string;
      'CC_DEL_PROPIETARIO': string;
      'NIT_DEL_PROPIETARIO': string;
      'TEL_DEL_PROPIETARIO': string;
      DIRECCION: string;
      BARRIO: string;
      'NOMBRE_DEL_ADMINISTRADOR': string;
      'TEL_DEL_ADMINISTRADOR': string;
      'NOMBRE_DEL_ENCARGADO': string;
      'TEL_DEL_ENCARGADO': string;
      'FECHAS_DE_PAGO': string;
      LATITUD: string;
      LONGITUD: string;
    }

    const data: RowData[] = XLSX.utils.sheet_to_json<RowData>(sheet);

    console.log('Datos convertidos a JSON:', data);

    // Itera sobre los datos y los inserta en la base de datos
    for (const row of data) {
      const {
        'ID_OMT': ID_OMT,
        'NOMBRE_DEL_ESTABLECIMIENTO': NOMBRE_DEL_ESTABLECIMIENTO,
        'NOMBRE_DEL_PROPIETARIO': NOMBRE_DEL_PROPIETARIO,
        'CC_DEL_PROPIETARIO': CC_DEL_PROPIETARIO,
        'NIT_DEL_PROPIETARIO': NIT_DEL_PROPIETARIO,
        'TEL_DEL_PROPIETARIO': TEL_DEL_PROPIETARIO,
        DIRECCION,
        BARRIO,
        'NOMBRE_DEL_ADMINISTRADOR': NOMBRE_DEL_ADMINISTRADOR,
        'TEL_DEL_ADMINISTRADOR': TEL_DEL_ADMINISTRADOR,
        'NOMBRE_DEL_ENCARGADO': NOMBRE_DEL_ENCARGADO,
        'TEL_DEL_ENCARGADO': TEL_DEL_ENCARGADO,
        'FECHAS_DE_PAGO': FECHAS_DE_PAGO,
        LATITUD,
        LONGITUD,
      } = row;

      console.log('Insertando fila en la base de datos:', row);

      await query(
        `INSERT INTO establecimientos (
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
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          ID_OMT,
          NOMBRE_DEL_ESTABLECIMIENTO,
          NOMBRE_DEL_PROPIETARIO,
          CC_DEL_PROPIETARIO,
          NIT_DEL_PROPIETARIO,
          TEL_DEL_PROPIETARIO,
          DIRECCION,
          BARRIO,
          NOMBRE_DEL_ADMINISTRADOR,
          TEL_DEL_ADMINISTRADOR,
          NOMBRE_DEL_ENCARGADO,
          TEL_DEL_ENCARGADO,
          FECHAS_DE_PAGO,
          LATITUD,
          LONGITUD,
        ]
      );
    }

    // Responde con éxito si todos los datos fueron insertados correctamente
    console.log('Datos insertados correctamente');
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    // Manejo de errores
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al procesar el archivo:', errorMessage);
    res.status(500).json({
      success: false,
      error: `Error al procesar el archivo: ${errorMessage}`,
    });
  }
};

// Configuración para desactivar el bodyParser de Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;