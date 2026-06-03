import { useState, useEffect } from 'react';
import { getInstructores, createInstructor, deleteInstructor, updateInstructor } from '../api';

export default function Instructores() {
  const [instructores, setInstructores] = useState([]);
  const [form, setForm] = useState({ nombre: '', especialidad: '', correo: '' });
  const [editingId, setEditingId] = useState(null); // Nuevo estado

  const cargarInstructores = async () => {
    try {
      const res = await getInstructores();
      setInstructores(res.data);
    } catch (err) {
      console.error("Error", err);
    }
  };

  useEffect(() => { cargarInstructores(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateInstructor(editingId, form);
      } else {
        await createInstructor(form);
      }
      resetForm();
      cargarInstructores();
    } catch (err) {
      alert("Error al guardar: " + JSON.stringify(err.response?.data));
    }
  };

  const handleEdit = (instructor) => {
    setForm({ nombre: instructor.nombre, especialidad: instructor.especialidad, correo: instructor.correo });
    setEditingId(instructor.id);
  };

  const resetForm = () => {
    setForm({ nombre: '', especialidad: '', correo: '' });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este instructor?")) {
      await deleteInstructor(id);
      cargarInstructores();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Formulario */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-fit">
        <h3 className="text-xl font-bold mb-6 text-gray-800">
          {editingId ? '✏️ Editar Instructor' : '➕ Nuevo Instructor'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Nombre</label>
            <input type="text" required className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Especialidad</label>
            <input type="text" required className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" value={form.especialidad} onChange={e => setForm({...form, especialidad: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Correo</label>
            <input type="email" required className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" value={form.correo} onChange={e => setForm({...form, correo: e.target.value})} />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className={`flex-1 text-white p-2.5 rounded-lg font-medium transition ${editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
              {editingId ? 'Actualizar' : 'Guardar'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="flex-1 bg-gray-200 text-gray-700 p-2.5 rounded-lg hover:bg-gray-300 font-medium transition">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista */}
      <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-xl font-bold mb-6 text-gray-800">Lista de Instructores</h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Nombre</th>
                <th className="p-4 font-semibold">Especialidad</th>
                <th className="p-4 font-semibold">Correo</th>
                <th className="p-4 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {instructores.map(ins => (
                <tr key={ins.id} className="hover:bg-indigo-50/30 transition">
                  <td className="p-4 font-medium text-gray-900">{ins.nombre}</td>
                  <td className="p-4 text-gray-600">{ins.especialidad}</td>
                  <td className="p-4 text-gray-600">{ins.correo}</td>
                  <td className="p-4 flex justify-center gap-3">
                    <button onClick={() => handleEdit(ins)} className="text-amber-500 hover:text-amber-700 font-medium transition">Editar</button>
                    <button onClick={() => handleDelete(ins.id)} className="text-red-500 hover:text-red-700 font-medium transition">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}