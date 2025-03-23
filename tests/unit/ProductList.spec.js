import { mount } from '@vue/test-utils';
import ProductList from '@/components/ProductList.vue';
import axios from 'axios';
import { API_BASE_URL } from '@/apiConfig';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'; // Импорт глобальных функций

vi.mock('axios'); // Мокируем axios

describe('ProductList.vue', () => {
  let wrapper;

  const mockProducts = [
    {
      id: 1,
      brand: 'Brand A',
      name: 'Paint 1',
      amount: 10,
      actualAmount: 8,
      codeColor: '#ff0000',
    },
    {
      id: 2,
      brand: 'Brand B',
      name: 'Paint 2',
      amount: 15,
      actualAmount: 15,
      codeColor: '#00ff00',
    },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockProducts });
    wrapper = mount(ProductList, {
      global: {
        mocks: {
          $router: {
            push: vi.fn(),
          },
        },
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('отображает заголовок "Список красок"', () => {
    expect(wrapper.find('.title').text()).toBe('Список красок');
  });

  it('отображает заголовок "Список красок"', () => {
    expect(wrapper.find('.title').text()).toBe('Список красок');
  });

  it('отображает кнопку "Создать новую краску"', () => {
    expect(wrapper.find('.create-button').text()).toContain('Создать новую краску');
  });

  it('переходит на страницу создания продукта при нажатии на кнопку "Создать новую краску"', async () => {
    await wrapper.find('.create-button').trigger('click');
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/products/create');
  });

  it('отображает заголовок "Список красок"', async () => {
    expect(wrapper.vm.loading).toBe(false); // Проверяем, что загрузка завершена
    expect(wrapper.vm.products.length).toBeGreaterThan(0); // Проверяем, что данные загружены
    expect(wrapper.find('.title').text()).toBe('Список красок');
  });

  it('отображает таблицу с продуктами, если продукты загружены', async () => {
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.product-table').exists()).toBe(true);
    expect(wrapper.findAll('tbody tr').length).toBe(mockProducts.length);
  });

  it('отображает корректные данные о продуктах в таблице', async () => {
    await wrapper.vm.$nextTick();
    const rows = wrapper.findAll('tbody tr');
    expect(rows[0].text()).toContain('Brand A');
    expect(rows[0].text()).toContain('Paint 1');
    expect(rows[0].text()).toContain('10');
    expect(rows[0].text()).toContain('8');
    expect(rows[0].find('.color-box').element.style.backgroundColor).toBe('rgb(255, 0, 0)');
  });

  it('переходит на страницу просмотра продукта при нажатии на кнопку "Просмотр"', async () => {
    await wrapper.vm.$nextTick();
    await wrapper.find('.view-button').trigger('click');
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/products/1');
  });

  it('переходит на страницу редактирования продукта при нажатии на кнопку "Редактировать"', async () => {
    await wrapper.vm.$nextTick();
    await wrapper.find('.edit-button').trigger('click');
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/products/1/edit');
  });

  it('удаляет продукт при нажатии на кнопку "Удалить"', async () => {
    axios.delete.mockResolvedValue({});
    await wrapper.vm.$nextTick();
    await wrapper.find('.delete-button').trigger('click');
    await wrapper.vm.$nextTick();
    expect(axios.delete).toHaveBeenCalledWith(`${API_BASE_URL}/products/1`);
    expect(axios.get).toHaveBeenCalledTimes(2); // Первый вызов в created, второй после удаления
  });

});