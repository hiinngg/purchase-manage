<template>
  <div v-show="!whetherResult" class="w-full pb-8 px-8 " style="overflow-y: auto; height:100%">
    <UButton class="mb-8" @click="handleAdd">增加订单</UButton>
    <UButton class="mb-8 ml-2" @click="handleCompute" :loading="computeLoading">汇总计算</UButton>
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
  <div v-show="whetherResult" class="w-full pb-8 px-8 " style="overflow-y: auto; height:100%">
    <UButton class="mb-8" @click="handleBack">返回订单列表</UButton>
    <template v-for="(item) in 10" :key="item">
      <div class=" space-y-2">
      <div>物料编号：1231</div>
      <div>物料名称：123</div>
      <div>物料总数：12312</div>
      <div>来自产品：123123</div>
    </div>
      <hr class="mt-2">
    </template>
 

  </div>
</template>
<script setup>
  const toast = useToast()
const productStore = useProductStore();
await productStore.fetchProduct();
const purchaseList = ref([]);
const computeLoading = ref(false)
const purchaseForm = ref([])
const whetherResult = ref(false)




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
  computeLoading.value= true
  try {
    const {data,error,status} = await useFetch('/api/purchase/compute',{
      method:'post',
      body:{productCodeList},
      watch:false,
    })
    if(status.value=='success'){
      toast.add({title:'操作成功'})
      whetherResult.value = true
      computeLoading.value= false
      console.log(data.data,'11111111111111111111111')
      // emits('operSuccess')
    
    }else{
      // toast.add({title:error.value.data.message,color:'rose','icon':'i-ep-circle-close'}) 
      // if(error.value.data.data.errorCode==1001){
      //   form.value.setErrors([{message:error.value.data.message,path:'productCode'}],'materialCode')
      // }
    }
   } catch (error) {
    console.log(error,'errorr')
    // if (error.statusCode==400){
    //   form.value.setErrors({path:'materialCode',message:data.value.message})
    // }
   }
  
    
}

const handleError = (id)=>{
 
  const element = document.getElementById(id);
  element?.focus();
  element?.scrollIntoView({ behavior: "smooth", block: "center" });
}

const handleBack = ()=>{
  whetherResult.value = false
}

</script>
