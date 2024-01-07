<template>
  <UButton class="mb-8" @click="handleAdd">新增采购单</UButton>
  <UTable
    :loading="loading"
    :loading-state="{
      icon: 'i-heroicons-arrow-path-20-solid',
      label: '拼命加载中',
    }"
    :columns="columns"
    :rows="data.purchaseList"
  >
    <template #order_codes-data="{ row }">
      {{ row.order_codes.join("，") }}
    </template>
    <template #created_at-data="{ row }">
      {{ $dayjs(row.created_at).format("YYYY-MM-DD HH:mm:ss") }}
    </template>
    <template #action-data="{ row }">
      <UButton @click="handleEdit(row.purchase_code)">编辑</UButton>
    </template>
  </UTable>
  <div
    class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
  >
    <UPagination
      v-if="data.total"
      v-model="page"
      :page-count="10"
      :total="data.total"
    />
  </div>
</template>

<script setup>
const columns = [
  {
    key: "purchase_code",
    label: "采购编码",
  },
  {
    key: "order_codes",
    label: "订单编号",
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

const loading = ref(false)

onMounted(() => {
  fetch();
});

const page = ref(1);
const data = ref({
  purchaseList:[],
  total:0,
});
const handleAdd = async () => {
  await navigateTo("/purchase/order");
};

const fetch = async (force = false) => {
  loading.value = true
  const res = await $fetch("/api/purchase/list", {
    query: {
      page_num: page.value,
    },
  });
  data.value = res;
  loading.value = false
};


const handleEdit =async (id)=>{

  await navigateTo({
    path: '/purchase/order',
    query: {
      purchase_code:id
    }
})


}


watch(page, () => {
  fetch();
});
</script>

<style></style>
