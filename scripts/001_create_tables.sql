-- Secret Santa Lists table
CREATE TABLE IF NOT EXISTS secret_santa_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_guest BOOLEAN DEFAULT FALSE
);

-- Participants in a Secret Santa list
CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES secret_santa_lists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exclusions (pairs that cannot be matched)
CREATE TABLE IF NOT EXISTS exclusions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES secret_santa_lists(id) ON DELETE CASCADE,
  participant_1_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  participant_2_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(list_id, participant_1_id, participant_2_id)
);

-- Pairings (who gives to whom)
CREATE TABLE IF NOT EXISTS pairings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES secret_santa_lists(id) ON DELETE CASCADE,
  giver_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  email_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(list_id, giver_id)
);

-- Enable RLS
ALTER TABLE secret_santa_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE exclusions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pairings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for secret_santa_lists
CREATE POLICY "Users can view their own lists" ON secret_santa_lists 
  FOR SELECT USING (auth.uid() = user_id OR is_guest = TRUE);

CREATE POLICY "Users can insert their own lists" ON secret_santa_lists 
  FOR INSERT WITH CHECK (auth.uid() = user_id OR is_guest = TRUE);

CREATE POLICY "Users can update their own lists" ON secret_santa_lists 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lists" ON secret_santa_lists 
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for participants
CREATE POLICY "Users can view participants of their lists" ON participants 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM secret_santa_lists 
      WHERE secret_santa_lists.id = participants.list_id 
      AND (secret_santa_lists.user_id = auth.uid() OR secret_santa_lists.is_guest = TRUE)
    )
  );

CREATE POLICY "Users can insert participants to their lists" ON participants 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM secret_santa_lists 
      WHERE secret_santa_lists.id = participants.list_id 
      AND (secret_santa_lists.user_id = auth.uid() OR secret_santa_lists.is_guest = TRUE)
    )
  );

CREATE POLICY "Users can update participants of their lists" ON participants 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM secret_santa_lists 
      WHERE secret_santa_lists.id = participants.list_id 
      AND secret_santa_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete participants from their lists" ON participants 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM secret_santa_lists 
      WHERE secret_santa_lists.id = participants.list_id 
      AND secret_santa_lists.user_id = auth.uid()
    )
  );

-- RLS Policies for exclusions
CREATE POLICY "Users can view exclusions of their lists" ON exclusions 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM secret_santa_lists 
      WHERE secret_santa_lists.id = exclusions.list_id 
      AND (secret_santa_lists.user_id = auth.uid() OR secret_santa_lists.is_guest = TRUE)
    )
  );

CREATE POLICY "Users can insert exclusions to their lists" ON exclusions 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM secret_santa_lists 
      WHERE secret_santa_lists.id = exclusions.list_id 
      AND (secret_santa_lists.user_id = auth.uid() OR secret_santa_lists.is_guest = TRUE)
    )
  );

CREATE POLICY "Users can delete exclusions from their lists" ON exclusions 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM secret_santa_lists 
      WHERE secret_santa_lists.id = exclusions.list_id 
      AND secret_santa_lists.user_id = auth.uid()
    )
  );

-- RLS Policies for pairings
CREATE POLICY "Users can view pairings of their lists" ON pairings 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM secret_santa_lists 
      WHERE secret_santa_lists.id = pairings.list_id 
      AND (secret_santa_lists.user_id = auth.uid() OR secret_santa_lists.is_guest = TRUE)
    )
  );

CREATE POLICY "Users can insert pairings to their lists" ON pairings 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM secret_santa_lists 
      WHERE secret_santa_lists.id = pairings.list_id 
      AND (secret_santa_lists.user_id = auth.uid() OR secret_santa_lists.is_guest = TRUE)
    )
  );

CREATE POLICY "Users can update pairings of their lists" ON pairings 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM secret_santa_lists 
      WHERE secret_santa_lists.id = pairings.list_id 
      AND secret_santa_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete pairings from their lists" ON pairings 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM secret_santa_lists 
      WHERE secret_santa_lists.id = pairings.list_id 
      AND secret_santa_lists.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_participants_list_id ON participants(list_id);
CREATE INDEX IF NOT EXISTS idx_exclusions_list_id ON exclusions(list_id);
CREATE INDEX IF NOT EXISTS idx_pairings_list_id ON pairings(list_id);
CREATE INDEX IF NOT EXISTS idx_secret_santa_lists_user_id ON secret_santa_lists(user_id);
