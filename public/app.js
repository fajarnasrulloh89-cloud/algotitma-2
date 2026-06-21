"use strict";
(() => {
  // src/client/app.ts
  var loginSection = document.querySelector("#loginSection");
  var dashboardSection = document.querySelector("#dashboardSection");
  var logoutButton = document.querySelector("#logoutButton");
  var loginForm = document.querySelector("#loginForm");
  var usernameInput = document.querySelector("#usernameInput");
  var passwordInput = document.querySelector("#passwordInput");
  var loginMessage = document.querySelector("#loginMessage");
  var sendOtpButton = document.querySelector("#sendOtpButton");
  var verifyOtpButton = document.querySelector("#verifyOtpButton");
  var otpEmailInput = document.querySelector("#otpEmailInput");
  var otpCodeInput = document.querySelector("#otpCodeInput");
  var otpMessage = document.querySelector("#otpMessage");
  var studentForm = document.querySelector("#studentForm");
  var editModeInput = document.querySelector("#editModeInput");
  var nimInput = document.querySelector("#nimInput");
  var nameInput = document.querySelector("#nameInput");
  var emailInput = document.querySelector("#emailInput");
  var majorInput = document.querySelector("#majorInput");
  var semesterInput = document.querySelector("#semesterInput");
  var saveStudentButton = document.querySelector("#saveStudentButton");
  var cancelEditButton = document.querySelector("#cancelEditButton");
  var studentMessage = document.querySelector("#studentMessage");
  var keywordInput = document.querySelector("#keywordInput");
  var searchMethodSelect = document.querySelector("#searchMethodSelect");
  var sortMethodSelect = document.querySelector("#sortMethodSelect");
  var sortKeySelect = document.querySelector("#sortKeySelect");
  var refreshButton = document.querySelector("#refreshButton");
  var studentTableBody = document.querySelector("#studentTableBody");
  var importFileInput = document.querySelector("#importFileInput");
  var importButton = document.querySelector("#importButton");
  var themeToggleButton = document.querySelector("#themeToggleButton");
  var tableSummary = document.querySelector("#tableSummary");
  var paginationContainer = document.querySelector("#paginationContainer");
  var refreshChartButton = document.querySelector("#refreshChartButton");
  var studentChart = document.querySelector("#studentChart");
  var currentStudents = [];
  var currentPage = 1;
  var pageSize = 8;
  function setMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
  }
  function setLoggedIn(isLoggedIn) {
    localStorage.setItem("isLoggedIn", String(isLoggedIn));
    loginSection.classList.toggle("hidden", isLoggedIn);
    dashboardSection.classList.toggle("hidden", !isLoggedIn);
    logoutButton.classList.toggle("hidden", !isLoggedIn);
    if (isLoggedIn) {
      loadStudents();
    }
  }

  function getStoredTheme() {
    var theme = localStorage.getItem("theme");
    if (theme === "light" || theme === "dark") {
      return theme;
    }
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    document.body.classList.toggle("dark-theme", theme === "dark");
    if (themeToggleButton) {
      themeToggleButton.textContent = theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
    }
    localStorage.setItem("theme", theme);
    drawStudentChart();
  }

  function toggleTheme() {
    var current = document.body.classList.contains("dark-theme") ? "dark" : "light";
    applyTheme(current === "dark" ? "light" : "dark");
  }

  function updateTableSummary() {
    if (!tableSummary) {
      return;
    }
    var total = currentStudents.length;
    var start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    var end = Math.min(total, currentPage * pageSize);
    tableSummary.textContent = `Menampilkan ${start}-${end} dari ${total} mahasiswa`;
  }

  function renderPagination() {
    if (!paginationContainer) {
      return;
    }
    var totalPages = Math.max(1, Math.ceil(currentStudents.length / pageSize));
    paginationContainer.innerHTML = "";
    function createButton(label, page, disabled, active) {
      var button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      if (disabled) {
        button.classList.add("disabled");
        button.disabled = true;
      }
      if (active) {
        button.classList.add("active");
      }
      button.addEventListener("click", function() {
        currentPage = page;
        renderStudents();
        renderPagination();
        updateTableSummary();
      });
      return button;
    }
    paginationContainer.appendChild(createButton("‹", Math.max(1, currentPage - 1), currentPage === 1, false));
    var startPage = Math.max(1, currentPage - 2);
    var endPage = Math.min(totalPages, currentPage + 2);
    if (startPage > 1) {
      paginationContainer.appendChild(createButton("1", 1, false, currentPage === 1));
      if (startPage > 2) {
        var dots = document.createElement("span");
        dots.textContent = "…";
        paginationContainer.appendChild(dots);
      }
    }
    for (var page = startPage; page <= endPage; page += 1) {
      paginationContainer.appendChild(createButton(String(page), page, false, page === currentPage));
    }
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        var dots2 = document.createElement("span");
        dots2.textContent = "…";
        paginationContainer.appendChild(dots2);
      }
      paginationContainer.appendChild(createButton(String(totalPages), totalPages, false, currentPage === totalPages));
    }
    paginationContainer.appendChild(createButton("›", Math.min(totalPages, currentPage + 1), currentPage === totalPages, false));
  }

  function drawStudentChart() {
    if (!studentChart) {
      return;
    }
    var ctx = studentChart.getContext("2d");
    if (!ctx) {
      return;
    }
    var counts = currentStudents.reduce(function(acc, student) {
      var major = student.major || "Lainnya";
      acc[major] = (acc[major] || 0) + 1;
      return acc;
    }, {});
    var labels = Object.keys(counts);
    var values = labels.map(function(label) {
      return counts[label];
    });
    var rect = studentChart.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    var width = rect.width;
    var height = rect.height;
    studentChart.width = Math.max(width, 300) * dpr;
    studentChart.height = Math.max(height, 220) * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    var isDark = document.body.classList.contains("dark-theme");
    var bg = getComputedStyle(document.body).getPropertyValue("--surface").trim() || "#ffffff";
    var textColor = isDark ? "#e2e8f0" : "#111827";
    var axisColor = isDark ? "rgba(226, 232, 240, 0.5)" : "rgba(15, 23, 42, 0.2)";
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);
    ctx.font = "600 14px Inter, system-ui, sans-serif";
    ctx.fillStyle = textColor;
    ctx.textBaseline = "middle";
    if (labels.length === 0) {
      ctx.fillStyle = axisColor;
      ctx.textAlign = "center";
      ctx.fillText("Belum ada data mahasiswa untuk grafik.", width / 2, height / 2);
      return;
    }
    var chartLeft = 40;
    var chartRight = width - 20;
    var chartTop = 24;
    var chartBottom = height - 50;
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(chartLeft, chartTop);
    ctx.lineTo(chartLeft, chartBottom);
    ctx.lineTo(chartRight, chartBottom);
    ctx.stroke();
    var maxValue = Math.max.apply(null, values);
    var step = Math.max(1, Math.ceil(maxValue / 4));
    for (var tick = 0; tick <= 4; tick += 1) {
      var y = chartBottom - (chartBottom - chartTop) * (tick / 4);
      ctx.strokeStyle = isDark ? "rgba(226, 232, 240, 0.12)" : "rgba(15, 23, 42, 0.08)";
      ctx.beginPath();
      ctx.moveTo(chartLeft, y);
      ctx.lineTo(chartRight, y);
      ctx.stroke();
      ctx.fillStyle = textColor;
      ctx.textAlign = "right";
      ctx.fillText(String(step * tick), chartLeft - 8, y);
    }
    var barWidth = Math.min(72, (chartRight - chartLeft) / labels.length * 0.6);
    var gap = ((chartRight - chartLeft) - barWidth * labels.length) / Math.max(1, labels.length - 1);
    labels.forEach(function(label, index) {
      var value = values[index];
      var barHeight = ((chartBottom - chartTop) * value) / (step * 4 || 1);
      var x = chartLeft + index * (barWidth + gap);
      var y = chartBottom - barHeight;
      ctx.fillStyle = "rgba(79, 70, 229, 0.9)";
      ctx.fillRect(x, y, barWidth, barHeight);
      ctx.fillStyle = textColor;
      ctx.textAlign = "center";
      ctx.fillText(String(value), x + barWidth / 2, y - 12);
      ctx.font = "500 12px Inter, system-ui, sans-serif";
      ctx.fillText(label, x + barWidth / 2, chartBottom + 18);
      ctx.font = "600 14px Inter, system-ui, sans-serif";
    });
  }
  async function requestJson(url, options = {}) {
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");
    const response = await fetch(url, {
      ...options,
      headers
    });
    const body = await response.json();
    if (!response.ok || !body.success) {
      throw new Error(body.message || "Terjadi kesalahan request.");
    }
    return body;
  }
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const result = await requestJson("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: usernameInput.value,
          password: passwordInput.value
        })
      });
      setMessage(loginMessage, result.message || "Login berhasil.", "success");
      setLoggedIn(true);
    } catch (error) {
      setMessage(loginMessage, error instanceof Error ? error.message : "Login gagal.", "error");
    }
  });
  logoutButton.addEventListener("click", () => {
    setLoggedIn(false);
    setMessage(loginMessage, "Anda sudah logout.", "success");
  });
  sendOtpButton.addEventListener("click", async () => {
    try {
      const result = await requestJson("/api/auth/request-otp", {
        method: "POST",
        body: JSON.stringify({ email: otpEmailInput.value })
      });
      setMessage(otpMessage, result.message || "OTP dikirim.", "success");
    } catch (error) {
      setMessage(otpMessage, error instanceof Error ? error.message : "Gagal mengirim OTP.", "error");
    }
  });
  verifyOtpButton.addEventListener("click", async () => {
    try {
      const result = await requestJson("/api/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({
          email: otpEmailInput.value,
          otpCode: otpCodeInput.value
        })
      });
      setMessage(otpMessage, result.message || "OTP valid.", "success");
    } catch (error) {
      setMessage(otpMessage, error instanceof Error ? error.message : "OTP tidak valid.", "error");
    }
  });
  async function loadStudents() {
    try {
      var query = new URLSearchParams({
        keyword: keywordInput.value,
        searchMethod: searchMethodSelect.value,
        sortMethod: sortMethodSelect.value,
        sortKey: sortKeySelect.value
      });
      var result = await requestJson(`/api/students?${query.toString()}`);
      currentStudents = result.data || [];
      currentPage = 1;
      renderStudents();
      renderPagination();
      updateTableSummary();
      drawStudentChart();
    } catch (error) {
      setMessage(studentMessage, error instanceof Error ? error.message : "Gagal memuat data.", "error");
    }
  }
  function renderStudents() {
    studentTableBody.innerHTML = "";
    var startIndex = (currentPage - 1) * pageSize;
    var pageStudents = currentStudents.slice(startIndex, startIndex + pageSize);
    if (pageStudents.length === 0) {
      studentTableBody.innerHTML = '<tr><td colspan="6">Data tidak ditemukan.</td></tr>';
      return;
    }
    pageStudents.forEach(function(student) {
      var row = document.createElement("tr");
      row.innerHTML = "\n      <td>" + student.nim + "</td>\n      <td>" + student.name + "</td>\n      <td>" + student.email + "</td>\n      <td>" + student.major + "</td>\n      <td>" + student.semester + "</td>\n      <td>\n        <div class=\"action-buttons\">\n          <button type=\"button\" data-action=\"edit\" data-nim=\"" + student.nim + "\">Edit</button>\n          <button type=\"button\" class=\"danger\" data-action=\"delete\" data-nim=\"" + student.nim + "\">Hapus</button>\n        </div>\n      </td>\n    ";
      row.querySelector('[data-action="edit"]').addEventListener("click", function() {
        fillEditForm(student);
      });
      row.querySelector('[data-action="delete"]').addEventListener("click", function() {
        deleteStudent(student.nim);
      });
      studentTableBody.appendChild(row);
    });
  }
  function fillEditForm(student) {
    editModeInput.value = "true";
    nimInput.value = student.nim;
    nimInput.readOnly = true;
    nameInput.value = student.name;
    emailInput.value = student.email;
    majorInput.value = student.major;
    semesterInput.value = String(student.semester);
    saveStudentButton.textContent = "Update";
  }
  function resetStudentForm() {
    studentForm.reset();
    editModeInput.value = "false";
    nimInput.readOnly = false;
    saveStudentButton.textContent = "Simpan";
  }
  studentForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const isEditMode = editModeInput.value === "true";
    const studentPayload = {
      nim: nimInput.value,
      name: nameInput.value,
      email: emailInput.value,
      major: majorInput.value,
      semester: Number(semesterInput.value)
    };
    try {
      const url = isEditMode ? `/api/students/${nimInput.value}` : "/api/students";
      const method = isEditMode ? "PUT" : "POST";
      const body = isEditMode ? JSON.stringify({
        name: studentPayload.name,
        email: studentPayload.email,
        major: studentPayload.major,
        semester: studentPayload.semester
      }) : JSON.stringify(studentPayload);
      const result = await requestJson(url, { method, body });
      setMessage(studentMessage, result.message || "Data berhasil disimpan.", "success");
      resetStudentForm();
      await loadStudents();
    } catch (error) {
      setMessage(studentMessage, error instanceof Error ? error.message : "Gagal menyimpan data.", "error");
    }
  });
  async function deleteStudent(nim) {
    const confirmed = confirm(`Yakin ingin menghapus mahasiswa dengan NIM ${nim}?`);
    if (!confirmed) return;
    try {
      const result = await requestJson(`/api/students/${nim}`, { method: "DELETE" });
      setMessage(studentMessage, result.message || "Data berhasil dihapus.", "success");
      await loadStudents();
    } catch (error) {
      setMessage(studentMessage, error instanceof Error ? error.message : "Gagal menghapus data.", "error");
    }
  }
  refreshButton.addEventListener("click", loadStudents);
  keywordInput.addEventListener("input", function() {
    loadStudents();
  });
  sortMethodSelect.addEventListener("change", loadStudents);
  sortKeySelect.addEventListener("change", loadStudents);
  searchMethodSelect.addEventListener("change", loadStudents);
  cancelEditButton.addEventListener("click", resetStudentForm);
  if (themeToggleButton) {
    themeToggleButton.addEventListener("click", toggleTheme);
  }
  if (refreshChartButton) {
    refreshChartButton.addEventListener("click", drawStudentChart);
  }
  window.addEventListener("resize", function() {
    drawStudentChart();
  });
  importButton.addEventListener("click", async () => {
    const file = importFileInput.files?.[0];
    if (!file) {
      setMessage(studentMessage, "Pilih file PDF atau gambar terlebih dahulu.", "error");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("document", file);
      const response = await fetch("/api/students/import/file", {
        method: "POST",
        body: formData
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Upload file gagal.");
      }
      setMessage(studentMessage, "File berhasil diunggah.", "success");
      importFileInput.value = "";
      await loadStudents();
    } catch (error) {
      setMessage(studentMessage, error instanceof Error ? error.message : "Upload gagal.", "error");
    }
  });
  applyTheme(getStoredTheme());
  var savedLoginState = localStorage.getItem("isLoggedIn") === "true";
  setLoggedIn(savedLoginState);
})();
