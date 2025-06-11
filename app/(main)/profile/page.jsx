'use client';

import { supabase } from '@/services/supabaseClient';
import { useCallback, useEffect, useState } from 'react';
import { useUser } from '@/app/provider';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useUser();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    picture: '',
    role: '',
    phone: '',
    skills: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userId = user?.id;

      if (!userId) return;

      // Get user data from Users table
      const { data: userData, error: userError } = await supabase
        .from('Users')
        .select('name, email, picture')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      // Get profile data using the user's email
      const { data: profileInfo, error: profileError } = await supabase
        .from('profile')
        .select('role, phone, skills')
        .eq('email', userData?.email)
        .single();

      // Ignore "No rows found" error (code PGRST116)
      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      setProfileData({
        name: userData?.name || '',
        email: userData?.email || '',
        picture: userData?.picture || '',
        role: profileInfo?.role || '',
        phone: profileInfo?.phone || '',
        skills: profileInfo?.skills || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Image upload failed:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

 const handleUpdate = useCallback(async () => {
  try {
    setUploading(true);
    const userId = user?.id;
    if (!userId) return;

    // Get current user email first
    const { data: currentUserData, error: userError } = await supabase
      .from('Users')
      .select('email')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    const currentEmail = currentUserData?.email;

    // Upload new image if selected
    let imageUrl = profileData.picture;
    if (imageFile) {
      const newImageUrl = await handleImageUpload(imageFile);
      if (newImageUrl) imageUrl = newImageUrl;
    }

    // First update the Users table
    const { error: userUpdateError } = await supabase
      .from('Users')
      .update({
        name: profileData.name,
        picture: imageUrl,
      })
      .eq('id', userId);

    if (userUpdateError) throw userUpdateError;

    // Then upsert the profile data
    const { error: profileUpsertError } = await supabase
      .from('profile')
      .upsert(
        {
          email: currentEmail,
          role: profileData.role,
          phone: profileData.phone,
          skills: profileData.skills,
        },
        { onConflict: 'email' } // Explicitly specify the conflict resolution
      );

    if (profileUpsertError) throw profileUpsertError;

    setEditing(false);
    setImageFile(null);
    setPreviewUrl(null);
    await fetchProfile();
  } catch (error) {
    console.error('Error updating profile:', error);
    // You might want to add user feedback here (e.g., toast notification)
  } finally {
    setUploading(false);
  }
}, [user?.id, profileData, imageFile, handleImageUpload, fetchProfile]);


  useEffect(() => {
    if (user?.id) fetchProfile();
  }, [user]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Your Profile</CardTitle>
            <div className="relative">
              <Avatar className="w-16 h-16">
                <AvatarImage src={previewUrl || profileData.picture} />
                <AvatarFallback className="text-xl">
                  {profileData.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              {editing && (
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full p-2 h-8 w-8"
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 grid gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            {editing ? (
              <Input
                id="name"
                value={profileData.name}
                placeholder="e.g. John Doe"
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {profileData.name || "Not provided"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <p className="text-sm text-muted-foreground">
              {profileData.email || "Not provided"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            {editing ? (
              <Input
                id="role"
                value={profileData.role}
                placeholder="e.g. Full Stack Developer"
                onChange={(e) =>
                  setProfileData({ ...profileData, role: e.target.value })
                }
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {profileData.role || "Not provided"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            {editing ? (
              <Input
                id="phone"
                value={profileData.phone}
                placeholder="e.g. +1 (555) 123-4567"
                onChange={(e) =>
                  setProfileData({ ...profileData, phone: e.target.value })
                }
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {profileData.phone || "Not provided"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            {editing ? (
              <Input
                id="skills"
                value={profileData.skills}
                placeholder="e.g. React, Node.js, TypeScript"
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    skills: e.target.value,
                  })
                }
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {profileData.skills || "Not provided"}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2 pt-6 border-t">
          {editing ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditing(false);
                  setImageFile(null);
                  setPreviewUrl(null);
                }}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)}>
              Edit Profile
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}