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
        const { name, username, email, location } = data
        if (emptyString(name)) bad(res, 400, 'Name is requires!')
        if (emptyString(username)) bad(res, 400, 'Username is requires!')
        if (emptyString(email)) bad(res, 400, 'Email address is requires!')
        if (invalidEmail(email)) bad(res, 400, 'Invalid email address!')
        if (emptyString(location)) bad(res, 400, 'Location is requires!')

        const { createData, error } = await supabase
            .from('user')
            .insert([{ name, username, email, location }]);

        if (error) return bad(res, 400, error.message)

        return good(res, 201, createData, 'user created successfully!')
    } catch (e) {
        bad(res, 500, e.message)
    }
}




const get = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('user')
            .select('id,name,username,email,location')
            .eq('isDelete', false);

        if (error) return bad(res, 400, error.message)
        if (get.length == 0) return bad(res, 404, 'No user list avalable!')

        return good(res, 200, data, 'user list!')
    } catch (e) {
        bad(res, 500, e.message)
    }
}