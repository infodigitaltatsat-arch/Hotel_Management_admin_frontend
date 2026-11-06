import api from "./api";

export const getAllReservations = async()=>{
    const response = await api.get('/reservation/staff/all');
    return response.data;
};

export const getReservationById = async (reservationId)=>{
    const response = await api.get(`/reservation/staff/${reservationId}`);
    return response.data;
};

export const checkInGuest = async(reservationId)=>{
    const response = await api.patch(`/reservation/staff/${reservationId}/check-in`);
    return response.data;
};

export const checkOutGuest =async(reservationId)=>{
    const response = await api.patch(`/reservation/staff/${reservationId}/check-out`);
    return response.data;
};

