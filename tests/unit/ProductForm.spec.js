import { mount } from '@vue/test-utils';
import ProductForm from '@/components/ProductForm.vue';
import axios from 'axios';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { API_BASE_URL } from '@/apiConfig';

vi.mock('axios'); // Мокируем axios

describe('ProductForm.vue', () => {
  let wrapper;
  const mockProduct = {
    id: 1,
    name: 'Краска 1',
    amount: 10.5,
    actualAmount: 8.0,
    brand: 'TAMIYA',
    typeColor: 'ENEMAL',
    article: '12345',
    codeColor: '#ff0000',
    creationDate: '2023-10-01T12:00:00Z',
    updateDate: '2023-10-05T14:30:00Z',
  };

  beforeEach(() => {
    // Мокируем запрос к API
    axios.get.mockResolvedValue({ data: mockProduct });

    // Монтируем компонент с моком $route
    wrapper = mount(ProductForm, {
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
      props: {
        isEdit: true, // Режим редактирования
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks(); // Очищаем моки после каждого теста
  });

  it('отправка формы: обновление продукта', async () => {
    // Заполняем форму данными продукта
    wrapper.vm.product = mockProduct;

    // Мокируем успешный ответ от API
    axios.put.mockResolvedValue({});

    // Вызываем submitForm и ждём завершения
    await wrapper.vm.submitForm();

    // Проверяем, что axios.put был вызван с правильными аргументами
    expect(axios.put).toHaveBeenCalledWith(`${API_BASE_URL}/products/1`, {
      name: 'Краска 1',
      amount: 10.5,
      actualAmount: 8.0,
      brand: 'TAMIYA',
      typeColor: 'ENEMAL',
      article: '12345',
      codeColor: '#ff0000',
    });


    expect(wrapper.vm.message).toBe('Продукт успешно обновлен!');
  });

  it('загружает данные продукта при монтировании в режиме редактирования', async () => {
    await wrapper.vm.$nextTick();
    expect(axios.get).toHaveBeenCalledWith(`http://localhost:8080/products/1`);
    expect(wrapper.vm.product).toEqual(mockProduct);
  });

  it('отображает заголовок "Редактирование краски" в режиме редактирования', () => {
    expect(wrapper.find('.title').text()).toBe('Редактирование краски');
  });

  it('отображает заголовок "Создание краски" в режиме создания', async () => {
    const createWrapper = mount(ProductForm, {
      global: {
        mocks: {
          $route: {
            params: {
              id: null,
            },
          },
          $router: {
            push: vi.fn(),
          },
        },
      },
      props: {
        isEdit: false, // Режим создания
      },
    });

    expect(createWrapper.find('.title').text()).toBe('Создание краски');
  });

  it('валидация формы: проверка пустых полей', async () => {
    wrapper.vm.product = {
      name: '',
      amount: null,
      actualAmount: null,
      brand: '',
      typeColor: '',
      article: '',
      codeColor: '',
    };

    const isValid = wrapper.vm.validateForm();
    expect(isValid).toBe(false);
    expect(wrapper.vm.errors.name).toBe(true);
    expect(wrapper.vm.errors.amount).toBe(true);
    expect(wrapper.vm.errors.actualAmount).toBe(true);
    expect(wrapper.vm.errors.brand).toBe(true);
    expect(wrapper.vm.errors.typeColor).toBe(true);
    expect(wrapper.vm.errors.article).toBe(true);
    expect(wrapper.vm.errors.codeColor).toBe(true);
  });

  it('валидация формы: проверка формата кода цвета', async () => {
    wrapper.vm.product.codeColor = 'invalid-color';
    const isValid = wrapper.vm.validateForm();
    expect(isValid).toBe(false);
    expect(wrapper.vm.errors.codeColor).toBe('Код цвета должен быть в формате HEX (например, #FF0000).');
  });

  it('валидация формы: проверка отрицательных значений', async () => {
    wrapper.vm.product.amount = -1;
    wrapper.vm.product.actualAmount = -1;
    const isValid = wrapper.vm.validateForm();
    expect(isValid).toBe(false);
    expect(wrapper.vm.errors.amount).toBe('Количество не может быть отрицательным.');
    expect(wrapper.vm.errors.actualAmount).toBe('Фактическое количество не может быть отрицательным.');
  });

  it('валидация формы: фактическое количество не может быть больше количества', async () => {
    wrapper.vm.product.amount = 10;
    wrapper.vm.product.actualAmount = 15;
    const isValid = wrapper.vm.validateForm();
    expect(isValid).toBe(false);
    expect(wrapper.vm.errors.actualAmount).toBe('Фактическое количество не может быть больше количества.');
  });

  it('отправка формы: создание продукта', async () => {
    const createWrapper = mount(ProductForm, {
      global: {
        mocks: {
          $route: {
            params: {
              id: null,
            },
          },
          $router: {
            push: vi.fn(),
          },
        },
      },
      props: {
        isEdit: false,
      },
    });

    createWrapper.vm.product = {
      name: 'Новая краска',
      amount: 10,
      actualAmount: 8,
      brand: 'TAMIYA',
      typeColor: 'ENEMAL',
      article: '67890',
      codeColor: '#00ff00',
    };

    axios.post.mockResolvedValue({});
    await createWrapper.vm.submitForm();
    expect(axios.post).toHaveBeenCalledWith(`${API_BASE_URL}/products`, createWrapper.vm.product);
    expect(createWrapper.vm.message).toBe('Продукт успешно создан!');
  });

  it('переходит на страницу продуктов при нажатии на кнопку "Отмена"', async () => {
    await wrapper.find('.cancel-button').trigger('click');
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/products');
  });
});