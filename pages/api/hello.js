// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import supabase from "../../operation/superbase"


export default async function handler(req, res) {
  let {data,error} = await supabase
    .from('user')
    .select('*')
  res.status(200).json(data)
}

