async function loadItems() {
    const res = await fetch('/api/items/all');
    const items = await res.json();
    const container = document.getElementById('itemsList');
    container.innerHTML = '';
    items.forEach(item => {
        const row = document.createElement('div');
        row.className = 'row g-2 align-items-center mb-2';
        row.innerHTML = `
            <div class="col-sm-6 col-md-4">
                <label class="form-label">${item.description} ($${item.cost}/${item.unit})</label>
            </div>
            <div class="col-sm-3 col-md-2">
                <input type="number" min="0" step="1" data-id="${item.id}" class="form-control" placeholder="Qty">
            </div>`;
        container.appendChild(row);
    });
}

async function loadReport() {
    const res = await fetch('/api/report');
    const reports = await res.json();
    const tbody = document.querySelector('#reportTable tbody');
    tbody.innerHTML = '';
    reports.forEach(rep => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${rep.id}</td>
            <td>${rep.total.toFixed(2)}</td>
            <td>${new Date(rep.created_at).toLocaleString()}</td>
        `;
        tbody.appendChild(tr);
    });
}

async function handleSubmit(e) {
    e.preventDefault();
    const entries = [];
    document.querySelectorAll('#itemsList input[type="number"]').forEach(el => {
        const qty = parseFloat(el.value);
        if (qty && qty > 0) {
            entries.push({ itemId: parseInt(el.dataset.id), quantity: qty });
        }
    });
    if (entries.length === 0) {
        alert('Enter a quantity for at least one item');
        return;
    }
    const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: entries })
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
