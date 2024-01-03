<template>
  <div v-show="true" class="w-full pb-8 px-8 " style="overflow-y: auto; height:100%">
    <UButton class="mb-8" @click="handleAdd">增加订单</UButton>
    <UButton class="mb-8 ml-2" @click="handleCompute">汇总计算</UButton>
    <div v-for="(item, index) in purchaseList" :key="item.id"  class="p-4 shadow-lg">
      <div class="relative pb-4">
        <UButton
        @click="handleDel(index)"
          :padded="false"
          class="absolute top-o right-0"
          color="red"
          icon="i-heroicons-x-mark-20-solid"
        />
        <PurchaseItemForm ref="purchaseForm" @error="handleError(item.id)" :id="item.id" />
  
      </div>
    </div>
  </div>
  <div v-show="false"></div>
</template>
<script setup>
const productStore = useProductStore();
await productStore.fetchProduct();
const purchaseList = ref([]);

const purchaseForm = ref([])

const handleAdd = () => {
  purchaseList.value.push({ id: randomEntry() });
};

const handleDel = (index)=>{
  purchaseList.value.splice(index,1)
}

const handleCompute = async ()=>{
  const data = []
  for (const key in purchaseForm.value) {
    if (Object.hasOwnProperty.call(purchaseForm.value, key)) {
      const element = purchaseForm.value[key];

      const itemData = await element.getFormData()
      data.push(itemData)
    }
  }
  //整合数据 [...{orderCode: '123', productCode: 'p1', quantity: 1}...]
  let processDataList = []
  let _productCodeList = []
  data.map((item)=>{
    _productCodeList = _productCodeList.concat(item.productCodeList)
    processDataList=  processDataList.concat(item.orderDetailList)
  })
  let productCodeList = Array.from(new Set(_productCodeList))
  console.log(processDataList,productCodeList,'ddddddddd')
    
}

const handleError = (id)=>{
 
  const element = document.getElementById(id);
  element?.focus();
  element?.scrollIntoView({ behavior: "smooth", block: "center" });
}

</script>
