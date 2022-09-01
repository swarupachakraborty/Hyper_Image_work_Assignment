import supabase from "../../../operation/superbase"
import { emptyNumber, emptyString } from "../../../operation/validation"

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
        const { amount, delivery_charge, taxes, fee, discount, currency, total, cashback, billing_address, shipping_address, status, profile_id } = data
        if (emptyNumber(amount)) bad(res, 400, 'amount is requires!')
        if (emptyNumber(delivery_charge)) bad(res, 400, 'delivery_charge is requires!')
        if (emptyNumber(taxes)) bad(res, 400, 'taxes is requires!')
        if (emptyNumber(fee)) bad(res, 400, 'fee is requires!')
        if (emptyNumber(discount)) bad(res, 400, 'discount is requires!')
        if (emptyString(currency)) bad(res, 400, 'currency is requires!')
        if (emptyNumber(total)) bad(res, 400, 'total is requires!')
        if (emptyNumber(cashback)) bad(res, 400, 'cashback is requires!')
        if (emptyString(billing_address)) bad(res, 400, 'billing_address is requires!')
        if (emptyString(shipping_address)) bad(res, 400, 'shipping_address is requires!')
        if (emptyString(profile_id)) bad(res, 400, 'profile_id / user id is requires!')
        if (typeof status != 'boolean') bad(res, 400, 'status must be a boolian value!')

        //db call for check billing
        const valid_billing = await supabase
            .from('physical_address')
            .select('*')
            .eq('isDelete', false)
            .eq('user_id', profile_id)
            .eq('id', billing_address)
        console.log(valid_billing)
        if (!valid_billing.data || valid_billing.data.length == 0 || valid_billing.error) return bad(res, 404, valid_billing.error?.message || 'physical address for billing does\'t avalable (hint: physical address\'s user id is maynotbe match with profile_id)!')


        //db call for check shipping
        const valid_shipping = await supabase
            .from('physical_address')
            .select('*')
            .eq('isDelete', false)
            .eq('user_id', profile_id)
            .eq('id', shipping_address)
        if (!valid_shipping.data || valid_shipping.data.length == 0 || valid_shipping.error) return bad(res, 404, valid_shipping.error?.message || 'physical address for shipping does\'t avalable (hint: physical address\'s user id is maynotbe match with profile_id)!')


        const createData = await supabase
            .from('order')
            .insert([{ amount, delivery_charge, taxes, fee, discount, currency, total, cashback, billing_address, shipping_address, status, profile_id }]);

        if (createData.error) return bad(res, 400, createData.error.message)

        return good(res, 201, createData.data[0], 'user created successfully!')
    } catch (e) {
        console.log(e)
        bad(res, 500, e.message)
    }
}




const get = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('order')
            .select('id,amount,delivery_charge,taxes,fee,discount,currency,total,cashback,billing_address,shipping_address,status,profile_id')
            .eq('isDelete', false);

        if (error) return bad(res, 400, error.message)
        if (get.length == 0) return bad(res, 404, 'No user list avalable!')

        return good(res, 201, data, 'user list!')
    } catch (e) {
        console.log(e)
        bad(res, 500, e.message)
    }
}


