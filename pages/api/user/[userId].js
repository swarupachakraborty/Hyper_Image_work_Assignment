import supabase from "../../../operation/superbase"
import { emptyObject, emptyString, invalidEmail } from "../../../operation/validation"

export default async function handler(req, res) {
    switch (req.method) {
        case 'PUT':
            return await update(req, res)
        case 'DELETE':
            return await deleteUser(req, res)
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

const update = async (req, res) => {
    try {
        const userId = req.query.userId || null
        if (emptyString(userId)) return bad(res, 400, 'userId is required!')

        const body = req.body
        const { name, username, email, location } = body
        const object = {}

        if (!emptyString(name)) object.name = name
        if (!emptyString(username)) object.username = username
        if (!emptyString(email)) {
            if (!invalidEmail(email)) object.email = email
            else return bad(res, 400, 'Invalid email address!')
        }
        if (!emptyString(location)) object.location = location
        if (emptyObject(object)) return bad(res, 400, 'please enter some key-value to update user data!')

        const { data, error } = await supabase
            .from('user')
            .update(object)
            .eq('isDelete', false)
            .eq('id', userId)
            .select('id,name,username,email,location')

        if (error && error.message) return bad(res, 400, error.message || 'user info unavalable')
        if (!data) return bad(res, 404, 'User info unavalable!')

        return good(res, 200, data[0], 'user list!')
    } catch (e) {
        bad(res, 500, e.message)
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.query.userId || null
        if (emptyString(userId)) return bad(res, 400, 'userId is required!')

        const { data, error } = await supabase
            .from('user')
            .update({ 'isDelete': true })
            .eq('isDelete', false)
            .eq('id', userId)
            .select('id')

        if (error && error.message) return bad(res, 400, error.message)
        if (!data) return bad(res, 404, 'User info unavalable!')

        return good(res, 200, undefined, 'User deleted successfully!')
    } catch (e) {
        bad(res, 500, e.message)
    }
}