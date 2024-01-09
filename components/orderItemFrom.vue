<template>
  <UForm
    :state="state"
    class="space-y-2 relative"
    ref="form"
    :validateOn="['input', 'submit']"
    :validate="validate"
  >
    <div class="flex">
      <UFormGroup name="productCode" class="w-2/3">
        <USelectMenu
          v-model="state.productCode"
          :loading="selLoading"
          searchable
          searchable-placeholder="查询产品编码"
          class="w-full"
          placeholder="选择产品编码"
          :options="productOriginalList"
          option-attribute="product_name"
          label-attribute="product_code"
          value-attribute="product_code"
          :search-attributes="['product_code', 'product_name']"
        >
          <template #option="{ option: product }">
            <span class="truncate"
              >编码：{{ product.product_code }}——名称：{{ product.product_name }}</span
            >
          </template>
        </USelectMenu>
      </UFormGroup>

      <UFormGroup name="quantity" class="w-1/3 ml-2">
        <UInput
          autocomplete="off"
          type="number"
          v-model="state.quantity"
          @change="handleChangeQuantity"
          placeholder="数量"
          min="1"
        />
      </UFormGroup>
    </div>
    <div v-if="state.productCode && materialList.length==0" class="space-y-2">
    <USkeleton class="h-4 w-4/5" />
    <USkeleton class="h-4 w-3/5" />
    <USkeleton class="h-4 w-2/5" />
  </div>
    <UForm
     v-else
      :state="materialData"
      class="space-y-2"
      ref="subForm"
      :validate="subFormValidate"
    >
      <UTable
        :columns="columns"
        by="material_code"
        class=""
        v-model="materialData"
        v-if="materialList.length > 0"
        :rows="materialList"
      >
        <template #price_per_material-data="{ row }">
          <UFormGroup
            :name="'price-' + row.id"
            v-if="materialData.find((v) => v.id == row.id)"
          >
            <!-- <UInput
              v-model="row.price_per_material"
              type="number"
              @change="handlePriceChange($event, row.id)"
            > -->

            <USelectMenu
              class="w-[200px]"
              v-model="row.price_per_material"
              by="unit_price"
              option-attribute="unit_price"
              :options="bomStore.materialList[row.material_code]['historical_prices']"
              creatable
              showCreateOptionWhen="always"
              searchable
              clearSearchOnClose
              searchablePlaceholder="搜索历史单价..."
              @change="handlePriceChange($event, row.id)"
              :popper="{ strategy: 'fixed' }"
              :uiMenu="{ width: ' w-1/4', popper: {} }"
            >
              <template #option-create="{ option }">
                <span class="flex-shrink-0">创建新单价：</span>
                <span class="block truncate">{{ option.unit_price || option }}</span>
              </template>
            </USelectMenu>

            <!-- <template #leading> ￥ </template> -->
            <!-- </UInput> -->
          </UFormGroup>
        </template>
        <template #total_quantity-data="{ row }">
          <UFormGroup
            class="w-3/6"
            :name="'quantity-' + row.id"
            v-if="materialData.find((v) => v.id == row.id)"
          >
            <UInput
              v-model="row.total_quantity"
              type="number"
              min="1"
              @change="handleQuantityChange($event, row.id)"
            >
            </UInput>
          </UFormGroup>
        </template>
      </UTable>
    </UForm>
  </UForm>
</template>
<script setup>
const props = defineProps({
  originalData: {
    default: null,
  },
});

