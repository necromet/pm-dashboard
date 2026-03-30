// ── Sample Data ──────────────────────────────────────────────
const TASKS = [
    // Project Alpha
    { id: 1, project: 'project-alpha', pic: 'Alice', name: 'Design homepage mockup', deadline: '2026-03-30T10:00', status: 'In Progress', priority: 'Urgent', workflow: 'In Progress' },
    { id: 2, project: 'project-alpha', pic: 'Bob', name: 'Setup CI/CD pipeline', deadline: '2026-03-30T14:00', status: 'Not Started', priority: 'High', workflow: 'Not Started' },
    { id: 3, project: 'project-alpha', pic: 'Alice', name: 'API authentication module', deadline: '2026-03-30T17:00', status: 'In Progress', priority: 'Urgent', workflow: 'In Progress' },
    { id: 4, project: 'project-alpha', pic: 'Charlie', name: 'Write unit tests for auth', deadline: '2026-03-30T16:00', status: 'Pending', priority: 'High', workflow: 'In Progress' },
    { id: 5, project: 'project-alpha', pic: 'Bob', name: 'Database migration script', deadline: '2026-03-31', status: 'Not Started', priority: 'Medium', workflow: 'Not Started' },
    { id: 6, project: 'project-alpha', pic: 'Diana', name: 'User dashboard wireframe', deadline: '2026-04-01', status: 'Done', priority: 'Medium', workflow: 'Done' },
    { id: 7, project: 'project-alpha', pic: 'Alice', name: 'Login page redesign', deadline: '2026-04-02', status: 'Not Started', priority: 'Low', workflow: 'Not Started' },
    { id: 8, project: 'project-alpha', pic: 'Charlie', name: 'Integration testing', deadline: '2026-04-03', status: 'Backlog', priority: 'Medium', workflow: 'Not Started' },
    { id: 9, project: 'project-alpha', pic: 'Bob', name: 'Deploy staging environment', deadline: '2026-04-05', status: 'Not Started', priority: 'High', workflow: 'Not Started' },
    { id: 10, project: 'project-alpha', pic: 'Diana', name: 'Performance audit report', deadline: '2026-04-07', status: 'Backlog', priority: 'Low', workflow: 'Not Started' },

    // Project Beta
    { id: 11, project: 'project-beta', pic: 'Eve', name: 'Content migration plan', deadline: '2026-03-30T09:00', status: 'Done', priority: 'High', workflow: 'Done' },
    { id: 12, project: 'project-beta', pic: 'Frank', name: 'SEO audit checklist', deadline: '2026-03-31', status: 'In Progress', priority: 'Medium', workflow: 'In Progress' },
    { id: 13, project: 'project-beta', pic: 'Eve', name: 'Blog template update', deadline: '2026-04-01', status: 'Not Started', priority: 'Low', workflow: 'Not Started' },
    { id: 14, project: 'project-beta', pic: 'Grace', name: 'Analytics dashboard setup', deadline: '2026-04-02', status: 'In Progress', priority: 'Urgent', workflow: 'In Progress' },
    { id: 15, project: 'project-beta', pic: 'Frank', name: 'Email template design', deadline: '2026-04-03', status: 'Pending', priority: 'Medium', workflow: 'In Progress' },
    { id: 16, project: 'project-beta', pic: 'Grace', name: 'A/B test landing pages', deadline: '2026-04-04', status: 'Not Started', priority: 'High', workflow: 'Not Started' },
    { id: 17, project: 'project-beta', pic: 'Eve', name: 'Social media calendar', deadline: '2026-04-06', status: 'Backlog', priority: 'Very Low', workflow: 'Not Started' },
    { id: 18, project: 'project-beta', pic: 'Frank', name: 'Competitor analysis doc', deadline: '2026-04-08', status: 'Cancelled', priority: 'Low', workflow: 'Done' },

    // Project Gamma
    { id: 19, project: 'project-gamma', pic: 'Hank', name: 'Mobile app wireframes', deadline: '2026-03-31', status: 'In Progress', priority: 'Urgent', workflow: 'In Progress' },
    { id: 20, project: 'project-gamma', pic: 'Ivy', name: 'Push notification service', deadline: '2026-04-01', status: 'Not Started', priority: 'High', workflow: 'Not Started' },
    { id: 21, project: 'project-gamma', pic: 'Hank', name: 'App store screenshots', deadline: '2026-04-02', status: 'Backlog', priority: 'Medium', workflow: 'Not Started' },
    { id: 22, project: 'project-gamma', pic: 'Ivy', name: 'Crash reporting setup', deadline: '2026-04-03', status: 'In Progress', priority: 'High', workflow: 'In Progress' },
    { id: 23, project: 'project-gamma', pic: 'Hank', name: 'Beta testing feedback review', deadline: '2026-04-05', status: 'Not Started', priority: 'Medium', workflow: 'Not Started' },
    { id: 24, project: 'project-gamma', pic: 'Ivy', name: 'Offline mode implementation', deadline: '2026-04-10', status: 'Backlog', priority: 'Low', workflow: 'Not Started' },
];

