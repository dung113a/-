// Lấy các phần tử cần thiết
const container = document.querySelector('.container');
const cards = document.querySelectorAll('.card');
const detailsPanel = document.querySelector('.details-panel');
const detailTitle = document.getElementById('detail-title');
const detailContent = document.getElementById('detail-content');

// Khi nhấp vào thẻ (card)
cards.forEach((card) => {
    card.addEventListener('click', () => {
        // Ẩn tất cả các thẻ thành biểu tượng nhỏ và sắp xếp chúng thành một cột dọc
        container.classList.add('minimized');
        cards.forEach((c, index) => {
            c.classList.add('minimized');
            c.style.order = index; // Sắp xếp thứ tự thẻ
        });

        // Hiển thị chi tiết nội dung
        const detailText = card.getAttribute('data-detail');
        detailTitle.innerText = card.querySelector('h3')?.innerText || "Details";
        detailContent.innerText = detailText || "No additional details available.";

        // Hiển thị phần panel chi tiết
        detailsPanel.classList.add('active');
    });
});

// Khi nhấp ra ngoài vùng thẻ hoặc chi tiết
document.body.addEventListener('click', (event) => {
    const isCard = event.target.closest('.card');
    const isDetailsPanel = event.target.closest('.details-panel');

    // Nếu không nhấp vào thẻ hoặc panel, quay về trạng thái ban đầu
    if (!isCard && !isDetailsPanel) {
        container.classList.remove('minimized');
        cards.forEach((c) => {
            c.classList.remove('minimized');
            c.style.order = ''; // Xóa thuộc tính order để trở lại trạng thái ban đầu
        });
        detailsPanel.classList.remove('active');
    }
});

// Hàm để tải dữ liệu biểu đồ từ API
async function loadChartData() {
    try {
        // Gọi API để lấy dữ liệu biểu đồ
        const response = await fetch('/Performance/GetChartData');

        // Kiểm tra nếu phản hồi không thành công
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Kiểm tra nếu dữ liệu không có
        if (!data || data.length === 0) {
            console.warn('Không có dữ liệu để hiển thị biểu đồ');
            return;
        }

        // Lấy ngày (PerformanceDate) và phân loại dữ liệu theo lớp
        const labels = [...new Set(data.map(item => new Date(item.performanceDate).toLocaleDateString()))];
        const classData = (className) =>
            labels.map(
                (label) =>
                    data.find(
                        (item) => item.className === className && new Date(item.performanceDate).toLocaleDateString() === label
                    )?.score || 0 // Nếu không có điểm, trả về 0
            );

        // Chuẩn bị dữ liệu cho các lớp
        const chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Class A',
                    data: classData('Class A'),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.4,
                },
                {
                    label: 'Class B',
                    data: classData('Class B'),
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    tension: 0.4,
                },
                {
                    label: 'Class C',
                    data: classData('Class C'),
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    tension: 0.4,
                },
            ],
        };

        // Khởi tạo biểu đồ
        const ctx = document.getElementById('lineChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Ngày',
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Điểm trung bình',
                        },
                    },
                },
            },
        });
    } catch (error) {
        console.error('Error loading chart data:', error);
    }
}

// Gọi hàm loadChartData khi tài liệu đã sẵn sàng
document.addEventListener('DOMContentLoaded', loadChartData);
