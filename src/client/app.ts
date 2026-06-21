interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  user?: {
    username: string;
    email: string;
  };
}

interface StudentRecord {
  id: string;
  nim: string;
  name: string;
  email: string;
  major: string;
  semester: number;
}

const loginSection = document.querySelector<HTMLDivElement>('#loginSection')!;
const dashboardSection = document.querySelector<HTMLDivElement>('#dashboardSection')!;
const logoutButton = document.querySelector<HTMLButtonElement>('#logoutButton')!;

const loginForm = document.querySelector<HTMLFormElement>('#loginForm')!;
const usernameInput = document.querySelector<HTMLInputElement>('#usernameInput')!;
const passwordInput = document.querySelector<HTMLInputElement>('#passwordInput')!;
const loginMessage = document.querySelector<HTMLParagraphElement>('#loginMessage')!;

const sendOtpButton = document.querySelector<HTMLButtonElement>('#sendOtpButton')!;
const verifyOtpButton = document.querySelector<HTMLButtonElement>('#verifyOtpButton')!;
const otpEmailInput = document.querySelector<HTMLInputElement>('#otpEmailInput')!;
const otpCodeInput = document.querySelector<HTMLInputElement>('#otpCodeInput')!;
const otpMessage = document.querySelector<HTMLParagraphElement>('#otpMessage')!;

const studentForm = document.querySelector<HTMLFormElement>('#studentForm')!;
const editModeInput = document.querySelector<HTMLInputElement>('#editModeInput')!;
const nimInput = document.querySelector<HTMLInputElement>('#nimInput')!;
const nameInput = document.querySelector<HTMLInputElement>('#nameInput')!;
const emailInput = document.querySelector<HTMLInputElement>('#emailInput')!;
const majorInput = document.querySelector<HTMLInputElement>('#majorInput')!;
const semesterInput = document.querySelector<HTMLInputElement>('#semesterInput')!;
const saveStudentButton = document.querySelector<HTMLButtonElement>('#saveStudentButton')!;
const cancelEditButton = document.querySelector<HTMLButtonElement>('#cancelEditButton')!;
const studentMessage = document.querySelector<HTMLParagraphElement>('#studentMessage')!;

const keywordInput = document.querySelector<HTMLInputElement>('#keywordInput')!;
const searchMethodSelect = document.querySelector<HTMLSelectElement>('#searchMethodSelect')!;
const sortMethodSelect = document.querySelector<HTMLSelectElement>('#sortMethodSelect')!;
const sortKeySelect = document.querySelector<HTMLSelectElement>('#sortKeySelect')!;
const refreshButton = document.querySelector<HTMLButtonElement>('#refreshButton')!;
const studentTableBody = document.querySelector<HTMLTableSectionElement>('#studentTableBody')!;

const importFileInput = document.querySelector<HTMLInputElement>('#importFileInput')!;
const importButton = document.querySelector<HTMLButtonElement>('#importButton')!;
const themeToggleButton = document.querySelector<HTMLButtonElement>('#themeToggleButton')!;
const tableSummary = document.querySelector<HTMLDivElement>('#tableSummary')!;
const paginationContainer = document.querySelector<HTMLDivElement>('#paginationContainer')!;
const refreshChartButton = document.querySelector<HTMLButtonElement>('#refreshChartButton')!;
const studentChart = document.querySelector<HTMLCanvasElement>('#studentChart')!;

let currentStudents: StudentRecord[] = [];
let currentPage = 1;
const pageSize = 8;

function setMessage(element: HTMLElement, message: string, type: 'success' | 'error'): void {
  element.textContent = message;
  element.className = `message ${type}`;
}

function setLoggedIn(isLoggedIn: boolean): void {
  localStorage.setItem('isLoggedIn', String(isLoggedIn));
  loginSection.classList.toggle('hidden', isLoggedIn);
  dashboardSection.classList.toggle('hidden', !isLoggedIn);
  logoutButton.classList.toggle('hidden', !isLoggedIn);

  if (isLoggedIn) {
    loadStudents();
  }
}

async function requestJson<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  const response = await fetch(url, {
    ...options,
    headers
  });

  const body = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !body.success) {
    throw new Error(body.message || 'Terjadi kesalahan request.');
  }

  return body;
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    const result = await requestJson('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: usernameInput.value,
        password: passwordInput.value
      })
    });

    setMessage(loginMessage, result.message || 'Login berhasil.', 'success');
    setLoggedIn(true);
  } catch (error) {
    setMessage(loginMessage, error instanceof Error ? error.message : 'Login gagal.', 'error');
  }
});

logoutButton.addEventListener('click', () => {
  setLoggedIn(false);
  setMessage(loginMessage, 'Anda sudah logout.', 'success');
});

