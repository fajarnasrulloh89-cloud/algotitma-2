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
      const query = new URLSearchParams({
        keyword: keywordInput.value,
        searchMethod: searchMethodSelect.value,
        sortMethod: sortMethodSelect.value,
        sortKey: sortKeySelect.value
      });
      const result = await requestJson(`/api/students?${query.toString()}`);
      renderStudents(result.data || []);
    } catch (error) {
      setMessage(studentMessage, error instanceof Error ? error.message : "Gagal memuat data.", "error");
    }
  }
  function renderStudents(students) {
    studentTableBody.innerHTML = "";
    if (students.length === 0) {
      studentTableBody.innerHTML = '<tr><td colspan="6">Data tidak ditemukan.</td></tr>';
      return;
    }
    students.forEach((student) => {
      const row = document.createElement("tr");
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
      row.querySelector('[data-action="edit"]').addEventListener("click", () => fillEditForm(student));
      row.querySelector('[data-action="delete"]').addEventListener("click", () => deleteStudent(student.nim));
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
  keywordInput.addEventListener("input", () => loadStudents());
  sortMethodSelect.addEventListener("change", loadStudents);
  sortKeySelect.addEventListener("change", loadStudents);
  searchMethodSelect.addEventListener("change", loadStudents);
  cancelEditButton.addEventListener("click", resetStudentForm);
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
  var savedLoginState = localStorage.getItem("isLoggedIn") === "true";
  setLoggedIn(savedLoginState);
})();
