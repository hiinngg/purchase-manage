import { serverSupabaseClient } from '#supabase/server'
import randomEntry from  '../../randomEntry'

export default eventHandler(async (event) => {

  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)

    //插入
    const arr = []
    const purchaseCode = randomEntry()
    for (const key in body.data) {
      if (Object.hasOwnProperty.call(body.data, key)) {
        const element = body.data[key];
        arr.push({
          purchase_code:purchaseCode,
          order_code:element.orderCode,
          order_data:element.orderDetailList
        })
        
      }
    }
    const {error} = await client.from('purchase').insert(arr)
    if(!error){
      return {statusCode:201,message:'操作成功'}
    }else{
      return {statusCode:error.code,message:error.message}
    }
  } catch (uncaughtError) {
    throw createError(uncaughtError)
  }
})