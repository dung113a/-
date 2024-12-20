// Lấy các phần tử DOM
const container = document.querySelector('.container');
const cards = document.querySelectorAll('.card');
const detailsPanel = document.querySelector('.details-panel');
const detailTitle = document.getElementById('detail-title');
const detailContent = document.getElementById('detail-content');

// Hàm thu nhỏ tất cả thẻ và sắp xếp theo thứ tự
function minimizeCards() {
    container.classList.add('minimized');
    cards.forEach((c, index) => {
        c.classList.add('minimized');
        c.style.order = index;
    });
}

// Hàm khôi phục trạng thái ban đầu của các thẻ
function resetCards() {
    container.classList.remove('minimized');
    cards.forEach((c) => {
        c.classList.remove('minimized');
        c.style.order = '';
    });
    detailsPanel.classList.remove('active');
}

// Hàm hiển thị chi tiết thẻ profile
function showProfileDetails(card) {
    const imgSrc = card.querySelector('.profile-image')?.src || 'https://via.placeholder.com/100';
    const name = card.getAttribute('data-name') || 'Không có tên';
    const gender = card.getAttribute('data-gender') || 'Không rõ';
    const dob = card.getAttribute('data-dob') || 'Không rõ';
    const email = card.getAttribute('data-email') || 'Không có email';
    const username = card.getAttribute('data-username') || 'Không có tài khoản';

    detailTitle.innerText = "Thông tin cá nhân";
    detailContent.innerHTML = `
        <img src="${imgSrc}" alt="Profile Picture" class="profile-image-large">
        <p><strong>Họ và tên:</strong> ${name}</p>
        <p><strong>Giới tính:</strong> ${gender}</p>
        <p><strong>Năm sinh:</strong> ${dob}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Tài khoản:</strong> ${username}</p>
    `;
    detailsPanel.classList.add('active');
}

// Hàm hiển thị chi tiết cho các thẻ khác
function showCardDetails(card) {
    const detailText = card.getAttribute('data-detail') || "Không có thông tin chi tiết.";
    detailTitle.innerText = card.querySelector('h3')?.innerText || "Chi tiết";
    detailContent.innerText = detailText;
    detailsPanel.classList.add('active');
}

// Xử lý khi nhấp vào một thẻ
function handleCardClick(card) {
    minimizeCards();
    if (card.classList.contains('profile-card')) {
        showProfileDetails(card);
    } else {
        showCardDetails(card);
    }
}

// Gán sự kiện click cho từng thẻ
cards.forEach((card) => {
    card.addEventListener('click', (e) => {
        e.stopPropagation();
        handleCardClick(card);
    });
});

// Sự kiện click ra ngoài thẻ hoặc panel chi tiết
document.body.addEventListener('click', (event) => {
    const isCard = event.target.closest('.card');
    const isDetailsPanel = event.target.closest('.details-panel');

    if (!isCard && !isDetailsPanel) {
        resetCards();
    }
});

// Hàm tải dữ liệu và tạo biểu đồ
async function loadChartData() {
    try {
        const response = await fetch('/Performance/GetChartData');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (!data || data.length === 0) {
            console.warn('Không có dữ liệu biểu đồ.');
            return;
        }

        const labels = [...new Set(data.map(item => new Date(item.performanceDate).toLocaleDateString()))];

        const classData = (className) =>
            labels.map((label) =>
                data.find(
                    (item) => item.className === className && new Date(item.performanceDate).toLocaleDateString() === label
                )?.score || 0
            );

        const chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Class A',
                    data: classData('Class A'),
                    borderColor: '#4bc0c0',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.4,
                },
                {
                    label: 'Class B',
                    data: classData('Class B'),
                    borderColor: '#9966ff',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    tension: 0.4,
                },
                {
                    label: 'Class C',
                    data: classData('Class C'),
                    borderColor: '#ff9f40',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    tension: 0.4,
                },
            ],
        };

        const ctx = document.getElementById('lineChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                },
                scales: {
                    x: { title: { display: true, text: 'Ngày' } },
                    y: { title: { display: true, text: 'Điểm trung bình' } },
                },
            },
        });
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu biểu đồ:', error);
    }
}

// Gọi hàm loadChartData khi trang tải xong
document.addEventListener('DOMContentLoaded', loadChartData);
