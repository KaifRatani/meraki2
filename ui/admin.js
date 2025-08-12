document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('eventForm');
  const eventList = document.getElementById('eventList');
  const sortSelect = document.getElementById('sortEvents');
  const participantTable = document.querySelector('#participantTable tbody');
  const searchName = document.getElementById('searchName');
  const filterRole = document.getElementById('filterRole');
  const filterEvent = document.getElementById('filterEvent');
  const downloadBtn = document.getElementById('downloadExcelBtn');

  let allParticipants = [];

  loadEvents();
  loadParticipants();

  /** ---------------- SECTION NAVIGATION ---------------- */
  window.showSection = (id) => {
    document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
    const section = document.getElementById(id);
    if (section) section.classList.add('active');

    document.querySelectorAll('.sidebar button').forEach(btn => btn.classList.remove('active'));
    const btn = document.querySelector(`.sidebar button[onclick*="${id}"]`);
    if (btn) btn.classList.add('active');
  };

  /** ---------------- CREATE OR EDIT EVENT ---------------- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const eventId = document.getElementById('eventId').value.trim();
    const data = {
      title: document.getElementById('title').value.trim(),
      description: document.getElementById('description').value.trim(),
      location: document.getElementById('location').value.trim(),
      date: document.getElementById('date').value,
      start_time: document.getElementById('start_time').value,
      duration: document.getElementById('duration').value.trim()
    };

    const url = eventId ? `/api/events/edit/${eventId}` : '/api/events/create';
    const method = eventId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      alert(await res.text());
      form.reset();
      document.getElementById('eventId').value = '';
      loadEvents();
      showSection('update');
    } catch (err) {
      console.error(err);
      alert('Error saving event.');
    }
  });

  /** ---------------- LOAD EVENTS ---------------- */
  async function loadEvents() {
    try {
      const res = await fetch('/api/events');
      const events = await res.json();
      eventList.innerHTML = '';

      const sortOrder = sortSelect.value;
      events.sort((a, b) => sortOrder === 'asc' ? a.id - b.id : b.id - a.id);

      events.forEach(event => {
        const div = document.createElement('div');
        div.className = 'event-card';
        div.innerHTML = `
          <h3>${event.title}</h3>
          <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()} | ${event.start_time} (${event.duration})</p>
          <p><strong>Location:</strong> ${event.location}</p>
          <p>${event.description}</p>
          <div class="event-actions" style="text-align: center; margin-top: 10px;">
            <button class="edit-btn" onclick='editEvent(${JSON.stringify(event)})'>Edit</button>
          </div>
        `;
        eventList.appendChild(div);
      });
    } catch (err) {
      console.error('Error loading events:', err);
      eventList.innerHTML = '<p>Error loading events.</p>';
    }
  }
  sortSelect.addEventListener('change', loadEvents);

  /** ---------------- EDIT EVENT ---------------- */
  window.editEvent = (event) => {
    document.getElementById('eventId').value = event.id;
    document.getElementById('title').value = event.title;
    document.getElementById('description').value = event.description;
    document.getElementById('location').value = event.location;
    document.getElementById('date').value = event.date.split('T')[0];
    document.getElementById('start_time').value = event.start_time;
    document.getElementById('duration').value = event.duration;
    showSection('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /** ---------------- LOAD PARTICIPANTS ---------------- */
  async function loadParticipants() {
    try {
      const res = await fetch('/api/events/participants');
      allParticipants = await res.json();
      populateEventFilter(allParticipants);
      renderParticipants(allParticipants);
    } catch (err) {
      console.error('Error loading participants:', err);
      participantTable.innerHTML = '<tr><td colspan="12">Failed to load participants.</td></tr>';
    }
  }

  function renderParticipants(data) {
    participantTable.innerHTML = '';
    if (!data.length) {
      participantTable.innerHTML = '<tr><td colspan="12">No participants found.</td></tr>';
      return;
    }

    data.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.event_id}</td>
        <td>${row.first_name}</td>
        <td>${row.last_name}</td>
        <td>${row.email}</td>
        <td>${row.phone}</td>
        <td>${row.state}</td>
        <td>${row.town}</td>
        <td>${row.heard_from || ''}</td>
        <td>${row.age_group || ''}</td>
        <td>${row.people_count || ''}</td>
        <td>${row.role}</td>
        <td>${new Date(row.response_time).toLocaleString()}</td>
      `;
      participantTable.appendChild(tr);
    });
  }

  function populateEventFilter(data) {
    filterEvent.innerHTML = '<option value="">Filter by Event ID</option>';
    [...new Set(data.map(p => p.event_id))].forEach(id => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = `Event ${id}`;
      filterEvent.appendChild(option);
    });
  }

  function applyFilters() {
    const nameQuery = searchName.value.toLowerCase();
    const roleFilter = filterRole.value;
    const eventFilter = filterEvent.value;

    const filtered = allParticipants.filter(p => {
      return (
        `${p.first_name} ${p.last_name}`.toLowerCase().includes(nameQuery) &&
        (roleFilter ? p.role === roleFilter : true) &&
        (eventFilter ? String(p.event_id) === eventFilter : true)
      );
    });

    renderParticipants(filtered);
  }

  searchName.addEventListener('input', applyFilters);
  filterRole.addEventListener('change', applyFilters);
  filterEvent.addEventListener('change', applyFilters);

  /** ---------------- DOWNLOAD PLACEHOLDER ---------------- */
  downloadBtn.addEventListener('click', () => {
    alert('Download feature will be added soon.');
  });
});