// Overdue tasks (deadline before today and not done)
const TODAY = new Date('2026-03-30T16:43:00+07:00');

function isOverdue(task) {
    if (task.status === 'Done' || task.status === 'Cancelled') return false;
    return new Date(task.deadline) < TODAY;
}

function isDueToday(task) {
    if (task.status === 'Done' || task.status === 'Cancelled') return false;
    const d = new Date(task.deadline);
    return d.getFullYear() === TODAY.getFullYear() &&
        d.getMonth() === TODAY.getMonth() &&
        d.getDate() === TODAY.getDate();
}

function isUpcoming(task) {
    if (task.status === 'Done' || task.status === 'Cancelled') return false;
    return new Date(task.deadline) > TODAY && !isDueToday(task);
}

// ── Charts instances ─────────────────────────────────────────
let progressChart, workloadChart, priorityChart, statusChart;

// ── Render ───────────────────────────────────────────────────
function getFilteredTasks() {
    const val = document.getElementById('projectFilter').value;
    if (val === 'all') return TASKS;
    return TASKS.filter(t => t.project === val);
}

function renderKPIs(tasks) {
    const projects = new Set(tasks.map(t => t.project));
    document.getElementById('kpiProjects').textContent = projects.size;
    document.getElementById('kpiTotalTasks').textContent = tasks.length;
    document.getElementById('kpiDueToday').textContent = tasks.filter(isDueToday).length;
    document.getElementById('kpiOverdue').textContent = tasks.filter(isOverdue).length;
    document.getElementById('kpiDone').textContent = tasks.filter(t => t.workflow === 'Done').length;
    document.getElementById('kpiInProgress').textContent = tasks.filter(t => t.workflow === 'In Progress').length;
    document.getElementById('kpiNotStarted').textContent = tasks.filter(t => t.workflow === 'Not Started').length;
}

function renderDueTodayTable(tasks) {
    const tbody = document.getElementById('dueTodayTable');
    const dueToday = tasks.filter(isDueToday);
    if (dueToday.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#9ca3af;">No tasks due today</td></tr>';
        return;
    }
    tbody.innerHTML = dueToday.map(t => {
        const time = new Date(t.deadline).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const iconClass = t.status === 'Done' ? 'done' : 'pending';
        const icon = t.status === 'Done' ? '&#10003;' : '&#8987;';
        return `<tr>
            <td><span class="status-icon ${iconClass}">${icon}</span></td>
            <td>${t.pic}</td>
            <td>${t.name}</td>
            <td>${time}</td>
        </tr>`;
    }).join('');
}

function renderUpcomingTable(tasks) {
    const tbody = document.getElementById('upcomingTable');
    const upcoming = tasks.filter(isUpcoming).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    if (upcoming.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:#9ca3af;">No upcoming tasks</td></tr>';
        return;
    }
    tbody.innerHTML = upcoming.map(t => {
        const date = new Date(t.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        return `<tr>
            <td>${t.pic}</td>
            <td>${t.name}</td>
            <td>${date}</td>
        </tr>`;
    }).join('');
}

function renderProgressChart(tasks) {
    const done = tasks.filter(t => t.workflow === 'Done').length;
    const total = tasks.length;
    const pct = total ? ((done / total) * 100).toFixed(2) : 0;
    document.getElementById('progressLabel').textContent = pct + '%';

    const data = {
        labels: ['Done', 'Remaining'],
        datasets: [{
            data: [done, total - done],
            backgroundColor: ['#10b981', '#e5e7eb'],
            borderWidth: 0
        }]
    };

    if (progressChart) {
        progressChart.data = data;
        progressChart.update();
    } else {
        progressChart = new Chart(document.getElementById('progressChart'), {
            type: 'doughnut',
            data,
            options: {
                cutout: '72%',
                plugins: { legend: { display: true, position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } } },
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }
}

function renderWorkloadChart(tasks) {
    const counts = {};
    tasks.forEach(t => { counts[t.pic] = (counts[t.pic] || 0) + 1; });
    const names = Object.keys(counts).sort();
    const values = names.map(n => counts[n]);

    const data = {
        labels: names,
        datasets: [{
            label: 'Tasks',
            data: values,
            backgroundColor: '#3b82f6',
            borderRadius: 6,
            barThickness: 28
        }]
    };

    if (workloadChart) {
        workloadChart.data = data;
        workloadChart.update();
    } else {
        workloadChart = new Chart(document.getElementById('workloadChart'), {
            type: 'bar',
            data,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } },
                    x: { grid: { display: false } }
                },
                plugins: { legend: { display: false } }
            }
        });
    }
}

function renderPriorityChart(tasks) {
    const order = ['Urgent', 'High', 'Medium', 'Low', 'Very Low'];
    const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'];
    const counts = {};
    tasks.forEach(t => { counts[t.priority] = (counts[t.priority] || 0) + 1; });

    const data = {
        labels: order,
        datasets: [{
            data: order.map(p => counts[p] || 0),
            backgroundColor: colors,
            borderWidth: 0
        }]
    };

    if (priorityChart) {
        priorityChart.data = data;
        priorityChart.update();
    } else {
        priorityChart = new Chart(document.getElementById('priorityChart'), {
            type: 'doughnut',
            data,
            options: {
                cutout: '55%',
                plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } } },
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }
}

