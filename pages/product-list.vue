<template>
     <!-- <UButton class="my-8" @click="handleClick">新增产品</UButton>
    <UButton class="my-8 ml-2" @click="handleMaterialClick">新增物料</UButton> -->
    <UButton class="my-8 ml-2" @click="handleBomClick">新增bom</UButton>
    <div class="flex items-center mb-2">
      <UInput class="w-1/3" v-model="query.product_code" placeholder="查询产品编码" />
      <UButton class="ml-2" @click="fetch">查询</UButton>
    </div>
    <UTable
    :loading="loading"
    :loading-state="{
      icon: 'i-heroicons-arrow-path-20-solid',
      label: '拼命加载中',
    }"
    :columns="columns"
    :rows="data.productList"
  >
    <!-- <template #order_codes-data="{ row }">
      {{ row.order_codes.join("，") }}
    </template>
    <template #created_at-data="{ row }">
      {{ $dayjs(row.created_at).format("YYYY-MM-DD HH:mm:ss") }}
    </template> -->
    <template #created_at-data="{ row }">
      {{ $dayjs(row.created_at).format("YYYY-MM-DD HH:mm:ss") }}
    </template>
    <template #action-data="{ row }">
      <UButton @click="handleEdit(row.product_id)">编辑</UButton>
    </template>
  </UTable>
  <div
    class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
  >
    <UPagination
      v-if="data.total"
      v-model="query.page"
      :page-count="5"
      :total="data.total"
    />
  </div>

    
   <!-- <UTable
   :loading="false"
  :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }"
  class="w-full px-8"
  :columns="[{ key: 'product_code', label: '产品编码' }, { key: 'product_name', label: '产品名称' }, { key: 'product_model', label: '产品型号' }]"
/> -->
<!-- <UModal v-model="isOpen">
    <UCard>
      <template #header> 新增产品 </template>
      <ProductForm  @operClose="isOpen = false" @operSuccess="isOpen = false"></ProductForm>
    </UCard>
  </UModal>
  <UModal v-model="isMaterialFormOpen">
    <UCard>
      <template #header> 新增物料 </template>
      <MaterialForm @operSuccess="isMaterialFormOpen = false"></MaterialForm>
    </UCard>
  </UModal>

  <UModal v-model="isbomFormOpen" preventClose>
    <UCard>
      <template #header> 新增BOM</template>
      <BomForm  @operClose="isbomFormOpen = false" @operSuccess="isbomFormOpen = false"></BomForm>
    </UCard>
  </UModal> -->
  <UModal v-model="isbomFormOpen" fullscreen preventClose :ui="{base:'overflow-y-auto'}">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div>{{ currentProductId?'编辑':'新增' }}BOM</div>
          <UButton
            @click="isbomFormOpen = false"
            icon="i-heroicons-x-mark-16-solid"
            size="sm"
            color="rose"
            square
            variant="solid"
          />
        </div>
      </template>
      <BomForm :productId="currentProductId"  @operClose="isbomFormOpen = false" @operSuccess="handleSuccess"></BomForm>
    </UCard>
  </UModal>
</template>
<script setup>

const isbomFormOpen = ref(false);
const loading = ref(false)
const query = reactive({
  page:1,
  product_code:''
})
const data = ref({
  productList:[],
  total:0,
});
const handleBomClick = () => {
  isbomFormOpen.value = true;
};

const currentProductId = ref(null)
const columns = [
  {
    key: "product_code",
    label: "产品编码",
  },
  {
    key: "product_name",
    label: "产品名称",
  },
  // {
  //   key: "product_model",
  //   label: "产品型号",
  // },
  {
    key: "product_colortemperature",
    label: "产品色温",
  },
  {
    key: "product_wattage",
    label: "产品瓦数",
  },
  {
    key: "created_at",
    label: "创建时间",
  },
  {
    key: "action",
    label: "操作",
  },
];



onMounted(() => {
  fetch();
});


const fetch = async (force = false) => {
  loading.value = true
  const res = await $fetch("/api/product/list", {
    query,
  });
  data.value = res;
  loading.value = false
};


const handleEdit =async (id)=>{

//   await navigateTo({
//     path: '/purchase/order',
//     query: {
//       purchase_code:id
//     }
// })
currentProductId.value = id;
nextTick(()=>{
  isbomFormOpen.value = true
})



}

const handleSuccess = ()=>{
  isbomFormOpen.value = false
  fetch();
}


watch(()=>query.page, () => {
  fetch();
});


watch(isbomFormOpen,(state)=>{
  if(!state){
    currentProductId.value = null
  }
})
</script>
<style lang="scss">
</style>