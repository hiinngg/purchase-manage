export const useBomStore = defineStore("bomStore", {
  state: () => ({
    bomList: {},
    materialList:{}
  }),
  actions: {
    async fetchBomByProductId(productCode, force = false) {
      if (!this.bomList[productCode]) {
        const productList = await $fetch("/api/bom/getBomByProductCode", {
          query: { productCode },
        });
        productList.map((item)=>{
            if(!this.materialList[item.material_code]){
                this.materialList[item.material_code] = item.material
            }
        })
     
        this.bomList[productCode] = productList;
      }

      return this.bomList[productCode];
    },
  },
});
