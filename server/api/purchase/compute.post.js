import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {

  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)
    const { data, error } = await client
    .rpc('getmaterialusagesummary',{products_arr:body.productCodeList})
    console.log(data,'GetMaterialUsageSummary res=========>')
    if(!error){
      return {statusCode:201,message:'操作成功',data:data}
    }else{
      return {statusCode:error.code,message:error.message}
    }
  } catch (uncaughtError) {
    throw createError(uncaughtError)
  }


  // const { data } = await client.from('product').select('*')
  // return { products: data }
})