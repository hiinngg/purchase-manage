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
        const insertMaterialCodes = []
        productList.map(async(item)=>{
            if(!this.materialList[item.material_code]){
              //继续查询
              insertMaterialCodes.push(item.material_code)
            }
        })
        if(insertMaterialCodes.length>0){
          const _materialList = await $fetch("/api/material/batchDetail", {
            method:'post',
            body: { materialCodes:insertMaterialCodes },
          });
          _materialList.map((v)=>{
            this.materialList[v.material_code] = v
          })
        }
  

        this.bomList[productCode] = productList;
      }

      return this.bomList[productCode];
    },
  },
});
