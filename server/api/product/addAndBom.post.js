import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {

  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)
    const data = await client
    .rpc('save_product_material_info',{data:body})
    console.log(data,'save_product_material_info')
    if(!data.error){
      return {statusCode:201,message:'操作成功',data:data}
    }else{
        let code = data.error.code
        let msg  = data.error.message
        if(data.error.code==23505){
            code = 1001;
            msg = '该产品编码已被创建'
        }
      return {statusCode:code,message:msg}
    }
  } catch (uncaughtError) {
    throw createError(uncaughtError)
  }


  // const { data } = await client.from('product').select('*')
  // return { products: data }
})