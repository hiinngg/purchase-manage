import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {

  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)

    //检查唯一性
    const { data } = await client.from('bom').select('*').eq('product_code',body.productCode).single()
    console.log(data,'bom check duplicate========>')
    if(data){
      throw createError({
        data: {
          errorCode:1001
        },
        message: '产品编码已经被建立了bom',
      })
    }
    console.log(body,'12321312')
    //插入
    // const {error} = await client.from('product').insert({
    //    "product_code":body.productCode,
    //    "product_name":body.productName,
    //    "product_model":body.productModel,
    //    "product_colortemperature":body.productColortemperature,
    //    "product_wattage":body.productWattage
    // })
    // if(!error){
    //   return {statusCode:201,message:'操作成功'}
    // }else{
    //   return {statusCode:error.code,message:error.message}
    // }
  } catch (uncaughtError) {
    throw createError(uncaughtError)
  }


  // const { data } = await client.from('product').select('*')
  // return { products: data }
})