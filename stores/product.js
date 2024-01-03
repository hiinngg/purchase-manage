export const useProductStore = defineStore("productStore", {
  state: () => ({
    productList: null,
  }),
  actions: {
    async fetchProduct(force=false) {
      if (Array.isArray(this.productList)&&(!force)) {
        return this.productList;
      } else {
        const productList = await $fetch("/api/product/all");
        this.productList = productList.products || [];
        return this.productList 
      }
    },
  },
});
