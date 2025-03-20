<template>
  <div class="dashboard">
    <h1 class="dashboard-title">Bảng Điều Khiển</h1>

    <div v-if="loading" class="loading-container">
      <div class="spinner">
        <i class="fas fa-spinner fa-spin"></i>
      </div>
      <p>Đang tải dữ liệu...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <i class="fas fa-exclamation-triangle"></i>
      <p>{{ error }}</p>
      <button @click="fetchDashboardData" class="btn btn-primary">
        <i class="fas fa-sync-alt"></i> Thử lại
      </button>
    </div>

    <div v-else>
      <div class="stats-container">
        <stat-card
          title="Tổng Doanh Thu"
          :value="dashboardData.totalRevenue"
          icon="fas fa-money-bill-wave"
          backgroundColor="#FF7B54"
        />
        <stat-card
          title="Tổng Đơn Hàng"
          :value="dashboardData.totalOrders"
          icon="fas fa-shopping-bag"
          backgroundColor="#4CAF50"
        />
        <stat-card
          title="Tổng Khách Hàng"
          :value="dashboardData.totalCustomers"
          icon="fas fa-users"
          backgroundColor="#2196F3"
        />
        <stat-card
          title="Tổng Sản Phẩm"
          :value="dashboardData.totalProducts"
          icon="fas fa-box"
          backgroundColor="#FF5722"
        />
      </div>

      <div class="chart-section">
        <div class="chart-header">
          <h2>Doanh Thu Tháng {{ currentMonth }} Năm {{ currentYear }}</h2>
          <div class="chart-actions">
            <button class="btn btn-sm btn-outline">
              <i class="fas fa-minus"></i>
            </button>
            <button class="btn btn-sm btn-outline">
              <i class="fas fa-expand"></i>
            </button>
          </div>
        </div>
        <div class="chart-container">
          <div class="chart-placeholder">
            <div class="chart-bars">
              <div
                v-for="(value, index) in dashboardData.salesData"
                :key="index"
                class="chart-bar"
                :style="{
                  height: `${
                    value > 0 ? Math.max((value / maxSalesValue) * 250, 5) : 0
                  }px`,
                }"
              ></div>
            </div>
            <div class="chart-labels">
              <div
                v-for="n in dashboardData.salesData.length"
                :key="n"
                class="chart-label"
              >
                {{ n }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="recent-section">
        <div class="recent-orders">
          <h2>Đơn Hàng Gần Đây</h2>
          <table class="data-table">
            <thead>
              <tr>
                <th>Mã Đơn</th>
                <th>Khách Hàng</th>
                <th>Ngày</th>
                <th>Tổng Tiền</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in dashboardData.recentOrders" :key="order.id">
                <td>#{{ order.id.substring(0, 8) }}</td>
                <td>{{ order.customer }}</td>
                <td>{{ order.date }}</td>
                <td>{{ formatCurrency(order.total) }}</td>
                <td>
                  <span :class="['status-badge', getStatusClass(order.status)]">
                    {{ getStatusLabel(order.status) }}
                  </span>
                </td>
              </tr>
              <tr v-if="dashboardData.recentOrders.length === 0">
                <td colspan="5" class="empty-table">
                  Không có dữ liệu đơn hàng
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StatCard from "../components/StatCard.vue";

export default {
  name: "admin-dashboard",
  components: {
    StatCard,
  },
  data() {
    return {
      loading: true,
      error: null,
      dashboardData: {
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalProducts: 0,
        salesData: [],
        recentOrders: [],
        recentSubscribers: [],
      },
    };
  },
  computed: {
    currentMonth() {
      return new Date().getMonth() + 1; // JavaScript months are 0-indexed
    },
    currentYear() {
      return new Date().getFullYear();
    },
    maxSalesValue() {
      return Math.max(...this.dashboardData.salesData, 1);
    },
  },
  created() {
    this.fetchDashboardData();
  },
  methods: {
    async fetchDashboardData() {
      this.loading = true;
      this.error = null;

      try {
        // Kiểm tra token
        const token = localStorage.getItem("admin_token");
        if (!token) {
          this.$router.push("/admin/login");
          return;
        }

        // Gọi API lấy dữ liệu thống kê
        const response = await fetch(
          "http://localhost:5001/api/admin/dashboard/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            this.dashboardData = data.data;
          } else {
            throw new Error(data.message || "Không thể tải dữ liệu thống kê");
          }
        } else if (response.status === 401 || response.status === 403) {
          // Token không hợp lệ hoặc không có quyền admin
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_user");
          this.$router.push("/admin/login");
          return;
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              `Lỗi ${response.status}: ${response.statusText}`
          );
        }
      } catch (error) {
        console.error("Dashboard Error:", error);
        this.error =
          error.message ||
          "Không thể tải dữ liệu bảng điều khiển. Vui lòng thử lại sau.";

        // Nếu đang ở môi trường phát triển, vẫn hiển thị dữ liệu mẫu
        if (process.env.NODE_ENV === "development") {
          console.log("Sử dụng dữ liệu mẫu trong môi trường phát triển");
          this.dashboardData = {
            totalRevenue: 42266000,
            totalOrders: 13,
            totalCustomers: 45,
            totalProducts: 18305,
            salesData: [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 100000, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              300000, 0, 400000, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            ],
            recentOrders: [
              {
                id: "1001",
                customer: "Nguyễn Văn A",
                date: "25/02/2025",
                total: 2500000,
                status: "completed",
              },
              {
                id: "1002",
                customer: "Trần Thị B",
                date: "25/02/2025",
                total: 1800000,
                status: "processing",
              },
              {
                id: "1003",
                customer: "Lê Văn C",
                date: "24/07/2024",
                total: 3200000,
                status: "pending",
              },
              {
                id: "1004",
                customer: "Phạm Thị D",
                date: "27/02/2025",
                total: 950000,
                status: "completed",
              },
              {
                id: "1005",
                customer: "Hoàng Văn E",
                date: "22/02/2025",
                total: 4200000,
                status: "cancelled",
              },
            ],
          };
          // Ẩn lỗi nếu đang hiển thị dữ liệu mẫu
          this.error = null;
        }
      } finally {
        this.loading = false;
      }
    },

    formatCurrency(value) {
      return value.toLocaleString("vi-VN") + " đ";
    },

    getStatusClass(status) {
      const statusMap = {
        completed: "hoan-thanh",
        processing: "dang-xu-ly",
        pending: "cho-xu-ly",
        cancelled: "da-huy",
      };
      return statusMap[status] || status;
    },

    getStatusLabel(status) {
      const statusMap = {
        completed: "Hoàn thành",
        processing: "Đang xử lý",
        pending: "Chờ xử lý",
        cancelled: "Đã hủy",
      };
      return statusMap[status] || status;
    },
  },
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background-color: #f5f5f5;
}