sendOtpButton.addEventListener('click', async () => {
  try {
    const result = await requestJson('/api/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ email: otpEmailInput.value })
    });
    setMessage(otpMessage, result.message || 'OTP dikirim.', 'success');
  } catch (error) {
    setMessage(otpMessage, error instanceof Error ? error.message : 'Gagal mengirim OTP.', 'error');
  }
});

verifyOtpButton.addEventListener('click', async () => {
  try {
    const result = await requestJson('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({
        email: otpEmailInput.value,
        otpCode: otpCodeInput.value
      })
    });
    setMessage(otpMessage, result.message || 'OTP valid.', 'success');
  } catch (error) {
    setMessage(otpMessage, error instanceof Error ? error.message : 'OTP tidak valid.', 'error');
  }
});

async function loadStudents(): Promise<void> {
  try {
    const query = new URLSearchParams({
      keyword: keywordInput.value,
      searchMethod: searchMethodSelect.value,
      sortMethod: sortMethodSelect.value,
      sortKey: sortKeySelect.value
    });

    const result = await requestJson<StudentRecord[]>(`/api/students?${query.toString()}`);
    currentStudents = result.data || [];
    currentPage = 1;
    renderStudentPage();
    renderChart();
  } catch (error) {
    setMessage(studentMessage, error instanceof Error ? error.message : 'Gagal memuat data.', 'error');
  }
}

function renderStudentPage(): void {
  const totalStudents = currentStudents.length;
  const totalPages = Math.max(1, Math.ceil(totalStudents / pageSize));

  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  const start = (currentPage - 1) * pageSize;
  const pagedStudents = currentStudents.slice(start, start + pageSize);

  renderStudents(pagedStudents);
  tableSummary.textContent = `Menampilkan ${pagedStudents.length} dari ${totalStudents} mahasiswa`;
  renderPagination(totalPages);
}

function renderPagination(totalPages: number): void {
  paginationContainer.innerHTML = '';

  if (totalPages <= 1) {
    return;
  }

  const createButton = (label: string, page: number, disabled = false, active = false): HTMLButtonElement => {
    const button = document.createElement('button');
    button.textContent = label;
    button.disabled = disabled;
    button.className = active ? 'active' : '';
    if (!disabled && !active) {
      button.addEventListener('click', () => {
        currentPage = page;
        renderStudentPage();
      });
    }
    return button;
  };

  paginationContainer.appendChild(createButton('←', currentPage - 1, currentPage === 1));

  for (let page = 1; page <= totalPages; page += 1) {
    paginationContainer.appendChild(createButton(String(page), page, false, page === currentPage));
  }

  paginationContainer.appendChild(createButton('→', currentPage + 1, currentPage === totalPages));
}

