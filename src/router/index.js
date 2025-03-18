import { createRouter, createWebHistory } from "vue-router"; // Импортируем функции из vue-router
import ProductList from "@/components/ProductList.vue";
import ProductForm from "@/components/ProductForm.vue";
import ProductDetails from "@/components/ProductDetails.vue";


const routes = [
  {
    path: "/", // Корневой путь
    redirect: "/products" // Перенаправляем на /products
  },
  {
    path: "/products",
    name: "ProductList",
    component: ProductList
  },
  {
    path: "/products/create",
    name: "ProductCreate",
    component: ProductForm
  },
  {
    path: "/products/:id/edit",
    name: "ProductEdit",
    component: ProductForm,
    props: { isEdit: true }
  },
  {
    path: "/products/:id",
    name: "ProductDetails",
    component: ProductDetails
  }
];

const router = createRouter({
  history: createWebHistory(), // Используем HTML5 History API
  routes
});

export default router;

