import { useState, useEffect } from 'react';
import { getTalleres, getInstructores, createTaller, deleteTaller, updateTaller } from '../api';

export default function Talleres() {
  const [talleres, setTalleres] = useState([]);
  const [instructores, setInstructores] = useState([]);
  const [form, setForm] = useState({ nombre: '', fecha: '', capacidad: '', instructor: '' });
  const [imagen, setImagen] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [tallerSeleccionado, setTallerSeleccionado] = useState(null); // Para el modal

  const cargarDatos = async () => {
    const resTalleres = await getTalleres();
    const resInstructores = await getInstructores();
    setTalleres(resTalleres.data);
    setInstructores(resInstructores.data);
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nombre', form.nombre);
    formData.append('fecha', form.fecha);
    formData.append('capacidad', form.capacidad);
    formData.append('instructor', form.instructor);
    if (imagen) {
      formData.append('imagen', imagen);
    }

    try {
      if (editingId) {
        await updateTaller(editingId, formData);
      } else {
        await createTaller(formData);
      }
      resetForm(e);
      cargarDatos();
    } catch (err) {
      alert("Error al guardar taller");
    }
  };

  const handleEdit = (taller) => {
    const fechaFormateada = taller.fecha ? taller.fecha.slice(0, 16) : '';
    setForm({ 
      nombre: taller.nombre, 
      fecha: fechaFormateada, 
      capacidad: taller.capacidad, 
      instructor: taller.instructor 
    });
    setEditingId(taller.id);
    setImagen(null);
  };

  const resetForm = (e = null) => {
    setForm({ nombre: '', fecha: '', capacidad: '', instructor: '' });
    setImagen(null);
    setEditingId(null);
    if(e) e.target.reset();
  };

  const abrirModal = (taller) => {
    setTallerSeleccionado(taller);
  };

  const cerrarModal = () => {
    setTallerSeleccionado(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Formulario */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-fit">
        <h3 className="text-xl font-bold mb-6 text-gray-800">
          {editingId ? '✏️ Editar Taller' : '➕ Nuevo Taller'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Nombre del Taller</label>
            <input type="text" required className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Fecha y Hora</label>
            <input type="datetime-local" required className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Capacidad Max.</label>
            <input type="number" required className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" value={form.capacidad} onChange={e => setForm({...form, capacidad: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Instructor</label>
            <select required className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 outline-none" value={form.instructor} onChange={e => setForm({...form, instructor: e.target.value})}>
              <option value="">Selecciona uno...</option>
              {instructores.map(ins => <option key={ins.id} value={ins.id}>{ins.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Imagen {editingId && <span className="text-xs text-gray-400 font-normal">(Opcional si no cambia)</span>}
            </label>
            <input type="file" accept="image/*" className="w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" onChange={e => setImagen(e.target.files[0])} />
          </div>
          
          <div className="flex gap-2 pt-2">
            <button type="submit" className={`flex-1 text-white p-2.5 rounded-lg font-medium transition ${editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
              {editingId ? 'Actualizar' : 'Crear Taller'}
            </button>
            {editingId && (
              <button type="button" onClick={() => resetForm()} className="flex-1 bg-gray-200 text-gray-700 p-2.5 rounded-lg hover:bg-gray-300 font-medium transition">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Grid de Visualización */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {talleres.map(taller => (
          <div key={taller.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group">
            <div>
              <div className="relative">
                {taller.imagen ? (
                  <img src={taller.imagen} alt={taller.nombre} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">Sin Imagen</div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm text-xs font-bold text-gray-700">
                  {taller.capacidad} Cupos
                </div>
              </div>
              
              <div className="p-5">
                <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md uppercase tracking-wider">
                  {taller.instructor_detalle?.nombre || 'Sin asignar'}
                </span>
                <h4 className="text-lg font-bold mt-3 text-gray-800 leading-tight">{taller.nombre}</h4>
                <p className="text-sm text-gray-500 mt-2 font-medium flex items-center gap-1">
                  📅 {new Date(taller.fecha).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => abrirModal(taller)} 
                className="text-blue-600 hover:text-blue-800 text-sm font-bold bg-white px-3 py-1.5 rounded-md shadow-sm border border-gray-200"
              >
                Ver
              </button>
              <button onClick={() => handleEdit(taller)} className="text-amber-500 hover:text-amber-700 text-sm font-bold bg-white px-3 py-1.5 rounded-md shadow-sm border border-gray-200">
                Editar
              </button>
              <button onClick={async () => { if(confirm("¿Eliminar?")) { await deleteTaller(taller.id); cargarDatos(); } }} className="text-red-500 hover:text-red-700 text-sm font-bold bg-white px-3 py-1.5 rounded-md shadow-sm border border-gray-200">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Flotante para Ver Detalles */}
      {tallerSeleccionado && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={cerrarModal}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="relative">
              {tallerSeleccionado.imagen ? (
                <img 
                  src={tallerSeleccionado.imagen} 
                  alt={tallerSeleccionado.nombre} 
                  className="w-full h-64 object-cover" 
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400 text-lg">
                  Sin Imagen
                </div>
              )}
              <button 
                onClick={cerrarModal}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-gray-900 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                <span className="text-sm font-bold text-gray-700">📅 {new Date(tallerSeleccionado.fecha).toLocaleString()}</span>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{tallerSeleccionado.nombre}</h2>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-full">
                  {tallerSeleccionado.capacidad} Cupos
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                  <span className="text-2xl">👨‍🏫</span>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Instructor</p>
                    <p className="text-base font-bold text-indigo-700">
                      {tallerSeleccionado.instructor_detalle?.nombre || 'Sin asignar'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Fecha y Hora</p>
                    <p className="text-base font-bold text-blue-700">
                      {new Date(tallerSeleccionado.fecha).toLocaleString('es-PE', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                  <span className="text-2xl">👥</span>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Capacidad Máxima</p>
                    <p className="text-base font-bold text-amber-700">{tallerSeleccionado.capacidad} personas</p>
                  </div>
                </div>

                {tallerSeleccionado.descripcion && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 font-medium mb-1">Descripción</p>
                    <p className="text-gray-700">{tallerSeleccionado.descripcion}</p>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <span className="text-2xl">🆔</span>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">ID del Taller</p>
                    <p className="text-base font-bold text-purple-700">{tallerSeleccionado.id}</p>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => { handleEdit(tallerSeleccionado); cerrarModal(); }}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-lg transition"
                >
                  ✏️ Editar
                </button>
                <button 
                  onClick={cerrarModal}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}