<template>
  <UButton class="mb-8" @click="handleAdd">新增采购单</UButton>
   
   
  <UTable :columns="columns" :rows="purchaseList" >
    <template #order_codes-data="{ row }">
       {{row.order_codes.join("，") }}
    </template>
    <template #created_at-data="{ row }">
       {{ $dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss') }}
    </template>
    <template #action-data="{ row }">
        <UButton @click="handleEdit(row.purchase_id)">编辑</UButton>
    </template>
  </UTable>
  <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      <UPagination v-model="page" :page-count="pageCount" :total="purchaseList.length" />
    </div>
</template>

<script setup>

const { data: purchaseList } = await useLazyFetch("/api/purchase/list",{query:{}});

const columns = [
    {
  key: 'purchase_code',
  label: '采购编码'
},
{
  key: 'order_codes',
  label: '订单编号'
},
{
  key: 'created_at',
  label: '创建时间'
},
{
  key: 'action',
  label: '操作'
},
]

const handleAdd = async()=>{
    await navigateTo('/purchase/order')
}



</script>

<style>

</style>