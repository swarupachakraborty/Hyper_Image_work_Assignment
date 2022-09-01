import supabase from "../../../operation/superbase"
import { emptyString, invalidEmail } from "../../../operation/validation"

export default async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            return await get(req, res)
        case 'POST':
            return await create(req, res)
        default:
            bad(res, 404, 'Page not found')
    }
}

const good = (res, code, data, message) => {
    return res.status(code).json({ status: true, data, message })
}
const bad = (res, code, message) => {
    return res.status(code).json({ status: !true, message })

}



const create = async (req, res) => {
    try {
        const data = req.body
        const { amount, source, source_reference_id, order_id, currency } = data
        if (emptyString(amount)) bad(res, 400, 'amount is requires!')
        if (emptyString(source)) bad(res, 400, 'source is requires!')
        if (emptyString(source_reference_id)) bad(res, 400, 'source_reference_id is requires!')
        if (emptyString(order_id)) bad(res, 400, 'order_id is requires!')
        if (emptyString(currency)) bad(res, 400, 'currency is requires!')

        //db call for check if the order id isexist or not
        const userData = await supabase
            .from('order')
            .select('*')
            .eq('isDelete', false)
        if (!userData.data || userData.data.length == 0 || userData.error) return bad(res, 404, userData.error?.message || 'order id does\'t avalable!')


        const { createData, error } = await supabase
            .from('payment')
            .insert([{ amount, source, source_reference_id, order_id, currency }]);

        if (error) return bad(res, 400, error.message)

        return good(res, 201, createData, 'payment created successfully!')
    } catch (e) {
        bad(res, 500, e.message)
    }
}




const get = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('payment')
            .select('id,amount,source,source_reference_id,order_id,currency')
            .eq('isDelete', false);

        if (error) return bad(res, 400, error.message)
        if (get.length == 0) return bad(res, 404, 'No payment list avalable!')

        return good(res, 201, data, 'payment list!')
    } catch (e) {
        bad(res, 500, e.message)
    }
}

