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
        const { contract_id, name, currency, unit_amount, type, interval } = data
        if (emptyString(contract_id)) bad(res, 400, 'contract_id is requires!')
        if (emptyString(name)) bad(res, 400, 'name is requires!')
        if (emptyString(currency)) bad(res, 400, 'currency is requires!')
        if (emptyString(unit_amount)) bad(res, 400, 'unit_amount is requires!')
        if (emptyString(type)) bad(res, 400, 'type is requires!')
        if (emptyString(interval)) bad(res, 400, 'interval is requires!')

        const createData = await supabase
            .from('inventory')
            .insert([{ contract_id, name, currency, unit_amount, type, interval }])
            .select('id,contract_id,name,currency,unit_amount,type,interval');

        if (createData.error) return bad(res, 400, createData.error.message)

        return good(res, 201, createData.data[0], 'inventory created successfully!')
    } catch (e) {
        console.log(e)
        bad(res, 500, e.message)
    }
}




const get = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('inventory')
            .select('id,contract_id,name,currency,unit_amount,type,interval,created_at')
            .eq('isDelete', false);

        if (error) return bad(res, 400, error.message)
        if (get.length == 0) return bad(res, 404, 'No inventory list avalable!')

        return good(res, 201, data, 'inventory list!')
    } catch (e) {
        console.log(e)
        bad(res, 500, e.message)
    }
}