.dashboard-title {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.loading-container,
.error-container {
  text-align: center;
  padding: 50px 0;
  color: #666;
}

.loading-container .spinner,
.error-container i {
  font-size: 48px;
  margin-bottom: 20px;
  color: #2196f3;
}

.error-container i {
  color: #f44336;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.chart-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 30px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h2 {
  font-size: 18px;
  margin: 0;
}

.chart-actions {
  display: flex;
  gap: 5px;
}

.btn {
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
}

.btn-primary {
  background-color: #2196f3;
  color: white;
  border: none;
}

.btn-sm {
  padding: 2px 5px;
  font-size: 12px;
}

.btn-outline {
  border-color: #ddd;
  color: #666;
}

.btn-outline:hover {
  background-color: #f5f5f5;
}

.chart-container {
  height: 300px;
  position: relative;
}

.chart-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.chart-bars {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 90%;
  padding-bottom: 20px;
}

.chart-bar {
  width: 20px;
  background-color: #2196f3;
  border-radius: 2px 2px 0 0;
  margin: 0 5px;
  transition: height 0.3s;
  min-height: 5px;
}

.chart-labels {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.chart-label {
  font-size: 12px;
  color: #888;
  width: 20px;
  text-align: center;
}

.recent-section {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 20px;
}

.recent-orders {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.recent-orders h2,
h2 {
  font-size: 18px;
  margin-bottom: 15px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.data-table th {
  font-weight: bold;
  color: #555;
  background-color: #f9f9f9;
}

.status-badge {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.hoan-thanh {
  background-color: #e6f7ee;
  color: #00965e;
}

.dang-xu-ly {
  background-color: #e6f3ff;
  color: #0070e0;
}

.cho-xu-ly {
  background-color: #fff8e6;
  color: #b78105;
}

.da-huy {
  background-color: #fee6e6;
  color: #d32f2f;
}

.hoat-dong {
  background-color: #e6f7ee;
  color: #00965e;
}

.khong-hoat-dong {
  background-color: #f5f5f5;
  color: #777;
}

.empty-table {
  text-align: center;
  color: #888;
  padding: 30px 0;
}

@media (max-width: 1024px) {
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }

  .recent-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
}
</style>
