import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function test() {
  console.log('Testing connection...');
  const { data: user, error: err1 } = await supabase.from('users').select('*').limit(1);
  console.log('Users fetch:', user, err1);

  if (user && user.length > 0) {
    const testUserId = user[0].id;
    console.log('Testing upsert progress for user', testUserId);
    const { data, error } = await supabase.from('progress').upsert({
      user_id: testUserId,
      topic_id: 'Motion_9',
      score: 100,
      attempted_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,topic_id'
    }).select();
    
    console.log('Upsert result:', data);
    if (error) {
      console.log('Upsert error:', error);
    }
  } else {
    console.log('No users found in database to test progress insert.');
  }
}

test();
