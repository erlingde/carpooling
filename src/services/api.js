import axios from 'axios';

const fetchRideRequests = () => {
    try {
        const driversPromise = axios('http://apis.is/rides/samferda-drivers/');
        const passengersPromise = axios('http://apis.is/rides/samferda-passengers/');

        return Promise.all([passengersPromise, driversPromise]);
    } catch (e) {
        console.error(e);
    }

}

const fetchURL = (url) => {
    try {
        const promise = axios(`https://cors.io/?${url}`);
        
        return Promise.resolve(promise);
    } catch (e) {
        console.error(e);
    }
}

export default { fetchRideRequests, fetchURL };