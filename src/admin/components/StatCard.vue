<template>
  <div class="stat-card" :style="{ backgroundColor: backgroundColor }">
    <div class="stat-icon">
      <i :class="icon"></i>
    </div>
    <div class="stat-content">
      <div class="stat-value">{{ formatValue(value) }}</div>
      <div class="stat-title">{{ title }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'stat-card',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [Number, String],
      required: true
    },
    icon: {
      type: String,
      default: 'fas fa-chart-bar'
    },
    backgroundColor: {
      type: String,
      default: '#FF7B54'
    }
  },
  methods: {
    formatValue(value) {
      if (typeof value === 'number' && value > 999) {
        return value.toLocaleString('vi-VN');
      }
      return value;
    }
  }
};
</script>

<style scoped>
.stat-card {
  display: flex;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  color: white;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
  min-height: 100px;
}

.stat-icon {
  font-size: 3rem;
  margin-right: 20px;
  display: flex;
  align-items: center;
  opacity: 0.7;
}

.stat-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-title {
  font-size: 1rem;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .stat-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .stat-icon {
    margin-right: 0;
    margin-bottom: 10px;
  }
}
</style> 