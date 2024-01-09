import { serverSupabaseClient } from '#supabase/server'

const page_size = 5
export default eventHandler(async (event) => {

    try {
        const client = await serverSupabaseClient(event)
        const query = getQuery(event);
        const startIndex = (query.page_num - 1) * page_size;
        const endIndex = query.page_num * page_size - 1;
    
        // 执行分页查询
        let { data, error, count } = await client
        .from('product')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(startIndex, endIndex);
       
        if (error) {
           throw new error(error)
        }
        return {
            total:count,
            productList:data
        };   
    } catch (error) {
        console.log(error);
        throw createError(error);
    }

   
})