function renderStatusChart(tasks) {
    const order = ['Done', 'In Progress', 'Not Started', 'Pending', 'Cancelled', 'Backlog'];
    const colors = ['#10b981', '#3b82f6', '#6b7280', '#f59e0b', '#ef4444', '#a78bfa'];
    const counts = {};
    tasks.forEach(t => { counts[t.status] = (counts[t.status] || 0) + 1; });

    const data = {
        labels: order,
        datasets: [{
            data: order.map(s => counts[s] || 0),
            backgroundColor: colors,
            borderWidth: 0
        }]
    };

    if (statusChart) {
        statusChart.data = data;
        statusChart.update();
    } else {
        statusChart = new Chart(document.getElementById('statusChart'), {
            type: 'doughnut',
            data,
            options: {
                cutout: '55%',
                plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } } },
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }
}

// ── Calendar ─────────────────────────────────────────────────
let calYear = 2026;
let calMonth = 2; // March (0-indexed)
let selectedDate = null;

function getEventDates(tasks) {
    const dates = {};
    tasks.forEach(t => {
        const d = new Date(t.deadline);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        if (!dates[key]) dates[key] = [];
        dates[key].push(t);
    });
    return dates;
}

function renderCalendar(tasks) {
    const eventDates = getEventDates(tasks);
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('calTitle').textContent = `${monthNames[calMonth]} ${calYear}`;

    let html = '';
    let day = 1;

    for (let row = 0; row < 6; row++) {
        html += '<tr>';
        for (let col = 0; col < 7; col++) {
            if (row === 0 && col < firstDay) {
                html += '<td class="other-month"></td>';
            } else if (day > daysInMonth) {
                html += '<td class="other-month"></td>';
            } else {
                const dateKey = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isToday = calYear === TODAY.getFullYear() && calMonth === TODAY.getMonth() && day === TODAY.getDate();
                const hasEvent = eventDates[dateKey] ? 'has-event' : '';
                const isSelected = selectedDate === dateKey ? 'selected' : '';
                const cls = [isToday ? 'today' : '', hasEvent, isSelected].filter(Boolean).join(' ');
                html += `<td class="${cls}" data-date="${dateKey}">${day}</td>`;
                day++;
            }
        }
        html += '</tr>';
        if (day > daysInMonth) break;
    }

    document.getElementById('calendarBody').innerHTML = html;

    // Click handlers
    document.querySelectorAll('#calendarBody td[data-date]').forEach(td => {
        td.addEventListener('click', () => {
            selectedDate = td.dataset.date;
            renderCalendar(tasks);
            renderAgenda(tasks, selectedDate);
        });
    });
}

function renderAgenda(tasks, dateKey) {
    const dateEl = document.getElementById('agendaDate');
    const listEl = document.getElementById('agendaList');

    if (!dateKey) {
        dateEl.textContent = 'Select a date';
        listEl.innerHTML = '<li class="agenda-empty">Click a date on the calendar to view events.</li>';
        return;
    }

    const d = new Date(dateKey + 'T00:00:00');
    dateEl.textContent = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    const matching = tasks.filter(t => {
        const td = new Date(t.deadline);
        return td.getFullYear() === d.getFullYear() &&
            td.getMonth() === d.getMonth() &&
            td.getDate() === d.getDate();
    });

    if (matching.length === 0) {
        listEl.innerHTML = '<li class="agenda-empty">No events on this date.</li>';
        return;
    }

    listEl.innerHTML = matching.map(t => {
        const time = new Date(t.deadline).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const hasTime = t.deadline.includes('T') && t.deadline.includes(':');
        return `<li>
            <div class="agenda-task">${t.name}</div>
            <div class="agenda-meta">${t.pic} &middot; ${t.priority} &middot; ${hasTime ? time : t.deadline}</div>
        </li>`;
    }).join('');
}

document.getElementById('calPrev').addEventListener('click', () => {
    calMonth--;
    if (calMonth < 0) { calMonth = 11; calYear--; }
    selectedDate = null;
    renderCalendar(getFilteredTasks());
    renderAgenda(getFilteredTasks(), selectedDate);
});

document.getElementById('calNext').addEventListener('click', () => {
    calMonth++;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    selectedDate = null;
    renderCalendar(getFilteredTasks());
    renderAgenda(getFilteredTasks(), selectedDate);
});

// ── Init ─────────────────────────────────────────────────────
function renderAll() {
    const tasks = getFilteredTasks();
    renderKPIs(tasks);
    renderDueTodayTable(tasks);
    renderUpcomingTable(tasks);
    renderProgressChart(tasks);
    renderWorkloadChart(tasks);
    renderPriorityChart(tasks);
    renderStatusChart(tasks);
    renderCalendar(tasks);
    renderAgenda(tasks, selectedDate);
}

document.getElementById('projectFilter').addEventListener('change', () => {
    selectedDate = null;
    renderAll();
});

renderAll();
