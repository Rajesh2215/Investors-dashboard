import api from "../axios";

export interface NavData {
  userId: string;
  nav: number;
  timestamp: string;
  prices?: Array<{
    symbol: string;
    price: number;
  }>;
}

export interface NavHistoryItem {
  _id: string;
  userId: string;
  nav: number;
  timestamp: string;
  __v: number;
}

export interface NavHistoryResponse {
  userId: string;
  history: NavHistoryItem[];
  count: number;
}

export const getCurrentNav = async (): Promise<NavData> => {
  const token = localStorage.getItem("token");
  console.log("🚀 ~ getCurrentNav ~ token:", token);
  const response = await api.get<NavData>("/nav", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("response", response);
  return response.data;
};

export const getNavHistory = async (
  limit: number = 10,
): Promise<NavHistoryResponse> => {
  const token = localStorage.getItem("token");
  const response = await api.get<NavHistoryResponse>(
    `/nav/history?limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export const streamNavUpdates = (
  userId: string,
  callback: (data: NavData) => void,
) => {
  const token = localStorage.getItem("token");
  
  // Since EventSource doesn't support headers, we'll use fetch with streaming
  const controller = new AbortController();
  
  const streamNavUpdatesWithFetch = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/nav/stream/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "nav") {
                callback(data);
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("NAV stream error:", error);
        // Retry connection after 5 seconds
        setTimeout(streamNavUpdatesWithFetch, 5000);
      }
    }
  };

  streamNavUpdatesWithFetch();

  return {
    close: () => controller.abort()
  };
};
