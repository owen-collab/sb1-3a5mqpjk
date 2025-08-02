@@ .. @@
 -- Rendezvous policies
-CREATE POLICY "Anyone can create rendezvous"
-    ON rendezvous FOR INSERT
-    TO anon, authenticated
-    WITH CHECK (true);
+CREATE POLICY "Authenticated users can insert their own rendezvous"
+    ON rendezvous FOR INSERT
+    TO authenticated
+    WITH CHECK (auth.uid() = user_id);
+
+CREATE POLICY "Anonymous users can insert rendezvous"
+    ON rendezvous FOR INSERT
+    TO anon
+    WITH CHECK (user_id IS NULL);
 
 CREATE POLICY "Users can view own rendezvous"