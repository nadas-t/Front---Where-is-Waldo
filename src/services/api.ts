const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

export type ApiCharacter = {
  id: string;
  name: string;
  imageUrl: string;
};

export type ApiMap = {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  difficulty: string;
  characters: ApiCharacter[];
};

export type ApiSession = {
  id: string;
  mapId: string;
  foundCharacterIds: string[];
  startedAt: string;
  completedAt: string | null;
};

export type ApiGuessResult = {
  found: boolean;
  character: ApiCharacter;
  session: ApiSession;
};

export type ApiScore = {
  id: string;
  playerName: string;
  timeSeconds: number;
  mapId: string;
  sessionId: string;
  createdAt: string;
};

type ApiErrorBody = {
  error?: string;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let message = "Request failed.";

    try {
      const body = (await response.json()) as ApiErrorBody;
      if (body.error) {
        message = body.error;
      }
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export function listMaps() {
  return request<ApiMap[]>("/api/maps");
}

export function getMap(mapId: string) {
  return request<ApiMap>(`/api/maps/${mapId}`);
}

export function createSession(mapId: string) {
  return request<ApiSession>(`/api/maps/${mapId}/sessions`, {
    method: "POST",
  });
}

export function checkGuess({
  mapId,
  sessionId,
  characterId,
  x,
  y,
}: {
  mapId: string;
  sessionId: string;
  characterId: string;
  x: number;
  y: number;
}) {
  return request<ApiGuessResult>(`/api/maps/${mapId}/guesses`, {
    method: "POST",
    body: JSON.stringify({ sessionId, characterId, x, y }),
  });
}

export function listScores(mapId: string) {
  return request<ApiScore[]>(`/api/scores?mapId=${encodeURIComponent(mapId)}`);
}

export function createScore({
  sessionId,
  playerName,
}: {
  sessionId: string;
  playerName: string;
}) {
  return request<ApiScore>("/api/scores", {
    method: "POST",
    body: JSON.stringify({ sessionId, playerName }),
  });
}
