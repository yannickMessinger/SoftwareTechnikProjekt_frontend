//interface for DTO's to receive messages from backend. Contains userID, userName and activeLobbyId
export interface IGetPlayerWALResponseDTO {
    userId: number
    userName: string
    activeLobbyId: number
}
