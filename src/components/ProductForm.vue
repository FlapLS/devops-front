<template>
  <div class="product-form">
    <h2 class="title">{{ isEdit ? 'Редактирование краски' : 'Создание краски' }}</h2>
    <form @submit.prevent="submitForm">
      <!-- Название -->
      <div class="form-group">
        <label for="name">Название:</label>
        <input type="text" id="name" v-model="product.name" />
        <p v-if="errors.name" class="error">"Название" не может быть пустым или null.</p>
      </div>

      <div class="form-group">
        <label for="amount">Количество:</label>
        <input type="number" id="amount" v-model="product.amount" step="0.01" />
        <p v-if="errors.amount" class="error">
          {{ typeof errors.amount === 'string' ? errors.amount : '"Количество" не может быть пустым или null.' }}
        </p>
      </div>

      <div class="form-group">
        <label for="actualAmount">Фактическое количество:</label>
        <input type="number" id="actualAmount" v-model="product.actualAmount" step="0.01" />
        <p v-if="errors.actualAmount" class="error">
          {{ typeof errors.actualAmount === 'string' ? errors.actualAmount : '"Фактическое количество" не может быть пустым или null.' }}
        </p>
      </div>

      <!-- Бренд -->
      <div class="form-group">
        <label for="brand">Бренд:</label>
        <select id="brand" v-model="product.brand">
          <option v-for="brand in brands" :key="brand" :value="brand">
            {{ brand }}
          </option>
        </select>
        <p v-if="errors.brand" class="error">"Бренд" не может быть пустым или null.</p>
      </div>

      <!-- Тип цвета -->
      <div class="form-group">
        <label for="typeColor">Тип цвета:</label>
        <select id="typeColor" v-model="product.typeColor">
          <option v-for="type in types" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
        <p v-if="errors.typeColor" class="error">"Тип цвета" не может быть пустым или null.</p>
      </div>

      <!-- Артикул -->
      <div class="form-group">
        <label for="article">Артикул:</label>
        <input type="text" id="article" v-model="product.article" />
        <p v-if="errors.article" class="error">"Артикул" не может быть пустым или null.</p>
      </div>

      <!-- Код цвета -->
      <div class="form-group">
        <label for="codeColor">Код цвета:</label>
        <div class="color-input-container">
          <input type="text" id="codeColor" v-model="product.codeColor" />
          <input
            type="color"
            v-model="product.codeColor"
            class="color-picker"
            @input="updateColor"
          />
        </div>
        <p v-if="errors.codeColor" class="error">"Код цвета" не может быть пустым или null.</p>
      </div>

      <!-- Сообщения об ошибках -->
      <div v-if="errors.general" class="error-message">
        {{ errors.general }}
      </div>

      <!-- Кнопки -->
      <div class="form-actions">
        <button type="submit" class="submit-button">
          {{ isEdit ? 'Обновить' : 'Создать' }}
        </button>
        <button type="button" class="cancel-button" @click="goBack">
          Отмена
        </button>
      </div>
    </form>
    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from "@/apiConfig";

export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      product: {
        name: '',
        amount: 0.0,
        actualAmount: 0.0,
        brand: '',
        typeColor: '',
        article: '',
        codeColor: '#000000', // Начальное значение для цветового пикера
      },
      brands: ['TAMIYA', 'MR_HOBBY', 'AMMO_MIG', 'AK_INTERACTIVE', 'ABTEILING_502'],
      types: ['ENEMAL', 'ACRYLIC', 'OIL'],
      errors: {}, // Объект для хранения ошибок
      message: '', // Сообщение об успешном выполнении
    };
  },
  async created() {
    if (this.isEdit && this.$route.params.id) {
      await this.fetchProduct(this.$route.params.id);
    }
  },
  methods: {
    async fetchProduct(id) {
      try {
        const response = await axios.get(`http://localhost:8080/products/${id}`);
        this.product = response.data;
      } catch (error) {
        this.message = 'Ошибка при загрузке продукта: ' + error.message;
        console.error('Ошибка:', error);
      }
    },
    updateColor(event) {
      // Обновляем значение codeColor при изменении цвета через пикер
      this.product.codeColor = event.target.value;
    },
    validateForm() {
      this.errors = {}; // Очищаем предыдущие ошибки

      // Проверка на пустые поля и null
      if (!this.product.name || this.product.name === null) this.errors.name = true;
      if (this.product.amount === null || this.product.amount === '') this.errors.amount = true;
      if (this.product.actualAmount === null || this.product.actualAmount === '') this.errors.actualAmount = true;
      if (!this.product.brand || this.product.brand === null) this.errors.brand = true;
      if (!this.product.typeColor || this.product.typeColor === null) this.errors.typeColor = true;
      if (!this.product.article || this.product.article === null) this.errors.article = true;
      if (!this.product.codeColor || this.product.codeColor === null) this.errors.codeColor = true;

      // Проверка на корректность кода цвета (HEX)
      const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (this.product.codeColor && !hexColorRegex.test(this.product.codeColor)) {
        this.errors.codeColor = 'Код цвета должен быть в формате HEX (например, #FF0000).';
      }

      // Проверка, что количество и фактическое количество не отрицательные
      if (this.product.amount < 0) {
        this.errors.amount = 'Количество не может быть отрицательным.';
      }
      if (this.product.actualAmount < 0) {
        this.errors.actualAmount = 'Фактическое количество не может быть отрицательным.';
      }

      // Проверка, что фактическое количество не больше количества
      if (this.product.actualAmount > this.product.amount) {
        this.errors.actualAmount = 'Фактическое количество не может быть больше количества.';
      }

      // Если есть ошибки, возвращаем false
      return Object.keys(this.errors).length === 0;
    },
    async submitForm() {
      if (!this.validateForm()) {
        this.errors.general = 'Пожалуйста, исправьте ошибки в форме.';
        return;
      }

      try {
        if (this.isEdit) {
          const { id, creationDate, updateDate, ...productData } = this.product;
          await axios.put(`${API_BASE_URL}/products/${id}`, productData);
          this.message = 'Продукт успешно обновлен!';
        } else {
          const { id, creationDate, updateDate, ...productData } = this.product;
          await axios.post(`${API_BASE_URL}/products`, productData);
          this.message = 'Продукт успешно создан!';
        }
        this.$router.push('/products');
      } catch (error) {
        this.message = 'Ошибка: ' + error.message;
        console.error('Ошибка:', error);
      }
    },
    goBack() {
      this.$router.push('/products');
    },
  },
};
</script>

<style scoped>
.product-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: 1rem;
  color: #555;
  margin-bottom: 8px;
  font-weight: 500;
}

input,
select {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

input:focus,
select:focus {
  border-color: #42b983;
  outline: none;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

.color-input-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-picker {
  width: 50px;
  height: 40px;
  padding: 0;
  border: none;
  cursor: pointer;
  border-radius: 6px;
}

.error {
  color: #f44336;
  font-size: 0.9rem;
  margin-top: 5px;
}

.error-message {
  color: #f44336;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 20px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 30px;
}

.submit-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  flex: 1;
  transition: background-color 0.3s ease;
}

.cancel-button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  flex: 1;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #3aa876;
}

.cancel-button:hover {
  background-color: #e53935;
}

.message {
  text-align: center;
  font-size: 1rem;
  color: #42b983;
  margin-top: 20px;
}
</style>