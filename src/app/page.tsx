'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import { toast } from 'nextjs-toast-notify';
import 'nextjs-toast-notify/dist/nextjs-toast-notify.css';
import './styles/globals.css';
import './styles/react-datepicker.css';
import axios from 'axios';

export default function Page() {
  const [searchParams, setSearchParams] = useState({
    id_omt: '',
    nombre_del_establecimiento: '',
  });

  const [formData, setFormData] = useState({
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
    fechas_de_pago: new Date().toISOString().split('T')[0], // Fecha actual como string
    latitud: '0',
    longitud: '0',
    
  });

  const [isExisting, setIsExisting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  useEffect(() => {
    console.log(formData.fechas_de_pago); // Verifica el valor de la fecha
  }, [formData]);

 // Función para obtener la geolocalización
 const updateGeolocation = () => {
   if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(
       (position) => {
         const { latitude, longitude } = position.coords;
         setFormData((prev) => ({
           ...prev,
           latitud: latitude.toFixed(6),  // Redondeo a 6 decimales
           longitud: longitude.toFixed(6), // Redondeo a 6 decimales
         }));

         // Mostrar notificación de éxito una vez que se actualiza la geolocalización
         toast.success('Ubicación obtenida correctamente');
         console.log(formData.fechas_de_pago);
       },
       (error) => {
         toast.error('No se pudo obtener la ubicación. Activa el GPS.');
         console.error('Error al obtener la ubicación:', error.message);
       }
     );
   } else {
     toast.error('La geolocalización no está soportada en este navegador.');
   }
 };

 useEffect(() => {
   // Llamar la función para actualizar la geolocalización solo una vez al cargar el formulario
   updateGeolocation();
 }, []); // Solo se ejecuta una vez cuando el componente se monta

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
        toast.info('No se encontró el establecimiento, puede registrarlo');
      }
      setShowForm(true);
    } catch {
      toast.error('Error al realizar la consulta');
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
    } catch {
      toast.error('Error al registrar el establecimiento');
    }
  };

  return (
    <html lang="es">
      <body>
        <div className="container">
          <h1 className="title">Buscar o Registrar Establecimiento</h1>
          {!showForm && (
            <form onSubmit={handleSearchSubmit} className="search-form">
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
              <button type="submit" className="button">Buscar</button>
            </form>
          )}
          {showForm && (
            <form onSubmit={handleSubmit} className="form">
              <input
                type="text"
                name="id_omt"
                value={formData.id_omt || ''}
                onChange={handleChange}
                placeholder="ID OMT"
                className="input"
              />
              <input
                type="text"
                name="nombre_del_establecimiento"
                value={formData.nombre_del_establecimiento || ''}
                onChange={handleChange}
                placeholder="Nombre del Establecimiento"
                className="input"
              />
              <input
                type="text"
                name="nombre_del_propietario"
                value={formData.nombre_del_propietario || ''}
                onChange={handleChange}
                placeholder="Nombre del Propietario"
                className="input"
              />
              <input
                type="text"
                name="cc_del_propietario"
                value={formData.cc_del_propietario || ''}
                onChange={handleChange}
                placeholder="Cédula del Propietario"
                className="input"
              />
              <input
                type="text"
                name="nit_del_propietario"
                value={formData.nit_del_propietario || ''}
                onChange={handleChange}
                placeholder="NIT del Propietario"
                className="input"
              />
              <input
                type="text"
                name="tel_del_propietario"
                value={formData.tel_del_propietario || ''}
                onChange={handleChange}
                placeholder="Teléfono del Propietario"
                className="input"
              />
              <input
                type="text"
                name="direccion"
                value={formData.direccion || ''}
                onChange={handleChange}
                placeholder="Dirección"
                className="input"
              />
              <input
                type="text"
                name="barrio"
                value={formData.barrio || ''}
                onChange={handleChange}
                placeholder="Barrio"
                className="input"
              />
              <input
                type="text"
                name="nombre_del_administrador"
                value={formData.nombre_del_administrador || ''}
                onChange={handleChange}
                placeholder="Nombre del Administrador"
                className="input"
              />
              <input
                type="text"
                name="tel_del_administrador"
                value={formData.tel_del_administrador || ''}
                onChange={handleChange}
                placeholder="Teléfono del Administrador"
                className="input"
              />
              <input
                type="text"
                name="nombre_del_encargado"
                value={formData.nombre_del_encargado || ''}
                onChange={handleChange}
                placeholder="Nombre del Encargado"
                className="input"
              />
              <input
                type="text"
                name="tel_del_encargado"
                value={formData.tel_del_encargado || ''}
                onChange={handleChange}
                placeholder="Teléfono del Encargado"
                className="input"
              />
              <input
                type="date"
                name="fechas_de_pago"
                value={formData.fechas_de_pago}
                readOnly
                className="input bg-gray-100 text-gray-500"
              />
              <input
                type="text"
                name="latitud"
                value={formData.latitud  || ''}
                readOnly
                className="input bg-gray-100 text-gray-500"
              />
              <input
                type="text"
                name="longitud"
                value={formData.longitud  || ''}
                readOnly
                className="input bg-gray-100 text-gray-500"
              />
              <button type="submit" className="button">
                {isExisting ? 'Actualizar' : 'Registrar'}
              </button>
            </form>
          )}
        </div>
      </body>
    </html>
  );
}
