console.log('✅ Script cargado - Hotel Booking System');

// Configuración
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? "/api/hotel" 
  : "http://18.222.180.221:3003/api/hotel";

// Elementos del DOM
const messageBox = document.getElementById("message");
const loadingOverlay = document.getElementById("loading");
const tableBody = document.querySelector("#reservations-table tbody");
const form = document.getElementById("reservation-form");

let editingId = null;

// Función para mostrar/ocultar loading
function showLoading(show = true) {
    if (loadingOverlay) {
        loadingOverlay.style.display = show ? 'flex' : 'none';
    }
}

// Función para mostrar mensajes
function showMessage(text, type = "success") {
    if (messageBox) {
        messageBox.textContent = text;
        messageBox.className = `message ${type}`;
        messageBox.hidden = false;
        setTimeout(() => {
            messageBox.hidden = true;
        }, 4000);
    }
}

// Función para resetear el formulario
function resetForm() {
    if (form) {
        form.reset();
    }
    editingId = null;
    
    // Restaurar el botón a "Guardar Reserva"
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
        saveBtn.textContent = 'Guardar Reserva';
        saveBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
}

// Cargar reservas
async function loadReservations() {
    console.log('🔄 Cargando reservas...');
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/get-bookings`);
        if (!response.ok) throw new Error('Error al cargar reservas');
        
        const reservations = await response.json();
        console.log('📊 Reservas cargadas:', reservations);
        renderReservations(reservations);
        
    } catch (error) {
        console.error('❌ Error:', error);
        showMessage('Error al cargar reservas', 'error');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:red">Error al cargar reservas</td></tr>';
        }
    } finally {
        showLoading(false);
    }
}

// Renderizar reservas en la tabla
function renderReservations(reservations) {
    if (!tableBody) {
        console.error('❌ No se encontró la tabla');
        return;
    }

    if (!reservations || reservations.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:gray">No hay reservas</td></tr>';
        return;
    }

    tableBody.innerHTML = reservations.map(reservation => `
        <tr>
            <td>${reservation._id}</td>
            <td>${escapeHtml(reservation.name)}</td>
            <td>${escapeHtml(reservation.roomType)}</td>
            <td>${reservation.numberOfRooms}</td>
            <td>${reservation.numberOfGuests}</td>
            <td>${formatDate(reservation.arrivalDate)}</td>
            <td>${formatDate(reservation.departureDate)}</td>
            <td>${escapeHtml(reservation.email)}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editReservation('${reservation._id}')">
                    ✏️ Editar
                </button>
                <button class="action-btn delete-btn" onclick="deleteReservation('${reservation._id}')">
                    🗑️ Eliminar
                </button>
            </td>
        </tr>
    `).join('');
    
    console.log('✅ Tabla renderizada correctamente');
}

// Eliminar reserva
async function deleteReservation(id) {
    if (!id) {
        console.error('❌ ID no válido para eliminar');
        return;
    }
    
    if (!confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
        return;
    }
    
    console.log(`🗑️ Intentando eliminar reserva: ${id}`);
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/delete-booking/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error ${response.status} al eliminar reserva`);
        }

        const result = await response.json();
        console.log('✅ Respuesta de eliminación:', result);
        
        showMessage('Reserva eliminada exitosamente');
        await loadReservations();
        
    } catch (error) {
        console.error('❌ Error eliminando reserva:', error);
        showMessage(`Error al eliminar reserva: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

// Editar reserva
async function editReservation(id) {
    if (!id) {
        console.error('❌ ID no válido para editar');
        return;
    }
    
    console.log(`✏️ Cargando datos para editar reserva: ${id}`);
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/get-one-booking/${id}`);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status} al cargar reserva`);
        }
        
        const reservation = await response.json();
        console.log('📝 Datos de reserva para editar:', reservation);
        
        // Llenar el formulario con los datos existentes
        document.getElementById('guest-name').value = reservation.name || '';
        document.getElementById('email').value = reservation.email || '';
        document.getElementById('room-number').value = reservation.roomType || '';
        document.getElementById('checkin-date').value = reservation.arrivalDate ? reservation.arrivalDate.substring(0, 10) : '';
        document.getElementById('checkout-date').value = reservation.departureDate ? reservation.departureDate.substring(0, 10) : '';
        
        // Guardar el ID que estamos editando
        editingId = id;
        
        // Cambiar el texto del botón a "Actualizar"
        const saveBtn = document.getElementById('save-btn');
        if (saveBtn) {
            saveBtn.textContent = 'Actualizar Reserva';
            saveBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
        }
        
        showMessage(`Editando reserva de ${reservation.name} - Modifique los campos y haga clic en "Actualizar"`);
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } catch (error) {
        console.error('❌ Error cargando reserva para editar:', error);
        showMessage(`Error al cargar reserva: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

