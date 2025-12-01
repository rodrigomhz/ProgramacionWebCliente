import Image from "next/image";

export default function Home() {
  
    const [selectedArtists, setSelectedArtists] = useState([]);

  const handleArtistSelect = (artist) => {
    setSelectedArtists(prev => {
      // prev = lo que había antes, ejemplo: [{id: 1, name: "Shakira"}]
      const exists = prev.find(pepito => pepito.id === artist.id);
      if (exists) {
        return prev.filter(pepito => pepito.id !== artist.id);
      }
      return [...prev, artist];
    });
  };

  return (
    <ArtistWidget
      artists={artistList}
      selectedItems={selectedArtists}
      onSelect={handleArtistSelect}
    />
  );

}
