<template>
  <div
    v-show="!whetherResult"
    class="w-full pb-8 px-8"
    style="overflow-y: auto; height: 100%"
  >
    <UButton class="mb-8" @click="handleAdd">增加订单</UButton>
    <UButton class="mb-8 ml-2" @click="handleCompute" :loading="computeLoading"
      >汇总计算</UButton
    >
    <div
      v-for="(item, index) in purchaseList"
      :key="item.id"
      class="p-4 shadow-lg"
    >
      <div class="relative pb-4">
        <UButton
          @click="handleDel(index)"
          :padded="false"
          class="absolute top-o right-0"
          color="red"
          icon="i-heroicons-x-mark-20-solid"
        />
        <PurchaseItemForm
          ref="purchaseForm"
          @error="handleError(item.id)"
          :id="item.id"
        />
      </div>
    </div>
  </div>
  <div
    v-show="whetherResult"
    class="w-full pb-8 px-8"
    style="overflow-y: auto; height: 100%"
  >
    <UButton class="mb-8" @click="handleBack">返回订单列表</UButton>
    <UButton class="mb-8 ml-4" @click="handleMaterialSave">保存</UButton>
    <UForm
    :state="materialData"
    class="space-y-2"
    ref="form"
    :validate="validate"
  >
    <UTable :columns="columns" :rows="materialData">
      <template #order_codes-data="{ row }">
        <span>{{ getOrderCodes(row.origin_data) }}</span>
      </template>
      <template #total_quantity-data="{ row }">
        <UFormGroup class="w-2/6" :name="'quantity-'+row.id">
          <UInput v-model="row.total_quantity" type="number">
          </UInput>
        </UFormGroup>
      </template>
      <template #price-data="{ row }">
        <UFormGroup class="w-2/6" :name="'price-'+row.id">
          <UInput v-model="row.price" type="number">
            <template #leading> ￥ </template>
          </UInput>
        </UFormGroup>
      </template>
    </UTable>
    </UForm>
  </div>
</template>
<script setup>
const toast = useToast();
const productStore = useProductStore();
await productStore.fetchProduct();
const purchaseList = ref([]);
const computeLoading = ref(false);
const purchaseForm = ref([]);
const whetherResult = ref(false);
const form = ref(null)
const materialData = ref([]);

const columns = [
  {
    key: "material_code",
    label: "物料编码",
  },
  {
    key: "material_name",
    label: "物料名称",
  },
  {
    key: "stock",
    label: "库存",
  },
  {
    key: "order_codes",
    label: "来自订单",
  },
  {
    key: "total_quantity",
    label: "总数量",
  },
  {
    key: "price",
    label: "单价",
  },
];

const handleAdd = () => {
  purchaseList.value.push({ id: randomEntry() });
};

const handleDel = (index) => {
  purchaseList.value.splice(index, 1);
};

const handleCompute = async () => {
  try {
    const _data = [];

    for (const key in purchaseForm.value) {
      if (Object.hasOwnProperty.call(purchaseForm.value, key)) {
        const element = purchaseForm.value[key];

        const itemData = await element.getFormData();
        _data.push(itemData);
      }
    }
    //整合数据 [...{orderCode: '123', productCode: 'p1', quantity: 1}...]
    let processDataList = [];
    let _productCodeList = [];
    _data.map((item) => {
      _productCodeList = _productCodeList.concat(item.productCodeList);
      processDataList = processDataList.concat(item.orderDetailList);
    });
    let productCodeList = Array.from(new Set(_productCodeList));
    computeLoading.value = true;

    const { data, error, status } = await useFetch("/api/purchase/compute", {
      method: "post",
      body: { productCodeList },
      watch: false,
    });
    if (status.value == "success") {
      toast.add({ title: "操作成功" });
      whetherResult.value = true;
      computeLoading.value = false;
      materialData.value = processData(data.value.data, processDataList);
      // emits('operSuccess')
    } else {
      // toast.add({title:error.value.data.message,color:'rose','icon':'i-ep-circle-close'})
      // if(error.value.data.data.errorCode==1001){
      //   form.value.setErrors([{message:error.value.data.message,path:'productCode'}],'materialCode')
      // }
    }
  } catch (error) {
    console.log(error, "errorr");
    // if (error.statusCode==400){
    //   form.value.setErrors({path:'materialCode',message:data.value.message})
    // }
  }
};

const handleError = (id) => {
  const element = document.getElementById(id);
  element?.focus();
  element?.scrollIntoView({ behavior: "smooth", block: "center" });
};

const handleBack = () => {
  whetherResult.value = false;
};

const processData = (data, orderList) => {
  const _materialData = [];
  for (const key in orderList) {
    if (Object.hasOwnProperty.call(orderList, key)) {
      const orderItem = orderList[key];

      for (const k in data) {
        if (Object.hasOwnProperty.call(data, k)) {
          const materialItem = data[k];
          if (materialItem.product_code == orderItem.productCode) {
            //需要累计数量
            let mDataItemIndex = _materialData.findIndex(
              (v) => v.material_code == materialItem.material_code
            );
            const sumQuantity = materialItem.quantity * orderItem.quantity;
            if (mDataItemIndex == -1) {
              _materialData.push({
                id: randomEntry(),
                material_code: materialItem.material_code,
                material_name: materialItem.material_name,
                stock:materialItem.stock,
                total_quantity: sumQuantity,
                origin_data: [orderItem],
                price: 0,
              });
            } else {
              _materialData[mDataItemIndex]["total_quantity"] =
                _materialData[mDataItemIndex]["total_quantity"] + sumQuantity;
              _materialData[mDataItemIndex]["origin_data"].push(orderItem);
            }
          }
        }
      }
    }
  }
  console.log(_materialData, "processsssDATA");
  return _materialData;
};

const getOrderCodes = (arr) => {
  return Array.from(new Set(arr.map((item) => item.orderCode))).join("，");
};


const validate = async (state) => {
  const errors = [];

   for (const key in state) {
    if (Object.hasOwnProperty.call(state, key)) {
      const element = state[key];
      if(!element.total_quantity){
        errors.push({
          path: "quantity-"+element.id,
          message: "请输入数量",
        });
      }
      if(!element.price){
        errors.push({
          path: "price-"+element.id,
          message: "请输入单价",
        });
      }
    }
   }
   console.log(errors,state,'errorssssssss')
  return errors;
};
const handleMaterialSave = ()=>{
  form.value.validate() 
}
</script>
