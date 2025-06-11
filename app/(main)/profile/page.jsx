'use client';

import { supabase } from '@/services/supabaseClient';
import { useEffect, useState } from 'react';
import { useUser } from '@/app/provider';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import ProtectedRoute from '../_components/ProtectedRoute';

export default function ProfilePage() {
  const { user } = useUser();
  const [profileData, setProfileData] = useState({
    name: '',
    picture: '',
    role: '',
    phone: '',
    skills: [],
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    const userId = user?.id;

    const { data: userData } = await supabase
      .from('Users')
      .select('name, picture')
      .eq('id', userId)
      .single();

    const { data: profileInfo } = await supabase
      .from('profile')
      .select('role, phone, skills')
      .eq('user_id', userId)
      .single();

    setProfileData({
      name: userData?.name || '',
      picture: userData?.picture || '',
      role: profileInfo?.role || '',
      phone: profileInfo?.phone || '',
      skills: profileInfo?.skills || [],
    });

    setLoading(false);
  };

  const handleImageUpload = async () => {
    if (!imageFile) return null;
    setUploading(true);
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, imageFile, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Image upload failed:', uploadError.message);
      setUploading(false);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    setUploading(false);
    return publicUrlData?.publicUrl || null;
  };

  const handleUpdate = async () => {
    const userId = user?.id;
    const newImageUrl = await handleImageUpload();

    const updatedPicture = newImageUrl || profileData.picture;

    await supabase.from('Users').update({
      name: profileData.name,
      picture: updatedPicture,
    }).eq('id', userId);

    await supabase.from('profile').upsert({
      user_id: userId,
      role: profileData.role,
      phone: profileData.phone,
      skills: profileData.skills,
    });

    setEditing(false);
    fetchProfile();
  };

  useEffect(() => {
    if (user?.id) fetchProfile();
  }, [user]);

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
                <AvatarImage src={profileData.picture} />
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
                    onChange={(e) => setImageFile(e.target.files[0])}
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
                value={profileData.skills.join(', ')}
                placeholder="e.g. React, Node.js, TypeScript"
                onChange={(e) =>
                    setProfileData({
                        ...profileData,
                        skills: e.target.value.split(',').map((s) => s.trim()),
                    })
                }
                />
            ) : (
                <p className="text-sm text-muted-foreground">
                {profileData.skills.length > 0 ? profileData.skills.join(', ') : "Not provided"}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2 pt-6 border-t">
          {editing ? (
              <>
              <Button variant="outline" onClick={() => setEditing(false)}>
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