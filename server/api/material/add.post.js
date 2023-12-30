import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {

  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)
    if(!body.materialCode){
      throw createError({
        statusCode: 400,
        message: '物料编码不能为空',
      })
    }
    //检查唯一性
    const { data } = await client.from('material').select('*').eq('material_code',body.materialCode).single()
    console.log(data,'material check duplicate========>')
    if(data){
      throw createError({
        data: {
          errorCode:1001
        },
        message: '物料编码已经被占用',
      })
    }
    //插入
    const {error} = await client.from('material').insert({
       "material_code":body.materialCode,
       "material_name":body.materialName,
       "material_model":body.materialModel,
    })
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