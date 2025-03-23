import { mount } from '@vue/test-utils';
import ProductDetails from '@/components/ProductDetails.vue';
import axios from 'axios';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { API_BASE_URL } from '@/apiConfig';

vi.mock('axios'); // Мокируем axios

describe('ProductDetails.vue', () => {
  let wrapper;
  const mockProduct = {
    id: 1,
    name: 'Краска 1',
    amount: 10,
    actualAmount: 8,
    brand: 'Brand A',
    typeColor: 'Матовая',
    article: '12345',
    codeColor: '#ff0000',
    creationDate: '2023-10-01T12:00:00Z',
    updateDate: '2023-10-05T14:30:00Z',
  };

  beforeEach(async () => {
    // Мокируем запрос к API
    axios.get.mockResolvedValue({ data: mockProduct });

    // Монтируем компонент с моком $route
    wrapper = mount(ProductDetails, {
      global: {
        mocks: {
          $route: {
            params: {
              id: 1,
            },
          },
          $router: {
            push: vi.fn(),
          },
        },
      },
    });

    // Ждём завершения асинхронных операций
    await wrapper.vm.$nextTick();
  });

  afterEach(() => {
    vi.clearAllMocks(); // Очищаем моки после каждого теста
  });

  it('загружает данные продукта при монтировании', async () => {
    expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/products/1`);
    expect(wrapper.vm.product).toEqual(mockProduct);
  });

  it('отображает заголовок "Детали продукта"', () => {
    expect(wrapper.find('.title').text()).toBe('Детали продукта');
  });

  it('отображает данные продукта', () => {
    expect(wrapper.find('.product-info').exists()).toBe(true);
    expect(wrapper.find('.field:nth-child(1) .value').text()).toBe(mockProduct.name);
    expect(wrapper.find('.field:nth-child(2) .value').text()).toBe(mockProduct.amount.toString());
    expect(wrapper.find('.field:nth-child(3) .value').text()).toBe(mockProduct.actualAmount.toString());
    expect(wrapper.find('.field:nth-child(4) .value').text()).toBe(mockProduct.brand);
    expect(wrapper.find('.field:nth-child(5) .value').text()).toBe(mockProduct.typeColor);
    expect(wrapper.find('.field:nth-child(6) .value').text()).toBe(mockProduct.article);
    expect(wrapper.find('.field:nth-child(7) .color-label').text()).toBe(mockProduct.codeColor);
  });

  it('форматирует дату корректно', () => {
    const creationDateFormatted = wrapper.vm.formatDate(mockProduct.creationDate);
    const updateDateFormatted = wrapper.vm.formatDate(mockProduct.updateDate);
    expect(creationDateFormatted).toBe(new Date(mockProduct.creationDate).toLocaleString());
    expect(updateDateFormatted).toBe(new Date(mockProduct.updateDate).toLocaleString());
  });

  it('отображает "Не указано", если дата отсутствует', () => {
    const nullDateFormatted = wrapper.vm.formatDate(null);
    expect(nullDateFormatted).toBe('Не указано');
  });

  it('переходит на страницу продуктов при нажатии на кнопку "Назад"', async () => {
    await wrapper.find('.back-button').trigger('click');
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/products');
  });

  it('отображает сообщение о загрузке, если данные не загружены', async () => {
    // Монтируем компонент без данных
    const emptyWrapper = mount(ProductDetails, {
      global: {
        mocks: {
          $route: {
            params: {
              id: 1,
            },
          },
          $router: {
            push: vi.fn(),
          },
        },
      },
    });

    expect(emptyWrapper.find('.loading').exists()).toBe(true);
    expect(emptyWrapper.find('.loading').text()).toBe('Загрузка...');
  });
});