function renderChart(): void {
  const ctx = studentChart.getContext('2d');
  if (!ctx) {
    return;
  }

  const counts = currentStudents.reduce<Record<string, number>>((acc, student) => {
    acc[student.major] = (acc[student.major] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(counts);
  const values = Object.values(counts);

  const canvasWidth = studentChart.clientWidth;
  const canvasHeight = studentChart.clientHeight;
  const pixelRatio = window.devicePixelRatio || 1;

  studentChart.width = canvasWidth * pixelRatio;
  studentChart.height = canvasHeight * pixelRatio;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = 'transparent';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const canvasColor = getComputedStyle(document.body).getPropertyValue('--muted').trim() || '#94a3b8';
  const canvasText = getComputedStyle(document.body).getPropertyValue('--text').trim() || '#111827';

  if (labels.length === 0) {
    ctx.fillStyle = canvasColor;
    ctx.font = '18px Inter, system-ui, sans-serif';
    ctx.fillText('Tidak ada data untuk ditampilkan.', 20, 48);
    return;
  }

  const maxValue = Math.max(...values);
  const barWidth = Math.min(64, (canvasWidth - 64) / labels.length - 16);
  const chartHeight = canvasHeight - 90;
  const chartLeft = 48;
  const chartBottom = canvasHeight - 40;

  const palette = ['#4f46e5', '#3b82f6', '#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6'];

  ctx.font = '600 14px Inter, system-ui, sans-serif';
  ctx.fillStyle = 'var(--muted)';
  ctx.textAlign = 'left';

  labels.forEach((label, index) => {
    const x = chartLeft + index * (barWidth + 32);
    const value = counts[label];
    const barHeight = (value / maxValue) * chartHeight;

    ctx.fillStyle = palette[index % palette.length];
    ctx.fillRect(x, chartBottom - barHeight, barWidth, barHeight);

    ctx.fillStyle = 'var(--text)';
    ctx.textAlign = 'center';
    ctx.fillText(String(value), x + barWidth / 2, chartBottom - barHeight - 12);

    ctx.fillStyle = 'var(--muted)';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + barWidth / 2, chartBottom + 20);
  });
}

function toggleTheme(): void {
  const isDark = document.body.classList.toggle('dark-theme');
  themeToggleButton.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function initializeTheme(): void {
  const storedTheme = localStorage.getItem('theme');
  const isDark = storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (isDark) {
    document.body.classList.add('dark-theme');
    themeToggleButton.textContent = '☀️ Light Mode';
  } else {
    document.body.classList.remove('dark-theme');
    themeToggleButton.textContent = '🌙 Dark Mode';
  }
}

themeToggleButton.addEventListener('click', toggleTheme);
refreshChartButton.addEventListener('click', renderChart);
window.addEventListener('resize', () => {
  if (!dashboardSection.classList.contains('hidden')) {
    renderChart();
  }
});

function renderStudents(students: StudentRecord[]): void {
  studentTableBody.innerHTML = '';

  if (students.length === 0) {
    studentTableBody.innerHTML = '<tr><td colspan="6">Data tidak ditemukan.</td></tr>';
    return;
  }

  students.forEach((student) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.nim}</td>
      <td>${student.name}</td>
      <td>${student.email}</td>
      <td>${student.major}</td>
      <td>${student.semester}</td>
      <td>
        <div class="action-buttons">
          <button type="button" data-action="edit" data-nim="${student.nim}">Edit</button>
          <button type="button" class="danger" data-action="delete" data-nim="${student.nim}">Hapus</button>
        </div>
      </td>
    `;

    row.querySelector<HTMLButtonElement>('[data-action="edit"]')!.addEventListener('click', () => fillEditForm(student));
    row.querySelector<HTMLButtonElement>('[data-action="delete"]')!.addEventListener('click', () => deleteStudent(student.nim));
    studentTableBody.appendChild(row);
  });
}

function fillEditForm(student: StudentRecord): void {
  editModeInput.value = 'true';
  nimInput.value = student.nim;
  nimInput.readOnly = true;
  nameInput.value = student.name;
  emailInput.value = student.email;
  majorInput.value = student.major;
  semesterInput.value = String(student.semester);
  saveStudentButton.textContent = 'Update';
}

function resetStudentForm(): void {
  studentForm.reset();
  editModeInput.value = 'false';
  nimInput.readOnly = false;
  saveStudentButton.textContent = 'Simpan';
}

studentForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const isEditMode = editModeInput.value === 'true';
  const studentPayload = {
    nim: nimInput.value,
    name: nameInput.value,
    email: emailInput.value,
    major: majorInput.value,
    semester: Number(semesterInput.value)
  };

  try {
    const url = isEditMode ? `/api/students/${nimInput.value}` : '/api/students';
    const method = isEditMode ? 'PUT' : 'POST';
    const body = isEditMode
      ? JSON.stringify({
          name: studentPayload.name,
          email: studentPayload.email,
          major: studentPayload.major,
          semester: studentPayload.semester
        })
      : JSON.stringify(studentPayload);

    const result = await requestJson<StudentRecord>(url, { method, body });
    setMessage(studentMessage, result.message || 'Data berhasil disimpan.', 'success');
    resetStudentForm();
    await loadStudents();
  } catch (error) {
    setMessage(studentMessage, error instanceof Error ? error.message : 'Gagal menyimpan data.', 'error');
  }
});

async function deleteStudent(nim: string): Promise<void> {
  const confirmed = confirm(`Yakin ingin menghapus mahasiswa dengan NIM ${nim}?`);
  if (!confirmed) return;

  try {
    const result = await requestJson(`/api/students/${nim}`, { method: 'DELETE' });
    setMessage(studentMessage, result.message || 'Data berhasil dihapus.', 'success');
    await loadStudents();
  } catch (error) {
    setMessage(studentMessage, error instanceof Error ? error.message : 'Gagal menghapus data.', 'error');
  }
}

refreshButton.addEventListener('click', loadStudents);
keywordInput.addEventListener('input', () => loadStudents());
sortMethodSelect.addEventListener('change', loadStudents);
sortKeySelect.addEventListener('change', loadStudents);
searchMethodSelect.addEventListener('change', loadStudents);
cancelEditButton.addEventListener('click', resetStudentForm);

importButton.addEventListener('click', async () => {
  const file = importFileInput.files?.[0];

  if (!file) {
    setMessage(studentMessage, 'Pilih file PDF atau gambar terlebih dahulu.', 'error');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('document', file);

    const response = await fetch('/api/students/import/file', {
      method: 'POST',
      body: formData
    });

    const result = (await response.json()) as ApiResponse<unknown>;
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Upload file gagal.');
    }

    setMessage(studentMessage, 'File berhasil diunggah.', 'success');
    importFileInput.value = '';
    await loadStudents();
  } catch (error) {
    setMessage(studentMessage, error instanceof Error ? error.message : 'Upload gagal.', 'error');
  }
});

const savedLoginState = localStorage.getItem('isLoggedIn') === 'true';
initializeTheme();
setLoggedIn(savedLoginState);