const state = reactive({
  productCode: null,
  quantity: 1,
});

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
    label: "物料库存",
  },
  {
    key: "quantity_per_product",
    label: "单个产品所需数量",
  },
  {
    key: "price_per_material",
    label: "物料单价",
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

const materialList = ref([]);
const materialData = ref([]);
const bomStore = useBomStore();
const form = ref(null);
const subForm = ref(null);

watch(
  () => state.productCode,
  async (productCode, preProductCode) => {
    if (productCode) {
      const _data = await bomStore.fetchBomByProductId(productCode);
      materialList.value = processMData(_data);
      if (preProductCode) {
        materialData.value = [];
      } else {
        if (
          Array.isArray(props.originalData.materialData) &&
          props.originalData.materialData.length > 0
        ) {
          props.originalData.materialData.map((item) => {
            const _MDataIndex = materialList.value.findIndex(
              (v) => v.material_code == item.material_code
            );
            if (_MDataIndex > -1) {
              // const MIndex = materialData.value.findIndex(
              //   (v2) => v2.material_code == item.material_code
              // );
              // if (MIndex == -1) {

              // }
              materialList.value[_MDataIndex]["price_per_material"] =
                item.price_per_material;
              materialList.value[_MDataIndex]["total_quantity"] = item.total_quantity;
              nextTick(() => {
                materialData.value.push(materialList.value[_MDataIndex]);
              });

              updateTotalPrice(_MDataIndex);
            }
          });
        }
      }
    }
  }
);

if (props.originalData.orderCode) {
  state.productCode = props.originalData.productCode;
  state.quantity = props.originalData.quantity;
  //  await nextTick()
  //  materialData.value = props.originalData.materialData
  //   console.log(materialData.value,'213123123')
}

const processMData = (data) => {
  const res = data.map((item) => {
    const resItem = {
      id: randomEntry(),
      material_code: item.material_code,
      material_name:
        bomStore.materialList[item.material_code]["material_details"].material_name,
      material_stock: bomStore.materialList[item.material_code]["inventory_quantity"],
      quantity_per_product: item.quantity,
      total_quantity: state.quantity ? item.quantity * state.quantity : 0,
      price_per_material:
        bomStore.materialList[item.material_code]["historical_prices"]?.[0]?.[
          "unit_price"
        ],
      historical_prices: bomStore.materialList[item.material_code]["historical_prices"],
    };
    resItem["total_price"] = resItem.total_quantity * resItem.price_per_material;

    return resItem;
  });
  return res;
};

const selLoading = ref(true);

const productOriginalList = ref([]);
onMounted(async () => {
  const productStore = useProductStore();
  productStore.fetchProduct().then((res) => {
    productOriginalList.value = res;
  });

  selLoading.value = false;
});

const validate = async (state) => {
  const errors = [];

  if (!state.productCode) {
    errors.push({ path: "productCode", message: "请选择产品" });
  }
  if (state.quantity <= 0) {
    errors.push({ path: "quantity", message: "请输入正确数量" });
  }
  if (materialData.value.length == 0) {
    errors.push({
      path: "productCode",
      message: "请选择物料",
    });
  }

  return errors;
};

const geSubFormData = async () => {
  await form.value.validate();
  await subForm.value.validate();
  return { ...state, materialData: materialData.value };
};

const subFormValidate = async (state) => {
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
      if (!element.price_per_material) {
        errors.push({
          path: "price-" + element.id,
          message: "请输入单价",
        });
      }
    }
  }
  return errors;
};

const handleQuantityChange = (event, id) => {
  const Mindex = materialList.value.findIndex((v) => v.id == id);
  if (Mindex > -1) {
    nextTick(() => {
      updateTotalPrice(Mindex);
    });
  }
};
const handlePriceChange = (event, id) => {
  const price = typeof event == 'string'? event:event.unit_price
  const Mindex = materialList.value.findIndex((v) => v.id == id);
  if (Mindex > -1) {
    bomStore.materialList[materialList.value[Mindex].material_code]['price_per_material'] = price
    nextTick(() => {
      const arr =
        bomStore.materialList[materialList.value[Mindex].material_code][
          "historical_prices"
        ];
      if (!arr.find((v) => v.unit_price == price)) {
        bomStore.materialList[materialList.value[Mindex].material_code][
          "historical_prices"
        ].unshift({
          unit_price: price,
        });

    



      }

      updateTotalPrice(Mindex);
    });
  }
};

const handleChangeQuantity = (event) => {
  for (const key in materialList.value) {
    if (Object.hasOwnProperty.call(materialList.value, key)) {
      materialList.value[key]["total_quantity"] =
        materialList.value[key]["quantity_per_product"] * event.target.value;
      updateTotalPrice(key);
    }
  }
};

const updateTotalPrice = (index) => {
  materialList.value[index]["total_price"] =
    materialList.value[index]["total_quantity"] *
    materialList.value[index]["price_per_material"];
};

watch(
  () => bomStore.materialList,
  (_state) => {
    //更新价格c
    materialList.value.map((item, index) => {
      materialList.value[index].price_per_material =
        _state[item.material_code]['price_per_material'] ||
        materialList.value[index].price_per_material ||
        0;
      updateTotalPrice(index);
    });
  },
  {
    deep: true,
  }
);

// watch(
//   materialList,
//   (state) => {
//     //更新价格
//     materialList.value.map((item)=>{
//       item['total_price'] = item['total_quantity'] * item['price_per_material']
//     })
//   },
//   {
//     deep:true
//   }
// )

defineExpose({
  geSubFormData,
});
</script>
