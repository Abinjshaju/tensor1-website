import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function SetupProfilePage() {
  const { profile, updateProfile, refreshProfile } = useAuth();
  const [authorName, setAuthorName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    document.title = "Setup | Profile | Tensor1";
    return () => {
      document.title = "Tensor1 | AI Engineering";
    };
  }, []);

  useEffect(() => {
    if (profile) {
      setAuthorName(profile.author_name ?? "");
      setContactEmail(profile.contact_email ?? "");
    }
  }, [profile]);

  async function handleProfileSave(e) {
    e.preventDefault();
    setProfileError("");
    setProfileMessage("");
    setProfileSaving(true);
    const { error } = await updateProfile({
      author_name: authorName.trim() || null,
      contact_email: contactEmail.trim() || null,
    });
    setProfileSaving(false);
    if (error) setProfileError(error.message);
    else {
      setProfileMessage("Profile saved.");
      await refreshProfile();
    }
  }

  const inputClass =
    "border border-grid bg-transparent px-4 py-3 font-bold uppercase tracking-tight outline-none focus:ring-2 focus:ring-swiss-red/40 w-full";
  const labelClass = "text-xs font-bold uppercase tracking-widest opacity-60";

  return (
    <div className="flex flex-col min-h-0 flex-1">
      <div className="border-b border-grid">
        <div className="swiss-grid">
          <div className="col-span-12 lg:col-span-4 p-8 md:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-grid">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-swiss-red dark:text-swiss-red mb-4 block">
              Setup
            </span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
              Profile
            </h1>
            <p className="mt-6 uppercase tracking-widest text-sm font-bold opacity-60 leading-relaxed max-w-sm">
              Author name and contact email used on blog posts and in the setup header.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-8 p-8 md:p-12 lg:p-16">
            <form onSubmit={handleProfileSave} className="flex flex-col gap-6 max-w-xl">
              <label className="flex flex-col gap-2">
                <span className={labelClass}>Author name</span>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className={inputClass}
                  autoComplete="name"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className={labelClass}>Contact email</span>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className={inputClass}
                  autoComplete="email"
                />
              </label>
              {profileError && (
                <p className="text-sm font-bold uppercase tracking-tight text-swiss-red">{profileError}</p>
              )}
              {profileMessage && (
                <p className="text-sm font-bold uppercase tracking-tight opacity-90">{profileMessage}</p>
              )}
              <button
                type="submit"
                disabled={profileSaving}
                className="self-start px-8 py-4 bg-swiss-black dark:bg-swiss-white text-swiss-white dark:text-swiss-black font-bold uppercase tracking-widest text-sm hover:bg-swiss-red hover:text-swiss-black transition-colors disabled:opacity-40"
              >
                {profileSaving ? "Saving…" : "Save profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
