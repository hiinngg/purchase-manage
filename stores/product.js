export const useProductStore = defineStore("productStore", {
  state: () => ({
    productList: null,
    hasFetch : false
  }),
  actions: {
    async fetchProduct(force=false) {
      if (this.hasFetch) {
        return this.productList;
      } else {
        const productList = await $fetch("/api/product/all");
        this.hasFetch = true
        this.productList = productList.products || [];
        return this.productList 
      }
    },
  },
});
