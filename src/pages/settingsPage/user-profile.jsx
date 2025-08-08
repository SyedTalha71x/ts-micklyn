import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FireApi } from "@/hooks/fireApi";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { useProfile } from "@/Context/ProfileContext";

export default function UserProfile() {
  const { profile, setProfile } = useProfile();
  const [editMode, setEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    address: "",
  });

  // Initialize form data when profile is available
  useState(() => {
    if (profile?.user) {
      setFormData({
        email: profile.user.email || "",
        name: profile.user.name || "",
        phone: profile.user.phone || "",
        address: profile.user.address || "",
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await FireApi("/update", "PUT", {
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });
      
      // Update the context with new data
      setProfile({
        ...profile,
        user: {
          ...profile.user,
          ...formData
        }
      });
      
      toast.success(response.message);
      setEditMode(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!profile?.user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" size={24} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="dark:bg-[#2A2B2E]">
        <CardHeader className="border-b dark:border-gray-700 pb-3">
          <div className="flex justify-between items-center">
            <h1 className="text-base font-semibold">User Profile</h1>
            {!editMode && (
              <Button
                variant="outline"
                onClick={() => setEditMode(true)}
                className="dark:bg-[#232428] h-8 text-xs cursor-pointer"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="mt-2">
          {editMode ? (
            <form onSubmit={handleUpdateProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full dark:bg-[#080808] text-sm h-8"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Name</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full dark:bg-[#080808] text-sm h-8"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Phone</label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full dark:bg-[#080808] text-sm h-8"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Address</label>
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full dark:bg-[#080808] text-sm h-8"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <Button
                  type="submit"
                  className="bg-black text-white hover:bg-gray-800 h-8 text-xs cursor-pointer"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Loader className="animate-spin mr-1" size={14} />
                  ) : null}
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditMode(false)}
                  className="dark:bg-[#232428] h-8 text-xs cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div>
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Email
                </h3>
                <p className="mt-1 text-sm">{profile.user.email || "Not provided"}</p>
              </div>

              <div>
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Name
                </h3>
                <p className="mt-1 text-sm">{profile.user.name || "Not provided"}</p>
              </div>

              <div>
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Phone
                </h3>
                <p className="mt-1 text-sm">{profile.user.phone || "Not provided"}</p>
              </div>

              <div>
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Address
                </h3>
                <p className="mt-1 text-sm">
                  {profile.user.address || "Not provided"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}