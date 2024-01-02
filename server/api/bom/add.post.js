import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {

  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)
    if(!body.productCode){
      throw createError({
        statusCode: 400,
        message: '产品编码不能为空',
      })
    }
    if(body.materiaCodes.length==0){
      throw createError({
        statusCode: 400,
        message: '物料不能为空',
      })
    }
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
    const arr = body.materiaCodes.map((item)=>{
       return {product_code:body.productCode,quantity:item.quantity,material_code:item.materialCode}
    })
    const {error} = await client.from('bom').insert(arr)
    if(!error){
      return {statusCode:201,message:'操作成功'}
    }else{
      return {statusCode:error.code,message:error.message}
    }
  } catch (uncaughtError) {
    throw createError(uncaughtError)
  }


  // const { data } = await client.from('product').select('*')
  // return { products: data }
})