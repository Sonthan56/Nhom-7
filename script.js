/**
 * 1. Hàm tính điểm trung bình
 * @param {Array<number>} scores - Mảng chứa điểm 5 môn học
 * @returns {number} - Điểm trung bình
 */
function calculateAverage(scores) {
  if (!scores || scores.length === 0) return 0;
  const sum = scores.reduce((total, score) => total + score, 0);
  return sum / scores.length;
}

/**
 * 2. Hàm xếp loại học tập
 * Quy tắc:
 *   >= 8.0  => Giỏi
 *   >= 6.5  => Khá
 *   >= 5.0  => Trung bình
 *   < 5.0   => Yếu
 * @param {number} avg - Điểm trung bình
 * @returns {string} - Xếp loại
 */
function classify(avg) {
  if (avg >= 8.0) {
    return 'Giỏi';
  } else if (avg >= 6.5) {
    return 'Khá';
  } else if (avg >= 5.0) {
    return 'Trung bình';
  } else {
    return 'Yếu';
  }
}

// Bắt sự kiện khi trang đã tải xong DOM
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('student-form');
  const btnReset = document.getElementById('btn-reset');
  const resultSection = document.getElementById('result-section');

  const fields = [
    { id: 'fullName', name: 'Họ tên sinh viên', isScore: false },
    { id: 'score1', name: 'Giải tích 1', isScore: true },
    { id: 'score2', name: 'Đại số tuyến tính', isScore: true },
    { id: 'score3', name: 'Xác suất thống kê', isScore: true },
    { id: 'score4', name: 'Tin học đại cương', isScore: true },
    { id: 'score5', name: 'Xây dựng ứng dụng Web', isScore: true }
  ];

  // Xóa thông báo lỗi cũ
  function clearErrors() {
    fields.forEach(field => {
      const inputElem = document.getElementById(field.id);
      const errorElem = document.getElementById(`error-${field.id}`);
      if (inputElem) inputElem.classList.remove('is-invalid');
      if (errorElem) errorElem.textContent = '';
    });
  }

  // Hiển thị lỗi cho từng ô nhập
  function showError(fieldId, message) {
    const inputElem = document.getElementById(fieldId);
    const errorElem = document.getElementById(`error-${fieldId}`);
    if (inputElem) inputElem.classList.add('is-invalid');
    if (errorElem) errorElem.textContent = message;
  }

  // Hàm kiểm tra hợp lệ dữ liệu (Validation)
  function validateForm() {
    clearErrors();
    let isValid = true;

    // 1. Kiểm tra Tên sinh viên
    const fullNameValue = document.getElementById('fullName').value.trim();
    if (fullNameValue === '') {
      showError('fullName', 'Vui lòng nhập họ và tên sinh viên.');
      isValid = false;
    }

    // 2. Kiểm tra điểm 5 môn học (0 đến 10)
    for (let i = 1; i <= 5; i++) {
      const fieldId = `score${i}`;
      const inputElem = document.getElementById(fieldId);
      const rawValue = inputElem.value.trim();

      if (rawValue === '') {
        showError(fieldId, 'Vui lòng nhập điểm môn này.');
        isValid = false;
      } else {
        const scoreVal = parseFloat(rawValue);
        if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 10) {
          showError(fieldId, 'Điểm phải là số từ 0 đến 10.');
          isValid = false;
        }
      }
    }

    return isValid;
  }

  // Xử lý sự kiện Submit Form (Nút "Tính")
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Ngăn chặn nạp lại trang

    // Validation dữ liệu
    if (!validateForm()) {
      resultSection.classList.add('hidden');
      return;
    }

    // Lấy thông tin họ tên
    const fullName = document.getElementById('fullName').value.trim();

    // Mảng lưu điểm 5 môn
    const scores = [];
    for (let i = 1; i <= 5; i++) {
      const val = parseFloat(document.getElementById(`score${i}`).value.trim());
      scores.push(val);
    }

    // Gọi hàm tính điểm trung bình & xếp loại theo yêu cầu
    const avgScore = calculateAverage(scores);
    const rank = classify(avgScore);

    // Cập nhật kết quả lên giao diện
    document.getElementById('res-name').textContent = fullName;
    for (let i = 0; i < scores.length; i++) {
      document.getElementById(`res-score${i + 1}`).textContent = scores[i].toFixed(1);
    }

    // Làm tròn điểm trung bình đến 2 chữ số thập phân
    document.getElementById('res-average').textContent = avgScore.toFixed(2);

    // Cập nhật giao diện Xếp loại
    const classBadge = document.getElementById('res-classification');
    classBadge.textContent = rank;

    // Áp dụng lớp CSS màu tương ứng với từng loại
    classBadge.className = 'badge';
    if (rank === 'Giỏi') {
      classBadge.classList.add('badge-gioi');
    } else if (rank === 'Khá') {
      classBadge.classList.add('badge-kha');
    } else if (rank === 'Trung bình') {
      classBadge.classList.add('badge-trung-binh');
    } else {
      classBadge.classList.add('badge-yeu');
    }

    // Hiển thị khung kết quả ngay trên trang
    resultSection.classList.remove('hidden');
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  // Sự kiện Nút "Nhập lại"
  btnReset.addEventListener('click', () => {
    form.reset();
    clearErrors();
    resultSection.classList.add('hidden');
  });
});