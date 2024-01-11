import { serverSupabaseClient } from "#supabase/server";

const page_size = 5;
export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event);
    const query = getQuery(event);
    const startIndex = (query.page - 1) * page_size;
    const endIndex = query.page * page_size - 1;

    // 创建查询
    let _query = client
    .from("product")
    .select("*", { count: "exact" })

       // 如果有搜索查询，添加搜索条件
     if (query.product_code) {
        _query = _query.ilike('product_code', query.product_code);
    }

    // 执行分页查询
    let { data, error, count } = await _query
      .order("created_at", { ascending: false })
      .range(startIndex, endIndex);

    if (error) {
      throw createError(error);
    }
    return {
      total: count,
      productList: data,
    };
  } catch (error) {
    console.log(error);
    throw createError(error);
  }
});
