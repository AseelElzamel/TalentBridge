import React from "react";
import { User, Upload, X } from "lucide-react";
import { Application, StudentProfile } from "../types";

interface MyProfilePageProps {
  latestApp: Application | null;
  studentProfile: StudentProfile;
  onUpdateProfile: (profile: StudentProfile) => void;
}

export default function MyProfilePage({
  latestApp,
  studentProfile,
  onUpdateProfile,
}: MyProfilePageProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      onUpdateProfile({
        ...studentProfile,
        profilePicture: base64String,
      });
      setIsLoading(false);
    };

    reader.onerror = () => {
      setIsLoading(false);
      alert("Failed to read image file");
    };

    reader.readAsDataURL(file);
  };

  const removeProfilePicture = () => {
    onUpdateProfile({
      ...studentProfile,
      profilePicture: undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-black text-slate-800 tracking-tight border-b border-slate-100 pb-3 mb-6">
          Profile Picture
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Picture Preview */}
          <div className="flex flex-col items-center gap-4">
            <div className="h-32 w-32 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden shadow-sm">
              {studentProfile.profilePicture ? (
                <img
                  src={studentProfile.profilePicture}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-2">
                  <User className="h-8 w-8 text-slate-400" />
                  <span className="text-xs text-slate-400 font-semibold">No picture yet</span>
                </div>
              )}
            </div>

            {/* Upload / Remove Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-bold text-white hover:bg-violet-700 disabled:opacity-50 transition-all"
              >
                <Upload className="h-4 w-4" />
                {isLoading ? "Uploading..." : "Upload Photo"}
              </button>

              {studentProfile.profilePicture && (
                <button
                  type="button"
                  onClick={removeProfilePicture}
                  className="flex items-center gap-2 rounded-lg bg-rose-100 px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-200 transition-all"
                >
                  <X className="h-4 w-4" />
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="flex-1 space-y-3">
            <p className="text-sm font-bold text-slate-800">Upload a professional photo</p>
            <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
              <li>JPEG, PNG, or WebP format</li>
              <li>Maximum 5 MB file size</li>
              <li>Square or portrait orientation recommended</li>
              <li>Professional headshot works best</li>
            </ul>
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 font-medium">
              💡 Your profile picture will be visible to TechNL staff and mentors.
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleProfilePictureChange}
          className="hidden"
          aria-label="Upload profile picture"
        />
      </div>

      {/* Registered Credentials Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-black text-slate-800 tracking-tight border-b border-slate-100 pb-3 mb-6">
          My Registered Credentials
        </h2>

        {latestApp ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-slate-600">
            <div className="space-y-2">
              <p>
                <strong>Filing ID:</strong> {latestApp.id}
              </p>
              <p>
                <strong>First Name:</strong> {latestApp.firstName}
              </p>
              <p>
                <strong>Last Name:</strong> {latestApp.lastName}
              </p>
              <p>
                <strong>School:</strong> {latestApp.school}
              </p>
              <p>
                <strong>Grade Level:</strong> {latestApp.grade}
              </p>
            </div>
            <div className="space-y-2">
              <p>
                <strong>Email Address:</strong> {latestApp.email}
              </p>
              <p>
                <strong>Phone Connection:</strong> {latestApp.phone}
              </p>
              <p>
                <strong>Submitted Resume:</strong> {latestApp.resumeName}
              </p>
              <p>
                <strong>LinkedIn Port:</strong> {latestApp.linkedInUrl || "None entered"}
              </p>
              <p>
                <strong>Portfolio Host:</strong> {latestApp.portfolioUrl || "None entered"}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500">
            No application file submitted yet. Go over to signup form.
          </p>
        )}
      </div>
    </div>
  );
}
