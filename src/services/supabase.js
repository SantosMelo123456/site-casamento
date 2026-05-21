import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pxkytucymsvhcrygxizk.supabase.co'
const supabaseKey = 'sb_publishable_exIwQ-AypaWWUwudatfYjA_8h5xkLnQ'

export const supabase = createClient(supabaseUrl, supabaseKey)