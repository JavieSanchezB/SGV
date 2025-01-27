// Importaciones necesarias
'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import { toast } from 'nextjs-toast-notify';
import './styles/globals.css';
import 'nextjs-toast-notify/dist/nextjs-toast-notify.css';
import axios from 'axios';

// Función para convertir una fecha ISO 8601 a formato dd/mm/yyyy
interface FormatDate {
  (dateString: string | Date): string;
}

const formatDate: FormatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

export default function Page() {
  const [searchParams, setSearchParams] = useState({
    id_omt: '',
    nombre_del_establecimiento: '',
  });

  interface FormData {
    id_omt: string;
    nombre_del_establecimiento: string;
    nombre_del_propietario: string;
    cc_del_propietario: string;
    nit_del_propietario: string;
    tel_del_propietario: string;
    direccion: string;
    barrio: string;
    nombre_del_administrador: string;
    tel_del_administrador: string;
    nombre_del_encargado: string;
    tel_del_encargado: string;
    fechas_de_pago: string;
    latitud: string;
    longitud: string;
  }
  
  const [formData, setFormData] = useState<FormData>({
    id_omt: '',
    nombre_del_establecimiento: '',
    nombre_del_propietario: '',
    cc_del_propietario: '',
    nit_del_propietario: '',
    tel_del_propietario: '',
    direccion: '',
    barrio: '',
    nombre_del_administrador: '',
    tel_del_administrador: '',
    nombre_del_encargado: '',
    tel_del_encargado: '',
    fechas_de_pago: formatDate(new Date()), // Fecha actual como string
    latitud: '0',
    longitud: '0',
  });

  const [isExisting, setIsExisting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const updateGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            latitud: latitude.toFixed(6),
            longitud: longitude.toFixed(6),
          }));
          toast.success('Ubicación obtenida correctamente');
        },
        () => toast.error('No se pudo obtener la ubicación. Activa el GPS.')
      );
    } else {
      toast.error('La geolocalización no está soportada en este navegador.');
    }
  };

  useEffect(() => {
    updateGeolocation();
  }, []); // Solo se ejecuta una vez al montar el componente

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.get('/api/puntos', { params: searchParams });
      if (response.data.success) {
        setFormData(response.data.data);
        setIsExisting(true);
        toast.success('Datos cargados exitosamente');
      } else {
        setIsExisting(false);
        toast.info('No se encontró el establecimiento, puede registrarlo.');
      }
      setShowForm(true);
    } catch {
    setFormData({}); // Limpia los datos del formulario
    setIsExisting(false); // Asegúrate de que refleje el estado correcto
    setShowForm(true); // Muestra el formulario vacío
    toast.info('No existe información. Crea un nuevo establecimiento');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (isExisting) {
        await axios.put('/api/establecimientos', formData);
        toast.success('Establecimiento actualizado exitosamente');
      } else {
        await axios.post('/api/establecimientos', formData);
        toast.success('Establecimiento registrado exitosamente');
      }

      // Resetear estado y volver a búsqueda
      setShowForm(false);
      setSearchParams({ id_omt: '', nombre_del_establecimiento: '' });
    } catch {
      toast.error('Error al registrar o actualizar el establecimiento');
    }
  };
  const handleNew = () => {
    setFormData({
      id_omt: '',
      nombre_del_establecimiento: '',
      nombre_del_propietario: '',
      cc_del_propietario: '',
      nit_del_propietario: '',
      tel_del_propietario: '',
      direccion: '',
      barrio: '',
      nombre_del_administrador: '',
      tel_del_administrador: '',
      nombre_del_encargado: '',
      tel_del_encargado: '',
      fechas_de_pago: formatDate(new Date()), // Asegúrate de que sea un string
      latitud: '',
      longitud: '',
    });
    setIsExisting(false);
    setShowForm(true);
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Buscar o Registrar Establecimiento</h1>
      {!showForm && (
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <input
            type="text"
            name="id_omt"
            value={searchParams.id_omt}
            onChange={handleSearchChange}
            placeholder="Buscar por ID OMT"
            className="input"
          />
          <input
            type="text"
            name="nombre_del_establecimiento"
            value={searchParams.nombre_del_establecimiento}
            onChange={handleSearchChange}
            placeholder="Buscar por Nombre del Establecimiento"
            className="input"
          />
           <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Buscar</button>
              {!isExisting && (
                <button type="button" onClick={handleNew} className="px-4 py-2 bg-green-500 text-white rounded ml-4">
                  Nuevo
                </button>
              )}
        </form>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(formData).map((key) => (
            <input
              key={key}
              type="text"
              name={key}
              value={formData[key as keyof FormData] || ''}
              onChange={handleChange}
              placeholder={key.replace(/_/g, ' ')}
              className="input"
            />
          ))}
          <button type="submit" className="input">
            {isExisting ? 'Actualizar' : 'Registrar'}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="input"
          >
            Regresar
          </button>
        </form>
      )}
    </div>
  );
}