// Crear nueva reserva
async function createReservation(reservationData) {
    showLoading(true);
    try {
        const response = await fetch(`${API_BASE_URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservationData)
        });

        if (!response.ok) throw new Error('Error al crear reserva');
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('❌ Error:', error);
        showMessage('Error al crear reserva', 'error');
        throw error;
    } finally {
        showLoading(false);
    }
}

// Actualizar reserva
async function updateReservation(id, data) {
    showLoading(true);
    try {
        const response = await fetch(`${API_BASE_URL}/update-booking/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Error al actualizar reserva');
        
        const result = await response.json();
        showMessage('Reserva actualizada exitosamente');
        return result;
    } catch (error) {
        console.error('❌ Error:', error);
        showMessage('Error al actualizar reserva', 'error');
        throw error;
    } finally {
        showLoading(false);
    }
}

// Formatear fecha
function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
}

// Escapar HTML para seguridad
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Manejar envío del formulario
if (form) {
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const formData = {
            name: document.getElementById('guest-name').value.trim(),
            email: document.getElementById('email').value.trim(),
            roomType: document.getElementById('room-number').value.trim(),
            numberOfRooms: 1,
            numberOfGuests: 1,
            arrivalDate: document.getElementById('checkin-date').value,
            departureDate: document.getElementById('checkout-date').value
        };

        // Validación básica
        if (!formData.name || !formData.email || !formData.arrivalDate || !formData.departureDate) {
            showMessage('Por favor completa todos los campos requeridos', 'error');
            return;
        }

        try {
            if (editingId) {
                // MODO EDICIÓN - Actualizar reserva existente
                await updateReservation(editingId, formData);
            } else {
                // MODO CREACIÓN - Crear nueva reserva
                await createReservation(formData);
                showMessage('Reserva creada exitosamente');
            }
            
            // Limpiar y recargar
            resetForm();
            await loadReservations();
            
        } catch (error) {
            console.error('Error al enviar formulario:', error);
        }
    });
}

// Botón limpiar
const resetBtn = document.getElementById('reset-btn');
if (resetBtn) {
    resetBtn.addEventListener('click', function() {
        resetForm();
        showMessage('Formulario limpiado');
    });
}

// Botón actualizar
const refreshBtn = document.getElementById('refresh-btn');
if (refreshBtn) {
    refreshBtn.addEventListener('click', function() {
        loadReservations();
        showMessage('Lista actualizada');
    });
}

// Botón nueva reserva
const newReservationBtn = document.getElementById('new-reservation');
if (newReservationBtn) {
    newReservationBtn.addEventListener('click', function() {
        resetForm();
        showMessage('Creando nueva reserva - Complete el formulario');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM cargado - Inicializando aplicación...');
    loadReservations();
});

// Hacer funciones globales para los botones
window.editReservation = editReservation;
window.deleteReservation = deleteReservation;
window.updateReservation = updateReservation;

console.log('✅ Hotel Booking System inicializado');