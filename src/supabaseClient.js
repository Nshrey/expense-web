import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mfqyiequugsvspukklhx.supabase.co';
const supabaseKey = 'sb_publishable_-qug_Gh_V3dmWtFwBq1nqg_9h5osrjQ';

export const supabase = createClient(supabaseUrl, supabaseKey);