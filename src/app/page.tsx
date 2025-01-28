'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { useState,useEffect, ChangeEvent } from 'react';
import { toast } from 'nextjs-toast-notify';
import './styles/globals.css';
import 'nextjs-toast-notify/dist/nextjs-toast-notify.css';
import axios from 'axios';

// Definición de la interfaz para el formato de fecha
interface FormatDate {
  (dateString: string | Date): string;
}

// Función para formatear la fecha
const formatDate: FormatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();  return `${year}-${month}-${day}`;
};

// Interfaz para los datos del formulario
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

export default function Page() {
  const [searchParams, setSearchParams] = useState({
    id_omt: '',
    nombre_del_establecimiento: '',
  });

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
    fechas_de_pago: formatDate(new Date()), // Fecha actual
    latitud: '0',
    longitud: '0',
  });

  const [isExisting, setIsExisting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);


  useEffect(() => {
    if (searchParams.nombre_del_establecimiento.length > 2) {
      fetchSuggestions(searchParams.nombre_del_establecimiento);
    } else {
      setSuggestions([]);
    }
  }, [searchParams.nombre_del_establecimiento]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSearchParams((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (showForm) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prevData) => ({
            ...prevData,
            latitud: latitude.toString(),
            longitud: longitude.toString(),
          }));
        },
        () => {
          toast.error('Error al obtener la ubicación');
        }
      );
    }
  }, [showForm]);
  const fetchSuggestions = async (query: string) => {
    try {
      const response = await axios.get('/api/puntos', { params: { nombre_del_establecimiento: query } });
      if (response.data.success) {
        setSuggestions(response.data.data.map((item: { nombre_del_establecimiento: string }) => item.nombre_del_establecimiento));
      } else {
        setSuggestions([]);
      }
    } catch  {
      setSuggestions([]);
      toast.error('Error al obtener sugerencias');
    }
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
          fechas_de_pago: formatDate(new Date()), // Asegúrate de que sea un array
          latitud: '',
          longitud: '',
        });
        setIsExisting(false);
        toast.info('No se encontró el establecimiento, puede registrarlo');
      }
      setShowForm(true);
    } catch {
      toast.error('Error al realizar la consulta');
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value || '', // Usa una cadena vacía si el valor es null
    }));
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
      setShowForm(false); // Regresar a la vista de búsqueda
    } catch {
      toast.error('Error al registrar el establecimiento');
    }
  };
  const handleSuggestionClick = async (suggestion: string) => {
    setSearchParams((prevData) => ({
      ...prevData,
      nombre_del_establecimiento: suggestion,
    }));
    setSuggestions([]);
    await handleSearchSubmit(new Event('submit') as unknown as React.FormEvent);
  };

  const updateGPS = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prevData) => ({
          ...prevData,
          latitud: latitude.toString(),
          longitud: longitude.toString(),
        }));
        toast.success('Ubicación actualizada');
      },
      () => {
        toast.error('Error al obtener la ubicación');
      }
    );
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
      fechas_de_pago: formatDate(new Date()), // Fecha actual
      latitud: '0',
      longitud: '0',
    });
    setIsExisting(false);
    setShowForm(true);
  };
  const handleDateChange = (date: Date | null) => {
    setFormData((prevData) => ({
      ...prevData,
      fechas_de_pago: date ? formatDate(date) : '',
    }));
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Buscar o Registrar Establecimiento</h1>
      {!showForm && (
        <form onSubmit={handleSearchSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Buscar por ID OMT */}
           <input
           type="text"
           name="id_omt"
           value={searchParams.id_omt || ''} // Usa una cadena vacía si el valor es null
           onChange={handleSearchChange}
           placeholder="Buscar por ID OMT"
            className="form-control"
          />
          {/* Buscar por Nombre del Establecimiento */}
          <input
             type="text"
             name="nombre_del_establecimiento"
             value={searchParams.nombre_del_establecimiento || ''} // Usa una cadena vacía si el valor es null
             onChange={handleSearchChange}
             placeholder="Buscar por Nombre del Establecimiento"
            className="form-control"
          />
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
          {/* Botón de Búsqueda */}
          <button type="submit" className="btn btn-primary">
            Buscar
          </button>
          {/* Botón para Agregar Nuevo Establecimiento */}
          <button
            type="button"
            onClick={() => handleNew()}
            className="btn btn-success"
          >
            Nuevo
          </button>
        </div>
      </form>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
       {Object.keys(formData).map((key) =>
    key === 'fechas_de_pago' ? (
      <ReactDatePicker
        key="fechas_de_pago"
        selected={new Date(formData.fechas_de_pago)}
        onChange={(date: Date | null) => handleDateChange(date)}
        dateFormat="yyyy-MM-dd"
        className="w-full p-2 border rounded"
      />
    ) : (
      // Comprobamos si el campo es uno de los números (CC, NIT, Teléfonos)
      ['cc_del_propietario', 'nit_del_propietario', 'tel_del_propietario', 'tel_del_administrador', 'tel_del_encargado'].includes(key) ? (
        <input
          key={key}
          type="number"
          name={key}
          value={formData[key as keyof FormData]}
          onChange={handleChange}
          placeholder={key.replace(/_/g, ' ')}
          className="form-control"
        />
      ) : (
        <input
          key={key}
          type="text"
          name={key}
          value={formData[key as keyof FormData]}
          onChange={handleChange}
          placeholder={key.replace(/_/g, ' ')}
          className="form-control"
        />
      )
    )
          )}
          <button type="button" onClick={updateGPS} className="btn btn-primary">
                Actualizar GPS
              </button>
          <button type="submit" className="btn btn-success">
            {isExisting ? 'Actualizar' : 'Registrar'}
          </button>
          <button type="button" onClick={() => setShowForm(false)} className="btn btn-danger">
            Regresar
          </button>

        </form>
      )}
    </div>
  );
}
