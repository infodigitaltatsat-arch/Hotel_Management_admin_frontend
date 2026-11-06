import api from "./api";

export const getReservationPayments = async(reservationId)=>{
    const response = await api.get(`/payments/${reservationId}`);
    return response.data;
};

export const recordPayment = async(paymentData)=>{
    const response = await api.post('/payments',paymentData);
    return response.data;

};