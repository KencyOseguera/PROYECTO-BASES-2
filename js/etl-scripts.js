// etl-script.js
document.getElementById('etlForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const tablaOrigen = formData.get('tablaOrigen');
    const tablaDestino = formData.get('tablaDestino');

    try {
        const response = await fetch('/realizar-etl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tablaOrigen, tablaDestino })
        });

        if (!response.ok) {
            throw new Error('Error al realizar ETL');
        }

        // Mostrar mensaje de éxito al usuario
        alert('Operación de ETL realizada con éxito');
    } catch (error) {
        console.error('Error al realizar la operación de ETL:', error);
        // Mostrar mensaje de error al usuario
        alert('Ocurrió un error al realizar la operación de ETL');
    }
});
