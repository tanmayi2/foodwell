'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { User, Truck, Phone, Mail, MapPin, Clock, Star, Edit2, Save, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface DelivererProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  vehicle_type: string;
  license_plate: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  is_available: boolean;
  delivery_radius: number;
  preferred_hours_start: string;
  preferred_hours_end: string;
  accepts_cash: boolean;
  accepts_card: boolean;
}

interface DelivererStats {
  total_deliveries: number;
  total_earnings: number;
  average_delivery_time: number;
  completion_rate: number;
  average_rating: number;
  peak_hours: string;
  recent_activity: {
    date: string;
    deliveries: number;
    earnings: number;
  }[];
}

export default function DelivererProfilePage() {
  const [profile, setProfile] = useState<DelivererProfile | null>(null);
  const [stats, setStats] = useState<DelivererStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: '',
    address: '',
    vehicle_type: '',
    license_plate: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    delivery_radius: 0,
    preferred_hours_start: '',
    preferred_hours_end: '',
    accepts_cash: true,
    accepts_card: true,
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch profile and stats in parallel
        const [profileResponse, statsResponse] = await Promise.all([
          fetch('/api/delivery/profile'),
          fetch('/api/delivery/profile/stats')
        ]);
        
        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile');
        }
        
        const profileData = await profileResponse.json();
        setProfile(profileData);
        
        // Set edit form with profile data
        setEditForm({
          full_name: profileData.full_name || '',
          phone: profileData.phone || '',
          address: profileData.address || '',
          vehicle_type: profileData.vehicle_type || '',
          license_plate: profileData.license_plate || '',
          emergency_contact_name: profileData.emergency_contact_name || '',
          emergency_contact_phone: profileData.emergency_contact_phone || '',
          delivery_radius: profileData.delivery_radius || 10,
          preferred_hours_start: profileData.preferred_hours_start || '09:00',
          preferred_hours_end: profileData.preferred_hours_end || '21:00',
          accepts_cash: profileData.accepts_cash ?? true,
          accepts_card: profileData.accepts_card ?? true,
        });
        
        // Fetch stats if available
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    if (profile) {
      setEditForm({
        full_name: profile.full_name,
        phone: profile.phone,
        address: profile.address,
        vehicle_type: profile.vehicle_type,
        license_plate: profile.license_plate,
        emergency_contact_name: profile.emergency_contact_name,
        emergency_contact_phone: profile.emergency_contact_phone,
        delivery_radius: profile.delivery_radius,
        preferred_hours_start: profile.preferred_hours_start,
        preferred_hours_end: profile.preferred_hours_end,
        accepts_cash: profile.accepts_cash,
        accepts_card: profile.accepts_card,
      });
    }
    setEditing(false);
  };

  const handleSave = async () => {
    if (!profile) return;
    
    try {
      setSaving(true);
      const response = await fetch('/api/delivery/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setEditing(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailability = async () => {
    if (!profile) return;
    
    try {
      const newAvailability = !profile.is_available;
      
      const response = await fetch('/api/delivery/profile/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_available: newAvailability }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update availability');
      }
      
      setProfile({
        ...profile,
        is_available: newAvailability,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update availability');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Logo */}
      <div className="flex items-center justify-between">
        <Link href="/delivery" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="text-2xl font-bold text-primary">FoodWell</div>
        </Link>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <h1 className="text-3xl font-bold text-foreground">Deliverer Profile</h1>
            <p className="text-muted-foreground">Manage your delivery profile and settings</p>
          </div>
          {!editing && (
            <Button onClick={handleEdit} className="flex items-center space-x-2">
              <Edit2 className="h-4 w-4" />
              <span>Edit Profile</span>
            </Button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error</p>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Availability Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Availability Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                You are currently {profile.is_available ? 'available' : 'unavailable'} for deliveries
              </p>
              <p className="text-sm text-muted-foreground">
                Toggle this to control whether you receive new delivery requests
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={profile.is_available ? 'default' : 'secondary'}>
                {profile.is_available ? 'Online' : 'Offline'}
              </Badge>
              <Switch
                checked={profile.is_available}
                onCheckedChange={toggleAvailability}
              />
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              {editing ? (
                <Input
                  id="full_name"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                />
              ) : (
                <div className="flex items-center space-x-2 mt-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.full_name}</span>
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{profile.email}</span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              {editing ? (
                <Input
                  id="phone"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              ) : (
                <div className="flex items-center space-x-2 mt-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.phone}</span>
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="vehicle_type">Vehicle Type</Label>
              {editing ? (
                <Input
                  id="vehicle_type"
                  value={editForm.vehicle_type}
                  onChange={(e) => setEditForm({ ...editForm, vehicle_type: e.target.value })}
                />
              ) : (
                <div className="flex items-center space-x-2 mt-1">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.vehicle_type}</span>
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="license_plate">License Plate</Label>
              {editing ? (
                <Input
                  id="license_plate"
                  value={editForm.license_plate}
                  onChange={(e) => setEditForm({ ...editForm, license_plate: e.target.value })}
                />
              ) : (
                <div className="flex items-center space-x-2 mt-1">
                  <span className="h-4 w-4 text-muted-foreground">#</span>
                  <span>{profile.license_plate || 'Not provided'}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
              {editing ? (
                <Input
                  id="emergency_contact_name"
                  value={editForm.emergency_contact_name}
                  onChange={(e) => setEditForm({ ...editForm, emergency_contact_name: e.target.value })}
                />
              ) : (
                <div className="flex items-center space-x-2 mt-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.emergency_contact_name || 'Not provided'}</span>
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
              {editing ? (
                <Input
                  id="emergency_contact_phone"
                  value={editForm.emergency_contact_phone}
                  onChange={(e) => setEditForm({ ...editForm, emergency_contact_phone: e.target.value })}
                />
              ) : (
                <div className="flex items-center space-x-2 mt-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.emergency_contact_phone || 'Not provided'}</span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="address">Address</Label>
            {editing ? (
              <Input
                id="address"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              />
            ) : (
              <div className="flex items-center space-x-2 mt-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{profile.address}</span>
              </div>
            )}
          </div>
          
          {editing && (
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleSave} disabled={saving} className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={saving} className="flex items-center space-x-2">
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delivery Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="delivery_radius">Delivery Radius (miles)</Label>
              {editing ? (
                <Input
                  id="delivery_radius"
                  type="number"
                  value={editForm.delivery_radius}
                  onChange={(e) => setEditForm({ ...editForm, delivery_radius: parseInt(e.target.value) || 0 })}
                />
              ) : (
                <div className="flex items-center space-x-2 mt-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.delivery_radius} miles</span>
                </div>
              )}
            </div>
            
            <div>
              <Label>Peak Hours</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{stats?.peak_hours || 'Not available'}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="preferred_hours_start">Preferred Start Time</Label>
              {editing ? (
                <Input
                  id="preferred_hours_start"
                  type="time"
                  value={editForm.preferred_hours_start}
                  onChange={(e) => setEditForm({ ...editForm, preferred_hours_start: e.target.value })}
                />
              ) : (
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.preferred_hours_start}</span>
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="preferred_hours_end">Preferred End Time</Label>
              {editing ? (
                <Input
                  id="preferred_hours_end"
                  type="time"
                  value={editForm.preferred_hours_end}
                  onChange={(e) => setEditForm({ ...editForm, preferred_hours_end: e.target.value })}
                />
              ) : (
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.preferred_hours_end}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Accept Cash Payments</p>
                <p className="text-sm text-muted-foreground">Allow customers to pay with cash</p>
              </div>
              {editing ? (
                <Switch
                  checked={editForm.accepts_cash}
                  onCheckedChange={(checked) => setEditForm({ ...editForm, accepts_cash: checked })}
                />
              ) : (
                <Badge variant={profile.accepts_cash ? 'default' : 'secondary'}>
                  {profile.accepts_cash ? 'Yes' : 'No'}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Accept Card Payments</p>
                <p className="text-sm text-muted-foreground">Allow customers to pay with card</p>
              </div>
              {editing ? (
                <Switch
                  checked={editForm.accepts_card}
                  onCheckedChange={(checked) => setEditForm({ ...editForm, accepts_card: checked })}
                />
              ) : (
                <Badge variant={profile.accepts_card ? 'default' : 'secondary'}>
                  {profile.accepts_card ? 'Yes' : 'No'}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
