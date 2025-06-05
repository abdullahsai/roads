
async function loadItems(category) {
    const url = category ? `/api/items/all?category=${encodeURIComponent(category)}` : '/api/items/all';
    const res = await fetch(url);

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

async function loadCategories() {
    const res = await fetch('/api/items/categories');
    const categories = await res.json();
    const select = document.getElementById('categorySelect');
    select.innerHTML = '';
    categories.forEach((cat, idx) => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        select.appendChild(opt);
        if (idx === 0) select.value = cat;
    });
    if (categories.length > 0) {
        loadItems(select.value);
    } else {
        document.getElementById('itemsList').innerHTML = '<p>No items found.</p>';
    }

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

    loadCategories();
    loadReport();
    document.getElementById('categorySelect').addEventListener('change', (e) => {
        loadItems(e.target.value);
    });

    document.getElementById('reportForm').addEventListener('submit', handleSubmit);
});
