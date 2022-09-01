import supabase from "../../../operation/superbase"
import { emptyNumber, emptyString } from "../../../operation/validation"

export default async function handler(req, res) {
    switch (req.method) {
        case 'PUT':
            return await updateOrder(req, res)
        case 'DELETE':
            return await deleteOrder(req, res)
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



const updateOrder = async (req, res) => {
    try {
        const orderId = req.query.orderId || null
        const data = req.body
        const { amount, delivery_charge, taxes, fee, discount, currency, total, cashback, billing_address, shipping_address, status, profile_id } = data
        const object = {}
        if (!emptyNumber(amount)) object.amount = amount
        if (!emptyNumber(delivery_charge)) object.delivery_charge = delivery_charge
        if (!emptyNumber(taxes)) object.taxes = taxes
        if (!emptyNumber(fee)) object.fee = fee
        if (!emptyNumber(discount)) object.discount = discount
        if (!emptyString(currency)) object.currency = currency
        if (!emptyNumber(total)) object.total = total
        if (!emptyNumber(cashback)) object.cashback = cashback
        if (!emptyString(billing_address)) {

            if (!emptyString(profile_id)) object.profile_id = profile_id
            else return bad(res, 400, 'for updatting billing address you need to add profile_id also!')

            //db call for check billing
            const valid_billing = await supabase
                .from('physical_address')
                .select('*')
                .eq('isDelete', false)
                .eq('user_id', profile_id)
                .eq('id', billing_address)
            console.log(valid_billing)
            if (!valid_billing.data || valid_billing.data.length == 0 || valid_billing.error) return bad(res, 404, valid_billing.error?.message || 'physical address for billing does\'t avalable (hint: physical address\'s user id is maynotbe match with profile_id)!')

            object.billing_address = billing_address
        }
        if (!emptyString(shipping_address)) {
            if (!emptyString(profile_id)) object.profile_id = profile_id
            else return bad(res, 400, 'for updatting shipping address you need to add profile_id also!')

            //db call for check shipping
            const valid_shipping = await supabase
                .from('physical_address')
                .select('*')
                .eq('isDelete', false)
                .eq('user_id', profile_id)
                .eq('id', shipping_address)
            if (!valid_shipping.data || valid_shipping.data.length == 0 || valid_shipping.error) return bad(res, 404, valid_shipping.error?.message || 'physical address for shipping does\'t avalable (hint: physical address\'s user id is maynotbe match with profile_id)!')

            object.shipping_address = shipping_address
        }
        if (typeof status == 'boolean') object.boolean = boolean

        const updateTBL = await supabase
            .from('order')
            .update(object)
            .eq('isDelete', false)
            .eq('id', orderId)
            .select('amount,delivery_charge,taxes,fee,discount,currency,total,cashback,billing_address,shipping_address,status,profile_id')

        if (updateTBL.error) return bad(res, 400, updateTBL.error.message || 'order info unavalable')

        return good(res, 200, updateTBL.data[0], 'order updated successfully!')
    } catch (e) {
        console.log(e)
        bad(res, 500, e.message)
    }
}




const deleteOrder = async (req, res) => {
    try {
        const orderId = req.query.orderId || null
        if (emptyString(orderId)) return bad(res, 400, 'orderId is required!')

        const { data, error } = await supabase
            .from('order')
            .update({ 'isDelete': true })
            .eq('isDelete', false)
            .eq('id', orderId)
            .select('id')

        if (error && error.message) return bad(res, 400, error.message)
        if (!data) return bad(res, 404, 'order info unavalable!')

        return good(res, 200, undefined, 'order deleted successfully!')

    } catch (e) {
        console.log(e)
        bad(res, 500, e.message)
    }
}


