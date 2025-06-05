async function loadItems() {
    const res = await fetch('/api/items/all');
    const items = await res.json();
    const container = document.getElementById('itemsList');
    container.innerHTML = '';
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'form-check';
        div.innerHTML = `<input class="form-check-input" type="checkbox" value="${item.id}" id="item${item.id}">\n<label class="form-check-label" for="item${item.id}">${item.description}</label>`;
        container.appendChild(div);
    });
}

async function loadReport() {
    const res = await fetch('/api/report');
    const items = await res.json();
    const tbody = document.querySelector('#reportTable tbody');
    tbody.innerHTML = '';
    items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.category}</td>
            <td>${item.description}</td>
            <td>${item.unit}</td>
            <td>${item.cost}</td>
            <td>${new Date(item.created_at).toLocaleString()}</td>
        `;
        tbody.appendChild(tr);
    });
}

async function handleSubmit(e) {
    e.preventDefault();
    const selected = Array.from(document.querySelectorAll('#itemsList input:checked')).map(el => parseInt(el.value));
    if (selected.length === 0) {
        alert('Select at least one item');
        return;
    }
    const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemIds: selected })
    });
    if (res.ok) {
        document.getElementById('reportForm').reset();
        loadReport();
    } else {
        alert('Failed to save report');
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadItems();
    loadReport();
    document.getElementById('reportForm').addEventListener('submit', handleSubmit);
});
