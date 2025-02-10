// script.js

// Kredensial Blynk yang diberikan
const token = "M-MsQC9qCxhnBiJiMTED8bCRYgAsetqO";
// Endpoint API Blynk untuk masing-masing Virtual Pin
const apiUrlPH = `https://blynk.cloud/external/api/get?token=${token}&pin=V1`;
const apiUrlMoisture = `https://blynk.cloud/external/api/get?token=${token}&pin=V0`;

// Inisialisasi context untuk Chart.js
const ctx = document.getElementById('sensorChart').getContext('2d');

// Data dan konfigurasi chart dengan dua dataset dan dual y-axis
const chartData = {
  labels: [],
  datasets: [
    {
      label: 'pH',
      data: [],
      borderColor: 'rgba(75, 192, 192, 1)',
      yAxisID: 'y1',
      fill: false,
      tension: 0.1,
    },
    {
      label: 'Kelembapan (%)',
      data: [],
      borderColor: 'rgba(192, 75, 75, 1)',
      yAxisID: 'y2',
      fill: false,
      tension: 0.1,
    }
  ]
};

const chartConfig = {
  type: 'line',
  data: chartData,
  options: {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          displayFormats: {
            minute: 'HH:mm'
          }
        },
        title: {
          display: true,
          text: 'Waktu'
        }
      },
      y1: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'pH'
        },
        suggestedMin: 0,
        suggestedMax: 14,
      },
      y2: {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: 'Kelembapan (%)'
        },
        grid: {
          drawOnChartArea: false, // Hanya grid untuk satu sumbu saja
        },
        suggestedMin: 0,
        suggestedMax: 100,
      }
    }
  }
};

const sensorChart = new Chart(ctx, chartConfig);

// Fungsi untuk mengambil data dari Blynk dan mengupdate grafik
function fetchSensorData() {
  Promise.all([
    fetch(apiUrlPH).then(response => response.text()),
    fetch(apiUrlMoisture).then(response => response.text())
  ])
  .then(([phText, moistureText]) => {
    const phValue = parseFloat(phText);
    const moistureValue = parseFloat(moistureText);
    const now = new Date();

    // Tambahkan data baru ke grafik
    chartData.labels.push(now);
    chartData.datasets[0].data.push(phValue);
    chartData.datasets[1].data.push(moistureValue);

    sensorChart.update();
  })
  .catch(error => {
    console.error("Error fetching sensor data:", error);
  });
}

// Ambil data pertama kali segera saat halaman dimuat
fetchSensorData();

// Update data setiap 1 menit (60000 ms)
setInterval(fetchSensorData, 60000);
