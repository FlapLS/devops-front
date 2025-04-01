<template>
  <div class="product-list">
    <h2 class="title">Список красок</h2>
    <button class="create-button" @click="goToCreate">
      <span>➕</span> Создать новую краску
    </button>
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else>
      <div v-if="products.length === 0" class="empty-list">
        Нет красок для отображения.
      </div>
      <table v-else class="product-table">
        <thead>
        <tr>
          <th>Бренд</th>
          <th>Название</th>
          <th>Количество</th>
          <th>Фактическое количество</th>
          <th>Цвет</th>
          <th>Действия</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.brand }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.amount }}</td>
          <td>{{ product.actualAmount }}</td>
          <td>
            <div
              class="color-box"
              :style="{ backgroundColor: product.codeColor || '#ccc' }"
            ></div>
          </td>
          <td class="actions">
            <button class="action-button view-button" @click="viewProduct(product.id)">
              👁️ Просмотр
            </button>
            <button class="action-button edit-button" @click="editProduct(product.id)">
              ✏️ Редактировать
            </button>
            <button class="action-button delete-button" @click="deleteProduct(product.id)">
              🗑️ Удалить
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from "@/apiConfig";

export default {
  data() {
    return {
      products: [],
      loading: true,
    };
  },
  async created() {
    await this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get(`${API_BASE_URL}/products`);
        this.products = response.data;
      } catch (error) {
        console.error('Ошибка при загрузке продуктов:', error);
      } finally {
        this.loading = false;
      }
    },
    goToCreate() {
      this.$router.push('/products/create');
    },
    viewProduct(id) {
      this.$router.push(`/products/${id}`);
    },
    editProduct(id) {
      this.$router.push(`/products/${id}/edit`);
    },
    async deleteProduct(id) {
      try {
        await axios.delete(`${API_BASE_URL}/products/${id}`);
        this.fetchProducts();
      } catch (error) {
        console.error('Ошибка при удалении продукта:', error);
      }
    },
  },
};
</script>

<style scoped>
.product-list {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  text-align: center;
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 20px;
}

.create-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
}

.create-button span {
  margin-right: 10px;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
}

.empty-list {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.product-table th,
.product-table td {
  padding: 12px;
  text-align: center;
  vertical-align: middle;
  border-bottom: 1px solid #e0e0e0;
}

.product-table th {
  background-color: #42b983;
  color: white;
}

.product-table tr:hover {
  background-color: #f9f9f9;
}

.color-box {
  width: 30px;
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 0 auto;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.view-button {
  background-color: #4caf50;
  color: white;
}

.edit-button {
  background-color: #2196f3;
  color: white;
}

.delete-button {
  background-color: #f44336;
  color: white;
}

.action-button:hover {
  opacity: 0.9;
}
</style>