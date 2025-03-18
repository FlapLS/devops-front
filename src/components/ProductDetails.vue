<template>
  <div class="product-details">
    <h2 class="title">Детали продукта</h2>
    <div v-if="product" class="product-card">
      <div class="product-info">
        <div class="field">
          <strong>Название:</strong>
          <span class="value">{{ product.name }}</span>
        </div>
        <div class="field">
          <strong>Количество:</strong>
          <span class="value">{{ product.amount }}</span>
        </div>
        <div class="field">
          <strong>Фактическое количество:</strong>
          <span class="value">{{ product.actualAmount }}</span>
        </div>
        <div class="field">
          <strong>Бренд:</strong>
          <span class="value">{{ product.brand }}</span>
        </div>
        <div class="field">
          <strong>Тип цвета:</strong>
          <span class="value">{{ product.typeColor }}</span>
        </div>
        <div class="field">
          <strong>Артикул:</strong>
          <span class="value">{{ product.article }}</span>
        </div>
        <div class="field">
          <strong>Код цвета:</strong>
          <span class="color-label" :style="{ backgroundColor: product.codeColor }">
            {{ product.codeColor }}
          </span>
        </div>
        <div class="field">
          <strong>Дата создания:</strong>
          <span class="value">{{ formatDate(product.creationDate) }}</span>
        </div>
        <div class="field">
          <strong>Дата обновления:</strong>
          <span class="value">{{ formatDate(product.updateDate) }}</span>
        </div>
      </div>
    </div>
    <div v-else class="loading">Загрузка...</div>
    <button class="back-button" @click="goBack">Назад</button>
  </div>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from "@/apiConfig";

export default {
  data() {
    return {
      product: null,
    };
  },
  async created() {
    const id = this.$route.params.id;
    await this.fetchProduct(id);
  },
  methods: {
    async fetchProduct(id) {
      try {
        const response = await axios.get(`${API_BASE_URL}/products/${id}`);
        this.product = response.data;
      } catch (error) {
        console.error('Ошибка при загрузке продукта:', error);
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'Не указано';
      const date = new Date(dateString);
      return date.toLocaleString(); // Форматируем дату в удобный формат
    },
    goBack() {
      this.$router.push('/products');
    },
  },
};
</script>

<style scoped>
.product-details {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 20px;
  font-weight: 600;
}

.product-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.product-info {
  font-size: 1rem;
  color: #555;
}

.field {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee; /* Разделительная линия между полями */
}

.field:last-child {
  border-bottom: none; /* Убираем линию у последнего поля */
  margin-bottom: 0;
  padding-bottom: 0;
}

.field strong {
  color: #2c3e50;
  font-weight: 600;
  min-width: 180px; /* Фиксированная ширина для названий полей */
  text-align: left; /* Выравниваем переменные по левому краю */
}

.field .value {
  color: #333;
  flex-grow: 1;
  text-align: center; /* Выравниваем значения по центру */
}

.color-label {
  display: block; /* Делаем блок, чтобы занимал всю ширину */
  width: 100%; /* Занимает всю доступную ширину */
  padding: 6px 12px;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  text-align: center; /* Выравниваем текст по центру */
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  padding: 20px;
}

.back-button {
  display: block;
  margin: 20px auto 0;
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #3aa876;
}
</style>