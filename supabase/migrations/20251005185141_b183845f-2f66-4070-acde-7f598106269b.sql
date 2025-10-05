
-- Fix orphaned profile issue: Replace the incorrect user_id in conversation_participants
-- with the correct user_id from auth.users for yone95572@gmail.com

UPDATE conversation_participants
SET user_id = '6a01fb2e-9c7b-45b4-ab7f-9e2c058f54f3'
WHERE user_id = '5163af1e-cb3b-4838-bb0c-e68447d63777'
  AND conversation_id = 'a33b38cc-0910-4954-8963-fa1d9ceac761';

-- Clean up the orphaned profile
DELETE FROM profiles WHERE id = '5163af1e-cb3b-4838-bb0c-e68447d63777';
