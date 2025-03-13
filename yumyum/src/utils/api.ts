//  hämta API-nyckeln
export const getApiKey = async (): Promise<string | null> => {
  try {
    const response = await fetch("https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/keys", {
      method: "POST",
    });

    const data = await response.json();
    console.log("🔑 API Key hämtad:", data.apiKey);

    localStorage.setItem("apiKey", data.apiKey); //  Sparar rätt nyckel
    return data.apiKey;
  } catch (error) {
    console.error("Fel vid hämtning av API-nyckel:", error);
    return null;
  }
};

// skapa en tenant 
export const createTenant = async (tenantName: string): Promise<string | null> => {
  try {
    const apiKey = localStorage.getItem("apiKey"); //  hämta Api nyckel

    if (!apiKey) {
      console.error(" Ingen API-nyckel tillgänglig!");
      return null;
    }

    const response = await fetch("https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/tenant", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-zocom": apiKey, //  Lägg till Api nyckeln i headers
      },
      body: JSON.stringify({ name: tenantName }),
    });

    const data = await response.json();
    console.log("🏪 Tenant skapad:", data);

    localStorage.setItem("tenantId", data.id); // Sparar tenant-ID
    return data.id;
  } catch (error) {
    console.error(" Fel vid skapande av tenant:", error);
    return null;
  }
};
