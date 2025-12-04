import TrackWidget from "@/components/widgets/TrackWidget";

export default function TracksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black p-8">
      <h1 className="text-4xl font-bold text-white mb-8">🎤 Tracks</h1>
      <TrackWidget/>
    </div>
  );
}