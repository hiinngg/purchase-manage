import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {

  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)
    for (const key in body) {
        if (Object.hasOwnProperty.call(body, key)) {
            const element = body[key];
            //  //整合数据 [...{orderCode: '123', productCode: 'p1', quantity: 1}...]
                 //         [p1,p2,p3...]
                const { data, error } = await client
                .from('product')
                .select()
                .in('name', ['Albania', 'Algeria'])    
            
        }
    }
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