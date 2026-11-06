import api from "./api";

export const getAllRooms = async ()=>{
    const response = await api.get('/rooms');
    return response.data;
};

export const createRoom = async(roomData)=>{
    const response = await api.post(`/rooms`,roomData);
    return response.data
};

export const updateRoom = async(roomId,roomData)=>{
    const response = await api.patch(`/rooms/${roomId}`,roomData);
    return response.data
}

export const deactivateRoom = async(roomId)=>{
    const response = await api.patch(`/rooms/${roomId}/deactivate`);
    return response.data
};
