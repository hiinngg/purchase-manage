<template>
  <div v-if="dataLoading" class="space-y-2">
      <USkeleton class="h-4 w-4/5" />
      <USkeleton class="h-4 w-3/5" />
      <USkeleton class="h-4 w-2/5" />
    </div>
  <UForm v-else ref="form" :validate="validate" :state="state" class="space-y-4 w-full overflow-y-auto pb-36 px-2">
    <ProductForm ref="productFormRef" :originalData="originalData"  @operSuccess="isOpen = false"></ProductForm>
    <!-- <USelectMenu
        v-model="state.productCode"
        :loading="selLoading"
        searchable
        searchable-placeholder="查询产品编码"
        class="w-full"
        placeholder="选择产品编码"
        :options="productList"
        option-attribute="product_name"
        label-attribute="product_code"
        value-attribute="product_code"
        :search-attributes="['product_code', 'product_name']"
      >
        <template #option="{ option: product }">
          <span class="truncate"
            >编码：{{ product.product_code }}——名称：{{
              product.product_name
            }}</span
          >
        </template>
      </USelectMenu> -->

    <UFormGroup label="物料编号" name="materialCodes" class="">
      <UButton class="mb-2" @click="handleBomClick"> 添加 </UButton>
      <div class="space-y-2">
        <div
          v-for="(item, index) in bomItemList"
          :key="item.id"
          class="relative w-100% p-4 shadow-lg"
        >
          <BomItemForm
            :originalData="item"
            ref="bomItemForms"
            :data="materialList?.materials"
            class="flex-1"
          ></BomItemForm>
          <UButton
            @click="handleDel(index)"
            class="ml-2 absolute right-2 top-0"
            icon="i-heroicons-minus"
            size="sm"
            color="rose"
            square
            variant="solid"
          />
        </div>
      </div>
    </UFormGroup>

    <UButton @click="handleBomSave" :loading="submitLoading"> 保存bom </UButton>
    <UButton @click="isMaterialFormOpen = true" class="ml-2" :loading="submitLoading">
      新增物料
    </UButton>
    <UButton @click="emits('operClose')" class="ml-2" :loading="submitLoading">
      关闭
    </UButton>
  </UForm>
  <UModal v-model="isMaterialFormOpen">
    <UCard>
      <template #header> 新增物料 </template>
      <MaterialForm @operSuccess="handleMaterialSuccess"></MaterialForm>
    </UCard>
  </UModal>
  <!--开头  BC PC DZ -->
</template>
<script setup>
const emits = defineEmits(["operSuccess", "operClose"]);

const props = defineProps({
  productId: {
    default: null,
  },
});

const originalData = ref(null)
const toast = useToast();

const selLoading = ref(true);
const selMaterialLoading = ref(true);
const submitLoading = ref(false);
const isMaterialFormOpen = ref(false);
const dataLoading = ref(false)
const bomItemList = ref([]);
const bomItemForms = ref([]);

const productFormRef = ref(null);
const form = ref(null);
const state = reactive({
  materiaCodes: [],
});

const productStore = useProductStore()
// const productList = await productStore.fetchProduct();
// toRef(productList)

const { data: materialList, refresh } = await useLazyFetch("/api/material/all");
selLoading.value = false;
selMaterialLoading.value = false;

const validate = (state) => {
  const errors = [];
  if (!state.productCode) errors.push({ path: "productCode", message: "不能为空" });
  return errors;
};

const handleBomClick = () => {
  bomItemList.value.push({ id: randomEntry() });
};
const handleDel = (index) => {
  bomItemList.value.splice(index, 1);
};

const handleBomSave = async (event) => {
  try {
    const materialList = [];
    const productInfo = await productFormRef.value.getFormData();
    if(props.productId){
      productInfo['productId'] = props.productId
    }
    for (const key in bomItemForms.value) {
      if (Object.hasOwnProperty.call(bomItemForms.value, key)) {
        const element = bomItemForms.value[key];
        const data = await element.getFormData();
        materialList.push(data);
      }
    }
    state.materiaCodes = materialList;
    const data = {
      productInfo,
      materialList,
    };
    await onSubmit(data);
  } catch (error) {
    throw new Error(error);
  }
};

async function onSubmit(postData) {
  // Do something with data
  form.value.clear();
  // console.log(event.data);
  submitLoading.value = true;

  try {
    const { data, error, status } = await useFetch("/api/product/addAndBom", {
      method: "post",
      body: postData,
      watch: false,
    });
    if (data.value.statusCode == "201") {
      productStore.$reset()
      toast.add({ title: "操作成功" });
      emits("operSuccess");
    } else {
      toast.add({
        title: data.value.message,
        color: "rose",
        icon: "i-ep-circle-close",
      });
      if (data.value.statusCode == 1001) {
        // form.value.setErrors(
        //   [{ message: data.value.message, path: "productCode" }],
        //   "materialCode"
        // );
      }
    }
  } catch (error) {
    console.log(error, "errorr");
    // if (error.statusCode==400){
    //   form.value.setErrors({path:'materialCode',message:data.value.message})
    // }
  }

  submitLoading.value = false;

  //
}

const handleMaterialSuccess = () => {
  isMaterialFormOpen.value = false;
  refresh();
};

watch(
  () => props.productId,
  async (productId) => {
    //执行查询
    if (productId) {
      dataLoading.value = true
      const data = await $fetch("/api/product/detail", {
        query: { product_id: productId },
      });
      
      nextTick(()=>{
        originalData.value = data
        bomItemList.value = Array.isArray(data.bom)?data.bom:[]
        dataLoading.value = false
      })

    }
  },{
    immediate:true
  }
);
</script>
