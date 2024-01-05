import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {

  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)

    //插入
    const {error} = await client.from('purchase').insert({
       "purchase_data":body.data,
    })
    if(!error){
      return {statusCode:201,message:'操作成功'}
    }else{
      return {statusCode:error.code,message:error.message}
    }
  } catch (uncaughtError) {
    throw createError(uncaughtError)
  }
})