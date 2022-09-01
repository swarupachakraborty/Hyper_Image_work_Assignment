import supabase from "../../../operation/superbase"
import { emptyNumber, emptyString, invalidEmail } from "../../../operation/validation"

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
        const { inventory_id, order_id, quantity } = data
        if (emptyString(inventory_id)) bad(res, 400, 'inventory_id is requires!')
        if (emptyString(order_id)) bad(res, 400, 'order_id is requires!')
        if (emptyNumber(quantity)) bad(res, 400, 'quantity is requires!')
        if (quantity <= 0) bad(res, 400, 'minimum quantity required 1!')



        //db call for order_id
        const orderData = await supabase
            .from('order')
            .select('*')
            .eq('isDelete', false)
            .eq('id', order_id)
        if (!orderData.data || orderData.data.length == 0 || orderData.error) return bad(res, 404, orderData.error?.message || 'order id does\'t avalable!')



        //db call for order_id
        const invData = await supabase
            .from('inventory')
            .select('*')
            .eq('isDelete', false)
            .eq('id', inventory_id)
        if (!invData.data || invData.data.length == 0 || invData.error) return bad(res, 404, invData.error?.message || 'inventory id does\'t avalable!')





        const { createData, error } = await supabase
            .from('order_item')
            .insert([{ inventory_id, order_id, quantity }]);

        if (error) return bad(res, 400, error.message)

        return good(res, 201, createData, 'order item created successfully!')
    } catch (e) {
        bad(res, 500, e.message)
    }
}




const get = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('order_item')
            .select('id,inventory_id,order_id,quantity')
            .eq('isDelete', false);

        if (error) return bad(res, 400, error.message)
        if (get.length == 0) return bad(res, 404, 'No order item list avalable!')

        return good(res, 200, data, 'user list!')
    } catch (e) {
        bad(res, 500, e.message)
    }
}