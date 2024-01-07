<template>
  <div v-if="editModeLoading" class="space-y-2">
    <USkeleton class="h-4 w-4/5" />
    <USkeleton class="h-4 w-3/5" />
    <USkeleton class="h-4 w-2/5" />
  </div>
  <div
    v-else
    v-show="!whetherResult"
    class="w-full pb-8 px-8"
    style="overflow-y: auto; height: 100%"
  >
    <UButton v-if="!route.query.purchase_code" class="mb-8" @click="handleAdd">增加订单</UButton>
    <UButton
      class="mb-8 ml-2"
      @click="handleCompute(false)"
      :loading="computeLoading"
      >汇总计算</UButton
    >
    <UButton
      class="mb-8 ml-4"
      :loading="computeLoading"
      @click="handleCompute(true)"
      >保存</UButton
    >
    <div
      v-for="(item, index) in purchaseList"
      :key="item.id"
      class="p-4 shadow-lg"
    >
      <div class="relative pb-4">
        <UButton
          v-if="!item.purchase_id"
          @click="handleDel(index)"
          :padded="false"
          class="absolute top-o right-0"
          color="red"
          icon="i-heroicons-x-mark-20-solid"
        />
        <PurchaseItemForm
          :originalData="item"
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

    <UForm
      :state="materialData"
      class="space-y-2"
      ref="form"
      :validate="validate"
    >
      <UTable :columns="columns" :rows="materialData">
        <template #orderCodes-data="{ row }">
          <span>{{ getOrderCodes(row.orderCodes) }}</span>
        </template>
        <!-- <template #total_quantity-data="{ row }">
            <UFormGroup class="w-2/6" :name="'quantity-' + row.id">
              <UInput v-model="row.total_quantity" type="number"> </UInput>
            </UFormGroup>
          </template>
          <template #price-data="{ row }">
            <UFormGroup class="w-2/6" :name="'price-' + row.id">
              <UInput v-model="row.price" type="number">
                <template #leading> ￥ </template>
              </UInput>
            </UFormGroup>
          </template> -->
      </UTable>
    </UForm>
  </div>
</template>
<script setup>
const toast = useToast();
const productStore = useProductStore();

const editModeLoading = ref(false);

onMounted(async () => {
  await productStore.fetchProduct();
});

const purchaseList = ref([]);
const computeLoading = ref(false);
const purchaseForm = ref([]);
const router = useRouter()
const route = useRoute();
if (route.query.purchase_code) {
  //进入编辑模式
  editModeLoading.value = true;
  const data = await $fetch("/api/purchase/detail", {
    query: { purchase_code: route.query.purchase_code },
  });
  editModeLoading.value = false;
  data.map((item) => {
    purchaseList.value.push({
      id: randomEntry(),
      purchase_id: item.purchase_id,
      ...item,
    });
  });
}

const whetherResult = ref(false);

const form = ref(null);
const materialData = ref([]);

const bomStore = useBomStore();

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
    key: "material_stock",
    label: "库存",
  },
  {
    key: "orderCodes",
    label: "来自订单",
  },

  {
    key: "price_per_material",
    label: "单价",
  },
  {
    key: "total_quantity",
    label: "总数量",
  },
  {
    key: "total_price",
    label: "总价",
  },
];

const handleAdd = () => {
  purchaseList.value.push({ id: randomEntry() });
};

const handleDel = (index) => {
  purchaseList.value.splice(index, 1);
};

const handleCompute = async (whetherSave = false) => {
  if (purchaseForm.value.length == 0) {
    toast.add({
      title: "请先添加订单",
      color: "rose",
      icon: "i-ep-circle-close",
    });
    return;
  }

  try {
    const _data = [];
    computeLoading.value = true;
    for (const key in purchaseForm.value) {
      if (Object.hasOwnProperty.call(purchaseForm.value, key)) {
        const element = purchaseForm.value[key];

        const itemData = await element.getFormData();
        _data.push(itemData);
      }
    }

    materialData.value = processOrderList(_data);
    console.log(
      materialData.value,
      whetherSave,
      _data,
      "compute data=========>"
    );
    if (!whetherSave) {
      toast.add({ title: "操作成功" });
      whetherResult.value = true;
      computeLoading.value = false;
    } else {
      let url = "/api/purchase/add";
      if (!route.query.purchase_code) {
        // //保存价格
        // const { data: data1, error: error1 } = await useFetch(
        //   "/api/price/add",
        //   {
        //     method: "post",
        //     body: {
        //       data: materialData.value.map((v) => ({
        //         ...v,
        //         orderCodes: Array.from(v.orderCodes).join("，"),
        //       })),
        //     },
        //     watch: false,
        //   }
        // );
      } else {
        url = "/api/purchase/edit";
      }

      //保存采购订单
      const { data, error, status } = await useFetch(url, {
        method: "post",
        body: { data: _data },
        watch: false,
      });
      if (data.value.statusCode == "201") {
        toast.add({ title: "操作成功" });
        router.go(-1)
      } else {
        const errprMsg = error?.value?.data || { message: "未知错误" };
        toast.add({
          title: errprMsg.message,
          color: "rose",
          icon: "i-ep-circle-close",
        });
        // if (error.value.data.data.errorCode == 1001) {
        //   form.value.setErrors(
        //     [{ message: error.value.data.message, path: "productCode" }],
        //     "materialCode"
        //   );
        // }
      }
      computeLoading.value = false;
    }
    // bomStore.materialList = []
    return true;
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
    computeLoading.value = false;
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
                stock: materialItem.stock,
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
  // return Array.from(new Set(arr.map((item) => item.orderCode))).join("，");
  return Array.from(arr).join("，");
};

const processOrderList = (originalData) => {
  const materialData = [];
  for (const k in originalData) {
    if (Object.hasOwnProperty.call(originalData, k)) {
      const element = originalData[k];
      for (const j in element.orderDetailList) {
        if (Object.hasOwnProperty.call(element.orderDetailList, j)) {
          const productItem = element.orderDetailList[j];

          for (const q in productItem.materialData) {
            if (Object.hasOwnProperty.call(productItem.materialData, q)) {
              const materialItem = productItem.materialData[q];

              const index = materialData.findIndex(
                (v) => v.material_code == materialItem.material_code
              );

              if (index < 0) {
                const newItem = {
                  material_code: materialItem.material_code,
                  material_name: materialItem.material_name,
                  material_stock: materialItem.material_stock,
                  total_price: materialItem.total_price,
                  total_quantity: materialItem.total_quantity,
                  price_per_material: materialItem.price_per_material,
                  orderCodes: new Set(),
                };
                newItem["orderCodes"].add(element.orderCode);
                materialData.push(newItem);
              } else {
                materialData[index]["total_price"] =
                  materialData[index]["total_price"] + materialItem.total_price;

                materialData[index]["total_quantity"] =
                  materialData[index]["total_quantity"] +
                  materialItem.total_quantity;

                materialData[index]["orderCodes"].add(element.orderCode);
              }
            }
          }
        }
      }
    }
  }
  return materialData;
};

const validate = async (state) => {
  const errors = [];

  for (const key in state) {
    if (Object.hasOwnProperty.call(state, key)) {
      const element = state[key];
      if (!element.total_quantity) {
        errors.push({
          path: "quantity-" + element.id,
          message: "请输入数量",
        });
      }
      if (!element.price) {
        errors.push({
          path: "price-" + element.id,
          message: "请输入单价",
        });
      }
    }
  }
  console.log(errors, state, "errorssssssss");
  return errors;
};
const handleMaterialSave = () => {
  form.value.validate();
};
</script>
